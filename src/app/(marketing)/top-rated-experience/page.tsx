import type { Metadata } from "next";
import { ExplorePageView } from "@/components/explore/explore-page-view";

export const metadata: Metadata = {
  title: "Top Rated Experiences | Explore with Athithya",
  description: "Explore top rated travel experiences in Uttarakhand with local hosts.",
};

export default function TopRatedExperiencePage() {
  return (
    <ExplorePageView
      type="top-rated-experience"
      breadcrumb="Top Rated Experiences"
      title="Top Rated"
      highlight="Experiences"
      subtitle="Explore top rated experiences"
    />
  );
}
