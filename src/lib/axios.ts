import axios from "axios";
import { API_BASE_URL } from "../config/api.config";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

apiClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("salon_pos_token") ||
      sessionStorage.getItem("salon_pos_token");

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const isAuthRoute =
        window.location.pathname === "/" ||
        window.location.pathname === "/login" ||
        window.location.pathname === "/register";
      if (!isAuthRoute) {
        localStorage.removeItem("salon_pos_token");
        localStorage.removeItem("salon_pos_user");
        sessionStorage.removeItem("salon_pos_token");
        sessionStorage.removeItem("salon_pos_user");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

