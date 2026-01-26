import axios, {
  type AxiosInstance,
  AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";

// Base URL for API requests
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

// Create axios instance with default config
const axiosInstance: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // You can add auth tokens here if needed
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    console.error("[API Request Error]", error);
    return Promise.reject(error);
  },
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`[API Response] ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // Server responded with error status
      console.error(`[API Error] ${error.response.status}: ${error.message}`);
    } else if (error.request) {
      // Request made but no response received
      console.error("[API Error] No response received:", error.message);
    } else {
      // Error in request setup
      console.error("[API Error] Request setup failed:", error.message);
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
