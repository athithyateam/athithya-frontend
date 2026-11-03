"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, Check, X, Eye, Trash2, UserCircle2 } from "lucide-react";
import { useNotificationStore } from "@/stores/notification-store";
import { useAuthStore } from "@/stores/auth-store";
import { useFeedbackStore } from "@/stores/feedback-store";
import { acceptFriendRequestApi, rejectFriendRequestApi } from "@/lib/api/users-api";
import { acceptBooking, declineBooking, acceptOrphanedInvite, rejectOrphanedInvite } from "@/lib/api/bookings-api";
import { ConfirmModal } from "@/components/ui/modal";

interface NotificationDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationDropdown({ isOpen, onClose }: NotificationDropdownProps) {
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { notifications, fetchNotifications, markAsRead, markAllAsRead, clearNotifications, setNotifications } = useNotificationStore();
  const { user, setShowVerificationModal } = useAuthStore();
  const { showToast } = useFeedbackStore();
  const [loadingMap, setLoadingMap] = useState<Record<string, string>>({});
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    fetchNotifications();
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener("mousedown", handleClickOutside);
    return () => window.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, fetchNotifications]);

  const handleFriendAction = async (notificationId: string, userId: string, action: "accept" | "reject") => {
    if (loadingMap[notificationId]) return;
    setLoadingMap((prev) => ({ ...prev, [notificationId]: action }));
    try {
      const res = await (action === "accept" ? acceptFriendRequestApi(userId) : rejectFriendRequestApi(userId));
      if (res?.success || res?.message?.toLowerCase().includes("success") || res?.message?.toLowerCase().includes("accepted")) {
        setNotifications((prev) =>
          prev.map((n) => (n._id === notificationId ? { ...n, read: true, status: action === "accept" ? "accepted" : "rejected" } : n))
        );
        await markAsRead(notificationId);
        fetchNotifications();
        showToast(`Friend request ${action}ed`, "success");
      } else showToast(res?.message || "Action failed", "error");
    } catch (err: any) {
      showToast(err?.message || "Something went wrong", "error");
    } finally {
      setLoadingMap((prev) => { const c = { ...prev }; delete c[notificationId]; return c; });
    }
  };

  const handleBookingAction = async (notificationId: string, bookingId: string, action: "accept" | "decline", orphaned = false) => {
    if (loadingMap[notificationId]) return;
    setLoadingMap((prev) => ({ ...prev, [notificationId]: action }));
    try {
      const res = orphaned
        ? await (action === "accept" ? acceptOrphanedInvite(bookingId) : rejectOrphanedInvite(bookingId))
        : await (action === "accept" ? acceptBooking(bookingId) : declineBooking(bookingId));
      if (res?.success || res?.message?.toLowerCase().includes("success")) {
        await markAsRead(notificationId);
        fetchNotifications();
        showToast(`Booking ${action}ed successfully`, "success");
      } else showToast(res?.message || "Action failed", "error");
    } catch (err: any) {
      showToast(err?.message || "Something went wrong", "error");
    } finally {
      setLoadingMap((prev) => { const c = { ...prev }; delete c[notificationId]; return c; });
    }
  };

  if (!isOpen) return null;

  return (
    <div ref={dropdownRef} className="fixed md:absolute inset-x-4 md:inset-auto md:right-0 top-16 md:top-full mt-2 md:w-[400px] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden z-[9999] text-left">
      <div className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex justify-between items-center bg-neutral-50/50 dark:bg-black">
        <h3 className="font-bold text-sm text-neutral-800 dark:text-neutral-200">Notifications</h3>
        <div className="flex gap-3">
          <button type="button" onClick={() => markAllAsRead()} className="text-[10px] text-[#C59A2F] font-black uppercase tracking-widest hover:underline cursor-pointer">Mark all as read</button>
          <button type="button" onClick={() => setShowClearConfirm(true)} className="text-[10px] text-red-500 font-black uppercase tracking-widest hover:underline flex items-center gap-1 cursor-pointer"><Trash2 size={10} /> Clear all</button>
        </div>
      </div>

      <div className="overflow-y-auto max-h-[380px]">
        {notifications.length === 0 ? (
          <div className="p-12 text-center text-neutral-400">
            <Bell size={28} className="opacity-30 mx-auto mb-2" />
            <p className="text-sm font-medium">Your notification tray is empty</p>
            <p className="text-[10px] mt-1 text-neutral-400">We&apos;ll alert you when something happens!</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              onClick={() => {
                if (n.title === "Host Account Rejected" || n.message?.toLowerCase().includes("host account verification")) {
                  if (user) router.push(`/profile/${user.id}`);
                  setShowVerificationModal(true);
                } else if (n.link === "/profile" && user) router.push(`/profile/${user.id}`);
                else if (n.link) router.push(n.link);
                markAsRead(n._id);
                onClose();
              }}
              className={`p-4 border-b border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 relative cursor-pointer ${!n.read ? "bg-amber-50/30 dark:bg-[#C59A2F]/10" : ""}`}
            >
              <div className="flex gap-3">
                <div className="shrink-0 pt-1">
                  {n.sender?.avatar?.url ? <img src={n.sender.avatar.url} alt="" className="w-10 h-10 rounded-full object-cover" /> : <UserCircle2 size={38} className="text-neutral-300 dark:text-neutral-700" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200 leading-tight">{n.title}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">{n.message}</p>
                  {n.type === "friend_request" && !n.read && n.metadata?.userId && (
                    <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleFriendAction(n._id, n.metadata!.userId!, "accept")} className="flex-1 px-3 py-1.5 bg-[#C59A2F] text-white text-[10px] font-black uppercase rounded-lg flex items-center justify-center gap-1 cursor-pointer"><Check size={11} /> Accept</button>
                      <button onClick={() => handleFriendAction(n._id, n.metadata!.userId!, "reject")} className="flex-1 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[10px] font-black uppercase rounded-lg flex items-center justify-center gap-1 cursor-pointer"><X size={11} /> Reject</button>
                    </div>
                  )}
                  {(n.type === "booking_request" || n.type === "orphaned_invite_host_request") && !n.read && (
                    <div className="flex gap-2 mt-3" onClick={(e) => e.stopPropagation()}>
                      <button onClick={() => handleBookingAction(n._id, n.metadata?.bookingId || n.link?.split("/").pop() || "", "accept", n.type === "orphaned_invite_host_request")} className="flex-1 px-3 py-1.5 bg-green-500 text-white text-[10px] font-black uppercase rounded-lg flex items-center justify-center gap-1 cursor-pointer"><Check size={11} /> Accept</button>
                      <button onClick={() => handleBookingAction(n._id, n.metadata?.bookingId || n.link?.split("/").pop() || "", "decline", n.type === "orphaned_invite_host_request")} className="flex-1 px-3 py-1.5 bg-red-500 text-white text-[10px] font-black uppercase rounded-lg flex items-center justify-center gap-1 cursor-pointer"><X size={11} /> Decline</button>
                    </div>
                  )}
                  {n.metadata?.postId && (
                    <Link href={`/post/${n.metadata.postId}`} onClick={(e) => { e.stopPropagation(); onClose(); }} className="mt-2 px-3 py-1.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[10px] font-black uppercase rounded-lg flex items-center justify-center gap-1">
                      <Eye size={12} /> View Experience
                    </Link>
                  )}
                  <p className="text-[10px] text-neutral-400 mt-2">{new Date(n.createdAt).toLocaleDateString()} at {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p>
                </div>
              </div>
              {!n.read && <div className="absolute top-4 right-4 w-2 h-2 bg-[#C59A2F] rounded-full" />}
            </div>
          ))
        )}
      </div>

      <ConfirmModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={async () => { await clearNotifications(); showToast("All notifications cleared", "info"); }}
        title="Clear Notifications?"
        message="Are you sure you want to permanently clear all notifications? This action cannot be undone."
      />
    </div>
  );
}
