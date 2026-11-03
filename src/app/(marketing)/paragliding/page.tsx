import type { Metadata } from "next";
import { CategoryExperiencesView } from "@/components/explore/section-views";

export const metadata: Metadata = {
  title: "Paragliding | Athithya",
  description:
    "Freedom In Skies - Explore Paragliding & Travel Experiences Across Uttarakhand with Local Hosts on Athithya.",
  alternates: { canonical: "https://athithya.in/paragliding" },
  openGraph: {
    title: "Paragliding | Athithya",
    description:
      "Freedom In Skies - Explore Paragliding & Travel Experiences Across Uttarakhand with Local Hosts on Athithya.",
    url: "https://athithya.in/paragliding",
    type: "website",
  },
};

export default function ParaglidingCategoryPage() {
  return (
    <div className="bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors pt-24 md:pt-28">
      {/* Top Header & Intro */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 space-y-6 text-left mb-6">
        {/* Title & Tagline */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
            Paragliding
          </h1>
          <p className="text-sm sm:text-base font-bold text-neutral-600 dark:text-neutral-400">
            Freedom In Skies - Explore Paragliding &amp; Travel Experiences Across Uttarakhand with Local Hosts on Athithya.
          </p>
        </div>

        {/* Intro */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8">
          <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
            Want to experience Uttarakhand and it’s Nature from the sky? Paragliding offers a thrilling way to
            enjoy mountain views, open skies, and the feeling of flying. Whether you are trying an adventure for
            the first time or looking for an exciting new challenge, choose an option that suits your comfort
            and interests.
          </p>
        </div>
      </div>

      {/* Experience Listings (Left Filter Sidebar + Right Cards Grid) */}
      <div className="-mt-16 sm:-mt-20 [&_h1]:hidden [&_.text-neutral-400.mb-4]:hidden">
        <CategoryExperiencesView
          slug="paragliding"
          categoryName="Paragliding"
          subtitle="Explore all paragliding experiences below"
        />
      </div>

      {/* Additional Content Sections Below Cards */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 space-y-6 text-left pb-20 pt-8">
        {/* Find Your Next Paragliding Experience on Athithya */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            Find Your Next Paragliding Experience on Athithya
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Every flight offers a different view of the mountains, valleys, and nature. Discover paragliding
            experiences and other travel experience options listed by local hosts on Athithya, and find an
            activity/experience that matches your interests, comfort level and excitement.
          </p>
        </div>

        {/* Why Try Paragliding? */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            Why Try Paragliding?
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Paragliding gives you a chance to enjoy wide-open views and experience the excitement of being in
            the air. It can be a memorable way to appreciate nature, try something new, and see Uttarakhand
            from a different perspective. Choose a qualified local host and check the activity details before
            booking your travel experience.
          </p>
        </div>

        {/* Tips for a Safe Paragliding Experience */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            Tips for a Safe Paragliding Experience
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            On Athithya, review the activity details and follow the local host’s safety guidance. Check weather
            conditions, use the required safety equipment, and listen carefully to the trained instructor. Follow
            age, health, and weight requirements where applicable, and never fly when conditions are
            unsuitable. Careful preparation can help make your paragliding travel experience safer and more
            enjoyable.
          </p>
        </div>
      </div>
    </div>
  );
}
