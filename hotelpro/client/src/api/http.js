import axios from "axios";
import { clearSession } from "../utils/auth.js";

// All requests go to /api/... (proxied to Express by Vite in development)
const http = axios.create({
  baseURL: "/api",
});

// Attach the JWT to every request
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If the token is rejected, clear the session and send the user to login
http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== "/login") {
      clearSession();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default http;
