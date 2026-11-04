import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full space-y-6">
      {/* Hero Gallery Skeleton */}
      <Skeleton className="w-full h-[320px] sm:h-[420px] lg:h-[480px] rounded-3xl" />

      {/* Header Skeleton */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
        <Skeleton className="h-8 md:h-10 w-3/4 max-w-xl" />
        <Skeleton className="h-5 w-48 rounded-xl" />
      </div>

      {/* Sticky Nav Tabs Skeleton */}
      <Skeleton className="h-12 w-full max-w-md" />

      {/* Content Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 pt-4">
        <div className="lg:col-span-7 xl:col-span-8 space-y-8">
          <div className="space-y-3">
            <Skeleton className="h-6 w-32 rounded-xl" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-5/6 rounded" />
            <Skeleton className="h-4 w-4/6 rounded" />
          </div>
          <Skeleton className="h-16 w-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 xl:col-span-4 w-full">
          <Skeleton className="h-96 w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
}
