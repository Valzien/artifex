import { create } from "zustand";
import api from "@/lib/axios";
import {
  activeSession,
  saveSession,
  removeSession,
  setActiveId,
  clearActive,
  markLoggedOut,
  clearLoggedOut,
} from "@/lib/authStorage";

const initial = activeSession();

const useAuthStore = create((set) => ({
  user: initial?.user ?? null,
  role: initial?.user?.role ?? "guest",
  isAuthenticated: !!initial?.token,

  login: async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    saveSession(data.user.id, { token: data.token, user: data.user });
    setActiveId(data.user.id);
    clearLoggedOut();
    set({
      user: data.user,
      role: data.user.role,
      isAuthenticated: true,
    });
    return data.user;
  },

  register: async ({ name, email, password, password_confirmation, role }) => {
    const { data } = await api.post("/auth/register", {
      name,
      email,
      password,
      password_confirmation,
      role,
    });
    saveSession(data.user.id, { token: data.token, user: data.user });
    setActiveId(data.user.id);
    clearLoggedOut();
    set({
      user: data.user,
      role: data.user.role,
      isAuthenticated: true,
    });
    return data.user;
  },

  logout: async () => {
    const session = activeSession();
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore error — clear local state anyway
    }
    if (session?.id) {
      removeSession(session.id);
    }
    clearActive();
    markLoggedOut();
    set({
      user: null,
      role: "guest",
      isAuthenticated: false,
    });
  },

  fetchUser: async () => {
    try {
      const { data } = await api.get("/auth/user");
      const session = activeSession();
      if (session?.id) {
        saveSession(session.id, { token: session.token, user: data.user });
      }
      set({
        user: data.user,
        role: data.user.role,
        isAuthenticated: true,
      });
    } catch {
      clearActive();
      markLoggedOut();
      set({
        user: null,
        role: "guest",
        isAuthenticated: false,
      });
    }
  },
}));

export default useAuthStore;
