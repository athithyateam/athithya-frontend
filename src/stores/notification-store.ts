"use client";

import { create } from "zustand";
import {
  getNotifications as getNotificationsApi,
  markAsRead as markNotificationAsReadApi,
  markAllRead as markAllNotificationsAsReadApi,
  clearAllNotifications as clearAllNotificationsApi,
} from "@/lib/api/chat-and-notifications-api";

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  status?: string;
  link?: string;
  createdAt: string;
  sender?: {
    _id?: string;
    firstname?: string;
    lastname?: string;
    avatar?: { url?: string };
  };
  metadata?: {
    userId?: string;
    bookingId?: string;
    postId?: string;
    scheduleId?: string;
    [key: string]: any;
  };
}

interface NotificationState {
  notifications: NotificationItem[];
  unreadCount: number;
  loading: boolean;
  setNotifications: (updater: NotificationItem[] | ((prev: NotificationItem[]) => NotificationItem[])) => void;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  clearNotifications: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  setNotifications: (updater) => {
    const next = typeof updater === "function" ? updater(get().notifications) : updater;
    const unreadCount = next.filter((n) => !n.read).length;
    set({ notifications: next, unreadCount });
  },

  fetchNotifications: async () => {
    if (typeof window !== "undefined" && !localStorage.getItem("auth_token")) return;
    set({ loading: true });
    try {
      const res = await getNotificationsApi();
      const list: NotificationItem[] = Array.isArray(res?.notifications)
        ? res.notifications
        : Array.isArray(res?.data?.notifications)
        ? res.data.notifications
        : Array.isArray(res?.data)
        ? res.data
        : [];
      set({
        notifications: list,
        unreadCount: list.filter((n) => !n.read).length,
        loading: false,
      });
    } catch {
      set({ loading: false });
    }
  },

  markAsRead: async (id) => {
    const updated = get().notifications.map((n) => (n._id === id ? { ...n, read: true } : n));
    set({ notifications: updated, unreadCount: updated.filter((n) => !n.read).length });
    try {
      await markNotificationAsReadApi(id);
    } catch {
      // Keep optimistic state
    }
  },

  markAllAsRead: async () => {
    const updated = get().notifications.map((n) => ({ ...n, read: true }));
    set({ notifications: updated, unreadCount: 0 });
    try {
      await markAllNotificationsAsReadApi();
    } catch {
      // Keep optimistic state
    }
  },

  clearNotifications: async () => {
    set({ notifications: [], unreadCount: 0 });
    try {
      await clearAllNotificationsApi();
    } catch {
      // Keep optimistic state
    }
  },
}));
