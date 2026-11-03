"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 350);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className={`fixed bottom-20 md:bottom-7 right-4 sm:right-6 z-40 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#C59A2F] hover:bg-[#A67F26] text-white shadow-xl flex items-center justify-center transition-all duration-300 cursor-pointer border border-white/20 dark:border-neutral-700 ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
          : "opacity-0 translate-y-5 scale-75 pointer-events-none"
      } hover:scale-110 active:scale-95 group`}
    >
      <ArrowUp size={16} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
    </button>
  );
}

