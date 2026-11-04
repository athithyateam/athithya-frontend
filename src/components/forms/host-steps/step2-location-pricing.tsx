"use client";

import React, { useState } from "react";
import { FiPercent, FiTrash2 } from "react-icons/fi";
import { FormSection, ErrorMsg } from "../form-primitives";
import { MapPicker } from "@/components/ui/map-picker";
import { calculatePlatformFee, calculateTotalPrice, getPlatformFeeRate } from "@/lib/pricing";
import { STATE_DISTRICT_MAPPING } from "@/data/location-data";
import type { FormErrors, DiscountTier } from "./types";

const ALL_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DEFAULT_ROUTE_SUGGESTIONS = Array.from(
  new Set([
    ...(STATE_DISTRICT_MAPPING["Uttarakhand"] || []),
    "Rishikesh", "Mussoorie", "Chopta", "Kedarnath", "Badrinath",
    "Joshimath", "Haldwani", "Roorkee", "Rudrapur", "Auli", "Kanatal",
  ])
).filter((c) => c !== "Other");

interface Step2LocationPricingProps {
  latitude: number | null;
  longitude: number | null;
  setCoordinates: (lat: number | null, lng: number | null) => void;
  city: string;
  setCity: (c: string) => void;
  stateField: string;
  setStateField: (s: string) => void;
  address: string;
  setAddress: (a: string) => void;
  startPoint: string;
  setStartPoint: (s: string) => void;
  endPoint: string;
  setEndPoint: (e: string) => void;
  price: string;
  setPrice: (p: string) => void;
  period: string;
  setPeriod: (p: string) => void;
  duration: number | string;
  setDuration: (d: number | string) => void;
  showDiscountInputs: boolean;
  setShowDiscountInputs: (updater: (prev: boolean) => boolean) => void;
  discounts: DiscountTier[];
  handleDiscountChange: (threshold: number, percentage: number | "") => void;
  discountPriceInputs: Record<number, string>;
  setDiscountPriceInputs: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  discountPercentageInputs: Record<number, string>;
  setDiscountPercentageInputs: React.Dispatch<React.SetStateAction<Record<number, string>>>;
  activeDiscountField: number | null;
  setActiveDiscountField: (f: number | null) => void;
  selectedMonths: string[];
  toggleMonth: (m: string) => void;
  errors: FormErrors;
  clearError: (field: string) => void;
}

