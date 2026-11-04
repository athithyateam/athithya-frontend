"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Shield, CheckCircle2, MapPin, Star } from "lucide-react";

interface ExperienceNavTabsProps {
  hasRules?: boolean;
  hasAmenities?: boolean;
  hasLocation?: boolean;
  hasReviews?: boolean;
}

export function ExperienceNavTabs({
  hasRules = false,
  hasAmenities = false,
  hasLocation = false,
  hasReviews = true,
}: ExperienceNavTabsProps) {
  const [activeNavTab, setActiveNavTab] = useState("overview");

  const navTabs = [
    { id: "overview", label: "Overview", icon: <FileText size={14} />, show: true },
    { id: "rules", label: "Rules", icon: <Shield size={14} />, show: hasRules },
    { id: "amenities", label: "Amenities", icon: <CheckCircle2 size={14} />, show: hasAmenities },
    { id: "location", label: "Location", icon: <MapPin size={14} />, show: hasLocation },
    { id: "reviews", label: "Reviews", icon: <Star size={14} />, show: hasReviews },
  ].filter((t) => t.show);

  const scrollToSection = (tabId: string) => {
    setActiveNavTab(tabId);
    const el = document.getElementById(`section-${tabId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="sticky top-16 md:top-20 z-20 bg-white dark:bg-neutral-950 py-2 border-b border-neutral-200/60 dark:border-neutral-800/80 transition-colors">
      <div className="flex items-center overflow-x-auto bg-neutral-100/90 dark:bg-neutral-900 rounded-2xl p-1.5 border border-neutral-200/80 dark:border-neutral-800 gap-1">
        {navTabs.map((tab) => {
          const active = activeNavTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => scrollToSection(tab.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer z-10 ${
                active
                  ? "text-white"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
              }`}
            >
              {active && (
                <motion.div
                  layoutId="experienceTabIndicator"
                  className="absolute inset-0 rounded-xl -z-10 bg-[#C59A2F]"
                />
              )}
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

