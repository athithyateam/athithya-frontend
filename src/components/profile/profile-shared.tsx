"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
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
  FiShield,
  FiCreditCard,
  FiX,
} from "react-icons/fi";
import { FaStar, FaRegStar, FaStarHalfAlt } from "react-icons/fa";

export const GOLD = "#C59A2F";
export const DEFAULT_THEME_KEY = "mountain";

export interface ProfileTheme {
  key: string;
  label: string;
  emoji: string;
  image: string | null;
  overlay: string | null;
  textColor: string | null;
  subColor: string | null;
  accentBorder: string | null;
  divider: string | null;
}

export const PROFILE_THEMES: ProfileTheme[] = [
  {
    key: "trekking",
    label: "Trekking",
    emoji: "🥾",
    image: "/images/trek/trek-1.jpeg",
    overlay:
      "linear-gradient(175deg, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.60) 100%)",
    textColor: "#ffffff",
    subColor: "rgba(255,255,255,0.70)",
    accentBorder: "rgba(255,255,255,0.18)",
    divider: "rgba(255,255,255,0.10)",
  },
  {
    key: "rafting",
    label: "Rafting",
    emoji: "🚣",
    image: "/images/rafting/rafting-2.jpeg",
    overlay:
      "linear-gradient(175deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.58) 100%)",
    textColor: "#ffffff",
    subColor: "rgba(255,255,255,0.70)",
    accentBorder: "rgba(255,255,255,0.18)",
    divider: "rgba(255,255,255,0.10)",
  },
  {
    key: "camping",
    label: "Camping",
    emoji: "⛺",
    image: "/images/camping/camping-1.jpeg",
    overlay:
      "linear-gradient(175deg, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.62) 100%)",
    textColor: "#ffffff",
    subColor: "rgba(255,255,255,0.70)",
    accentBorder: "rgba(255,255,255,0.18)",
    divider: "rgba(255,255,255,0.10)",
  },
  {
    key: "bungee",
    label: "Bungee",
    emoji: "🪂",
    image: "/images/bungee/bungee-1.jpeg",
    overlay:
      "linear-gradient(175deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.58) 100%)",
    textColor: "#ffffff",
    subColor: "rgba(255,255,255,0.70)",
    accentBorder: "rgba(255,255,255,0.18)",
    divider: "rgba(255,255,255,0.10)",
  },
  {
    key: "paragliding",
    label: "Paragliding",
    emoji: "🪂",
    image: "/images/paragliding/paragliding-3.jpeg",
    overlay:
      "linear-gradient(175deg, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.56) 100%)",
    textColor: "#ffffff",
    subColor: "rgba(255,255,255,0.70)",
    accentBorder: "rgba(255,255,255,0.18)",
    divider: "rgba(255,255,255,0.10)",
  },
  {
    key: "safari",
    label: "Safari",
    emoji: "🚙",
    image:
      "https://athithya-app-bucket.s3.eu-north-1.amazonaws.com/posts/1000049861-353bfc2d-3a72-4054-8275-d3ab12b245d9.webp",
    overlay:
      "linear-gradient(175deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.58) 100%)",
    textColor: "#ffffff",
    subColor: "rgba(255,255,255,0.70)",
    accentBorder: "rgba(255,255,255,0.18)",
    divider: "rgba(255,255,255,0.10)",
  },
  {
    key: "mountain",
    label: "Mountain",
    emoji: "🏔️",
    image:
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1920&auto=format&fit=crop",
    overlay:
      "linear-gradient(175deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.62) 100%)",
    textColor: "#ffffff",
    subColor: "rgba(255,255,255,0.65)",
    accentBorder: "rgba(255,255,255,0.15)",
    divider: "rgba(255,255,255,0.08)",
  },
  {
    key: "forest",
    label: "Forest",
    emoji: "🌲",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=1920&auto=format&fit=crop",
    overlay:
      "linear-gradient(175deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.60) 100%)",
    textColor: "#ffffff",
    subColor: "rgba(255,255,255,0.65)",
    accentBorder: "rgba(255,255,255,0.15)",
    divider: "rgba(255,255,255,0.08)",
  },
  {
    key: "beach",
    label: "Beach",
    emoji: "🏖️",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1920&auto=format&fit=crop",
    overlay:
      "linear-gradient(175deg, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.55) 100%)",
    textColor: "#ffffff",
    subColor: "rgba(255,255,255,0.65)",
    accentBorder: "rgba(255,255,255,0.15)",
    divider: "rgba(255,255,255,0.08)",
  },
  {
    key: "sunset",
    label: "Sunset",
    emoji: "🌅",
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1920&auto=format&fit=crop",
    overlay:
      "linear-gradient(175deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.58) 100%)",
    textColor: "#ffffff",
    subColor: "rgba(255,255,255,0.65)",
    accentBorder: "rgba(255,255,255,0.15)",
    divider: "rgba(255,255,255,0.08)",
  },
  {
    key: "classic",
    label: "Classic",
    emoji: "✦",
    image: null,
    overlay: null,
    textColor: null,
    subColor: null,
    accentBorder: null,
    divider: null,
  },
];

