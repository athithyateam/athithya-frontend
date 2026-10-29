import type { Metadata } from "next";
import { CategoryExperiencesView } from "@/components/explore/section-views";

export const metadata: Metadata = {
  title: "Other Adventure Experiences in Uttarakhand | Explore with Athithya",
  description:
    "Find rock climbing, flyboarding, guided trails, and unique adventure experiences across Uttarakhand.",
  alternates: { canonical: "https://athithya.in/other" },
  openGraph: {
    title: "Other Adventure Experiences in Uttarakhand | Explore with Athithya",
    description: "Find all others related experiences at a single place.",
    url: "https://athithya.in/other",
    type: "website",
  },
};

export default function OtherCategoryPage() {
  return (
    <CategoryExperiencesView
      slug="other"
      categoryName="Others"
      subtitle="Find all others related experiences at a single place."
    />
  );
}

