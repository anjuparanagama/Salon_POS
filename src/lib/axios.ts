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

    // When payload is FormData, remove Content-Type so browser/axios sets multipart/form-data with boundary
    if (config.data instanceof FormData && config.headers) {
      if (typeof (config.headers as any).delete === "function") {
        (config.headers as any).delete("Content-Type");
      } else {
        delete (config.headers as Record<string, unknown>)["Content-Type"];
      }
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