export function StarRatingDisplay({
  rating,
  size = 14,
}: {
  rating: number;
  size?: number;
}) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        if (rating >= i)
          return <FaStar key={i} size={size} style={{ color: GOLD }} />;
        if (rating >= i - 0.5)
          return <FaStarHalfAlt key={i} size={size} style={{ color: GOLD }} />;
        return (
          <FaRegStar
            key={i}
            size={size}
            style={{ color: GOLD, opacity: 0.3 }}
          />
        );
      })}
    </div>
  );
}

export function InteractiveStars({
  selected,
  hover,
  onHover,
  onLeave,
  onSelect,
  disabled,
}: {
  selected: number;
  hover: number;
  onHover: (val: number) => void;
  onLeave: () => void;
  onSelect: (val: number) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex gap-1.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = (hover || selected) >= i;
        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            onMouseEnter={() => onHover(i)}
            onMouseLeave={onLeave}
            onClick={() => onSelect(i)}
            className="transition-transform hover:scale-125 active:scale-95 disabled:cursor-not-allowed cursor-pointer"
          >
            <FaStar
              size={22}
              style={{
                color: filled ? GOLD : "rgba(197,154,47,0.2)",
                transition: "color 0.15s",
              }}
            />
          </button>
        );
      })}
    </div>
  );
}

export function StatPill({
  icon: Icon,
  value,
  label,
  isThemed,
  theme,
  onClick,
}: {
  icon?: React.ComponentType<{ size?: number; style?: React.CSSProperties }>;
  value: React.ReactNode;
  label: string;
  isThemed?: boolean;
  theme?: ProfileTheme;
  onClick?: () => void;
}) {
  const base = `flex flex-col items-center justify-center gap-1 px-5 py-3 rounded-2xl transition-all ${
    onClick ? "cursor-pointer hover:scale-105 active:scale-95" : ""
  }`;
  const style: React.CSSProperties = isThemed
    ? {
        background: "transparent",
        border: `1px solid ${theme?.accentBorder || "rgba(255,255,255,0.14)"}`,
      }
    : {
        background: "var(--pill-bg, rgba(197,154,47,0.06))",
        border: "1px solid var(--pill-border, rgba(197,154,47,0.14))",
      };
  return (
    <div className={base} style={style} onClick={onClick}>
      {Icon && <Icon size={14} style={{ color: GOLD }} />}
      <span
        className="text-base font-black leading-none text-neutral-900 dark:text-neutral-100"
        style={isThemed ? { color: "#ffffff" } : undefined}
      >
        {value}
      </span>
      <span
        className="text-[9px] font-black uppercase tracking-[0.18em]"
        style={{ color: isThemed ? "rgba(255,255,255,0.88)" : "#aaa" }}
      >
        {label}
      </span>
    </div>
  );
}

