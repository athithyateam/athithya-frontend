import type { Metadata } from "next";
import { TopRatedExperiencesView } from "@/components/explore/section-views";

export const metadata: Metadata = {
  title: "Top Rated Experiences | Explore with Athithya",
  description:
    "Explore highest rated travel experiences, treks, and mountain adventures in Uttarakhand with local hosts.",
  alternates: { canonical: "https://athithya.in/top-rated-experience" },
  openGraph: {
    title: "Top Rated Experiences | Explore with Athithya",
    description: "Explore top rated travel experiences in Uttarakhand with local hosts.",
    url: "https://athithya.in/top-rated-experience",
    type: "website",
  },
};

export default function TopRatedExperiencePage() {
  return <TopRatedExperiencesView />;
}
