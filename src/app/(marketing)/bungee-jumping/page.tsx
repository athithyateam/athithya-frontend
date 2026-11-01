import type { Metadata } from "next";
import { CategoryExperiencesView } from "@/components/explore/section-views";

export const metadata: Metadata = {
  title: "Bungee Jumping | Athithya",
  description:
    "Nervously Excited - Explore Bungee Jumping and Travel Experiences Across Uttarakhand with Local Hosts on Athithya.",
  alternates: { canonical: "https://athithya.in/bungee-jumping" },
  openGraph: {
    title: "Bungee Jumping | Athithya",
    description:
      "Nervously Excited - Explore Bungee Jumping and Travel Experiences Across Uttarakhand with Local Hosts on Athithya.",
    url: "https://athithya.in/bungee-jumping",
    type: "website",
  },
};

export default function BungeeJumpingCategoryPage() {
  return (
    <div className="bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors pt-24 md:pt-28">
      {/* Top Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 space-y-6 text-left mb-6">
        {/* Title & Subtitle */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
            Bungee Jumping
          </h1>
          <p className="text-sm sm:text-base font-bold text-neutral-600 dark:text-neutral-400">
            Nervously Excited - Explore Bungee Jumping and Travel Experiences Across Uttarakhand with Local Hosts on Athithya.
          </p>
        </div>

        {/* Intro */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8">
          <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
            Want to experience the thrill of Bungee Jumping? This adventure is perfect for those looking
            to step out of their comfort zone and enjoy a memorable activity. Whether you are trying it
            for the first time or looking for an exciting new challenge, choose a travel experience that
            feels right for you.
          </p>
        </div>

        {/* Find Your Next Bungee Jumping Experience on Athithya */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            Find Your Next Bungee Jumping Experience on Athithya
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Every bungee jumping experience offers a unique rush as you take a leap and enjoy the
            feeling of free-falling in a controlled setting. Explore adventure activities in Uttarakhand and
            choose a travel experience that suits your comfort level. Discover more travel experiences
            offered by local hosts on Athithya and plan your next adventure.
          </p>
        </div>

        {/* Why Try Bungee Jumping? */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
              Why Try Bungee Jumping?
            </h2>
            <p className="text-xs sm:text-sm font-bold text-[#C59A2F]">
              All bungee exp.
            </p>
          </div>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Bungee jumping is about challenging yourself, building confidence, and enjoying an
            unforgettable rush. With trained professionals and proper safety arrangements, it can be an
            exciting way to try something new. You can create lasting memories, share the adventure
            with friends, and enjoy a travel experience that takes you beyond your usual routine.
          </p>
        </div>

        {/* Tips for a Safe Bungee Jump */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            Tips for a Safe Bungee Jump
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            On Athithya, explore bungee jumping options from local hosts and review all activity details
            before booking. Check the operator’s safety standards, follow the instructor’s guidance, and
            understand the age, weight, and health requirements. Use the provided safety equipment,
            listen carefully to the briefing, and never jump if you feel unsure or the conditions are not
            suitable. Following these precautions can help make your travel experience safe and
            enjoyable.
          </p>
        </div>
      </div>

      {/* Experience Listings */}
      <div className="-mt-16 sm:-mt-20 [&_h1]:hidden [&_.text-neutral-400.mb-4]:hidden">
        <CategoryExperiencesView
          slug="bungee-jumping"
          categoryName="Bungee Jumping"
          subtitle="Explore bungee jumping experiences in Uttarakhand"
        />
      </div>
    </div>
  );
}
