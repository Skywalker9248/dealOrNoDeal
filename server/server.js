require("dotenv").config();

const { Hono } = require("hono");
const { cors } = require("hono/cors");
const { serve } = require("@hono/node-server");
const { Server } = require("socket.io");
const { rateLimiter } = require("hono-rate-limiter");
const sessionRoutes = require("./routes/sessionRoutes");
const sessionController = require("./controllers/sessionController");

const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  process.env.FRONTEND_URL || "https://deal-or-no-deal-five.vercel.app",
];

const app = new Hono();

app.use(
  "*",
  cors({
    origin: ALLOWED_ORIGINS,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    credentials: true,
  }),
);

app.use(
  "/session/create",
  rateLimiter({
    windowMs: 60_000,
    limit: 10,
    keyGenerator: (c) => c.req.header("x-forwarded-for") ?? "unknown",
    message: { error: "Too many sessions created. Please try again later." },
  }),
);

app.onError((err, c) => {
  console.error("Unhandled error:", err.message);
  return c.json({ error: "Internal server error" }, 500);
});

app.notFound((c) => c.json({ error: "Route not found" }, 404));

app.route("/session", sessionRoutes);

const PORT = process.env.PORT || 3001;
const httpServer = serve(
  { fetch: app.fetch, port: PORT },
  (info) => {
    console.log(`SERVER RUNNING ON PORT ${info.port}`);
  },
);

const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  socket.on("join_session", (sessionId) => {
    socket.join(sessionId);
    console.log(`Socket ${socket.id} joined session: ${sessionId}`);

    const currentSession = sessionController.getCurrentSession(sessionId);
    if (currentSession) {
      socket.emit("session_state", currentSession);
    }
  });

  socket.on("leave_session", (sessionId) => {
    socket.leave(sessionId);
    console.log(`Socket ${socket.id} left session: ${sessionId}`);
  });

  socket.on("case_opened", (data) => {
    const { sessionId, caseNumber } = data;
    const currentSession = sessionController.getCurrentSession(sessionId);
    if (currentSession) {
      const caseToOpen = currentSession.cases.find(
        (c) => c.caseNumber === caseNumber,
      );
      if (caseToOpen) {
        caseToOpen.opened = true;
        console.log(`Case ${caseNumber} opened in session ${sessionId}`);
      }
      io.to(sessionId).emit("case_opened", currentSession);

      const openedCount = currentSession.cases.filter((c) => c.opened).length;
      if (openedCount === 25) {
        const selectedCaseValue =
          sessionController.getSelectedCaseValue(sessionId);
        io.to(sessionId).emit("game_ended", {
          type: "all_opened",
          winnings: selectedCaseValue,
          selectedCaseValue: selectedCaseValue,
        });
        console.log(
          `All cases opened in session ${sessionId}. Prize: $${selectedCaseValue}`,
        );
      }
    }
  });

  socket.on("request_banker_offer", async (data) => {
    const { sessionId } = data;
    const offerData = await sessionController.getBankerOffer(sessionId);
    if (offerData) {
      io.to(sessionId).emit("banker_called", offerData);
    }
  });

  socket.on("deal_accepted", (data) => {
    const { sessionId, acceptedOffer } = data;
    const selectedCaseValue = sessionController.getSelectedCaseValue(sessionId);
    io.to(sessionId).emit("game_ended", {
      type: "deal_accepted",
      winnings: acceptedOffer,
      selectedCaseValue: selectedCaseValue,
    });
    console.log(`Deal accepted in session ${sessionId} for $${acceptedOffer}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
