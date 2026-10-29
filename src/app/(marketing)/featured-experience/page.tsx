import type { Metadata } from "next";
import { FeaturedExperiencesView } from "@/components/explore/section-views";

export const metadata: Metadata = {
  title: "Featured Experiences | Explore with Athithya",
  description:
    "Explore most clicked and featured travel experiences in Uttarakhand with verified local hosts on Athithya.",
  alternates: { canonical: "https://athithya.in/featured-experience" },
  openGraph: {
    title: "Featured Experiences | Explore with Athithya",
    description: "Explore most clicked travel experiences in Uttarakhand with local hosts.",
    url: "https://athithya.in/featured-experience",
    type: "website",
  },
};

export default function FeaturedExperiencePage() {
  return <FeaturedExperiencesView />;
}
