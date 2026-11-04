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
    sectionLoading,
    homeLoading,
    homeLoaded,
    fetchHomeData,
  } = useExploreStore();

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  const fallbackLoading = homeLoading || !homeLoaded;

  return (
    <div className="md:pt-0 pb-2 md:pb-4">
      {/* Section 1: Above-the-fold - Priority Loaded */}
      <ExperienceSectionRow
        title="Explore"
        highlight="Experiences"
        subtitle="Explore recent and new experiences"
        viewAllHref={routes.exploreExperience}
        items={latest}
        loading={sectionLoading?.latest ?? fallbackLoading}
        isPrioritySection={true}
        priorityCardsCount={6}
      />

      {/* Section 2: Above-the-fold / High Viewport - Priority Loaded */}
      <ExperienceSectionRow
        title="Featured"
        highlight="Experiences"
        subtitle="Explore most clicked experiences"
        viewAllHref={routes.featuredExperience}
        items={featured}
        loading={sectionLoading?.featured ?? fallbackLoading}
        isPrioritySection={true}
        priorityCardsCount={6}
      />

      {/* Section 3: Below-the-fold - Progressive Lazy Loaded */}
      <ExperienceSectionRow
        title="Most Loved"
        highlight="Experiences"
        subtitle="Explore most booked experiences"
        viewAllHref={routes.mostLovedExperience}
        items={mostLoved}
        loading={sectionLoading?.mostLoved ?? fallbackLoading}
        isPrioritySection={false}
      />

      {/* Section 4: Below-the-fold - Progressive Lazy Loaded */}
      <ExperienceSectionRow
        title="Top Rated"
        highlight="Experiences"
        subtitle="Explore top rated experiences"
        viewAllHref={routes.topRatedExperience}
        items={topRated}
        loading={sectionLoading?.topRated ?? fallbackLoading}
        isPrioritySection={false}
      />

      {/* Section 5: Below-the-fold - Progressive Lazy Loaded */}
      <ExperienceSectionRow
        title="Nearby"
        highlight="Experiences"
        subtitle="Explore experiences near you"
        viewAllHref={routes.nearbyExperience}
        items={nearby}
        loading={sectionLoading?.nearby ?? fallbackLoading}
        isPrioritySection={false}
      />

      <TopRatedHostsSection />
      <HomeReviewsSection />
      <FaqSection />
    </div>
  );
}
