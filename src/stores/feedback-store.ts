"use client";

import { create } from "zustand";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

interface FeedbackState {
  toasts: ToastItem[];
  showToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
}

export const useFeedbackStore = create<FeedbackState>((set) => ({
  toasts: [],
  showToast: (message, type = "info") => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    set((s) => ({ toasts: [...s.toasts, { id, message, type }] }));
    if (typeof window !== "undefined") {
      setTimeout(() => {
        set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
      }, 3800);
    }
  },
  dismissToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

