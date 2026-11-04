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
    } else {
      router.back();
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
    const nextSavedState = !isSaved;
    setOptimisticSaved(nextSavedState);
    try {
      if (nextSavedState) {
        await saveExperienceApi(postId);
        showToast("Experience saved to your profile!", "success");
      } else {
        await unsaveExperienceApi(postId);
        showToast("Experience removed from saved", "success");
      }
      await fetchUser();
    } catch {
      setOptimisticSaved(!nextSavedState);
      showToast("Failed to save experience", "error");
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
    } catch {}
  };

  const mainMedia = mediaList[0];
  const secondaryMedia = mediaList.slice(1, 5);
  const hasMultiple = mediaList.length > 1;

  return (
    <div className="relative w-full">
      <div className="hidden md:block relative rounded-2xl md:rounded-3xl overflow-hidden shadow-xs border border-neutral-200/60 dark:border-neutral-800 bg-neutral-100 dark:bg-neutral-900">
        <button
          type="button"
          onClick={handleBack}
          className="absolute top-4 left-4 z-10 w-10 h-10 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-100 border border-neutral-200/70 dark:border-neutral-700 shadow-md backdrop-blur-md flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
          title="Go back"
        >
          <ArrowLeft size={15} />
        </button>

        <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="w-10 h-10 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-100 border border-neutral-200/70 dark:border-neutral-700 shadow-md backdrop-blur-md flex items-center justify-center hover:scale-105 transition-all cursor-pointer"
            title="Share this experience"
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

        {hasMultiple ? (
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
                <img
                  src={getOptimizedImage(mainMedia.url, { width: 900 })}
                  className="w-full h-full object-cover group-hover/main:scale-105 transition-transform duration-500"
                  alt={postTitle}
                />
              )}
            </div>

            {[0, 1, 2, 3].map((slotIndex) => {
              const item = secondaryMedia[slotIndex] || mainMedia;
              const actualIndex = slotIndex + 1 < mediaList.length ? slotIndex + 1 : 0;
              return (
                <div
                  key={slotIndex}
                  onClick={() => openLightboxAt(actualIndex)}
                  className="col-span-1 row-span-1 relative cursor-pointer overflow-hidden group/tile"
                >
                  <img
                    src={getOptimizedImage(item.url, { width: 500 })}
                    className="w-full h-full object-cover group-hover/tile:scale-105 transition-transform duration-500"
                    alt={`Gallery ${slotIndex + 2}`}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div
            onClick={() => openLightboxAt(0)}
            className="w-full h-[420px] lg:h-[480px] relative cursor-pointer overflow-hidden"
          >
            <img
              src={getOptimizedImage(mainMedia.url, { width: 1400 })}
              className="w-full h-full object-cover"
              alt={postTitle}
            />
          </div>
        )}

        <button
          type="button"
          onClick={() => openLightboxAt(0)}
          className="absolute bottom-5 right-5 z-10 inline-flex items-center gap-2 px-4 py-2 bg-white/95 dark:bg-neutral-900/95 text-neutral-900 dark:text-neutral-100 rounded-xl text-xs font-black uppercase tracking-wider border border-neutral-200/80 dark:border-neutral-700 shadow-md backdrop-blur-md cursor-pointer"
        >
          <Grid size={14} className="text-[#C59A2F]" />
          <span>Show all {mediaList.length} photos</span>
        </button>
      </div>

      <div className="block md:hidden relative rounded-2xl overflow-hidden shadow-sm aspect-[4/3] bg-neutral-100 dark:bg-neutral-800">
        <img
          src={getOptimizedImage(mainMedia.url, { width: 800 })}
          className="w-full h-full object-cover"
          alt={postTitle}
          onClick={() => openLightboxAt(0)}
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
      </div>

      <MediaLightbox
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        mediaItems={mediaList}
        initialIndex={lightboxIndex}
      />
    </div>
  );
}
