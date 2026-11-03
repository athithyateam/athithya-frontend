import React from "react";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { ExperienceCardSkeleton } from "./experience-card-placeholder";

export interface ExperienceSectionRowSkeletonProps {
  title: string;
  highlight?: string;
  subtitle?: string;
  viewAllHref?: string;
}

export function ExperienceSectionRowSkeleton({
  title,
  highlight,
  subtitle,
  viewAllHref,
}: ExperienceSectionRowSkeletonProps) {
  return (
    <section className="py-6 md:py-12 relative z-10 bg-white dark:bg-neutral-950 transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 mb-4 md:mb-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight tracking-wide transition-colors">
              {title}{" "}
              {highlight && <span className="text-[#C59A2F]">{highlight}</span>}
            </h2>
            {subtitle && (
              <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm md:text-base font-semibold mt-1 md:mt-1.5 tracking-wide transition-colors">
                {subtitle}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {viewAllHref && (
              <Link
                href={viewAllHref}
                className="p-2.5 sm:px-5 sm:py-2.5 rounded-full bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider hover:bg-[#A67F26] transition shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                title="View All"
              >
                <span className="hidden sm:inline">View All</span>
                <FiArrowRight size={14} />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative px-4 sm:px-6 md:px-8 group/slider">
        <button
          type="button"
          disabled
          className="absolute left-0 sm:left-1 md:left-2 top-[calc(50%-32px)] -translate-y-1/2 z-30 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-700 text-neutral-400 dark:text-neutral-500 flex items-center justify-center shadow-xl opacity-50 cursor-not-allowed"
          aria-label="Scroll left"
        >
          <FaChevronLeft size={12} />
        </button>

        <div className="flex gap-4 overflow-x-auto w-full pt-3 md:pt-4 pb-4 md:pb-8 scrollbar-hide snap-x snap-mandatory px-1">
          {Array.from({ length: 4 }).map((_, idx) => (
            <ExperienceCardSkeleton key={idx} />
          ))}
        </div>

        <button
          type="button"
          disabled
          className="absolute right-0 sm:right-1 md:right-2 top-[calc(50%-32px)] -translate-y-1/2 z-30 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-700 text-neutral-400 dark:text-neutral-500 flex items-center justify-center shadow-xl opacity-50 cursor-not-allowed"
          aria-label="Scroll right"
        >
          <FaChevronRight size={12} />
        </button>
      </div>
    </section>
  );
}

