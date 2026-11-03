import type { Metadata } from "next";
import { NearbyExperiencesView } from "@/components/explore/section-views";

export const metadata: Metadata = {
  title: "Nearby Experiences | Explore with Athithya",
  description:
    "Discover authentic travel experiences, treks, and outdoor activities near your current location in Uttarakhand.",
  alternates: { canonical: "https://athithya.in/nearby-experience" },
  openGraph: {
    title: "Nearby Experiences | Explore with Athithya",
    description: "Explore travel experiences near you in Uttarakhand with local hosts.",
    url: "https://athithya.in/nearby-experience",
    type: "website",
  },
};

export default function NearbyExperiencePage() {
  return <NearbyExperiencesView />;
}
