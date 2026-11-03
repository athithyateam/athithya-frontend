import React from "react";
import { routes } from "@/config/navigation";
import { ExperienceSectionRow } from "./experience-section-row";
import { TopRatedHostsSection } from "./top-rated-hosts-section";
import { HomeReviewsSection } from "./home-reviews-section";
import {
  getHomeExploreExperiences,
  getHomeFeaturedExperiences,
  getHomeMostLovedExperiences,
  getHomeTopRatedExperiences,
  getHomeNearbyExperiences,
  getHomeTopRatedHosts,
  getHomeLatestReviews,
} from "@/lib/api/home-data";

export async function ExploreSectionServer() {
  const items = await getHomeExploreExperiences();
  return (
    <ExperienceSectionRow
      title="Explore"
      highlight="Experiences"
      subtitle="Explore recent and new experiences"
      viewAllHref={routes.exploreExperience}
      items={items}
      rowIndex={0}
    />
  );
}

export async function FeaturedSectionServer() {
  const items = await getHomeFeaturedExperiences();
  return (
    <ExperienceSectionRow
      title="Featured"
      highlight="Experiences"
      subtitle="Explore most clicked experiences"
      viewAllHref={routes.featuredExperience}
      items={items}
      rowIndex={1}
    />
  );
}

export async function MostLovedSectionServer() {
  const items = await getHomeMostLovedExperiences();
  return (
    <ExperienceSectionRow
      title="Most Loved"
      highlight="Experiences"
      subtitle="Explore most booked experiences"
      viewAllHref={routes.mostLovedExperience}
      items={items}
      rowIndex={2}
    />
  );
}

export async function TopRatedSectionServer() {
  const items = await getHomeTopRatedExperiences();
  return (
    <ExperienceSectionRow
      title="Top Rated"
      highlight="Experiences"
      subtitle="Explore top rated experiences"
      viewAllHref={routes.topRatedExperience}
      items={items}
      rowIndex={3}
    />
  );
}

export async function NearbySectionServer() {
  const items = await getHomeNearbyExperiences();
  return (
    <ExperienceSectionRow
      title="Nearby"
      highlight="Experiences"
      subtitle="Explore experiences near you"
      viewAllHref={routes.nearbyExperience}
      items={items}
      rowIndex={4}
    />
  );
}

export async function TopRatedHostsSectionServer() {
  const hosts = await getHomeTopRatedHosts();
  return <TopRatedHostsSection initialHosts={hosts} />;
}

export async function HomeReviewsSectionServer() {
  const reviews = await getHomeLatestReviews();
  return <HomeReviewsSection initialReviews={reviews} />;
}
