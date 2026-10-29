import type { Metadata } from "next";
import { ExplorePageView } from "@/components/explore/explore-page-view";

export const metadata: Metadata = {
  title: "Top Rated Hosts | Explore with Athithya",
  description: "Explore top rated local hosts in Uttarakhand on Athithya.",
};

export default function TopRatedHostPage() {
  return (
    <ExplorePageView
      type="top-rated-host"
      breadcrumb="Top Rated Hosts"
      title="Top Rated"
      highlight="Local Hosts"
      subtitle="Explore top rated hosts"
      isHostDiscovery={true}
    />
  );
}
