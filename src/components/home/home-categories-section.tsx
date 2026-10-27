"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";

interface Category {
  id: string;
  label: string;
  slug: string;
  image?: string;
  isCollage?: boolean;
  images?: string[];
  count: string;
}

const categories: Category[] = [
  {
    id: "bungee",
    label: "Bungee Jumping",
    slug: "bungee-jumping",
    image: "/images/bungee/bungee-1.jpeg",
    count: "Nervously Excited",
  },
  {
    id: "paragliding",
    label: "Paragliding",
    slug: "paragliding",
    image: "/images/paragliding/paragliding-3.jpeg",
    count: "Freedom in Skies",
  },
  {
    id: "trek",
    label: "Trek",
    slug: "trek",
    image: "/images/trek/trek-1.jpeg",
    count: "Find Yourself",
  },
  {
    id: "camping",
    label: "Camping",
    slug: "camping",
    image: "/images/camping/camping-1.jpeg",
    count: "Slow Down",
  },
  {
    id: "rafting",
    label: "Rafting",
    slug: "rafting",
    image: "/images/rafting/rafting-2.jpeg",
    count: "Feel Alive",
  },
  {
    id: "safari",
    label: "Safari",
    slug: "safari",
    image: "/images/about-1.jpeg",
    count: "Explore Wild",
  },
  {
    id: "other",
    label: "Others",
    slug: "other",
    isCollage: true,
    images: ["/images/rock-climbing/rock-climbing-1.jpeg", "/images/flyboarding/flyboarding-1.jpeg"],
    count: "Surprise Yourself",
  },
];

export function HomeCategoriesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const offset = direction === "left" ? -260 : 260;
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
    }
  };

  return (
    <section className="py-4 md:py-8 bg-white dark:bg-neutral-950 transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 relative w-full group/slider">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="hidden md:flex lg:hidden absolute left-2 top-[38%] -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 items-center justify-center shadow-lg hover:scale-105 cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={scrollRef}
          className="flex flex-nowrap lg:justify-between gap-4 sm:gap-6 md:gap-8 lg:gap-4 overflow-x-auto w-full pt-2 pb-4 scrollbar-hide snap-x snap-mandatory px-1 sm:px-2"
        >
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${cat.slug}`}
              className="group flex flex-col items-center cursor-pointer shrink-0 snap-start transition-all duration-300 w-[100px] sm:w-[120px] md:w-[140px] lg:flex-1 lg:max-w-[210px]"
            >
              <div className="relative w-22 h-22 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 rounded-full p-1 border-2 border-[#C59A2F]/30 dark:border-[#C59A2F]/40 group-hover:border-[#C59A2F] group-hover:shadow-[0_0_18px_rgba(197,154,47,0.35)] bg-white dark:bg-neutral-800/80 transition-all duration-300 shadow-md shrink-0">
                <div className="w-full h-full rounded-full overflow-hidden relative bg-neutral-100 dark:bg-neutral-800">
                  {cat.isCollage && cat.images ? (
                    <div className="w-full h-full relative overflow-hidden rounded-full group-hover:scale-110 transition-transform duration-500 ease-out">
                      <div className="w-full h-full flex overflow-hidden filter blur-[1.5px] scale-110 opacity-70 group-hover:opacity-90 transition-all duration-500">
                        <div className="w-1/2 h-full overflow-hidden relative border-r border-white/40">
                          <img src={cat.images[0]} alt="Activity 1" className="w-full h-full object-cover" />
                        </div>
                        <div className="w-1/2 h-full overflow-hidden relative">
                          <img src={cat.images[1]} alt="Activity 2" className="w-full h-full object-cover" />
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-[#C59A2F]">
                        <HelpCircle className="w-8 h-8" />
                      </div>
                    </div>
                  ) : (
                    <img
                      src={cat.image}
                      alt={cat.label}
                      className="w-full h-full object-cover rounded-full group-hover:scale-115 transition-transform duration-500 ease-out"
                    />
                  )}
                </div>
              </div>

              <div className="flex flex-col items-center text-center px-1 max-w-full mt-3 sm:mt-3.5">
                <h3 className="text-xs sm:text-sm md:text-base font-extrabold text-neutral-800 dark:text-neutral-100 group-hover:text-[#C59A2F] transition-colors leading-tight tracking-tight uppercase line-clamp-1 w-full">
                  {cat.label}
                </h3>
                <span className="text-[11px] sm:text-xs md:text-sm font-semibold text-neutral-500 dark:text-neutral-400 mt-0.5 group-hover:text-[#C59A2F]/80 transition-colors line-clamp-1 w-full">
                  {cat.count}
                </span>
              </div>
            </Link>
          ))}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="hidden md:flex lg:hidden absolute right-2 top-[38%] -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 items-center justify-center shadow-lg hover:scale-105 cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
