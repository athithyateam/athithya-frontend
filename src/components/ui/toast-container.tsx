"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";
import { FiAlertTriangle } from "react-icons/fi";
import { useFeedbackStore } from "@/stores/feedback-store";

export function ToastContainer() {
  const { toasts, dismissToast, confirmDialog, closeConfirm } = useFeedbackStore();

  return (
    <>
      {/* GLOBAL TOASTS CONTAINER */}
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

      {/* ATHITHYA GLOBAL CONFIRM MODAL (MATCHING ATHITHYA-APP FEEDBACKCONTEXT) */}
      <AnimatePresence>
        {confirmDialog && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                confirmDialog.onCancel?.();
                closeConfirm();
              }}
              className="absolute inset-0 bg-neutral-900/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 p-8 text-center dark:bg-neutral-900 transition-colors"
            >
              <div className="w-20 h-20 bg-yellow-50 dark:bg-yellow-950/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiAlertTriangle size={40} className="text-yellow-500" />
              </div>

              <h3 className="text-2xl font-black text-neutral-900 uppercase tracking-tighter mb-2 dark:text-neutral-100 transition-colors">
                {confirmDialog.title || "Confirm Action"}
              </h3>
              <p className="text-neutral-500 font-medium leading-relaxed mb-8 dark:text-neutral-400 text-sm transition-colors">
                {confirmDialog.message}
              </p>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    confirmDialog.onCancel?.();
                    closeConfirm();
                  }}
                  className="flex-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-800 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-200 font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-sm"
                >
                  {confirmDialog.cancelText || "No"}
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const fn = confirmDialog.onConfirm;
                    closeConfirm();
                    if (fn) await fn();
                  }}
                  className="flex-1 bg-[#C59A2F] hover:bg-[#b38a28] text-white font-bold py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all cursor-pointer shadow-md"
                >
                  {confirmDialog.confirmText || "Yes"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

