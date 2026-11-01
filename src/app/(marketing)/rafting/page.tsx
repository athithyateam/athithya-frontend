import type { Metadata } from "next";
import { CategoryExperiencesView } from "@/components/explore/section-views";

export const metadata: Metadata = {
  title: "Rafting | Athithya",
  description:
    "Feel Alive - Explore Rafting & Travel Experiences Across Uttarakhand with Local Hosts on Athithya.",
  alternates: { canonical: "https://athithya.in/rafting" },
  openGraph: {
    title: "Rafting | Athithya",
    description:
      "Feel Alive - Explore Rafting & Travel Experiences Across Uttarakhand with Local Hosts on Athithya.",
    url: "https://athithya.in/rafting",
    type: "website",
  },
};

export default function RaftingCategoryPage() {
  return (
    <div className="bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors pt-24 md:pt-28">
      {/* Top Header & Intro */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 space-y-6 text-left mb-6">
        {/* Title & Tagline */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
            Rafting
          </h1>
          <p className="text-sm sm:text-base font-bold text-neutral-600 dark:text-neutral-400">
            Feel Alive - Explore Rafting &amp; Travel Experiences Across Uttarakhand with Local Hosts on Athithya.
          </p>
        </div>

        {/* Intro */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8">
          <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
            Want to explore the rivers of Uttarakhand? Rafting is an exciting way to enjoy the outdoors.
            From refreshing stretches of flowing water to thrilling rapids, there are options for different
            interests and comfort levels. Whether you are trying an adventure activity for the first time
            or looking for an exciting day out, find a rafting trip that feels right for you.
          </p>
        </div>
      </div>

      {/* Experience Listings (Left Filter Sidebar + Right Cards Grid) */}
      <div className="-mt-16 sm:-mt-20 [&_h1]:hidden [&_.text-neutral-400.mb-4]:hidden">
        <CategoryExperiencesView
          slug="rafting"
          categoryName="Rafting"
          subtitle="Explore all rafting experiences below"
        />
      </div>

      {/* Additional Content Sections Below Cards */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 space-y-6 text-left pb-20 pt-8">
        {/* Platform Info */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8">
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Athithya brings together rafting options and related travel experience activities offered by
            different local hosts at one place. Explore available options, read reviews, compare
            experiences, and find an experience that matches your interests.
          </p>
        </div>

        {/* Find Your Next Rafting Experience on Athithya */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            Find Your Next Rafting Experience on Athithya
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Every rafting experience offers something different. Enjoy the river, take in the surrounding
            hills, and experience Uttarakhand from a new perspective. You can choose an outing that
            suits your interests and enjoy time outdoors with friends or family. Explore rafting options
            and other travel experience activities offered by local hosts on Athithya to plan your next
            adventure.
          </p>
        </div>

        {/* Why Try Rafting? */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            Why Try Rafting?
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Rafting is more than a ride on the river. It brings excitement, teamwork, and a chance to
            enjoy the natural beauty around you. With guidance from trained professionals/hosts, you
            can learn the basics, work together as a group, and make memorable moments along the
            way. It can be a refreshing break from your routine and a fun travel experience to share
            with others.
          </p>
        </div>

        {/* Tips for Safe Rafting */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            Tips for Safe Rafting
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            On Athithya, explore rafting options from local hosts and review the activity details before
            booking. Choose an experience appropriate for your ability, follow the guide’s instructions,
            and wear the safety equipment provided. Check weather and river conditions, listen
            carefully during the safety briefing, and never enter the water without your guide’s
            approval. Following safety advice helps make your rafting travel experience more enjoyable.
            Plan thoughtfully to make this travel experience memorable.
          </p>
        </div>
      </div>
    </div>
  );
}
