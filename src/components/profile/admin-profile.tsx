"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiMail, FiCalendar, FiTrash2, FiX } from "react-icons/fi";
import { MdSecurity } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { EditProfileModal } from "./edit-profile-modal";
import { GOLD, ProfileMenu } from "./profile-shared";

interface AdminProfileProps {
  user: any;
  isOwner: boolean;
  isDark: boolean;
  onToggleTheme?: () => void;
}

export function AdminProfile({
  user: initialUser,
  isOwner,
  isDark,
  onToggleTheme,
}: AdminProfileProps) {
  const router = useRouter();
  const { setUser: setAuthUser, logout } = useAuthStore();
  const [user, setUser] = useState(initialUser);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAvatarPreview, setShowAvatarPreview] = useState(false);

  useEffect(() => {
    setUser(initialUser);
  }, [initialUser]);

  const avatarUrl =
    (typeof user?.avatar === "string" ? user.avatar : user?.avatar?.url) || "";
  const fullName =
    [user?.firstname, user?.lastname].filter(Boolean).join(" ") ||
    "Administrator";
  const city =
    user?.city || user?.location?.city || user?.location?.name || "";
  const about =
    user?.description ||
    user?.about ||
    "System Administrator for Athithya platform.";

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-[#fafafb] dark:bg-neutral-950 pb-24 transition-colors">
      <div className="mx-auto px-4 sm:px-6 pt-12 mt-16 max-w-7xl space-y-6">
        {/* PROFILE CARD */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden"
        >
          <div
            className="h-1 w-full"
            style={{
              background: `linear-gradient(90deg, ${GOLD}, #E6B84D, ${GOLD})`,
            }}
          />

          <div className="p-5 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-5">
              <div className="relative shrink-0">
                <div
                  className="absolute -inset-[3px] rounded-full"
                  style={{
                    background: `linear-gradient(135deg, ${GOLD}, #E6B84D, ${GOLD})`,
                    opacity: 0.7,
                  }}
                />
                <div className="relative rounded-full ring-4 ring-white dark:ring-neutral-900 overflow-hidden shadow-lg bg-neutral-100 dark:bg-neutral-800">
                  {avatarUrl ? (
                    <img
                      loading="lazy"
                      decoding="async"
                      src={avatarUrl}
                      alt={fullName}
                      className="w-20 h-20 sm:w-24 sm:h-24 object-cover cursor-pointer transition-transform duration-300 hover:scale-110"
                      onClick={() => setShowAvatarPreview(true)}
                    />
                  ) : (
                    <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center text-[#C59A2F] text-3xl font-black">
                      {fullName[0]}
                    </div>
                  )}
                </div>
              </div>

              {isOwner && (
                <div className="flex items-center gap-2 pt-1">
                  <ProfileMenu
                    isOwner={isOwner}
                    isDark={isDark}
                    onToggleTheme={onToggleTheme}
                    onEditProfile={() => setShowEditModal(true)}
                    onLogout={handleLogout}
                    onDeleteAccount={() => setShowDeleteModal(true)}
                    onAdminPanel={() => router.push("/admin")}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight leading-tight">
                {fullName}
              </h1>
              <span
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-widest font-bold border"
                style={{
                  background: `${GOLD}15`,
                  color: GOLD,
                  borderColor: `${GOLD}30`,
                }}
              >
                Admin
              </span>
            </div>

            {city && (
              <div className="flex items-center gap-1.5 text-neutral-500 dark:text-neutral-400 text-sm font-bold mb-4">
                <FiMapPin size={14} className="text-neutral-400" />
                {city}
              </div>
            )}

            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-5 mb-6">
              <h3 className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2">
                About Administrator
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">
                {about}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-600">
                  <FiMail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                    Email Address
                  </p>
                  <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                    {user?.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                <div className="w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center text-amber-600">
                  <FiCalendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">
                    Joined On
                  </p>
                  <p className="text-sm font-bold text-neutral-700 dark:text-neutral-300">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString(undefined, {
                          month: "long",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ADMIN DASHBOARD QUICK LINK */}
        {isOwner && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-[#C59A2F] rounded-3xl p-8 text-white shadow-xl shadow-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-6"
          >
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                <MdSecurity size={32} />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tighter">
                  Admin Dashboard
                </h3>
                <p className="text-white/80 text-sm font-medium">
                  Manage platform users, experiences, and approvals.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="bg-white text-[#C59A2F] px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              Enter Dashboard
            </button>
          </motion.div>
        )}
      </div>

      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onUpdate={(updated) => {
            setUser(updated);
            if (isOwner && setAuthUser) {
              setAuthUser({ ...user, ...updated });
            }
          }}
        />
      )}

      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDeleteModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 text-center">
                <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FiTrash2 className="text-red-500" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
                  Delete Account?
                </h3>
                <p className="text-neutral-500 dark:text-neutral-400 mb-8">
                  Are you sure you want to delete your administrator account?
                  This action is permanent and cannot be undone.
                </p>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(false)}
                    className="flex-1 py-4 rounded-2xl font-bold text-neutral-700 dark:text-neutral-300 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={async () => {
                      await logout();
                      router.push("/");
                    }}
                    className="flex-1 py-4 rounded-2xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20 transition-colors cursor-pointer"
                  >
                    Yes, Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAvatarPreview && avatarUrl && (
          <div className="fixed inset-0 z-[60000] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAvatarPreview(false)}
              className="absolute inset-0 bg-black/85 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative z-10"
            >
              <div className="relative w-[75vw] h-[75vw] max-w-[320px] max-h-[320px] md:max-w-[420px] md:max-h-[420px] aspect-square">
                <div className="w-full h-full rounded-full overflow-hidden shadow-2xl border-4 border-white/20 bg-neutral-900">
                  <img
                    loading="lazy"
                    decoding="async"
                    src={avatarUrl}
                    alt={fullName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowAvatarPreview(false)}
                  className="absolute top-2 right-2 p-2 bg-black/60 hover:bg-black/85 text-white rounded-full transition-all cursor-pointer z-20 shadow-lg border border-white/10 flex items-center justify-center"
                  style={{ fontSize: 20 }}
                >
                  <FiX />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

