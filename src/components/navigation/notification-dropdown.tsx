"use client";

import { useEffect, useRef } from "react";
import { Bell, CheckCheck, Trash2 } from "lucide-react";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  unreadCount?: number;
}

export function NotificationDropdown({
  isOpen,
  onClose,
  unreadCount = 0,
}: NotificationDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-4 z-[1000] text-left animate-in fade-in slide-in-from-top-2 duration-200"
    >
      <div className="flex items-center justify-between pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-sm text-neutral-900 dark:text-neutral-100">
            Notifications
          </h3>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-red-500 text-white text-[10px] font-bold">
              {unreadCount} new
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-[#C59A2F] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <CheckCheck size={14} /> Mark all read
        </button>
      </div>

      <div className="py-8 flex flex-col items-center justify-center text-center text-neutral-400">
        <Bell size={32} className="opacity-30 mb-2" />
        <p className="text-sm font-medium">No notifications yet</p>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
          We&apos;ll notify you when hosts accept your requests or send updates.
        </p>
      </div>

      <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex justify-end">
        <button
          type="button"
          onClick={onClose}
          className="text-xs text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 flex items-center gap-1 cursor-pointer"
        >
          <Trash2 size={13} /> Clear all
        </button>
      </div>
    </div>
  );
}
