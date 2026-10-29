"use client";

import React, { useState, useRef } from "react";
import { X } from "lucide-react";

export const FORM_GOLD = "#C59A2F";

export function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs w-full dark:bg-neutral-900 transition-colors">
      <h3 className="text-sm font-semibold mb-4" style={{ color: FORM_GOLD }}>
        {title}
      </h3>
      {children}
    </div>
  );
}

export function ErrorMsg({ error }: { error?: string | null }) {
  if (!error) return null;
  return (
    <p className="text-[10px] font-bold uppercase tracking-wider text-red-500 mt-1.5 ml-1 flex items-center gap-1.5">
      <span className="w-1 h-1 rounded-full bg-red-500" />
      {error}
    </p>
  );
}

export function InlineAdder({
  placeholder,
  values = [],
  onAdd,
  onRemove,
}: {
  placeholder: string;
  values: string[];
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
}) {
  const [value, setValue] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  const commit = () => {
    const v = value.trim();
    if (!v) return;
    v.split(/\r?\n+/)
      .map((p) => p.trim())
      .filter(Boolean)
      .forEach((part) => {
        if (!values.includes(part)) onAdd(part);
      });
    setValue("");
    ref.current?.focus();
  };

  return (
    <div>
      <div className="flex flex-wrap sm:flex-nowrap gap-2 mb-3">
        <input
          ref={ref}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), commit())}
          placeholder={placeholder}
          className="rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 text-sm flex-1 min-w-[120px] outline-none focus:border-[#C59A2F]"
        />
        <button
          type="button"
          onClick={commit}
          className="bg-[#C59A2F] text-white px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap cursor-pointer"
        >
          Add
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        {values.map((v) => (
          <span
            key={v}
            className="px-3 py-1 rounded-full border flex items-center gap-2 text-sm bg-[#faf7f0] dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
          >
            <span className="font-medium">{v}</span>
            <button
              type="button"
              onClick={() => onRemove(v)}
              className="p-0.5 cursor-pointer text-neutral-400 hover:text-red-500"
            >
              <X size={14} />
            </button>
          </span>
        ))}
        {values.length === 0 && (
          <div className="text-xs text-neutral-400">No items added</div>
        )}
      </div>
    </div>
  );
}

const CATEGORY_OPTIONS = [
  "Trekking",
  "Camping",
  "Spiritual",
  "Rishikesh Rafting",
  "Paragliding",
  "Bungee Jumping",
  "Biking",
  "Jungle Safari",
  "Snow Activities",
  "Kayaking",
  "Stargazing",
  "Ziplining",
  "Caving",
  "Bird Watching",
  "Mountain Biking",
  "Hot Air Ballooning",
  "Village Walk",
  "Food Experience",
  "Heritage Walk",
  "Photography Tour",
];

export function CategoryPills({
  values,
  onAdd,
  onRemove,
}: {
  values: string[];
  onAdd: (v: string) => void;
  onRemove: (v: string) => void;
}) {
  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {values.length === 0 && (
          <span className="text-xs text-neutral-400">No categories selected</span>
        )}
        {values.map((v) => (
          <span
            key={v}
            className="px-3 py-1 rounded-full border flex items-center gap-2 text-xs font-bold bg-[#faf7f0] dark:bg-neutral-800 text-[#C59A2F] border-[#C59A2F]/40"
          >
            <span>{v}</span>
            <button
              type="button"
              onClick={() => onRemove(v)}
              className="cursor-pointer text-neutral-400 hover:text-red-500"
            >
              <X size={13} />
            </button>
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        {CATEGORY_OPTIONS.filter((o) => !values.includes(o)).map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onAdd(o)}
            className="px-3 py-1 rounded-full border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300 hover:bg-[#fbf6ea] dark:hover:bg-neutral-800 cursor-pointer"
          >
            + {o}
          </button>
        ))}
      </div>
    </div>
  );
}
