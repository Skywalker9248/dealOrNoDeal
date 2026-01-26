import axiosInstance from "./axios";

// Session API endpoints
export const sessionApi = {
  createSession: () => axiosInstance.post("/session/create"),
  getSession: (sessionId: string) =>
    axiosInstance.get(`/session/get?id=${sessionId}`),
  updateSelectedCase: (sessionId: string, caseNumber: number) =>
    axiosInstance.post("/session/updateSelectedCase", {
      sessionId,
      caseNumber,
    }),
  deleteSession: (sessionId: string) =>
    axiosInstance.post("/session/delete", { sessionId }),
};

// Export the axios instance for custom requests
export { axiosInstance };
export default axiosInstance;
