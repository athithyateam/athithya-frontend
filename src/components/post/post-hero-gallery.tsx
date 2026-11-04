"use client";

import React, { useState, useMemo, useRef } from "react";
import { Grid, ChevronLeft, ChevronRight } from "lucide-react";
import { MediaLightbox } from "@/components/ui/media-lightbox";
import { ProgressiveMedia } from "@/components/ui/progressive-image";
import { GalleryActionControls } from "@/components/post/gallery-action-controls";

export interface GalleryMediaItem {
  url: string;
  type: "image" | "video";
}

export interface PostHeroGalleryProps {
  post: Record<string, unknown> | null | undefined;
  onBack?: () => void;
}

const DEFAULT_FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200";

/**
 * Maps the number of secondary thumbnails (1 to 4) to an optimal CSS grid configuration.
 */
const SECONDARY_GRID_LAYOUTS: Record<number, string> = {
  1: "grid-cols-1 grid-rows-1",
  2: "grid-cols-1 grid-rows-2",
  3: "grid-cols-1 grid-rows-3",
  4: "grid-cols-2 grid-rows-2",
};

function extractMediaList(post: Record<string, unknown> | null | undefined): GalleryMediaItem[] {
  if (!post) return [{ url: DEFAULT_FALLBACK_IMAGE, type: "image" }];

  const rawPhotos = Array.isArray(post.photos) ? post.photos : [];
  const photos: GalleryMediaItem[] = [];
  for (const p of rawPhotos) {
    const url =
      typeof p === "string"
        ? p
        : p && typeof p === "object" && "url" in p
        ? (p as { url?: string }).url
        : "";
    if (url) photos.push({ url, type: "image" });
  }

  const rawVideos = Array.isArray(post.videos) ? post.videos : [];
  const videos: GalleryMediaItem[] = [];
  for (const v of rawVideos) {
    const url =
      typeof v === "string"
        ? v
        : v && typeof v === "object" && "url" in v
        ? (v as { url?: string }).url
        : "";
    if (url) videos.push({ url, type: "video" });
  }

  const combined = [...photos, ...videos];
  return combined.length > 0
    ? combined
    : [{ url: DEFAULT_FALLBACK_IMAGE, type: "image" }];
}

function GalleryTile({
  item,
  index,
  total,
  alt,
  priority = false,
  className = "",
  onClick,
}: {
  item: GalleryMediaItem;
  index: number;
  total: number;
  alt: string;
  priority?: boolean;
  className?: string;
  onClick: () => void;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className={`relative min-h-0 min-w-0 cursor-pointer overflow-hidden group focus:outline-hidden ${className}`}
      aria-label={`View photo ${index + 1} of ${total}`}
    >
      <ProgressiveMedia
        src={item.url}
        alt={alt}
        type={item.type}
        priority={priority}
        aspectRatio=""
        className="group-hover:scale-105 transition-transform duration-500"
      />
    </div>
  );
}

