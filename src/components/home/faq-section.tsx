"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, MessageSquare, ArrowRight } from "lucide-react";
import { routes } from "@/config/navigation";

const FAQ_CATEGORIES = ["All", "Booking & Payment", "Host & Verification", "Account & Safety"];

const FAQ_DATA = [
  {
    id: "account-create",
    category: "Account & Safety",
    question: "How do I create an account and get started on Athithya?",
    answer:
      "Creating an account is quick and free. Click the 'Sign In' or 'Sign Up' button in the navigation to register using your email or Google account. You can immediately begin browsing verified treks, camping, rafting, and cultural experiences across Uttarakhand.",
  },
  {
    id: "booking-process",
    category: "Booking & Payment",
    question: "How does the booking process work?",
    answer:
      "Browse experiences by category, location, or host. Once you find an experience you love, select your preferred date and number of guests, review the inclusions and host terms, and proceed to secure booking. You'll receive instant confirmation and a booking summary.",
  },
  {
    id: "host-verification",
    category: "Host & Verification",
    question: "How are local hosts verified on the platform?",
    answer:
      "Every host on Athithya undergoes a thorough verification process. Our team reviews government identification, regional expertise, and certifications. Verified hosts display a verified badge on their profile so you can book with complete peace of mind.",
  },
  {
    id: "direct-chat",
    category: "Booking & Payment",
    question: "Can I communicate directly with the host before or after booking?",
    answer:
      "Yes! Athithya features built-in real-time messaging. You can message hosts directly from any experience page to ask questions about trail conditions, packing tips, or custom requirements, and stay in touch after booking.",
  },
  {
    id: "become-a-host",
    category: "Host & Verification",
    question: "How can I become a host and list my travel experiences?",
    answer:
      "If you are a local guide, tour operator, or hospitality provider, click 'Host' or 'Become a Host' in the navigation. Complete the host verification submission and list your experiences with photos, pricing tiers, and itinerary details.",
  },
  {
    id: "cancellation-safety",
    category: "Account & Safety",
    question: "What safety measures and booking policies are in place?",
    answer:
      "We prioritize traveller safety through verified host profiles, authentic community reviews, and transparent cancellation policies. All booking details and receipts are accessible anytime from your personal profile dashboard.",
  },
];

export function FaqSection() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter(
      (faq) => activeCategory === "All" || faq.category === activeCategory
    );
  }, [activeCategory]);

  return (
    <section className="py-8 md:py-12 bg-white dark:bg-neutral-950 transition-colors">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 text-left">
        <div className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h2 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight tracking-wide">
              Frequently Asked <span className="text-[#C59A2F]">Questions</span>
            </h2>
            <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm md:text-base font-semibold mt-1">
              Everything you need to know about booking, hosting, and exploring with Athithya
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 w-full md:w-auto shrink-0">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setActiveCategory(cat);
                  setOpenFaqId(null);
                }}
                className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  activeCategory === cat
                    ? "bg-[#C59A2F] text-white shadow-xs"
                    : "bg-[#FAF8F5] dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5 items-start">
          {filteredFaqs.map((faq) => {
            const isOpen = openFaqId === faq.id;
            return (
              <div
                key={faq.id}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen
                    ? "bg-white dark:bg-neutral-800/90 border-[#C59A2F]/50 shadow-md ring-1 ring-[#C59A2F]/20"
                    : "bg-[#FAF8F5]/80 dark:bg-neutral-900/60 border-neutral-200/80 dark:border-neutral-700/70"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <div className="mt-0.5 w-6 h-6 rounded-lg bg-amber-50 dark:bg-neutral-700 text-[#C59A2F] flex items-center justify-center shrink-0">
                      <HelpCircle size={14} />
                    </div>
                    <span className={`text-sm sm:text-base font-bold leading-snug ${isOpen ? "text-[#C59A2F]" : "text-neutral-900 dark:text-neutral-100"}`}>
                      {faq.question}
                    </span>
                  </div>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border border-neutral-200 dark:border-neutral-700 transition-transform ${isOpen ? "rotate-180 text-[#C59A2F]" : "text-neutral-400"}`}>
                    <ChevronDown size={14} />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed border-t border-neutral-100 dark:border-neutral-700/50 pt-3.5 pl-14">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-8 md:mt-12 rounded-2xl bg-[#FAF8F5]/90 dark:bg-neutral-900/70 border border-neutral-200/80 dark:border-neutral-700/70 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center gap-3.5 text-center sm:text-left">
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-neutral-800 border border-[#F3E2B4] text-[#C59A2F] flex items-center justify-center shrink-0">
              <MessageSquare size={22} />
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-extrabold text-neutral-900 dark:text-neutral-100">
                Still have questions?
              </h4>
              <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-1">
                Our team and local travel experts are here to help you plan your journey.
              </p>
            </div>
          </div>

          <Link
            href={routes.support}
            className="w-full sm:w-auto px-6 py-3 rounded-full bg-[#C59A2F] text-white text-xs sm:text-sm font-black uppercase tracking-wider hover:bg-[#A67F26] transition shadow-xs flex items-center justify-center gap-2 shrink-0 cursor-pointer"
          >
            <span>Visit Help Center</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
