"use client";

import { useThemeStore } from "@/stores/theme-store";

export function FooterCurveDivider() {
  const isDark = useThemeStore((s) => s.theme === "dark");
  const topBgFill = isDark ? "#0a0a0a" : "#ffffff";

  return (
    <div className="relative w-full overflow-hidden pointer-events-none -mb-1 z-10">
      <svg
        viewBox="0 0 1440 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-8 sm:h-12 md:h-16 lg:h-20 block transition-colors"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="athithyaFooterCurveStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C59A2F" stopOpacity="0.3" />
            <stop offset="15%" stopColor="#C59A2F" stopOpacity="1" />
            <stop offset="50%" stopColor="#C59A2F" stopOpacity="1" />
            <stop offset="85%" stopColor="#C59A2F" stopOpacity="1" />
            <stop offset="100%" stopColor="#C59A2F" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d="M0,0 L1440,0 L1440,16 Q720,60 0,16 Z"
          fill={topBgFill}
          className="transition-colors duration-200"
        />
        <path
          d="M0,16 Q720,60 1440,16"
          stroke="url(#athithyaFooterCurveStroke)"
          strokeWidth="5"
          className="[stroke-width:7px] sm:[stroke-width:6px] md:[stroke-width:5px]"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
