"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin } from "lucide-react";
import { HeroCurveDivider } from "./hero-curve-divider";

export function HomeHeroSection() {
  const router = useRouter();
  const [address, setAddress] = useState("");
  const [locationLoading, setLocationLoading] = useState(false);

  const handleSearch = () => {
    if (!address.trim()) return;
    router.push(`/explore-experience?q=${encodeURIComponent(address.trim())}`);
  };

  const handleUseLocation = () => {
    if (!navigator.geolocation) return;
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      () => {
        setAddress("Uttarakhand");
        setLocationLoading(false);
      },
      () => setLocationLoading(false),
      { timeout: 8000 }
    );
  };

  return (
    <div className="relative z-20 w-full min-h-[505px] sm:min-h-[565px] md:min-h-[680px] lg:min-h-[720px] flex flex-col justify-center items-center py-20 sm:py-24 md:py-32 px-4 sm:px-6 text-center">
      {/* Background Hero Image with Overlays */}
      <div className="absolute inset-0 z-0 overflow-hidden w-full h-full">
        <picture className="w-full h-full block">
          <source srcSet="/images/hero-mobile.jpg" media="(max-width: 767px)" />
          <img
            src="/images/hero-banner-full.jpg"
            alt="Athithya Local Travel"
            className="w-full h-full object-cover object-center block"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/75" />
      </div>

      {/* Hero Content */}
      <div className="relative z-20 max-w-5xl mx-auto flex flex-col items-center justify-center w-full my-auto">
        <h1 className="text-[1.85rem] xs:text-[2.25rem] sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif italic font-black tracking-[0.02em] leading-tight md:leading-none mb-4 sm:mb-8 drop-shadow-2xl px-2 w-full max-w-5xl mx-auto text-center select-none text-white">
          <span className="text-[#C59A2F]">Athithya</span>
          <span> - Your Travel Experience Platform</span>
        </h1>

        {/* Omnisearch Box */}
        <div className="w-full max-w-3xl mx-auto bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md rounded-full shadow-2xl p-1.5 md:p-2 flex items-center border border-white/40 dark:border-neutral-800 transition-all">
          <div className="flex-1 flex items-center px-2.5 sm:px-4 md:px-5 py-1.5 sm:py-2 w-full">
            <Search className="text-[#C59A2F] mr-2.5 sm:mr-3 shrink-0 w-4 h-4 sm:w-5 sm:h-5" />
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Search experiences, hosts, activities..."
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="bg-transparent focus:outline-none text-neutral-800 dark:text-neutral-100 font-bold text-xs sm:text-sm w-full placeholder:text-neutral-400 placeholder:font-normal"
            />
            <button
              type="button"
              onClick={handleUseLocation}
              className="text-[#C59A2F] text-[9px] md:text-[10px] font-bold uppercase tracking-wider whitespace-nowrap ml-1.5 sm:ml-2 hover:bg-yellow-50 dark:hover:bg-neutral-800 px-2.5 py-1.5 sm:px-3 sm:py-1.5 rounded-full transition border border-yellow-200 dark:border-[#C59A2F]/30 shrink-0 flex items-center gap-1 cursor-pointer"
              title="Detect location"
            >
              <MapPin className="w-3 h-3 shrink-0" />
              <span>{locationLoading ? "Detecting..." : "Current Location"}</span>
            </button>
          </div>
          <button
            type="button"
            onClick={handleSearch}
            className="p-2.5 sm:px-5 sm:py-2.5 rounded-full bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider hover:bg-[#A67F26] transition shadow-md hidden sm:flex items-center gap-1.5 cursor-pointer"
          >
            <span>Search</span>
          </button>
        </div>
      </div>

      <HeroCurveDivider />
    </div>
  );
}
