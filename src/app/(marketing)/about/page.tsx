import type { Metadata } from "next";
import { AboutStorySlider } from "@/components/marketing/about-story-slider";

export const metadata: Metadata = {
  title: "About Us & Our Story | Athithya",
  description:
    "Discover Athithya's journey and vision: connecting travellers with verified local hosts across Uttarakhand for authentic, memorable mountain experiences.",
  alternates: { canonical: "https://athithya.in/about" },
  openGraph: {
    title: "About Us & Our Story | Athithya",
    description:
      "Discover Athithya's journey and vision: connecting travellers with verified local hosts across Uttarakhand for authentic, memorable mountain experiences.",
    url: "https://athithya.in/about",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <div className="text-neutral-900 dark:text-neutral-100 transition-colors duration-300 pb-12 sm:pb-16 md:pb-24">
      <section className="pt-24 sm:pt-28 md:pt-32 pb-6 sm:pb-10 relative overflow-hidden text-center">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#C59A2F] mb-1.5 block">
            Our Journey &amp; Vision
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight tracking-wide">
            About Us &amp; <span className="text-[#C59A2F]">Our Story</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base md:text-lg max-w-2xl font-medium mt-2 leading-relaxed mx-auto">
            Discover the passion, genuine connections, and local stories that inspire every Athithya journey.
          </p>
        </div>
      </section>

      <div className="max-w-[1300px] mx-auto px-3.5 sm:px-6 md:px-8">
        <AboutStorySlider />
      </div>
    </div>
  );
}
