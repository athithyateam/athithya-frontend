import type { Metadata } from "next";
import { CategoryExperiencesView } from "@/components/explore/section-views";

export const metadata: Metadata = {
  title: "Other Travel Experiences | Athithya",
  description:
    "Surprise Yourself – Explore Different Travel Experiences Across Uttarakhand with Local Hosts on Athithya.",
  alternates: { canonical: "https://athithya.in/other" },
  openGraph: {
    title: "Other Travel Experiences | Athithya",
    description:
      "Surprise Yourself – Explore Different Travel Experiences Across Uttarakhand with Local Hosts on Athithya.",
    url: "https://athithya.in/other",
    type: "website",
  },
};

export default function OtherCategoryPage() {
  return (
    <div className="bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors pt-24 md:pt-28">
      {/* Top Header & Intro */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 space-y-6 text-left mb-6">
        {/* Title & Tagline */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
            Others
          </h1>
          <p className="text-sm sm:text-base font-bold text-neutral-600 dark:text-neutral-400">
            Surprise Yourself – Explore Different Travel Experiences Across Uttarakhand with Local Hosts on Athithya.
          </p>
        </div>

        {/* Intro */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8">
          <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
            Looking to experience Uttarakhand beyond popular destinations? From spiritual retreats
            and rock climbing to stargazing and hot-air balloon rides, from village walks and
            birdwatching to cultural experiences, meditation and sound healing, Uttarakhand offers
            something for every kind of traveller/person. Whether you want to challenge yourself,
            connect with nature, explore local traditions or simply try something new, there are plenty
            of different experiences waiting to be explored.
          </p>
        </div>
      </div>

      {/* Experience Listings (Left Filter Sidebar + Right Cards Grid) */}
      <div className="w-full">
        <CategoryExperiencesView
          slug="other"
          categoryName="Others"
          subtitle="Explore other unique travel experiences below"
        />
      </div>

      {/* Additional Content Sections Below Cards */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 space-y-6 text-left pb-20 pt-8">
        {/* Find Your Next Travel Experience on Athithya */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            Find Your Next Travel Experience on Athithya
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Every travel experience offers something different. You could be exploring mountain trails,
            trying an adventurous activity, discovering local culture, spending time in nature or finding a
            moment of peace through meditation. Explore different experiences offered by local hosts
            on Athithya and find something that makes your time in Uttarakhand memorable.
          </p>
        </div>

        {/* Why Try Different Travel Experiences? */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            Why Try Different Travel Experiences?
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Travel is about more than visiting places. It is also about the experiences that stay with you.
            Trying something new can help you step outside your routine, discover different interests,
            connect with people and see a destination from a different perspective. Whether it is an
            adventure, a cultural activity or a peaceful retreat, every experience gives you a different
            way to explore Uttarakhand.
          </p>
        </div>

        {/* Tips for a Safe and Enjoyable Experience */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            Tips for a Safe and Enjoyable Experience
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Before planning any experience, carefully review its details, inclusions, requirements and
            instructions provided by the host. Check whether the activity is suitable for your age, fitness
            level and experience. Follow the host&apos;s safety guidelines, carry any recommended essentials
            and stay informed about weather and local conditions. Being prepared helps you make the
            most of your experience while keeping safety in mind.
          </p>
        </div>
      </div>
    </div>
  );
}
