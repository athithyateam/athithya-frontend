import Link from "next/link";
import {
  DollarSign,
  Compass,
  Settings,
  Shield,
  TrendingUp,
  Star,
  CheckCircle,
  Globe,
  ArrowRight,
} from "lucide-react";
import { routes } from "@/config/navigation";

const features = [
  {
    icon: DollarSign,
    title: "Free Listing",
    desc: "Athithya helps you reach more travelers & guests with what you already provide (your travel experiences, skills, and local knowledge) without spending on marketing.",
  },
  {
    icon: Compass,
    title: "Monetize Your Skills",
    desc: "Turn your travel expertise, guiding knowledge, instructor skills, or local experience into an online source of income while reaching out to more travellers.",
  },
  {
    icon: Settings,
    title: "You Control Everything",
    desc: "Set your own price, dates, participant size, and rules. Host full-time, part-time, on weekends, or seasonally, completely on your own terms.",
  },
  {
    icon: Shield,
    title: "Secure & Verified",
    desc: "Athithya provides secure payments, identity verification, and direct chat so you can focus on what you do best, i.e providing a wonderful traveling experience.",
  },
  {
    icon: TrendingUp,
    title: "Free Discovery & Reach",
    desc: "We bring travellers directly to your experiences. You don't need to spend a single rupee on marketing as Athithya helps with your visibility and booking flow.",
  },
  {
    icon: Star,
    title: "Easy to Start",
    desc: "List your experience in minutes with transparent controls. No lock-in contracts. Build your reputation and income through verified guest reviews.",
  },
];

const categories = [
  {
    title: "Experiences",
    items: ["Cooking classes", "Cultural walks", "Art & craft workshops", "Folk storytelling"],
  },
  {
    title: "Adventures",
    items: ["Trekking & camping", "River rafting & bungee", "Experience guiding & safaris", "Paragliding & kayaking"],
  },
  {
    title: "Guided Tours",
    items: ["Heritage walks", "Spiritual pilgrimages", "Photography tours", "Bird watching"],
  },
];

export default function HostPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300 pb-16 md:pb-24">
      {/* Header */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12 relative overflow-hidden text-center">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 dark:bg-neutral-800 text-xs font-bold text-[#C59A2F] border border-amber-200/70 dark:border-neutral-700 uppercase tracking-wider mb-3 mx-auto">
            Become a Host
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight tracking-wide">
            Turn Your Traveling Passion <span className="text-[#C59A2F]">Into Income</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base md:text-lg max-w-3xl font-medium mt-2 leading-relaxed mx-auto">
            At Athithya, we believe every local has a story, a skill, or an experience that can inspire a traveller’s journey. Whether you’re a trek leader, paragliding pilot, experience guide, rafting instructor, or someone with a unique local experience - Athithya helps you list it, get discovered, and reach out to more travellers.
          </p>

          <div className="mt-6 sm:mt-8 flex justify-center">
            <Link
              href={routes.auth}
              className="px-8 py-3.5 rounded-full bg-[#C59A2F] text-white text-xs sm:text-sm font-black uppercase tracking-wider hover:bg-[#A67F26] transition shadow-md inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Start Hosting Today</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 space-y-10 md:space-y-16">
        {/* Why Host Section */}
        <section className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-[#FAF8F5]/80 dark:bg-neutral-900/60 p-6 sm:p-8 md:p-10 shadow-xs backdrop-blur-sm">
          <div className="mb-6 md:mb-8 text-center max-w-2xl mx-auto">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight tracking-wide">
              Why Host on <span className="text-[#C59A2F]">Athithya?</span>
            </h2>
            <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base font-semibold mt-1">
              You already have the travel experience. We help you share it with travellers and guests.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white dark:bg-neutral-800/90 rounded-2xl border border-neutral-200/70 dark:border-neutral-700/70 p-5 sm:p-6 shadow-xs hover:border-[#C59A2F]/40 hover:shadow-md transition-all duration-300 flex flex-col items-start text-left group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-neutral-800 border border-amber-200/70 dark:border-neutral-700 text-[#C59A2F] mb-4 flex items-center justify-center shrink-0 group-hover:bg-[#C59A2F] group-hover:text-white transition-colors duration-300">
                    <Icon size={22} />
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-[#C59A2F] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-sm sm:text-base flex-grow">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* What Can You Host Section */}
        <section className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-[#FAF8F5]/80 dark:bg-neutral-900/60 p-6 sm:p-8 md:p-10 shadow-xs backdrop-blur-sm">
          <div className="mb-6 md:mb-8 text-center max-w-2xl mx-auto">
            <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight tracking-wide">
              What Can You <span className="text-[#C59A2F]">Host?</span>
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm md:text-base font-semibold mt-1">
              If it’s authentic and adds value to a traveller’s journey, you can host it on Athithya.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {categories.map((cat) => (
              <div
                key={cat.title}
                className="bg-white dark:bg-neutral-800/90 rounded-2xl p-5 sm:p-6 border border-neutral-200/70 dark:border-neutral-700/70 shadow-xs hover:border-[#C59A2F]/40 hover:shadow-md transition-all duration-300 text-left"
              >
                <div className="flex items-center gap-2 mb-3.5 pb-2.5 border-b border-neutral-100 dark:border-neutral-700/60">
                  <div className="w-6 h-6 rounded-lg bg-amber-50 dark:bg-neutral-700 text-[#C59A2F] flex items-center justify-center shrink-0">
                    <CheckCircle size={14} />
                  </div>
                  <h4 className="font-extrabold text-sm sm:text-base text-neutral-900 dark:text-neutral-100">
                    {cat.title}
                  </h4>
                </div>
                <ul className="space-y-2">
                  {cat.items.map((it, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm sm:text-base text-neutral-600 dark:text-neutral-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#C59A2F] mt-2 shrink-0" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-neutral-800/80 border border-neutral-200/70 dark:border-neutral-700/70">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-neutral-800 border border-amber-200 text-[#C59A2F] flex items-center justify-center shrink-0">
                <Globe size={20} />
              </div>
              <p className="text-sm sm:text-base font-semibold text-neutral-800 dark:text-neutral-200">
                Have a travel experience? If you have a travel experience worth experiencing, we welcome you to list it on Athithya.
              </p>
            </div>

            <Link
              href={routes.auth}
              className="px-6 py-3 rounded-full bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider hover:bg-[#A67F26] transition shadow-xs shrink-0 cursor-pointer inline-flex items-center gap-2"
            >
              <span>List It Now</span>
              <ArrowRight size={15} />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
