"use client";

import { useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { FaChevronLeft, FaChevronRight, FaStar, FaQuoteLeft } from "react-icons/fa";
import { FiCalendar } from "react-icons/fi";
import { useExploreStore } from "@/stores/explore-store";

export function HomeReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { reviews } = useExploreStore();

  const displayReviews = useMemo(() => {
    return (reviews || []).filter(
      (r: any) =>
        r &&
        r.comment &&
        r.comment.trim() &&
        r.reviewer &&
        (r.reviewer._id || r.reviewer.id || r.reviewer.firstname)
    );
  }, [reviews]);

  const scrollReviews = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -360 : 360,
        behavior: "smooth",
      });
    }
  };

  if (!displayReviews || displayReviews.length === 0) return null;

  return (
    <section className="py-6 md:py-12 bg-white dark:bg-neutral-950 transition-colors relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 md:mb-12">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight tracking-wide">
              Guest <span className="text-[#C59A2F]">Reviews</span>
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm md:text-base font-semibold mt-1 sm:mt-1.5 tracking-wide">
              Real feedback from travellers with hosts
            </p>
          </div>
        </div>

        <div className="relative group/slider">
          <button
            type="button"
            onClick={() => scrollReviews("left")}
            className="absolute -left-3 md:-left-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all cursor-pointer opacity-90"
            aria-label="Scroll left"
          >
            <FaChevronLeft className="text-xs md:text-sm" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-5 md:gap-6 overflow-x-auto scrollbar-none scroll-smooth pb-4 pt-1 px-1"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {displayReviews.map((rev: any, index: number) => {
              const reviewerObj = rev.reviewer || {};
              const reviewerId =
                reviewerObj._id ||
                reviewerObj.id ||
                (typeof rev.reviewer === "string" ? rev.reviewer : null);
              let reviewerName = "";
              if (reviewerObj.firstname || reviewerObj.lastname) {
                reviewerName =
                  `${reviewerObj.firstname || ""} ${
                    reviewerObj.lastname || ""
                  }`.trim();
              } else if (reviewerObj.name) {
                reviewerName = reviewerObj.name;
              } else {
                reviewerName = "Guest Traveller";
              }

              let avatarUrl = "";
              if (reviewerObj.avatar) {
                if (typeof reviewerObj.avatar === "string") {
                  avatarUrl = reviewerObj.avatar;
                } else if (reviewerObj.avatar.url) {
                  avatarUrl = reviewerObj.avatar.url;
                }
              }
              if (!avatarUrl) {
                avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  reviewerName
                )}&background=C59A2F&color=fff&bold=true`;
              }

              const hostObj = rev.host || {};
              const hostId =
                hostObj._id ||
                hostObj.id ||
                (typeof rev.host === "string" ? rev.host : null);
              let hostName = "";
              if (hostObj.firstname || hostObj.lastname) {
                hostName =
                  `${hostObj.firstname || ""} ${
                    hostObj.lastname || ""
                  }`.trim();
              } else if (hostObj.name) {
                hostName = hostObj.name;
              }

              let hostAvatarUrl = "";
              if (hostObj.avatar) {
                if (typeof hostObj.avatar === "string") {
                  hostAvatarUrl = hostObj.avatar;
                } else if (hostObj.avatar.url) {
                  hostAvatarUrl = hostObj.avatar.url;
                }
              }
              if (!hostAvatarUrl && hostName) {
                hostAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  hostName
                )}&background=C59A2F&color=fff&bold=true`;
              }

              const ratingCount = Number(rev.rating || 5);

              return (
                <div
                  key={rev._id || index}
                  className="shrink-0 w-[280px] sm:w-[320px] md:w-[340px] bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:border-[#C59A2F]/40 transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <FaStar
                            key={i}
                            size={13}
                            className={
                              i < ratingCount
                                ? "text-amber-400 fill-amber-400"
                                : "text-neutral-300 dark:text-neutral-700"
                            }
                          />
                        ))}
                      </div>
                      <FaQuoteLeft
                        className="text-[#C59A2F]/20 group-hover:text-[#C59A2F]/40 transition-colors"
                        size={20}
                      />
                    </div>

                    {hostName && (
                      <div className="mb-3 pb-2.5 border-b border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between gap-2 text-xs">
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            if (hostId) router.push(`/profile/${hostId}`);
                          }}
                          className="flex items-center gap-1.5 min-w-0 cursor-pointer group/host hover:opacity-80 transition-opacity"
                          title={`View Host ${hostName}`}
                        >
                          {hostAvatarUrl && (
                            <img
                              src={hostAvatarUrl}
                              alt={hostName}
                              className="w-4 h-4 rounded-full object-cover border border-[#C59A2F]/40 shrink-0"
                              loading="lazy"
                            />
                          )}
                          <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-300 truncate">
                            Host:{" "}
                            <strong className="text-neutral-900 dark:text-neutral-100 group-hover/host:text-[#C59A2F] transition-colors">
                              {hostName}
                            </strong>
                          </span>
                        </div>
                      </div>
                    )}

                    <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 font-medium italic leading-relaxed line-clamp-4 mb-4">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>

                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      if (reviewerId) router.push(`/profile/${reviewerId}`);
                    }}
                    className="pt-4 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center gap-3 cursor-pointer group/user"
                  >
                    <img
                      src={avatarUrl}
                      alt={reviewerName}
                      className="w-10 h-10 rounded-full object-cover border-2 border-[#C59A2F]/30 shrink-0 shadow-xs group-hover/user:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm sm:text-base font-extrabold text-neutral-900 dark:text-neutral-100 truncate group-hover/user:text-[#C59A2F] transition-colors">
                        {reviewerName}
                      </h4>
                      {rev.createdAt && (
                        <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 flex items-center gap-1 mt-0.5">
                          <FiCalendar
                            size={12}
                            className="shrink-0 text-[#C59A2F]/80"
                          />
                          <span>
                            {new Date(rev.createdAt).toLocaleDateString(
                              "en-GB",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => scrollReviews("right")}
            className="absolute -right-3 md:-right-5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200/80 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 flex items-center justify-center shadow-lg hover:bg-white dark:hover:bg-neutral-800 hover:scale-105 active:scale-95 transition-all cursor-pointer opacity-90"
            aria-label="Scroll right"
          >
            <FaChevronRight className="text-xs md:text-sm" />
          </button>
        </div>
      </div>
    </section>
  );
}
