"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CATEGORIES_DATA } from "@/data/categories";
import { CategoryCircleItem } from "./category-circle-item";

export function HomeCategoriesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -260 : 260,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-4 md:py-8 bg-white dark:bg-neutral-950 transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 relative w-full group/slider">
        {/* Scroll Left Button */}
        <button
          type="button"
          onClick={() => scroll("left")}
          className="hidden md:flex lg:hidden absolute left-2 top-[38%] -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 items-center justify-center shadow-md cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Categories Strip */}
        <div
          ref={scrollRef}
          className="flex flex-nowrap lg:justify-between gap-4 sm:gap-6 md:gap-8 lg:gap-4 overflow-x-auto w-full pt-2 pb-4 scrollbar-hide snap-x snap-mandatory px-1 sm:px-2"
        >
          {CATEGORIES_DATA.map((cat) => (
            <CategoryCircleItem key={cat.id} category={cat} />
          ))}
        </div>

        {/* Scroll Right Button */}
        <button
          type="button"
          onClick={() => scroll("right")}
          className="hidden md:flex lg:hidden absolute right-2 top-[38%] -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 items-center justify-center shadow-md cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
