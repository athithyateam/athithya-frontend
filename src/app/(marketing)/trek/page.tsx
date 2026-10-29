import type { Metadata } from "next";
import { CategoryExperiencesView } from "@/components/explore/section-views";

export const metadata: Metadata = {
  title: "Himalayan Treks in Uttarakhand | Explore with Athithya",
  description:
    "Find all trek related experiences and Himalayan mountain trails across Uttarakhand at a single place.",
  alternates: { canonical: "https://athithya.in/trek" },
  openGraph: {
    title: "Himalayan Treks in Uttarakhand | Explore with Athithya",
    description: "Find all trek related experiences at a single place.",
    url: "https://athithya.in/trek",
    type: "website",
  },
};

export default function TrekCategoryPage() {
  return (
    <CategoryExperiencesView
      slug="trek"
      categoryName="Trek"
      subtitle="Find all trek related experiences at a single place."
    />
  );
}

