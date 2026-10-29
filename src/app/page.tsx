import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { MobileFooter } from "@/components/navigation/mobile-footer";
import { HomeHeroSection } from "@/components/home/home-hero-section";
import { BrandIntroSection } from "@/components/home/brand-intro-section";
import { HomeCategoriesSection } from "@/components/home/home-categories-section";
import { ExperienceSectionRow } from "@/components/home/experience-section-row";
import { TopRatedHostsSection } from "@/components/home/top-rated-hosts-section";
import { HomeReviewsSection } from "@/components/home/home-reviews-section";
import { FaqSection } from "@/components/home/faq-section";
import { routes } from "@/config/navigation";
import type { ExperienceItemPreview } from "@/components/home/experience-card-placeholder";

export const metadata: Metadata = {
  title: "Athithya | Your Travel Experience Platform",
  description:
    "Explore different travel experiences in Uttarakhand with local hosts, from treks, rafting, and paragliding to camping, safaris, bungee jumping, and much more.",
};

const placeholderExperiences: ExperienceItemPreview[] = [
  {
    id: "slot-1",
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
  },
  {
    id: "slot-2",
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
  },
  {
    id: "slot-3",
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
  },
  {
    id: "slot-4",
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
  },
  {
    id: "slot-5",
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
  },
];

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col pb-16 md:pb-0 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        <HomeHeroSection />
        <BrandIntroSection />
        <HomeCategoriesSection />

        <div className="md:pt-0 pb-2 md:pb-4">
          <ExperienceSectionRow
            title="Explore"
            highlight="Experiences"
            subtitle="Explore recent and new experiences"
            viewAllHref={routes.exploreExperience}
            items={placeholderExperiences}
          />

          <ExperienceSectionRow
            title="Featured"
            highlight="Experiences"
            subtitle="Explore most clicked experiences"
            viewAllHref={routes.featuredExperience}
            items={placeholderExperiences}
          />

          <ExperienceSectionRow
            title="Most Loved"
            highlight="Experiences"
            subtitle="Explore most booked experiences"
            viewAllHref={routes.mostLovedExperience}
            items={placeholderExperiences}
          />

          <ExperienceSectionRow
            title="Top Rated"
            highlight="Experiences"
            subtitle="Explore top rated experiences"
            viewAllHref={routes.topRatedExperience}
            items={placeholderExperiences}
          />

          <ExperienceSectionRow
            title="Nearby"
            highlight="Experiences"
            subtitle="Explore experiences near you"
            viewAllHref={routes.nearbyExperience}
            items={placeholderExperiences}
          />

          <TopRatedHostsSection />
          <HomeReviewsSection />
          <FaqSection />
        </div>
      </main>

      <Footer />
      <MobileFooter />
    </div>
  );
}
