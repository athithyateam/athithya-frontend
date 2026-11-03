"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiGrid,
  FiImage,
  FiPlus,
  FiTrash2,
  FiX,
  FiPlay,
  FiFilm,
  FiCamera,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { FaThumbtack } from "react-icons/fa";
import { apiClient } from "@/lib/api/axios-instance";
import { getPresignedUrl, uploadFileToS3 } from "@/lib/api/posts-api";
import { useFeedbackStore } from "@/stores/feedback-store";
import { GOLD, type ProfileTheme } from "./profile-shared";

async function uploadMediaFiles(files: File[], uploadType = "personal") {
  const results: Array<{ url: string; public_id: string }> = [];
  for (const file of files) {
    const presigned = await getPresignedUrl(file.name, file.type, {
      uploadType,
      fileSize: file.size,
    });
    const uploadUrl = presigned?.uploadUrl || presigned?.data?.uploadUrl;
    const fileUrl = presigned?.fileUrl || presigned?.data?.fileUrl;
    const key = presigned?.key || presigned?.data?.key || "";
    if (uploadUrl && fileUrl) {
      await uploadFileToS3(uploadUrl, file);
      results.push({ url: fileUrl, public_id: key });
    }
  }
  return results;
}

const INITIAL_COUNT = 9;
const BATCH_INCREMENT = 11;

interface ProfileGridTabProps {
  hostId: string;
  isOwner: boolean;
  isThemed?: boolean;
  theme?: ProfileTheme;
  initialActiveGridTab?: string;
}

