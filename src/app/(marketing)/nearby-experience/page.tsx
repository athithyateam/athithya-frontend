import type { Metadata } from "next";
import { ExplorePageView } from "@/components/explore/explore-page-view";

export const metadata: Metadata = {
  title: "Nearby Experiences | Explore with Athithya",
  description: "Explore travel experiences near you in Uttarakhand with local hosts.",
};

export default function NearbyExperiencePage() {
  return (
    <ExplorePageView
      type="nearby-experience"
      breadcrumb="Nearby Experiences"
      title="Nearby"
      highlight="Experiences"
      subtitle="Explore experiences near you"
    />
  );
}
