import axios from "axios";
import { activeSession, removeSession, clearActive, markLoggedOut } from "@/lib/authStorage";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
    "Cache-Control": "no-store, no-cache, must-revalidate",
    Pragma: "no-cache",
  },
});

api.interceptors.request.use((config) => {
  const session = activeSession();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const session = activeSession();
      if (session?.id) {
        removeSession(session.id);
      }
      clearActive();
      markLoggedOut();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
