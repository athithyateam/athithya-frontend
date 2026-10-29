"use client";

import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, ArrowRight, Star, ShieldCheck, Home as HomeIcon } from "lucide-react";
import { routes } from "@/config/navigation";
import { useExploreStore } from "@/stores/explore-store";
import { getOptimizedImage } from "@/lib/image-helper";

const previewHosts = [
  { id: "host-1", name: "No name", avatar: "", city: "No location", experienceCount: "No experiences", rating: "No rating" },
  { id: "host-2", name: "No name", avatar: "", city: "No location", experienceCount: "No experiences", rating: "No rating" },
  { id: "host-3", name: "No name", avatar: "", city: "No location", experienceCount: "No experiences", rating: "No rating" },
  { id: "host-4", name: "No name", avatar: "", city: "No location", experienceCount: "No experiences", rating: "No rating" },
];

export function TopRatedHostsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { hosts } = useExploreStore();

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: direction === "left" ? -320 : 320, behavior: "smooth" });
    }
  };

  const hasRealHosts = Array.isArray(hosts) && hosts.length > 0;

  return (
    <section className="py-6 md:py-10 relative z-10 bg-white dark:bg-neutral-950 transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 mb-4 md:mb-6">
        <div className="flex items-center justify-between gap-3 text-left">
          <div className="flex-1 min-w-0">
            <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight tracking-wide">
              Top Rated <span className="text-[#C59A2F]">Local Hosts</span>
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm md:text-base font-semibold mt-1">
              Explore top rated hosts
            </p>
          </div>

          <Link
            href={routes.topRatedHost}
            className="p-2.5 sm:px-5 sm:py-2.5 rounded-full bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider hover:bg-[#A67F26] transition shadow-md flex items-center gap-1.5 shrink-0 cursor-pointer"
          >
            <span className="hidden sm:inline">View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto relative px-4 sm:px-6 md:px-8 group/slider">
        <button type="button" onClick={() => scroll("left")} className="absolute left-2 sm:left-4 top-[calc(50%-10px)] -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 flex items-center justify-center shadow-lg hover:scale-105 cursor-pointer" aria-label="Scroll left">
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div ref={scrollRef} className="flex gap-4 overflow-x-auto w-full pt-3 pb-6 scrollbar-hide snap-x snap-mandatory px-1">
          {hasRealHosts
            ? hosts.map((host: any) => {
                const id = host._id || host.id;
                const name = [host.firstname, host.lastname].filter(Boolean).join(" ") || host.name || "Local Host";
                const rawAvatar = typeof host.avatar === "string" ? host.avatar : host.avatar?.url || host.profilePic || "";
                const avatar = getOptimizedImage(rawAvatar, { width: 160, height: 160 }, name);
                const city = host.city || host.district || host.hostDetails?.city || host.hostDetails?.district || "Uttarakhand";
                const rating = host.averageRating || host.rating?.average || host.rating || "4.9";
                const expCount = host.tripsHosted ?? host.experienceCount ?? host.postsCount ?? 0;

                return (
                  <div
                    key={id}
                    onClick={() => router.push(`/profile/${id}`)}
                    className="w-full sm:w-[48%] md:w-[32%] lg:w-[calc(25%-12px)] shrink-0 snap-start bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-300 flex items-center gap-3.5 sm:gap-4 cursor-pointer text-left group"
                  >
                    <div className="relative shrink-0">
                      <img src={avatar} alt={name} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border border-neutral-200 dark:border-neutral-700" />
                      {host.verifyBadge?.enabled !== false && (
                        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-neutral-900 rounded-full p-0.5 shadow-xs text-[#C59A2F]">
                          <ShieldCheck className="w-4 h-4 fill-[#C59A2F] text-white" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm sm:text-base leading-snug truncate group-hover:text-[#C59A2F] transition-colors">{name}</h3>
                      <div className="my-1">
                        <span className="inline-flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/70 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                          <HomeIcon className="w-2.5 h-2.5 text-[#C59A2F]" />
                          <span>Verified Host</span>
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 truncate">{city}</p>
                      <div className="flex items-center gap-1 text-xs font-bold text-neutral-700 dark:text-neutral-300 mt-1">
                        <Star className="w-3 h-3 text-[#C59A2F] fill-[#C59A2F]" />
                        <span>{Number(rating).toFixed(1)}</span>
                        <span className="text-neutral-400 font-normal">({expCount} experiences)</span>
                      </div>
                    </div>
                  </div>
                );
              })
            : previewHosts.map((host) => (
                <div key={host.id} className="w-full sm:w-[48%] md:w-[32%] lg:w-[calc(25%-12px)] shrink-0 snap-start bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 p-4 sm:p-5 shadow-xs flex items-center gap-3.5 sm:gap-4 select-none text-left">
                  <div className="relative shrink-0">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex flex-col items-center justify-center text-center p-1">
                      <span className="text-[10px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-tight">No image</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm sm:text-base leading-snug truncate">{host.name}</h3>
                    <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 truncate mt-1">{host.city}</p>
                    <div className="flex items-center gap-1 text-xs font-bold text-neutral-700 dark:text-neutral-300 mt-1">
                      <Star className="w-3 h-3 text-[#C59A2F] fill-[#C59A2F]" />
                      <span>{host.rating}</span>
                      <span className="text-neutral-400 font-normal">({host.experienceCount})</span>
                    </div>
                  </div>
                </div>
              ))}
        </div>

        <button type="button" onClick={() => scroll("right")} className="absolute right-2 sm:right-4 top-[calc(50%-10px)] -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-md border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-200 flex items-center justify-center shadow-lg hover:scale-105 cursor-pointer" aria-label="Scroll right">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
}
