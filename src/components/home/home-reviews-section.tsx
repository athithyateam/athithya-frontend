"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight, Star, Quote, Calendar } from "lucide-react";
import { useExploreStore } from "@/stores/explore-store";
import { getOptimizedImage } from "@/lib/image-helper";

const previewReviews = [
  { id: "rev-1", reviewerName: "No name", avatar: "", hostName: "No host", comment: "No description", rating: "No rating", date: "No date" },
  { id: "rev-2", reviewerName: "No name", avatar: "", hostName: "No host", comment: "No description", rating: "No rating", date: "No date" },
  { id: "rev-3", reviewerName: "No name", avatar: "", hostName: "No host", comment: "No description", rating: "No rating", date: "No date" },
];

export function HomeReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { reviews } = useExploreStore();

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === "left" ? -340 : 340, behavior: "smooth" });
    }
  };

  const hasRealReviews = Array.isArray(reviews) && reviews.length > 0;

  return (
    <section className="py-6 md:py-10 bg-white dark:bg-neutral-950 transition-colors relative">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 mb-4 md:mb-6 text-left">
        <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight tracking-wide">
          Guest <span className="text-[#C59A2F]">Reviews</span>
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm md:text-base font-semibold mt-1">
          Real feedback from travellers with hosts
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto relative px-4 sm:px-6 md:px-8 group/slider">
        <button type="button" onClick={() => scroll("left")} className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 flex items-center justify-center shadow-lg hover:scale-105 cursor-pointer" aria-label="Scroll left">
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div ref={scrollRef} className="flex gap-5 md:gap-6 overflow-x-auto scrollbar-hide pb-4 pt-1 px-1">
          {hasRealReviews
            ? reviews.map((rev: any, idx: number) => {
                const reviewer = rev.user || rev.reviewer || {};
                const reviewerName = [reviewer.firstname, reviewer.lastname].filter(Boolean).join(" ") || reviewer.name || rev.reviewerName || "Traveler";
                const rawAvatar = typeof reviewer.avatar === "string" ? reviewer.avatar : reviewer.avatar?.url || reviewer.profilePic || "";
                const avatar = getOptimizedImage(rawAvatar, { width: 80, height: 80 }, reviewerName);
                const hostObj = rev.host || rev.post?.user || {};
                const hostName = [hostObj.firstname, hostObj.lastname].filter(Boolean).join(" ") || hostObj.name || rev.hostName || "Local Host";
                const comment = rev.comment || rev.review || rev.text || "";
                const rating = Number(rev.rating || 5).toFixed(1);
                const date = rev.createdAt ? new Date(rev.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recent";

                return (
                  <div key={rev._id || rev.id || idx} className="shrink-0 w-[280px] sm:w-[320px] md:w-[340px] bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 shadow-xs hover:shadow-xl hover:border-[#C59A2F]/40 transition-all duration-300 flex flex-col justify-between text-left">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                          <Star size={14} className="text-[#C59A2F] fill-[#C59A2F]" />
                          <span>{rating}</span>
                        </div>
                        <Quote className="text-[#C59A2F]/30" size={20} />
                      </div>
                      <div className="mb-3 pb-2.5 border-b border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
                        Host: <strong className="text-neutral-800 dark:text-neutral-200">{hostName}</strong>
                      </div>
                      <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-medium italic leading-relaxed line-clamp-4 mb-4">
                        &ldquo;{comment}&rdquo;
                      </p>
                    </div>
                    <div className="pt-4 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center gap-3">
                      <img src={avatar} alt={reviewerName} className="w-10 h-10 rounded-full object-cover border border-neutral-200 dark:border-neutral-700 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100 truncate">{reviewerName}</h4>
                        <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 flex items-center gap-1 mt-0.5">
                          <Calendar size={11} className="text-[#C59A2F]" />
                          <span>{date}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            : previewReviews.map((rev) => (
                <div key={rev.id} className="shrink-0 w-[280px] sm:w-[320px] md:w-[340px] bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between text-left">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300">
                        <Star size={14} className="text-[#C59A2F] fill-[#C59A2F]" />
                        <span>{rev.rating}</span>
                      </div>
                      <Quote className="text-[#C59A2F]/30" size={20} />
                    </div>
                    <div className="mb-3 pb-2.5 border-b border-neutral-100 dark:border-neutral-800 text-xs text-neutral-500 dark:text-neutral-400">
                      Host: <strong className="text-neutral-800 dark:text-neutral-200">{rev.hostName}</strong>
                    </div>
                    <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 font-medium italic leading-relaxed line-clamp-4 mb-4">
                      &ldquo;{rev.comment}&rdquo;
                    </p>
                  </div>
                  <div className="pt-4 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-[9px] font-bold text-neutral-400 uppercase shrink-0">No image</div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-extrabold text-neutral-900 dark:text-neutral-100 truncate">{rev.reviewerName}</h4>
                      <p className="text-xs font-medium text-neutral-400 dark:text-neutral-500 flex items-center gap-1 mt-0.5">
                        <Calendar size={11} className="text-[#C59A2F]" />
                        <span>{rev.date}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        <button type="button" onClick={() => scroll("right")} className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 flex items-center justify-center shadow-lg hover:scale-105 cursor-pointer" aria-label="Scroll right">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
