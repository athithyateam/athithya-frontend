import type { Metadata } from "next";
import { CategoryExperiencesView } from "@/components/explore/section-views";

export const metadata: Metadata = {
  title: "Wildlife Safari in Uttarakhand | Explore with Athithya",
  description:
    "Find all wildlife and jungle safari related experiences in Jim Corbett and Rajaji National Park at a single place.",
  alternates: { canonical: "https://athithya.in/safari" },
  openGraph: {
    title: "Wildlife Safari in Uttarakhand | Explore with Athithya",
    description: "Find all safari related experiences at a single place.",
    url: "https://athithya.in/safari",
    type: "website",
  },
};

export default function SafariCategoryPage() {
  return (
    <CategoryExperiencesView
      slug="safari"
      categoryName="Safari"
      subtitle="Find all safari related experiences at a single place."
    />
  );
}

