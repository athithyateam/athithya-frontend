import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { MobileFooter } from "@/components/navigation/mobile-footer";
import { HomeHeroSection } from "@/components/home/home-hero-section";
import { BrandIntroSection } from "@/components/home/brand-intro-section";
import { HomeCategoriesSection } from "@/components/home/home-categories-section";
import { HomeClientSections } from "@/components/home/home-client-sections";

export const metadata: Metadata = {
  title: "Athithya | Your Travel Experience Platform",
  description:
    "Explore different travel experiences in Uttarakhand with local hosts, from treks, rafting, and paragliding to camping, safaris, bungee jumping, and much more.",
};

export default function HomePage() {
  return (
    <div className="relative min-h-screen flex flex-col pb-16 md:pb-0 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      <Navbar />

      <main className="flex-1">
        <HomeHeroSection />
        <BrandIntroSection />
        <HomeCategoriesSection />
        <HomeClientSections />
      </main>

      <Footer />
      <MobileFooter />
    </div>
  );
}
