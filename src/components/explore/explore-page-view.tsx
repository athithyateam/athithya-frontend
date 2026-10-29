"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SlidersHorizontal, ChevronLeft, ChevronRight } from "lucide-react";
import { routes } from "@/config/navigation";
import { useExploreStore } from "@/stores/explore-store";
import {
  getTopRatedTreks,
  getFeaturedExperiences,
  getMostLovedExperiences,
  getLatestExperiences,
  getNearbyTreks,
  getTopRatedHosts,
  listServices,
} from "@/lib/api/posts-api";
import {
  getItemCategories,
  getItemLocation,
  getItemPrice,
  getItemDurationDays,
  getItemRating,
} from "@/lib/experience-helpers";
import { ExperienceCard } from "@/components/cards/experience-card";
import { HostCard } from "@/components/cards/host-card";
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

const CATEGORY_SLUG_MAP: Record<string, string> = {
  bungee: "Bungee Jumping",
  "bungee-jumping": "Bungee Jumping",
  paragliding: "Paragliding",
  trek: "Trek",
  trekking: "Trek",
  camping: "Camping",
  rafting: "Rafting",
  safari: "Safari",
  "rock-climbing": "Other",
  flyboarding: "Other",
  "experience-guide": "Other",
  other: "Other",
  others: "Other",
};

