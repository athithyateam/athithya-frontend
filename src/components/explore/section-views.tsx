"use client";

import { useState, useEffect } from "react";
import {
  getLatestExperiences,
  getFeaturedExperiences,
  getMostLovedExperiences,
  getTopRatedTreks,
  getNearbyTreks,
  getTopRatedHosts,
  listServices,
} from "@/lib/api/posts-api";
import { ExplorePageView } from "./explore-page-view";

function extractList(res: any): any[] {
  return (
    res?.posts ||
    res?.experiences ||
    res?.treks ||
    res?.services ||
    res?.hosts ||
    res?.data ||
    (Array.isArray(res) ? res : [])
  );
}

export function LatestExperiencesView() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getLatestExperiences(100, 1, "latest")
      .then((res) => setItems(extractList(res)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);
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
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getFeaturedExperiences(100, 1, "clicks")
      .then((res) => setItems(extractList(res)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);
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
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getMostLovedExperiences(100, 1, "bookings")
      .then((res) => setItems(extractList(res)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);
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
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getTopRatedTreks(100, 1, "rating")
      .then((res) => setItems(extractList(res)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);
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
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let coords: Record<string, any> = {};
    try {
      const cached = localStorage.getItem("user_coords");
      if (cached) coords = JSON.parse(cached);
    } catch {}
    getNearbyTreks({ ...coords, limit: 100, page: 1 })
      .then((res) => setItems(extractList(res)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);
  return (
    <ExplorePageView
      type="nearby-experience"
      breadcrumb="Nearby Experiences"
      title="Nearby"
      highlight="Experiences"
      subtitle="Explore experiences near you"
      items={items}
      loading={loading}
    />
  );
}

export function TopRatedHostsView() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    getTopRatedHosts(100, 1)
      .then((res) => setItems(extractList(res)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);
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
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    listServices({ category: categoryName, limit: 100, page: 1 })
      .then((res) => setItems(extractList(res)))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [categoryName]);
  return (
    <ExplorePageView
      type={slug}
      breadcrumb={categoryName}
      title={categoryName}
      subtitle={subtitle}
      initialCategory={categoryName === "Others" ? "Other" : categoryName}
      items={items}
      loading={loading}
    />
  );
}

