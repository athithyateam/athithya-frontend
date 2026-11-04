import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { MobileFooter } from "@/components/navigation/mobile-footer";
import { CATEGORIES_DATA } from "@/data/categories";
import { CategoryCard } from "@/components/cards/category-card";

export { CATEGORIES_DATA };

export const metadata: Metadata = {
  title: "Explore Travel Categories & Activities | Athithya",
  description:
    "Explore authentic travel experiences across Uttarakhand by category, including trekking, river rafting, paragliding, camping, wildlife safaris, and bungee jumping with local hosts.",
  alternates: {
    canonical: "https://athithya.in/categories",
  },
  openGraph: {
    title: "Explore Travel Categories & Activities | Athithya",
    description:
      "Explore authentic travel experiences across Uttarakhand by category with verified local hosts.",
    url: "https://athithya.in/categories",
    siteName: "Athithya",
    type: "website",
  },
};

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 pt-24 md:pt-32 pb-16 px-4 sm:px-6 md:px-8 max-w-[1400px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8 sm:mb-10">
          <Link
            href="/"
            className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300 transition shrink-0 cursor-pointer"
            title="Back to Home"
          >
            <ArrowLeft size={16} />
          </Link>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C59A2F] flex items-center gap-1.5">
              <Compass size={12} /> Activities
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight uppercase leading-none mt-1">
              Explore <span className="text-[#C59A2F]">Activities</span>
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {CATEGORIES_DATA.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </main>

      <Footer />
      <MobileFooter />
    </div>
  );
}
