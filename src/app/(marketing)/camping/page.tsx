import type { Metadata } from "next";
import { CategoryExperiencesView } from "@/components/explore/section-views";

export const metadata: Metadata = {
  title: "Camping | Athithya",
  description:
    "Slow Down - Explore Camping & Travel Experiences Across Uttarakhand with Local Hosts on Athithya.",
  alternates: { canonical: "https://athithya.in/camping" },
  openGraph: {
    title: "Camping | Athithya",
    description:
      "Slow Down - Explore Camping & Travel Experiences Across Uttarakhand with Local Hosts on Athithya.",
    url: "https://athithya.in/camping",
    type: "website",
  },
};

export default function CampingCategoryPage() {
  return (
    <div className="bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors pt-24 md:pt-28">
      {/* Top Header & Intro */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 space-y-6 text-left mb-6">
        {/* Title & Tagline */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
            Camping
          </h1>
          <p className="text-sm sm:text-base font-bold text-neutral-600 dark:text-neutral-400">
            Slow Down - Explore Camping &amp; Travel Experiences Across Uttarakhand with Local Hosts on Athithya.
          </p>
        </div>

        {/* Intro */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8">
          <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
            Want to spend time close to nature? Camping is a lovely way to enjoy the landscapes of
            Uttarakhand. From peaceful nights under the stars to camps surrounded by hills and forests,
            there are options for different interests. Whether you want a quiet break from your routine
            or an outdoor experience with friends, find a camping stay that feels right for you.
          </p>
        </div>
      </div>

      {/* Experience Listings (Left Filter Sidebar + Right Cards Grid) */}
      <div className="w-full">
        <CategoryExperiencesView
          slug="camping"
          categoryName="Camping"
          subtitle="Explore all camping experiences below"
        />
      </div>

      {/* Additional Content Sections Below Cards */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 space-y-6 text-left pb-20 pt-8">
        {/* Find Your Next Camping Experience on Athithya */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            Find Your Next Camping Experience on Athithya
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Every camping experience has its own charm. You might enjoy mountain views, spend an
            evening around a campfire where permitted, or wake up to the sounds of nature. Camping
            offers a chance to slow down and experience nature at your own pace. Explore camping
            options and other travel experience activities offered by local hosts on Athithya to plan your
            next outdoor escape.
          </p>
        </div>

        {/* Why Try Camping? */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            Why Try Camping?
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Camping is not just about staying outdoors. It is a chance to take a break from busy
            routines, enjoy fresh air, watch the stars, and spend quality time with others. Depending on
            the location, you may also enjoy short walks, local food, and beautiful scenery. These simple
            moments can turn a camping trip into a memorable travel experience.
          </p>
        </div>

        {/* Tips for Safe Camping */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            Tips for Safe Camping
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            On Athithya, explore camping options from local hosts and review the details before
            planning your stay. Check the weather, pack suitable clothing, and confirm what equipment
            is included. Follow the host’s instructions, use campfires only where permitted, keep food
            stored safely, and take all rubbish with you. Respect local wildlife and leave the campsite as
            you found it. A little preparation helps make your camping travel experience safe and
            enjoyable. Plan thoughtfully to make this travel experience memorable.
          </p>
        </div>
      </div>
    </div>
  );
}
