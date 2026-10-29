"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiSettings,
  FiLogOut,
  FiMoon,
  FiSun,
  FiUserX,
  FiFlag,
  FiMessageSquare,
  FiBookmark,
  FiHeart,
  FiStar,
  FiShoppingBag,
  FiUsers,
  FiShare2,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiCreditCard,
  FiClock,
} from "react-icons/fi";
import { MdSecurity } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { apiClient } from "@/lib/api/axios-instance";
import { ENDPOINTS } from "@/lib/api/endpoints";
import { useAuthStore } from "@/stores/auth-store";
import { useFeedbackStore } from "@/stores/feedback-store";
import { useChatStore } from "@/stores/chat-store";
import {
  friendRequestApi,
  unfriendUserApi,
  deleteAccountApi,
} from "@/lib/api/users-api";
import { EditProfileModal } from "./edit-profile-modal";
import { FollowListModal } from "./follow-list-modal";
import { GuestBookingsTab } from "./guest-bookings-tab";
import { ScheduledExperiencesTab } from "./guest-scheduled-tab";
import { ExperienceCard } from "@/components/cards/experience-card";
import {
  GOLD,
  PROFILE_THEMES,
  DEFAULT_THEME_KEY,
  InteractiveStars,
  StatPill,
  TabBar,
  EmptyState,
  ProfileMenu,
} from "./profile-shared";

const THEME_STORAGE_KEY = "guest_profile_theme_v2";

const MAIN_TABS = [
  { key: "saved", label: "Saved", icon: FiBookmark },
  { key: "reviews", label: "Reviews", icon: FiStar },
];

interface GuestProfileProps {
  user: Record<string, any>;
  posts?: any[];
  isOwner?: boolean;
  userRole?: string | null;
  userId?: string;
  isDark?: boolean;
  onToggleTheme?: () => void;
}

