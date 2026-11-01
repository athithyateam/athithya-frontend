import type { Metadata } from "next";
import { CategoryExperiencesView } from "@/components/explore/section-views";

export const metadata: Metadata = {
  title: "Safari | Athithya",
  description:
    "Explore Wild - Explore Safari & Travel Experiences Across Uttarakhand with Local Hosts on Athithya.",
  alternates: { canonical: "https://athithya.in/safari" },
  openGraph: {
    title: "Safari | Athithya",
    description:
      "Explore Wild - Explore Safari & Travel Experiences Across Uttarakhand with Local Hosts on Athithya.",
    url: "https://athithya.in/safari",
    type: "website",
  },
};

export default function SafariCategoryPage() {
  return (
    <div className="bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors pt-24 md:pt-28">
      {/* Top Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 space-y-6 text-left mb-6">
        {/* Title & Tagline */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-900 dark:text-neutral-100 leading-tight">
            Safari
          </h1>
          <p className="text-sm sm:text-base font-bold text-neutral-600 dark:text-neutral-400">
            Explore Wild - Explore Safari &amp; Travel Experiences Across Uttarakhand with Local Hosts on Athithya.
          </p>
        </div>

        {/* Intro */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8">
          <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed">
            Looking to explore nature and wildlife in Uttarakhand? A safari can offer a chance to discover forest
            landscapes, observe wildlife from a safe distance, and enjoy time outdoors. Whether you are
            travelling with family or seeking a nature-focused outing, choose an option that fits your interests
            and plans.
          </p>
        </div>

        {/* Find Your Next Safari Experience on Athithya */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            Find Your Next Safari Experience on Athithya
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            Each safari can offer a different view of forests, landscapes, wildlife and the natural world. Explore
            safari experiences and other travel experience options listed on Athithya, check the details shared
            by local hosts, and choose an outing that suits your interests.
          </p>
        </div>

        {/* Why Try a Safari? */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
            Why Try a Safari?
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            A safari can help you connect with nature, learn about local wildlife, and appreciate the importance
            of protecting natural habitats. It is an opportunity to slow down, enjoy the outdoors, and discover the
            landscapes and nature responsibly. Follow rules and respect wildlife throughout your travel
            experience.
          </p>
        </div>

        {/* Tips for a Safe Safari */}
        <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-200/80 dark:border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-3">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
              Tips for a Safe Safari
            </h2>
            <p className="text-xs sm:text-sm font-bold text-[#C59A2F]">
              All safari related experiences
            </p>
          </div>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed">
            On Athithya, review the safari details and follow the guidance provided by the local host or park staff.
            Stay inside the designated vehicle or viewing area, keep a safe distance from animals, and avoid
            feeding or disturbing wildlife. Carry essentials such as water and weather-appropriate clothing, and
            follow all conservation rules to help keep your safari travel experience safe and responsible.
          </p>
        </div>
      </div>

      {/* Experience Listings */}
      <div className="-mt-16 sm:-mt-20 [&_h1]:hidden [&_.text-neutral-400.mb-4]:hidden">
        <CategoryExperiencesView
          slug="safari"
          categoryName="Safari"
          subtitle="Explore all safari experiences below"
        />
      </div>
    </div>
  );
}
