"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { useFeedbackStore } from "@/stores/feedback-store";

export function ToastContainer() {
  const { toasts, dismissToast } = useFeedbackStore();

  return (
    <div className="fixed top-20 right-4 z-[99999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl border bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100 text-xs font-bold"
          >
            {t.type === "success" && <CheckCircle2 size={18} className="text-emerald-500 shrink-0" />}
            {t.type === "error" && <AlertCircle size={18} className="text-red-500 shrink-0" />}
            {(t.type === "info" || t.type === "warning") && (
              <Info size={18} className="text-[#C59A2F] shrink-0" />
            )}
            <span className="flex-1 leading-snug">{t.message}</span>
            <button
              type="button"
              onClick={() => dismissToast(t.id)}
              className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 cursor-pointer"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
