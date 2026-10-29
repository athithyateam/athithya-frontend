"use client";

import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";
import { MobileFooter } from "@/components/navigation/mobile-footer";

export const GUIDE_GOLD = "#C59D5F";

interface GuideLayoutProps {
  heroImage: string;
  heroAlt: string;
  title: string;
  subtitle: string;
  badges?: React.ReactNode;
  children: React.ReactNode;
}

export function GuideLayout({
  heroImage,
  heroAlt,
  title,
  subtitle,
  badges,
  children,
}: GuideLayoutProps) {
  const router = useRouter();

  return (
    <div className="bg-[#fff7e6] dark:bg-neutral-950 min-h-screen flex flex-col pb-16 md:pb-0 transition-colors">
      <Navbar />
      <main className="grow">
        <section className="relative h-[420px] md:h-[460px] overflow-hidden">
          <img
            loading="lazy"
            decoding="async"
            src={heroImage}
            alt={heroAlt}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/20" />
          <div className="relative px-4 md:px-12 h-full flex items-center">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold mb-4 text-white"
              >
                {title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg text-white/90 max-w-2xl"
              >
                {subtitle}
              </motion.p>
              {badges && (
                <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-white/80">
                  {badges}
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="px-4 md:px-12 pt-10 pb-2">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.push("/explore-experience")}
            className="flex items-center gap-2 mb-4 text-sm font-bold text-gray-600 hover:text-[#d4af37] transition-colors group cursor-pointer dark:text-neutral-400"
          >
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-[#FFF7E6] transition-colors dark:bg-neutral-800">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </div>
          </motion.button>
        </div>

        {children}
      </main>
      <MobileFooter />
    </div>
  );
}

export function GuideBadge({ label }: { label: string }) {
  return (
    <span
      className="px-3 py-1 rounded-full border bg-[#fffdf8] dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 transition-colors"
      style={{ borderColor: GUIDE_GOLD }}
    >
      {label}
    </span>
  );
}
