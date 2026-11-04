import React from "react";
import Link from "next/link";
import { HelpCircle } from "lucide-react";
import type { CategoryItem } from "@/data/categories";

interface CategoryCircleItemProps {
  category: CategoryItem;
  isNew?: boolean;
}

export function CategoryCircleItem({
  category,
  isNew = false,
}: CategoryCircleItemProps) {
  const taglineText = category.tagline || category.count;

  return (
    <Link
      href={`/${category.slug}`}
      className="group flex flex-col items-center cursor-pointer shrink-0 snap-start transition-colors w-[100px] sm:w-[120px] md:w-[140px] lg:flex-1 lg:max-w-[210px]"
    >
      <div
        className={`relative w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 rounded-full p-1 border-2 transition-colors ${
          isNew
            ? "border-[#C59A2F] shadow-md"
            : "border-[#C59A2F]/30 dark:border-[#C59A2F]/40"
        } group-hover:border-[#C59A2F] bg-white dark:bg-neutral-850 shadow-sm shrink-0`}
      >
        <div className="w-full h-full rounded-full overflow-hidden relative bg-neutral-100 dark:bg-neutral-800">
          {category.isCollage && category.images ? (
            <div className="w-full h-full relative overflow-hidden rounded-full">
              <div className="w-full h-full flex overflow-hidden">
                <div className="w-1/2 h-full overflow-hidden relative border-r border-white/40">
                  <img
                    src={category.images[0]}
                    alt="Activity 1"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="w-1/2 h-full overflow-hidden relative">
                  <img
                    src={category.images[1]}
                    alt="Activity 2"
                    className="w-full h-full object-cover"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
              </div>
              <div className="absolute inset-0 bg-black/45 flex items-center justify-center text-[#C59A2F]">
                <HelpCircle className="w-7 h-7 sm:w-8 sm:h-8" />
              </div>
            </div>
          ) : (
            <img
              src={category.image}
              alt={category.label}
              className="w-full h-full object-cover rounded-full"
              loading="lazy"
              decoding="async"
            />
          )}
        </div>

        {isNew && (
          <span className="absolute -top-1 right-1 px-2 py-0.5 rounded-full bg-[#C59A2F] text-white text-[9px] font-black uppercase tracking-wider shadow-md border border-white dark:border-neutral-900">
            New
          </span>
        )}
      </div>

      <div className="flex flex-col items-center text-center px-1 max-w-full mt-3 sm:mt-3.5">
        <h3 className="text-xs sm:text-sm md:text-base font-extrabold text-neutral-800 dark:text-neutral-100 group-hover:text-[#C59A2F] transition-colors leading-tight tracking-tight uppercase line-clamp-1 w-full">
          {category.label}
        </h3>
        {taglineText && (
          <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-neutral-500 dark:text-neutral-400 mt-0.5 group-hover:text-[#C59A2F]/80 transition-colors line-clamp-1 w-full">
            {taglineText}
          </span>
        )}
      </div>
    </Link>
  );
}
