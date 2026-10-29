import React from "react";

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

export function ExperienceCardSkeleton() {
  return (
    <div className="shrink-0 w-[260px] sm:w-[280px] md:w-[300px] flex flex-col snap-start">
      <div className="relative aspect-[4/3] rounded-2xl md:rounded-[1.5rem] bg-neutral-100 animate-pulse mb-3 md:mb-4 dark:bg-neutral-800 transition-colors" />
      <div className="px-1 space-y-3">
        <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-lg h-6 w-3/4" />
        <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-lg h-4 w-1/2" />
        <div className="flex justify-between items-center">
          <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-lg h-6 w-1/4" />
          <div className="animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-full h-8 w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function ExperienceCardPlaceholder(_props: {
  item?: Partial<ExperienceItemPreview>;
}) {
  return <ExperienceCardSkeleton />;
}
