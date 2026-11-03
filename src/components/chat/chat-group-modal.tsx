"use client";

import React, { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { FiX, FiSearch, FiUserPlus, FiUsers } from "react-icons/fi";
import {
  getGuestsApi,
  friendRequestApi,
  unfriendUserApi,
} from "@/lib/api/users-api";
import { useFeedbackStore } from "@/stores/feedback-store";

interface FindFriendsModalProps {
  open: boolean;
  onClose: () => void;
}

export function FindFriendsModal({ open, onClose }: FindFriendsModalProps) {
  const router = useRouter();
  const { showToast } = useFeedbackStore();

  const [guestsList, setGuestsList] = useState<any[]>([]);
  const [guestsSearch, setGuestsSearch] = useState("");
  const [guestsPage, setGuestsPage] = useState(1);
  const [guestsHasMore, setGuestsHasMore] = useState(false);
  const [guestsLoading, setGuestsLoading] = useState(false);
  const [connectingGuestId, setConnectingGuestId] = useState<string | null>(
    null
  );

  const fetchGuests = useCallback(
    async (search = "", page = 1, append = false) => {
      setGuestsLoading(true);
      try {
        const res = await getGuestsApi({ search, page, limit: 8 });
        if (res?.success || res?.guests || res?.data) {
          const list =
            res.guests ||
            res.data?.guests ||
            res.data ||
            (Array.isArray(res) ? res : []);
          if (append) {
            setGuestsList((prev) => [...prev, ...list]);
          } else {
            setGuestsList(list);
          }
          const hasMore =
            res.hasMore !== undefined
              ? Boolean(res.hasMore)
              : list.length >= 8;
          setGuestsHasMore(hasMore);
          setGuestsPage(page);
        } else {
          if (!append) setGuestsList([]);
          setGuestsHasMore(false);
        }
      } catch (err) {
        console.error("Failed to load guests:", err);
        if (!append) setGuestsList([]);
      } finally {
        setGuestsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (open) {
      setGuestsSearch("");
      fetchGuests("", 1, false);
    }
  }, [open, fetchGuests]);

  const handleGuestSearchChange = (val: string) => {
    setGuestsSearch(val);
    fetchGuests(val, 1, false);
  };

  const handleConnectGuest = async (guest: any) => {
    const guestId = guest._id || guest.id;
    setConnectingGuestId(guestId);
    try {
      const isConnected =
        guest.friendshipStatus === "friends" || guest.isFriend;
      const isReq =
        guest.friendshipStatus === "requested" || guest.isRequested;

      if (isConnected || isReq) {
        await unfriendUserApi(guestId);
        setGuestsList((prev) =>
          prev.map((g) =>
            (g._id || g.id) === guestId
              ? {
                  ...g,
                  friendshipStatus: "none",
                  isFriend: false,
                  isRequested: false,
                }
              : g
          )
        );
        showToast(isConnected ? "Unfriended" : "Request cancelled", "info");
      } else {
        const res = await friendRequestApi(guestId);
        if (res?.success !== false) {
          setGuestsList((prev) =>
            prev.map((g) =>
              (g._id || g.id) === guestId
                ? {
                    ...g,
                    friendshipStatus: "requested",
                    isFriend: false,
                    isRequested: true,
                  }
                : g
            )
          );
          showToast(res?.message || "Request sent!", "success");
        } else {
          showToast(res?.message || "Could not send request", "error");
        }
      }
    } catch (err: any) {
      showToast(err?.message || "Action failed", "error");
    } finally {
      setConnectingGuestId(null);
    }
  };

  if (!open) return null;

  const modalContent = (
    <div
      className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-neutral-900/60 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-neutral-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200 transition-colors border border-neutral-100 dark:border-neutral-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-black text-neutral-900 tracking-tight dark:text-neutral-100">
              Find Friends
            </h3>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">
              Connect with fellow guests
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 transition-colors cursor-pointer"
            title="Close"
          >
            <FiX size={18} />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-3 bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/80 dark:border-neutral-700/80 rounded-2xl px-4 py-3 focus-within:border-[#C59A2F]">
            <FiSearch className="text-neutral-400" size={16} />
            <input
              type="text"
              placeholder="Search Friends..."
              value={guestsSearch}
              onChange={(e) => handleGuestSearchChange(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400"
            />
            {guestsSearch && (
              <button
                type="button"
                onClick={() => handleGuestSearchChange("")}
                className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
              >
                <FiX size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Guest List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {guestsLoading && guestsList.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400 font-bold uppercase tracking-widest">
              Loading guests...
            </div>
          ) : guestsList.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400 font-bold uppercase tracking-widest">
              No guests found
            </div>
          ) : (
            guestsList.map((g) => {
              const guestId = g._id || g.id;
              const gName =
                [g.firstname, g.lastname].filter(Boolean).join(" ") || "Guest";
              const rawAvatar =
                g.avatar?.url ||
                (typeof g.avatar === "string" ? g.avatar : "");
              const isPending = connectingGuestId === guestId;
              const isFriend =
                g.friendshipStatus === "friends" || g.isFriend;
              const isRequested =
                g.friendshipStatus === "requested" || g.isRequested;

              return (
                <div
                  key={guestId}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-2xl border border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50/60 dark:hover:bg-neutral-800/40 transition-all"
                >
                  <div
                    onClick={() => {
                      onClose();
                      router.push(`/profile/${guestId}`);
                    }}
                    className="flex items-center gap-3 min-w-0 cursor-pointer group/user flex-1"
                  >
                    <img
                      src={
                        rawAvatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          gName
                        )}&background=C59A2F&color=fff`
                      }
                      alt={gName}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          gName
                        )}&background=C59A2F&color=fff`;
                      }}
                      className="w-11 h-11 rounded-full object-cover border border-neutral-200 dark:border-neutral-700 shrink-0 group-hover/user:scale-105 transition-transform"
                    />
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 truncate group-hover/user:text-[#C59A2F] transition-colors">
                        {gName}
                      </h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                          Guest
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleConnectGuest(g)}
                    disabled={isPending}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer shrink-0 disabled:opacity-50 ${
                      isFriend
                        ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 border border-emerald-200 dark:border-emerald-800/50 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        : isRequested
                        ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-500 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-200"
                        : "bg-[#C59A2F] text-white hover:bg-[#b08825] shadow-xs active:scale-95"
                    }`}
                  >
                    {isPending
                      ? "..."
                      : isFriend
                      ? "Friends"
                      : isRequested
                      ? "Requested"
                      : "Connect"}
                  </button>
                </div>
              );
            })
          )}

          {/* Show More Button */}
          {guestsHasMore && (
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() =>
                  fetchGuests(guestsSearch, guestsPage + 1, true)
                }
                disabled={guestsLoading}
                className="w-full py-3 rounded-2xl border border-[#C59A2F]/30 bg-[#C59A2F]/10 hover:bg-[#C59A2F]/20 text-[#C59A2F] text-xs font-black uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
              >
                {guestsLoading ? "Loading..." : "Show More"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalContent, document.body)
    : null;
}

export const ChatGroupModal = FindFriendsModal;
export default FindFriendsModal;
