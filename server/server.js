require("dotenv").config();

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const sessionRoutes = require("./routes/sessionRoutes");
const sessionController = require("./controllers/sessionController");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/session", sessionRoutes);
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a session channel/room
  socket.on("join_session", (sessionId) => {
    socket.join(sessionId);
    console.log(`Socket ${socket.id} joined session: ${sessionId}`);

    // Send current session state to the newly joined client
    const currentSession = sessionController.getCurrentSession(sessionId);
    if (currentSession) {
      socket.emit("session_state", currentSession);
    }
  });

  // Leave a session channel/room
  socket.on("leave_session", (sessionId) => {
    socket.leave(sessionId);
    console.log(`Socket ${socket.id} left session: ${sessionId}`);
  });

  // Handle case opened event - broadcast to all in the session channel
  socket.on("case_opened", (data) => {
    const { sessionId, caseNumber } = data;
    const currentSession = sessionController.getCurrentSession(sessionId);
    if (currentSession) {
      // Find the case by caseNumber and mark it as opened
      const caseToOpen = currentSession.cases.find(
        (c) => c.caseNumber === caseNumber,
      );
      if (caseToOpen) {
        caseToOpen.opened = true;
        console.log(`Case ${caseNumber} opened in session ${sessionId}`);
      }
      // Broadcast to everyone in the session channel (including sender)
      io.to(sessionId).emit("case_opened", currentSession);

      // Check if all 25 cases are opened (excluding selected case)
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
      // Send the offer ONLY to the person who requested it
      io.to(sessionId).emit("banker_called", offerData);
    }
  });

  // Handle deal accepted - user accepts banker's offer
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

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
