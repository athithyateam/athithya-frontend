"use client";

import { useThemeStore } from "@/stores/theme-store";

export function HeroCurveDivider() {
  const isDark = useThemeStore((s) => s.theme === "dark");
  const bgFill = isDark ? "#0a0a0a" : "#ffffff";

  return (
    <div className="absolute bottom-0 left-0 right-0 w-full overflow-hidden z-0 pointer-events-none translate-y-[1px]">
      <svg
        viewBox="0 0 1440 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-8 sm:h-12 md:h-16 lg:h-20 block transition-colors"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="athithyaCurveStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C59A2F" stopOpacity="0.4" />
            <stop offset="10%" stopColor="#C59A2F" stopOpacity="1" />
            <stop offset="50%" stopColor="#C59A2F" stopOpacity="1" />
            <stop offset="90%" stopColor="#C59A2F" stopOpacity="1" />
            <stop offset="100%" stopColor="#C59A2F" stopOpacity="0.4" />
          </linearGradient>
        </defs>
        <path
          d="M0,58 Q720,8 1440,58 L1440,64 L0,64 Z"
          fill={bgFill}
          className="transition-colors duration-200"
        />
        <path
          d="M0,58 Q720,8 1440,58"
          stroke="url(#athithyaCurveStroke)"
          strokeWidth="6"
          className="[stroke-width:9px] sm:[stroke-width:7.5px] md:[stroke-width:6px]"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
