import { io, Socket } from "socket.io-client";

// Socket URL - same as API URL
const SOCKET_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Create socket instance
const socket: Socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket", "polling"], // Try websocket first, then polling
});

// Join a session channel
export const joinSession = (sessionId: string): void => {
  if (!socket.connected) {
    socket.connect();
  }
  socket.emit("join_session", sessionId);
  console.log(`[Socket] Joining session: ${sessionId}`);
};

// Leave a session channel
export const leaveSession = (sessionId: string): void => {
  socket.emit("leave_session", sessionId);
  console.log(`[Socket] Leaving session: ${sessionId}`);
};

// Emit case opened event
export const emitCaseOpened = (sessionId: string, caseNumber: number): void => {
  socket.emit("case_opened", { sessionId, caseNumber });
  console.log(`[Socket] Case opened: ${caseNumber} in session: ${sessionId}`);
};

// Listen for case opened event
export const onCaseOpened = (callback: (data: any) => void): void => {
  socket.on("case_opened", callback);
};

// Listen for session state
export const onSessionState = (callback: (data: any) => void): void => {
  socket.on("session_state", callback);
};

// Remove case opened listener
export const offCaseOpened = (): void => {
  socket.off("case_opened");
};

// Remove session state listener
export const offSessionState = (): void => {
  socket.off("session_state");
};

// Disconnect socket
export const disconnectSocket = (): void => {
  if (socket.connected) {
    socket.disconnect();
    console.log("[Socket] Disconnected");
  }
};

// Emit deal accepted event
export const emitDealAccepted = (sessionId: string, acceptedOffer: number): void => {
  socket.emit("deal_accepted", { sessionId, acceptedOffer });
  console.log(`[Socket] Deal accepted: $${acceptedOffer} in session: ${sessionId}`);
};

// Listen for game ended event
export const onGameEnded = (callback: (data: any) => void): void => {
  socket.on("game_ended", callback);
};

// Remove game ended listener
export const offGameEnded = (): void => {
  socket.off("game_ended");
};

// Export socket instance for advanced usage
export { socket };