export function PostHeroGallery({ post, onBack }: PostHeroGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);
  const touchStartXRef = useRef<number | null>(null);

  const postId = String(post?._id || post?.id || "");
  const postTitle = typeof post?.title === "string" ? post.title : "Experience";
  const postDesc = typeof post?.description === "string" ? post.description : "";

  const mediaList = useMemo(() => extractMediaList(post), [post]);
  const totalCount = mediaList.length;

  // Algorithmic layout: Featured item on left, up to 4 secondary items on right
  const visibleMedia = useMemo(() => mediaList.slice(0, 5), [mediaList]);
  const featuredMedia = visibleMedia[0];
  const secondaryMedia = useMemo(() => visibleMedia.slice(1), [visibleMedia]);
  const hasSecondary = secondaryMedia.length > 0;

  const handleMobilePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMobileIndex((prev) => (prev === 0 ? totalCount - 1 : prev - 1));
  };

  const handleMobileNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMobileIndex((prev) => (prev + 1) % totalCount);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartXRef.current - touchEndX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        setMobileIndex((prev) => (prev + 1) % totalCount);
      } else {
        setMobileIndex((prev) => (prev === 0 ? totalCount - 1 : prev - 1));
      }
    }
    touchStartXRef.current = null;
  };

  const openLightboxAt = (idx: number) => {
    setLightboxIndex(idx);
    setIsLightboxOpen(true);
  };

  return (
    <div className="relative w-full">
      {/* Desktop Algorithmic Mosaic */}
      <div className="hidden md:block relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xs border border-neutral-200/60 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900 h-[420px] lg:h-[480px]">
        <GalleryActionControls
          postId={postId}
          title={postTitle}
          description={postDesc}
          onBack={onBack}
        />

        <div className={`grid gap-2 h-full min-h-0 ${hasSecondary ? "grid-cols-2" : "grid-cols-1"}`}>
          {/* Left Column: Featured Media */}
          <GalleryTile
            item={featuredMedia}
            index={0}
            total={totalCount}
            alt={postTitle}
            priority
            className="h-full min-h-0"
            onClick={() => openLightboxAt(0)}
          />

          {/* Right Column: Algorithmic Secondary Grid */}
          {hasSecondary && (
            <div className={`grid gap-2 h-full min-h-0 ${SECONDARY_GRID_LAYOUTS[secondaryMedia.length]}`}>
              {secondaryMedia.map((item, idx) => {
                const actualIdx = idx + 1;
                return (
                  <GalleryTile
                    key={actualIdx}
                    item={item}
                    index={actualIdx}
                    total={totalCount}
                    alt={`${postTitle} - ${actualIdx + 1}`}
                    className="h-full min-h-0"
                    onClick={() => openLightboxAt(actualIdx)}
                  />
                );
              })}
            </div>
          )}
        </div>

        {totalCount > 1 && (
          <button
            type="button"
            onClick={() => openLightboxAt(0)}
            className="absolute bottom-5 right-5 z-10 inline-flex items-center gap-2 px-4 py-2 bg-white/95 dark:bg-neutral-900/95 text-neutral-900 dark:text-neutral-100 rounded-xl text-xs font-black uppercase tracking-wider border border-neutral-200 dark:border-neutral-700 shadow-md cursor-pointer transition-all hover:bg-white dark:hover:bg-neutral-900 hover:scale-105 active:scale-95"
          >
            <Grid size={14} className="text-[#C59A2F]" />
            <span>Show all {totalCount} photos</span>
          </button>
        )}
      </div>

      {/* Mobile Interactive Hero Carousel Track */}
      <div
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="block md:hidden relative rounded-2xl overflow-hidden shadow-xs aspect-[4/3] bg-neutral-100 dark:bg-neutral-900 select-none"
      >
        <GalleryActionControls
          postId={postId}
          title={postTitle}
          description={postDesc}
          onBack={onBack}
        />

        {/* Sliding Flex Track */}
        <div
          className="flex w-full h-full transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: `translateX(-${mobileIndex * 100}%)` }}
        >
          {mediaList.map((item, idx) => (
            <div
              key={idx}
              role="button"
              tabIndex={0}
              onClick={() => openLightboxAt(idx)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") openLightboxAt(idx);
              }}
              className="w-full h-full shrink-0 relative cursor-pointer group focus:outline-hidden"
              aria-label={`View photo ${idx + 1} of ${totalCount}`}
            >
              <ProgressiveMedia
                src={item.url}
                alt={`${postTitle} - ${idx + 1}`}
                type={item.type}
                priority={idx === 0}
                className="w-full h-full"
              />
            </div>
          ))}
        </div>

        {/* Floating Left / Right Navigation Chevrons */}
        {totalCount > 1 && (
          <>
            <button
              type="button"
              onClick={handleMobilePrev}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs border border-white/20 shadow-md flex items-center justify-center cursor-pointer transition-transform active:scale-90"
              title="Previous photo"
              aria-label="Previous photo"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={handleMobileNext}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-xs border border-white/20 shadow-md flex items-center justify-center cursor-pointer transition-transform active:scale-90"
              title="Next photo"
              aria-label="Next photo"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Dynamic Mobile Counter Badge */}
        {totalCount > 1 && (
          <button
            type="button"
            onClick={() => openLightboxAt(mobileIndex)}
            className="absolute bottom-3 right-3 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 bg-black/70 text-white rounded-lg text-[11px] font-bold tracking-tight backdrop-blur-xs shadow-sm cursor-pointer"
          >
            <Grid size={12} className="text-[#C59A2F]" />
            <span>{mobileIndex + 1} / {totalCount}</span>
          </button>
        )}
      </div>

      {/* Fullscreen Lightbox Modal */}
      <MediaLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        mediaItems={mediaList}
        initialIndex={lightboxIndex}
      />
    </div>
  );
}
