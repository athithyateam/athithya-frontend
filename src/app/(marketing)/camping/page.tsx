import type { Metadata } from "next";
import { CategoryExperiencesView } from "@/components/explore/section-views";

export const metadata: Metadata = {
  title: "Camping in Uttarakhand | Explore with Athithya",
  description:
    "Find all camping related experiences amidst valleys, riversides, and pine forests in Uttarakhand.",
  alternates: { canonical: "https://athithya.in/camping" },
  openGraph: {
    title: "Camping in Uttarakhand | Explore with Athithya",
    description: "Find all camping related experiences at a single place.",
    url: "https://athithya.in/camping",
    type: "website",
  },
};

export default function CampingCategoryPage() {
  return (
    <CategoryExperiencesView
      slug="camping"
      categoryName="Camping"
      subtitle="Find all camping related experiences at a single place."
    />
  );
}

