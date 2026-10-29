"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FiUser } from "react-icons/fi";
import { useAuthStore } from "@/stores/auth-store";
import { useThemeStore } from "@/stores/theme-store";
import { getProfileByIdApi } from "@/lib/api/users-api";
import { AdminProfile } from "./admin-profile";
import { HostProfile } from "./host-profile";
import { GuestProfile } from "./guest-profile";

interface ProfileViewProps {
  userId?: string;
}

export function ProfileView({ userId }: ProfileViewProps) {
  const router = useRouter();
  const { user: loggedInUser } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const isDark = theme === "dark";

  const [profileData, setProfileData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const targetUserId =
    userId && userId !== "undefined" && userId !== "null"
      ? userId
      : loggedInUser?._id || loggedInUser?.id || "";

  const fetchProfile = useCallback(
    async (p = 1) => {
      if (!targetUserId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const res = await getProfileByIdApi(targetUserId, p);
        if (res?.success) {
          setProfileData(res.data);
          setPage(p);
        } else if (res?.user || res?.data?.user) {
          setProfileData(res.data || res);
          setPage(p);
        } else {
          setProfileData(null);
        }
      } catch (err) {
        console.error("Profile fetch error", err);
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    },
    [targetUserId]
  );

  useEffect(() => {
    setProfileData(null);
    fetchProfile(1);
  }, [targetUserId, fetchProfile]);

  if (loading && !profileData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-3 border-[#C59A2F]/20 border-t-[#C59A2F] rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-[#C59A2F]">
            Loading Profile...
          </p>
        </div>
      </div>
    );
  }

  if (!profileData || !profileData.user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-neutral-950">
        <div className="w-20 h-20 rounded-3xl bg-[#C59A2F]/10 flex items-center justify-center text-[#C59A2F] mb-4">
          <FiUser size={32} />
        </div>
        <h3 className="text-xl font-black text-neutral-800 dark:text-neutral-100 mb-2">
          Profile Not Found
        </h3>
        <p className="text-sm text-neutral-500 max-w-sm mb-6">
          The requested profile could not be loaded or may no longer exist.
        </p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="px-6 py-2.5 bg-[#C59A2F] text-white rounded-full text-xs font-black uppercase tracking-wider hover:bg-[#a67e24] transition-all shadow-md active:scale-95 cursor-pointer"
        >
          Go to Home
        </button>
      </div>
    );
  }

  const { user, posts, postStats, reviewStats, pagination } = profileData;
  const isOwner =
    Boolean(loggedInUser) &&
    (loggedInUser?._id || loggedInUser?.id) === (user?._id || user?.id);

  if (user.role === "admin") {
    return (
      <AdminProfile
        user={user}
        isOwner={isOwner}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />
    );
  }

  if (user.role === "host") {
    return (
      <HostProfile
        hostId={user?._id || user?.id}
        userId={user?._id || user?.id}
        user={user}
        posts={posts || []}
        postStats={postStats || {}}
        reviewStats={reviewStats || {}}
        isOwner={isOwner}
        onRatingSuccess={() => fetchProfile(page)}
        pagination={pagination || {}}
        onPageChange={fetchProfile}
        isProfileLoading={loading}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />
    );
  }

  return (
    <GuestProfile
      user={user}
      userId={user?._id || user?.id}
      posts={posts || []}
      isOwner={isOwner}
      userRole={user.role}
      isDark={isDark}
      onToggleTheme={toggleTheme}
    />
  );
}
