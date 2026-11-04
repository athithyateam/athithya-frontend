"use client";

import React from "react";
import { Bookmark } from "lucide-react";
import { useSaveExperience } from "@/hooks/use-save-experience";

export interface BookmarkButtonProps {
  experienceId: string;
  variant?: "floating" | "card-badge" | "minimal";
  size?: number;
  className?: string;
  onUnsave?: (id: string) => void;
  title?: string;
}

/**
 * Reusable bookmark / save button with optimistic state and consistent brand styling.
 */
export function BookmarkButton({
  experienceId,
  variant = "floating",
  size = 15,
  className = "",
  onUnsave,
  title,
}: BookmarkButtonProps) {
  const { isSaved, isLoading, toggleSave } = useSaveExperience(experienceId, {
    onUnsave,
  });

  const activeColor = "fill-[#C59A2F] text-[#C59A2F]";
  const defaultTitle = isSaved ? "Saved to favorites" : "Save to favorites";

  if (variant === "card-badge") {
    return (
      <button
        type="button"
        onClick={toggleSave}
        disabled={isLoading}
        title={title || defaultTitle}
        aria-label={title || defaultTitle}
        className={`w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/95 dark:bg-neutral-900/95 border border-neutral-200 dark:border-neutral-800 shadow-sm flex items-center justify-center transition-colors cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-850 ${className}`}
      >
        <Bookmark
          size={size}
          className={
            isSaved
              ? activeColor
              : "text-neutral-500 dark:text-neutral-300 group-hover:text-[#C59A2F] transition-colors"
          }
        />
      </button>
    );
  }

  if (variant === "minimal") {
    return (
      <button
        type="button"
        onClick={toggleSave}
        disabled={isLoading}
        title={title || defaultTitle}
        aria-label={title || defaultTitle}
        className={`p-1.5 transition-colors cursor-pointer ${className}`}
      >
        <Bookmark
          size={size}
          className={
            isSaved
              ? activeColor
              : "text-neutral-600 dark:text-neutral-400 hover:text-[#C59A2F] transition-colors"
          }
        />
      </button>
    );
  }

  // Variant: "floating" (Used on detail hero gallery, responds cleanly to mobile/desktop)
  return (
    <button
      type="button"
      onClick={toggleSave}
      disabled={isLoading}
      title={title || defaultTitle}
      aria-label={title || defaultTitle}
      className={`w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/60 md:bg-white md:dark:bg-neutral-900 text-white md:text-neutral-800 md:dark:text-neutral-100 border border-white/20 md:border-neutral-200 md:dark:border-neutral-700 shadow-md backdrop-blur-xs flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95 ${className}`}
    >
      <Bookmark
        size={size}
        className={isSaved ? activeColor : "transition-colors"}
      />
    </button>
  );
}

