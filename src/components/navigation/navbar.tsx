"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, User, Bell, MessageSquare, Plus } from "lucide-react";
import { routes } from "@/config/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { ThemeToggle } from "./theme-toggle";
import { Sidebar } from "./sidebar";
import { AuthModal } from "@/components/auth/auth-modal";
import { UserMenuDropdown } from "./user-menu-dropdown";
import { NotificationDropdown } from "./notification-dropdown";

export function Navbar() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);

  const { user, openAuthModal } = useAuthStore();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const navClass =
    isHome && !scrolled
      ? "bg-transparent text-white"
      : "bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-xs border-b border-neutral-100 dark:border-neutral-800 text-neutral-900 dark:text-neutral-100";

  const textColor =
    isHome && !scrolled
      ? "text-white hover:text-[#C59A2F]"
      : "text-neutral-900 dark:text-neutral-100 hover:text-[#C59A2F]";

  const pillBorder =
    isHome && !scrolled
      ? "border-white/40 bg-black/20 hover:bg-black/30 backdrop-blur-xs text-white"
      : "border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[999] transition-all duration-300 ${navClass} py-3 md:py-4`}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <Link href={routes.home} className="flex items-center gap-2 select-none group">
            <Image
              src="/logo.png"
              alt="Athithya Logo"
              width={140}
              height={44}
              className="h-9 sm:h-10 md:h-11 w-auto object-contain transition-transform group-hover:scale-102"
              priority
            />
          </Link>

          {/* Right Actions */}
          <div className="flex items-center gap-3 sm:gap-4 md:gap-5">
            {/* Theme Toggle */}
            <ThemeToggle />

            {user ? (
              <>
                {/* Notification Bell */}
                <div className="relative flex items-center">
                  <button
                    type="button"
                    onClick={() => {
                      setNotificationOpen(!notificationOpen);
                      setUserMenuOpen(false);
                    }}
                    className={`p-2 rounded-full hover:scale-110 active:scale-95 transition-all relative flex items-center cursor-pointer ${textColor}`}
                    aria-label="Notifications"
                    title="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                  </button>
                  <NotificationDropdown
                    isOpen={notificationOpen}
                    onClose={() => setNotificationOpen(false)}
                    unreadCount={0}
                  />
                </div>

                {/* Message / Chat Link */}
                <Link
                  href={routes.chat}
                  className={`p-2 rounded-full hover:scale-110 active:scale-95 transition-all hidden sm:flex items-center cursor-pointer ${textColor}`}
                  title="Messages & Chat"
                  aria-label="Messages & Chat"
                >
                  <MessageSquare className="w-5 h-5" />
                </Link>

                {/* Host / Admin Add Experience Button */}
                {(user.role === "host" || user.role === "admin") && (
                  <Link
                    href="/post"
                    className="p-2 rounded-full bg-[#C59A2F] text-white shadow-md hover:bg-[#A67F26] hover:scale-105 active:scale-95 transition flex items-center justify-center cursor-pointer"
                    title={user.role === "admin" ? "Add Content" : "Add Experience"}
                    aria-label="Add Experience"
                  >
                    <Plus className="w-5 h-5" />
                  </Link>
                )}

                {/* Profile Pill with Dropdown & Hamburger */}
                <div className="relative flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setUserMenuOpen(!userMenuOpen);
                      setNotificationOpen(false);
                    }}
                    className={`flex items-center gap-2 p-1.5 rounded-full border transition cursor-pointer ${pillBorder}`}
                    aria-label="User menu"
                    aria-expanded={userMenuOpen}
                  >
                    <Menu className="w-5 h-5" />
                    <div className="w-7 h-7 rounded-full overflow-hidden flex items-center justify-center bg-[#C59A2F] text-white text-xs font-black uppercase shadow-xs">
                      {(user.firstname?.charAt(0) || "U").toUpperCase()}
                    </div>
                  </button>

                  <UserMenuDropdown
                    isOpen={userMenuOpen}
                    onClose={() => setUserMenuOpen(false)}
                  />
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                {/* User Icon Button -> Opens Login/Signup Modal */}
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  className={`p-2 rounded-full hover:scale-110 active:scale-95 transition-all group cursor-pointer ${textColor}`}
                  aria-label="Login or Sign Up"
                  title="Login / Sign Up"
                >
                  <User className="w-6 h-6 group-hover:text-[#C59A2F] transition-colors" />
                </button>

                {/* Hamburger Menu -> Opens Full Sidebar */}
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className={`p-2 rounded-full hover:scale-110 active:scale-95 transition-all cursor-pointer ${textColor}`}
                  aria-label="Open menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Global Auth Modal */}
      <AuthModal />
    </>
  );
}
