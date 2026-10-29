import type { Metadata } from "next";
import { ExplorePageView } from "@/components/explore/explore-page-view";

export const metadata: Metadata = {
  title: "Featured Experiences | Explore with Athithya",
  description: "Explore most clicked travel experiences in Uttarakhand with local hosts.",
};

export default function FeaturedExperiencePage() {
  return (
    <ExplorePageView
      type="featured-experience"
      breadcrumb="Featured Experiences"
      title="Featured"
      highlight="Experiences"
      subtitle="Explore most clicked experiences"
    />
  );
}
