"use client";

import React from "react";
import { FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import { FormSection, ErrorMsg } from "../form-primitives";
import { CATEGORIES_DATA } from "@/data/categories";
import type { FormErrors } from "./types";

const EXPERIENCE_TYPES = [
  ...CATEGORIES_DATA.map((c) => c.label),
  "Experience Guide",
];

interface Step1BasicDetailsProps {
  title: string;
  setTitle: (v: string) => void;
  description: string;
  setDescription: (v: string) => void;
  longDescription: string;
  setLongDescription: (v: string) => void;
  selectedCategories: string[];
  toggleCategory: (cat: string) => void;
  errors: FormErrors;
  clearError: (field: string) => void;
}

export function Step1BasicDetails({
  title,
  setTitle,
  description,
  setDescription,
  longDescription,
  setLongDescription,
  selectedCategories,
  toggleCategory,
  errors,
  clearError,
}: Step1BasicDetailsProps) {
  return (
    <div className="space-y-5">
      {/* Uttarakhand Region Strict Notice */}
      <div className="bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900/40 rounded-2xl p-4 flex gap-3 shadow-xs select-none">
        <FiAlertTriangle className="text-yellow-600 dark:text-yellow-400 shrink-0 text-xl mt-0.5" />
        <div>
          <h4 className="text-xs font-black text-yellow-800 dark:text-yellow-300 uppercase tracking-wider">
            Uttarakhand Region Only
          </h4>
          <p className="text-xs text-yellow-700 dark:text-yellow-400 mt-1 font-medium leading-relaxed">
            Athithya is a dedicated local experiences platform strictly for Uttarakhand. Experiences outside this region will not be approved.
          </p>
        </div>
      </div>

      <FormSection title="Basic Details">
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-bold block mb-1">Invitation Title *</label>
            <input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) clearError("title");
              }}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:border-[#C59A2F] outline-none transition"
              placeholder="e.g. Kedarkantha Summit Trek with Bonfire"
            />
            <ErrorMsg error={errors.title} />
          </div>

          {/* Short Description */}
          <div className="relative">
            <label className="text-xs font-bold block mb-1">
              Short Description (Quick intro, duration, highlights) *
            </label>
            <textarea
              rows={3}
              maxLength={150}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value.slice(0, 150));
                if (errors.description) clearError("description");
              }}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 pt-3 pb-7 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:border-[#C59A2F] outline-none transition"
              placeholder="Short description displayed on cards and previews *"
            />
            <div className="absolute bottom-2.5 right-3 text-[10px] font-bold text-neutral-400 pointer-events-none select-none">
              {description.length}/150 characters
            </div>
            <ErrorMsg error={errors.description} />
          </div>

          {/* Long Description */}
          <div>
            <label className="text-xs font-bold block mb-1">Full Description *</label>
            <textarea
              rows={6}
              value={longDescription}
              onChange={(e) => {
                setLongDescription(e.target.value);
                if (errors.longDescription) clearError("longDescription");
              }}
              className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-4 py-3 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:border-[#C59A2F] outline-none transition"
              placeholder="Detailed description, day-by-day highlights, difficulty, safety instructions *"
            />
            <ErrorMsg error={errors.longDescription} />
          </div>

          {/* Experience Categories */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2.5">
              <label className="text-xs font-black uppercase tracking-wider text-[#C59A2F]">
                Experience Categories * (Select one or multiple)
              </label>
              <span className="text-[11px] font-bold text-neutral-400">
                {selectedCategories.length} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {EXPERIENCE_TYPES.map((type) => {
                const isSelected = selectedCategories.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => toggleCategory(type)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-[#C59A2F] text-white shadow-sm ring-2 ring-[#C59A2F]/30"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    }`}
                  >
                    <span>{type}</span>
                    {isSelected && <FiCheckCircle size={14} className="text-white" />}
                  </button>
                );
              })}
            </div>
            <ErrorMsg error={errors.selectedCategories} />
          </div>
        </div>
      </FormSection>
    </div>
  );
}

