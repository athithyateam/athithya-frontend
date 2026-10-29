"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, Compass, Info, Shield, HelpCircle, Users, Briefcase, Lock, LogOut, User, MessageSquare, Plus } from "lucide-react";
import { routes } from "@/config/navigation";
import { useAuthStore } from "@/stores/auth-store";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navLinks = [
  { href: routes.about, label: "About Us", icon: Info },
  { href: routes.howItWorks, label: "How It Works", icon: Compass },
  { href: routes.host, label: "For Hosts", icon: Briefcase },
  { href: routes.creators, label: "For Creators", icon: Users },
  { href: routes.safety, label: "Safety Center", icon: Shield },
  { href: routes.support, label: "Help & Support", icon: HelpCircle },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { user, openAuthModal, logout } = useAuthStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[10005] backdrop-blur-xs"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-[300px] bg-white dark:bg-neutral-950 shadow-2xl z-[10006] flex flex-col border-l border-neutral-200 dark:border-neutral-800"
          >
            <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <h2 className="text-xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
                Menu
              </h2>
              <button
                type="button"
                onClick={onClose}
                className="p-2.5 bg-neutral-100 dark:bg-neutral-800 rounded-full text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-6 px-3">
              {/* User Profile Card */}
              {user && (
                <Link
                  href={`/profile/${user.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3.5 p-3.5 mb-4 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 hover:border-[#C59A2F]/40 transition-all group text-left"
                >
                  <div className="w-12 h-12 rounded-full bg-[#C59A2F] text-white flex items-center justify-center font-black text-lg shrink-0 shadow-xs">
                    {(user.firstname?.charAt(0) || "U").toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100 truncate group-hover:text-[#C59A2F] transition-colors">
                      {user.firstname} {user.lastname}
                    </div>
                    <span className="text-[10px] font-black text-[#C59A2F] uppercase tracking-wider block mt-0.5">
                      {user.role}
                    </span>
                  </div>
                </Link>
              )}

              <nav className="flex flex-col gap-1">
                {user && (
                  <>
                    <Link
                      href={`/profile/${user.id}`}
                      onClick={onClose}
                      className="flex items-center gap-3.5 px-4 py-2.5 text-neutral-700 dark:text-neutral-300 hover:bg-amber-50/50 dark:hover:bg-neutral-900 hover:text-[#C59A2F] font-bold rounded-2xl transition-colors text-sm"
                    >
                      <User className="w-4 h-4 text-[#C59A2F]" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href={routes.chat}
                      onClick={onClose}
                      className="flex items-center gap-3.5 px-4 py-2.5 text-neutral-700 dark:text-neutral-300 hover:bg-amber-50/50 dark:hover:bg-neutral-900 hover:text-[#C59A2F] font-bold rounded-2xl transition-colors text-sm"
                    >
                      <MessageSquare className="w-4 h-4 text-[#C59A2F]" />
                      <span>Messages</span>
                    </Link>
                    {(user.role === "host" || user.role === "admin") && (
                      <Link
                        href="/post"
                        onClick={onClose}
                        className="flex items-center gap-3.5 px-4 py-2.5 text-neutral-700 dark:text-neutral-300 hover:bg-amber-50/50 dark:hover:bg-neutral-900 hover:text-[#C59A2F] font-bold rounded-2xl transition-colors text-sm"
                      >
                        <Plus className="w-4 h-4 text-[#C59A2F]" />
                        <span>Add Experience</span>
                      </Link>
                    )}
                    <div className="h-px bg-neutral-100 dark:bg-neutral-800 my-2 mx-2" />
                  </>
                )}

                {navLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-3.5 px-4 py-2.5 text-neutral-600 dark:text-neutral-400 hover:bg-amber-50/50 dark:hover:bg-neutral-900 hover:text-[#C59A2F] dark:hover:text-[#C59A2F] font-bold rounded-2xl transition-colors text-sm"
                    >
                      <Icon className="w-4 h-4 opacity-60 text-[#C59A2F]" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="p-6 border-t border-neutral-100 dark:border-neutral-800">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    logout();
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-full font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    openAuthModal("login");
                  }}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-[#C59A2F] text-white rounded-full shadow-md hover:bg-[#A67F26] transition-all font-black text-xs uppercase tracking-wider cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Login / Sign Up</span>
                </button>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
