"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FiArrowRight, FiHome } from "react-icons/fi";
import { routes } from "@/config/navigation";
import { useExploreStore } from "@/stores/explore-store";
import { getOptimizedImage } from "@/lib/image-helper";

const getHostYears = (host: any) => {
  const years = host.hostDetails?.yearsOfExperience;
  if (years !== undefined && years !== null && Number(years) >= 0) {
    const num = Number(years);
    return `${num} ${num === 1 ? "year" : "years"} experience`;
  }
  return "0 years experience";
};

const hasValidProfilePicture = (host: any) => {
  if (!host) return false;
  const url =
    typeof host.avatar === "string"
      ? host.avatar
      : host.avatar?.url || host.profilePic;
  return typeof url === "string" && url.trim().length > 0;
};

export function TopRatedHostsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { hosts, homeLoading, homeLoaded } = useExploreStore();

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const firstCard = scrollRef.current.firstElementChild;
      const cardWidth = firstCard
        ? firstCard.getBoundingClientRect().width + 16
        : 320;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -cardWidth : cardWidth,
        behavior: "smooth",
      });
    }
  };

  const validHosts = Array.isArray(hosts)
    ? hosts.filter(hasValidProfilePicture)
    : [];
  const hasRealHosts = validHosts.length > 0;
  const isLoading = homeLoading || !homeLoaded;

  return (
    <section className="py-6 md:py-12 relative z-10 bg-white dark:bg-neutral-950 transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 mb-4 md:mb-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight tracking-wide transition-colors">
              Top Rated <span className="text-[#C59A2F]">Local Hosts</span>
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm md:text-base font-semibold mt-1 md:mt-1.5 tracking-wide transition-colors">
              Explore top rated hosts
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={routes.topRatedHost}
              className="p-2.5 sm:px-5 sm:py-2.5 rounded-full bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider hover:bg-[#A67F26] transition shadow-md flex items-center justify-center gap-2 shrink-0 cursor-pointer"
              title="View All Hosts"
            >
              <span className="hidden sm:inline">View All</span>
              <FiArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative px-4 sm:px-6 md:px-8 group/slider">
        <button
          type="button"
          onClick={() => scroll("left")}
          className="absolute left-2 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white transition-all flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 cursor-pointer opacity-90 hover:opacity-100"
          aria-label="Scroll left"
        >
          <FaChevronLeft size={12} />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto w-full pt-3 md:pt-4 pb-4 md:pb-8 scrollbar-hide snap-x snap-mandatory px-1"
        >
          {hasRealHosts ? (
            validHosts.map((host: any, idx: number) => {
              const id = host._id || host.id || idx;
              const name =
                [host.firstname, host.lastname].filter(Boolean).join(" ") ||
                host.name ||
                "Local Host";
              const rawAvatar =
                typeof host.avatar === "string"
                  ? host.avatar
                  : host.avatar?.url || host.profilePic || "";
              const avatar = getOptimizedImage(
                rawAvatar,
                { width: 200, height: 200 },
                name
              );
              const city =
                host.location?.city ||
                host.city ||
                host.location?.district ||
                host.location?.state ||
                "Uttarakhand";
              const years = getHostYears(host);
              const rawRating = host.averageRating;
              const rating =
                rawRating !== undefined &&
                rawRating !== null &&
                Number(rawRating) > 0
                  ? Number(rawRating).toFixed(1)
                  : null;
              const expCount =
                host.totalPosts !== undefined && host.totalPosts !== null
                  ? Number(host.totalPosts)
                  : 0;

              return (
                <div
                  key={id}
                  onClick={() => router.push(`/profile/${host._id || host.id}`)}
                  className="w-full sm:w-[48%] md:w-[32%] lg:w-[calc(25%-12px)] shrink-0 snap-start bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-4 sm:p-5 shadow-xs hover:shadow-md hover:border-[#C59A2F]/40 transition-all duration-300 cursor-pointer flex items-center gap-3.5 sm:gap-4 group"
                >
                  <div className="relative shrink-0">
                    <img
                      src={avatar}
                      alt={name}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border border-neutral-200 dark:border-neutral-700 shadow-xs group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        (
                          e.currentTarget as HTMLImageElement
                        ).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          name
                        )}&background=C59A2F&color=fff`;
                      }}
                    />
                    {host.verifyBadge?.enabled && (
                      <div
                        className="absolute -bottom-1 -right-1 bg-white dark:bg-neutral-900 rounded-full p-0.5 shadow-sm"
                        title="Verified Host"
                      >
                        <svg
                          className="w-4 h-4"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M22.25 12c0-1.43-.88-2.67-2.19-3.19.16-.43.25-.9.25-1.39 0-2.25-1.83-4.08-4.08-4.08-.49 0-.96.09-1.39.25C14.32 2.28 13.25 1.5 12 1.5s-2.32.78-2.84 2.09c-.43-.16-.9-.25-1.39-.25-2.25 0-4.08 1.83-4.08 4.08 0 .49.09.96.25 1.39C2.63 9.33 1.75 10.57 1.75 12c0 1.43.88 2.67 2.19 3.19-.16.43-.25.9-.25 1.39 0 2.25 1.83 4.08 4.08 4.08.49 0 .96-.09 1.39-.25.52 1.31 1.59 2.09 2.84 2.09s2.32-.78 2.84-2.09c.43.16.9.25 1.39.25 2.25 0 4.08-1.83 4.08-4.08 0-.49-.09-.96-.25-1.39 1.31-.52 2.09-1.59 2.09-2.84z"
                            fill="#C59A2F"
                          />
                          <path
                            d="M10.22 16.75l-3.32-3.32 1.42-1.42 1.9 1.9 5.68-5.68 1.42 1.42-7.1 7.1z"
                            fill="#fff"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm sm:text-base leading-snug truncate group-hover:text-[#C59A2F] transition-colors">
                      {name}
                    </h3>

                    <div className="my-1.5">
                      <span className="inline-flex items-center gap-1 bg-[#FFF8E7] dark:bg-[#C59A2F]/15 border border-[#F3E2B4] dark:border-[#C59A2F]/30 text-[#C59A2F] text-xs font-bold uppercase tracking-wide px-2.5 py-0.5 rounded-full">
                        <FiHome size={11} className="shrink-0" />
                        <span>Local Host</span>
                      </span>
                    </div>

                    <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300 truncate">
                      {city}
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-1.5">
                      {years}
                    </p>

                    {rating ? (
                      <div className="flex items-center gap-1 text-xs sm:text-sm font-bold text-neutral-800 dark:text-neutral-200">
                        <FaStar
                          className="text-[#C59A2F] shrink-0"
                          size={13}
                        />
                        <span>{rating}</span>
                        <span className="text-neutral-400 font-normal">
                          ({expCount} experiences)
                        </span>
                      </div>
                    ) : expCount > 0 ? (
                      <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                        {expCount} experiences
                      </p>
                    ) : null}
                  </div>
                </div>
              );
            })
          ) : isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-full sm:w-[48%] md:w-[32%] lg:w-[calc(25%-12px)] shrink-0 snap-start bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-4 sm:p-5 flex items-center gap-3.5 sm:gap-4"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-neutral-200 dark:bg-neutral-800 animate-pulse shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                  <div className="h-3 w-2/3 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse" />
                </div>
              </div>
            ))
          ) : (
            <div className="flex justify-center items-center h-[160px] w-full bg-neutral-50/50 dark:bg-neutral-900/40 rounded-2xl border border-dashed border-neutral-200 dark:border-neutral-800">
              <p className="text-sm font-semibold text-neutral-400 dark:text-neutral-500">
                No rated hosts available
              </p>
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => scroll("right")}
          className="absolute right-2 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 z-30 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-white transition-all flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 cursor-pointer opacity-90 hover:opacity-100"
          aria-label="Scroll right"
        >
          <FaChevronRight size={12} />
        </button>
      </div>
    </section>
  );
}