export function TabBar({
  tabs,
  activeTab,
  setActiveTab,
  isThemed,
}: {
  tabs: Array<{
    key: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
  }>;
  activeTab: string;
  setActiveTab: (key: string) => void;
  isThemed?: boolean;
  theme?: ProfileTheme;
}) {
  return (
    <div
      className="flex gap-1 p-1.5 rounded-2xl overflow-x-auto scrollbar-hide"
      style={
        isThemed
          ? {
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.14)",
            }
          : {
              background: "var(--tab-bar-bg, rgba(0,0,0,0.04))",
              border: "1px solid var(--tab-bar-border, rgba(0,0,0,0.06))",
            }
      }
    >
      {tabs.map(({ key, label, icon: Icon }) => {
        const active = activeTab === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`relative flex items-center gap-1.5 md:gap-2 px-3 md:px-5 py-2.5 rounded-xl text-[9px] md:text-xs font-black uppercase tracking-wider md:tracking-widest transition-all duration-150 flex-1 md:flex-initial justify-center z-10 whitespace-nowrap min-w-max cursor-pointer ${
              active
                ? "text-white shadow-md shadow-[#C59A2F]/25"
                : isThemed
                ? "text-white/85 hover:text-white"
                : "text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
            }`}
            style={active ? { background: GOLD } : undefined}
          >
            <Icon size={13} className="relative z-20" />
            <span className="relative z-20">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

export function EmptyState({
  label,
  isThemed,
  theme,
}: {
  label: string;
  isThemed?: boolean;
  theme?: ProfileTheme;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="col-span-full py-20 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed"
      style={
        isThemed
          ? {
              borderColor: theme?.divider || "rgba(255,255,255,0.10)",
              background: "rgba(255,255,255,0.02)",
            }
          : {
              borderColor: "var(--empty-state-border, #ebebeb)",
              background: "var(--empty-state-bg, rgba(250,250,251,0.6))",
            }
      }
    >
      <div className="text-4xl mb-3 opacity-30">✦</div>
      <p
        className="text-xs uppercase tracking-[0.18em] font-black"
        style={{
          color: isThemed
            ? "rgba(255,255,255,0.75)"
            : "var(--tab-inactive, #ccc)",
        }}
      >
        {label}
      </p>
    </motion.div>
  );
}

export function ProfileMenu({
  isOwner,
  isDark,
  onToggleTheme,
  onEditProfile,
  onLogout,
  onDeleteAccount,
  onOpenWallet,
  onAdminPanel,
  isThemed = false,
  visitorThemeOnly = false,
}: {
  isOwner: boolean;
  isDark: boolean;
  onToggleTheme?: () => void;
  onEditProfile: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onOpenWallet?: () => void;
  onAdminPanel?: () => void;
  isThemed?: boolean;
  visitorThemeOnly?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [sub, setSub] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSub(false);
      }
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const close = () => {
    setOpen(false);
    setSub(false);
  };

  const menuBtnStyle: React.CSSProperties = isThemed
    ? { background: "transparent", border: "1px solid rgba(255,255,255,0.22)" }
    : {
        background: "var(--profile-card-bg, rgba(255,255,255,0.92))",
        border: "1px solid var(--profile-card-border, rgba(0,0,0,0.08))",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
      };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
        style={menuBtnStyle}
      >
        <FiMoreVertical
          size={17}
          style={{
            color: isThemed
              ? "rgba(255,255,255,0.90)"
              : "var(--name-color, #374151)",
          }}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.16 }}
            className={`absolute right-0 mt-2 w-52 rounded-2xl py-1.5 z-50 overflow-hidden ${
              isThemed
                ? "border border-white/18 shadow-2xl"
                : "bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 shadow-xl"
            }`}
            style={
              isThemed
                ? {
                    background: "rgba(18,18,22,0.88)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.22)",
                    boxShadow: "0 16px 40px rgba(0, 0, 0, 0.3)",
                  }
                : undefined
            }
          >
            {isOwner ? (
              <>
                {onAdminPanel && (
                  <MenuItem
                    icon={<FiShield size={13} style={{ color: GOLD }} />}
                    label="Admin Panel"
                    onClick={() => {
                      onAdminPanel();
                      close();
                    }}
                    isThemed={isThemed}
                  />
                )}
                <MenuItem
                  icon={<FiEdit2 size={13} style={{ color: GOLD }} />}
                  label="Edit Profile"
                  onClick={() => {
                    onEditProfile();
                    close();
                  }}
                  isThemed={isThemed}
                />
                {onOpenWallet && (
                  <MenuItem
                    icon={<FiCreditCard size={13} style={{ color: GOLD }} />}
                    label="My Wallet"
                    onClick={() => {
                      onOpenWallet();
                      close();
                    }}
                    isThemed={isThemed}
                  />
                )}
                <MenuItem
                  icon={<FiSettings size={13} style={{ color: GOLD }} />}
                  label="Settings"
                  arrow
                  onClick={() => setSub((s) => !s)}
                  isThemed={isThemed}
                />
                <AnimatePresence>
                  {sub && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className={`overflow-hidden ${
                        isThemed
                          ? ""
                          : "bg-neutral-50/50 dark:bg-neutral-950/30"
                      }`}
                      style={
                        isThemed
                          ? { background: "rgba(255,255,255,0.06)" }
                          : undefined
                      }
                    >
                      <SubMenuItem
                        icon={
                          isDark ? (
                            <FiSun size={11} style={{ color: GOLD }} />
                          ) : (
                            <FiMoon size={11} style={{ color: GOLD }} />
                          )
                        }
                        label={isDark ? "Light Mode" : "Dark Mode"}
                        onClick={() => {
                          onToggleTheme?.();
                          close();
                        }}
                        isThemed={isThemed}
                      />
                      <SubMenuItem
                        icon={<FiTrash2 size={11} className="text-red-400" />}
                        label="Delete Account"
                        onClick={() => {
                          onDeleteAccount();
                          close();
                        }}
                        danger
                        isThemed={isThemed}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
                <div
                  className={`mx-3 my-1 h-px ${
                    isThemed ? "" : "bg-neutral-100 dark:bg-neutral-800"
                  }`}
                  style={
                    isThemed
                      ? { background: "rgba(255,255,255,0.12)" }
                      : undefined
                  }
                />
                <MenuItem
                  icon={<FiLogOut size={13} className="text-red-400" />}
                  label="Logout"
                  onClick={() => {
                    onLogout();
                    close();
                  }}
                  danger
                  isThemed={isThemed}
                />
              </>
            ) : visitorThemeOnly ? (
              <>
                <MenuItem
                  icon={<FiSettings size={13} style={{ color: GOLD }} />}
                  label="Settings"
                  arrow
                  onClick={() => setSub((s) => !s)}
                  isThemed={isThemed}
                />
                <AnimatePresence>
                  {sub && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden bg-neutral-50/50 dark:bg-neutral-950/30"
                    >
                      <SubMenuItem
                        icon={
                          isDark ? (
                            <FiSun size={11} style={{ color: GOLD }} />
                          ) : (
                            <FiMoon size={11} style={{ color: GOLD }} />
                          )
                        }
                        label={isDark ? "Light Mode" : "Dark Mode"}
                        onClick={() => {
                          onToggleTheme?.();
                          close();
                        }}
                        isThemed={isThemed}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </>
            ) : (
              <>
                <MenuItem
                  icon={<FiUserX size={13} className="text-amber-400" />}
                  label="Block User"
                  onClick={close}
                  isThemed={isThemed}
                />
                <MenuItem
                  icon={<FiFlag size={13} className="text-red-400" />}
                  label="Report"
                  onClick={close}
                  danger
                  isThemed={isThemed}
                />
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  arrow,
  danger,
  isThemed = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  arrow?: boolean;
  danger?: boolean;
  isThemed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full px-4 py-2.5 text-left text-sm font-semibold flex items-center gap-3 transition-all cursor-pointer ${
        isThemed
          ? `hover:bg-white/10 ${
              danger ? "text-red-400" : "text-white hover:text-white"
            }`
          : `${
              danger
                ? "text-red-500 hover:bg-red-50/50 dark:hover:bg-red-950/20"
                : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            }`
      }`}
    >
      {icon} {label}
      {arrow && (
        <span
          className={`ml-auto text-base ${
            isThemed ? "text-white/60" : "text-neutral-400 dark:text-neutral-500"
          }`}
        >
          ›
        </span>
      )}
    </button>
  );
}

function SubMenuItem({
  icon,
  label,
  suffix,
  onClick,
  danger,
  isThemed = false,
}: {
  icon: React.ReactNode;
  label: string;
  suffix?: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
  isThemed?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full px-6 py-2 text-left text-xs font-semibold flex items-center gap-2.5 transition-all cursor-pointer ${
        isThemed
          ? `hover:bg-white/10 ${
              danger ? "text-red-400/90" : "text-white hover:text-white"
            }`
          : `${
              danger
                ? "text-red-400 hover:bg-red-50/50 dark:hover:bg-red-950/20"
                : "text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800"
            }`
      }`}
    >
      {icon} {label} {suffix && <span className="ml-auto">{suffix}</span>}
    </button>
  );
}

export function AwardLaurel({
  className = "w-8 sm:w-10 h-16 sm:h-20",
  flip = false,
}: {
  className?: string;
  flip?: boolean;
}) {
  const id = flip ? "laurel-grad-r" : "laurel-grad-l";
  return (
    <svg
      viewBox="0 0 48 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${flip ? "scale-x-[-1]" : ""}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={id} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCD34D" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#C59A2F" />
        </linearGradient>
      </defs>
      <path
        d="M26 6 C20 6 15 12 17 20 C22 22 28 19 29 13 C29 9 28 6 26 6Z"
        fill={`url(#${id})`}
      />
      <path
        d="M17 21 C11 22 7 28 9 36 C15 38 21 34 22 27 C22 23 20 21 17 21Z"
        fill={`url(#${id})`}
      />
      <path
        d="M12 37 C6 39 3 46 6 54 C12 56 18 51 18 44 C18 39 15 37 12 37Z"
        fill={`url(#${id})`}
      />
      <path
        d="M11 55 C6 58 4 66 8 73 C14 74 20 69 19 62 C19 57 15 55 11 55Z"
        fill={`url(#${id})`}
      />
      <path
        d="M15 72 C11 76 11 84 16 88 C21 87 26 81 24 75 C23 71 18 70 15 72Z"
        fill={`url(#${id})`}
      />
      <path
        d="M23 85 C27 90 33 92 37 89 C39 87 39 84 35 83 C31 82 28 83 24 81"
        stroke={`url(#${id})`}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AvatarPreviewModal({
  isOpen,
  onClose,
  avatarUrl,
  fullName,
  initials,
}: {
  isOpen: boolean;
  onClose: () => void;
  avatarUrl: string;
  fullName: string;
  initials: string;
}) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative max-w-lg w-full aspect-square rounded-3xl overflow-hidden shadow-2xl border border-white/10"
            onClick={(e) => e.stopPropagation()}
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white text-8xl font-black"
                style={{
                  background: `linear-gradient(135deg, ${GOLD}, #9e761d)`,
                }}
              >
                {initials}
              </div>
            )}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 p-3 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all backdrop-blur-md cursor-pointer"
            >
              <FiX size={20} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function DeleteAccountModal({
  isOpen,
  onClose,
  onConfirm,
  deleting,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  deleting: boolean;
}) {
  if (typeof document === "undefined") return null;
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.94 }}
            className="rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800"
          >
            <div className="w-14 h-14 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiTrash2 size={24} />
            </div>
            <h3 className="text-lg font-black text-neutral-900 dark:text-neutral-100 mb-2">
              Delete Account?
            </h3>
            <p className="text-xs text-neutral-400 mb-7 leading-relaxed">
              This will permanently remove your account and all data. Cannot be
              undone.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={deleting}
                className="flex-1 py-2.5 rounded-full bg-red-500 hover:bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-lg transition-all cursor-pointer"
              >
                {deleting ? "Deleting…" : "Delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

