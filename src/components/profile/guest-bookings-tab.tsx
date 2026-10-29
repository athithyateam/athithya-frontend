"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiUsers,
  FiClock,
  FiMapPin,
  FiMessageSquare,
  FiExternalLink,
  FiXCircle,
  FiTrash2,
  FiX,
} from "react-icons/fi";
import {
  getGuestBookings,
  requestCancellation,
} from "@/lib/api/bookings-api";
import { useFeedbackStore } from "@/stores/feedback-store";
import { ProfileTheme } from "./profile-shared";

const formatBookingTimeline = (b: any) => {
  if (!b?.startDate) return "Flexible";
  const start = new Date(b.startDate);
  if (isNaN(start.getTime())) return "Flexible";

  const startStr =
    start.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    }) +
    `, ${start.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "UTC",
    })}`;

  let end = b.endDate ? new Date(b.endDate) : null;
  if (!end && b.post?.duration) {
    end = new Date(start.getTime());
    const dur = b.post.duration;
    const period = b.post.price?.period;
    const durMinutes = Number(dur?.minutes || 0);
    const durHours = Number(
      dur?.hours || (period === "hour" ? dur?.hours || dur?.days || 1 : 0)
    );
    const durDays = Number(
      dur?.days || (period === "day" ? dur?.days || 1 : 0)
    );

    if (durMinutes > 0) end.setMinutes(end.getMinutes() + durMinutes);
    else if (durHours > 0) end.setHours(end.getHours() + durHours);
    else if (durDays > 0) end.setDate(end.getDate() + durDays);
  }

  if (end && !isNaN(end.getTime())) {
    const endStr =
      end.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      }) +
      `, ${end.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC",
      })}`;
    return `From ${startStr} to ${endStr}`;
  }

  return startStr;
};

interface GuestBookingsProps {
  isThemed?: boolean;
  theme?: ProfileTheme;
}

