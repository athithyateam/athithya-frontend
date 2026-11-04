"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

interface ExperienceDescriptionProps {
  description: string;
  longDescription?: string;
}

export function ExperienceDescription({
  description,
  longDescription,
}: ExperienceDescriptionProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div id="section-overview" className="scroll-mt-32 space-y-4">
      <h3 className="text-base md:text-xl font-black uppercase tracking-tight">
        Overview
      </h3>
      <div className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
        {description}
      </div>

      {longDescription && (
        <div className="border border-neutral-200/80 dark:border-neutral-800 rounded-2xl overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/40">
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-expanded={isOpen}
            className="w-full p-4 md:p-5 flex items-center justify-between text-left cursor-pointer hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40 transition-colors"
          >
            <span className="text-sm md:text-base font-black">
              Detailed Description & Itinerary
            </span>
            <ChevronDown
              className={`transition-transform duration-200 ${
                isOpen ? "rotate-180 text-[#C59A2F]" : "text-neutral-500"
              }`}
            />
          </button>
          <div
            className={`px-4 pb-5 md:px-5 pt-1 text-sm md:text-base leading-relaxed whitespace-pre-wrap border-t border-neutral-200/60 dark:border-neutral-800/60 ${
              isOpen ? "block" : "hidden"
            }`}
          >
            {longDescription}
          </div>
        </div>
      )}
    </div>
  );
}

