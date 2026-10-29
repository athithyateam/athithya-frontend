"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Compass, HelpCircle } from "lucide-react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { MobileFooter } from "@/components/navigation/mobile-footer";
import { getCategoryActivity } from "@/lib/api/posts-api";

export const CATEGORIES_DATA = [
  {
    id: "bungee",
    label: "Bungee Jumping",
    slug: "bungee-jumping",
    keywords: ["bungee", "bungee jumping"],
    description: "Feel the adrenaline rush with India's highest cliff jump in Rishikesh",
    image: "/images/bungee/bungee-1.jpeg",
    count: "Nervously Excited",
  },
  {
    id: "paragliding",
    label: "Paragliding",
    slug: "paragliding",
    keywords: ["paragliding"],
    description: "Soar high over lush green valleys & snow-capped peaks",
    image: "/images/paragliding/paragliding-3.jpeg",
    count: "Freedom in Skies",
  },
  {
    id: "trek",
    label: "Trek",
    slug: "trek",
    keywords: ["trek", "trekking"],
    description: "Conquer scenic Himalayan trails & high-altitude mountain passes",
    image: "/images/trek/trek-1.jpeg",
    count: "Find Yourself",
  },
  {
    id: "camping",
    label: "Camping",
    slug: "camping",
    keywords: ["camping", "camp"],
    description: "Star-lit night camping amidst pristine valleys & pine woods",
    image: "/images/camping/camping-1.jpeg",
    count: "Slow Down",
  },
  {
    id: "rafting",
    label: "Rafting",
    slug: "rafting",
    keywords: ["rafting"],
    description: "Thrilling white water rafting on the holy Ganges & Alaknanda rivers",
    image: "/images/rafting/rafting-2.jpeg",
    count: "Feel Alive",
  },
  {
    id: "safari",
    label: "Safari",
    slug: "safari",
    keywords: ["safari", "wildlife", "jungle safari", "jeep safari"],
    description: "Experience thrilling wildlife safaris in Jim Corbett & Rajaji National Parks",
    image: "/images/about-1.jpeg",
    count: "Explore Wild",
  },
  {
    id: "other",
    label: "Others",
    slug: "other",
    keywords: ["rock climbing", "rock-climbing", "climbing", "bouldering", "flyboarding", "guide", "experience guide", "other", "others"],
    description: "Rock climbing, flyboarding, and unique mountain activities",
    isCollage: true,
    images: ["/images/rock-climbing/rock-climbing-1.jpeg", "/images/flyboarding/flyboarding-1.jpeg"],
    count: "Surprise Yourself",
  },
];

export default function CategoriesPage() {
  const router = useRouter();
  const [categoryActivity, setCategoryActivity] = useState<any[]>([]);

  useEffect(() => {
    getCategoryActivity()
      .then((res) => {
        if (res?.success && Array.isArray(res?.data)) setCategoryActivity(res.data);
      })
      .catch(() => {});
  }, []);

  const visibleCategories = useMemo(() => {
    const activityMap = new Map<string, any>();
    categoryActivity.forEach((item) => {
      if (item?.normalizedCategory) activityMap.set(String(item.normalizedCategory).toLowerCase(), item);
      if (item?.category) activityMap.set(String(item.category).toLowerCase(), item);
    });
    const DAY_MS = 24 * 60 * 60 * 1000;
    const now = Date.now();

    const mapped = CATEGORIES_DATA.map((cat) => {
      let maxTime = 0;
      let totalCount = 0;
      for (const [key, val] of activityMap.entries()) {
        if (cat.keywords.some((kw) => key.includes(kw.toLowerCase()) || kw.toLowerCase().includes(key))) {
          const ts = val?.latestApprovedAt ? new Date(val.latestApprovedAt).getTime() : 0;
          if (ts > maxTime) maxTime = ts;
          totalCount += val?.count || 0;
        }
      }
      return { ...cat, isNew: maxTime > 0 && now - maxTime < DAY_MS, experienceCount: totalCount };
    });

    const mainCats = mapped.filter((c) => c.id !== "other").sort((a, b) => b.experienceCount - a.experienceCount);
    const otherCat = mapped.find((c) => c.id === "other");
    return otherCat ? [...mainCats, otherCat] : mainCats;
  }, [categoryActivity]);

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col font-sans transition-colors">
      <Navbar />

      <main className="flex-1 pt-24 md:pt-32 pb-16 px-4 sm:px-6 md:px-8 max-w-[1400px] mx-auto w-full">
        <div className="flex items-center gap-3 mb-8 sm:mb-10">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800 flex items-center justify-center text-neutral-700 dark:text-neutral-300 transition shrink-0 cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#C59A2F] flex items-center gap-1.5">
              <Compass size={12} /> Activities
            </span>
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight uppercase leading-none mt-1">
              Explore <span className="text-[#C59A2F]">Activities</span>
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {visibleCategories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => router.push(`/${cat.slug}`)}
              className={`group relative rounded-2xl md:rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer flex flex-col aspect-[4/5] sm:aspect-[3/4] ${
                cat.isNew ? "ring-2 ring-[#C59A2F] shadow-[0_0_20px_rgba(197,154,47,0.35)]" : "border border-neutral-100 dark:border-neutral-800"
              }`}
            >
              {cat.isCollage && Array.isArray(cat.images) ? (
                <div className="w-full h-full relative overflow-hidden group-hover:scale-105 transition-transform duration-700 ease-out">
                  <div className="w-full h-full flex overflow-hidden filter blur-[2.5px] scale-110 opacity-70 group-hover:opacity-90 group-hover:blur-[1px] transition-all duration-700">
                    <div className="w-1/2 h-full overflow-hidden relative border-r border-white/30">
                      <img src={cat.images[0]} alt="Rock Climbing" loading="lazy" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-1/2 h-full overflow-hidden relative">
                      <img src={cat.images[1]} alt="Flyboarding" loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center text-center p-4 z-10 bg-black/40 group-hover:bg-black/25 transition-all">
                    <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-[#C59A2F]/80 flex items-center justify-center text-[#C59A2F] shadow-[0_0_20px_rgba(197,154,47,0.6)] group-hover:scale-115 transition-all">
                      <HelpCircle className="w-7 h-7" />
                    </div>
                  </div>
                </div>
              ) : (
                <img src={cat.image} alt={cat.label} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity group-hover:from-black/95" />

              {cat.isNew && (
                <div className="absolute top-3.5 right-3.5 z-20">
                  <span className="px-2.5 py-1 rounded-full bg-[#C59A2F] text-white text-[9px] md:text-[10px] font-black uppercase tracking-wider shadow-lg border border-white dark:border-neutral-950">
                    New
                  </span>
                </div>
              )}

              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 text-white flex flex-col justify-end text-left">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white group-hover:text-[#C59A2F] transition-colors leading-tight">
                  {cat.label}
                </h3>
                {cat.count && <p className="text-xs sm:text-sm font-extrabold text-[#C59A2F] tracking-wide mt-1 mb-3 drop-shadow">{cat.count}</p>}
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#C59A2F] uppercase tracking-wider group-hover:translate-x-1.5 transition-transform">
                  <span>Explore {cat.label}</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
      <MobileFooter />
    </div>
  );
}
