import type { Metadata } from "next";
import { CategoryExperiencesView } from "@/components/explore/section-views";

export const metadata: Metadata = {
  title: "River Rafting in Uttarakhand | Explore with Athithya",
  description:
    "Find all white water rafting related experiences on the Ganges and Alaknanda rivers in Uttarakhand.",
  alternates: { canonical: "https://athithya.in/rafting" },
  openGraph: {
    title: "River Rafting in Uttarakhand | Explore with Athithya",
    description: "Find all rafting related experiences at a single place.",
    url: "https://athithya.in/rafting",
    type: "website",
  },
};

export default function RaftingCategoryPage() {
  return (
    <CategoryExperiencesView
      slug="rafting"
      categoryName="Rafting"
      subtitle="Find all rafting related experiences at a single place."
    />
  );
}

