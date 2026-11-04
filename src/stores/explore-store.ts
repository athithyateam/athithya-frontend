"use client";

import { create } from "zustand";
import {
  getLatestExperiences,
  getTopRatedTreks,
  getFeaturedExperiences,
  getMostLovedExperiences,
  getNearbyTreks,
  getTopRatedHosts,
  getCategoryActivity,
} from "@/lib/api/experiences-api";
import { getLatestReviews } from "@/lib/api/bookings-api";

export interface ExploreSectionLoading {
  latest: boolean;
  featured: boolean;
  mostLoved: boolean;
  topRated: boolean;
  nearby: boolean;
  hosts: boolean;
  reviews: boolean;
}

interface ExploreState {
  latest: any[];
  topRated: any[];
  featured: any[];
  nearby: any[];
  mostLoved: any[];
  hosts: any[];
  categoryActivity: any[];
  reviews: any[];
  homeLoaded: boolean;
  homeLoading: boolean;
  sectionLoading: ExploreSectionLoading;
  // Explore Page Filters
  selectedCategories: string[];
  selectedLocation: string;
  priceRange: string;
  selectedDurations: string[];
  selectedRating: string;
  sortBy: string;
  searchQuery: string;
  page: number;
  categoryCounts: Record<string, number>;
  availableLocations: string[];
  fetchHomeData: (force?: boolean) => Promise<void>;
  setFilter: <K extends keyof ExploreState>(key: K, value: ExploreState[K]) => void;
  toggleCategory: (cat: string) => void;
  toggleDuration: (dur: string) => void;
  resetFilters: (initialCategory?: string | null) => void;
}

const extractList = (res: any): any[] =>
  res?.experiences || res?.treks || res?.hosts || res?.reviews || res?.services || res?.posts || res?.data || (Array.isArray(res) ? res : []);

const initialSectionLoading: ExploreSectionLoading = {
  latest: true,
  featured: true,
  mostLoved: true,
  topRated: true,
  nearby: true,
  hosts: true,
  reviews: true,
};

