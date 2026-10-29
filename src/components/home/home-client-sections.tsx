"use client";

import { useEffect } from "react";
import { useExploreStore } from "@/stores/explore-store";
import { ExperienceSectionRow } from "./experience-section-row";
import { TopRatedHostsSection } from "./top-rated-hosts-section";
import { HomeReviewsSection } from "./home-reviews-section";
import { FaqSection } from "./faq-section";
import { routes } from "@/config/navigation";
import type { ExperienceItemPreview } from "./experience-card-placeholder";

const placeholderExperiences: ExperienceItemPreview[] = Array.from({ length: 5 }).map((_, i) => ({
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

export function HomeClientSections() {
  const { latest, featured, mostLoved, topRated, nearby, fetchHomeData } = useExploreStore();

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  return (
    <div className="md:pt-0 pb-2 md:pb-4">
      <ExperienceSectionRow
        title="Explore"
        highlight="Experiences"
        subtitle="Explore recent and new experiences"
        viewAllHref={routes.exploreExperience}
        items={latest}
        placeholderItems={placeholderExperiences}
      />

      <ExperienceSectionRow
        title="Featured"
        highlight="Experiences"
        subtitle="Explore most clicked experiences"
        viewAllHref={routes.featuredExperience}
        items={featured}
        placeholderItems={placeholderExperiences}
      />

      <ExperienceSectionRow
        title="Most Loved"
        highlight="Experiences"
        subtitle="Explore most booked experiences"
        viewAllHref={routes.mostLovedExperience}
        items={mostLoved}
        placeholderItems={placeholderExperiences}
      />

      <ExperienceSectionRow
        title="Top Rated"
        highlight="Experiences"
        subtitle="Explore top rated experiences"
        viewAllHref={routes.topRatedExperience}
        items={topRated}
        placeholderItems={placeholderExperiences}
      />

      <ExperienceSectionRow
        title="Nearby"
        highlight="Experiences"
        subtitle="Explore experiences near you"
        viewAllHref={routes.nearbyExperience}
        items={nearby}
        placeholderItems={placeholderExperiences}
      />

      <TopRatedHostsSection />
      <HomeReviewsSection />
      <FaqSection />
    </div>
  );
}

