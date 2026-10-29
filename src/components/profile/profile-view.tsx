"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MapPin,
  Calendar,
  ShieldCheck,
  Edit3,
  Plus,
  UserPlus,
  UserCheck,
  MessageSquare,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useFeedbackStore } from "@/stores/feedback-store";
import {
  getProfileByIdApi,
  getSavedPostsApi,
  friendRequestApi,
  acceptFriendRequestApi,
  unfriendUserApi,
} from "@/lib/api/users-api";
import { PROFILE_THEMES } from "@/data/profile-themes";
import { ExperienceCard } from "@/components/cards/experience-card";
import { EditProfileModal } from "./edit-profile-modal";
import { ProfileGridTab } from "./profile-grid-tab";
import { CommunityPostsTab } from "./community-posts-tab";
import { ProfileBookingsTab } from "./profile-bookings-tab";
import { HostReviewsSection } from "@/components/post/host-reviews-section";

interface ProfileViewProps {
  userId?: string;
}

export function ProfileView({ userId }: ProfileViewProps) {
  const router = useRouter();
  const { user: currentUser, openAuthModal, fetchUser } = useAuthStore();
  const { showToast } = useFeedbackStore();

  const targetUserId = userId || currentUser?.id || (currentUser as any)?._id || "";
  const isOwnProfile = Boolean(
    currentUser && (!userId || String(userId) === String(currentUser.id || (currentUser as any)?._id))
  );

  const [profileUser, setProfileUser] = useState<Record<string, any> | null>(null);
  const [experiences, setExperiences] = useState<any[]>([]);
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [friendStatus, setFriendStatus] = useState<"none" | "pending" | "received" | "friends">("none");
  const [activeTab, setActiveTab] = useState<string>("experiences");
  const [showEditModal, setShowEditModal] = useState(false);

  const loadProfile = useCallback(async () => {
    if (!targetUserId) return;
    try {
      const res = await getProfileByIdApi(targetUserId);
      const data = res?.data || res || {};
      const fetchedUser = data.user || data.profile || data;
      if (fetchedUser && (fetchedUser._id || fetchedUser.id || fetchedUser.firstname)) {
        setProfileUser(fetchedUser);
      }
      const posts = data.posts || data.experiences || data.services || fetchedUser?.posts || [];
      setExperiences(Array.isArray(posts) ? posts : []);
      if (data.friendStatus) setFriendStatus(data.friendStatus);
    } catch {
      // Fallback to current user
    }

    if (isOwnProfile) {
      try {
        const savedRes = await getSavedPostsApi();
        const list = savedRes?.savedPosts || savedRes?.data?.savedPosts || (Array.isArray(savedRes) ? savedRes : []);
        setSavedPosts(list);
      } catch {
        setSavedPosts([]);
      }
    }
  }, [targetUserId, isOwnProfile]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const displayUser: Record<string, any> = profileUser || currentUser || {
    id: targetUserId || "guest-1",
    firstname: "Traveler",
    lastname: "",
    role: "guest",
    bio: "Welcome to Athithya profile. Exploring authentic traditions, cultural trails, and mountain life across Uttarakhand.",
  };

  const isHost = displayUser.role === "host" || displayUser.role === "admin";
  const themeObj =
    PROFILE_THEMES.find((t) => t.key === (displayUser.profileTheme || "mountain")) || PROFILE_THEMES[0];

  const handleFriendAction = async () => {
    if (!currentUser) return openAuthModal("login");
    try {
      if (friendStatus === "none") {
        await friendRequestApi(targetUserId);
        setFriendStatus("pending");
        showToast("Friend request sent!", "success");
      } else if (friendStatus === "received") {
        await acceptFriendRequestApi(targetUserId);
        setFriendStatus("friends");
        showToast("Friend request accepted!", "success");
      } else if (friendStatus === "friends") {
        await unfriendUserApi(targetUserId);
        setFriendStatus("none");
        showToast("Removed from friends", "info");
      }
    } catch (err: any) {
      showToast(err?.message || "Could not update friendship", "error");
    }
  };

  const tabs = isHost
    ? [
        { id: "experiences", label: "Hosted Experiences" },
        { id: "grid", label: "Media Grid" },
        { id: "posts", label: "Community Stories" },
        ...(isOwnProfile ? [{ id: "bookings", label: "Booking Requests" }] : []),
        { id: "reviews", label: "Reviews & Ratings" },
      ]
    : [
        { id: "experiences", label: isOwnProfile ? "Saved Experiences" : "Travel Plans" },
        { id: "posts", label: "Community Stories" },
        ...(isOwnProfile
          ? [
              { id: "bookings", label: "My Bookings" },
              { id: "schedules", label: "Scheduled Trips" },
            ]
          : []),
      ];

  const avatarSrc = displayUser.avatar?.url || (typeof displayUser.avatar === "string" ? displayUser.avatar : "");
  const locationLabel =
    displayUser.location?.city
      ? `${displayUser.location.city}, ${displayUser.location.state || "Uttarakhand"}`
      : "Uttarakhand, India";

  return (
    <main className="min-h-screen pt-24 pb-20 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Themed Profile Header */}
        <div
          className="relative p-6 sm:p-8 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs mb-8 overflow-hidden bg-neutral-50 dark:bg-neutral-900"
          style={
            themeObj?.image
              ? {
                  backgroundImage: `${themeObj.overlay}, url(${themeObj.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  color: themeObj.textColor || "#fff",
                }
              : undefined
          }
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#C59A2F] text-white flex items-center justify-center font-black text-3xl sm:text-4xl shadow-md shrink-0 overflow-hidden border-2 border-white/30">
              {avatarSrc ? (
                <img src={avatarSrc} alt={displayUser.firstname} className="w-full h-full object-cover" />
              ) : (
                (displayUser.firstname?.charAt(0) || "U").toUpperCase()
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black capitalize">
                    {displayUser.firstname} {displayUser.lastname}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-1.5">
                    <span className="px-3 py-0.5 rounded-full bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider">
                      {displayUser.role || "Traveler"}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#C59A2F] font-bold">
                      <ShieldCheck size={14} /> Verified Member
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2">
                  {isOwnProfile ? (
                    <button
                      type="button"
                      onClick={() => setShowEditModal(true)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/40 backdrop-blur-xs border border-white/25 text-white hover:bg-black/60 text-xs font-bold transition cursor-pointer"
                    >
                      <Edit3 size={14} />
                      <span>Edit Profile</span>
                    </button>
                  ) : currentUser ? (
                    <>
                      <button
                        type="button"
                        onClick={handleFriendAction}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#C59A2F] text-white text-xs font-bold hover:bg-[#A67F26] transition"
                      >
                        {friendStatus === "friends" ? <UserCheck size={14} /> : <UserPlus size={14} />}
                        <span>
                          {friendStatus === "friends"
                            ? "Friends"
                            : friendStatus === "pending"
                            ? "Requested"
                            : friendStatus === "received"
                            ? "Accept Request"
                            : "Connect"}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => router.push(`/chat?userId=${targetUserId}`)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-black/45 text-white border border-white/25 text-xs font-bold"
                      >
                        <MessageSquare size={14} /> Message
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openAuthModal("login")}
                      className="px-5 py-2 rounded-full bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider"
                    >
                      Login to Connect
                    </button>
                  )}
                </div>
              </div>

              <p className="text-xs sm:text-sm opacity-90 mt-4 max-w-2xl leading-relaxed">
                {displayUser.bio ||
                  "Exploring authentic traditions, cultural trails, and mountain life across Uttarakhand."}
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-xs opacity-85">
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-[#C59A2F]" /> {locationLabel}
                </span>
                {displayUser.experienceYears ? (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar size={13} className="text-[#C59A2F]" /> {displayUser.experienceYears}+ Years Hosting
                    </span>
                  </>
                ) : null}
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-6 mt-6 pt-5 border-t border-white/15">
                <div>
                  <span className="block font-black text-lg">{experiences.length}</span>
                  <span className="text-[11px] font-bold opacity-75 uppercase tracking-wider">
                    {isHost ? "Experiences" : "Plans"}
                  </span>
                </div>
                <div className="h-6 w-px bg-white/20" />
                <div>
                  <span className="block font-black text-lg">{displayUser.friends?.length || displayUser.followersCount || 0}</span>
                  <span className="text-[11px] font-bold opacity-75 uppercase tracking-wider">Connections</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 px-4 text-sm font-extrabold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "border-[#C59A2F] text-[#C59A2F]"
                  : "border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "experiences" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black">
                {isHost ? "Hosted Experiences" : isOwnProfile ? "Saved Experiences & Plans" : "Travel Plans"}
              </h2>
              {isOwnProfile && (
                <Link
                  href="/post"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#C59A2F] text-white text-xs font-bold hover:bg-[#A67F26]"
                >
                  <Plus size={14} /> {isHost ? "Add Experience" : "Create Travel Plan"}
                </Link>
              )}
            </div>
            {(() => {
              const items = isHost ? experiences : isOwnProfile && savedPosts.length > 0 ? savedPosts : experiences;
              return items.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
                  <p className="text-sm font-bold text-neutral-500">No experiences to display yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {items.map((item: any, idx: number) => (
                    <ExperienceCard
                      key={item._id || item.id || idx}
                      data={item}
                      className="w-full"
                      showActions={isOwnProfile && isHost}
                      showBookmark={!isHost}
                      onDeleteSuccess={loadProfile}
                    />
                  ))}
                </div>
              );
            })()}
          </div>
        )}

        {activeTab === "grid" && <ProfileGridTab hostId={targetUserId} isOwnProfile={isOwnProfile} />}
        {activeTab === "posts" && <CommunityPostsTab userId={targetUserId} isOwnProfile={isOwnProfile} />}
        {activeTab === "bookings" && <ProfileBookingsTab isHost={isHost} mode="bookings" />}
        {activeTab === "schedules" && <ProfileBookingsTab isHost={false} mode="schedules" />}
        {activeTab === "reviews" && <HostReviewsSection host={displayUser} hostId={targetUserId} />}
      </div>

      <EditProfileModal
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={displayUser}
        onSaved={(updated) => {
          setProfileUser(updated);
          fetchUser();
        }}
      />
    </main>
  );
}
