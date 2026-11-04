import type { Metadata } from "next";
import { HowItWorksTabs } from "@/components/marketing/how-it-works-tabs";

export const metadata: Metadata = {
  title: "How It Works | Explore & Book Travel Experiences | Athithya",
  description:
    "Learn how Athithya works for guests and hosts. Discover authentic travel experiences in Uttarakhand, book securely, connect with verified local hosts, or list your own adventures.",
  alternates: { canonical: "https://athithya.in/how-it-works" },
  openGraph: {
    title: "How It Works | Explore & Book Travel Experiences | Athithya",
    description:
      "Learn how Athithya works for guests and hosts. Discover authentic travel experiences in Uttarakhand, book securely, connect with verified local hosts, or list your own adventures.",
    url: "https://athithya.in/how-it-works",
    type: "website",
  },
};

export default function HowItWorksPage() {
  return (
    <div className="text-neutral-900 dark:text-neutral-100 transition-colors duration-300 pb-16 md:pb-24">
      <section className="pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 relative overflow-hidden text-center">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-neutral-800 text-xs font-bold text-[#C59A2F] border border-amber-200/70 dark:border-neutral-700 uppercase tracking-wider mb-3 mx-auto">
            Simple &amp; Transparent
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight tracking-wide max-w-4xl mx-auto">
            How <span className="text-[#C59A2F]">Athithya</span> Works: Explore &amp; Book Travel Experiences
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base md:text-lg max-w-2xl font-medium mt-2 leading-relaxed mx-auto">
            A simple, secure guide for guests and hosts to connect, discover, and enjoy authentic travel experiences.
          </p>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 space-y-10">
        <HowItWorksTabs />
      </div>
    </div>
  );
}
