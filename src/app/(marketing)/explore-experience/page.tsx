import type { Metadata } from "next";
import { LatestExperiencesView } from "@/components/explore/section-views";

export const metadata: Metadata = {
  title: "Travel Experiences | Explore with Athithya",
  description:
    "Explore Uttarakhand on Athithya and discover different travel experiences hosted by local hosts. From trekking, rafting and camping to bungee jumping, paragliding, safaris and much more, all in one place.",
  alternates: { canonical: "https://athithya.in/explore-experience" },
  openGraph: {
    title: "Travel Experiences | Explore with Athithya",
    description: "Explore recent and new travel experiences in Uttarakhand with local hosts.",
    url: "https://athithya.in/explore-experience",
    type: "website",
  },
};

export default function ExploreExperiencePage() {
  return <LatestExperiencesView />;
}
