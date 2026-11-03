"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";

const getPlatformFeeRate = (amount: number) => {
  const amt = Number(amount) || 0;
  if (amt < 2000) return 0.05; // 5%
  if (amt <= 5000) return 0.035; // 3.5%
  return 0.02; // 2%
};

interface DiscountItem {
  threshold: number | string;
  percentage: number;
}

interface DiscountInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  discounts: DiscountItem[];
  basePrice: number;
}

export function DiscountInfoModal({
  isOpen,
  onClose,
  discounts = [],
  basePrice = 0,
}: DiscountInfoModalProps) {
  const [activeTab, setActiveTab] = useState(2);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && discounts.length > 0) {
      const availableThresholds = discounts.map((d) => Number(d.threshold));
      if (availableThresholds.includes(2)) setActiveTab(2);
      else if (availableThresholds.includes(3)) setActiveTab(3);
      else if (availableThresholds.length > 0) setActiveTab(availableThresholds[0]);
    }
  }, [isOpen, discounts]);

  if (!isOpen || !mounted) return null;

  const thresholds = [2, 3];

  const modalContent = (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md rounded-[2.5rem] overflow-hidden bg-white dark:bg-neutral-900 shadow-2xl border border-neutral-100 dark:border-neutral-800 transition-colors"
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C59A2F] mb-1">
                Exclusive Offers
              </p>
              <h3 className="text-2xl font-black tracking-tighter uppercase text-neutral-900 dark:text-neutral-100">
                Group Discounts
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="flex gap-2 p-1.5 rounded-2xl mb-8 bg-neutral-100 dark:bg-neutral-800/60">
            {thresholds.map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setActiveTab(num)}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
                  activeTab === num
                    ? "bg-white dark:bg-neutral-700 text-[#C59A2F] shadow-sm scale-[0.98]"
                    : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
                }`}
              >
                For {num} Person
              </button>
            ))}
          </div>

          <div className="space-y-6">
            {(() => {
              const d = discounts.find((item) => Number(item.threshold) === activeTab);
              if (!d) {
                return (
                  <div className="text-center py-8">
                    <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      No discount available for this group size
                    </p>
                  </div>
                );
              }

              // 1. Calculate Base + Fee
              const rate = getPlatformFeeRate(basePrice);
              const totalPerPersonNoDiscount = basePrice * (1 + rate);
              const fee = basePrice * rate;

              // 2. Apply discount ONLY to the Host's Base Price
              const discountedBase = basePrice * (1 - d.percentage / 100);
              const perPersonDiscounted = discountedBase + fee;
              const savingsPerPerson = Math.max(0, totalPerPersonNoDiscount - perPersonDiscounted);
              const totalSavings = savingsPerPerson * activeTab;

              return (
                <div className="rounded-[2rem] p-6 border-2 bg-[#FFF7E6] border-[#C59A2F]/20 dark:bg-neutral-800/40 dark:border-[#C59A2F]/30 transition-colors">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                      Special Price (Inc. Fees)
                    </span>
                    <span className="bg-[#C59A2F] text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                      {Math.round(d.percentage)}% OFF
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2 mb-2 text-neutral-900 dark:text-neutral-100">
                    <span className="text-4xl font-black tracking-tighter">
                      ₹
                      {perPersonDiscounted.toLocaleString("en-IN", {
                        minimumFractionDigits: perPersonDiscounted % 1 !== 0 ? 2 : 0,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                    <span className="text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
                      / person
                    </span>
                  </div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.05em] leading-relaxed text-neutral-600 dark:text-neutral-400">
                    Book for {activeTab} travelers and save ₹
                    {savingsPerPerson.toLocaleString("en-IN", {
                      minimumFractionDigits: savingsPerPerson % 1 !== 0 ? 2 : 0,
                      maximumFractionDigits: 2,
                    })}{" "}
                    per person.
                    <br />
                    Total savings: ₹
                    {totalSavings.toLocaleString("en-IN", {
                      minimumFractionDigits: totalSavings % 1 !== 0 ? 2 : 0,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                </div>
              );
            })()}
          </div>
        </div>

        <div className="p-4 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950/40 flex justify-center">
          <p className="text-[9px] font-bold uppercase tracking-widest text-center text-neutral-400">
            * Discount will be automatically applied when you select {activeTab} travelers
          </p>
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined" ? createPortal(modalContent, document.body) : null;
}

