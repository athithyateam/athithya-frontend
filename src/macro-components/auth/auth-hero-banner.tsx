"use client";

import Image from "next/image";
import { BrandLogo } from "@/mini-components/ui/brand-logo";
import { Carousel } from "@/mini-components/ui/carousel";
import type { AuthSlide, AuthHeroBannerProps } from "./types";

export const defaultAuthSlides: AuthSlide[] = [
  {
    imageSrc: "/auth/banner-1.jpg",
    imageAlt: "Starlit Himalayan mountain camping and stargazing experience",
    quotePrefix: "It's about the ",
    highlightWord: "experiences",
    quoteSuffix: " you live along the way.",
    subtitle:
      "Capturing Moments, Creating Memories across extraordinary destinations.",
  },
  {
    imageSrc: "/auth/banner-2.avif",
    imageAlt: "Misty pine valley trekking trails with local hosts",
    quotePrefix: "Discover untamed ",
    highlightWord: "horizons",
    quoteSuffix: " with trusted local hosts.",
    subtitle:
      "Curated outdoor adventures tailored for curious wanderers and seekers.",
  },
];

export function AuthHeroBanner({
  slides = defaultAuthSlides,
  intervalMs = 2500,
  className = "",
}: AuthHeroBannerProps) {
  return (
    <div
      className={`relative hidden md:flex flex-col justify-between w-full md:w-[46%] min-h-[580px] md:min-h-[665px] rounded-2xl overflow-hidden bg-[#0A0A0C] border border-[#1E1E22] select-none ${className}`}
    >
      {/* Top Header: Athithya Golden Logo (Persistent & Layered Above Slides) */}
      <div className="absolute top-8 left-8 z-20 flex items-center justify-start pointer-events-auto">
        <BrandLogo iconSize={28} />
      </div>

      {/* Unified Synchronized Carousel (Background + Text in 100% Lockstep) */}
      <Carousel
        items={slides}
        intervalMs={intervalMs}
        autoPlay={true}
        pauseOnHover={true}
        className="w-full h-full"
        trackClassName="h-full"
        indicatorsClassName="absolute bottom-8 left-8 z-20"
        aria-label="Athithya Experience Carousel"
        renderItem={(slide, index) => (
          <div className="relative w-full h-full flex flex-col justify-end p-8 overflow-hidden">
            {/* Background Image */}
            <Image
              src={slide.imageSrc}
              alt={slide.imageAlt}
              fill
              priority={index === 0}
              className="object-cover object-center pointer-events-none"
              sizes="(max-width: 768px) 100vw, 45vw"
            />

            {/* Dark Vignette Overlay for Crisp Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#06070A] via-[#06070A]/20 to-black/30 pointer-events-none" />

            {/* Quote & Subtitle (Slides Together with Background) */}
            <figure className="relative z-10 space-y-2 pb-6 max-w-[90%]">
              <blockquote className="text-xl sm:text-2xl font-light text-white leading-snug">
                {slide.quotePrefix}
                <span className="font-serif italic font-medium text-[#DF9E26] tracking-wide">
                  {slide.highlightWord}
                </span>
                {slide.quoteSuffix}
              </blockquote>
              <figcaption className="text-xs text-neutral-400 font-normal">
                {slide.subtitle}
              </figcaption>
            </figure>
          </div>
        )}
      />
    </div>
  );
}
