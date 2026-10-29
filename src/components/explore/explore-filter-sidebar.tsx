"use client";

import Link from "next/link";
import { SlidersHorizontal, X } from "lucide-react";
import { routes } from "@/config/navigation";
import { useExploreStore } from "@/stores/explore-store";

interface ExploreFilterSidebarProps {
  currentType: string;
  isHostDiscovery?: boolean;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

const activityCategories = [
  "Bungee Jumping",
  "Paragliding",
  "Trek",
  "Camping",
  "Rafting",
  "Safari",
  "Other",
];

const collections = [
  { id: "explore-experience", label: "Explore Experiences", href: routes.exploreExperience },
  { id: "featured-experience", label: "Featured Experiences", href: routes.featuredExperience },
  { id: "most-loved-experience", label: "Most Loved Experiences", href: routes.mostLovedExperience },
  { id: "top-rated-experience", label: "Top Rated Experiences", href: routes.topRatedExperience },
  { id: "nearby-experience", label: "Nearby Experiences", href: routes.nearbyExperience },
];

const budgetRanges = [
  { id: "all", label: "All Prices" },
  { id: "under1k", label: "Under ₹1,000" },
  { id: "1k-3k", label: "₹1,000 - ₹3,000" },
  { id: "3k-5k", label: "₹3,000 - ₹5,000" },
  { id: "5k-8k", label: "₹5,000 - ₹8,000" },
  { id: "8k-12k", label: "₹8,000 - ₹12,000" },
  { id: "12k-15k", label: "₹12,000 - ₹15,000" },
  { id: "15k-18k", label: "₹15,000 - ₹18,000" },
  { id: "above20k", label: "Above ₹20,000" },
];

const durationOptions = [
  { id: "1day", label: "1 Day" },
  { id: "2days", label: "2 Days" },
  { id: "3days", label: "3 Days" },
  { id: "4days", label: "4 Days" },
  { id: "5days", label: "5 Days" },
  { id: "6days", label: "6 Days" },
  { id: "7days", label: "7 Days" },
  { id: "8+days", label: "8+ Days" },
];

const ratings = [
  { id: "all", label: "All Ratings" },
  { id: "5", label: "5★ Rating" },
  { id: "4", label: "4★ Rating" },
  { id: "3", label: "3★ Rating" },
  { id: "2", label: "2★ Rating" },
];

export function ExploreFilterSidebar({
  currentType,
  isHostDiscovery = false,
  isOpenMobile,
  onCloseMobile,
}: ExploreFilterSidebarProps) {
  const {
    selectedCategories,
    selectedLocation,
    priceRange,
    selectedDurations,
    selectedRating,
    categoryCounts,
    availableLocations,
    toggleCategory,
    toggleDuration,
    setFilter,
    resetFilters,
  } = useExploreStore();

  return (
    <aside
      className={`lg:col-span-1 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-5 sm:p-6 shadow-xs space-y-5 lg:sticky lg:top-28 max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-hide text-left ${
        isOpenMobile ? "block" : "hidden lg:block"
      }`}
    >
      <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-neutral-800">
        <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#C59A2F]" />
          Filters
        </h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => resetFilters()}
            className="text-xs font-extrabold text-[#C59A2F] hover:underline cursor-pointer"
          >
            Reset All
          </button>
          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 transition cursor-pointer"
            aria-label="Close Filters"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {!isHostDiscovery && (
        <div>
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-2.5">
            Activity
          </h3>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {activityCategories.map((cat) => {
              const checked = selectedCategories.some((c) => c.toLowerCase() === cat.toLowerCase());
              const count = categoryCounts[cat.toLowerCase()] ?? 0;
              return (
                <label
                  key={cat}
                  className="flex items-center justify-between text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:text-[#C59A2F] transition-colors select-none py-0.5"
                >
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleCategory(cat)}
                      className="accent-[#C59A2F] rounded"
                    />
                    <span>{cat}</span>
                  </div>
                  <span className="text-[11px] font-extrabold text-neutral-400 dark:text-neutral-500">
                    ({count})
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      {availableLocations.length > 0 && (
        <div className="border-t border-neutral-200/80 dark:border-neutral-800 pt-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-2.5">
            Location
          </h3>
          <select
            value={selectedLocation}
            onChange={(e) => {
              setFilter("selectedLocation", e.target.value);
              setFilter("page", 1);
            }}
            className="w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-2 text-xs font-bold text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#C59A2F]"
          >
            <option value="all">All Locations</option>
            {availableLocations.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>
      )}

      {!isHostDiscovery && (
        <div className="border-t border-neutral-200/80 dark:border-neutral-800 pt-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-2.5">
            Collections
          </h3>
          <div className="space-y-1.5">
            {collections.map((col) => (
              <Link
                key={col.id}
                href={col.href}
                className={`flex items-center gap-2 text-xs font-bold transition-colors py-0.5 ${
                  currentType === col.id ? "text-[#C59A2F] font-black" : "text-neutral-700 dark:text-neutral-300 hover:text-[#C59A2F]"
                }`}
              >
                <input type="radio" readOnly checked={currentType === col.id} className="accent-[#C59A2F]" />
                <span>{col.label}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {!isHostDiscovery && (
        <div className="border-t border-neutral-200/80 dark:border-neutral-800 pt-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-2.5">
            Budget per person
          </h3>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {budgetRanges.map((b) => (
              <label key={b.id} className="flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:text-[#C59A2F] transition-colors select-none py-0.5">
                <input
                  type="radio"
                  name="budget"
                  checked={priceRange === b.id}
                  onChange={() => {
                    setFilter("priceRange", b.id);
                    setFilter("page", 1);
                  }}
                  className="accent-[#C59A2F]"
                />
                <span>{b.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {!isHostDiscovery && (
        <div className="border-t border-neutral-200/80 dark:border-neutral-800 pt-4">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-2.5">
            Duration
          </h3>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
            {durationOptions.map((dur) => (
              <label key={dur.id} className="flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:text-[#C59A2F] transition-colors select-none py-0.5">
                <input
                  type="checkbox"
                  checked={selectedDurations.includes(dur.id)}
                  onChange={() => toggleDuration(dur.id)}
                  className="accent-[#C59A2F] rounded"
                />
                <span>{dur.label}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="border-t border-neutral-200/80 dark:border-neutral-800 pt-4">
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-neutral-800 dark:text-neutral-200 mb-2.5">
          {isHostDiscovery ? "Host Rating" : "Rating"}
        </h3>
        <div className="space-y-1.5">
          {ratings.map((r) => (
            <label key={r.id} className="flex items-center gap-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 cursor-pointer hover:text-[#C59A2F] transition-colors select-none py-0.5">
              <input
                type="radio"
                name="rating"
                checked={selectedRating === r.id}
                onChange={() => {
                  setFilter("selectedRating", r.id);
                  setFilter("page", 1);
                }}
                className="accent-[#C59A2F]"
              />
              <span>{r.label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}
