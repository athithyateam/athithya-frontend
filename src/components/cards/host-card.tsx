"use client";

import React from "react";
import { Star, MapPin } from "lucide-react";
import { getOptimizedImage } from "@/lib/image-helper";

const DEFAULT_HOST_AVATAR =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23a3a3a3"/><circle cx="50" cy="35" r="18" fill="%23ffffff"/><path d="M15 85 C 15 62, 85 62, 85 85 Z" fill="%23ffffff"/></svg>';

export interface HostCardProps {
  id?: string;
  image?: string | { url?: string };
  name: string;
  role?: string;
  location?: string;
  tripsHosted?: number;
  rating?: number | string;
  onClick?: () => void;
  className?: string;
  verifyBadge?: { enabled?: boolean };
}

export function HostCard({
  image,
  name,
  location = "Uttarakhand",
  tripsHosted = 0,
  rating,
  onClick,
  className = "",
  verifyBadge,
}: HostCardProps) {
  const rawAvatar = (typeof image === "string" ? image : image?.url) || "";
  const avatarUrl = rawAvatar ? getOptimizedImage(rawAvatar, { width: 800, height: 1000 }) : DEFAULT_HOST_AVATAR;

  return (
    <div
      onClick={onClick}
      className={`group w-full bg-white rounded-[1.2rem] md:rounded-[2rem] overflow-hidden border border-neutral-100 dark:border-neutral-800/80 cursor-pointer shadow-xs hover:shadow-md transition-all duration-300 flex flex-col h-full dark:bg-neutral-900 ${className}`}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 transition-colors">
        <img
          src={avatarUrl}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = DEFAULT_HOST_AVATAR;
          }}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500"
          loading="lazy"
        />
        {Number(rating || 0) > 0 && (
          <div className="absolute top-3 right-3 md:top-4 md:right-4 z-10">
            <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-xs px-2.5 py-1 md:px-3 md:py-1.5 rounded-full flex items-center gap-1 shadow-sm border border-neutral-100/50 dark:border-neutral-800 text-[10px] md:text-xs font-black text-neutral-800 dark:text-neutral-100">
              <Star className="text-yellow-400 fill-yellow-400" size={11} />
              <span>{rating}</span>
            </div>
          </div>
        )}
      </div>
      <div className="p-4 md:p-5 flex flex-col gap-1.5 grow">
        <h3 className="font-extrabold text-neutral-900 dark:text-neutral-100 text-sm md:text-lg leading-snug flex items-center gap-1.5 group-hover:text-[#C59A2F] transition-colors">
          <span className="truncate">{name}</span>
          {verifyBadge?.enabled && (
            <svg className="w-4 h-4 shrink-0 text-[#C59A2F]" viewBox="0 0 24 24" fill="none">
              <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.19.16-.43.25-.9.25-1.39 0-2.25-1.83-4.08-4.08-4.08-.49 0-.96.09-1.39.25C14.32 2.28 13.25 1.5 12 1.5s-2.32.78-2.84 2.09c-.43-.16-.9-.25-1.39-.25-2.25 0-4.08 1.83-4.08 4.08 0 .49.09.96.25 1.39C2.63 9.33 1.75 10.57 1.75 12c0 1.43.88 2.67 2.19 3.19-.16.43-.25.9-.25 1.39 0 2.25 1.83 4.08 4.08 4.08.49 0 .96-.09 1.39-.25.52 1.31 1.59 2.09 2.84 2.09s2.32-.78 2.84-2.09c.43.16.9.25 1.39.25 2.25 0 4.08-1.83 4.08-4.08 0-.49-.09-.96-.25-1.39 1.31-.52 2.09-1.59 2.09-2.84z" fill="currentColor" />
              <path d="M10.22 16.75l-3.32-3.32 1.42-1.42 1.9 1.9 5.68-5.68 1.42 1.42-7.1 7.1z" fill="#fff" />
            </svg>
          )}
        </h3>
        <div className="flex items-center gap-1 text-[11px] md:text-xs text-neutral-500 dark:text-neutral-400 font-bold">
          <MapPin size={11} className="text-neutral-400 dark:text-neutral-500" />
          <span className="truncate">{location}</span>
        </div>
        <div className="mt-auto pt-3 border-t border-neutral-100 dark:border-neutral-800/60 flex items-center justify-between text-[11px] md:text-xs">
          <span className="font-bold text-neutral-400 dark:text-neutral-500">Total Experiences</span>
          <span className="font-black text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/80 px-2 py-0.5 rounded-md">{tripsHosted}</span>
        </div>
      </div>
    </div>
  );
}

export default HostCard;

