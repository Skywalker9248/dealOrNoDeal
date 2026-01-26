import axiosInstance from './axios';

// Session API endpoints
export const sessionApi = {
  createSession: () => axiosInstance.post('/session/create'),
  getSession: (sessionId: string) => axiosInstance.get(`/session/${sessionId}`),
  updateSelectedCase: (sessionId: string, caseNumber: number) => axiosInstance.post('/session/updateSelectedCase', { sessionId, caseNumber }),
};

// Export the axios instance for custom requests
export { axiosInstance };
export default axiosInstance;
