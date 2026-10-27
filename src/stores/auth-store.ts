"use client";

import { create } from "zustand";

export interface UserSession {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  role: "guest" | "host" | "admin";
  avatar?: string;
  hostStatus?: "pending_verification" | "approved" | "rejected";
}

interface AuthState {
  user: UserSession | null;
  isAuthModalOpen: boolean;
  authModalTab: "login" | "register";
  authRole: "guest" | "host";
  openAuthModal: (tab?: "login" | "register", role?: "guest" | "host") => void;
  closeAuthModal: () => void;
  setUser: (user: UserSession | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Read initial user session from localStorage safely
  let initialUser: UserSession | null = null;
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("auth_user");
      if (stored) initialUser = JSON.parse(stored);
    } catch {
      initialUser = null;
    }
  }

  return {
    user: initialUser,
    isAuthModalOpen: false,
    authModalTab: "login",
    authRole: "guest",

    openAuthModal: (tab = "login", role = "guest") =>
      set({ isAuthModalOpen: true, authModalTab: tab, authRole: role }),

    closeAuthModal: () =>
      set({ isAuthModalOpen: false }),

    setUser: (user) => {
      if (typeof window !== "undefined") {
        if (user) {
          localStorage.setItem("auth_user", JSON.stringify(user));
          localStorage.setItem("auth_token", "sample_jwt_token_" + user.id);
        } else {
          localStorage.removeItem("auth_user");
          localStorage.removeItem("auth_token");
        }
      }
      set({ user, isAuthModalOpen: false });
    },

    logout: () => {
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_token");
        sessionStorage.clear();
      }
      set({ user: null });
    },
  };
});
