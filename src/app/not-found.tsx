import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { MobileFooter } from "@/components/navigation/mobile-footer";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />
      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-4xl sm:text-6xl font-black text-[#C59A2F] mb-3">
          404
        </h1>
        <h2 className="text-xl sm:text-2xl font-bold uppercase tracking-tight mb-3">
          Page Not Found
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 max-w-md">
          The page or experience you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link
          href="/"
          className="px-8 py-3 bg-[#C59A2F] text-white rounded-full font-black text-xs uppercase tracking-wider hover:bg-[#A67F26] transition shadow-md"
        >
          Explore Experiences
        </Link>
      </main>
      <Footer />
      <MobileFooter />
    </div>
  );
}

