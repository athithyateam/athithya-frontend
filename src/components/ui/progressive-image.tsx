"use client";

import React, { useState, useEffect } from "react";
import { useInView } from "@/hooks/use-in-view";
import { useProgressiveStage } from "@/lib/progressive-stage-context";

export interface ProgressiveImageProps {
  src: string;
  alt: string;
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

export function ProgressiveImage({
  src,
  alt,
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
}: ProgressiveImageProps) {
  const [containerRef, isInView] = useInView<HTMLDivElement>({
    rootMargin: "120px",
    triggerOnce: true,
  });

  const { shouldLoadImage, reportImageLoaded } = useProgressiveStage();
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const canLoad = shouldLoadImage(rowIndex, cardIndex, isInView, priority);

  useEffect(() => {
    if (canLoad && !currentSrc && src) {
      setCurrentSrc(src);
    }
  }, [canLoad, currentSrc, src]);

  // If the src changes later (e.g. dynamic prop update)
  useEffect(() => {
    if (currentSrc && src && currentSrc !== src && currentSrc !== fallbackSrc) {
      setCurrentSrc(src);
      setIsLoaded(false);
      setHasError(false);
    }
  }, [src, currentSrc, fallbackSrc]);

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
        isAvatar ? "rounded-full shrink-0" : `w-full ${aspectRatio}`
      } bg-neutral-100 dark:bg-neutral-800 ${containerClassName}`}
    >
      {/* Shimmer Placeholder while loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-neutral-200/70 dark:bg-neutral-800/80 animate-pulse pointer-events-none" />
      )}

      {/* Real Image */}
      {currentSrc && (
        <img
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
      )}
    </div>
  );
}