const normalizeCategoryToMain = (catStr: string) => {
  const lc = String(catStr || "").toLowerCase().trim();
  if (lc.includes("bungee")) return "Bungee Jumping";
  if (lc.includes("paraglid")) return "Paragliding";
  if (lc.includes("trek")) return "Trek";
  if (lc.includes("camp")) return "Camping";
  if (lc.includes("raft")) return "Rafting";
  if (lc.includes("safari")) return "Safari";
  return "Other";
};

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
  const router = useRouter();
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [rawResults, setRawResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const ITEMS_PER_PAGE = 12;

  const {
    selectedCategories,
    selectedLocation,
    priceRange,
    selectedDurations,
    selectedRating,
    sortBy,
    page,
    setFilter,
    resetFilters,
  } = useExploreStore();

  useEffect(() => {
    const initialCat = type && CATEGORY_SLUG_MAP[type.toLowerCase()] ? CATEGORY_SLUG_MAP[type.toLowerCase()] : null;
    resetFilters(initialCat);
  }, [type, resetFilters]);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        let resData: any;
        if (type === "top-rated-experience") resData = await getTopRatedTreks(100, 1, "rating");
        else if (type === "featured-experience") resData = await getFeaturedExperiences(100, 1, "clicks");
        else if (type === "most-loved-experience") resData = await getMostLovedExperiences(100, 1, "bookings");
        else if (type === "explore-experience") resData = await getLatestExperiences(100, 1, "latest");
        else if (type === "nearby-experience") {
          let coords: any = {};
          try {
            const cached = localStorage.getItem("user_coords");
            if (cached) coords = JSON.parse(cached);
          } catch {}
          resData = await getNearbyTreks({ ...coords, limit: 100, page: 1 });
        } else if (type === "top-rated-host") resData = await getTopRatedHosts(100, 1);
        else resData = await listServices({ limit: 100, page: 1 });

        const list = resData?.posts || resData?.experiences || resData?.treks || resData?.services || resData?.hosts || resData?.data || (Array.isArray(resData) ? resData : []);
        if (!active) return;
        setRawResults(list);

        const counts: Record<string, number> = {};
        const locs = new Set<string>();
        list.forEach((item: any) => {
          const loc = getItemLocation(item);
          if (loc) locs.add(loc.trim());
          getItemCategories(item).forEach((c) => {
            const m = normalizeCategoryToMain(c).toLowerCase();
            counts[m] = (counts[m] || 0) + 1;
          });
        });
        setFilter("categoryCounts", counts);
        setFilter("availableLocations", Array.from(locs).sort());
      } catch {
        if (active) setRawResults([]);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [type, setFilter]);

  const filteredResults = useMemo(() => {
    let list = [...rawResults];
    if (!isHostDiscovery && selectedCategories.length > 0) {
      list = list.filter((item) => {
        const cats = getItemCategories(item);
        return selectedCategories.some((sc) => {
          const scLow = sc.toLowerCase();
          return cats.some((ic) => normalizeCategoryToMain(ic).toLowerCase() === scLow || ic.toLowerCase().includes(scLow));
        });
      });
    }
    if (selectedLocation !== "all") {
      list = list.filter((item) => getItemLocation(item).toLowerCase().includes(selectedLocation.toLowerCase()));
    }
    if (!isHostDiscovery && priceRange !== "all") {
      list = list.filter((item) => {
        const p = getItemPrice(item);
        if (priceRange === "under1k") return p > 0 && p <= 1000;
        if (priceRange === "1k-3k") return p > 1000 && p <= 3000;
        if (priceRange === "3k-5k") return p > 3000 && p <= 5000;
        if (priceRange === "5k-8k") return p > 5000 && p <= 8000;
        if (priceRange === "8k-12k") return p > 8000 && p <= 12000;
        if (priceRange === "12k-15k") return p > 12000 && p <= 15000;
        if (priceRange === "15k-18k") return p > 15000 && p <= 18000;
        if (priceRange === "above20k") return p > 20000;
        return true;
      });
    }
    if (!isHostDiscovery && selectedDurations.length > 0) {
      list = list.filter((item) => {
        const d = getItemDurationDays(item);
        return selectedDurations.some((dur) => (dur === "8+days" ? d >= 8 : d === parseInt(dur, 10)));
      });
    }
    if (selectedRating !== "all") {
      const target = Number(selectedRating);
      list = list.filter((item) => Math.floor(getItemRating(item) || 4.8) >= target);
    }
    if (sortBy === "price_asc") list.sort((a, b) => getItemPrice(a) - getItemPrice(b));
    else if (sortBy === "price_desc") list.sort((a, b) => getItemPrice(b) - getItemPrice(a));
    else if (sortBy === "rating_desc") list.sort((a, b) => getItemRating(b) - getItemRating(a));
    else if (sortBy === "trips_desc") list.sort((a, b) => (b.tripsHosted || 0) - (a.tripsHosted || 0));
    return list;
  }, [rawResults, isHostDiscovery, selectedCategories, selectedLocation, priceRange, selectedDurations, selectedRating, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredResults.length / ITEMS_PER_PAGE));
  const paginatedItems = filteredResults.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  const showPlaceholders = !loading && rawResults.length === 0;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors pt-24 md:pt-28 pb-16">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex items-center gap-2 text-xs font-bold text-neutral-400 mb-4 text-left">
          <Link href={routes.home} className="hover:text-[#C59A2F] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#C59A2F] font-extrabold capitalize">{breadcrumb}</span>
        </div>

        <div className="mb-6 text-left">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
            {title} {highlight && <span className="text-[#C59A2F]">{highlight}</span>}
          </h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm font-bold mt-2">{subtitle}</p>
        </div>

        <div className="lg:hidden flex items-center gap-3 mb-6">
          <button type="button" onClick={() => setShowMobileSidebar(!showMobileSidebar)} className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-[#C59A2F] text-white font-extrabold text-xs uppercase tracking-wider shrink-0 shadow-md cursor-pointer">
            <SlidersHorizontal size={14} /><span>Filter</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8 items-start">
          <ExploreFilterSidebar currentType={type} isHostDiscovery={isHostDiscovery} isOpenMobile={showMobileSidebar} onCloseMobile={() => setShowMobileSidebar(false)} />

          <main className="lg:col-span-3 space-y-6 text-left">
            <div className="bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <span className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100">
                {showPlaceholders ? dummySlots.length : filteredResults.length} {isHostDiscovery ? "Hosts" : "Experiences"} Found
              </span>

              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-neutral-500 dark:text-neutral-400 shrink-0">Sort by:</label>
                <select value={sortBy} onChange={(e) => setFilter("sortBy", e.target.value)} className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-3 py-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200 focus:outline-none focus:border-[#C59A2F]">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {showPlaceholders
                ? dummySlots.map((item) => (isHostDiscovery ? <HostCardPlaceholder key={item.id} /> : <ExperienceCardPlaceholder key={item.id} item={item} />))
                : paginatedItems.map((item: any) =>
                    isHostDiscovery ? (
                      <HostCard
                        key={item._id || item.id}
                        id={item._id || item.id}
                        image={item.avatar || item.profilePic}
                        name={[item.firstname, item.lastname].filter(Boolean).join(" ") || item.name || "Local Host"}
                        location={item.city || item.district || "Uttarakhand"}
                        tripsHosted={item.tripsHosted ?? item.experienceCount ?? 0}
                        rating={item.averageRating || item.rating?.average || item.rating}
                        verifyBadge={item.verifyBadge}
                        onClick={() => router.push(`/profile/${item._id || item.id}`)}
                      />
                    ) : (
                      <ExperienceCard key={item._id || item.id} data={item} showBookmark className="w-full" />
                    )
                  )}
            </div>

            <div className="pt-6 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-between">
              <button type="button" disabled={page <= 1} onClick={() => setFilter("page", Math.max(1, page - 1))} className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-xs flex items-center gap-1 disabled:opacity-50 cursor-pointer">
                <ChevronLeft size={14} /><span>Previous</span>
              </button>
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">Page {page} of {totalPages}</span>
              <button type="button" disabled={page >= totalPages} onClick={() => setFilter("page", Math.min(totalPages, page + 1))} className="px-4 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold text-xs flex items-center gap-1 disabled:opacity-50 cursor-pointer">
                <span>Next</span><ChevronRight size={14} />
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
