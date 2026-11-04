"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Share2 } from "lucide-react";
import { BookmarkButton } from "@/components/ui/bookmark-button";
import { useFeedbackStore } from "@/stores/feedback-store";

export interface GalleryActionControlsProps {
  postId: string;
  title: string;
  description?: string;
  onBack?: () => void;
}

/**
 * Floating action controls (Back, Share, Bookmark) for hero media galleries.
 * Automatically adapts between mobile and desktop using unified responsive styling.
 */
export function GalleryActionControls({
  postId,
  title,
  description = "",
  onBack,
}: GalleryActionControlsProps) {
  const router = useRouter();
  const { showToast } = useFeedbackStore();

  const handleBack = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title,
          text: description.substring(0, 100),
          url: window.location.href,
        });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Link copied to clipboard!", "success");
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      showToast("Unable to share link", "error");
    }
  };

  const buttonBaseClass =
    "w-9 h-9 md:w-10 md:h-10 rounded-full bg-black/60 md:bg-white md:dark:bg-neutral-900 text-white md:text-neutral-800 md:dark:text-neutral-100 border border-white/20 md:border-neutral-200 md:dark:border-neutral-700 shadow-md backdrop-blur-xs flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95";

  return (
    <>
      {/* Top Left: Back Navigation */}
      <button
        type="button"
        onClick={handleBack}
        className={`absolute top-3 left-3 md:top-4 md:left-4 z-20 ${buttonBaseClass}`}
        title="Go back"
        aria-label="Go back"
      >
        <ArrowLeft size={16} />
      </button>

      {/* Top Right: Share & Bookmark Actions */}
      <div className="absolute top-3 right-3 md:top-4 md:right-4 z-20 flex items-center gap-2">
        <button
          type="button"
          onClick={handleShare}
          className={buttonBaseClass}
          title="Share this experience"
          aria-label="Share this experience"
        >
          <Share2 size={15} />
        </button>

        <BookmarkButton
          experienceId={postId}
          variant="floating"
          size={15}
        />
      </div>
    </>
  );
}

