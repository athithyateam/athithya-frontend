"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import {
  User as UserIcon,
  MessageSquare,
  Plus,
  Shield,
  LogOut,
  Info,
  Compass,
  HelpCircle,
  Users,
  Building2,
  Lock,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { routes } from "@/config/navigation";

interface UserMenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserMenuDropdown({ isOpen, onClose }: UserMenuDropdownProps) {
  const { user, logout } = useAuthStore();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen || !user) return null;

  return (
    <div
      ref={menuRef}
      className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/80 dark:border-neutral-800 shadow-2xl p-3 z-[1000] text-left animate-in fade-in slide-in-from-top-2 duration-200"
    >
      {/* User Header Profile Link */}
      <Link
        href={`/profile/${user.id}`}
        onClick={onClose}
        className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 hover:bg-amber-50/50 dark:hover:bg-neutral-800 transition-colors group"
      >
        <div className="w-11 h-11 rounded-full bg-[#C59A2F] text-white flex items-center justify-center font-black text-base shrink-0 shadow-xs">
          {(user.firstname?.charAt(0) || "U").toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-extrabold text-sm text-neutral-900 dark:text-neutral-100 truncate group-hover:text-[#C59A2F] transition-colors capitalize">
            {user.firstname} {user.lastname}
          </div>
          <span className="inline-block px-2 py-0.5 mt-0.5 rounded-full bg-[#C59A2F]/15 text-[#C59A2F] text-[10px] font-black uppercase tracking-wider">
            {user.role || "Traveler"}
          </span>
        </div>
      </Link>

      {/* Main Actions */}
      <div className="py-2 space-y-0.5 text-xs font-bold text-neutral-700 dark:text-neutral-300">
        <Link
          href={`/profile/${user.id}`}
          onClick={onClose}
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-[#C59A2F] transition-colors"
        >
          <UserIcon size={16} className="text-[#C59A2F]" />
          <span>My Profile</span>
        </Link>

        <Link
          href={routes.chat}
          onClick={onClose}
          className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-[#C59A2F] transition-colors"
        >
          <MessageSquare size={16} className="text-[#C59A2F]" />
          <span>Messages & Plans</span>
        </Link>

        {(user.role === "host" || user.role === "admin") && (
          <Link
            href="/post"
            onClick={onClose}
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-[#C59A2F] transition-colors"
          >
            <Plus size={16} className="text-[#C59A2F]" />
            <span>Add Experience</span>
          </Link>
        )}

        {user.role === "admin" && (
          <Link
            href={routes.admin}
            onClick={onClose}
            className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-[#C59A2F] transition-colors"
          >
            <Shield size={16} className="text-[#C59A2F]" />
            <span>Admin Panel</span>
          </Link>
        )}
      </div>

      {/* Athithya Discover Links matching athithya-app */}
      <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 space-y-0.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400">
        <Link
          href={routes.about}
          onClick={onClose}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-[#C59A2F] transition-colors"
        >
          <Info size={15} />
          <span>About Us</span>
        </Link>
        <Link
          href={routes.howItWorks}
          onClick={onClose}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-[#C59A2F] transition-colors"
        >
          <Compass size={15} />
          <span>How It Works</span>
        </Link>
        <Link
          href={routes.host}
          onClick={onClose}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-[#C59A2F] transition-colors"
        >
          <Building2 size={15} />
          <span>For Hosts</span>
        </Link>
        <Link
          href={routes.creators}
          onClick={onClose}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-[#C59A2F] transition-colors"
        >
          <Users size={15} />
          <span>For Creators</span>
        </Link>
        <Link
          href={routes.safety}
          onClick={onClose}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-[#C59A2F] transition-colors"
        >
          <Lock size={15} />
          <span>Safety Center</span>
        </Link>
        <Link
          href={routes.support}
          onClick={onClose}
          className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-[#C59A2F] transition-colors"
        >
          <HelpCircle size={15} />
          <span>Help & Support</span>
        </Link>
      </div>

      {/* Logout */}
      <div className="border-t border-neutral-100 dark:border-neutral-800 pt-2 mt-1">
        <button
          type="button"
          onClick={() => {
            onClose();
            logout();
          }}
          className="flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 text-xs font-bold transition-colors cursor-pointer"
        >
          <LogOut size={16} />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}
