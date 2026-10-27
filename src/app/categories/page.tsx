import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass } from "lucide-react";

export const metadata: Metadata = {
  title: "Experience Categories | Athithya",
  description: "Browse authentic travel and adventure categories across Uttarakhand on Athithya.",
};

const CATEGORIES = [
  {
    label: "Bungee Jumping",
    tagline: "Feel the adrenaline rush with India's highest cliff jump in Rishikesh",
    count: "Nervously Excited",
  },
  {
    label: "Paragliding",
    tagline: "Soar high over lush green valleys & snow-capped peaks",
    count: "Freedom in Skies",
  },
  {
    label: "Trek",
    tagline: "Conquer scenic Himalayan trails & high-altitude mountain passes",
    count: "Find Yourself",
  },
  {
    label: "Camping",
    tagline: "Star-lit night camping amidst pristine valleys & pine woods",
    count: "Slow Down",
  },
  {
    label: "Rafting",
    tagline: "Thrilling white water rafting on the holy Ganges & Alaknanda rivers",
    count: "Feel Alive",
  },
  {
    label: "Safari",
    tagline: "Experience thrilling wildlife safaris in Jim Corbett & Rajaji National Parks",
    count: "Raw Wilderness",
  },
  {
    label: "Kayaking",
    tagline: "Glide across calm emerald mountain lakes & gentle river rapids",
    count: "Peace in Waves",
  },
  {
    label: "Skiing",
    tagline: "Glide down the snow-covered slopes of Auli with breathtaking peak views",
    count: "Pure White Thrill",
  },
  {
    label: "Cultural & Village",
    tagline: "Immerse in indigenous folklore, Garhwali cuisine & warm mountain hospitality",
    count: "Soulful Roots",
  },
];

export default function CategoriesPage() {
  return (
    <main className="min-h-screen pt-24 pb-20 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="mb-10 text-center sm:text-left">
          <span className="inline-block px-3 py-1 rounded-full bg-[#C59A2F]/15 text-[#C59A2F] text-xs font-black uppercase tracking-wider mb-2">
            Explore Categories
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">
            Find Your Next Himalayan Journey
          </h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-xl">
            Choose from authentic mountain sports, peaceful village walks, and cultural traditions hosted by locals.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={`/explore-experience?category=${encodeURIComponent(cat.label)}`}
              className="group p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 hover:border-[#C59A2F]/50 transition-all hover:-translate-y-1 shadow-xs flex flex-col justify-between"
            >
              <div>
                <span className="inline-block text-[11px] font-black uppercase tracking-widest text-[#C59A2F] mb-1">
                  {cat.count}
                </span>
                <h3 className="text-xl font-extrabold text-neutral-900 dark:text-neutral-100 group-hover:text-[#C59A2F] transition-colors">
                  {cat.label}
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                  {cat.tagline}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between text-xs font-bold text-neutral-700 dark:text-neutral-300 group-hover:text-[#C59A2F]">
                <span>Discover activities</span>
                <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
