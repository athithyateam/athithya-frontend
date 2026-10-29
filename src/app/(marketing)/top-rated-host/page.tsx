import type { Metadata } from "next";
import { TopRatedHostsView } from "@/components/explore/section-views";

export const metadata: Metadata = {
  title: "Top Rated Local Hosts | Explore with Athithya",
  description:
    "Connect with top rated verified local hosts across Uttarakhand for authentic treks, homestays, and adventures.",
  alternates: { canonical: "https://athithya.in/top-rated-host" },
  openGraph: {
    title: "Top Rated Local Hosts | Explore with Athithya",
    description: "Explore top rated local hosts in Uttarakhand on Athithya.",
    url: "https://athithya.in/top-rated-host",
    type: "website",
  },
};

export default function TopRatedHostPage() {
  return <TopRatedHostsView />;
}
