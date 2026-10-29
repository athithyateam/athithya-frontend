"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Info, Plus, Zap, ArrowRight, CheckCircle2, Clock } from "lucide-react";

export function SuccessModal({
  isOpen,
  isSchedule,
  postTitle,
  onClose,
}: {
  isOpen: boolean;
  isSchedule?: boolean;
  postTitle: string;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-neutral-900/60 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white rounded-[2.5rem] w-full max-w-sm overflow-hidden shadow-2xl relative z-10 p-10 text-center dark:bg-neutral-900"
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-neutral-400 hover:text-neutral-600 cursor-pointer"
            >
              <X size={20} />
            </button>
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                isSchedule ? "bg-amber-50 text-[#C59A2F]" : "bg-green-50 text-green-500"
              }`}
            >
              {isSchedule ? <Clock size={32} /> : <CheckCircle2 size={32} />}
            </div>
            <h3 className="text-2xl font-black text-neutral-900 uppercase tracking-tight mb-3 dark:text-neutral-100">
              {isSchedule ? "Planning Started!" : "You're All Set!"}
            </h3>
            <p className="text-neutral-500 font-bold text-sm leading-relaxed dark:text-neutral-400">
              Your {isSchedule ? "schedule" : "booking"} for{" "}
              <span className="text-neutral-900 dark:text-neutral-100">&ldquo;{postTitle}&rdquo;</span>{" "}
              has been{" "}
              <span className={isSchedule ? "text-[#C59A2F]" : "text-green-600"}>
                {isSchedule ? "Created" : "Successfully Confirmed"}
              </span>
              .
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

export function BreakdownModal({
  isOpen,
  onClose,
  baseAmount,
  platformFee,
  appliedDiscount,
  totalAmount,
  onConfirm,
  walletBalance = 0,
  useWallet = false,
  setUseWallet,
  submitting = false,
}: {
  isOpen: boolean;
  onClose: () => void;
  baseAmount: number;
  platformFee: number;
  appliedDiscount?: { label: string; percentage: number; discountAmount: number } | null;
  totalAmount: number;
  onConfirm: () => void;
  walletBalance?: number;
  useWallet?: boolean;
  setUseWallet: (v: boolean) => void;
  submitting?: boolean;
}) {
  const maxWalletUsable = Math.max(0, totalAmount - platformFee);
  const walletAmountUsed = useWallet ? Math.min(walletBalance, maxWalletUsable) : 0;
  const payableAmount = Math.max(platformFee, totalAmount - walletAmountUsed);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[10000] flex items-end md:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          onClick={() => !submitting && onClose()}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            className="bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl relative dark:bg-neutral-900 p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-neutral-900 dark:text-neutral-100">
                Price Summary
              </h3>
              <button
                onClick={() => !submitting && onClose()}
                disabled={submitting}
                className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="font-bold text-neutral-600 dark:text-neutral-400">Host Price</span>
                <span className="font-black text-neutral-900 dark:text-neutral-100">
                  ₹{Math.round(baseAmount).toLocaleString("en-IN")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-neutral-600 dark:text-neutral-400">Platform Fee</span>
                <span className="font-black text-neutral-900 dark:text-neutral-100">
                  ₹{Math.round(platformFee).toLocaleString("en-IN")}
                </span>
              </div>

              {appliedDiscount && (
                <div className="flex justify-between text-[#C59A2F] border-t border-neutral-100 dark:border-neutral-800 pt-3">
                  <span className="font-bold">
                    {appliedDiscount.label} ({Math.round(appliedDiscount.percentage)}%)
                  </span>
                  <span className="font-black">
                    -₹{Math.round(appliedDiscount.discountAmount).toLocaleString("en-IN")}
                  </span>
                </div>
              )}

              {walletBalance > 0 && (
                <div className="flex justify-between items-center border-t border-neutral-100 dark:border-neutral-800 pt-3">
                  <span className="font-bold">Wallet ({walletBalance} Credits)</span>
                  <button
                    type="button"
                    onClick={() => setUseWallet(!useWallet)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                      useWallet ? "bg-green-500 text-white" : "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
                    }`}
                  >
                    {useWallet ? <CheckCircle2 size={15} /> : <Plus size={15} />}
                  </button>
                </div>
              )}

              <div className="border-t border-neutral-200 dark:border-neutral-800 pt-3 flex justify-between items-center">
                <span className="text-base font-black">Net Payable</span>
                <span className="text-xl font-black text-[#C59A2F]">
                  ₹{Math.round(payableAmount).toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            <button
              onClick={onConfirm}
              disabled={submitting}
              className="w-full mt-8 py-4 text-white font-black uppercase tracking-wider text-sm rounded-2xl bg-[#C59A2F] hover:bg-neutral-900 transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg cursor-pointer"
            >
              <Zap size={16} />
              <span>{submitting ? "Processing..." : "Confirm & Book"}</span>
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

