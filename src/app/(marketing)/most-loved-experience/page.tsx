import type { Metadata } from "next";
import { MostLovedExperiencesView } from "@/components/explore/section-views";

export const metadata: Metadata = {
  title: "Most Loved Experiences | Explore with Athithya",
  description:
    "Explore most booked and loved travel experiences in Uttarakhand hosted by local experts on Athithya.",
  alternates: { canonical: "https://athithya.in/most-loved-experience" },
  openGraph: {
    title: "Most Loved Experiences | Explore with Athithya",
    description: "Explore most booked travel experiences in Uttarakhand with local hosts.",
    url: "https://athithya.in/most-loved-experience",
    type: "website",
  },
};

export default function MostLovedExperiencePage() {
  return <MostLovedExperiencesView />;
}
