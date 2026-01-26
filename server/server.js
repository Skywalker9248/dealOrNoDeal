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
      currentSession.cases[caseNumber].isOpened = true;
      // Broadcast to everyone in the session channel (including sender)
      io.to(sessionId).emit("case_opened", currentSession);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
