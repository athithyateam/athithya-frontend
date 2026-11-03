"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { getOptimizedImage } from "@/lib/image-helper";

export interface LightboxMediaItem {
  url: string;
  type?: "image" | "video";
}

export interface MediaLightboxProps {
  isOpen: boolean;
  onClose: () => void;
  mediaItems: LightboxMediaItem[];
  initialIndex?: number;
}

export function MediaLightbox({
  isOpen,
  onClose,
  mediaItems,
  initialIndex = 0,
}: MediaLightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) setCurrentIndex(initialIndex);
  }, [isOpen, initialIndex]);

  if (!isOpen || !mediaItems || mediaItems.length === 0) return null;

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const currentItem = mediaItems[currentIndex];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[60000] flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md cursor-pointer"
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 z-[60001] p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all border border-white/10 cursor-pointer"
          >
            <X size={18} />
          </button>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10 w-[90vw] h-[80vh] max-w-5xl flex items-center justify-center select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {mediaItems.length > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-2 md:-left-16 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 text-white inline-flex items-center justify-center rounded-full border border-white/10 cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            <div className="w-full h-full flex items-center justify-center overflow-hidden rounded-2xl bg-neutral-950/40 border border-white/5 shadow-2xl">
              {currentItem?.type === "video" ? (
                <video
                  src={currentItem.url}
                  controls
                  autoPlay
                  className="max-w-full max-h-full object-contain"
                />
              ) : (
                <img
                  src={getOptimizedImage(currentItem?.url, { width: 1440 })}
                  className="max-w-full max-h-full object-contain"
                  alt="Gallery media"
                />
              )}
            </div>

            {mediaItems.length > 1 && (
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-2 md:-right-16 z-20 w-12 h-12 bg-white/10 hover:bg-white/20 text-white inline-flex items-center justify-center rounded-full border border-white/10 cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            )}

            <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-white/60 text-xs font-black uppercase tracking-widest">
              {currentIndex + 1} / {mediaItems.length}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

