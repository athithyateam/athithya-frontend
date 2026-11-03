"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FiBriefcase,
  FiShoppingBag,
  FiTrash2,
  FiMessageSquare,
  FiAward,
  FiStar,
  FiShare2,
  FiChevronRight,
  FiChevronLeft,
  FiX,
  FiGrid,
} from "react-icons/fi";
import { FaStar } from "react-icons/fa";
import { apiClient } from "@/lib/api/axios-instance";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { submitReview } from "@/lib/api/bookings-api";
import { deleteAccountApi } from "@/lib/api/users-api";
import { useAuthStore } from "@/stores/auth-store";
import { useFeedbackStore } from "@/stores/feedback-store";
import { useChatStore } from "@/stores/chat-store";
import { EditProfileModal } from "./edit-profile-modal";
import { HostBookingManagement } from "./host-booking-management";
import { ProfileGridTab } from "./profile-grid-tab";
import { HostExperienceDataTable } from "./host-experience-table";
import { ExperienceCard } from "@/components/cards/experience-card";
import {
  GOLD,
  PROFILE_THEMES,
  DEFAULT_THEME_KEY,
  StarRatingDisplay,
  InteractiveStars,
  StatPill,
  TabBar,
  EmptyState,
  ProfileMenu,
  AwardLaurel,
} from "./profile-shared";

const THEME_STORAGE_KEY = "host_profile_theme_v2";

interface HostProfileProps {
  hostId?: string;
  userId?: string;
  user: Record<string, any>;
  posts?: any[];
  postStats?: Record<string, any>;
  reviewStats?: Record<string, any>;
  isOwner?: boolean;
  onRatingSuccess?: () => void;
  pagination?: Record<string, any>;
  onPageChange?: (page: number) => void;
  isProfileLoading?: boolean;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export function HostProfile({
  hostId,
  userId,
  user: initialUser,
  posts = [],
  postStats = {},
  reviewStats = {},
  isOwner = false,
  onRatingSuccess,
  pagination = {},
  onPageChange,
  isProfileLoading = false,
  isDark = false,
  onToggleTheme,
}: HostProfileProps) {
  const {
    user: loggedInUser,
    logout,
    setUser: setAuthUser,
    openAuthModal,
  } = useAuthStore();
  const { showToast } = useFeedbackStore();
  const { startConversation } = useChatStore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [user, setUser] = useState(initialUser);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [ratingLoading, setRatingLoading] = useState(false);
  const [selectedRating, setSelectedRating] = useState<number>(
    reviewStats?.currentUserRating || 0
  );
  const [hoverRating, setHoverRating] = useState(0);
  const [hasSubmittedRating, setHasSubmittedRating] = useState(false);
  const [reviewComment, setReviewComment] = useState("");
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const initialTab = searchParams.get("tab") || "grid";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [visitedTabs, setVisitedTabs] = useState<Set<string>>(
    () => new Set([initialTab])
  );

  useEffect(() => {
    setVisitedTabs((prev) => {
      if (prev.has(activeTab)) return prev;
      const next = new Set(prev);
      next.add(activeTab);
      return next;
    });
  }, [activeTab]);

  const [localPosts, setLocalPosts] = useState<any[]>(posts);
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);
  const [imageError, setImageError] = useState(false);

  const experiencesScrollRef = useRef<HTMLDivElement>(null);