export function GuestProfile({
  user: initialUser,
  posts = [],
  isOwner = false,
  userRole = null,
  userId,
  isDark = false,
  onToggleTheme,
}: GuestProfileProps) {
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
  const [isFriend, setIsFriend] = useState(initialUser?.isFriend || false);
  const [isRequested, setIsRequested] = useState(
    initialUser?.isRequestedFriend || initialUser?.isRequested || false
  );

  const [followLoading, setFollowLoading] = useState(false);
  const [showFollowModal, setShowFollowModal] = useState<string | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const initialTab = searchParams.get("tab") || "saved";
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

  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [loadingSaved, setLoadingSaved] = useState(false);

  // Reviews state
  const [writtenReviews, setWrittenReviews] = useState<any[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);
  const [showEditReviewModal, setShowEditReviewModal] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState<any>(null);
  const [editReviewRating, setEditReviewRating] = useState(0);
  const [editReviewHover, setEditReviewHover] = useState(0);
  const [editReviewComment, setEditReviewComment] = useState("");
  const [updatingReviewId, setUpdatingReviewId] = useState<string | null>(null);
  const [showUnfriendConfirm, setShowUnfriendConfirm] = useState(false);
  const [showMessageWarningModal, setShowMessageWarningModal] = useState(false);
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);
  const [imageError, setImageError] = useState(false);

  const savedScrollRef = useRef<HTMLDivElement>(null);

  const scrollSaved = (direction: "left" | "right") => {
    if (savedScrollRef.current) {
      const { scrollLeft } = savedScrollRef.current;
      const scrollTo =
        direction === "left" ? scrollLeft - 320 : scrollLeft + 320;
      savedScrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  const themeKey = `${THEME_STORAGE_KEY}_${
    initialUser?._id || initialUser?.id || "x"
  }`;
  const [profileTheme, setProfileTheme] = useState<string>(() => {
    try {
      const saved =
        typeof window !== "undefined" ? localStorage.getItem(themeKey) : null;
      return saved && saved !== "default" ? saved : DEFAULT_THEME_KEY;
    } catch {
      return DEFAULT_THEME_KEY;
    }
  });

  const activeTheme =
    PROFILE_THEMES.find((t) => t.key === profileTheme) || PROFILE_THEMES[0];
  const isThemed = Boolean(activeTheme && activeTheme.image);

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
    setIsFriend(initialUser?.isFriend || false);
    setIsRequested(
      initialUser?.isRequestedFriend || initialUser?.isRequested || false
    );

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
    if (isOwner && activeTab === "saved" && savedPosts.length === 0) {
      (async () => {
        setLoadingSaved(true);
        try {
          const res = await apiClient.get(ENDPOINTS.GET_SAVED_POSTS);
          if (res.data?.success) {
            setSavedPosts(res.data.posts || res.data.savedPosts || []);
          }
        } catch {
        } finally {
          setLoadingSaved(false);
        }
      })();
    }
  }, [isOwner, activeTab, savedPosts.length]);

  const TABS = useMemo(() => {
    if (userRole === "admin") return [];
    const base = [...MAIN_TABS];
    if (isOwner) {
      base.push({
        key: "scheduled",
        label: "Scheduled Experiences",
        icon: FiClock,
      });
      base.push({ key: "bookings", label: "Bookings", icon: FiShoppingBag });
    }
    return base;
  }, [isOwner, userRole]);

  const handleFriendToggle = async (bypassConfirm = false) => {
    if (!loggedInUser) {
      openAuthModal("login");
      return;
    }
    if (isFriend && !bypassConfirm) {
      setShowUnfriendConfirm(true);
      return;
    }
    setFollowLoading(true);
    try {
      const targetId = user?._id || user?.id;
      if (isFriend) {
        await unfriendUserApi(targetId);
        setIsFriend(false);
        setUser((p: any) => ({
          ...p,
          friendsCount: Math.max(0, (p?.friendsCount || 0) - 1),
        }));
        showToast("Unfriended", "info");
      } else if (isRequested) {
        await unfriendUserApi(targetId);
        setIsRequested(false);
        showToast("Request cancelled", "info");
      } else {
        const res = await friendRequestApi(targetId);
        if (res?.success) {
          setIsRequested(true);
          showToast(res.message || "Request sent", "success");
        }
      }
    } catch (err: any) {
      showToast(err?.message || "Action failed", "error");
      if ((err?.message || "").toLowerCase().includes("already friends")) {
        setIsFriend(true);
        setIsRequested(false);
      }
    } finally {
      setFollowLoading(false);
      setShowUnfriendConfirm(false);
    }
  };

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

  const handleRemoveFromSaved = (postId: string) => {
    setSavedPosts((prev) => prev.filter((p) => p._id !== postId));
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

  // Review handlers
  const targetProfileUserId = userId || user?._id || user?.id;
  const fetchWrittenReviews = async () => {
    setLoadingReviews(true);
    try {
      const res = await apiClient.get(
        `${ENDPOINTS.REVIEWS}/reviewer/${targetProfileUserId}`
      );
      if (res.data?.success) {
        setWrittenReviews(res.data.reviews || []);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    if (activeTab === "reviews" && writtenReviews.length === 0) {
      fetchWrittenReviews();
    }
  }, [activeTab, targetProfileUserId]);

  const handleDeleteClick = (reviewId: string) => {
    setIdToDelete(reviewId);
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!idToDelete) return;
    const reviewId = idToDelete;
    setDeletingId(reviewId);
    setShowDeleteConfirm(false);
    try {
      const res = await apiClient.delete(`${ENDPOINTS.REVIEWS}/${reviewId}`);
      if (res.data?.success) {
        showToast("Rating removed successfully", "success");
        setWrittenReviews((prev) => prev.filter((r) => r._id !== reviewId));
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || "Failed to remove rating",
        "error"
      );
    } finally {
      setDeletingId(null);
      setIdToDelete(null);
    }
  };

  const handleEditReviewClick = (review: any) => {
    setReviewToEdit(review);
    setEditReviewRating(review.rating);
    setEditReviewComment(review.comment || "");
    setShowEditReviewModal(true);
  };

  const handleUpdateReview = async () => {
    if (editReviewRating === 0) {
      showToast("Please select a star rating first", "warning");
      return;
    }
    setUpdatingReviewId(reviewToEdit._id);
    try {
      const res = await apiClient.put(
        `${ENDPOINTS.REVIEWS}/${reviewToEdit._id}`,
        {
          rating: editReviewRating,
          comment: editReviewComment,
        }
      );
      if (res.data?.success) {
        showToast("Review updated successfully", "success");
        setWrittenReviews((prev) =>
          prev.map((r) =>
            r._id === reviewToEdit._id
              ? {
                  ...r,
                  rating: editReviewRating,
                  comment: editReviewComment,
                }
              : r
          )
        );
        setShowEditReviewModal(false);
        setReviewToEdit(null);
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || "Failed to update review",
        "error"
      );
    } finally {
      setUpdatingReviewId(null);
    }
  };

  const avatarUrl =
    (typeof user?.avatar === "string" ? user.avatar : user?.avatar?.url) || "";
  const fullName =
    [user?.firstname, user?.lastname].filter(Boolean).join(" ") || "Traveler";
  const initials = fullName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const about = user?.description || user?.about || user?.bio || "";
  const friendsCount = user?.friendsCount || user?.friends?.length || 0;
  const role = user?.role || userRole || "guest";
  const tc = (themed: string | null | undefined, def: string) =>
    isThemed ? themed || def : def;

  if (userRole === "admin") {
    return (
      <div className="py-24 flex flex-col items-center justify-center rounded-3xl bg-linear-to-br from-amber-50 to-white dark:from-neutral-900 dark:to-neutral-950 border border-amber-100 dark:border-neutral-800">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6"
          style={{ background: `linear-gradient(135deg, ${GOLD}, #e6b84d)` }}
        >
          <MdSecurity size={32} />
        </div>
        <h3
          className="text-2xl font-black uppercase tracking-tighter mb-2"
          style={{ fontFamily: "'Poppins', sans-serif", color: "#111" }}
        >
          Admin Account
        </h3>
        <p className="text-sm text-gray-400 mb-8 text-center max-w-xs">
          Use the Admin Panel to manage users, experiences, and reviews.
        </p>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="px-10 py-3.5 text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 cursor-pointer"
          style={{
            background: `linear-gradient(135deg, ${GOLD}, #e6b84d)`,
            boxShadow: `0 6px 24px ${GOLD}55`,
          }}
        >
          Go to Admin Panel
        </button>
      </div>
    );
  }

  const profileBg: React.CSSProperties = isThemed
    ? {
        backgroundImage: `${activeTheme.overlay}, url(${activeTheme.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }
    : {};

  const friendBtnStyle = isFriend
    ? {
        background: "rgba(197,154,47,0.12)",
        border: `1.5px solid ${GOLD}`,
        color: GOLD,
      }
    : isRequested
    ? {
        background: "rgba(0,0,0,0.06)",
        border: "1.5px solid rgba(0,0,0,0.1)",
        color: "#888",
      }
    : { background: GOLD, color: "#fff", boxShadow: `0 6px 24px ${GOLD}44` };

  return (
    <div
      className={`relative min-h-screen pb-24 ${
        isThemed ? "is-themed profile-theme-active" : ""
      }`}
      data-profile-theme={isThemed ? "true" : "false"}
      style={profileBg}
    >
      {!isThemed && (
        <div className="fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C59A2F]/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-[#C59A2F]/3 rounded-full blur-[150px] pointer-events-none" />
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
              ? { borderRadius: 28, background: "transparent" }
              : {
                  background: "var(--profile-card-bg, rgba(255,255,255,0.82))",
                  backdropFilter: "blur(28px)",
                  WebkitBackdropFilter: "blur(28px)",
                  borderRadius: 28,
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
              </motion.div>

              {/* Info */}
              <div className="flex-1 min-w-0 pt-1 w-full">
                <div className="flex items-start justify-between gap-3 w-full">
                  <div className="min-w-0 flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                    <motion.h1
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.45 }}
                      className="text-2xl sm:text-[28px] font-black tracking-tight leading-none"
                      style={{
                        color: tc(
                          activeTheme.textColor,
                          "var(--name-color, #111)"
                        ),
                        fontFamily: "'Poppins', sans-serif",
                      }}
                    >
                      {fullName}
                    </motion.h1>

                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#C59A2F]/10 text-[#C59A2F] border border-[#C59A2F]/20 dark:bg-[#C59A2F]/20">
                        ✦ {role === "guest" ? "Guest" : role}
                      </span>
                    </div>
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
                      onOpenWallet={() => setShowWalletModal(true)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* About */}
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

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap justify-center sm:justify-start gap-2 mb-6"
            >
              <StatPill
                icon={FiUsers}
                value={friendsCount}
                label="Connections"
                isThemed={isThemed}
                theme={activeTheme}
                onClick={() => setShowFollowModal("friends")}
              />
              <StatPill
                icon={FiBookmark}
                value={savedPosts.length || "—"}
                label="Saved"
                isThemed={isThemed}
                theme={activeTheme}
              />
            </motion.div>

            <div
              className="h-px w-full mb-5"
              style={{
                background: isThemed
                  ? activeTheme.divider || "rgba(255,255,255,0.1)"
                  : "rgba(0,0,0,0.06)",
              }}
            />

            {/* Action Buttons */}
            {!isOwner && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="flex flex-wrap justify-center sm:justify-start gap-3"
              >
                {loggedInUser?.role !== "host" && (
                  <button
                    type="button"
                    onClick={() => handleFriendToggle()}
                    disabled={followLoading}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-60 cursor-pointer"
                    style={
                      isThemed
                        ? isFriend
                          ? {
                              background: "rgba(197,154,47,0.2)",
                              border: `1.5px solid ${GOLD}55`,
                              color: GOLD,
                            }
                          : isRequested
                          ? {
                              background: "rgba(255,255,255,0.08)",
                              border: "1.5px solid rgba(255,255,255,0.15)",
                              color: "rgba(255,255,255,0.5)",
                            }
                          : { background: GOLD, color: "#fff" }
                        : { ...friendBtnStyle, boxShadow: "none" }
                    }
                  >
                    <FiUsers size={14} />
                    {followLoading
                      ? "…"
                      : isFriend
                      ? "Friends"
                      : isRequested
                      ? "Requested"
                      : "Connect"}
                  </button>
                )}
                {loggedInUser?.role !== "host" && (
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
                            "Cannot start chat with this user",
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
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* ══ TABS ══ */}
        {TABS.length > 0 && (
          <motion.div
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
        )}

        {/* ══ TAB CONTENT ══ */}
        <div>
          {(visitedTabs.has("saved") || activeTab === "saved") && (
            <div
              key="saved"
              className={
                activeTab === "saved"
                  ? "space-y-6 pt-6 pb-24 md:pb-6 block"
                  : "hidden"
              }
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3
                    className="text-lg font-black uppercase tracking-wider text-[#C59A2F]"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Saved Experiences
                  </h3>
                  <p
                    className="text-xs text-neutral-400 mt-1 font-medium"
                    style={
                      isThemed
                        ? {
                            color: "#ffffff",
                            textShadow: "0 2px 10px rgba(0,0,0,0.85)",
                            opacity: 0.95,
                          }
                        : undefined
                    }
                  >
                    {isOwner
                      ? "Your bookmarked experiences and locations."
                      : `Experiences saved by ${fullName}.`}
                  </p>
                </div>
                {!loadingSaved && savedPosts.length > 0 && (
                  <div className="hidden md:flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => scrollSaved("left")}
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
                      onClick={() => scrollSaved("right")}
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
              {loadingSaved ? (
                <div
                  className="flex gap-4 md:gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory w-full"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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
              ) : savedPosts.length === 0 ? (
                <EmptyState
                  label={
                    isOwner ? "No saved experiences yet" : "Nothing saved"
                  }
                  isThemed={isThemed}
                  theme={activeTheme}
                />
              ) : (
                <div
                  ref={savedScrollRef}
                  className="flex gap-4 md:gap-6 overflow-x-auto pb-12 md:pb-6 scrollbar-hide snap-x snap-mandatory w-full"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                >
                  {savedPosts.map((post) => (
                    <div
                      key={post._id || post.id}
                      className="snap-start shrink-0 min-w-[calc(50%-8px)] max-w-[calc(50%-8px)] md:min-w-[280px] md:max-w-[280px] lg:min-w-[310px] lg:max-w-[310px]"
                    >
                      <ExperienceCard
                        data={post}
                        className="w-full !h-auto"
                        showBookmark
                        onUnsave={handleRemoveFromSaved}
                        isThemed={isThemed}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {(visitedTabs.has("reviews") || activeTab === "reviews") && (
            <div
              key="reviews"
              className={
                activeTab === "reviews" ? "space-y-6 pt-6 block" : "hidden"
              }
            >
              <div className="flex justify-between items-center">
                <div>
                  <h3
                    className="text-lg font-black uppercase tracking-wider text-[#C59A2F]"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Reviews
                  </h3>
                  <p
                    className="text-xs text-neutral-400 mt-1 font-medium"
                    style={
                      isThemed
                        ? {
                            color: "#ffffff",
                            textShadow: "0 2px 10px rgba(0,0,0,0.85)",
                            opacity: 0.95,
                          }
                        : undefined
                    }
                  >
                    {isOwner
                      ? "Reviews and ratings you have shared about hosts."
                      : `Reviews and ratings shared by ${fullName}.`}
                  </p>
                </div>
              </div>
              {loadingReviews ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div
                      key={i}
                      className="h-28 rounded-3xl animate-pulse"
                      style={{
                        background: isThemed
                          ? "rgba(255,255,255,0.07)"
                          : "var(--skeleton-bg, #f0efee)",
                      }}
                    />
                  ))}
                </div>
              ) : writtenReviews.length === 0 ? (
                <EmptyState
                  label={
                    isOwner
                      ? "You haven't written any reviews yet"
                      : "No reviews written yet"
                  }
                  isThemed={isThemed}
                  theme={activeTheme}
                />
              ) : (
                <div className="space-y-4">
                  {writtenReviews.map((r) => (
                    <div
                      key={r._id || r.id}
                      className="relative rounded-[2rem] p-6 transition-all border"
                      style={
                        isThemed
                          ? {
                              borderColor: "rgba(255,255,255,0.18)",
                              background: "transparent",
                            }
                          : {
                              borderColor:
                                "var(--panel-border, rgba(255,255,255,0.9))",
                              background:
                                "var(--profile-card-bg, rgba(255,255,255,0.82))",
                              backdropFilter: "blur(20px)",
                            }
                      }
                    >
                      <div className="flex gap-4 items-start">
                        <img
                          loading="lazy"
                          decoding="async"
                          src={
                            r.host?.avatar?.url ||
                            r.host?.avatar ||
                            `https://ui-avatars.com/api/?name=${
                              r.host?.firstname || "Host"
                            }&background=C59A2F&color=fff`
                          }
                          className="w-12 h-12 rounded-2xl border-2 border-white shadow-sm object-cover shrink-0"
                          alt={r.host?.firstname}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                            <div>
                              <span
                                className="text-[9px] font-black uppercase tracking-widest block"
                                style={
                                  isThemed
                                    ? {
                                        color: "#C59A2F",
                                        textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                                      }
                                    : { color: "rgb(156, 163, 175)" }
                                }
                              >
                                Rated Host
                              </span>
                              <h4
                                className="font-black text-neutral-900 text-sm dark:text-neutral-100 transition-colors truncate"
                                style={
                                  isThemed
                                    ? {
                                        color: "#ffffff",
                                        textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                                      }
                                    : undefined
                                }
                              >
                                {r.host?.firstname} {r.host?.lastname}
                              </h4>

                              <div className="flex text-yellow-400 gap-0.5 mt-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <FaStar
                                    key={star}
                                    size={10}
                                    className={
                                      star <= r.rating
                                        ? "text-yellow-400 fill-current"
                                        : "text-neutral-200"
                                    }
                                  />
                                ))}
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className="text-[8px] font-black uppercase tracking-widest"
                                style={
                                  isThemed
                                    ? { color: "#ffffff" }
                                    : { color: "rgb(212, 212, 212)" }
                                }
                              >
                                {new Date(r.createdAt).toLocaleDateString(
                                  undefined,
                                  { month: "short", year: "numeric" }
                                )}
                              </span>

                              {isOwner && (
                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleEditReviewClick(r)}
                                    disabled={deletingId === r._id}
                                    className="p-2 text-[#C59A2F] hover:text-[#d6a93b] hover:bg-[#C59A2F]/10 rounded-xl transition-all cursor-pointer"
                                    style={
                                      isThemed
                                        ? {
                                            color: "#C59A2F",
                                            background:
                                              "rgba(255,255,255,0.08)",
                                          }
                                        : undefined
                                    }
                                    title="Edit Review"
                                  >
                                    <FiEdit2 size={13} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteClick(r._id)}
                                    disabled={deletingId === r._id}
                                    className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all cursor-pointer"
                                    style={
                                      isThemed
                                        ? {
                                            color: "#f87171",
                                            background:
                                              "rgba(255,255,255,0.08)",
                                          }
                                        : undefined
                                    }
                                    title="Delete Rating"
                                  >
                                    <FiTrash2 size={13} />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {r.post && (
                            <p
                              className="text-[10px] mt-2 font-bold uppercase tracking-wider"
                              style={
                                isThemed
                                  ? { color: "rgba(255,255,255,0.85)" }
                                  : { color: "rgb(163, 163, 163)" }
                              }
                            >
                              Experience:{" "}
                              <span
                                style={
                                  isThemed
                                    ? { color: "#ffffff", fontWeight: 700 }
                                    : undefined
                                }
                              >
                                {r.post.title}
                              </span>
                            </p>
                          )}

                          {r.comment && r.comment.trim() && (
                            <div
                              className="mt-3 p-3.5 rounded-2xl rounded-tl-none border"
                              style={
                                isThemed
                                  ? {
                                      background: "transparent",
                                      borderColor: "rgba(255,255,255,0.15)",
                                      borderLeftWidth: 3,
                                      borderLeftColor: "#C59A2F",
                                    }
                                  : {
                                      background: "rgba(250, 250, 250, 0.5)",
                                      borderColor: "rgba(240, 240, 240, 0.8)",
                                    }
                              }
                            >
                              <p
                                className="text-xs font-bold leading-relaxed italic transition-colors"
                                style={
                                  isThemed
                                    ? { color: "#ffffff", opacity: 0.98 }
                                    : { color: "rgb(82, 82, 82)" }
                                }
                              >
                                &ldquo;{r.comment}&rdquo;
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {isOwner &&
            (visitedTabs.has("scheduled") || activeTab === "scheduled") && (
              <div
                key="scheduled"
                className={activeTab === "scheduled" ? "block" : "hidden"}
              >
                <ScheduledExperiencesTab
                  isThemed={isThemed}
                  theme={activeTheme}
                />
              </div>
            )}

          {isOwner &&
            (visitedTabs.has("bookings") || activeTab === "bookings") && (
              <div
                key="bookings"
                className={activeTab === "bookings" ? "pt-6 block" : "hidden"}
              >
                <GuestBookingsTab isThemed={isThemed} theme={activeTheme} />
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
        {showWalletModal && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWalletModal(false)}
              className={`absolute inset-0 ${
                isThemed
                  ? "bg-black/35 backdrop-blur-sm"
                  : "bg-black/60 backdrop-blur-md"
              }`}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 24 }}
              className={`relative rounded-[2.5rem] p-8 w-full max-w-md shadow-2xl z-10 overflow-hidden border text-center flex flex-col items-center ${
                isThemed
                  ? "border-white/18 text-white"
                  : "bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-800"
              }`}
              style={
                isThemed
                  ? {
                      background: "transparent",
                      backgroundColor: "transparent",
                      border: "1px solid rgba(255, 255, 255, 0.22)",
                      boxShadow: "0 16px 40px rgba(0, 0, 0, 0.3)",
                    }
                  : undefined
              }
            >
              <button
                type="button"
                onClick={() => setShowWalletModal(false)}
                className={`absolute top-5 right-5 p-2 rounded-full transition-colors cursor-pointer ${
                  isThemed
                    ? "bg-white/10 hover:bg-white/20 text-white"
                    : "bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-500"
                }`}
              >
                <FiX size={18} />
              </button>

              <div className="w-16 h-16 rounded-3xl bg-[#C59A2F]/10 flex items-center justify-center text-[#C59A2F] mb-6">
                <FiCreditCard size={32} />
              </div>

              <h3
                className="text-2xl font-black uppercase tracking-tight mb-2"
                style={{ color: isThemed ? "#ffffff" : undefined }}
              >
                My Wallet
              </h3>
              <p
                className="text-xs font-medium mb-6"
                style={{
                  color: isThemed ? "rgba(255,255,255,0.75)" : undefined,
                }}
              >
                Use your wallet credits to book future experiences.
              </p>

              <div
                className={`w-full py-6 px-4 rounded-3xl mb-2 ${
                  isThemed
                    ? "border border-[#C59A2F]/30"
                    : "bg-[#FFF7E6] dark:bg-neutral-950 border border-[#C59A2F]/10"
                }`}
                style={
                  isThemed
                    ? { background: "rgba(255, 255, 255, 0.05)" }
                    : undefined
                }
              >
                <div className="text-[10px] font-black text-[#C59A2F] uppercase tracking-widest mb-1.5">
                  Available Balance
                </div>
                <div
                  className="text-4xl font-black flex items-center justify-center gap-2"
                  style={{ color: isThemed ? "#ffffff" : undefined }}
                >
                  <span>{(user.walletBalance || 0).toLocaleString()}</span>
                  <span className="text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#C59A2F]/10 text-[#C59A2F] border border-[#C59A2F]/20">
                    Credits
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        {showFollowModal && (
          <FollowListModal
            type={showFollowModal}
            userId={user._id || user.id}
            onClose={() => setShowFollowModal(null)}
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
                  : "bg-black/60 backdrop-blur-sm"
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
                This action is permanent and cannot be undone.
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

        {showDeleteConfirm && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteConfirm(false)}
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
              className="relative rounded-[2rem] p-8 w-full max-w-sm shadow-2xl text-center z-10"
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
                Delete Rating?
              </h3>
              <p
                className="text-sm mb-6 font-medium"
                style={{
                  color: isThemed ? "rgba(255,255,255,0.85)" : undefined,
                }}
              >
                Are you sure you want to remove this rating and review? This
                will update the host&apos;s stats as well.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className={`flex-1 px-4 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all cursor-pointer ${
                    isThemed
                      ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                      : "bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700"
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  className="flex-1 px-4 py-3 rounded-2xl text-sm font-black uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {showEditReviewModal && reviewToEdit && (
              <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowEditReviewModal(false)}
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
                  className="relative rounded-[2rem] p-8 w-full max-w-md shadow-2xl text-center z-10 flex flex-col gap-6"
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
                  <div>
                    <h3
                      className="text-lg font-black uppercase tracking-tight"
                      style={{ color: isThemed ? "#ffffff" : undefined }}
                    >
                      Edit Review
                    </h3>
                    <p
                      className="text-xs mt-1 font-medium"
                      style={{
                        color: isThemed
                          ? "rgba(255,255,255,0.75)"
                          : undefined,
                      }}
                    >
                      Update your rating and review details for{" "}
                      {reviewToEdit.host?.firstname}{" "}
                      {reviewToEdit.host?.lastname}.
                    </p>
                  </div>

                  {/* Rating stars */}
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#C59A2F]">
                      Rating
                    </span>
                    <InteractiveStars
                      selected={editReviewRating}
                      hover={editReviewHover}
                      onHover={setEditReviewHover}
                      onLeave={() => setEditReviewHover(0)}
                      onSelect={setEditReviewRating}
                      disabled={updatingReviewId !== null}
                    />
                  </div>

                  {/* Review Text */}
                  <div className="flex flex-col items-start gap-2 text-left">
                    <span
                      className={`text-[10px] font-black uppercase tracking-widest ${
                        isThemed
                          ? "text-white/80"
                          : "text-slate-400 dark:text-neutral-500"
                      }`}
                    >
                      Review
                    </span>
                    <textarea
                      value={editReviewComment}
                      onChange={(e) => setEditReviewComment(e.target.value)}
                      placeholder="Write a review..."
                      className="w-full px-5 py-3.5 border rounded-2xl outline-none transition-all resize-none font-medium text-xs leading-relaxed focus:ring-4 focus:ring-[#C59A2F]/10 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
                      rows={3}
                      style={{
                        background: isThemed
                          ? "transparent"
                          : "var(--input-bg, #fcfbfb)",
                        color: isThemed
                          ? "#ffffff"
                          : "var(--name-color, #222)",
                        borderColor: isThemed
                          ? "rgba(255,255,255,0.22)"
                          : "var(--panel-border, #eee)",
                      }}
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowEditReviewModal(false)}
                      className={`flex-1 px-4 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all cursor-pointer ${
                        isThemed
                          ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                          : "bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleUpdateReview}
                      disabled={updatingReviewId !== null}
                      className="flex-1 px-4 py-3 rounded-2xl text-sm font-black uppercase tracking-widest bg-[#C59A2F] text-white hover:bg-[#d6a93b] transition-all shadow-lg cursor-pointer disabled:opacity-60"
                    >
                      {updatingReviewId ? "Saving..." : "Save"}
                    </button>
                  </div>
                </motion.div>
              </div>
            )}

            {showUnfriendConfirm && (
              <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowUnfriendConfirm(false)}
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
                  className="relative rounded-[2rem] p-8 w-full max-w-sm shadow-2xl text-center z-10"
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
                  <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/20 flex items-center justify-center mx-auto mb-4">
                    <FiUsers size={24} className="text-red-500" />
                  </div>
                  <h3
                    className="text-lg font-black uppercase tracking-tight mb-2"
                    style={{ color: isThemed ? "#ffffff" : undefined }}
                  >
                    Remove Friend?
                  </h3>
                  <p
                    className="text-sm mb-6 font-medium"
                    style={{
                      color: isThemed ? "rgba(255,255,255,0.85)" : undefined,
                    }}
                  >
                    Do you want to remove this user from friend list?
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowUnfriendConfirm(false)}
                      className={`flex-1 px-4 py-3 rounded-2xl text-sm font-black uppercase tracking-widest transition-all cursor-pointer ${
                        isThemed
                          ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                          : "bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700"
                      }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFriendToggle(true)}
                      disabled={followLoading}
                      className="flex-1 px-4 py-3 rounded-2xl text-sm font-black uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg cursor-pointer disabled:opacity-60"
                    >
                      Yes
                    </button>
                  </div>
                </motion.div>
              </div>
            )}

            {showMessageWarningModal && (
              <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setShowMessageWarningModal(false)}
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
                  className="relative rounded-[2rem] p-8 w-full max-w-sm shadow-2xl text-center z-10"
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
                  <div className="w-14 h-14 rounded-2xl bg-[#C59A2F]/10 flex items-center justify-center mx-auto mb-4">
                    <FiMessageSquare size={24} style={{ color: GOLD }} />
                  </div>
                  <h3
                    className="text-lg font-black uppercase tracking-tight mb-2"
                    style={{ color: isThemed ? "#ffffff" : undefined }}
                  >
                    Connect to Message
                  </h3>
                  <p
                    className="text-sm mb-6 font-medium"
                    style={{
                      color: isThemed ? "rgba(255,255,255,0.85)" : undefined,
                    }}
                  >
                    To send a message, you must connect with this user and be
                    friends first.
                  </p>
                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => setShowMessageWarningModal(false)}
                      className="px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest text-white transition-all cursor-pointer"
                      style={{ background: GOLD }}
                    >
                      OK
                    </button>
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