export function ProfileGridTab({
  hostId,
  isOwner,
  isThemed = false,
  theme,
  initialActiveGridTab,
}: ProfileGridTabProps) {
  const { showConfirm } = useFeedbackStore();
  const [subTab, setSubTab] = useState(initialActiveGridTab || "experience"); // "experience" | "personal"
  const [experienceMedia, setExperienceMedia] = useState<any[]>([]);
  const [personalMedia, setPersonalMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<any | null>(null);
  const [slideDirection, setSlideDirection] = useState(0);
  const [visibleCount, setVisibleCount] = useState(INITIAL_COUNT);
  const [loadingMore, setLoadingMore] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const fetchGridMedia = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const res = await apiClient.get(`/api/users/profile/${hostId}/grid-media`);
      if (res.data?.success && res.data?.data) {
        setExperienceMedia(res.data.data.experienceMedia || []);
        setPersonalMedia(res.data.data.personalMedia || []);
        if (res.data.data.activeGridTab) {
          setSubTab(res.data.data.activeGridTab);
        }
      }
    } catch (err) {
      console.error("Failed to load host grid media:", err);
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    if (hostId) {
      fetchGridMedia(true);
    }
  }, [hostId]);

  useEffect(() => {
    if (initialActiveGridTab) {
      setSubTab(initialActiveGridTab);
    }
  }, [initialActiveGridTab]);

  const handleToggleSubTab = async () => {
    const nextTab = subTab === "experience" ? "personal" : "experience";
    setSubTab(nextTab);
    if (isOwner) {
      try {
        await apiClient.patch("/api/users/grid-tab-preference", {
          activeGridTab: nextTab,
        });
      } catch (err) {
        console.error("Failed to save grid tab preference:", err);
      }
    }
  };

  useEffect(() => {
    setVisibleCount(INITIAL_COUNT);
  }, [subTab]);

  const activeItems = subTab === "experience" ? experienceMedia : personalMedia;
  const visibleItems = activeItems.slice(0, visibleCount);
  const hasMore = visibleCount < activeItems.length;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first && first.isIntersecting && !loadingMore) {
          if (visibleCount < activeItems.length) {
            setLoadingMore(true);
            setTimeout(() => {
              setVisibleCount((prev) =>
                Math.min(prev + BATCH_INCREMENT, activeItems.length)
              );
              setLoadingMore(false);
            }, 600);
          }
        }
      },
      { threshold: 0.9, rootMargin: "-30px" }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [visibleCount, activeItems, loadingMore]);

  const selectedIndex = activeItems.findIndex(
    (item) =>
      (item._id && selectedMedia?._id && item._id === selectedMedia._id) ||
      (item.key && selectedMedia?.key && item.key === selectedMedia.key)
  );

  const handlePrevMedia = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeItems.length === 0) return;
    setSlideDirection(-1);
    const prevIndex =
      selectedIndex > 0 ? selectedIndex - 1 : activeItems.length - 1;
    setSelectedMedia(activeItems[prevIndex]);
  };

  const handleNextMedia = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (activeItems.length === 0) return;
    setSlideDirection(1);
    const nextIndex =
      selectedIndex < activeItems.length - 1 ? selectedIndex + 1 : 0;
    setSelectedMedia(activeItems[nextIndex]);
  };

  useEffect(() => {
    if (!selectedMedia) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        handlePrevMedia();
      } else if (e.key === "ArrowRight") {
        handleNextMedia();
      } else if (e.key === "Escape") {
        setSelectedMedia(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMedia, selectedIndex, activeItems]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 30) {
      handleNextMedia();
    } else if (distance < -30) {
      handlePrevMedia();
    }
    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const uploaded = await uploadMediaFiles(files, "personal");
      const uploadedItems = uploaded.map((item: any, idx: number) => ({
        url: item.url,
        public_id: item.public_id,
        mediaType: files[idx]?.type?.startsWith("video") ? "video" : "image",
      }));

      const res = await apiClient.post("/api/users/personal-media", {
        items: uploadedItems,
      });

      if (res.data?.success) {
        await fetchGridMedia(false);
      }
    } catch (err) {
      console.error("Personal media upload error:", err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const sortMediaList = (list: any[]) => {
    return [...list].sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
      const tA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const tB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      if (tB !== tA) return tB - tA;
      return (a._id || a.key || "")
        .toString()
        .localeCompare((b._id || b.key || "").toString());
    });
  };

  const handleTogglePinPersonal = async (e: React.MouseEvent, item: any) => {
    if (e) e.stopPropagation();
    const newIsPinned = !item.isPinned;
    setPersonalMedia((prev) =>
      sortMediaList(
        prev.map((m) =>
          m._id === item._id ? { ...m, isPinned: newIsPinned } : m
        )
      )
    );
    if (selectedMedia && selectedMedia._id === item._id) {
      setSelectedMedia((prev: any) => ({ ...prev, isPinned: newIsPinned }));
    }
    try {
      const res = await apiClient.patch(
        `/api/users/personal-media/${item._id}/pin`
      );
      if (res.data?.success) {
        await fetchGridMedia(false);
      }
    } catch {
      await fetchGridMedia(false);
    }
  };

  const handleTogglePinExperience = async (e: React.MouseEvent, item: any) => {
    if (e) e.stopPropagation();
    const newIsPinned = !item.isPinned;
    setExperienceMedia((prev) =>
      sortMediaList(
        prev.map((m) =>
          m.key === item.key ? { ...m, isPinned: newIsPinned } : m
        )
      )
    );
    if (selectedMedia && selectedMedia.key === item.key) {
      setSelectedMedia((prev: any) => ({ ...prev, isPinned: newIsPinned }));
    }
    try {
      const res = await apiClient.patch("/api/users/experience-media/pin", {
        mediaKey: item.key,
      });
      if (res.data?.success) {
        await fetchGridMedia(false);
      }
    } catch {
      await fetchGridMedia(false);
    }
  };

  const handleDeletePersonalMedia = (e: React.MouseEvent, item: any) => {
    if (e) e.stopPropagation();
    showConfirm(
      "Delete Media",
      "Are you sure you want to delete this media item?",
      async () => {
        try {
          setPersonalMedia((prev) => prev.filter((m) => m._id !== item._id));
          if (selectedMedia && selectedMedia._id === item._id) {
            setSelectedMedia(null);
          }
          await apiClient.delete(`/api/users/personal-media/${item._id}`);
        } catch {
          await fetchGridMedia(false);
        }
      }
    );
  };

  return (
    <div className="pt-2 pb-6 space-y-3">
      {/* ── Top Header Controls Bar (Only Visible for Profile Owner) ── */}
      {isOwner && (
        <div
          className="flex items-center justify-between gap-2 pb-2.5 border-b border-neutral-100 dark:border-neutral-800/80"
          style={
            isThemed
              ? { borderColor: theme?.divider || "rgba(255,255,255,0.1)" }
              : undefined
          }
        >
          {/* Single Color-Coded On/Off Style Toggle Switch (Left Side) */}
          <button
            type="button"
            onClick={handleToggleSubTab}
            className={`flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border transition-all cursor-pointer select-none shadow-xs group ${
              subTab === "experience"
                ? "bg-amber-500/10 dark:bg-amber-500/20 border-[#C59A2F]/40 hover:border-[#C59A2F]"
                : "bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/40 hover:border-emerald-500"
            }`}
            title={`Switch to ${
              subTab === "experience" ? "Personal" : "Experiences"
            } Grid`}
          >
            <span
              className={`text-xs font-black uppercase tracking-wider flex items-center gap-1.5 transition-colors ${
                subTab === "experience"
                  ? "text-[#C59A2F]"
                  : "text-emerald-600 dark:text-emerald-400"
              }`}
            >
              {subTab === "experience" ? (
                <>
                  <FiGrid size={14} className="text-[#C59A2F]" />
                  <span>Experiences</span>
                </>
              ) : (
                <>
                  <FiImage
                    size={14}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                  <span>Personal</span>
                </>
              )}
            </span>

            <div
              className={`w-9 h-5 rounded-full p-0.5 transition-colors relative flex items-center ${
                subTab === "experience" ? "bg-[#C59A2F]" : "bg-emerald-500"
              }`}
            >
              <motion.div
                layout
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`w-4 h-4 rounded-full bg-white shadow-sm ${
                  subTab === "personal" ? "ml-auto" : "ml-0"
                }`}
              />
            </div>
          </button>

          {/* Personal Mode Upload Button (Right Side) */}
          {subTab === "personal" && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="px-3.5 py-1.5 rounded-xl text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md cursor-pointer transition-all disabled:opacity-50 ml-auto"
              style={{ background: GOLD }}
              title="Upload Personal Moment"
            >
              {uploading ? (
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <FiPlus size={15} />
              )}
              <span>{uploading ? "Uploading..." : "Upload"}</span>
            </motion.button>
          )}
        </div>
      )}

      {/* ── Authentic Instagram 3-Column Seamless Grid ── */}
      {loading ? (
        <div className="grid grid-cols-3 gap-1 md:gap-1.5">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="aspect-square bg-neutral-200 dark:bg-neutral-800 animate-pulse"
            />
          ))}
        </div>
      ) : activeItems.length === 0 ? (
        <div className="py-12 flex flex-col items-center justify-center text-center">
          <div
            className="w-14 h-14 rounded-full border-2 border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-center mb-3 text-neutral-400 dark:text-neutral-500"
            style={
              isThemed
                ? {
                    borderColor: theme?.divider || "rgba(255,255,255,0.2)",
                    color: "rgba(255,255,255,0.5)",
                  }
                : undefined
            }
          >
            {subTab === "experience" ? (
              <FiCamera size={24} />
            ) : (
              <FiFilm size={24} />
            )}
          </div>
          <p
            className="text-xs uppercase tracking-widest font-black text-neutral-400 dark:text-neutral-500 mb-1"
            style={isThemed ? { color: "rgba(255,255,255,0.7)" } : undefined}
          >
            {subTab === "experience"
              ? "No experience media yet"
              : "No personal moments yet"}
          </p>
        </div>
      ) : (
        <div className="space-y-1 md:space-y-1.5">
          <div className="grid grid-cols-3 gap-1 md:gap-1.5 overflow-hidden">
            {visibleItems.map((item, index) => {
              const isVideo =
                item.mediaType === "video" ||
                (item.url && item.url.match(/\.(mp4|webm|mov|ogg)$/i));

              return (
                <div
                  key={item._id || item.key || index}
                  onClick={() => {
                    setSlideDirection(0);
                    setSelectedMedia(item);
                  }}
                  className="group relative aspect-square overflow-hidden cursor-pointer bg-neutral-900"
                >
                  {isVideo ? (
                    <video
                      src={item.url}
                      className="w-full h-full object-cover select-none pointer-events-none"
                      muted
                      playsInline
                      preload="metadata"
                    />
                  ) : (
                    <img
                      loading="lazy"
                      decoding="async"
                      src={item.url}
                      alt={item.title || "Grid Media"}
                      className="w-full h-full object-cover select-none transition-transform duration-300 group-hover:scale-105"
                    />
                  )}

                  {isVideo && (
                    <div className="absolute top-2 right-2 p-1 rounded-full bg-black/50 text-white backdrop-blur-xs drop-shadow-md z-10 pointer-events-none">
                      <FiPlay size={11} className="fill-current ml-0.5" />
                    </div>
                  )}

                  {item.isPinned &&
                    (isOwner ? (
                      <button
                        type="button"
                        title="Unpin from profile grid"
                        onClick={(e) =>
                          subTab === "experience"
                            ? handleTogglePinExperience(e, item)
                            : handleTogglePinPersonal(e, item)
                        }
                        className="absolute top-2 left-2 z-20 p-1.5 rounded-full bg-[#C59A2F] text-white shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer border border-[#b48820]"
                      >
                        <FaThumbtack size={11} className="rotate-45" />
                      </button>
                    ) : (
                      <div className="absolute top-2 left-2 z-10 p-1.5 rounded-full bg-[#C59A2F] text-white shadow-md">
                        <FaThumbtack size={11} className="rotate-45" />
                      </div>
                    ))}

                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                </div>
              );
            })}
          </div>

          {loadingMore && (
            <div className="grid grid-cols-3 gap-1 md:gap-1.5 pt-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-xs"
                />
              ))}
            </div>
          )}
        </div>
      )}

      {hasMore && (
        <div
          ref={loadMoreRef}
          className="py-6 flex flex-col items-center justify-center gap-2"
        >
          <div className="w-5 h-5 border-2 border-[#C59A2F]/30 border-t-[#C59A2F] rounded-full animate-spin" />
          <span className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest">
            Scroll down to load next 11 moments...
          </span>
        </div>
      )}

      {/* ── Full-Screen Lightbox / Modal Viewer ── */}
      <AnimatePresence>
        {selectedMedia && (
          <div className="fixed inset-0 z-[60000] flex items-center justify-center p-2 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedMedia(null)}
              className="absolute inset-0 bg-black/92 backdrop-blur-md"
            />

            {activeItems.length > 1 && (
              <button
                type="button"
                onClick={handlePrevMedia}
                className="hidden sm:flex fixed left-8 top-1/2 -translate-y-1/2 z-[65000] p-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer border border-white/20 shadow-2xl items-center justify-center"
                title="Previous media (Left arrow)"
              >
                <FiChevronLeft className="w-7 h-7" />
              </button>
            )}

            {activeItems.length > 1 && (
              <button
                type="button"
                onClick={handleNextMedia}
                className="hidden sm:flex fixed right-8 top-1/2 -translate-y-1/2 z-[65000] p-3.5 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md transition-all hover:scale-110 active:scale-95 cursor-pointer border border-white/20 shadow-2xl items-center justify-center"
                title="Next media (Right arrow)"
              >
                <FiChevronRight className="w-7 h-7" />
              </button>
            )}

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="relative z-10 max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center select-none"
            >
              <div className="w-full flex items-center justify-between p-3 sm:p-4 text-white z-20">
                <div className="flex items-center gap-2">
                  {selectedMedia.isPinned && (
                    <div
                      className="p-1.5 rounded-full bg-[#C59A2F] text-white shadow-md"
                      title="Pinned to top"
                    >
                      <FaThumbtack size={10} className="rotate-45" />
                    </div>
                  )}
                  {activeItems.length > 1 && selectedIndex !== -1 && (
                    <span className="text-[11px] font-bold text-white/60">
                      ({selectedIndex + 1}/{activeItems.length})
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {isOwner && (
                    <button
                      type="button"
                      title={
                        selectedMedia.isPinned
                          ? "Unpin from profile grid"
                          : "Pin to top of grid"
                      }
                      onClick={(e) =>
                        subTab === "experience"
                          ? handleTogglePinExperience(e, selectedMedia)
                          : handleTogglePinPersonal(e, selectedMedia)
                      }
                      className={`p-2.5 rounded-full transition-all cursor-pointer shadow-md flex items-center justify-center ${
                        selectedMedia.isPinned
                          ? "bg-[#C59A2F] text-white hover:bg-[#b38a28] scale-105"
                          : "bg-white/15 text-white hover:bg-[#C59A2F]"
                      }`}
                    >
                      <FaThumbtack
                        size={14}
                        className={selectedMedia.isPinned ? "rotate-45" : ""}
                      />
                    </button>
                  )}

                  {isOwner && subTab === "personal" && (
                    <button
                      type="button"
                      title="Delete Moment"
                      onClick={(e) =>
                        handleDeletePersonalMedia(e, selectedMedia)
                      }
                      className="p-2 rounded-full bg-red-600/80 hover:bg-red-600 text-white transition-all cursor-pointer shadow-md"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setSelectedMedia(null)}
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition-all cursor-pointer ml-1"
                    title="Close"
                  >
                    <FiX size={22} />
                  </button>
                </div>
              </div>

              <div
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                className="w-full flex items-center justify-center p-2 max-h-[78vh] overflow-hidden relative min-h-[300px]"
              >
                <AnimatePresence initial={false} custom={slideDirection}>
                  <motion.div
                    key={
                      selectedMedia._id ||
                      selectedMedia.url ||
                      selectedMedia.key
                    }
                    custom={slideDirection}
                    initial={{
                      x:
                        slideDirection > 0
                          ? "100%"
                          : slideDirection < 0
                          ? "-100%"
                          : "0%",
                    }}
                    animate={{ x: "0%" }}
                    exit={{
                      x:
                        slideDirection > 0
                          ? "-100%"
                          : slideDirection < 0
                          ? "100%"
                          : "0%",
                    }}
                    transition={{
                      ease: [0.25, 1, 0.5, 1],
                      duration: 0.25,
                    }}
                    style={{ willChange: "transform" }}
                    className="w-full h-full flex items-center justify-center absolute inset-0 p-2"
                  >
                    {selectedMedia.mediaType === "video" ||
                    (selectedMedia.url &&
                      selectedMedia.url.match(/\.(mp4|webm|mov|ogg)$/i)) ? (
                      <video
                        key={selectedMedia.url}
                        src={selectedMedia.url}
                        controls
                        autoPlay
                        className="max-w-full max-h-[78vh] rounded-lg object-contain shadow-2xl"
                      />
                    ) : (
                      <img
                        key={selectedMedia.url}
                        src={selectedMedia.url}
                        alt={selectedMedia.title || "Full Media"}
                        className="max-w-full max-h-[78vh] rounded-lg object-contain shadow-2xl pointer-events-none"
                      />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {isOwner && subTab === "personal" && (
        <div className="flex justify-end pt-2 pr-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*,video/*"
            multiple
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