  const scrollExperiences = (direction: "left" | "right") => {
    if (experiencesScrollRef.current) {
      const { scrollLeft } = experiencesScrollRef.current;
      const scrollTo =
        direction === "left" ? scrollLeft - 320 : scrollLeft + 320;
      experiencesScrollRef.current.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

  const themeKey = `${THEME_STORAGE_KEY}_${
    initialUser?._id || initialUser?.id || "x"
  }`;
  const [profileTheme, setProfileTheme] = useState<string>(() => {
    try {
      const saved =
        typeof window !== "undefined" ? localStorage.getItem(themeKey) : null;
      if (saved && saved !== "default") return saved;
      return DEFAULT_THEME_KEY;
    } catch {
      return DEFAULT_THEME_KEY;
    }
  });
  const activeTheme =
    PROFILE_THEMES.find((t) => t.key === profileTheme) || PROFILE_THEMES[0];
  const isThemed = Boolean(activeTheme && activeTheme.image);

  const [showYearsExpModal, setShowYearsExpModal] = useState(false);

  useEffect(() => {
    const handleSyncTheme = (e: any) => {
      try {
        const theme =
          e?.detail || localStorage.getItem(themeKey) || DEFAULT_THEME_KEY;
        setProfileTheme(theme);
      } catch {}
    };
    window.addEventListener("profile_theme_changed", handleSyncTheme);
    return () =>
      window.removeEventListener("profile_theme_changed", handleSyncTheme);
  }, [themeKey]);

  useEffect(() => {
    setUser(initialUser);
    setImageError(false);
    const newThemeKey = `${THEME_STORAGE_KEY}_${
      initialUser?._id || initialUser?.id || "x"
    }`;
    try {
      const savedTheme = localStorage.getItem(newThemeKey);
      if (savedTheme && savedTheme !== "default") {
        setProfileTheme(savedTheme);
      } else {
        setProfileTheme(DEFAULT_THEME_KEY);
      }
    } catch {
      setProfileTheme(DEFAULT_THEME_KEY);
    }
  }, [initialUser]);

  useEffect(() => {
    setLocalPosts(posts);
  }, [posts]);

  useEffect(() => {
    if (reviewStats?.currentUserRating) {
      setSelectedRating(reviewStats.currentUserRating);
    }
  }, [reviewStats?.currentUserRating]);

  const TABS = useMemo(() => {
    const base = [
      { key: "grid", label: "Momentos", icon: FiGrid },
      { key: "services", label: "Experiences", icon: FiBriefcase },
    ];
    if (isOwner) {
      base.push({ key: "bookings", label: "Bookings", icon: FiShoppingBag });
    }
    return base;
  }, [isOwner]);

  const filteredPosts = useMemo(() => {
    if (activeTab === "services") {
      const servicePosts = localPosts.filter((p) => p.postType === "service");
      return servicePosts.length > 0 ? servicePosts : localPosts;
    }
    return [];
  }, [activeTab, localPosts]);

  const handleUpdateUser = (
    updated: Record<string, any>,
    isPendingReview?: boolean
  ) => {
    setUser(updated);
    if (isOwner && setAuthUser && loggedInUser) {
      setAuthUser({
        ...loggedInUser,
        firstname: updated.firstname,
        lastname: updated.lastname,
        avatar: updated.avatar,
        description: updated.description,
      });
    }
    if (isPendingReview) {
      showToast("Verification details submitted for admin review.", "info");
    } else {
      showToast("Profile updated successfully!", "success");
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/");
  };

  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      const res = await deleteAccountApi();
      if (res?.success) {
        showToast("Account deleted", "success");
        await logout();
        router.replace("/");
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to delete account", "error");
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleRatingSubmit = async () => {
    if (!loggedInUser) {
      openAuthModal("login");
      return;
    }
    if (!selectedRating || selectedRating === 0) {
      showToast("Please select a star rating first", "warning");
      return;
    }
    setRatingLoading(true);
    try {
      const targetHostId =
        hostId?.toString() ||
        userId?.toString() ||
        user?._id?.toString() ||
        user?.id?.toString();
      const res = await submitReview({
        hostId: targetHostId,
        rating: selectedRating,
        comment: reviewComment,
      });
      if (res?.success) {
        showToast(
          reviewStats?.currentUserRating
            ? "Rating and review updated!"
            : "Thank you!",
          "success"
        );
        setHasSubmittedRating(true);
        if (onRatingSuccess) onRatingSuccess();
      }
    } catch (err: any) {
      showToast(err?.message || "Failed", "error");
    } finally {
      setRatingLoading(false);
    }
  };

  const handleOpenReviewsModal = async () => {
    setShowReviewsModal(true);
    setLoadingReviews(true);
    try {
      const targetHostId =
        hostId || userId || user?._id || user?.id;
      const endpoint = `${ENDPOINTS.REVIEWS}/host/${targetHostId}?includeRatingOnly=true`;
      const res = await apiClient.get(endpoint);
      if (res.data?.success) {
        setReviewsList(res.data.reviews || []);
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || "Failed to load reviews",
        "error"
      );
    } finally {
      setLoadingReviews(false);
    }
  };

  const avatarUrl =
    (typeof user?.avatar === "string" ? user.avatar : user?.avatar?.url) || "";
  const fullName =
    [user?.firstname, user?.lastname].filter(Boolean).join(" ") || "Host";
  const initials = fullName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const about = user?.description || user?.about || user?.bio || "";
  const experiencesCount =
    postStats?.totalPosts ||
    localPosts.filter((p) => p.postType === "service").length ||
    localPosts.length ||
    0;
  const avgRating = Number(reviewStats?.averageRating || 0);
  const totalReviews = Number(reviewStats?.totalReviews || 0);
  const totalRatings = Number(reviewStats?.totalRatings || totalReviews || 0);
  const isApprovedHostUser =
    user?.hostStatus === "approved" || user?.role === "admin";
  const yearsOfExperience = isApprovedHostUser
    ? Number(
        user?.hostDetails?.yearsOfExperience ??
          user?.yearsOfExperience ??
          user?.experienceYears ??
          0
      )
    : 0;

  const tc = (themed: string | null | undefined, def: string) =>
    isThemed ? themed || def : def;

  const profileBg: React.CSSProperties = isThemed
    ? {
        backgroundImage: `${activeTheme.overlay}, url(${activeTheme.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }
    : {};

  return (
    <div
      className={`relative min-h-screen pb-24 ${
        isThemed ? "is-themed profile-theme-active" : ""
      }`}
      data-profile-theme={isThemed ? "true" : "false"}
      style={profileBg}
    >
      {/* DEFAULT BG */}
      {!isThemed && (
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background:
                "var(--mesh-bg, linear-gradient(145deg, #fafafa 0%, #f4f3f0 100%))",
            }}
          />
          <div
            className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-40 blur-[120px]"
            style={{
              background: "radial-gradient(circle, #e8d5a3 0%, #c9a84c 100%)",
            }}
          />
          <div
            className="absolute top-1/3 -right-32 w-80 h-80 rounded-full opacity-25 blur-[100px]"
            style={{
              background: "radial-gradient(circle, #d4e8ff 0%, #a8c8f8 100%)",
            }}
          />
          <div
            className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full opacity-20 blur-[90px]"
            style={{
              background: "radial-gradient(circle, #e8f4e8 0%, #a8d4a8 100%)",
            }}
          />
        </div>
      )}

      <div className="mx-auto px-4 sm:px-6 pt-8 mt-16 max-w-5xl space-y-4">
        {/* ══ PROFILE CARD ══ */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden"
          style={
            isThemed
              ? { borderRadius: "28px", background: "transparent" }
              : {
                  background: "var(--profile-card-bg, rgba(255,255,255,0.82))",
                  backdropFilter: "blur(28px)",
                  WebkitBackdropFilter: "blur(28px)",
                  borderRadius: "28px",
                  border:
                    "1px solid var(--profile-card-border, rgba(255,255,255,0.95))",
                  boxShadow:
                    "0 4px 6px rgba(0,0,0,0.02), 0 20px 60px rgba(0,0,0,0.06), 0 0 0 1px rgba(197,154,47,0.06)",
                }
          }
        >
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
              {/* Avatar */}
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  delay: 0.15,
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="relative shrink-0"
              >
                <div
                  className="absolute -inset-0.75 rounded-full"
                  style={{
                    background: `conic-gradient(from 0deg, ${GOLD}, #f0d060, ${GOLD}, #c08020, ${GOLD})`,
                    opacity: isThemed ? 0.6 : 0.85,
                  }}
                />
                <div
                  className="relative rounded-full overflow-hidden"
                  style={{
                    width: 96,
                    height: 96,
                    boxShadow: isThemed
                      ? "0 0 0 3px rgba(255,255,255,0.12), 0 12px 40px rgba(0,0,0,0.45)"
                      : "0 0 0 3px rgba(255,255,255,0.9), 0 8px 28px rgba(0,0,0,0.12)",
                  }}
                >
                  {avatarUrl && !imageError ? (
                    <img
                      loading="lazy"
                      decoding="async"
                      src={avatarUrl}
                      alt={fullName}
                      className="w-full h-full object-cover cursor-pointer transition-transform duration-300 hover:scale-110"
                      style={{ width: 96, height: 96 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAvatarPreview(true);
                      }}
                      onError={() => setImageError(true)}
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center bg-[#C59A2F] text-white border border-[#b48820] transition-colors"
                      style={{ width: 96, height: 96 }}
                    >
                      <span
                        style={{
                          fontSize: 32,
                          fontFamily: "'Poppins', sans-serif",
                          fontWeight: 700,
                        }}
                      >
                        {initials}
                      </span>
                    </div>
                  )}
                </div>
                {/* Online indicator */}
                <div
                  className="absolute bottom-1 right-1 w-4.5 h-4.5 rounded-full border-2 border-white dark:border-neutral-900"
                  style={{ background: "#22c55e" }}
                />
              </motion.div>

              {/* Name + Info */}
              <div className="flex-1 min-w-0 pt-1 w-full">
                <div className="flex items-start justify-between gap-3 w-full">
                  <div className="min-w-0 flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                    <motion.h1
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.45 }}
                      className="text-2xl sm:text-[28px] font-black tracking-tight leading-none flex items-center justify-center sm:justify-start gap-1.5"
                      style={{
                        color: tc(
                          activeTheme.textColor,
                          "var(--name-color, #111)"
                        ),
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      <span>{fullName}</span>
                      {user?.verifyBadge?.enabled && (
                        <svg
                          className="w-[18px] h-[18px] sm:w-[22px] sm:h-[22px] shrink-0"
                          viewBox="0 0 24 24"
                          fill="none"
                          aria-label="Verified Host"
                        >
                          <path
                            d="M22.25 12c0-1.43-.88-2.67-2.19-3.19.16-.43.25-.9.25-1.39 0-2.25-1.83-4.08-4.08-4.08-.49 0-.96.09-1.39.25C14.32 2.28 13.25 1.5 12 1.5s-2.32.78-2.84 2.09c-.43-.16-.9-.25-1.39-.25-2.25 0-4.08 1.83-4.08 4.08 0 .49.09.96.25 1.39C2.63 9.33 1.75 10.57 1.75 12c0 1.43.88 2.67 2.19 3.19-.16.43-.25.9-.25 1.39 0 2.25 1.83 4.08 4.08 4.08.49 0 .96-.09 1.39-.25.52 1.31 1.59 2.09 2.84 2.09s2.32-.78 2.84-2.09c.43.16.9.25 1.39.25 2.25 0 4.08-1.83 4.08-4.08 0-.49-.09-.96-.25-1.39 1.31-.52 2.09-1.59 2.09-2.84z"
                            fill="#C59A2F"
                          />
                          <path
                            d="M10.22 16.75l-3.32-3.32 1.42-1.42 1.9 1.9 5.68-5.68 1.42 1.42-7.1 7.1z"
                            fill="#fff"
                          />
                        </svg>
                      )}
                    </motion.h1>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#C59A2F]/10 text-[#C59A2F] border border-[#C59A2F]/20 dark:bg-[#C59A2F]/20">
                        ✦ Host
                      </span>
                    </div>

                    {avgRating > 0 && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.35 }}
                        className="flex items-center gap-2 mt-2.5 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() => handleOpenReviewsModal()}
                        title="View ratings & reviews"
                      >
                        <StarRatingDisplay rating={avgRating} size={13} />
                        <span
                          className="text-sm font-black"
                          style={{
                            color: tc(
                              activeTheme.textColor,
                              "var(--name-color, #222)"
                            ),
                          }}
                        >
                          {avgRating.toFixed(1)}
                        </span>
                        <span
                          className="text-xs font-medium"
                          style={{
                            color: tc(
                              activeTheme.subColor,
                              "var(--about-color, #aaa)"
                            ),
                          }}
                        >
                          ({totalRatings} rating{totalRatings !== 1 ? "s" : ""})
                        </span>
                      </motion.div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(window.location.href);
                        showToast("Profile link copied!", "success");
                      }}
                      className="p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
                      style={
                        isThemed
                          ? {
                              background: "transparent",
                              border: "1px solid rgba(255,255,255,0.22)",
                            }
                          : {
                              background:
                                "var(--profile-card-bg, rgba(255,255,255,0.92))",
                              border:
                                "1px solid var(--profile-card-border, rgba(0,0,0,0.08))",
                              boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                            }
                      }
                      title="Share Profile"
                    >
                      <FiShare2
                        size={17}
                        style={{
                          color: isThemed
                            ? "rgba(255,255,255,0.90)"
                            : "var(--name-color, #374151)",
                        }}
                      />
                    </button>
                    <ProfileMenu
                      isOwner={isOwner}
                      isDark={isDark}
                      onToggleTheme={onToggleTheme}
                      onEditProfile={() => setShowEditModal(true)}
                      onLogout={handleLogout}
                      onDeleteAccount={() => setShowDeleteModal(true)}
                      isThemed={isThemed}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ── About ── */}
            {about && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
                className="text-sm leading-relaxed mb-6 max-w-xl text-center sm:text-left"
                style={{
                  color: tc(activeTheme.subColor, "var(--about-color, #666)"),
                }}
              >
                {about}
              </motion.p>
            )}

