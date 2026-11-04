"use client";

import React, { useState, useEffect, useRef } from "react";
import { Play } from "lucide-react";
import { useInView } from "@/hooks/use-in-view";
import { useProgressiveStage } from "@/lib/progressive-stage-context";
import { getOptimizedImage } from "@/lib/image-helper";

export interface ProgressiveMediaProps {
  src: string;
  alt: string;
  type?: "image" | "video";
  className?: string;
  containerClassName?: string;
  aspectRatio?: string;
  rowIndex?: number;
  cardIndex?: number;
  priority?: boolean;
  fallbackSrc?: string;
  onLoad?: () => void;
  onError?: () => void;
  isAvatar?: boolean;
}

export type ProgressiveImageProps = ProgressiveMediaProps;

/**
 * Universal media component with per-image gold loading spinner,
 * browser cache race condition protection, and smooth opacity fade-in.
 */
export function ProgressiveMedia({
  src,
  alt,
  type = "image",
  className = "",
  containerClassName = "",
  aspectRatio = "aspect-[4/3]",
  rowIndex,
  cardIndex,
  priority = false,
  fallbackSrc = "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800",
  onLoad,
  onError,
  isAvatar = false,
}: ProgressiveMediaProps) {
  const [containerRef, isInView] = useInView<HTMLDivElement>({
    rootMargin: "120px",
    triggerOnce: true,
  });

  const { shouldLoadImage, reportImageLoaded } = useProgressiveStage();

  const imgRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Standalone media (hero galleries, profile headers, or outside homepage rows) load immediately
  const isStandalone = rowIndex === undefined;
  const canLoad =
    isStandalone ||
    priority ||
    isInView ||
    shouldLoadImage(rowIndex, cardIndex, isInView, priority);

  const resolveSource = (sourceUrl: string) =>
    type === "image" ? getOptimizedImage(sourceUrl, { width: 1200 }) : sourceUrl;

  const [currentSrc, setCurrentSrc] = useState<string | null>(() =>
    canLoad && src ? resolveSource(src) : null
  );
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (canLoad && src) {
      setCurrentSrc(resolveSource(src));
    }
  }, [canLoad, src, type]);

  // Handle dynamic source updates (e.g. carousel slide change)
  useEffect(() => {
    if (src && currentSrc) {
      const resolved = resolveSource(src);
      if (currentSrc !== resolved && currentSrc !== fallbackSrc) {
        setCurrentSrc(resolved);
        setIsLoaded(false);
        setHasError(false);
      }
    }
  }, [src, currentSrc, fallbackSrc, type]);

  // Protection against browser cache race conditions:
  // If image or video is already cached in memory, complete/readyState is true in 0ms before React attaches onLoad
  useEffect(() => {
    if (type === "video") {
      if (videoRef.current && videoRef.current.readyState >= 2) {
        setIsLoaded(true);
        reportImageLoaded(rowIndex, cardIndex);
        onLoad?.();
      }
    } else {
      if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
        setIsLoaded(true);
        reportImageLoaded(rowIndex, cardIndex);
        onLoad?.();
      }
    }
  }, [currentSrc, type, rowIndex, cardIndex, onLoad, reportImageLoaded]);

  const handleLoad = () => {
    setIsLoaded(true);
    reportImageLoaded(rowIndex, cardIndex);
    onLoad?.();
  };

  const handleError = () => {
    if (!hasError && fallbackSrc && currentSrc !== fallbackSrc) {
      setHasError(true);
      setCurrentSrc(fallbackSrc);
    }
    reportImageLoaded(rowIndex, cardIndex);
    onError?.();
  };

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${
        isAvatar ? "rounded-full shrink-0" : `w-full h-full ${aspectRatio}`
      } bg-neutral-100 dark:bg-neutral-850 ${containerClassName}`}
    >
      {/* 1:1 Shining Glass Shimmer on Individual Image while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 overflow-hidden bg-neutral-200/80 dark:bg-neutral-800 pointer-events-none z-10">
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 dark:via-white/20 to-transparent -skew-x-12 animate-shimmer" />
        </div>
      )}

      {/* Media: Image or Video */}
      {currentSrc && (
        type === "video" ? (
          <div className="relative w-full h-full bg-black">
            <video
              ref={videoRef}
              src={currentSrc}
              onLoadedData={handleLoad}
              onError={handleError}
              muted
              preload="metadata"
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                isLoaded ? "opacity-100" : "opacity-0"
              } ${className}`}
            />
            {isLoaded && (
              <div className="absolute inset-0 bg-black/25 flex items-center justify-center transition-opacity duration-300 group-hover:bg-black/35 pointer-events-none">
                <div className="w-12 h-12 rounded-full bg-white/90 dark:bg-neutral-900/90 text-[#C59A2F] flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                  <Play size={16} className="ml-0.5 fill-current" />
                </div>
              </div>
            )}
          </div>
        ) : (
          <img
            ref={imgRef}
            src={currentSrc}
            alt={alt}
            onLoad={handleLoad}
            onError={handleError}
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isLoaded ? "opacity-100" : "opacity-0"
            } ${className}`}
            loading={priority ? "eager" : "lazy"}
            decoding="async"
          />
        )
      )}
    </div>
  );
}

export const ProgressiveImage = ProgressiveMedia;
