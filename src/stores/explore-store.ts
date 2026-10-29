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
} from "@/lib/api/posts-api";
import { getLatestReviews } from "@/lib/api/bookings-api";

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
  res?.posts || res?.experiences || res?.treks || res?.services || res?.hosts || res?.reviews || res?.data || (Array.isArray(res) ? res : []);

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
    set({ homeLoading: true });
    let coords: { latitude?: number; longitude?: number } = {};
    if (typeof window !== "undefined") {
      try {
        const cached = localStorage.getItem("user_coords");
        if (cached) coords = JSON.parse(cached);
      } catch {
        coords = {};
      }
    }

    const [latestRes, topRatedRes, featuredRes, mostLovedRes, nearbyRes, hostsRes, catActRes, reviewsRes] =
      await Promise.allSettled([
        getLatestExperiences(16, 1, "latest"),
        getTopRatedTreks(16, 1, "rating"),
        getFeaturedExperiences(16, 1, "clicks"),
        getMostLovedExperiences(16, 1, "bookings"),
        getNearbyTreks({ ...coords, limit: 16 }),
        getTopRatedHosts(16, 1),
        getCategoryActivity(),
        getLatestReviews(16),
      ]);

    set({
      latest: latestRes.status === "fulfilled" ? extractList(latestRes.value) : [],
      topRated: topRatedRes.status === "fulfilled" ? extractList(topRatedRes.value) : [],
      featured: featuredRes.status === "fulfilled" ? extractList(featuredRes.value) : [],
      mostLoved: mostLovedRes.status === "fulfilled" ? extractList(mostLovedRes.value) : [],
      nearby: nearbyRes.status === "fulfilled" ? extractList(nearbyRes.value) : [],
      hosts: hostsRes.status === "fulfilled" ? extractList(hostsRes.value) : [],
      categoryActivity: catActRes.status === "fulfilled" && Array.isArray(catActRes.value?.data) ? catActRes.value.data : [],
      reviews: reviewsRes.status === "fulfilled" ? extractList(reviewsRes.value) : [],
      homeLoaded: true,
      homeLoading: false,
    });
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