            {/* ── Stats Row ── */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center sm:justify-start gap-2 mb-6"
            >
              <StatPill
                icon={FiBriefcase}
                value={experiencesCount}
                label="Experiences"
                isThemed={isThemed}
                theme={activeTheme}
                onClick={() => {
                  setActiveTab("services");
                  document
                    .getElementById("profile-tabs-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              />
              {yearsOfExperience >= 1 && yearsOfExperience <= 30 && (
                <StatPill
                  icon={FiAward}
                  value={yearsOfExperience}
                  label="Years of Exp"
                  isThemed={isThemed}
                  theme={activeTheme}
                  onClick={() => setShowYearsExpModal(true)}
                />
              )}
              {(avgRating > 0 || totalReviews > 0 || totalRatings > 0) && (
                <StatPill
                  icon={FiStar}
                  value={avgRating > 0 ? avgRating.toFixed(1) : totalReviews}
                  label="Rating & Reviews"
                  isThemed={isThemed}
                  theme={activeTheme}
                  onClick={() => handleOpenReviewsModal()}
                />
              )}
            </motion.div>

            {/* ── Divider ── */}
            <div
              className="h-px w-full mb-5"
              style={{
                background: isThemed
                  ? activeTheme.divider || "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.06)",
              }}
            />

            {/* Action Buttons */}
            {!isOwner && loggedInUser?.role !== "host" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex flex-wrap justify-center sm:justify-start gap-3 mb-5"
              >
                <button
                  type="button"
                  onClick={async () => {
                    if (!loggedInUser) {
                      openAuthModal("login");
                      return;
                    }
                    try {
                      await startConversation?.(user._id || user.id);
                      router.push("/chat");
                    } catch (err: any) {
                      showToast(
                        err?.response?.data?.message ||
                          err?.message ||
                          "Cannot start chat with this host",
                        "error"
                      );
                    }
                  }}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 cursor-pointer"
                  style={
                    isThemed
                      ? {
                          background: "rgba(255,255,255,0.08)",
                          border: "1px solid rgba(255,255,255,0.15)",
                          color: "rgba(255,255,255,0.8)",
                        }
                      : {
                          background: "rgba(0,0,0,0.05)",
                          border: "1.5px solid rgba(0,0,0,0.08)",
                          color: "var(--pill-value, #555)",
                        }
                  }
                >
                  <FiMessageSquare size={14} />
                  Message
                </button>
              </motion.div>
            )}

            {/* ── Rate Host (guests & non-logged-in users, not other hosts) ── */}
            {!isOwner &&
              loggedInUser?.role !== "host" &&
              !reviewStats?.currentUserRating &&
              !hasSubmittedRating && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-5 pt-5 border-t flex flex-col gap-4"
                  style={{
                    borderColor: isThemed
                      ? activeTheme.divider || "rgba(255,255,255,0.1)"
                      : "rgba(0,0,0,0.06)",
                  }}
                >
                  <div className="flex flex-wrap items-center gap-4">
                    <span
                      className="text-[10px] font-black uppercase tracking-widest flex items-center gap-1"
                      style={{ color: tc(activeTheme.subColor, "#bbb") }}
                    >
                      Rate This Host{" "}
                      <span className="text-red-500 font-bold">*</span>
                    </span>
                    <InteractiveStars
                      selected={selectedRating}
                      hover={hoverRating}
                      onHover={setHoverRating}
                      onLeave={() => setHoverRating(0)}
                      onSelect={(i) => {
                        if (!loggedInUser) {
                          openAuthModal("login");
                        } else {
                          setSelectedRating(i);
                        }
                      }}
                      disabled={ratingLoading}
                    />
                  </div>

                  <div className="w-full flex flex-col gap-3">
                    <textarea
                      value={reviewComment}
                      onChange={(e) => {
                        if (!loggedInUser) {
                          openAuthModal("login");
                        } else {
                          setReviewComment(e.target.value);
                        }
                      }}
                      onClick={() => {
                        if (!loggedInUser) {
                          openAuthModal("login");
                        }
                      }}
                      placeholder="Write a review..."
                      className="w-full px-5 py-3.5 border rounded-2xl outline-none transition-all resize-none font-medium text-xs leading-relaxed focus:ring-4 focus:ring-[#C59A2F]/10 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                      rows={3}
                      style={{
                        background: isThemed
                          ? "rgba(255, 255, 255, 0.05)"
                          : "var(--input-bg, #fcfbfb)",
                        color: tc(
                          activeTheme.textColor,
                          "var(--name-color, #222)"
                        ),
                        borderColor: isThemed
                          ? "rgba(255, 255, 255, 0.15)"
                          : "var(--panel-border, #eee)",
                      }}
                      onFocus={(e) => {
                        if (!loggedInUser) {
                          openAuthModal("login");
                          e.target.blur();
                        } else {
                          e.target.style.borderColor = GOLD;
                        }
                      }}
                      onBlur={(e) =>
                        (e.target.style.borderColor = isThemed
                          ? "rgba(255, 255, 255, 0.15)"
                          : "var(--panel-border, #eee)")
                      }
                    />
                    <div className="flex justify-end">
                      <motion.button
                        whileHover={{
                          scale: selectedRating === 0 ? 1 : 1.02,
                        }}
                        whileTap={{ scale: selectedRating === 0 ? 1 : 0.98 }}
                        onClick={() => {
                          if (!loggedInUser) {
                            openAuthModal("login");
                          } else if (selectedRating === 0) {
                            showToast(
                              "Please select a star rating first",
                              "warning"
                            );
                          } else {
                            handleRatingSubmit();
                          }
                        }}
                        disabled={ratingLoading}
                        className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                          selectedRating === 0
                            ? "opacity-50 cursor-not-allowed"
                            : "cursor-pointer"
                        }`}
                        style={{ background: GOLD, color: "#fff" }}
                      >
                        {ratingLoading
                          ? "Saving…"
                          : reviewStats?.currentUserRating
                          ? "Update"
                          : "Submit"}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )}
          </div>
        </motion.div>

        {/* ══ TABS ══ */}
        <motion.div
          id="profile-tabs-section"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.4 }}
        >
          <TabBar
            tabs={TABS}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isThemed={isThemed}
          />
        </motion.div>

        {/* ══ TAB CONTENT ══ */}
        <div>
          {(visitedTabs.has("grid") || activeTab === "grid") && (
            <div
              key="grid"
              className={activeTab === "grid" ? "block" : "hidden"}
            >
              <ProfileGridTab
                hostId={hostId || userId || user?._id || user?.id}
                isOwner={isOwner}
                initialActiveGridTab={user?.activeGridTab}
                isThemed={isThemed}
                theme={activeTheme}
              />
            </div>
          )}

          {(visitedTabs.has("services") || activeTab === "services") && (
            <div
              key="services"
              className={
                activeTab === "services"
                  ? "pt-6 pb-24 md:pb-6 space-y-6 block"
                  : "hidden"
              }
            >
              {isOwner ? (
                <HostExperienceDataTable
                  experiences={filteredPosts}
                  isLoading={isProfileLoading}
                  onRefresh={onRatingSuccess}
                  pagination={pagination}
                  onPageChange={onPageChange}
                  isThemed={isThemed}
                  theme={activeTheme}
                />
              ) : (
                <>
                  <div className="flex justify-between items-center">
                    <div>
                      <h3
                        className="text-lg font-black uppercase tracking-wider text-[#C59A2F]"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Experiences
                      </h3>
                      <p
                        className="text-xs text-neutral-400 mt-1 font-medium"
                        style={
                          isThemed
                            ? { color: "rgba(255,255,255,0.7)" }
                            : undefined
                        }
                      >
                        {`Browse experiences hosted by ${fullName}.`}
                      </p>
                    </div>
                    {!isProfileLoading && filteredPosts.length > 0 && (
                      <div className="hidden md:flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => scrollExperiences("left")}
                          className="p-2 w-9 h-9 rounded-full border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-400 dark:text-neutral-500 hover:text-[#C59A2F] dark:hover:text-[#C59A2F] transition-all flex items-center justify-center shadow-xs cursor-pointer"
                          style={
                            isThemed
                              ? {
                                  background: "transparent",
                                  borderColor: "rgba(255,255,255,0.22)",
                                  color: "#ffffff",
                                }
                              : undefined
                          }
                          title="Scroll Left"
                        >
                          <FiChevronLeft size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => scrollExperiences("right")}
                          className="p-2 w-9 h-9 rounded-full border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-400 dark:text-neutral-500 hover:text-[#C59A2F] dark:hover:text-[#C59A2F] transition-all flex items-center justify-center shadow-xs cursor-pointer"
                          style={
                            isThemed
                              ? {
                                  background: "transparent",
                                  borderColor: "rgba(255,255,255,0.22)",
                                  color: "#ffffff",
                                }
                              : undefined
                          }
                          title="Scroll Right"
                        >
                          <FiChevronRight size={16} />
                        </button>
                      </div>
                    )}
                  </div>
                  {isProfileLoading ? (
                    <div
                      className="flex gap-4 md:gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory w-full"
                      style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                    >
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="aspect-[4/5] rounded-[1.2rem] md:rounded-[2rem] animate-pulse shrink-0 min-w-[calc(50%-8px)] max-w-[calc(50%-8px)] md:min-w-[280px] md:max-w-[280px] lg:min-w-[310px] lg:max-w-[310px]"
                          style={{
                            background: isThemed
                              ? "rgba(255,255,255,0.07)"
                              : "var(--skeleton-bg, #f0efee)",
                          }}
                        />
                      ))}
                    </div>
                  ) : filteredPosts.length === 0 ? (
                    <EmptyState
                      label="No experiences yet"
                      isThemed={isThemed}
                      theme={activeTheme}
                    />
                  ) : (
                    <>
                      <div
                        ref={experiencesScrollRef}
                        className="flex gap-4 md:gap-6 overflow-x-auto pb-12 md:pb-6 scrollbar-hide snap-x snap-mandatory w-full"
                        style={{
                          scrollbarWidth: "none",
                          msOverflowStyle: "none",
                        }}
                      >
                        {filteredPosts.map((post, i) => (
                          <div
                            key={post._id || i}
                            className="snap-start shrink-0 min-w-[calc(50%-8px)] max-w-[calc(50%-8px)] md:min-w-[280px] md:max-w-[280px] lg:min-w-[310px] lg:max-w-[310px]"
                          >
                            <ExperienceCard
                              data={{
                                ...post,
                                user:
                                  typeof post.user === "object" &&
                                  post.user !== null &&
                                  (post.user.firstname || post.user.name)
                                    ? post.user
                                    : user,
                                hostName:
                                  [user?.firstname, user?.lastname]
                                    .filter(Boolean)
                                    .join(" ") ||
                                  user?.name ||
                                  user?.username,
                                hostAvatar:
                                  user?.avatar?.url ||
                                  user?.avatar ||
                                  user?.profilePic,
                              }}
                              className="w-full !h-auto"
                              showBookmark={!isOwner}
                              showActions={isOwner}
                              onDeleteSuccess={onRatingSuccess}
                              isThemed={isThemed}
                            />
                          </div>
                        ))}
                      </div>

                      {pagination?.totalPages > 1 && (
                        <div className="flex justify-center gap-2 pt-4">
                          {[...Array(pagination.totalPages)].map((_, i) => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => onPageChange?.(i + 1)}
                              className="w-9 h-9 rounded-xl text-sm font-black transition-all hover:scale-110 active:scale-95 cursor-pointer"
                              style={
                                pagination.currentPage === i + 1
                                  ? {
                                      background: GOLD,
                                      color: "#fff",
                                      boxShadow: `0 4px 16px ${GOLD}44`,
                                    }
                                  : {
                                      background: isThemed
                                        ? "rgba(255,255,255,0.08)"
                                        : "rgba(0,0,0,0.05)",
                                      color: isThemed
                                        ? "rgba(255,255,255,0.5)"
                                        : "#999",
                                      border: "1px solid rgba(0,0,0,0.06)",
                                    }
                              }
                            >
                              {i + 1}
                            </button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          )}

          {isOwner &&
            (visitedTabs.has("bookings") || activeTab === "bookings") && (
              <div
                key="bookings"
                className={
                  activeTab === "bookings" ? "pt-6 block" : "hidden"
                }
              >
                <HostBookingManagement
                  isThemed={isThemed}
                  theme={activeTheme}
                />
              </div>
            )}
        </div>
      </div>

      {/* ══ MODALS ══ */}
      <AnimatePresence>
        {showEditModal && (
          <EditProfileModal
            user={user}
            onClose={() => setShowEditModal(false)}
            onUpdate={handleUpdateUser}
            isThemed={isThemed}
          />
        )}
        {showDeleteModal && (
          <div className="fixed inset-0 z-200 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className={`absolute inset-0 ${
                isThemed
                  ? "bg-black/35 backdrop-blur-sm"
                  : "bg-black/50 backdrop-blur-sm"
              }`}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              className="relative rounded-4xl p-8 w-full max-w-sm shadow-2xl text-center"
              style={
                isThemed
                  ? {
                      background: "transparent",
                      backgroundColor: "transparent",
                      border: "1px solid rgba(255, 255, 255, 0.22)",
                      boxShadow: "0 16px 40px rgba(0, 0, 0, 0.3)",
                    }
                  : { background: "var(--modal-bg, #fff)" }
              }
            >
              <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                <FiTrash2 size={24} className="text-red-500" />
              </div>
              <h3
                className="text-lg font-black uppercase tracking-tight mb-2"
                style={{ color: isThemed ? "#ffffff" : undefined }}
              >
                Delete Account
              </h3>
              <p
                className="text-sm mb-6"
                style={{
                  color: isThemed ? "rgba(255,255,255,0.85)" : undefined,
                }}
              >
                This action is permanent and cannot be undone. All your data
                will be erased.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={() => setShowDeleteModal(false)}
                  className={`flex-1 px-4 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all disabled:opacity-50 cursor-pointer ${
                    isThemed
                      ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                      : "bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={deleteLoading}
                  onClick={handleDeleteAccount}
                  className="flex-1 px-4 py-3 rounded-2xl text-sm font-black uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  {deleteLoading ? (
                    <>
                      Deleting...
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {showYearsExpModal && (
              <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowYearsExpModal(false)}
                  className={`absolute inset-0 ${
                    isThemed
                      ? "bg-black/35 backdrop-blur-sm"
                      : "bg-black/60 backdrop-blur-sm"
                  }`}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 24 }}
                  className="relative rounded-3xl p-8 sm:p-10 w-full max-w-sm shadow-2xl z-10 text-center flex flex-col items-center justify-center"
                  style={
                    isThemed
                      ? {
                          background: "transparent",
                          backgroundColor: "transparent",
                          border: "1px solid rgba(255, 255, 255, 0.22)",
                          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.3)",
                        }
                      : { background: "var(--modal-bg, #fff)" }
                  }
                >
                  <button
                    type="button"
                    onClick={() => setShowYearsExpModal(false)}
                    className={`absolute top-4 right-4 p-2 rounded-xl transition-colors cursor-pointer ${
                      isThemed
                        ? "text-white hover:bg-white/10"
                        : "text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                    }`}
                    title="Close"
                  >
                    <FiX size={18} />
                  </button>

                  {/* Golden Laurel Flanked Years of Experience */}
                  <div className="flex items-center justify-center gap-3 sm:gap-4 my-3">
                    <AwardLaurel className="w-9 sm:w-11 h-20 sm:h-24 shrink-0 drop-shadow-xs" />
                    <div className="flex flex-col items-center px-1">
                      <span
                        className={`text-5xl sm:text-6xl font-black tracking-tight leading-none font-sans ${
                          isThemed
                            ? "!text-white"
                            : "text-neutral-900 dark:text-neutral-100"
                        }`}
                        style={isThemed ? { color: "#ffffff" } : undefined}
                      >
                        {yearsOfExperience}
                      </span>
                      <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#C59A2F] mt-2">
                        {yearsOfExperience === 1 ? "Year" : "Years"}
                      </span>
                    </div>
                    <AwardLaurel
                      className="w-9 sm:w-11 h-20 sm:h-24 shrink-0 drop-shadow-xs"
                      flip={true}
                    />
                  </div>

                  <span
                    className={`text-sm sm:text-base font-extrabold tracking-tight mt-1 ${
                      isThemed ? "!text-white" : ""
                    }`}
                    style={isThemed ? { color: "#ffffff" } : undefined}
                  >
                    Hosting Experience
                  </span>
                </motion.div>
              </div>
            )}

