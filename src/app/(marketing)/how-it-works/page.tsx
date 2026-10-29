"use client";

import { useState } from "react";
import Link from "next/link";
import {
  UserPlus,
  Compass,
  FileText,
  UserCheck,
  CreditCard,
  MessageSquare,
  Shield,
  PlusCircle,
  ArrowRight,
} from "lucide-react";
import { routes } from "@/config/navigation";

const guestSteps = [
  {
    num: "01",
    title: "Create your Guest Account",
    desc: "Sign up in seconds to start exploring curated travel experiences from verified local hosts.",
    icon: UserPlus,
  },
  {
    num: "02",
    title: "Discover the experience you want enjoy",
    desc: "Browse authentic experiences, adventures, guided walks, and activities tailored to your interests.",
    icon: Compass,
  },
  {
    num: "03",
    title: "Check host offerings/rules",
    desc: "Review what is included, group sizes, timings, prerequisites, and host guidelines before booking.",
    icon: FileText,
  },
  {
    num: "04",
    title: "Visit host profile",
    desc: "Learn about the host's background, years of experience, badges, and verified guest reviews.",
    icon: UserCheck,
  },
  {
    num: "05",
    title: "If everything feels right, complete the payment",
    desc: "Confirm your date and slots with secure, encrypted online checkout via Razorpay.",
    icon: CreditCard,
  },
  {
    num: "06",
    title: "Once the payment is completed, you can connect with the host",
    desc: "Access in-app chat to coordinate meeting points, timings, and enjoy a seamless experience.",
    icon: MessageSquare,
  },
];

const hostSteps = [
  {
    num: "01",
    title: "Create your Host Account",
    desc: "Register as a host to share your unique travel passion, skills, and local knowledge.",
    icon: UserPlus,
  },
  {
    num: "02",
    title: "Verify your Host Account",
    desc: "Complete government identity verification to receive an official verified badge and build trust.",
    icon: Shield,
  },
  {
    num: "03",
    title: "List your Travel Experiences",
    desc: "Set your own schedule, pricing, offerings, and rules. Publish in minutes and welcome guests.",
    icon: PlusCircle,
  },
];

export default function HowItWorksPage() {
  const [activeTab, setActiveTab] = useState<"guests" | "hosts">("guests");

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300 pb-16 md:pb-24">
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

          <div className="mt-8 flex justify-center">
            <div className="inline-flex p-1.5 bg-[#FAF8F5] dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 rounded-full shadow-xs">
              <button
                type="button"
                onClick={() => setActiveTab("guests")}
                className={`px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeTab === "guests"
                    ? "bg-[#C59A2F] text-white shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                }`}
              >
                For Guests
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("hosts")}
                className={`px-6 sm:px-8 py-2.5 rounded-full text-xs sm:text-sm font-black uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeTab === "hosts"
                    ? "bg-[#C59A2F] text-white shadow-xs"
                    : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100"
                }`}
              >
                For Hosts
              </button>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 space-y-10">
        {activeTab === "guests" ? (
          <section className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-[#FAF8F5]/80 dark:bg-neutral-900/60 p-6 sm:p-8 md:p-10 shadow-xs backdrop-blur-sm">
            <div className="mb-6 md:mb-8 text-center max-w-2xl mx-auto">
              <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight tracking-wide">
                How It Works <span className="text-[#C59A2F]">For Guests</span>
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm md:text-base font-semibold mt-1">
                Follow these simple steps to discover, book, and enjoy your next memorable experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
              {guestSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="bg-white dark:bg-neutral-800/90 rounded-2xl border border-neutral-200/70 dark:border-neutral-700/70 p-5 sm:p-6 shadow-xs hover:border-[#C59A2F]/40 hover:shadow-md transition-all duration-300 flex flex-col items-start text-left group"
                  >
                    <div className="flex items-center justify-between w-full mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-neutral-800 border border-amber-200 text-[#C59A2F] flex items-center justify-center shrink-0 group-hover:bg-[#C59A2F] group-hover:text-white transition-colors duration-300">
                        <Icon size={22} />
                      </div>
                      <span className="text-2xl font-black text-neutral-200 dark:text-neutral-700 group-hover:text-[#C59A2F]/40 transition-colors">
                        {step.num}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-[#C59A2F] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-sm sm:text-base">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-neutral-800/80 border border-neutral-200/70 dark:border-neutral-700/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-neutral-800 border border-amber-200 text-[#C59A2F] flex items-center justify-center shrink-0">
                  <Compass size={20} />
                </div>
                <p className="text-sm sm:text-base font-semibold text-neutral-800 dark:text-neutral-200">
                  Ready to explore curated activities and local adventures?
                </p>
              </div>

              <Link
                href={routes.exploreExperience}
                className="px-6 py-3 rounded-full bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider hover:bg-[#A67F26] transition shadow-xs shrink-0 cursor-pointer inline-flex items-center gap-2"
              >
                <span>Discover Experiences</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </section>
        ) : (
          <section className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-[#FAF8F5]/80 dark:bg-neutral-900/60 p-6 sm:p-8 md:p-10 shadow-xs backdrop-blur-sm">
            <div className="mb-6 md:mb-8 text-center max-w-2xl mx-auto">
              <h2 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight tracking-wide">
                How It Works <span className="text-[#C59A2F]">For Hosts</span>
              </h2>
              <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm md:text-base font-semibold mt-1">
                Turn your travel passion, guiding expertise, and skills into income in 3 simple steps.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
              {hostSteps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="bg-white dark:bg-neutral-800/90 rounded-2xl border border-neutral-200/70 dark:border-neutral-700/70 p-5 sm:p-6 shadow-xs hover:border-[#C59A2F]/40 hover:shadow-md transition-all duration-300 flex flex-col items-start text-left group"
                  >
                    <div className="flex items-center justify-between w-full mb-4">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-neutral-800 border border-amber-200 text-[#C59A2F] flex items-center justify-center shrink-0 group-hover:bg-[#C59A2F] group-hover:text-white transition-colors duration-300">
                        <Icon size={22} />
                      </div>
                      <span className="text-2xl font-black text-neutral-200 dark:text-neutral-700 group-hover:text-[#C59A2F]/40 transition-colors">
                        {step.num}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2 group-hover:text-[#C59A2F] transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-sm sm:text-base">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-white dark:bg-neutral-800/80 border border-neutral-200/70 dark:border-neutral-700/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-neutral-800 border border-amber-200 text-[#C59A2F] flex items-center justify-center shrink-0">
                  <Shield size={20} />
                </div>
                <p className="text-sm sm:text-base font-semibold text-neutral-800 dark:text-neutral-200">
                  Free listing, zero upfront fees, and full control over your schedule and pricing.
                </p>
              </div>

              <Link
                href={routes.auth}
                className="px-6 py-3 rounded-full bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider hover:bg-[#A67F26] transition shadow-xs shrink-0 cursor-pointer inline-flex items-center gap-2"
              >
                <span>Start Hosting Today</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
