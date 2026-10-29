import type { Metadata } from "next";
import { CategoryExperiencesView } from "@/components/explore/section-views";

export const metadata: Metadata = {
  title: "Paragliding in Uttarakhand | Explore with Athithya",
  description:
    "Find all paragliding related experiences across Uttarakhand valleys at a single place with local hosts.",
  alternates: { canonical: "https://athithya.in/paragliding" },
  openGraph: {
    title: "Paragliding in Uttarakhand | Explore with Athithya",
    description: "Find all paragliding related experiences at a single place.",
    url: "https://athithya.in/paragliding",
    type: "website",
  },
};

export default function ParaglidingCategoryPage() {
  return (
    <CategoryExperiencesView
      slug="paragliding"
      categoryName="Paragliding"
      subtitle="Find all paragliding related experiences at a single place."
    />
  );
}

