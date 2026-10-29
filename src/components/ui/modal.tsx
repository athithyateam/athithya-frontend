"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Trash2, Tag, X } from "lucide-react";
import { calculateTotalPrice, formatPrice } from "@/lib/pricing";

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidthClass?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidthClass = "max-w-md" }: BaseModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            className={`relative z-10 w-full ${maxWidthClass} rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-2xl p-6 sm:p-8 text-left`}
          >
            <button type="button" onClick={onClose} className="absolute top-5 right-5 p-2 rounded-full text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer" aria-label="Close">
              <X size={18} />
            </button>
            {title && <h3 className="text-lg sm:text-xl font-black text-neutral-900 dark:text-neutral-100 mb-4 pr-8">{title}</h3>}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function ConfirmModal({
  isOpen, onClose, onConfirm, title = "Confirm Action", message, confirmLabel = "Yes", cancelLabel = "No",
}: {
  isOpen: boolean; onClose: () => void; onConfirm: () => void; title?: string; message: string; confirmLabel?: string; cancelLabel?: string;
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-sm">
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={24} className="text-red-500" />
        </div>
        <h3 className="text-lg font-black text-neutral-900 dark:text-neutral-100 uppercase tracking-tight mb-2">{title}</h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">{message}</p>
        <div className="flex gap-3">
          <button type="button" onClick={onClose} className="flex-1 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 transition cursor-pointer">
            {cancelLabel}
          </button>
          <button type="button" onClick={() => { onClose(); onConfirm(); }} className="flex-1 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 transition shadow-lg cursor-pointer">
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function SuccessModal({ isOpen, onClose, title = "Success!", message }: { isOpen: boolean; onClose: () => void; title?: string; message: string }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidthClass="max-w-sm">
      <div className="text-center">
        <div className="w-16 h-16 bg-green-50 dark:bg-green-950/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 size={36} className="text-green-500" />
        </div>
        <h3 className="text-xl font-black text-neutral-900 dark:text-neutral-100 uppercase tracking-tight mb-2">{title}</h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 leading-relaxed">{message}</p>
        <button type="button" onClick={onClose} className="w-full bg-[#C59A2F] hover:bg-[#A67F26] text-white font-black py-3.5 rounded-2xl uppercase tracking-widest text-xs transition shadow-md cursor-pointer">
          Great, thanks!
        </button>
      </div>
    </Modal>
  );
}

export { DiscountInfoModal } from "./discount-info-modal";