export function Step2LocationPricing({
  latitude,
  longitude,
  setCoordinates,
  city,
  setCity,
  stateField,
  setStateField,
  address,
  setAddress,
  startPoint,
  setStartPoint,
  endPoint,
  setEndPoint,
  price,
  setPrice,
  period,
  setPeriod,
  duration,
  setDuration,
  showDiscountInputs,
  setShowDiscountInputs,
  discounts,
  handleDiscountChange,
  discountPriceInputs,
  setDiscountPriceInputs,
  discountPercentageInputs,
  setDiscountPercentageInputs,
  activeDiscountField,
  setActiveDiscountField,
  selectedMonths,
  toggleMonth,
  errors,
  clearError,
}: Step2LocationPricingProps) {
  const [showStartSuggestions, setShowStartSuggestions] = useState(false);
  const [showEndSuggestions, setShowEndSuggestions] = useState(false);

  const routeSuggestions = Array.from(
    new Set([city.trim(), ...DEFAULT_ROUTE_SUGGESTIONS].filter(Boolean))
  );

  const basePriceNum = Number(price) || 0;
  const platformFeeRate = getPlatformFeeRate(basePriceNum);
  const platformFee = calculatePlatformFee(basePriceNum);
  const totalGuestPrice = calculateTotalPrice(basePriceNum);

  return (
    <div className="space-y-5">
      {/* Location Map Section */}
      <FormSection title="Location (Pin on Map) *">
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
          Click or tap on the map to pin the exact meeting or experience location.
        </p>

        <MapPicker
          value={
            latitude && longitude
              ? { lat: latitude, lng: longitude, city, state: stateField, address }
              : undefined
          }
          onChange={(loc) => {
            setCoordinates(loc.lat, loc.lng);
            if (loc.city) setCity(loc.city);
            if (loc.state) setStateField(loc.state);
            if (loc.address) setAddress(loc.address);
            if (errors.location) clearError("location");
          }}
        />
        <ErrorMsg error={errors.location} />

        {/* Address */}
        <div className="mt-4">
          <label className="text-xs font-bold block mb-1">
            Specific Location / Address *
          </label>
          <textarea
            rows={2}
            value={address}
            onChange={(e) => {
              setAddress(e.target.value);
              if (errors.address) clearError("address");
            }}
            className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:border-[#C59A2F] outline-none"
            placeholder="Address or meeting landmark..."
          />
          <ErrorMsg error={errors.address} />
        </div>

        {/* Route Details */}
        <div className="mt-4 border border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl p-4 bg-neutral-50/50 dark:bg-neutral-800/20 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-wider text-[#C59A2F]">
            Route Details
          </h4>
          <p className="text-[11px] text-neutral-400">
            Specify starting and ending points if this experience involves travel between locations.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <label className="text-xs font-bold block mb-1">Starting Point *</label>
              <input
                value={startPoint}
                autoComplete="off"
                onFocus={() => setShowStartSuggestions(true)}
                onBlur={() => setTimeout(() => setShowStartSuggestions(false), 200)}
                onChange={(e) => {
                  setStartPoint(e.target.value);
                  setShowStartSuggestions(true);
                  if (errors.startPoint) clearError("startPoint");
                }}
                placeholder="e.g. Dehradun"
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:border-[#C59A2F] outline-none"
              />
              {showStartSuggestions && (
                <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl overflow-hidden max-h-52 overflow-y-auto">
                  {routeSuggestions
                    .filter(
                      (s) =>
                        !startPoint.trim() ||
                        (s.toLowerCase().includes(startPoint.toLowerCase()) &&
                          s.toLowerCase() !== startPoint.toLowerCase())
                    )
                    .map((s) => (
                      <li
                        key={s}
                        onMouseDown={() => {
                          setStartPoint(s);
                          setShowStartSuggestions(false);
                          if (errors.startPoint) clearError("startPoint");
                        }}
                        className="px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-[#FFF9EC] dark:hover:bg-neutral-800 cursor-pointer border-b border-neutral-100 dark:border-neutral-800 last:border-0 transition-colors"
                      >
                        {s}
                      </li>
                    ))}
                </ul>
              )}
              <ErrorMsg error={errors.startPoint} />
            </div>

            <div className="relative">
              <label className="text-xs font-bold block mb-1">Ending Point *</label>
              <input
                value={endPoint}
                autoComplete="off"
                onFocus={() => setShowEndSuggestions(true)}
                onBlur={() => setTimeout(() => setShowEndSuggestions(false), 200)}
                onChange={(e) => {
                  setEndPoint(e.target.value);
                  setShowEndSuggestions(true);
                  if (errors.endPoint) clearError("endPoint");
                }}
                placeholder="e.g. Rishikesh"
                className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:border-[#C59A2F] outline-none"
              />
              {showEndSuggestions && (
                <ul className="absolute z-50 left-0 right-0 top-full mt-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl overflow-hidden max-h-52 overflow-y-auto">
                  {routeSuggestions
                    .filter(
                      (s) =>
                        !endPoint.trim() ||
                        (s.toLowerCase().includes(endPoint.toLowerCase()) &&
                          s.toLowerCase() !== endPoint.toLowerCase())
                    )
                    .map((s) => (
                      <li
                        key={s}
                        onMouseDown={() => {
                          setEndPoint(s);
                          setShowEndSuggestions(false);
                          if (errors.endPoint) clearError("endPoint");
                        }}
                        className="px-4 py-2.5 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-[#FFF9EC] dark:hover:bg-neutral-800 cursor-pointer border-b border-neutral-100 dark:border-neutral-800 last:border-0 transition-colors"
                      >
                        {s}
                      </li>
                    ))}
                </ul>
              )}
              <ErrorMsg error={errors.endPoint} />
            </div>
          </div>
        </div>
      </FormSection>

      {/* Pricing & Duration Section */}
      <FormSection title="Pricing & Duration *">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <div>
            <label className="text-xs font-bold block mb-1">Price per person (₹) *</label>
            <input
              type="number"
              min={0}
              value={price}
              onChange={(e) => {
                setPrice(e.target.value);
                if (errors.price) clearError("price");
              }}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:border-[#C59A2F] outline-none"
              placeholder="0"
            />
            <ErrorMsg error={errors.price} />
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">Duration Unit</label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:border-[#C59A2F] outline-none"
            >
              <option value="minute">Minute(s)</option>
              <option value="hour">Hour(s)</option>
              <option value="day">Day(s)</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold block mb-1">
              Duration ({period === "minute" ? "Minutes" : period === "day" ? "Days" : "Hours"})
            </label>
            <input
              type="number"
              min={1}
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:border-[#C59A2F] outline-none"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={() => setShowDiscountInputs((v) => !v)}
              className={`w-full py-2.5 rounded-xl border text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer ${
                showDiscountInputs
                  ? "bg-[#C59A2F] text-white border-[#C59A2F] shadow-sm"
                  : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50"
              }`}
            >
              <FiPercent size={14} /> Group Discount
            </button>
          </div>
        </div>

        {/* Group Discounts */}
        {showDiscountInputs && (
          <div className="mt-8 mb-6 p-6 bg-[#fbf6ea]/40 dark:bg-[#C59A2F]/5 rounded-[2rem] border border-[#C59A2F]/20 shadow-sm animate-in fade-in duration-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-sm font-black text-[#C59A2F] uppercase tracking-[0.2em]">
                  Discounting
                </h4>
                <p className="text-xs text-gray-500 italic mt-1 font-medium dark:text-neutral-400">
                  Offer discounted per-person rates for groups of 2 or 3 guests
                </p>
              </div>
              <div className="bg-[#C59A2F]/10 px-3 py-1.5 rounded-lg border border-[#C59A2F]/20">
                <span className="text-xs font-black text-[#C59A2F] uppercase">
                  Base Price: ₹{price || 0}
                </span>
              </div>
            </div>

            <div className="space-y-6">
              {[2, 3].map((personNum) => {
                const existing = discounts.find(
                  (d) => Number(d.threshold) === personNum
                );
                const currentPriceInputValue = discountPriceInputs[personNum] || "";
                const currentPctInputValue = discountPercentageInputs[personNum] || "";

                const handlePriceInput = (val: string) => {
                  setDiscountPriceInputs((prev) => ({ ...prev, [personNum]: val }));
                  if (basePriceNum <= 0) return;
                  if (val === "" || val === null) {
                    setDiscountPercentageInputs((prev) => ({ ...prev, [personNum]: "" }));
                    handleDiscountChange(personNum, "");
                    return;
                  }
                  const discPrice = Number(val);
                  let pct = ((basePriceNum - discPrice) / basePriceNum) * 100;
                  pct = Math.max(0, Math.min(100, pct));
                  setDiscountPercentageInputs((prev) => ({
                    ...prev,
                    [personNum]: Math.round(pct).toString(),
                  }));
                  handleDiscountChange(personNum, Math.round(pct * 100) / 100);
                };

                const handlePercentageInput = (val: string) => {
                  setDiscountPercentageInputs((prev) => ({ ...prev, [personNum]: val }));
                  if (basePriceNum <= 0) return;
                  if (val === "" || val === null) {
                    setDiscountPriceInputs((prev) => ({ ...prev, [personNum]: "" }));
                    handleDiscountChange(personNum, "");
                    return;
                  }
                  let pct = Number(val);
                  pct = Math.max(0, Math.min(100, pct));
                  const derivedPrice = Math.round(basePriceNum * (1 - pct / 100));
                  setDiscountPriceInputs((prev) => ({
                    ...prev,
                    [personNum]: derivedPrice.toString(),
                  }));
                  handleDiscountChange(personNum, pct);
                };

                let priceError = null;
                if (
                  currentPriceInputValue !== "" &&
                  basePriceNum > 0 &&
                  Number(currentPriceInputValue) >= basePriceNum
                ) {
                  priceError = `Discounted price must be less than ₹${basePriceNum.toLocaleString()}`;
                }

                return (
                  <div
                    key={personNum}
                    className={`p-5 rounded-3xl border shadow-sm relative overflow-hidden group transition-all ${
                      priceError
                        ? "bg-red-50/40 border-red-200 dark:bg-red-950/20"
                        : "bg-white/80 border-[#C59A2F]/10 hover:border-[#C59A2F]/30 dark:bg-neutral-900/60 dark:border-neutral-800"
                    }`}
                  >
                    <div
                      className={`absolute top-0 left-0 w-1 h-full transition-all ${
                        priceError ? "bg-red-400" : "bg-[#C59A2F]/10 group-hover:bg-[#C59A2F]"
                      }`}
                    />

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-black text-neutral-900 uppercase tracking-widest dark:text-neutral-100">
                          Group of {personNum}
                        </span>
                        {existing && !priceError && (
                          <span className="text-[10px] font-black text-[#C59A2F] bg-[#C59A2F]/5 dark:bg-[#C59A2F]/10 px-2.5 py-1 rounded-full uppercase border border-[#C59A2F]/20">
                            ✓ Applied
                          </span>
                        )}
                      </div>
                      {basePriceNum > 0 && (
                        <span className="text-[11px] text-neutral-400 font-bold italic">
                          Standard: ₹{basePriceNum.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                      <div>
                        <label className="text-[11px] text-[#C59A2F] font-black uppercase mb-1.5 block tracking-tight">
                          Price After Discount (₹)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-bold">
                            ₹
                          </span>
                          <input
                            type="number"
                            placeholder="0"
                            min="0"
                            max={basePriceNum > 0 ? basePriceNum - 1 : undefined}
                            value={currentPriceInputValue}
                            onFocus={() => setActiveDiscountField(personNum)}
                            onBlur={() => setActiveDiscountField(null)}
                            onChange={(e) => handlePriceInput(e.target.value)}
                            className={`w-full bg-white dark:bg-neutral-900 dark:text-neutral-100 rounded-xl border pl-8 pr-3 h-[52px] text-sm font-medium focus:outline-none focus:ring-2 transition-all ${
                              priceError
                                ? "border-red-200 dark:border-red-800 focus:border-red-400"
                                : "border-neutral-200 dark:border-neutral-800 focus:border-[#C59A2F]"
                            }`}
                          />
                        </div>
                        {priceError && (
                          <p className="text-[10px] text-red-500 font-black mt-2 leading-tight">
                            ⚠ {priceError}
                          </p>
                        )}
                      </div>

                      <div className="flex items-end gap-3 w-full">
                        <div className="flex-1">
                          <label className="text-[11px] text-[#C59A2F] font-black uppercase mb-1.5 block tracking-tight">
                            Percentage (%)
                          </label>
                          <div className="relative">
                            <input
                              type="number"
                              placeholder="0"
                              value={currentPctInputValue}
                              onFocus={() => setActiveDiscountField(personNum)}
                              onBlur={() => setActiveDiscountField(null)}
                              onChange={(e) => handlePercentageInput(e.target.value)}
                              className="w-full bg-white dark:bg-neutral-900 dark:text-neutral-100 rounded-xl border pr-8 pl-4 h-[52px] text-sm font-medium focus:outline-none focus:ring-2 focus:border-[#C59A2F] border-neutral-200 dark:border-neutral-800 transition-all shadow-sm"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-sm font-black">
                              %
                            </span>
                          </div>
                        </div>

                        <div className="pb-[1px]">
                          {existing ? (
                            <button
                              type="button"
                              onClick={() => {
                                handleDiscountChange(personNum, "");
                                setDiscountPriceInputs((prev) => ({ ...prev, [personNum]: "" }));
                                setDiscountPercentageInputs((prev) => ({
                                  ...prev,
                                  [personNum]: "",
                                }));
                              }}
                              className="h-[52px] w-[52px] flex items-center justify-center text-neutral-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-2xl transition-all border border-transparent hover:border-red-100 cursor-pointer"
                              title="Remove Tier"
                            >
                              <FiTrash2 size={20} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                const val = discountPercentageInputs[personNum];
                                if (val) handlePercentageInput(val);
                              }}
                              className="px-6 h-[52px] flex items-center justify-center bg-[#C59A2F] text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:shadow-md transition-all active:scale-95 whitespace-nowrap cursor-pointer"
                            >
                              Add Discount
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Platform Fee & Total Guest Cost Breakdown */}
        {basePriceNum > 0 && (
          <div className="mt-4 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div>
              <span className="text-neutral-500 dark:text-neutral-400">Host Base:</span>{" "}
              <strong className="text-neutral-900 dark:text-neutral-100 font-bold">₹{basePriceNum}</strong>
              <span className="mx-2 text-neutral-300 dark:text-neutral-600">•</span>
              <span className="text-neutral-500 dark:text-neutral-400">
                Platform Fee ({(platformFeeRate * 100).toFixed(1)}%):
              </span>{" "}
              <strong className="text-[#C59A2F] font-bold">₹{platformFee}</strong>
            </div>
            <div className="text-sm font-black text-neutral-900 dark:text-neutral-100">
              Guest Total: <span className="text-[#C59A2F]">₹{totalGuestPrice}</span> / person
            </div>
          </div>
        )}

        {/* Best Season to Visit */}
        <div className="mt-5">
          <label className="text-xs font-black uppercase tracking-wider text-[#C59A2F] block mb-2">
            Best Season to Visit *
          </label>
          <div className="flex flex-wrap gap-2">
            {ALL_MONTHS.map((m) => {
              const isSelected = selectedMonths.includes(m);
              return (
                <button
                  key={m}
                  type="button"
                  onClick={() => toggleMonth(m)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#C59A2F] text-white shadow-xs"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200"
                  }`}
                >
                  {m}
                </button>
              );
            })}
          </div>
          <ErrorMsg error={errors.season} />
        </div>
      </FormSection>
    </div>
  );
}
