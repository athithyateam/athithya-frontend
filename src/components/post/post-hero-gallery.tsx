"use client";

import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Play, Bookmark, Grid, Share2 } from "lucide-react";
import { getOptimizedImage } from "@/lib/image-helper";
import { MediaLightbox } from "@/components/ui/media-lightbox";
import { useFeedbackStore } from "@/stores/feedback-store";
import { useAuthStore } from "@/stores/auth-store";
import { saveExperienceApi, unsaveExperienceApi } from "@/lib/api/experiences-api";

interface PostHeroGalleryProps {
  post: Record<string, unknown> | null | undefined;
  onBack?: () => void;
  isSaved?: boolean;
  onToggleSave?: () => void;
}

function GalleryImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  loading = "lazy",
  fetchPriority = "low",
  sizes,
  onLoad,
}: {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  loading?: "eager" | "lazy";
  fetchPriority?: "high" | "low" | "auto";
  sizes?: string;
  onLoad?: () => void;
}) {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`relative w-full h-full overflow-hidden bg-neutral-200 dark:bg-neutral-800 ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800 animate-pulse z-[1]" />
      )}
      <img
        src={src}
        alt={alt}
        loading={loading}
        fetchPriority={fetchPriority}
        decoding="async"
        sizes={sizes}
        onLoad={() => {
          setLoaded(true);
          onLoad?.();
        }}
        className={`w-full h-full object-cover transition-all duration-500 ${loaded ? "opacity-100" : "opacity-0"
          } ${imgClassName}`}
      />
    </div>
  );
}

export function PostHeroGallery({
  post,
  onBack,
  isSaved: controlledIsSaved,
  onToggleSave: controlledOnToggleSave,
}: PostHeroGalleryProps) {
  const router = useRouter();
  const { user: currentUser, fetchUser, openAuthModal } = useAuthStore();
  const { showToast } = useFeedbackStore();
  const [optimisticSaved, setOptimisticSaved] = useState<boolean | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const postId = String(post?._id || post?.id || "");

  const computedSaved = useMemo(() => {
    const savedList = currentUser?.savedExperiences;
    if (!Array.isArray(savedList)) return false;
    return savedList.some((item: unknown) => {
      const idStr =
        item && typeof item === "object"
          ? (item as { _id?: string; id?: string })._id ||
          (item as { _id?: string; id?: string }).id
          : item;
      return String(idStr) === String(postId);
    });
  }, [currentUser?.savedExperiences, postId]);

  const isSaved =
    controlledIsSaved !== undefined
      ? controlledIsSaved
      : optimisticSaved !== null
        ? optimisticSaved
        : computedSaved;

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const handleToggleSave = async () => {
    if (controlledOnToggleSave) {
      controlledOnToggleSave();
      return;
    }
    if (!currentUser) {
      openAuthModal("login");
      return;
    }
    if (currentUser.role === "host") {
      showToast(
        "Hosts cannot engage with another host's experience. Only guests can.",
        "error"
      );
      return;
    }
    if (!postId) return;
    const nextSaved = !isSaved;
    setOptimisticSaved(nextSaved);
    try {
      if (nextSaved) {
        await saveExperienceApi(postId);
        showToast("Experience saved to your profile!", "success");
      } else {
        await unsaveExperienceApi(postId);
        showToast("Experience removed from saved", "success");
      }
      await fetchUser();
    } catch {
      setOptimisticSaved(!nextSaved);
      showToast("Failed to update saved experience", "error");
    }
  };

  const mediaList = useMemo(() => {
    const rawPhotos = Array.isArray(post?.photos) ? post.photos : [];
    const photos = rawPhotos.map((p: unknown) => ({
      url: (typeof p === "object" && p !== null && "url" in p
        ? (p as { url: string }).url
        : p) as string,
      type: "image" as const,
    }));
    const rawVideos = Array.isArray(post?.videos) ? post.videos : [];
    const videos = rawVideos.map((v: unknown) => ({
      url: (typeof v === "object" && v !== null && "url" in v
        ? (v as { url: string }).url
        : v) as string,
      type: "video" as const,
    }));
    const combined = [...photos, ...videos];
    if (combined.length === 0) {
      return [
        {
          url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200",
          type: "image" as const,
        },
      ];
    }
    return combined;
  }, [post]);

  const openLightboxAt = (idx: number) => {
    setLightboxIndex(idx);
    setIsLightboxOpen(true);
  };

  const postTitle = typeof post?.title === "string" ? post.title : "Experience";
  const postDesc =
    typeof post?.description === "string" ? post.description : "";

  const handleShare = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      if (navigator.share) {
        await navigator.share({
          title: postTitle,
          text: postDesc.substring(0, 100),
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast("Link copied to clipboard!", "success");
      }
    } catch { }
  };

  const mainMedia = mediaList[0];
  const secondaryMedia = mediaList.slice(1, 5);
  const totalCount = mediaList.length;

  return (
    <div className="relative w-full">
      {/* Desktop Gallery Grid */}
      <div className="hidden md:block relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xs border border-neutral-200/60 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
        {/* Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-100 border border-neutral-200/70 dark:border-neutral-700 shadow-md backdrop-blur-md flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
          title="Go back"
        >
          <ArrowLeft size={16} />
        </button>

        {/* Action Controls */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-100 border border-neutral-200/70 dark:border-neutral-700 shadow-md backdrop-blur-md flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
            title="Share"
          >
            <Share2 size={15} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleToggleSave();
            }}
            className="w-10 h-10 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-100 border border-neutral-200/70 dark:border-neutral-700 shadow-md backdrop-blur-md flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
            title={isSaved ? "Saved to favorites" : "Save to favorites"}
          >
            <Bookmark
              size={15}
              className={isSaved ? "fill-[#C59A2F] text-[#C59A2F]" : ""}
            />
          </button>
        </div>

        {/* Gallery Layout based on count */}
        {totalCount === 1 ? (
          <div
            onClick={() => openLightboxAt(0)}
            className="w-full h-[420px] lg:h-[480px] relative cursor-pointer overflow-hidden"
          >
            <GalleryImage
              src={getOptimizedImage(mainMedia.url, { width: 1400 })}
              alt={postTitle}
              loading="eager"
              fetchPriority="high"
              sizes="100vw"
            />
          </div>
        ) : totalCount === 2 ? (
          <div className="grid grid-cols-2 gap-2 h-[420px] lg:h-[480px]">
            <div
              onClick={() => openLightboxAt(0)}
              className="relative cursor-pointer overflow-hidden group/main"
            >
              <GalleryImage
                src={getOptimizedImage(mainMedia.url, { width: 900 })}
                alt={postTitle}
                loading="eager"
                fetchPriority="high"
                sizes="50vw"
                imgClassName="group-hover/main:scale-105"
              />
            </div>
            <div
              onClick={() => openLightboxAt(1)}
              className="relative cursor-pointer overflow-hidden group/tile"
            >
              <GalleryImage
                src={getOptimizedImage(mediaList[1].url, { width: 900 })}
                alt={`${postTitle} 2`}
                loading="eager"
                fetchPriority="auto"
                sizes="50vw"
                imgClassName="group-hover/tile:scale-105"
              />
            </div>
          </div>
        ) : totalCount === 3 ? (
          <div className="grid grid-cols-3 gap-2 h-[420px] lg:h-[480px]">
            <div
              onClick={() => openLightboxAt(0)}
              className="col-span-2 relative cursor-pointer overflow-hidden group/main"
            >
              <GalleryImage
                src={getOptimizedImage(mainMedia.url, { width: 1000 })}
                alt={postTitle}
                loading="eager"
                fetchPriority="high"
                sizes="66vw"
                imgClassName="group-hover/main:scale-105"
              />
            </div>
            <div className="col-span-1 grid grid-rows-2 gap-2">
              {[mediaList[1], mediaList[2]].map((item, idx) => (
                <div
                  key={idx}
                  onClick={() => openLightboxAt(idx + 1)}
                  className="relative cursor-pointer overflow-hidden group/tile"
                >
                  <GalleryImage
                    src={getOptimizedImage(item.url, { width: 500 })}
                    alt={`${postTitle} ${idx + 2}`}
                    loading={idx === 0 ? "eager" : "lazy"}
                    fetchPriority={idx === 0 ? "auto" : "low"}
                    sizes="33vw"
                    imgClassName="group-hover/tile:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[420px] lg:h-[480px]">
            <div
              onClick={() => openLightboxAt(0)}
              className="col-span-2 row-span-2 relative cursor-pointer overflow-hidden group/main"
            >
              {mainMedia.type === "video" ? (
                <>
                  <video
                    src={mainMedia.url}
                    className="w-full h-full object-cover group-hover/main:scale-105 transition-transform duration-500"
                    muted
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/90 text-[#C59A2F] flex items-center justify-center shadow-lg">
                      <Play size={16} className="ml-0.5 fill-current" />
                    </div>
                  </div>
                </>
              ) : (
                <GalleryImage
                  src={getOptimizedImage(mainMedia.url, { width: 900 })}
                  alt={postTitle}
                  loading="eager"
                  fetchPriority="high"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 660px"
                  imgClassName="group-hover/main:scale-105"
                />
              )}
            </div>

            {[0, 1, 2, 3].map((slotIndex) => {
              const item = secondaryMedia[slotIndex] || mainMedia;
              const actualIndex = slotIndex + 1 < mediaList.length ? slotIndex + 1 : 0;
              const isTopRow = slotIndex < 2;
              return (
                <div
                  key={slotIndex}
                  onClick={() => openLightboxAt(actualIndex)}
                  className="col-span-1 row-span-1 relative cursor-pointer overflow-hidden group/tile"
                >
                  <GalleryImage
                    src={getOptimizedImage(item.url, { width: 500 })}
                    alt={`Gallery ${slotIndex + 2}`}
                    loading={isTopRow ? "eager" : "lazy"}
                    fetchPriority={isTopRow ? "auto" : "low"}
                    sizes="(max-width: 1280px) 25vw, 330px"
                    imgClassName="group-hover/tile:scale-105"
                  />
                </div>
              );
            })}
          </div>
        )}

        {/* View All Photos Button */}
        <button
          type="button"
          onClick={() => openLightboxAt(0)}
          className="absolute bottom-5 right-5 z-10 inline-flex items-center gap-2 px-4 py-2 bg-white/95 dark:bg-neutral-900/95 text-neutral-900 dark:text-neutral-100 rounded-xl text-xs font-black uppercase tracking-wider border border-neutral-200/80 dark:border-neutral-700 shadow-md backdrop-blur-md cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
        >
          <Grid size={14} className="text-[#C59A2F]" />
          <span>Show all {mediaList.length} photos</span>
        </button>
      </div>

      {/* Mobile Hero Banner */}
      <div className="block md:hidden relative rounded-2xl overflow-hidden shadow-sm aspect-[4/3]">
        <GalleryImage
          src={getOptimizedImage(mainMedia.url, { width: 800 })}
          alt={postTitle}
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
        />
        <div
          onClick={() => openLightboxAt(0)}
          className="absolute inset-0 cursor-pointer"
        />
        <button
          type="button"
          onClick={handleBack}
          className="absolute top-3 left-3 z-10 w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center cursor-pointer"
        >
          <ArrowLeft size={14} />
        </button>
        <div className="absolute top-3 right-3 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center cursor-pointer"
          >
            <Share2 size={14} />
          </button>
          <button
            type="button"
            onClick={handleToggleSave}
            className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-md text-white flex items-center justify-center cursor-pointer"
            title={isSaved ? "Saved to favorites" : "Save to favorites"}
          >
            <Bookmark size={14} className={isSaved ? "fill-[#C59A2F] text-[#C59A2F]" : ""} />
          </button>
        </div>

        {totalCount > 1 && (
          <button
            type="button"
            onClick={() => openLightboxAt(0)}
            className="absolute bottom-3 right-3 z-10 px-3 py-1 bg-black/60 backdrop-blur-md text-white rounded-full text-[11px] font-bold tracking-wider cursor-pointer"
          >
            1 / {totalCount} photos
          </button>
        )}
      </div>

      {/* Lightbox Modal */}
      <MediaLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        mediaItems={mediaList}
        initialIndex={lightboxIndex}
      />
    </div>
  );
}
