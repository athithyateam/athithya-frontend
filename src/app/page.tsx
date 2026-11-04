import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { MobileFooter } from "@/components/navigation/mobile-footer";
import { HomeHeroSection } from "@/components/home/home-hero-section";
import { BrandIntroSection } from "@/components/home/brand-intro-section";
import { HomeCategoriesSection } from "@/components/home/home-categories-section";
import { FaqSection } from "@/components/home/faq-section";
import { ExperienceSectionRowSkeleton } from "@/components/home/experience-section-row-skeleton";
import { TopRatedHostsSectionSkeleton } from "@/components/home/top-rated-hosts-section";
import {
  ExploreSectionServer,
  FeaturedSectionServer,
  MostLovedSectionServer,
  TopRatedSectionServer,
  NearbySectionServer,
  TopRatedHostsSectionServer,
  HomeReviewsSectionServer,
} from "@/components/home/server-sections";
import { ProgressiveStageProvider } from "@/lib/progressive-stage-context";
import { routes } from "@/config/navigation";

export const metadata: Metadata = {
  title: "Athithya | Your Travel Experience Platform",
  description:
    "Explore different travel experiences in Uttarakhand with local hosts, from treks, rafting, and paragliding to camping, safaris, bungee jumping, and much more.",
};

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col pb-16 md:pb-0 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        <HomeHeroSection />
        <BrandIntroSection />
        <HomeCategoriesSection />

        <ProgressiveStageProvider>
          <div className="md:pt-0 pb-2 md:pb-4">
            <Suspense
              fallback={
                <ExperienceSectionRowSkeleton
                  title="Explore"
                  highlight="Experiences"
                  subtitle="Explore recent and new experiences"
                  viewAllHref={routes.exploreExperience}
                />
              }
            >
              <ExploreSectionServer />
            </Suspense>

            <Suspense
              fallback={
                <ExperienceSectionRowSkeleton
                  title="Featured"
                  highlight="Experiences"
                  subtitle="Explore most clicked experiences"
                  viewAllHref={routes.featuredExperience}
                />
              }
            >
              <FeaturedSectionServer />
            </Suspense>

            <Suspense
              fallback={
                <ExperienceSectionRowSkeleton
                  title="Most Loved"
                  highlight="Experiences"
                  subtitle="Explore most booked experiences"
                  viewAllHref={routes.mostLovedExperience}
                />
              }
            >
              <MostLovedSectionServer />
            </Suspense>

            <Suspense
              fallback={
                <ExperienceSectionRowSkeleton
                  title="Top Rated"
                  highlight="Experiences"
                  subtitle="Explore top rated experiences"
                  viewAllHref={routes.topRatedExperience}
                />
              }
            >
              <TopRatedSectionServer />
            </Suspense>

            <Suspense
              fallback={
                <ExperienceSectionRowSkeleton
                  title="Nearby"
                  highlight="Experiences"
                  subtitle="Explore experiences near you"
                  viewAllHref={routes.nearbyExperience}
                />
              }
            >
              <NearbySectionServer />
            </Suspense>

            <Suspense fallback={<TopRatedHostsSectionSkeleton />}>
              <TopRatedHostsSectionServer />
            </Suspense>

            <Suspense fallback={null}>
              <HomeReviewsSectionServer />
            </Suspense>

            <FaqSection />
          </div>
        </ProgressiveStageProvider>
      </main>

      <Footer />
      <MobileFooter />
    </div>
  );
}