export const useExploreStore = create<ExploreState>((set, get) => ({
  latest: [],
  topRated: [],
  featured: [],
  nearby: [],
  mostLoved: [],
  hosts: [],
  categoryActivity: [],
  reviews: [],
  homeLoaded: false,
  homeLoading: false,
  sectionLoading: { ...initialSectionLoading },
  selectedCategories: [],
  selectedLocation: "all",
  priceRange: "all",
  selectedDurations: [],
  selectedRating: "all",
  sortBy: "default",
  searchQuery: "",
  page: 1,
  categoryCounts: {},
  availableLocations: [],

  fetchHomeData: async (force = false) => {
    if (get().homeLoaded && !force) return;
    set({ homeLoading: true, sectionLoading: { ...initialSectionLoading } });
    let coords: { latitude?: number; longitude?: number } = {};
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("user_coords");
        if (cached) coords = JSON.parse(cached);
      } catch {
        coords = {};
      }
    }

    // Phase 1 (Above-the-fold / Priority): Fetch first 6 cards for top sections immediately
    const fetchLatestP1 = getLatestExperiences(6, 1, "latest")
      .then((res) => {
        const items = extractList(res);
        set((state) => ({
          latest: items,
          sectionLoading: { ...state.sectionLoading, latest: false },
          homeLoading: false,
        }));
        return items;
      })
      .catch(() => {
        set((state) => ({
          sectionLoading: { ...state.sectionLoading, latest: false },
          homeLoading: false,
        }));
        return [];
      });

    const fetchFeaturedP1 = getFeaturedExperiences(6, 1, "clicks")
      .then((res) => {
        const items = extractList(res);
        set((state) => ({
          featured: items,
          sectionLoading: { ...state.sectionLoading, featured: false },
        }));
        return items;
      })
      .catch(() => {
        set((state) => ({
          sectionLoading: { ...state.sectionLoading, featured: false },
        }));
        return [];
      });

    // Phase 2 (Progressive Below-the-fold): Concurrently load remaining sections independently
    const fetchMostLoved = getMostLovedExperiences(6, 1, "bookings")
      .then((res) => {
        set((state) => ({
          mostLoved: extractList(res),
          sectionLoading: { ...state.sectionLoading, mostLoved: false },
        }));
      })
      .catch(() => {
        set((state) => ({
          sectionLoading: { ...state.sectionLoading, mostLoved: false },
        }));
      });

    const fetchTopRated = getTopRatedTreks(6, 1, "rating")
      .then((res) => {
        set((state) => ({
          topRated: extractList(res),
          sectionLoading: { ...state.sectionLoading, topRated: false },
        }));
      })
      .catch(() => {
        set((state) => ({
          sectionLoading: { ...state.sectionLoading, topRated: false },
        }));
      });

    const fetchNearby = getNearbyTreks({ ...coords, limit: 6 })
      .then((res) => {
        set((state) => ({
          nearby: extractList(res),
          sectionLoading: { ...state.sectionLoading, nearby: false },
        }));
      })
      .catch(() => {
        set((state) => ({
          sectionLoading: { ...state.sectionLoading, nearby: false },
        }));
      });

    const fetchHosts = getTopRatedHosts(8, 1)
      .then((res) => {
        set((state) => ({
          hosts: extractList(res),
          sectionLoading: { ...state.sectionLoading, hosts: false },
        }));
      })
      .catch(() => {
        set((state) => ({
          sectionLoading: { ...state.sectionLoading, hosts: false },
        }));
      });

    const fetchCatAct = getCategoryActivity()
      .then((res) => {
        set({
          categoryActivity: Array.isArray(res?.data) ? res.data : [],
        });
      })
      .catch(() => {});

    const fetchReviews = getLatestReviews(8)
      .then((res) => {
        set((state) => ({
          reviews: extractList(res),
          sectionLoading: { ...state.sectionLoading, reviews: false },
        }));
      })
      .catch(() => {
        set((state) => ({
          sectionLoading: { ...state.sectionLoading, reviews: false },
        }));
      });

    // Await all initial queries to finalize homeLoaded status
    await Promise.allSettled([
      fetchLatestP1,
      fetchFeaturedP1,
      fetchMostLoved,
      fetchTopRated,
      fetchNearby,
      fetchHosts,
      fetchCatAct,
      fetchReviews,
    ]);

    set({ homeLoaded: true, homeLoading: false });

    // Phase 3 (Progressive Expansion): Fetch additional records in background for smooth horizontal sliding
    setTimeout(async () => {
      try {
        const [latestMore, featuredMore, mostLovedMore, topRatedMore, nearbyMore] =
          await Promise.allSettled([
            getLatestExperiences(16, 1, "latest"),
            getFeaturedExperiences(16, 1, "clicks"),
            getMostLovedExperiences(16, 1, "bookings"),
            getTopRatedTreks(16, 1, "rating"),
            getNearbyTreks({ ...coords, limit: 16 }),
          ]);

        const updates: Partial<ExploreState> = {};
        if (latestMore.status === "fulfilled") {
          const list = extractList(latestMore.value);
          if (list.length > 0) updates.latest = list;
        }
        if (featuredMore.status === "fulfilled") {
          const list = extractList(featuredMore.value);
          if (list.length > 0) updates.featured = list;
        }
        if (mostLovedMore.status === "fulfilled") {
          const list = extractList(mostLovedMore.value);
          if (list.length > 0) updates.mostLoved = list;
        }
        if (topRatedMore.status === "fulfilled") {
          const list = extractList(topRatedMore.value);
          if (list.length > 0) updates.topRated = list;
        }
        if (nearbyMore.status === "fulfilled") {
          const list = extractList(nearbyMore.value);
          if (list.length > 0) updates.nearby = list;
        }

        if (Object.keys(updates).length > 0) {
          set(updates);
        }
      } catch {
        // Non-blocking background fetch
      }
    }, 1200);
  },

  setFilter: (key, value) => set({ [key]: value } as any),

  toggleCategory: (cat) => {
    const prev = get().selectedCategories;
    const lc = cat.toLowerCase().trim();
    const exists = prev.some((c) => c.toLowerCase().trim() === lc);
    set({
      selectedCategories: exists ? prev.filter((c) => c.toLowerCase().trim() !== lc) : [...prev, cat.trim()],
      page: 1,
    });
  },

  toggleDuration: (dur) => {
    const prev = get().selectedDurations;
    set({
      selectedDurations: prev.includes(dur) ? prev.filter((d) => d !== dur) : [...prev, dur],
      page: 1,
    });
  },

  resetFilters: (initialCategory = null) =>
    set({
      selectedCategories: initialCategory ? [initialCategory] : [],
      selectedLocation: "all",
      priceRange: "all",
      selectedDurations: [],
      selectedRating: "all",
      sortBy: "default",
      page: 1,
    }),
}));
