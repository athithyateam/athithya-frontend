"use client";

import React from "react";
import { FiTrash2 } from "react-icons/fi";
import { FormSection, ErrorMsg, InlineAdder } from "../form-primitives";
import type { FormErrors } from "./types";

interface Step3RulesAmenitiesProps {
  privacyPolicies: string[];
  setPrivacyPolicies: React.Dispatch<React.SetStateAction<string[]>>;
  customRule: string;
  setCustomRule: (r: string) => void;
  addCustomRule: () => void;
  amenities: string[];
  setAmenities: React.Dispatch<React.SetStateAction<string[]>>;
  errors: FormErrors;
  clearError: (field: string) => void;
}

export function Step3RulesAmenities({
  privacyPolicies,
  setPrivacyPolicies,
  customRule,
  setCustomRule,
  addCustomRule,
  amenities,
  setAmenities,
  errors,
  clearError,
}: Step3RulesAmenitiesProps) {
  return (
    <div className="space-y-5">
      {/* Host Rules Section */}
      <FormSection title="Host Rules *">
        <p className="text-xs text-neutral-400 mb-3 font-semibold">
          Set clear guidelines for your guests (e.g. Valid government ID required, No smoking inside tents, Respect local wildlife).
        </p>

        <div className="flex gap-2 mb-3">
          <input
            value={customRule}
            onChange={(e) => setCustomRule(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomRule())}
            placeholder="Type a host rule and press Enter..."
            className="flex-1 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-2.5 text-sm text-neutral-900 dark:text-neutral-100 focus:border-[#C59A2F] outline-none"
          />
          <button
            type="button"
            onClick={addCustomRule}
            className="px-5 py-2.5 rounded-xl bg-[#C59A2F] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#A67F26] transition cursor-pointer"
          >
            Add Rule
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {privacyPolicies.map((rule, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs font-medium text-neutral-800 dark:text-neutral-200"
            >
              <span>{rule}</span>
              <button
                type="button"
                onClick={() => setPrivacyPolicies((p) => p.filter((_, i) => i !== idx))}
                className="text-neutral-400 hover:text-red-500 transition cursor-pointer"
                title="Remove rule"
              >
                <FiTrash2 size={13} />
              </button>
            </div>
          ))}
        </div>
        <ErrorMsg error={errors.rules} />
      </FormSection>

      {/* Amenities & Inclusions Section */}
      <FormSection title="Amenities & Inclusions *">
        <p className="text-xs text-neutral-400 mb-3 font-semibold">
          List all inclusions, gear, and amenities provided (e.g. Alpine Tent, Sleeping Bag, Bonfire, First Aid Kit, All Meals).
        </p>
        <InlineAdder
          placeholder="Add amenity (e.g. Guided Trek, Campfire, High-Altitude Gear)"
          values={amenities}
          onAdd={(v) => {
            setAmenities((a) => [...a, v]);
            if (errors.amenities) clearError("amenities");
          }}
          onRemove={(v) => setAmenities((a) => a.filter((x) => x !== v))}
        />
        <ErrorMsg error={errors.amenities} />
      </FormSection>
    </div>
  );
}