export function GuestBookingsTab({ isThemed }: GuestBookingsProps) {
  const { showToast, showConfirm } = useFeedbackStore();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [selectedBookingForInvites, setSelectedBookingForInvites] =
    useState<any>(null);

  const fetchBookings = async (isInitial = false) => {
    if (isInitial && bookings.length === 0) setLoading(true);
    try {
      const data = await getGuestBookings();
      setBookings(data?.data || data?.bookings || (Array.isArray(data) ? data : []));
    } catch (error) {
      console.error("Fetch guest bookings error", error);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(true);
  }, []);

  const handleRemoveLocal = (id: string) => {
    setBookings((prev) => prev.filter((b) => b._id !== id));
    showToast("Booking hidden from view", "info");
  };

  const handleCancel = (id: string) => {
    showConfirm(
      "Cancel Trip Booking",
      "Are you sure you want to request a cancellation for this trip? This will be reviewed by the host.",
      async () => {
        setCancellingId(id);
        try {
          await requestCancellation(id, "User requested cancellation");
          showToast("Cancellation request sent to host", "success");
          await fetchBookings(false);
        } catch (err: any) {
          showToast(err?.message || "Failed to request cancellation", "error");
        } finally {
          setCancellingId(null);
        }
      }
    );
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case "pending":
        return {
          label: "Pending",
          class:
            "bg-yellow-50 text-yellow-600 border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-500 dark:border-yellow-900/30",
        };
      case "accepted":
        return {
          label: "Booked",
          class:
            "bg-green-50 text-green-600 border-green-100 dark:bg-green-900/20 dark:text-green-500 dark:border-green-900/30",
        };
      case "declined":
        return {
          label: "Declined",
          class:
            "bg-red-50 text-red-600 border-red-100 dark:bg-red-900/20 dark:text-red-500 dark:border-red-900/30",
        };
      case "cancel_requested":
        return {
          label: "Cancel Requested",
          class:
            "bg-orange-50 text-orange-600 border-orange-100 animate-pulse dark:bg-orange-900/20 dark:text-orange-500 dark:border-orange-900/30",
        };
      case "cancelled":
        return {
          label: "Cancelled",
          class:
            "bg-neutral-100 text-neutral-500 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700",
        };
      default:
        return {
          label: status,
          class:
            "bg-gray-50 text-gray-600 border-gray-100 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700",
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3
            className="text-lg font-black uppercase tracking-wider text-[#C59A2F]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            My Requested Trips
          </h3>
          <p
            className="text-xs text-neutral-400 mt-1 font-medium"
            style={
              isThemed
                ? {
                    color: "#ffffff",
                    textShadow: "0 2px 10px rgba(0,0,0,0.85)",
                    opacity: 0.95,
                  }
                : undefined
            }
          >
            Keep track of your booking requests, approvals, and cancellations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {loading && bookings.length === 0 ? (
          <div className="py-20 flex justify-center">
            <div className="w-8 h-8 border-4 border-[#C59A2F]/20 border-t-[#C59A2F] rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <div
            className="py-16 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 dark:bg-neutral-900 dark:border-neutral-700 transition-colors"
            style={
              isThemed
                ? {
                    background: "transparent",
                    borderColor: "rgba(255,255,255,0.14)",
                  }
                : undefined
            }
          >
            <FiClock
              className="w-8 h-8 mx-auto text-gray-200 mb-2"
              style={{
                color: isThemed ? "rgba(255,255,255,0.7)" : undefined,
              }}
            />
            <p
              className="text-gray-400 text-sm font-medium"
              style={{ color: isThemed ? "#ffffff" : undefined }}
            >
              You haven&apos;t requested any trips yet.
            </p>
          </div>
        ) : (
          bookings.map((b) => {
            const status = getStatusInfo(b.status);
            return (
              <div
                key={b._id}
                className="overflow-hidden hover:shadow-md transition-all group border rounded-[2rem]"
                style={
                  isThemed
                    ? {
                        borderColor: "rgba(255,255,255,0.18)",
                        background: "transparent",
                      }
                    : {
                        borderColor:
                          "var(--panel-border, rgba(255,255,255,0.9))",
                        background:
                          "var(--profile-card-bg, rgba(255,255,255,0.82))",
                        backdropFilter: "blur(20px)",
                      }
                }
              >
                <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-gray-50 dark:divide-neutral-800/80 transition-colors">
                  {/* Visual Portion */}
                  <div className="relative w-full md:w-48 h-32 md:h-auto overflow-hidden shrink-0">
                    <img
                      loading="lazy"
                      decoding="async"
                      src={
                        b.post?.photos?.[0]?.url ||
                        "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1470&auto=format&fit=crop"
                      }
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      alt="Trip"
                    />
                    <div
                      className={`absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm border ${status.class}`}
                    >
                      {status.label}
                    </div>
                  </div>

                  {/* Content Portion */}
                  <div className="flex-1 p-5 text-left space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <h4
                          className="font-bold text-gray-900 group-hover:text-[#C59A2F] transition-colors dark:text-neutral-100 break-words"
                          style={{ color: isThemed ? "#ffffff" : undefined }}
                        >
                          {b.postTitle || b.post?.title}
                        </h4>
                        <div
                          className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase tracking-tight mt-1"
                          style={{
                            color: isThemed
                              ? "rgba(255,255,255,0.85)"
                              : undefined,
                          }}
                        >
                          <FiMapPin className="text-[#C59A2F]" />
                          {b.post?.location?.city || "Uttarakhand"}
                        </div>
                      </div>
                      <div className="text-left sm:text-right shrink-0">
                        <div
                          className="text-lg font-black text-gray-900 leading-none dark:text-neutral-100 transition-colors"
                          style={{ color: isThemed ? "#ffffff" : undefined }}
                        >
                          ₹{b.totalAmount}
                        </div>
                        <div
                          className="text-[10px] font-bold text-gray-400 uppercase mt-1"
                          style={{
                            color: isThemed
                              ? "rgba(255,255,255,0.8)"
                              : undefined,
                          }}
                        >
                          {b.paymentStatus === "refunded"
                            ? "Refunded"
                            : "Total Paid"}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2.5 sm:gap-3">
                      <div
                        className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 dark:text-neutral-400 dark:bg-neutral-900 dark:border-neutral-800 transition-colors"
                        style={
                          isThemed
                            ? {
                                background: "transparent",
                                borderColor: "rgba(255,255,255,0.15)",
                                color: "#ffffff",
                              }
                            : undefined
                        }
                      >
                        <FiCalendar className="text-[#C59A2F]" />
                        <span>{formatBookingTimeline(b)}</span>
                      </div>
                      <div
                        className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 dark:text-neutral-400 dark:bg-neutral-900 dark:border-neutral-800 transition-colors"
                        style={
                          isThemed
                            ? {
                                background: "transparent",
                                borderColor: "rgba(255,255,255,0.15)",
                                color: "#ffffff",
                              }
                            : undefined
                        }
                      >
                        <FiUsers className="text-[#C59A2F]" />
                        {b.numberOfPeople}{" "}
                        {b.numberOfPeople === 1 ? "Guest" : "Guests"}
                      </div>
                      {b.invitedUsers && b.invitedUsers.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setSelectedBookingForInvites(b)}
                          className="flex items-center gap-2 text-xs font-bold text-[#C59A2F] bg-[#FFF7E6] dark:bg-amber-950/20 px-3 py-1.5 rounded-lg border border-[#D4A017]/20 hover:bg-[#D4A017] dark:hover:bg-[#C59A2F] hover:text-white transition-all cursor-pointer shadow-sm"
                        >
                          <FiUsers />
                          {b.joinedUsers?.length || 0} Friend
                          {(b.joinedUsers?.length || 0) !== 1 ? "s" : ""}
                        </button>
                      )}
                    </div>

                    {b.hostResponse && (
                      <div
                        className="p-3 bg-[#FFF7E6] dark:bg-amber-950/20 rounded-xl text-xs text-gray-700 border border-[#D4A017]/10 dark:border-[#D4A017]/20 flex gap-2 items-start animate-in fade-in slide-in-from-top-2 dark:text-neutral-300 transition-colors"
                        style={
                          isThemed
                            ? {
                                background: "transparent",
                                borderColor: "rgba(255,255,255,0.15)",
                                color: "#ffffff",
                              }
                            : undefined
                        }
                      >
                        <div
                          className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm dark:bg-neutral-900 transition-colors"
                          style={
                            isThemed
                              ? { background: "rgba(255,255,255,0.15)" }
                              : undefined
                          }
                        >
                          <FiMessageSquare className="text-[#D4A017] text-[10px]" />
                        </div>
                        <div>
                          <span className="font-black text-[9px] uppercase text-[#D4A017] block mb-0.5">
                            Host&apos;s Note
                          </span>
                          &ldquo;{b.hostResponse}&rdquo;
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions Portion */}
                  <div
                    className="p-4 flex flex-row md:flex-col items-center justify-center bg-gray-50/30 dark:bg-neutral-950/30 gap-3 md:min-w-[100px] w-full md:w-auto transition-colors"
                    style={
                      isThemed
                        ? { background: "rgba(255,255,255,0.02)" }
                        : undefined
                    }
                  >
                    <button
                      type="button"
                      onClick={() =>
                        window.open(
                          `/post/${b.post?._id || b.post}`,
                          "_blank"
                        )
                      }
                      className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-neutral-400 hover:text-[#C59A2F] hover:shadow-lg transition-all duration-300 dark:bg-neutral-900 dark:border-neutral-800 cursor-pointer"
                      style={
                        isThemed
                          ? {
                              background: "rgba(255,255,255,0.08)",
                              borderColor: "rgba(255,255,255,0.15)",
                              color: "#ffffff",
                            }
                          : undefined
                      }
                      title="View Listing"
                    >
                      <FiExternalLink />
                    </button>

                    {b.status === "accepted" && (
                      <button
                        type="button"
                        disabled={cancellingId === b._id}
                        onClick={() => handleCancel(b._id)}
                        className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-neutral-400 hover:text-red-500 hover:shadow-lg transition-all duration-300 dark:bg-neutral-900 dark:border-neutral-800 cursor-pointer"
                        title="Cancel Booking"
                      >
                        {cancellingId === b._id ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <FiXCircle />
                        )}
                      </button>
                    )}

                    {["cancelled", "declined"].includes(b.status) && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLocal(b._id)}
                        className="w-10 h-10 rounded-full bg-white border border-gray-100 flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:shadow-lg transition-all duration-300 dark:bg-neutral-900 dark:border-neutral-800 cursor-pointer"
                        title="Dismiss"
                      >
                        <FiTrash2 />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Invited Friends Progress Modal */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {selectedBookingForInvites && (
              <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setSelectedBookingForInvites(null)}
                  className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  className="relative rounded-[2rem] p-6 w-full max-w-md shadow-2xl bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800 transition-colors"
                >
                  <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-neutral-800 transition-colors">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#FFF7E6] dark:bg-amber-950/20 text-[#D4A017] flex items-center justify-center">
                        <FiUsers size={16} />
                      </div>
                      <h3 className="text-base font-black text-gray-900 dark:text-neutral-100">
                        Friends Status
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedBookingForInvites(null)}
                      className="p-1 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-neutral-200 transition-colors cursor-pointer"
                    >
                      <FiX size={18} />
                    </button>
                  </div>

                  <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto">
                    {selectedBookingForInvites.invitedUsers?.length > 0 ? (
                      selectedBookingForInvites.invitedUsers.map(
                        (friend: any) => {
                          const joinedData =
                            selectedBookingForInvites.joinedUsers?.find(
                              (j: any) => j.user?._id === friend._id
                            );
                          const hasJoined = !!joinedData;

                          return (
                            <div
                              key={friend._id}
                              onClick={() =>
                                window.open(
                                  `/profile/${friend._id}`,
                                  "_blank"
                                )
                              }
                              className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 dark:bg-neutral-800/40 border border-gray-100 dark:border-neutral-800 cursor-pointer hover:border-[#C59A2F]/30 hover:shadow-sm transition-all group"
                            >
                              <div className="flex items-center gap-3">
                                <img
                                  loading="lazy"
                                  decoding="async"
                                  src={
                                    friend.avatar?.url ||
                                    `https://ui-avatars.com/api/?name=${friend.firstname}`
                                  }
                                  alt=""
                                  className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-neutral-700 transition-colors"
                                />
                                <div>
                                  <p className="font-bold text-gray-900 group-hover:text-[#C59A2F] transition-colors text-sm dark:text-neutral-100">
                                    {friend.firstname} {friend.lastname}
                                  </p>
                                  <p
                                    className={`text-[10px] font-black uppercase tracking-widest ${
                                      hasJoined
                                        ? "text-green-500"
                                        : "text-orange-400"
                                    }`}
                                  >
                                    {hasJoined ? "Booked" : "Pending"}
                                  </p>
                                </div>
                              </div>
                              {hasJoined && joinedData.booking && (
                                <div className="text-right">
                                  <p className="text-xs font-bold text-gray-700 dark:text-neutral-300 transition-colors">
                                    ₹{joinedData.booking.totalAmount}
                                  </p>
                                  {joinedData.booking.startDate && (
                                    <p className="text-[9px] text-gray-400 uppercase tracking-tight">
                                      {new Date(
                                        joinedData.booking.startDate
                                      ).toLocaleDateString()}
                                    </p>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        }
                      )
                    ) : (
                      <p className="text-center text-sm text-gray-500 py-4 font-medium dark:text-neutral-400 transition-colors">
                        No friends were invited to this booking.
                      </p>
                    )}
                  </div>
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </div>
  );
}

