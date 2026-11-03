"use client";

import { useEffect } from "react";
import { useExploreStore } from "@/stores/explore-store";
import { ExperienceSectionRow } from "./experience-section-row";
import { TopRatedHostsSection } from "./top-rated-hosts-section";
import { HomeReviewsSection } from "./home-reviews-section";
import { FaqSection } from "./faq-section";
import { routes } from "@/config/navigation";

export function HomeClientSections() {
  const {
    latest,
    featured,
    mostLoved,
    topRated,
    nearby,
    homeLoading,
    homeLoaded,
    fetchHomeData,
  } = useExploreStore();

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  const isLoading = homeLoading || !homeLoaded;

  return (
    <div className="md:pt-0 pb-2 md:pb-4">
      <ExperienceSectionRow
        title="Explore"
        highlight="Experiences"
        subtitle="Explore recent and new experiences"
        viewAllHref={routes.exploreExperience}
        items={latest}
        loading={isLoading}
      />

      <ExperienceSectionRow
        title="Featured"
        highlight="Experiences"
        subtitle="Explore most clicked experiences"
        viewAllHref={routes.featuredExperience}
        items={featured}
        loading={isLoading}
      />

      <ExperienceSectionRow
        title="Most Loved"
        highlight="Experiences"
        subtitle="Explore most booked experiences"
        viewAllHref={routes.mostLovedExperience}
        items={mostLoved}
        loading={isLoading}
      />

      <ExperienceSectionRow
        title="Top Rated"
        highlight="Experiences"
        subtitle="Explore top rated experiences"
        viewAllHref={routes.topRatedExperience}
        items={topRated}
        loading={isLoading}
      />

      <ExperienceSectionRow
        title="Nearby"
        highlight="Experiences"
        subtitle="Explore experiences near you"
        viewAllHref={routes.nearbyExperience}
        items={nearby}
        loading={isLoading}
      />

      <TopRatedHostsSection />
      <HomeReviewsSection />
      <FaqSection />
    </div>
  );
}
