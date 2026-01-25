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

socket.on("case_opened", (data) => {
  const sessionId = data.sessionId;
  const caseNumber = data.caseNumber;
  const currentSession = sessionController.getCurrentSession(sessionId);
  if (currentSession) {
    currentSession.cases[caseNumber].isOpened = true;
    io.to(sessionId).emit("case_opened", currentSession);
  }
});

const PORT = 3001;
server.listen(PORT, () => {
  console.log(`SERVER RUNNING ON PORT ${PORT}`);
});
