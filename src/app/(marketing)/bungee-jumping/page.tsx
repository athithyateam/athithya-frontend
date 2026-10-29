import type { Metadata } from "next";
import { CategoryExperiencesView } from "@/components/explore/section-views";

export const metadata: Metadata = {
  title: "Bungee Jumping in Uttarakhand | Explore with Athithya",
  description:
    "Find all bungee jumping related experiences in Rishikesh and Uttarakhand at a single place with verified hosts.",
  alternates: { canonical: "https://athithya.in/bungee-jumping" },
  openGraph: {
    title: "Bungee Jumping in Uttarakhand | Explore with Athithya",
    description: "Find all bungee jumping related experiences at a single place.",
    url: "https://athithya.in/bungee-jumping",
    type: "website",
  },
};

export default function BungeeJumpingCategoryPage() {
  return (
    <CategoryExperiencesView
      slug="bungee-jumping"
      categoryName="Bungee Jumping"
      subtitle="Find all bungee jumping related experiences at a single place."
    />
  );
}

