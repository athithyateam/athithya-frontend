import type { Metadata } from "next";
import { CategoryExperiencesView } from "@/components/explore/section-views";

export const metadata: Metadata = {
  title: "Treks | Athithya",
  description:
    "Find Yourself - Explore All Treks & Travel Experiences Across Uttarakhand with Local Hosts on Athithya.",
  alternates: { canonical: "https://athithya.in/trek" },
  openGraph: {
    title: "Treks | Athithya",
    description:
      "Find Yourself - Explore All Treks & Travel Experiences Across Uttarakhand with Local Hosts on Athithya.",
    url: "https://athithya.in/trek",
    type: "website",
  },
};

export default function TrekCategoryPage() {
  return (
    <div className="bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors pt-24 md:pt-28">
      {/* Top Header & Intro */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 space-y-6 text-left mb-6">
        {/* Title & Tagline */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
            Treks
          </h1>
          <p className="text-sm sm:text-base font-bold text-neutral-600 dark:text-neutral-400">
            Find Yourself - Explore All Treks &amp; Travel Experiences Across Uttarakhand with Local Hosts on Athithya.
          </p>
        </div>

        {/* Intro */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8">
          <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
            Want to explore the beauty of Uttarakhand? Trekking is a great way to start. From peaceful
            forest trails to challenging mountain routes, there’s something for different interests and
            fitness levels. Whether you’re looking for a refreshing break or an adventure that pushes
            your limits, find a trek that feels right for you.
          </p>
        </div>
      </div>

      {/* Experience Listings (Left Filter Sidebar + Right Cards Grid) */}
      <div className="w-full">
        <CategoryExperiencesView
          slug="trek"
          categoryName="Trek"
          subtitle="Explore all trekking experiences below"
        />
      </div>

      {/* Additional Content Sections Below Cards */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 space-y-6 text-left pb-20 pt-8">
        {/* Platform Info */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8">
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Athithya brings together treks and related travel experiences offered by different local hosts
            under one place. Explore all available options, reviews, compare offerings and find that one
            trek that matches your interests.
          </p>
        </div>

        {/* Find Your Next Trekking Experience on Athithya */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            Find Your Next Trekking Experience on Athithya
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Every trek is different. Some take you through quiet forests, while others lead towards
            mountain peaks and scenic views. Along the way, you can enjoy nature, take a break from
            your daily routine, experience Uttarakhand and it’s nature at your own pace. Explore
            trekking experiences and other travel experiences offered by local hosts on Athithya and
            find your next adventure.
          </p>
        </div>

        {/* Why Try Trekking? */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            Why Try Trekking?
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Trekking isn’t just about walking. It’s about challenging yourself, breathing in the fresh air,
            slowing down, connecting with nature and yourself. Every trek trail offers a chance to build
            strength, gain confidence, and discover nature you might never come across otherwise.
            Along the way, you can meet new people, make friends, try local food, and spend time with
            the people and communities that make these travel experience special.
          </p>
        </div>

        {/* Tips for a Safe Trek */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            Tips for a Safe Trek
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            On Athithya, explore trekking options from local hosts and review the details before
            planning your experience. Check the weather forecast, wear suitable trekking shoes, and
            carry enough water and essential supplies. Follow your trek leader’s instructions, stay on
            marked trails, and avoid leaving waste behind. Let someone you trust know your trekking
            plans and expected return time. A little preparation can go a long way towards making your
            trekking and travel experiences safe and enjoyable.
          </p>
        </div>
      </div>
    </div>
  );
}
