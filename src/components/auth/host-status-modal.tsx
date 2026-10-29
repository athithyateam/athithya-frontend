"use client";

import React from "react";
import { Hourglass, Lock, CheckCircle2, XCircle, X } from "lucide-react";

const GOLD = "#d4af37";

export interface HostStatusModalProps {
  status?: "pending_verification" | "pending_approval" | "rejected" | "approved";
  onClose: () => void;
  onAction?: () => void;
}

export function HostStatusModal({ status = "pending_verification", onClose, onAction }: HostStatusModalProps) {
  const config: Record<string, { icon: React.ReactNode; title: string; message: string; button: string; color: string }> = {
    pending_verification: {
      icon: <Lock className="w-10 h-10 text-gray-400" />,
      title: "Action Required",
      message: "To start hosting and adding experiences, you need to complete your profile verification.",
      button: "Verify My Account",
      color: "gray",
    },
    pending_approval: {
      icon: <Hourglass className="w-10 h-10 text-[#d4af37] animate-pulse" />,
      title: "Verification Pending",
      message: "We've received your details! Our team is currently reviewing your application. You'll be notified as soon as it's approved.",
      button: "Got it",
      color: "gold",
    },
    rejected: {
      icon: <XCircle className="w-10 h-10 text-red-500" />,
      title: "Application Rejected",
      message: "Sorry, we couldn't approve your host features at this moment. Please contact support or re-submit your details.",
      button: "Re-submit Details",
      color: "red",
    },
    approved: {
      icon: <CheckCircle2 className="w-10 h-10 text-green-500" />,
      title: "Account Approved",
      message: "Congratulations! Your host account is fully verified. You can now add your amazing experiences.",
      button: "Add Experience",
      color: "green",
    },
  };

  const current = config[status] || config.pending_verification;

  return (
    <div className="fixed inset-0 z-[20000] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative border border-gray-100 dark:border-neutral-800 transition-all flex flex-col p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 p-2 hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-full transition-colors cursor-pointer">
          <X className="w-5 h-5 text-gray-400" />
        </button>
        <div className="w-20 h-20 bg-gray-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6">
          {current.icon}
        </div>
        <h2 className="text-2xl font-bold mb-3 text-black dark:text-white" style={{ color: current.color === "gold" ? GOLD : undefined }}>
          {current.title}
        </h2>
        <p className="text-gray-600 dark:text-neutral-400 mb-8 leading-relaxed">{current.message}</p>
        <button
          onClick={() => (onAction ? onAction() : onClose())}
          className="w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-[0.98] hover:shadow-xl cursor-pointer"
          style={{ backgroundColor: GOLD }}
        >
          {current.button}
        </button>
      </div>
    </div>
  );
}

export default HostStatusModal;
