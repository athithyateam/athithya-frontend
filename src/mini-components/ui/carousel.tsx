"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import type { CarouselProps } from "./types";

export function Carousel<T>({
  items,
  renderItem,
  intervalMs = 2500,
  autoPlay = true,
  pauseOnHover = true,
  className = "",
  trackClassName = "",
  indicatorsClassName = "",
  showIndicators = true,
  renderIndicator,
  onSlideChange,
  "aria-label": ariaLabel = "Carousel",
}: CarouselProps<T>) {
  const total = items.length;
  // Infinite scroll track: clone the first slide to the end for seamless looping to the right
  const displayItems = total > 1 ? [...items, items[0]] : items;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [withTransition, setWithTransition] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Active indicator index (maps the cloned last slide back to 0)
  const activeIndex = total > 0 ? currentIndex % total : 0;

  const goTo = useCallback(
    (index: number) => {
      setWithTransition(true);
      setCurrentIndex(index);
      onSlideChange?.(index % total);
    },
    [total, onSlideChange]
  );

  const next = useCallback(() => {
    setWithTransition(true);
    setCurrentIndex((prev) => prev + 1);
  }, []);

  // Handle seamless infinite reset when sliding past the last item
  const handleTransitionEnd = () => {
    if (currentIndex >= total) {
      // We reached the cloned first slide: instantly reset to real index 0 without animation
      setWithTransition(false);
      setCurrentIndex(0);
      onSlideChange?.(0);
    }
  };

  // Re-enable transitions on the next animation frame after an instant reset
  useEffect(() => {
    if (!withTransition) {
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setWithTransition(true);
        });
      });
      return () => cancelAnimationFrame(frame);
    }
  }, [withTransition]);

  // Autoplay timer
  useEffect(() => {
    if (!autoPlay || isPaused || total <= 1) return;

    timerRef.current = setInterval(() => {
      next();
    }, intervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [autoPlay, isPaused, total, intervalMs, next]);

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      onFocus={() => pauseOnHover && setIsPaused(true)}
      onBlur={() => pauseOnHover && setIsPaused(false)}
    >
      {/* Seamless Sliding Track */}
      <div
        onTransitionEnd={handleTransitionEnd}
        className={`flex w-full h-full ${trackClassName}`}
        style={{
          transform: `translateX(-${currentIndex * 100}%)`,
          transition: withTransition
            ? "transform 700ms cubic-bezier(0.4, 0, 0.2, 1)"
            : "none",
        }}
      >
        {displayItems.map((item, index) => {
          const itemRealIndex = index % total;
          const isActive = itemRealIndex === activeIndex;

          return (
            <div
              key={index}
              role="group"
              aria-roledescription="slide"
              aria-label={`Slide ${itemRealIndex + 1} of ${total}`}
              aria-hidden={!isActive}
              className="w-full h-full flex-shrink-0"
            >
              {renderItem(item, itemRealIndex, isActive)}
            </div>
          );
        })}
      </div>

      {/* Dynamic Indicators */}
      {showIndicators && total > 1 && (
        <div
          className={`flex items-center gap-1.5 ${indicatorsClassName}`}
          role="tablist"
          aria-label="Carousel Slides"
        >
          {items.map((_, index) => {
            const isActive = index === activeIndex;
            if (renderIndicator) {
              return renderIndicator(index, isActive, goTo);
            }
            return (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => goTo(index)}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  isActive
                    ? "w-6 h-1.5 bg-[#DF9E26]"
                    : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                }`}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