            {showReviewsModal && (
              <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowReviewsModal(false)}
                  className={`absolute inset-0 ${
                    isThemed
                      ? "bg-black/35 backdrop-blur-sm"
                      : "bg-black/50 backdrop-blur-sm"
                  }`}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 24 }}
                  className="relative rounded-[2rem] p-6 w-full max-w-lg shadow-2xl z-10 flex flex-col gap-4 max-h-[85vh]"
                  style={
                    isThemed
                      ? {
                          background: "transparent",
                          backgroundColor: "transparent",
                          border: "1px solid rgba(255,255,255,0.22)",
                          boxShadow: "0 16px 40px rgba(0,0,0,0.3)",
                        }
                      : { background: "var(--modal-bg, #fff)" }
                  }
                >
                  <div
                    className="flex justify-between items-center border-b pb-3"
                    style={{
                      borderColor: isThemed
                        ? "rgba(255,255,255,0.15)"
                        : "rgba(0,0,0,0.06)",
                    }}
                  >
                    <div>
                      <h3
                        className={`text-base font-black uppercase tracking-wider ${
                          isThemed ? "!text-white" : ""
                        }`}
                        style={isThemed ? { color: "#ffffff" } : undefined}
                      >
                        Rating & Reviews
                      </h3>
                      <p
                        className={`text-[10px] mt-0.5 font-medium ${
                          isThemed ? "!text-white/80" : ""
                        }`}
                        style={
                          isThemed
                            ? { color: "rgba(255,255,255,0.85)" }
                            : undefined
                        }
                      >
                        Verified guest feedback and star ratings for {fullName}.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowReviewsModal(false)}
                      className={`p-1.5 rounded-xl transition-colors cursor-pointer ${
                        isThemed
                          ? "bg-white/10 hover:bg-white/20 text-white"
                          : "bg-red-50 dark:bg-red-950/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30"
                      }`}
                      title="Close"
                    >
                      <FiX size={16} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto pr-1 space-y-4 py-2">
                    {loadingReviews ? (
                      <div className="space-y-4">
                        {[...Array(3)].map((_, i) => (
                          <div
                            key={i}
                            className="h-24 rounded-3xl animate-pulse"
                            style={{
                              background: isThemed
                                ? "rgba(255,255,255,0.10)"
                                : "var(--skeleton-bg, #f0efee)",
                            }}
                          />
                        ))}
                      </div>
                    ) : reviewsList.length === 0 ? (
                      <div
                        className={`py-12 text-center text-xs font-bold uppercase tracking-widest ${
                          isThemed ? "!text-white/80" : "text-neutral-400"
                        }`}
                        style={
                          isThemed
                            ? { color: "rgba(255,255,255,0.8)" }
                            : undefined
                        }
                      >
                        No ratings or reviews yet
                      </div>
                    ) : (
                      reviewsList.map((r) => {
                        const reviewerId = r.reviewer?._id || r.reviewer?.id;
                        const reviewerName =
                          [r.reviewer?.firstname, r.reviewer?.lastname]
                            .filter(Boolean)
                            .join(" ")
                            .trim() || "Guest User";
                        const reviewerAvatar =
                          r.reviewer?.avatar?.url ||
                          r.reviewer?.avatar ||
                          `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            reviewerName
                          )}&background=C59A2F&color=fff`;

                        return (
                          <div
                            key={r._id || r.id}
                            className={`rounded-3xl p-4 border flex gap-3 items-start ${
                              isThemed ? "!bg-transparent" : ""
                            }`}
                            style={
                              isThemed
                                ? {
                                    borderColor: "rgba(255,255,255,0.18)",
                                    background: "transparent",
                                    backgroundColor: "transparent",
                                  }
                                : {
                                    borderColor:
                                      "var(--panel-border, rgba(0,0,0,0.06))",
                                    background:
                                      "var(--profile-card-bg, #fbfbfb)",
                                  }
                            }
                          >
                            <img
                              loading="lazy"
                              decoding="async"
                              src={reviewerAvatar}
                              className={`w-10 h-10 rounded-xl border object-cover shrink-0 ${
                                isThemed
                                  ? "border-white/20"
                                  : "border-neutral-100 dark:border-neutral-800 shadow-sm"
                              } ${
                                reviewerId
                                  ? "cursor-pointer hover:opacity-80 transition-opacity"
                                  : ""
                              }`}
                              alt={reviewerName}
                              onClick={() => {
                                if (reviewerId) {
                                  setShowReviewsModal(false);
                                  router.push(`/profile/${reviewerId}`);
                                }
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <h4
                                  onClick={() => {
                                    if (reviewerId) {
                                      setShowReviewsModal(false);
                                      router.push(`/profile/${reviewerId}`);
                                    }
                                  }}
                                  className={`font-black text-xs truncate ${
                                    isThemed
                                      ? "!text-white"
                                      : "text-neutral-900 dark:text-neutral-100"
                                  } ${
                                    reviewerId
                                      ? "cursor-pointer hover:underline hover:text-[#C59A2F]"
                                      : ""
                                  }`}
                                  style={
                                    isThemed ? { color: "#ffffff" } : undefined
                                  }
                                >
                                  {reviewerName}
                                </h4>
                                <span
                                  className={`text-[8px] font-black uppercase shrink-0 ${
                                    isThemed ? "!text-white/80" : ""
                                  }`}
                                  style={
                                    isThemed
                                      ? { color: "rgba(255,255,255,0.8)" }
                                      : { color: "rgb(156, 163, 175)" }
                                  }
                                >
                                  {new Date(r.createdAt).toLocaleDateString(
                                    undefined,
                                    { month: "short", year: "numeric" }
                                  )}
                                </span>
                              </div>

                              <div className="flex text-yellow-400 gap-0.5 mt-0.5">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <FaStar
                                    key={star}
                                    size={9}
                                    className={
                                      star <= r.rating
                                        ? "text-yellow-400 fill-current"
                                        : isThemed
                                        ? "text-white/25"
                                        : "text-neutral-200"
                                    }
                                  />
                                ))}
                              </div>

                              {r.comment && r.comment.trim() !== "" && (
                                <p
                                  className={`text-[11px] font-medium mt-2 leading-relaxed italic border-l-2 pl-2 border-[#C59A2F] ${
                                    isThemed ? "!text-white" : ""
                                  }`}
                                  style={
                                    isThemed
                                      ? { color: "#ffffff" }
                                      : { color: "rgb(82, 82, 82)" }
                                  }
                                >
                                  &ldquo;{r.comment}&rdquo;
                                </p>
                              )}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              </div>
            )}

            {showAvatarPreview && avatarUrl && (
              <motion.div
                key="avatar-preview-modal"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="fixed inset-0 z-[60000] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
                onClick={() => setShowAvatarPreview(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="relative z-10"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="relative w-[75vw] h-[75vw] max-w-[320px] max-h-[320px] md:max-w-[420px] md:max-h-[420px] aspect-square">
                    <div className="w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white/20 bg-neutral-900">
                      <img
                        src={avatarUrl}
                        alt={fullName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAvatarPreview(false)}
                      className="absolute top-2 right-2 p-2 bg-black/70 hover:bg-black/90 text-white rounded-full transition-all cursor-pointer z-20 shadow-lg border border-white/10 flex items-center justify-center"
                      style={{ fontSize: 20 }}
                      title="Close"
                    >
                      <FiX />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}

