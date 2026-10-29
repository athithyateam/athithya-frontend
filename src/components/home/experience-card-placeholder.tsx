import { Star, MapPin } from "lucide-react";

export interface ExperienceItemPreview {
  id: string;
  title?: string;
  location?: string;
  price?: string | number;
  rating?: string | number;
  reviewCount?: string | number;
  image?: string;
  postType?: string;
  duration?: string;
  hostName?: string;
  description?: string;
}

export function ExperienceCardPlaceholder({ item }: { item?: Partial<ExperienceItemPreview> }) {
  const title = item?.title || "No title";
  const location = item?.location || "No location";
  const price = item?.price ? String(item.price) : "No price";
  const rating = item?.rating ? String(item.rating) : "No rating";
  const postType = item?.postType || "No type";
  const duration = item?.duration || "No duration";
  const hostName = item?.hostName || "No host";
  const description = item?.description || "No description";

  return (
    <div className="shrink-0 w-[240px] sm:w-[260px] md:w-[280px] snap-start group flex flex-col select-none text-left">
      <div className="h-full flex flex-col bg-white dark:bg-neutral-900 rounded-2xl md:rounded-[1.5rem] border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden">
        {/* Media Image Area (Empty Blank Placeholder) */}
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800/80 border-b border-neutral-200/60 dark:border-neutral-800 flex flex-col items-center justify-center p-4">
          <div className="w-10 h-10 rounded-xl bg-neutral-200/70 dark:bg-neutral-700/60 flex items-center justify-center text-neutral-400 mb-1.5">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
              <circle cx="9" cy="9" r="2" />
              <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
            </svg>
          </div>
          <span className="text-[11px] font-bold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
            No image
          </span>

          {/* Top Left Badge */}
          <div className="absolute top-2.5 left-2.5 z-10">
            <span className="px-2 py-0.5 rounded-md bg-neutral-900/60 dark:bg-neutral-800/80 backdrop-blur-md text-neutral-300 text-[10px] font-bold uppercase tracking-wider border border-white/10">
              {postType}
            </span>
          </div>

          {/* Bottom Left Duration Badge */}
          <div className="absolute bottom-2.5 left-2.5 z-10 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded-md">
            <span className="text-white/90 text-[10px] font-bold">{duration}</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white dark:bg-neutral-900">
          <div>
            {/* Title */}
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm sm:text-base line-clamp-1 leading-snug mb-1.5">
              {title}
            </h4>

            {/* Description */}
            <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 mb-2">
              {description}
            </p>

            {/* Host Row */}
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-[8px] font-bold text-neutral-400 shrink-0">
                —
              </div>
              <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400 truncate">
                Hosted by <strong className="text-neutral-800 dark:text-neutral-200 font-semibold">{hostName}</strong>
              </span>
            </div>

            {/* Location Row */}
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 mb-3">
              <MapPin className="shrink-0 text-[#C59A2F]" size={13} />
              <span className="truncate">{location}</span>
            </div>
          </div>

          {/* Price & Rating Footer */}
          <div className="pt-2.5 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-[11px] text-neutral-400">Price:</span>
              <span className="font-black text-xs sm:text-sm text-neutral-900 dark:text-neutral-100">
                {price}
              </span>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-neutral-800 dark:text-neutral-200">
              <Star className="w-3 h-3 text-[#C59A2F] fill-[#C59A2F]" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">{rating}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
