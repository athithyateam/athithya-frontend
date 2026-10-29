"use client";

import { useState } from "react";
import Link from "next/link";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { routes } from "@/config/navigation";
import { ExperienceCardPlaceholder } from "@/components/home/experience-card-placeholder";
import { HostCardPlaceholder } from "./host-card-placeholder";
import { ExploreFilterSidebar } from "./explore-filter-sidebar";

export interface ExplorePageViewProps {
  type: string;
  breadcrumb: string;
  title: string;
  highlight?: string;
  subtitle: string;
  isHostDiscovery?: boolean;
}

const dummySlots = Array.from({ length: 6 }).map((_, i) => ({
  id: `slot-${i + 1}`,
  title: "No title",
  location: "No location",
  price: "No price",
  rating: "No rating",
  reviewCount: "No reviews",
  image: "",
  postType: "No type",
  duration: "No duration",
  hostName: "No host",
  description: "No description",
}));

export function ExplorePageView({
  type,
  breadcrumb,
  title,
  highlight,
  subtitle,
  isHostDiscovery = false,
}: ExplorePageViewProps) {
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [sortBy, setSortBy] = useState("default");

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors pt-24 md:pt-28 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 mb-4 text-left">
          <Link href={routes.home} className="hover:text-[#C59A2F] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#C59A2F] font-extrabold capitalize">{breadcrumb}</span>
        </div>

        {/* Hero Header */}
        <div className="mb-6 text-left">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
            {title} {highlight && <span className="text-[#C59A2F]">{highlight}</span>}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm font-bold mt-2">
            {subtitle}
          </p>
        </div>

        {/* Mobile Filter Control Bar */}
        <div className="lg:hidden flex items-center gap-3 mb-6">
          <button
            type="button"
            onClick={() => setShowMobileSidebar(!showMobileSidebar)}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#C59A2F] text-white font-extrabold text-xs uppercase tracking-wider shrink-0 shadow-md cursor-pointer"
          >
            <SlidersHorizontal size={14} />
            <span>Filter</span>
          </button>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8 items-start">
          <ExploreFilterSidebar
            currentType={type}
            isHostDiscovery={isHostDiscovery}
            isOpenMobile={showMobileSidebar}
            onCloseMobile={() => setShowMobileSidebar(false)}
          />

          {/* Right Content Area */}
          <main className="lg:col-span-3 space-y-6 text-left">
            {/* Found Counter + Sort Selector */}
            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100">
                {dummySlots.length} {isHostDiscovery ? "Hosts" : "Experiences"} Found
              </span>

              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 shrink-0">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#C59A2F]"
                >
                  <option value="default">Recommended</option>
                  {!isHostDiscovery ? (
                    <>
                      <option value="price_asc">Price: Low to High</option>
                      <option value="price_desc">Price: High to Low</option>
                      <option value="rating_desc">Highest Rated</option>
                    </>
                  ) : (
                    <>
                      <option value="rating_desc">Highest Rated</option>
                      <option value="trips_desc">Most Trips Hosted</option>
                    </>
                  )}
                </select>
              </div>
            </div>

            {/* Content Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {dummySlots.map((item) =>
                isHostDiscovery ? (
                  <HostCardPlaceholder key={item.id} />
                ) : (
                  <ExperienceCardPlaceholder key={item.id} item={item} />
                )
              )}
            </div>

            {/* Pagination Controls */}
            <div className="pt-6 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
              <button
                type="button"
                disabled
                className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 font-bold text-xs flex items-center gap-1 cursor-not-allowed opacity-60"
              >
                <ChevronLeft size={14} />
                <span>Previous</span>
              </button>

              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
                Page 1 of 1
              </span>

              <button
                type="button"
                disabled
                className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-400 font-bold text-xs flex items-center gap-1 cursor-not-allowed opacity-60"
              >
                <span>Next</span>
                <ChevronRight size={14} />
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
