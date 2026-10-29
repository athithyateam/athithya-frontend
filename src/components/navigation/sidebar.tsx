"use client";

import React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdClose,
  MdExplore,
  MdGroups,
  MdInfo,
  MdSecurity,
  MdHelp,
  MdBusiness,
} from "react-icons/md";
import { useAuthStore } from "@/stores/auth-store";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, openAuthModal } = useAuthStore();

  const avatarUrl =
    typeof user?.avatar === "string"
      ? user.avatar
      : user?.avatar?.url || user?.profilePic;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[10005] backdrop-blur-sm"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[300px] bg-white dark:bg-neutral-950 shadow-2xl dark:shadow-none z-[10006] flex flex-col transition-colors"
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-50 dark:border-neutral-800 flex items-center justify-between transition-colors">
              <h2 className="text-xl font-black text-neutral-800 dark:text-neutral-100 tracking-tight transition-colors">
                Menu
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-3 bg-neutral-50 dark:bg-neutral-800 rounded-full transition-all text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 active:scale-95 z-[150] relative cursor-pointer"
                aria-label="Close menu"
              >
                <MdClose size={24} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto py-6">
              {user && (
                <Link
                  href={`/profile/${(user as any)._id || user.id}`}
                  onClick={onClose}
                  className="flex items-center gap-4 px-6 py-4 mb-6 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors group mx-2 rounded-2xl border border-transparent hover:border-yellow-50 dark:hover:border-neutral-700"
                >
                  <div className="w-14 h-14 rounded-full bg-[#C59A2F] text-white border border-[#b48820] flex items-center justify-center font-black text-xl shrink-0 overflow-hidden shadow-sm transition-colors">
                    {avatarUrl ? (
                      <img
                        loading="lazy"
                        decoding="async"
                        src={avatarUrl}
                        alt="avatar"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      (user.firstname?.charAt(0) || "U").toUpperCase()
                    )}
                  </div>

                  <div className="overflow-hidden flex flex-col justify-center items-start text-left">
                    <div className="font-black text-neutral-800 dark:text-neutral-100 truncate group-hover:text-[#C59A2F] transition-colors capitalize leading-tight">
                      {user.firstname} {user.lastname}
                    </div>
                    <div className="text-[10px] font-black text-[#C59A2F] uppercase tracking-widest mt-1 text-left">
                      {user.role || "Traveler"}
                    </div>
                  </div>
                </Link>
              )}

              <nav className="flex flex-col gap-1 px-2">
                <SidebarLink
                  to="/about"
                  label="About Us"
                  icon={<MdInfo size={20} />}
                  onClose={onClose}
                />
                <SidebarLink
                  to="/how-it-works"
                  label="How It Works"
                  icon={<MdExplore size={20} />}
                  onClose={onClose}
                />
                <SidebarLink
                  to="/host"
                  label="For Hosts"
                  icon={<MdBusiness size={20} />}
                  onClose={onClose}
                />
                <SidebarLink
                  to="/creators"
                  label="For Creators"
                  icon={<MdGroups size={20} />}
                  onClose={onClose}
                />
                <SidebarLink
                  to="/safety"
                  label="Safety Center"
                  icon={<MdSecurity size={20} />}
                  onClose={onClose}
                />
                <SidebarLink
                  to="/support"
                  label="Help & Support"
                  icon={<MdHelp size={20} />}
                  onClose={onClose}
                />

                {user && (
                  <>
                    <div className="h-px bg-neutral-50 dark:bg-neutral-800 my-2 mx-4 transition-colors" />

                    {user.role === "admin" && (
                      <SidebarLink
                        to="/admin"
                        label="Admin Panel"
                        icon={<MdSecurity size={20} />}
                        onClose={onClose}
                      />
                    )}
                  </>
                )}
              </nav>
            </div>

            {/* Footer / Auth */}
            {!user && (
              <div className="p-6 border-t border-neutral-50 dark:border-neutral-800 mb-4 transition-colors">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openAuthModal("login");
                  }}
                  className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[#C59A2F] text-white rounded-2xl shadow-xl shadow-yellow-100 dark:shadow-none transition-all font-black text-sm uppercase tracking-widest hover:bg-[#A67F26] transform active:scale-95 cursor-pointer"
                >
                  Login / Sign Up
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function SidebarLink({
  to,
  label,
  icon,
  onClose,
}: {
  to: string;
  label: string;
  icon: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <Link
      href={to}
      onClick={onClose}
      className="flex items-center gap-4 px-6 py-4 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-[#C59A2F] dark:hover:text-[#C59A2F] transition-all font-bold rounded-2xl"
    >
      {icon && <span className="opacity-40">{icon}</span>}
      <span className="text-sm">{label}</span>
    </Link>
  );
}
