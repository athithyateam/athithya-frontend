import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import {
  MapPin,
  Share2,
  Heart,
  Star,
  Clock,
  Users,
  ShieldCheck,
  Check,
  X,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { routes } from "@/config/navigation";

export const metadata: Metadata = {
  title: "Experience Details | Athithya",
  description: "Authentic local Uttarakhand travel experience on Athithya.",
};

async function PostDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <main className="min-h-screen pt-24 pb-20 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-neutral-500 dark:text-neutral-400 mb-4 overflow-x-auto whitespace-nowrap">
          <Link href={routes.home} className="hover:text-[#C59A2F] transition-colors">
            Home
          </Link>
          <ChevronRight size={13} className="shrink-0 opacity-40" />
          <Link
            href="/explore-experience"
            className="hover:text-[#C59A2F] transition-colors"
          >
            Explore
          </Link>
          <ChevronRight size={13} className="shrink-0 opacity-40" />
          <span className="text-neutral-800 dark:text-neutral-200 font-bold">
            No title
          </span>
        </nav>

        {/* Header Title & Actions */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-neutral-900 dark:text-neutral-100">
              No title
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 font-medium">
              <span className="flex items-center gap-1 font-bold text-neutral-900 dark:text-neutral-100">
                <Star size={15} className="fill-[#C59A2F] text-[#C59A2F]" />
                <span>No rating</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin size={15} className="text-[#C59A2F]" />
                <span>No location</span>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-xs font-bold transition cursor-pointer"
            >
              <Share2 size={15} />
              <span>Share</span>
            </button>
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900 text-xs font-bold transition cursor-pointer"
            >
              <Heart size={15} />
              <span>Save</span>
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        <section aria-label="Experience photo gallery" className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3 h-[320px] sm:h-[420px] md:h-[480px] rounded-3xl overflow-hidden">
            <div className="md:col-span-2 md:row-span-2 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-center p-6 text-center">
              <span className="text-sm font-bold text-neutral-400 uppercase tracking-widest">
                No image
              </span>
            </div>
            <div className="hidden md:flex bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 items-center justify-center p-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                No image
              </span>
            </div>
            <div className="hidden md:flex bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 items-center justify-center p-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                No image
              </span>
            </div>
            <div className="hidden md:flex bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 items-center justify-center p-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                No image
              </span>
            </div>
            <div className="hidden md:flex bg-neutral-100 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 items-center justify-center p-4">
              <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                No image
              </span>
            </div>
          </div>
        </section>

        {/* Main Content Layout with Sticky Booking Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Details */}
          <div className="lg:col-span-8 space-y-10">
            {/* Host Overview Header */}
            <div className="flex items-center justify-between pb-6 border-b border-neutral-200 dark:border-neutral-800">
              <div>
                <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                  Hosted by No host
                </h2>
                <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> No duration
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Users size={14} /> Guided experience
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-[#C59A2F] font-semibold">
                    <ShieldCheck size={14} /> Verified Host
                  </span>
                </div>
              </div>
              <div className="w-14 h-14 rounded-full bg-[#C59A2F] text-white flex items-center justify-center font-black text-xl shadow-xs">
                H
              </div>
            </div>

            {/* Description Section */}
            <section className="space-y-4">
              <h3 className="text-xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
                About this experience
              </h3>
              <p className="text-sm sm:text-base leading-relaxed text-neutral-500 dark:text-neutral-400">
                No description
              </p>
            </section>

            {/* What's included & Not included */}
            <section className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
                What&apos;s included
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-neutral-600 dark:text-neutral-400">
                <div className="flex items-center gap-2.5">
                  <Check size={18} className="text-[#C59A2F] shrink-0" />
                  <span>No details provided</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <X size={18} className="text-red-400 shrink-0" />
                  <span>Personal expenses not included</span>
                </div>
              </div>
            </section>

            {/* Itinerary */}
            <section className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
                Itinerary & Details
              </h3>
              <div className="p-6 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-sm text-neutral-500 dark:text-neutral-400">
                No description
              </div>
            </section>

            {/* Host Section */}
            <section className="space-y-4 pt-6 border-t border-neutral-200 dark:border-neutral-800">
              <h3 className="text-xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
                Meet your host
              </h3>
              <div className="p-6 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="w-16 h-16 rounded-full bg-[#C59A2F] text-white flex items-center justify-center font-black text-2xl shadow-sm">
                  H
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-neutral-900 dark:text-neutral-100">
                    Hosted by No host
                  </h4>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    Verified Uttarakhand Local Guide
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-2">
                    No description
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Sticky Booking Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl space-y-5">
              <div className="flex items-baseline justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
                <div>
                  <span className="text-2xl font-black text-neutral-900 dark:text-neutral-100">
                    ₹ No price
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 ml-1">
                    / person
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-bold">
                  <Star size={14} className="fill-[#C59A2F] text-[#C59A2F]" />
                  <span>No rating</span>
                </div>
              </div>

              {/* Booking Date & Guest Box */}
              <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden divide-y divide-neutral-200 dark:divide-neutral-800">
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-500 dark:text-neutral-400">
                    DATE
                  </span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#C59A2F]" /> Select date
                  </span>
                </div>
                <div className="p-3 bg-neutral-50 dark:bg-neutral-800/50 flex items-center justify-between text-xs">
                  <span className="font-bold text-neutral-500 dark:text-neutral-400">
                    GUESTS
                  </span>
                  <span className="font-semibold text-neutral-800 dark:text-neutral-200 flex items-center gap-1.5">
                    <Users size={14} className="text-[#C59A2F]" /> 1 Guest
                  </span>
                </div>
              </div>

              {/* Reserve Button */}
              <button
                type="button"
                className="w-full py-3.5 rounded-full bg-[#C59A2F] hover:bg-[#A67F26] text-white font-black text-sm uppercase tracking-wider transition shadow-md cursor-pointer active:scale-98"
              >
                Reserve Experience
              </button>

              <p className="text-center text-[11px] text-neutral-400">
                You won&apos;t be charged yet
              </p>

              {/* Cost Summary Breakdown */}
              <div className="pt-4 border-t border-neutral-100 dark:border-neutral-800 space-y-2 text-xs text-neutral-500 dark:text-neutral-400">
                <div className="flex justify-between">
                  <span>₹ No price × 1 guest</span>
                  <span>₹ No price</span>
                </div>
                <div className="flex justify-between">
                  <span>Athithya service fee</span>
                  <span>₹ 0</span>
                </div>
                <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 flex justify-between font-bold text-sm text-neutral-900 dark:text-neutral-100">
                  <span>Total</span>
                  <span>₹ No price</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-28 text-center text-sm text-neutral-400">
          Loading experience...
        </div>
      }
    >
      <PostDetailContent params={params} />
    </Suspense>
  );
}
