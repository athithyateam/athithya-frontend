"use client";

import { useState, useEffect } from "react";
import {
  getLatestExperiences,
  getFeaturedExperiences,
  getMostLovedExperiences,
  getTopRatedTreks,
  getNearbyTreks,
  getTopRatedHosts,
  listExperiences,
} from "@/lib/api/experiences-api";
import { ExplorePageView } from "./explore-page-view";

function extractList(res: any): any[] {
  return (
    res?.experiences ||
    res?.treks ||
    res?.services ||
    res?.hosts ||
    res?.data ||
    (Array.isArray(res) ? res : [])
  );
}

function useSectionList(fetchFn: () => Promise<any>, deps: any[] = []) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    fetchFn()
      .then((res) => {
        if (!isMounted) return;
        setItems(extractList(res));
      })
      .catch(() => {
        if (isMounted) setItems([]);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return { items, loading };
}

export function LatestExperiencesView() {
  const { items, loading } = useSectionList(() =>
    getLatestExperiences(100, 1, "latest")
  );

  return (
    <ExplorePageView
      type="explore-experience"
      breadcrumb="Explore Experiences"
      title="Explore Travel Experiences with"
      highlight="Athithya"
      subtitle="Explore recent and new experiences"
      items={items}
      loading={loading}
    />
  );
}

export function FeaturedExperiencesView() {
  const { items, loading } = useSectionList(() =>
    getFeaturedExperiences(100, 1, "clicks")
  );

  return (
    <ExplorePageView
      type="featured-experience"
      breadcrumb="Featured Experiences"
      title="Featured"
      highlight="Experiences"
      subtitle="Explore most clicked experiences"
      items={items}
      loading={loading}
    />
  );
}

export function MostLovedExperiencesView() {
  const { items, loading } = useSectionList(() =>
    getMostLovedExperiences(100, 1, "bookings")
  );

  return (
    <ExplorePageView
      type="most-loved-experience"
      breadcrumb="Most Loved Experiences"
      title="Most Loved"
      highlight="Experiences"
      subtitle="Explore most booked experiences"
      items={items}
      loading={loading}
    />
  );
}

export function TopRatedExperiencesView() {
  const { items, loading } = useSectionList(() =>
    getTopRatedTreks(100, 1, "rating")
  );

  return (
    <ExplorePageView
      type="top-rated-experience"
      breadcrumb="Top Rated Experiences"
      title="Top Rated"
      highlight="Experiences"
      subtitle="Explore top rated experiences"
      items={items}
      loading={loading}
    />
  );
}

export function NearbyExperiencesView() {
  const getCoords = () => {
    try {
      const cached = localStorage.getItem("user_coords");
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  };

  const { items, loading } = useSectionList(() =>
    getNearbyTreks({ ...getCoords(), limit: 100, page: 1 })
  );

  return (
    <ExplorePageView
      type="nearby-experience"
      breadcrumb="Nearby Experiences"
      title="Nearby"
      highlight="Experiences"
      subtitle="Explore experiences around your location"
      items={items}
      loading={loading}
    />
  );
}

export function TopRatedHostsView() {
  const { items, loading } = useSectionList(() => getTopRatedHosts(100, 1));

  return (
    <ExplorePageView
      type="top-rated-host"
      breadcrumb="Top Rated Hosts"
      title="Top Rated"
      highlight="Local Hosts"
      subtitle="Explore top rated hosts"
      isHostDiscovery={true}
      items={items}
      loading={loading}
    />
  );
}

export function CategoryExperiencesView({
  slug,
  categoryName,
  subtitle,
}: {
  slug: string;
  categoryName: string;
  subtitle: string;
}) {
  const fetchAllExperiences = async () => {
    try {
      const res = await listExperiences({ limit: 100, page: 1 });
      return res;
    } catch {
      return [];
    }
  };

  const { items, loading } = useSectionList(fetchAllExperiences, []);

  return (
    <ExplorePageView
      type={slug}
      breadcrumb={categoryName}
      title={categoryName}
      subtitle={subtitle}
      initialCategory={categoryName === "Others" ? "Other" : categoryName}
      items={items}
      loading={loading}
      hideHeader={true}
    />
  );
}
