"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { routes } from "@/config/navigation";

const aboutImages = [
  { src: "/images/trek/trek-1.jpeg", label: "Trekking" },
  { src: "/images/rafting/rafting-1.jpeg", label: "Rafting" },
  { src: "/images/paragliding/paragliding-1.jpeg", label: "Paragliding" },
  { src: "/images/camping/camping-1.jpeg", label: "Camping" },
  { src: "/images/bungee/bungee-1.jpeg", label: "Bungee" },
];

const slides = [
  {
    id: "quote",
    stepNumber: "01",
    tabTitle: "The Spark",
    content: (
      <div className="space-y-3 sm:space-y-4 text-left">
        <p className="text-xs font-bold uppercase tracking-wider text-[#C59A2F]">
          The Explorer&apos;s Realization
        </p>

        <blockquote className="border-l-3 sm:border-l-4 border-[#C59A2F] pl-3 sm:pl-4 py-2 bg-[#FFF9EC]/80 dark:bg-neutral-800/50 rounded-r-2xl">
          <p className="text-sm sm:text-base md:text-lg font-bold text-neutral-900 dark:text-neutral-100 italic leading-snug">
            &ldquo;One day, we will all realize that most of our favorite memories have one thing in common.&rdquo;
          </p>
        </blockquote>

        <p className="text-xs sm:text-sm md:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
          They weren&apos;t created inside four walls, doing the same routine work every day. They came from saying yes:
        </p>

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm">
          {[
            "Yes to trying something new.",
            "Yes to stepping outside our comfort.",
            "Yes to experiences we always postponed.",
            "Yes to what we dreamed of as children.",
          ].map((item, i) => (
            <li
              key={i}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-white dark:bg-neutral-800/90 border border-neutral-200/70 dark:border-neutral-700/70 font-medium text-neutral-800 dark:text-neutral-200"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#C59A2F] shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 italic pt-1 leading-relaxed">
          Life isn&apos;t remembered in days — it is remembered in the memories that made our hearts race, made us smile, and helped us grow.
        </p>
      </div>
    ),
  },
  {
    id: "inspiration",
    stepNumber: "02",
    tabTitle: "Our Inspiration",
    content: (
      <div className="space-y-3 sm:space-y-4 text-left">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#C59A2F]">
            Why Athithya Began
          </p>
          <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide mt-1">
            OUR INSPIRATION
          </h2>
        </div>

        <p className="text-xs sm:text-sm md:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
          Finding great travel experiences was often harder than actually experiencing them. An incredible journey might be happening just a few kilometres away, yet stay completely hidden. And when we finally found something, we were left jumping between fragmented websites and promises.
        </p>

        <div className="border-l-3 sm:border-l-4 border-[#C59A2F] pl-3 sm:pl-4 py-2 bg-[#FFF9EC]/80 dark:bg-neutral-800/50 rounded-r-2xl">
          <p className="text-xs sm:text-sm md:text-base font-bold text-neutral-900 dark:text-neutral-100 leading-snug">
            That made us question: Why is discovering experiences harder than experiencing them?
          </p>
        </div>

        <p className="text-xs sm:text-sm md:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
          We thought of Athithya with a belief that every single one of us deserves the freedom to choose authentic experiences anytime. Instead of rigid schedules, we connect you with local hosts with whom you get the flexibility of experiencing life your way.
        </p>
      </div>
    ),
  },
  {
    id: "purpose",
    stepNumber: "03",
    tabTitle: "Vision & Purpose",
    content: (
      <div className="space-y-3 sm:space-y-4 text-left">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#C59A2F]">
            Where We Are Going
          </p>
          <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold text-neutral-900 dark:text-neutral-100 uppercase tracking-wide mt-1">
            OUR VISION &amp; PURPOSE
          </h2>
        </div>

        <p className="text-xs sm:text-sm md:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
          Our vision is to build a trusted platform where people discover, compare, and book countless travel experiences with verified local hosts, all in one place.
        </p>

        <p className="text-xs sm:text-sm md:text-base leading-relaxed text-neutral-700 dark:text-neutral-300">
          We want to inspire people to step out, stay curious, and create lifelong stories — while creating authentic economic opportunities for local mountain hosts to share their hospitality.
        </p>

        <div className="p-4 rounded-2xl bg-white dark:bg-neutral-800/90 border border-neutral-200/70 dark:border-neutral-700/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">Warm Regards,</p>
            <p className="text-sm sm:text-base font-black text-[#C59A2F]">Team Athithya</p>
          </div>
          <Link
            href={routes.exploreExperience}
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider hover:bg-[#A67F26] transition shadow-xs inline-flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Explore Experiences</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    ),
  },
];

export default function AboutPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300 pb-12 sm:pb-16 md:pb-24">
      <section className="pt-24 sm:pt-28 md:pt-32 pb-6 sm:pb-10 relative overflow-hidden text-center">
        <div className="max-w-[1300px] mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#C59A2F] mb-1.5 block">
            Our Journey &amp; Vision
          </span>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-neutral-900 dark:text-neutral-100 leading-tight tracking-wide">
            About Us &amp; <span className="text-[#C59A2F]">Our Story</span>
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base md:text-lg max-w-2xl font-medium mt-2 leading-relaxed mx-auto">
            Discover the passion, genuine connections, and local stories that inspire every Athithya journey.
          </p>
        </div>
      </section>

      <div className="max-w-[1300px] mx-auto px-3.5 sm:px-6 md:px-8">
        <div className="rounded-3xl border border-neutral-200/80 dark:border-neutral-800 bg-[#FAF8F5]/80 dark:bg-neutral-900/60 p-4 sm:p-7 md:p-10 lg:p-12 shadow-xs backdrop-blur-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left Circle Image Cluster */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full border-4 border-[#C59A2F]/30 p-2 overflow-hidden shadow-xl">
                <img
                  src={aboutImages[currentSlide % aboutImages.length].src}
                  alt="About Athithya"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            </div>

            {/* Right Narrative Slider */}
            <div className="lg:col-span-7 flex flex-col justify-between min-h-0 lg:min-h-[440px]">
              <div className="flex items-center gap-1.5 sm:gap-2.5 pb-3 sm:pb-4 border-b border-neutral-200/80 dark:border-neutral-800 select-none w-full">
                {slides.map((slide, idx) => {
                  const isActive = currentSlide === idx;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      onClick={() => setCurrentSlide(idx)}
                      className={`flex-1 sm:flex-initial px-3 sm:px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                        isActive
                          ? "bg-[#C59A2F] text-white shadow-xs"
                          : "bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700"
                      }`}
                    >
                      <span className={isActive ? "text-white" : "text-[#C59A2F]"}>
                        {slide.stepNumber}
                      </span>
                      <span>{slide.tabTitle}</span>
                    </button>
                  );
                })}
              </div>

              <div className="py-4 sm:py-6 grow flex items-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, x: 15 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -15 }}
                    transition={{ duration: 0.25 }}
                    className="w-full"
                  >
                    {slides[currentSlide].content}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="pt-3 border-t border-neutral-200/80 dark:border-neutral-800 flex items-center justify-center gap-2">
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setCurrentSlide(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentSlide === i ? "w-8 bg-[#C59A2F]" : "w-2 bg-neutral-300 dark:bg-neutral-700"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
