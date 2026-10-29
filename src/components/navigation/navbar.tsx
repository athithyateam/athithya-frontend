"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { FaBell, FaSun, FaMoon } from "react-icons/fa";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { MdAdd } from "react-icons/md";
import { RxHamburgerMenu } from "react-icons/rx";
import { HiOutlineUserCircle } from "react-icons/hi";
import { routes } from "@/config/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { useNotificationStore } from "@/stores/notification-store";
import { useChatStore } from "@/stores/chat-store";
import { useThemeStore } from "@/stores/theme-store";
import { getOptimizedImage } from "@/lib/image-helper";
import { Sidebar } from "./sidebar";
import { AuthModal } from "@/components/auth/auth-modal";
import { HostStatusModal } from "@/components/auth/host-status-modal";
import { HostVerificationModal } from "@/components/auth/host-verification-modal";
import { NotificationDropdown } from "./notification-dropdown";

function NavbarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const bellRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    user,
    openAuthModal,
    fetchUser,
    logout,
    showHostStatusModal,
    setShowHostStatusModal,
    showVerificationModal,
    setShowVerificationModal,
  } = useAuthStore();
  const { unreadCount, fetchNotifications } = useNotificationStore();
  const { totalUnread } = useChatStore();
  const { theme, toggleTheme } = useThemeStore();
  const isDarkMode = theme === "dark";

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  useEffect(() => {
    if (user) fetchNotifications();
  }, [user, fetchNotifications]);

  useEffect(() => {
    const handleUnauthorized = () => logout();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === "auth_token" && !e.newValue) logout();
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    window.addEventListener("storage", handleStorage);
    return () => {
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
      window.removeEventListener("storage", handleStorage);
    };
  }, [logout]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  const handleAddClick = () => {
    if (!user) return openAuthModal("login");
    if (user.role === "admin") {
      router.push("/post");
      return;
    }
    if (user.hostStatus === "approved") {
      router.push("/post");
    } else {
      setShowHostStatusModal(true);
    }
  };

  const navBase = "fixed inset-x-0 top-0 z-[999] transition-all duration-300";
  const heroNav = scrolled
    ? "bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md shadow-sm border-b border-neutral-100 dark:border-neutral-800"
    : "bg-transparent";
  const contentNav =
    "bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800";

  const textColor =
    isHome && !scrolled
      ? "text-white hover:text-yellow-300"
      : "text-neutral-900 dark:text-neutral-100";

  const pillBorder =
    isHome && !scrolled
      ? "border-white/40 bg-black/20 hover:bg-black/30 backdrop-blur-sm text-white"
      : "border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-900 dark:text-neutral-100";

  const avatarUrl =
    typeof user?.avatar === "string"
      ? user.avatar
      : user?.avatar?.url || user?.profilePic;

  return (
    <>
      <nav
        className={`${navBase} ${
          isHome ? heroNav : contentNav
        } py-3 md:py-4`}
      >
        <div className="max-w-[1400px] mx-auto px-5 md:px-8 flex items-center justify-between">
          {/* LOGO */}
          <Link href={routes.home} className="flex items-center">
            <Image
              src="/logo.png"
              alt="Athithya Logo"
              width={140}
              height={48}
              className="h-10 sm:h-11 md:h-12 lg:h-[3.25rem] w-auto object-contain transition-all"
              priority
            />
          </Link>

          {/* RIGHT ACTIONS */}
          <div className="flex items-center gap-4 md:gap-6">
            {/* Theme Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              className={`${textColor} hover:scale-110 transition-all active:scale-95 cursor-pointer`}
              title="Toggle Theme"
            >
              {mounted && isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
            </button>

            {mounted && user ? (
              <>
                {/* Notification Bell */}
                <div className="relative flex items-center">
                  <button
                    ref={bellRef}
                    type="button"
                    onClick={() => setNotificationOpen(!notificationOpen)}
                    className={`${textColor} hover:scale-105 transition relative flex items-center cursor-pointer`}
                  >
                    <FaBell size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <NotificationDropdown
                    isOpen={notificationOpen}
                    onClose={() => setNotificationOpen(false)}
                  />
                </div>

                {/* Message / Chat Icon */}
                <button
                  type="button"
                  onClick={() => router.push("/chat")}
                  className={`${textColor} hover:scale-105 hover:text-[#C59A2F] transition-all hidden md:flex items-center relative p-1 cursor-pointer`}
                  title="Messages"
                >
                  <IoChatbubbleEllipsesOutline size={22} />
                  {totalUnread > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] min-w-4 h-4 px-1 rounded-full flex items-center justify-center font-bold shadow-sm ring-2 ring-white dark:ring-neutral-900">
                      {totalUnread > 99 ? "99+" : totalUnread}
                    </span>
                  )}
                </button>

                {/* Host Add Experience Button */}
                {(user.role === "host" || user.role === "admin") && (
                  <button
                    type="button"
                    onClick={handleAddClick}
                    className="p-2 rounded-full bg-[#C59A2F] text-white shadow-md hover:bg-[#A67F26] hover:scale-105 transition flex items-center justify-center cursor-pointer"
                    title={
                      user.role === "admin" ? "Add Content" : "Add Experience"
                    }
                  >
                    <MdAdd size={20} />
                  </button>
                )}

                {/* Profile / Hamburger for Sidebar */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(true)}
                    className={`flex items-center gap-2 p-1.5 rounded-full border transition cursor-pointer ${pillBorder}`}
                  >
                    <RxHamburgerMenu size={20} />
                    <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-100 hidden sm:block dark:border-neutral-800 transition-colors">
                      {avatarUrl ? (
                        <img
                          loading="lazy"
                          decoding="async"
                          src={getOptimizedImage(avatarUrl, {
                            width: 80,
                            height: 80,
                          })}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#C59A2F] text-white border border-[#b48820] text-[10px] font-bold uppercase transition-colors">
                          {user.firstname?.charAt(0) || "U"}
                        </div>
                      )}
                    </div>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  className={`p-2 ${textColor} hover:scale-110 transition-all active:scale-95 group relative cursor-pointer`}
                  aria-label="Login"
                >
                  <HiOutlineUserCircle
                    size={28}
                    className="group-hover:text-[#C59A2F] transition-colors"
                  />
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className={`p-2 ${textColor} hover:scale-110 transition-all active:scale-95 cursor-pointer`}
                >
                  <RxHamburgerMenu size={24} />
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <AuthModal />

      {user && showHostStatusModal && (
        <HostStatusModal
          status={user.hostStatus}
          onClose={() => setShowHostStatusModal(false)}
          onAction={() => {
            setShowHostStatusModal(false);
            if (user.hostStatus === "approved") router.push("/post");
            else if (user.hostStatus !== "pending_approval")
              setShowVerificationModal(true);
          }}
        />
      )}

      {user && showVerificationModal && (
        <HostVerificationModal
          onClose={() => setShowVerificationModal(false)}
        />
      )}
    </>
  );
}

function NavbarSkeleton() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-20 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-800 transition-colors" />
  );
}

export function Navbar() {
  return (
    <Suspense fallback={<NavbarSkeleton />}>
      <NavbarContent />
    </Suspense>
  );
}
