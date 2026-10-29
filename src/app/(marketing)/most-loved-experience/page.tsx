import type { Metadata } from "next";
import { ExplorePageView } from "@/components/explore/explore-page-view";

export const metadata: Metadata = {
  title: "Most Loved Experiences | Explore with Athithya",
  description: "Explore most booked travel experiences in Uttarakhand with local hosts.",
};

export default function MostLovedExperiencePage() {
  return (
    <ExplorePageView
      type="most-loved-experience"
      breadcrumb="Most Loved Experiences"
      title="Most Loved"
      highlight="Experiences"
      subtitle="Explore most booked experiences"
    />
  );
}
