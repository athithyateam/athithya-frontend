import type { Metadata } from "next";
import { ExplorePageView } from "@/components/explore/explore-page-view";

export const metadata: Metadata = {
  title: "Explore Travel Experiences with Athithya",
  description: "Explore recent and new travel experiences in Uttarakhand with local hosts.",
};

export default function ExploreExperiencePage() {
  return (
    <ExplorePageView
      type="explore-experience"
      breadcrumb="Explore Experiences"
      title="Explore Travel Experiences with"
      highlight="Athithya"
      subtitle="Explore recent and new experiences"
    />
  );
}
