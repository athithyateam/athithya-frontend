import React from "react";

export default function ExperienceLoading() {
  return (
    <div className="w-full min-h-[60vh] flex flex-col items-center justify-center">
      {/* Top Gold Progress Indicator */}
      <div className="fixed top-0 left-0 right-0 h-1 z-[9999] bg-neutral-200/50 dark:bg-neutral-800/50 overflow-hidden">
        <div className="h-full bg-[#C59A2F] w-2/5 animate-[pulse_1.2s_ease-in-out_infinite]" />
      </div>

      {/* Clean minimal indicator - No skeleton boxes or pulsing wireframes */}
      <div className="flex flex-col items-center justify-center gap-3 py-16">
        <div className="w-8 h-8 border-2 border-[#C59A2F]/20 border-t-[#C59A2F] rounded-full animate-spin" />
        <span className="text-xs font-bold uppercase tracking-wider text-[#C59A2F]">
          Loading Experience...
        </span>
      </div>
    </div>
  );
}
