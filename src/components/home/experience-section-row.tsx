"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { ExperienceCardPlaceholder, type ExperienceItemPreview } from "./experience-card-placeholder";

interface ExperienceSectionRowProps {
  title: string;
  highlight?: string;
  subtitle?: string;
  viewAllHref?: string;
  items: ExperienceItemPreview[];
}

export function ExperienceSectionRow({
  title,
  highlight,
  subtitle,
  viewAllHref,
  items,
}: ExperienceSectionRowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.75;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-6 md:py-10 relative z-10 bg-white dark:bg-neutral-950 transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 mb-4 md:mb-6">
        <div className="flex items-center justify-between gap-3 text-left">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight tracking-wide">
              {title} {highlight && <span className="text-[#C59A2F]">{highlight}</span>}
            </h2>
            {subtitle && (
              <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm md:text-base font-semibold mt-1">
                {subtitle}
              </p>
            )}
          </div>

          {viewAllHref && (
            <Link
              href={viewAllHref}
              className="p-2.5 sm:px-5 sm:py-2.5 rounded-full bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider hover:bg-[#A67F26] transition shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span className="hidden sm:inline">View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative px-4 sm:px-6 md:px-8 group/slider">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-2 sm:left-4 top-[calc(50%-20px)] -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-800 transition-all flex items-center justify-center shadow-lg hover:scale-105 cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto w-full pt-3 pb-6 scrollbar-hide snap-x snap-mandatory px-1"
        >
          {items.map((item) => (
            <ExperienceCardPlaceholder key={item.id} item={item} />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-2 sm:right-4 top-[calc(50%-20px)] -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-800 transition-all flex items-center justify-center shadow-lg hover:scale-105 cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
