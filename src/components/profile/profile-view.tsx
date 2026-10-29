"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  MapPin,
  Calendar,
  ShieldCheck,
  Edit3,
  Bookmark,
  Compass,
  MessageSquare,
  Plus,
  Star,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

function ProfileExperienceCardPlaceholder() {
  return (
    <div className="flex flex-col bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-xs overflow-hidden text-left">
      <div className="aspect-[4/3] w-full bg-neutral-100 dark:bg-neutral-800/80 flex items-center justify-center border-b border-neutral-200/60 dark:border-neutral-800">
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
          No image
        </span>
      </div>
      <div className="p-4 space-y-2">
        <h4 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
          No title
        </h4>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">
          No description
        </p>
        <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800 text-xs">
          <span className="font-bold text-neutral-800 dark:text-neutral-200">
            ₹ No price
          </span>
          <span className="flex items-center gap-1 font-semibold text-neutral-500">
            <Star size={12} className="text-[#C59A2F] fill-[#C59A2F]" /> No rating
          </span>
        </div>
      </div>
    </div>
  );
}

interface ProfileViewProps {
  userId?: string;
}

export function ProfileView({ userId }: ProfileViewProps) {
  const { user: currentUser, openAuthModal } = useAuthStore();
  const [activeTab, setActiveTab] = useState<string>("experiences");

  const displayUser =
    currentUser || {
      id: userId || "guest-1",
      firstname: "Traveler",
      lastname: "",
      email: "guest@athithya.in",
      role: "guest" as const,
      hostStatus: "approved" as const,
    };

  const isHost = displayUser.role === "host" || displayUser.role === "admin";

  return (
    <main className="min-h-screen pt-24 pb-20 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
        {/* Profile Card Header */}
        <div className="p-6 sm:p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#C59A2F] text-white flex items-center justify-center font-black text-3xl sm:text-4xl shadow-md shrink-0">
              {(displayUser.firstname?.charAt(0) || "U").toUpperCase()}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100 capitalize">
                    {displayUser.firstname} {displayUser.lastname}
                  </h1>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5 mt-1.5">
                    <span className="px-3 py-0.5 rounded-full bg-[#C59A2F]/15 text-[#C59A2F] text-xs font-black uppercase tracking-wider">
                      {displayUser.role || "Traveler"}
                    </span>
                    <span className="flex items-center gap-1 text-xs text-[#C59A2F] font-bold">
                      <ShieldCheck size={14} /> Verified Member
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                  {currentUser ? (
                    <button
                      type="button"
                      className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold transition cursor-pointer"
                    >
                      <Edit3 size={14} />
                      <span>Edit Profile</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openAuthModal("login")}
                      className="px-5 py-2 rounded-full bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider hover:bg-[#A67F26] transition shadow-xs cursor-pointer"
                    >
                      Login to Manage
                    </button>
                  )}
                </div>
              </div>

              {/* Bio & Meta */}
              <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-4 max-w-2xl leading-relaxed">
                Welcome to Athithya profile. Exploring authentic traditions, cultural trails, and mountain life across Uttarakhand.
              </p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-4 text-xs text-neutral-500 dark:text-neutral-400">
                <span className="flex items-center gap-1">
                  <MapPin size={13} className="text-[#C59A2F]" /> Uttarakhand, India
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar size={13} className="text-[#C59A2F]" /> Member on Athithya
                </span>
              </div>

              {/* Stats Counters */}
              <div className="flex items-center justify-center sm:justify-start gap-6 mt-6 pt-6 border-t border-neutral-200/60 dark:border-neutral-800">
                <div className="text-center sm:text-left">
                  <span className="block font-black text-lg text-neutral-900 dark:text-neutral-100">
                    0
                  </span>
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    {isHost ? "Experiences" : "Trips Booked"}
                  </span>
                </div>
                <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800" />
                <div className="text-center sm:text-left">
                  <span className="block font-black text-lg text-neutral-900 dark:text-neutral-100">
                    0
                  </span>
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Followers
                  </span>
                </div>
                <div className="h-6 w-px bg-neutral-200 dark:bg-neutral-800" />
                <div className="text-center sm:text-left">
                  <span className="block font-black text-lg text-neutral-900 dark:text-neutral-100">
                    0
                  </span>
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                    Following
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-neutral-200 dark:border-neutral-800 mb-8 overflow-x-auto">
          {isHost ? (
            <>
              <button
                type="button"
                onClick={() => setActiveTab("experiences")}
                className={`pb-3 px-4 text-sm font-extrabold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === "experiences"
                    ? "border-[#C59A2F] text-[#C59A2F]"
                    : "border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                }`}
              >
                Hosted Experiences
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("bookings")}
                className={`pb-3 px-4 text-sm font-extrabold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === "bookings"
                    ? "border-[#C59A2F] text-[#C59A2F]"
                    : "border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                }`}
              >
                Booking Requests
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("reviews")}
                className={`pb-3 px-4 text-sm font-extrabold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === "reviews"
                    ? "border-[#C59A2F] text-[#C59A2F]"
                    : "border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                }`}
              >
                Reviews & Ratings
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setActiveTab("experiences")}
                className={`pb-3 px-4 text-sm font-extrabold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === "experiences"
                    ? "border-[#C59A2F] text-[#C59A2F]"
                    : "border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                }`}
              >
                Saved Experiences
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("bookings")}
                className={`pb-3 px-4 text-sm font-extrabold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === "bookings"
                    ? "border-[#C59A2F] text-[#C59A2F]"
                    : "border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                }`}
              >
                My Bookings
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("posts")}
                className={`pb-3 px-4 text-sm font-extrabold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                  activeTab === "posts"
                    ? "border-[#C59A2F] text-[#C59A2F]"
                    : "border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
                }`}
              >
                Community Posts
              </button>
            </>
          )}
        </div>

        {/* Tab Content Display */}
        {activeTab === "experiences" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-black text-neutral-900 dark:text-neutral-100">
                {isHost ? "Hosted Experiences" : "Saved Experiences"}
              </h2>
              {isHost && (
                <Link
                  href="/post"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#C59A2F] text-white text-xs font-bold hover:bg-[#A67F26] transition shadow-xs"
                >
                  <Plus size={14} /> Add Experience
                </Link>
              )}
            </div>

            {/* Neutral placeholders as requested */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <ProfileExperienceCardPlaceholder key={i} />
              ))}
            </div>
          </div>
        )}

        {activeTab === "bookings" && (
          <div className="p-12 text-center rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
            <Compass size={36} className="mx-auto text-neutral-400 mb-3" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              No active bookings found
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
              When you reserve an authentic experience in Uttarakhand, your tickets and itinerary details will appear here.
            </p>
            <Link
              href="/explore-experience"
              className="inline-block mt-4 px-5 py-2.5 rounded-full bg-[#C59A2F] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#A67F26] transition shadow-xs"
            >
              Explore Experiences
            </Link>
          </div>
        )}

        {(activeTab === "reviews" || activeTab === "posts") && (
          <div className="p-12 text-center rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
            <MessageSquare size={36} className="mx-auto text-neutral-400 mb-3" />
            <h3 className="text-base font-bold text-neutral-900 dark:text-neutral-100">
              No entries to display
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 max-w-sm mx-auto">
              Feedbacks, reviews, and community memories will be displayed in this section.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
