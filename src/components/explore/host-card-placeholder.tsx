import { Star, MapPin } from "lucide-react";

export function HostCardPlaceholder() {
  return (
    <div className="w-full bg-white dark:bg-neutral-900 rounded-[1.2rem] md:rounded-[2rem] overflow-hidden border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full text-left select-none">
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full bg-neutral-200/70 dark:bg-neutral-700/60 flex items-center justify-center text-neutral-400 mb-2">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        </div>
        <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
          No image
        </span>
        <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10">
          <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xs px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs border border-neutral-100/50 dark:border-neutral-800 text-[10px] md:text-xs font-bold text-neutral-700 dark:text-neutral-200">
            <Star className="text-[#C59A2F] fill-[#C59A2F]" size={10} />
            <span>No rating</span>
          </div>
        </div>
      </div>

      <div className="p-4 md:p-5 flex flex-col gap-1.5 grow">
        <h3 className="font-extrabold text-neutral-900 dark:text-neutral-100 text-sm md:text-base leading-snug truncate">
          No name
        </h3>
        <div className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          <MapPin size={11} className="text-[#C59A2F]" />
          <span className="truncate">No location</span>
        </div>
        <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs">
          <span className="font-semibold text-neutral-400 dark:text-neutral-500">
            Total Experiences
          </span>
          <span className="font-bold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-md">
            No experiences
          </span>
        </div>
      </div>
    </div>
  );
}
