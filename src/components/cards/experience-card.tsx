"use client";

import React, { useState, useEffect, memo, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Bookmark, Tag, MapPin, Edit, Trash2, Calendar } from "lucide-react";
import { extractExperienceCardMeta } from "@/lib/experience-helpers";
import { useAuthStore } from "@/stores/auth-store";
import { useFeedbackStore } from "@/stores/feedback-store";
import { deleteExperience, saveExperienceApi, unsaveExperienceApi } from "@/lib/api/experiences-api";
import { ConfirmModal, DiscountInfoModal } from "@/components/ui/modal";
import { ProgressiveImage } from "@/components/ui/progressive-image";

export interface ExperienceCardProps {
  data: Record<string, any>;
  className?: string;
  defaultType?: string;
  priority?: boolean;
  rowIndex?: number;
  cardIndex?: number;
  compact?: boolean;
  showBookmark?: boolean;
  onUnsave?: (id: string) => void;
  showActions?: boolean;
  onDeleteSuccess?: () => void;
  onImageLoad?: () => void;
  scheduledDate?: string;
  onEditSchedule?: (e: any) => void;
  onDeleteSchedule?: (e: any) => void;
  isThemed?: boolean;
}

export const ExperienceCard = memo(function ExperienceCard({
  data, className = "", defaultType, priority = false, rowIndex, cardIndex, compact = false,
  showBookmark = false, onUnsave, showActions = false, onDeleteSuccess,
  onImageLoad, scheduledDate, onEditSchedule, onDeleteSchedule, isThemed = false,
}: ExperienceCardProps) {
  const router = useRouter();
  const { user, openAuthModal } = useAuthStore();
  const { showToast } = useFeedbackStore();
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const meta = useMemo(() => extractExperienceCardMeta(data, compact, defaultType), [data, compact, defaultType]);

  useEffect(() => {
    const saved = user?.savedExperiences || (user as any)?.savedPosts;
    if (!Array.isArray(saved)) return setIsSaved(false);
    setIsSaved(saved.some((item: any) => String(typeof item === "object" ? item._id || item.id : item) === String(meta.id)));
  }, [user, meta.id]);

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return openAuthModal("login");
    if (user.role === "host") return showToast("You can't save another host experience, if you are already a host.", "error");
    try {
      if (!isSaved) {
        await saveExperienceApi(meta.id);
        setIsSaved(true);
        showToast("Saved to your profile!", "success");
      } else {
        await unsaveExperienceApi(meta.id);
        setIsSaved(false);
        showToast("Removed from saved", "success");
        onUnsave?.(meta.id);
      }
    } catch {
      showToast("Failed to update bookmark", "error");
    }
  };

  const performDelete = async () => {
    try {
      const res = await deleteExperience(meta.id);
      if (res?.success) {
        showToast(res?.message || "Experience deleted successfully", "success");
        onDeleteSuccess?.();
      } else showToast(res?.message || "Failed to delete experience", "error");
    } catch (err: any) {
      showToast(err?.message || "Failed to delete experience", "error");
    }
  };

  const handleCardClick = () => {
    try {
      if (typeof window !== "undefined" && meta.id) {
        sessionStorage.setItem(
          `post_preview_${meta.id}`,
          JSON.stringify({
            _id: meta.id,
            id: meta.id,
            title: data?.title || "",
            photos: meta.firstImage ? [{ url: meta.firstImage }] : [],
            location: {
              city: meta.displayLocation,
              district: meta.displayLocation,
              address: meta.displayLocation,
            },
            categories: Array.isArray(data?.categories)
              ? data.categories
              : data?.category
              ? [data.category]
              : [],
            postType: meta.postType,
            price: meta.totalPrice || meta.basePrice || 0,
            days: data?.days || data?.duration || 1,
            averageRating: data?.averageRating || data?.rating || null,
            totalReviews: data?.totalReviews || data?.reviewsCount || 0,
            description: data?.description || data?.overview || data?.caption || "",
            user: data?.user || data?.hostDetails || data?.host || null,
            ...data,
          })
        );
      }
    } catch {
      // sessionStorage unavailable or quota exceeded
    }
    router.push(`/post/${meta.id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`snap-start cursor-pointer group block h-full ${className || (compact ? "min-w-[160px] max-w-[160px]" : "home-card-size")}`}
    >
      <div
        className="h-full flex flex-col bg-white dark:bg-neutral-900 rounded-2xl md:rounded-[1.5rem] border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden profile-experience-card"
        style={isThemed ? { background: "transparent", borderColor: "rgba(255, 255, 255, 0.16)" } : undefined}
      >
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800">
          <ProgressiveImage
            src={meta.firstImage}
            alt={data?.title || "Experience"}
            rowIndex={rowIndex}
            cardIndex={cardIndex}
            priority={priority}
            aspectRatio="aspect-[4/3]"
            className="group-hover:scale-105 transition-transform duration-500"
            onLoad={onImageLoad}
          />
          {data?.discounts?.length > 0 && (
            <div onClick={(e) => { e.stopPropagation(); setShowDiscountModal(true); }} className="absolute top-3 left-3 z-10 px-2.5 py-1 rounded-md bg-[#C59A2F] text-white text-[9px] md:text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 cursor-pointer hover:bg-[#A67F26] shadow-md">
              <Tag className="w-3.5 h-3.5 shrink-0" /><span>Discount</span>
            </div>
          )}
          <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
            {meta.isNew && <span className="px-2 py-0.5 rounded-md bg-[#C59A2F] text-white text-[9px] md:text-[10px] font-black uppercase tracking-wider shadow-md border border-white dark:border-neutral-950">New</span>}
            {showActions && !data?.deleteRequested && (
              <div className="flex gap-1.5">
                <button onClick={(e) => { e.stopPropagation(); router.push(`/post?edit=${meta.id}`); }} className="w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-neutral-100 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#C59A2F] shadow-md flex items-center justify-center cursor-pointer"><Edit size={13} /></button>
                <button onClick={(e) => { e.stopPropagation(); setShowDeleteConfirm(true); }} className="w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-neutral-100 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-red-500 shadow-md flex items-center justify-center cursor-pointer"><Trash2 size={13} /></button>
              </div>
            )}
            {onDeleteSchedule && (
              <div className="flex gap-1.5">
                {onEditSchedule && (
                  <button onClick={onEditSchedule} className="w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-neutral-100 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-[#C59A2F] shadow-md flex items-center justify-center cursor-pointer"><Edit size={13} /></button>
                )}
                <button onClick={onDeleteSchedule} className="w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-neutral-100 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:text-red-500 shadow-md flex items-center justify-center cursor-pointer"><Trash2 size={13} /></button>
              </div>
            )}
            {showBookmark && !showActions && !onDeleteSchedule && (
              <button onClick={handleSave} className="w-8 h-8 md:w-9 md:h-9 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border border-neutral-100 dark:border-neutral-800 shadow-md flex items-center justify-center cursor-pointer">
                <Bookmark size={14} className={isSaved ? "fill-[#C59A2F] text-[#C59A2F]" : "text-neutral-500 dark:text-neutral-300 group-hover:text-[#C59A2F]"} />
              </button>
            )}
          </div>
          {scheduledDate && (
            <div className="absolute top-3 left-3 z-20 bg-black/70 backdrop-blur-md border border-white/20 px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-md">
              <Calendar className="text-[#C59A2F] shrink-0" size={12} /><span className="text-white text-[10px] font-bold uppercase tracking-tight">{scheduledDate}</span>
            </div>
          )}
          <div className="absolute bottom-3 left-3 z-10 bg-black/75 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-md shadow-sm">
            <span className="text-white text-xs md:text-sm font-bold leading-none">{meta.displayDuration}</span>
          </div>
        </div>
        <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between bg-white dark:bg-neutral-900" style={isThemed ? { background: "transparent" } : undefined}>
          <div>
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100 text-sm sm:text-base md:text-lg line-clamp-1 leading-snug mb-2 group-hover:text-[#C59A2F] transition-colors" style={isThemed ? { color: "#ffffff" } : undefined}>{data?.title || "Mountain Escape"}</h4>
            <div className={`flex items-center gap-2 mb-2 ${meta.hostId ? "cursor-pointer group/host" : ""}`} onClick={(e) => { if (meta.hostId) { e.stopPropagation(); router.push(`/profile/${meta.hostId}`); } }}>
              <div className="w-6 h-6 rounded-full overflow-hidden shrink-0">
                <ProgressiveImage
                  src={meta.hostAvatar}
                  alt={meta.hostName}
                  rowIndex={rowIndex}
                  cardIndex={cardIndex}
                  isAvatar
                  containerClassName="w-6 h-6 shrink-0 border border-neutral-200 dark:border-neutral-700"
                  fallbackSrc="https://ui-avatars.com/api/?name=Host&background=C59A2F&color=fff"
                />
              </div>
              <span className="text-xs sm:text-sm font-medium text-neutral-600 dark:text-neutral-400 truncate" style={isThemed ? { color: "rgba(255,255,255,0.85)" } : undefined}>
                Hosted by <strong className="text-neutral-800 dark:text-neutral-200 font-semibold group-hover/host:text-[#C59A2F]">{meta.hostName}</strong>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
              <MapPin className="text-[#C59A2F] shrink-0" size={12} />
              <span className="truncate" style={isThemed ? { color: "rgba(255,255,255,0.75)" } : undefined}>{meta.displayLocation}</span>
            </div>
          </div>
          <div className="pt-3 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between mt-3" style={isThemed ? { borderColor: "rgba(255, 255, 255, 0.12)" } : undefined}>
            <div className="flex flex-col">
              <span className="text-[10px] md:text-[11px] uppercase tracking-wider text-neutral-500 font-bold" style={isThemed ? { color: "rgba(255,255,255,0.6)" } : undefined}>Starting from</span>
              <div className="flex items-baseline gap-1">
                <span className="text-sm md:text-base font-black text-neutral-900 dark:text-neutral-100" style={isThemed ? { color: "#ffffff" } : undefined}>₹{meta.totalPrice.toLocaleString("en-IN")}</span>
                <span className="text-[11px] text-neutral-500 font-medium" style={isThemed ? { color: "rgba(255,255,255,0.7)" } : undefined}>{meta.pricePeriod}</span>
              </div>
            </div>
            <span className="text-xs font-bold text-[#C59A2F] group-hover:underline">View Details</span>
          </div>
        </div>
      </div>
      <DiscountInfoModal isOpen={showDiscountModal} onClose={() => setShowDiscountModal(false)} discounts={data?.discounts || []} basePrice={meta.basePrice} />
      <ConfirmModal isOpen={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} onConfirm={performDelete} title="Delete Experience" message="If you want to delete this experience, you need to send it for review. Once the team reviews it, we will delete your experience. Do you want to proceed?" confirmLabel="Yes" cancelLabel="No" />
    </div>
  );
});
