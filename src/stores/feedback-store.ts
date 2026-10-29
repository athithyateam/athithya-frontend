"use client";

import { create } from "zustand";

export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
}

export interface ConfirmDialogOptions {
  title?: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface FeedbackState {
  toasts: ToastItem[];
  confirmDialog: ConfirmDialogOptions | null;
  showToast: (message: string, type?: ToastType) => void;
  dismissToast: (id: string) => void;
  showConfirm: (
    titleOrOptions: string | ConfirmDialogOptions,
    message?: string,
    onConfirm?: () => void | Promise<void>,
    onCancel?: () => void,
    options?: { confirmText?: string; cancelText?: string }
  ) => void;
  closeConfirm: () => void;
}

export const useFeedbackStore = create<FeedbackState>((set) => ({
  toasts: [],
  confirmDialog: null,
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
  showConfirm: (titleOrOptions, message, onConfirm, onCancel, options) => {
    if (typeof titleOrOptions === "object") {
      set({ confirmDialog: titleOrOptions });
    } else {
      set({
        confirmDialog: {
          title: titleOrOptions || "Confirm Action",
          message: message || "",
          onConfirm: onConfirm || (() => {}),
          onCancel,
          confirmText: options?.confirmText || "Yes",
          cancelText: options?.cancelText || "No",
        },
      });
    }
  },
  closeConfirm: () => set({ confirmDialog: null }),
}));

