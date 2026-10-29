"use client";

import { create } from "zustand";
import { getUserDetailsApi, logoutApi } from "@/lib/api/auth-api";

export interface UserSession {
  id: string;
  _id?: string;
  firstname: string;
  lastname: string;
  email: string;
  role: "guest" | "host" | "admin";
  avatar?: string | { url?: string; public_id?: string };
  profilePic?: string;
  hostStatus?: "pending_verification" | "pending_approval" | "approved" | "rejected";
  savedPosts?: any[];
  verifyBadge?: { enabled?: boolean };
  profileTheme?: string;
  bio?: string;
  phone?: string;
  city?: string;
  district?: string;
  state?: string;
  [key: string]: any;
}

interface AuthState {
  user: UserSession | null;
  loading: boolean;
  isAuthModalOpen: boolean;
  authModalTab: "login" | "register";
  authRole: "guest" | "host";
  showHostStatusModal: boolean;
  showVerificationModal: boolean;
  openAuthModal: (tab?: "login" | "register", role?: "guest" | "host") => void;
  closeAuthModal: () => void;
  setShowHostStatusModal: (show: boolean) => void;
  setShowVerificationModal: (show: boolean) => void;
  setUser: (user: UserSession | null, token?: string) => void;
  fetchUser: () => Promise<UserSession | null>;
  logout: () => Promise<void>;
}

function normalizeUser(raw: any): UserSession | null {
  if (!raw || typeof raw !== "object") return null;
  const id = String(raw._id || raw.id || "");
  if (!id) return null;
  const role = raw.role || "guest";
  const hostStatus = role === "host" && !raw.hostStatus ? "pending_verification" : raw.hostStatus;
  return {
    ...raw,
    id,
    _id: raw._id || id,
    firstname: raw.firstname || raw.name?.split(" ")[0] || "User",
    lastname: raw.lastname || raw.name?.split(" ").slice(1).join(" ") || "",
    email: raw.email || "",
    role,
    hostStatus,
  };
}

export const useAuthStore = create<AuthState>((set) => {
  let initialUser: UserSession | null = null;
  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("auth_user");
      if (stored) initialUser = normalizeUser(JSON.parse(stored));
    } catch {
      initialUser = null;
    }
  }

  return {
    user: initialUser,
    loading: false,
    isAuthModalOpen: false,
    authModalTab: "login",
    authRole: "guest",
    showHostStatusModal: false,
    showVerificationModal: false,

    openAuthModal: (tab = "login", role = "guest") =>
      set({ isAuthModalOpen: true, authModalTab: tab, authRole: role }),

    closeAuthModal: () => set({ isAuthModalOpen: false }),

    setShowHostStatusModal: (show) => set({ showHostStatusModal: show }),

    setShowVerificationModal: (show) => set({ showVerificationModal: show }),

    setUser: (rawUser, token) => {
      const normalized = normalizeUser(rawUser);
      if (typeof window !== "undefined") {
        if (normalized) {
          localStorage.setItem("auth_user", JSON.stringify(normalized));
          if (token) localStorage.setItem("auth_token", token);
        } else {
          localStorage.removeItem("auth_user");
          localStorage.removeItem("auth_token");
        }
      }
      set({ user: normalized, isAuthModalOpen: false });
    },

    fetchUser: async () => {
      set({ loading: true });
      try {
        const res = await getUserDetailsApi();
        const rawUser = res?.data?.data?.user || res?.data?.user;
        if (res?.ok && rawUser) {
          const normalized = normalizeUser(rawUser);
          if (typeof window !== "undefined" && normalized) {
            localStorage.setItem("auth_user", JSON.stringify(normalized));
          }
          set({ user: normalized, loading: false });
          return normalized;
        }
        if (typeof window !== "undefined" && !localStorage.getItem("auth_token")) {
          localStorage.removeItem("auth_user");
          set({ user: null, loading: false });
        } else {
          set({ loading: false });
        }
        return null;
      } catch {
        set({ loading: false });
        return null;
      }
    },

    logout: async () => {
      try {
        await logoutApi();
      } catch {
        // Ignore network errors during logout
      } finally {
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_user");
          localStorage.removeItem("auth_token");
          sessionStorage.clear();
        }
        set({ user: null, loading: false, showHostStatusModal: false, showVerificationModal: false });
      }
    },
  };
});
