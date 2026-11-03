"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiUsers,
  FiCheck,
  FiX,
  FiClock,
  FiExternalLink,
  FiChevronDown,
  FiAlertCircle,
  FiRefreshCw,
  FiTrendingUp,
  FiActivity,
} from "react-icons/fi";
import {
  getHostBookings,
  acceptBooking,
  declineBooking,
  approveCancellation,
  sendStartOTP,
  verifyStartOTP,
  sendCompletionOTP,
  verifyCompletionOTP,
} from "@/lib/api/bookings-api";
import { useFeedbackStore } from "@/stores/feedback-store";
import { GOLD, type ProfileTheme } from "./profile-shared";

const FILTERS = [
  { key: "accepted", label: "Confirmed", icon: FiCheck, color: "#22c55e" },
  { key: "in_progress", label: "Active", icon: FiActivity, color: "#3b82f6" },
  { key: "completed", label: "Completed", icon: FiCheck, color: "#94a3b8" },
  { key: "pending", label: "Pending", icon: FiClock, color: GOLD },
  {
    key: "most_requested",
    label: "Trending",
    icon: FiTrendingUp,
    color: "#8b5cf6",
  },
  { key: "cancelled", label: "Cancelled", icon: FiX, color: "#ef4444" },
];

function StatusBadge({ status }: { status: string }) {
  const map: Record<
    string,
    { label: string; bg: string; color: string; border: string; pulse?: boolean }
  > = {
    accepted: {
      label: "Confirmed",
      bg: "rgba(34,197,94,0.15)",
      color: "#4ade80",
      border: "rgba(34,197,94,0.3)",
    },
    in_progress: {
      label: "Checked In",
      bg: "rgba(59,130,246,0.15)",
      color: "#60a5fa",
      border: "rgba(59,130,246,0.3)",
      pulse: true,
    },
    completed: {
      label: "Completed",
      bg: "rgba(255,255,255,0.06)",
      color: "#94a3b8",
      border: "rgba(255,255,255,0.1)",
    },
    pending: {
      label: "Pending",
      bg: `${GOLD}20`,
      color: GOLD,
      border: `${GOLD}40`,
    },
    declined: {
      label: "Declined",
      bg: "rgba(239,68,68,0.15)",
      color: "#f87171",
      border: "rgba(239,68,68,0.3)",
    },
    cancel_requested: {
      label: "Cancel Req.",
      bg: "rgba(249,115,22,0.15)",
      color: "#fb923c",
      border: "rgba(249,115,22,0.3)",
      pulse: true,
    },
    cancelled: {
      label: "Cancelled",
      bg: "rgba(255,255,255,0.06)",
      color: "#6b7280",
      border: "rgba(255,255,255,0.1)",
    },
  };
  const s = map[status] || map.pending;
  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
        s.pulse ? "animate-pulse" : ""
      }`}
      style={{
        background: s.bg,
        color: s.color,
        borderColor: s.border,
      }}
    >
      {s.label}
    </span>
  );
}

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

function IndividualBookingCard({
  b,
  idx,
  activeActionId,
  setActiveActionId,
  hostResponse,
  setHostResponse,
  handleAction,
  isSubmitting,
  isThemed,
  theme,
}: {
  b: any;
  idx: number;
  activeActionId: string | null;
  setActiveActionId: (id: string | null) => void;
  hostResponse: string;
  setHostResponse: (val: string) => void;
  handleAction: (id: string, action: string) => void;
  isSubmitting: boolean;
  isThemed?: boolean;
  theme?: ProfileTheme;
}) {
  const expanded = activeActionId === b._id;
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const { showToast } = useFeedbackStore();

  const handleSendOTP = async (type: "start" | "complete", isResend = false) => {
    setOtpLoading(true);
    setOtpError("");
    try {
      if (type === "start") {
        await sendStartOTP(b._id);
        showToast(
          isResend
            ? "✅ Check-in OTP resent to guest's email! Please ask the guest to check their inbox."
            : "Check-in OTP sent to guest's email",
          "success"
        );
      } else {
        await sendCompletionOTP(b._id);
        showToast(
          isResend
            ? "✅ Checkout OTP resent to guest's email! Please ask the guest to check their inbox."
            : "Checkout OTP sent to guest's email",
          "success"
        );
      }
      setOtpSent(true);
      if (isResend) {
        setResendCooldown(30);
        const timer = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    } catch (err: any) {
      const errMsg = err?.message || "Failed to send OTP";
      setOtpError(errMsg);
      showToast(errMsg, "error");
    } finally {
      setOtpLoading(false);
    }
  };

  const handleVerifyOTP = async (type: "start" | "complete") => {
    if (!otpCode || otpCode.trim().length < 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }
    setOtpLoading(true);
    setOtpError("");
    try {
      if (type === "start") {
        await verifyStartOTP(b._id, otpCode);
        showToast("Check-in verified successfully!", "success");
      } else {
        await verifyCompletionOTP(b._id, otpCode);
        showToast("Checkout verified successfully!", "success");
      }
      setOtpSent(false);
      setOtpCode("");
      handleAction(b._id, "refresh_list");
    } catch (err: any) {
      const errMsg = err?.message || "Verification failed";
      setOtpError(errMsg);
      showToast(errMsg, "error");
    } finally {
      setOtpLoading(false);
    }
  };

  const statusLineColor =
    b.status === "accepted"
      ? "#22c55e"
      : b.status === "in_progress"
      ? "#3b82f6"
      : b.status === "completed"
      ? "#94a3b8"
      : b.status === "pending"
      ? GOLD
      : b.status === "cancel_requested"
      ? "#f97316"
      : "transparent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ delay: idx * 0.05, duration: 0.35 }}
      className="rounded-[2rem] overflow-hidden transition-all duration-300 hover:shadow-xl border"
      style={
        isThemed
          ? { borderColor: "rgba(255,255,255,0.14)", background: "transparent" }
          : {
              borderColor: "var(--panel-border, rgba(255,255,255,0.9))",
              background: "var(--profile-card-bg, rgba(255,255,255,0.82))",
              backdropFilter: "blur(20px)",
            }
      }
    >
      <div
        className="h-[2px]"
        style={{
          background: `linear-gradient(90deg, transparent, ${statusLineColor}, transparent)`,
        }}
      />

      <div className="p-5">
        <div className="flex flex-wrap md:flex-nowrap gap-4 items-start">
          {/* Guest */}
          <div className="flex items-center gap-3 min-w-[180px]">
            <div className="w-12 h-12 rounded-2xl overflow-hidden shrink-0 border-2 shadow-sm border-neutral-100 dark:border-neutral-800">
              <img
                loading="lazy"
                decoding="async"
                src={
                  b.guest?.avatar?.url ||
                  `https://ui-avatars.com/api/?name=${b.guest?.firstname}&background=C59A2F&color=fff`
                }
                className="w-full h-full object-cover"
                alt="Guest"
              />
            </div>
            <div>
              <h5
                className="font-black text-sm leading-tight text-neutral-900 dark:text-neutral-100"
                style={isThemed ? { color: "#ffffff" } : undefined}
              >
                {b.guest?.firstname} {b.guest?.lastname}
              </h5>
            </div>
          </div>

          {/* Trip Details */}
          <div className="flex-1 space-y-2 min-w-0">
            <div className="flex items-center gap-2">
              <h6
                className="font-black text-xs uppercase tracking-widest truncate"
                style={{ color: GOLD }}
              >
                {b.postTitle}
              </h6>
              <button
                type="button"
                onClick={() =>
                  window.open(`/post/${b.post?._id || b.post}`, "_blank")
                }
                className="shrink-0 opacity-30 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <FiExternalLink size={12} style={{ color: GOLD }} />
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              <span
                className="flex items-center gap-1.5 text-xs font-bold text-neutral-700 dark:text-neutral-300"
                style={
                  isThemed ? { color: "rgba(255,255,255,0.85)" } : undefined
                }
              >
                <FiCalendar size={11} style={{ color: GOLD }} />
                <span>{formatBookingTimeline(b)}</span>
              </span>
              <span
                className="flex items-center gap-1.5 text-xs font-bold text-neutral-500 dark:text-neutral-400"
                style={
                  isThemed ? { color: "rgba(255,255,255,0.7)" } : undefined
                }
              >
                <FiUsers size={11} style={{ color: GOLD }} />
                {b.numberOfPeople} Explorer{b.numberOfPeople !== 1 ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Price + Status */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            <StatusBadge status={b.status} />
            <div className="text-right">
              <div
                className="text-xl font-black text-neutral-900 dark:text-neutral-100 transition-colors"
                style={isThemed ? { color: "#ffffff" } : undefined}
              >
                ₹
                {b.totalAmount?.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })}
              </div>
              {b.platformFee > 0 && (
                <div
                  className="text-[10px] font-bold mt-0.5 text-neutral-400 dark:text-neutral-500"
                  style={
                    isThemed ? { color: "rgba(255,255,255,0.6)" } : undefined
                  }
                >
                  Incl.{" "}
                  <span style={{ color: GOLD }}>
                    ₹
                    {b.platformFee?.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </span>{" "}
                  fee
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        {(b.status === "pending" ||
          b.status === "cancel_requested" ||
          b.status === "accepted" ||
          b.status === "in_progress") && (
          <div
            className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800"
            style={
              isThemed
                ? { borderColor: theme?.divider || "rgba(255,255,255,0.1)" }
                : undefined
            }
          >
            {b.status === "cancel_requested" ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 flex-1">
                  <FiAlertCircle size={14} style={{ color: "#fb923c" }} />
                  <span
                    className="text-xs font-bold"
                    style={{ color: "#fb923c" }}
                  >
                    Guest requested cancellation
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => handleAction(b._id, "approve_cancel")}
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50 bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 cursor-pointer"
                >
                  Approve
                </button>
              </div>
            ) : b.status === "pending" ? (
              <>
                {!expanded && activeActionId !== `decline_${b._id}` && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveActionId(b._id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 bg-green-50 text-green-600 border border-green-200 dark:bg-green-950/20 dark:text-green-500 dark:border-green-900/30 cursor-pointer"
                    >
                      <FiCheck size={12} /> Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveActionId(`decline_${b._id}`)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 bg-red-50 text-red-600 border border-red-200 dark:bg-red-950/20 dark:text-red-500 dark:border-red-900/30 cursor-pointer"
                    >
                      <FiX size={12} /> Decline
                    </button>
                  </div>
                )}
                {expanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-3"
                  >
                    <textarea
                      value={hostResponse}
                      onChange={(e) => setHostResponse(e.target.value)}
                      placeholder="Add a message for the guest (optional)..."
                      rows={2}
                      className="w-full px-4 py-3 rounded-2xl text-sm resize-none focus:outline-none focus:ring-1 transition-all bg-neutral-50 border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:ring-[#C59A2F]"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAction(b._id, "accept")}
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50 cursor-pointer"
                        style={{
                          background: GOLD,
                          color: "#fff",
                          boxShadow: `0 4px 16px ${GOLD}44`,
                        }}
                      >
                        <FiCheck size={12} />{" "}
                        {isSubmitting ? "Saving…" : "Confirm Accept"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveActionId(null)}
                        className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all text-neutral-400 dark:text-neutral-500 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
                {activeActionId === `decline_${b._id}` && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="space-y-3"
                  >
                    <textarea
                      value={hostResponse}
                      onChange={(e) => setHostResponse(e.target.value)}
                      placeholder="Reason for declining (optional)..."
                      rows={2}
                      className="w-full px-4 py-3 rounded-2xl text-sm resize-none focus:outline-none transition-all bg-red-50/50 border border-red-200/50 dark:bg-red-950/10 dark:border-red-900/30 text-neutral-800 dark:text-neutral-200"
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleAction(b._id, "decline")}
                        disabled={isSubmitting}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 disabled:opacity-50 bg-red-500 text-white hover:bg-red-600 shadow-md cursor-pointer"
                      >
                        <FiX size={12} />{" "}
                        {isSubmitting ? "Saving…" : "Confirm Decline"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveActionId(null)}
                        className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all text-neutral-400 dark:text-neutral-500 cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  </motion.div>
                )}
              </>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <FiActivity
                    size={14}
                    style={{
                      color: b.status === "accepted" ? GOLD : "#3b82f6",
                    }}
                  />
                  <span
                    className="text-xs font-bold text-neutral-700 dark:text-neutral-300"
                    style={
                      isThemed ? { color: "rgba(255,255,255,0.9)" } : undefined
                    }
                  >
                    {b.status === "accepted"
                      ? "Check-In OTP Verification"
                      : "Checkout OTP Verification"}
                  </span>
                </div>

                {!otpSent ? (
                  <button
                    type="button"
                    onClick={() =>
                      handleSendOTP(
                        b.status === "accepted" ? "start" : "complete"
                      )
                    }
                    disabled={otpLoading}
                    className="w-full px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-white disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md dark:shadow-none cursor-pointer"
                    style={{
                      background: b.status === "accepted" ? GOLD : "#3b82f6",
                    }}
                  >
                    {otpLoading
                      ? "Sending OTP..."
                      : b.status === "accepted"
                      ? "Send Check-in OTP"
                      : "Send Checkout OTP"}
                  </button>
                ) : (
                  <div className="space-y-3">
                    <p className="text-[11px] text-slate-400 dark:text-neutral-500 font-bold uppercase tracking-wider">
                      Enter the 6-digit OTP sent to guest&apos;s email:
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        maxLength={6}
                        value={otpCode}
                        onChange={(e) =>
                          setOtpCode(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder="e.g. 123456"
                        className="px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:ring-1 border bg-neutral-50 border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200 focus:ring-[#C59A2F] w-36 font-mono text-center tracking-widest font-bold"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          handleVerifyOTP(
                            b.status === "accepted" ? "start" : "complete"
                          )
                        }
                        disabled={otpLoading || otpCode.length < 6}
                        className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-white bg-green-600 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                      >
                        {otpLoading ? "Verifying..." : "Verify OTP"}
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleSendOTP(
                            b.status === "accepted" ? "start" : "complete",
                            true
                          )
                        }
                        disabled={otpLoading || resendCooldown > 0}
                        className="px-3 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-[#C59A2F] hover:text-[#a07a1e] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                      >
                        {resendCooldown > 0
                          ? `Resend in ${resendCooldown}s`
                          : "Resend OTP"}
                      </button>
                    </div>
                    {otpError && (
                      <p className="text-xs text-red-500 font-medium">
                        {otpError}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export function HostBookingManagement({
  isThemed = false,
  theme,
}: {
  isThemed?: boolean;
  theme?: ProfileTheme;
}) {
  const { showToast } = useFeedbackStore();
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("accepted");
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [activeActionId, setActiveActionId] = useState<string | null>(null);
  const [hostResponse, setHostResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mostRequestedGroupBy, setMostRequestedGroupBy] = useState("price");
  const [showGroupDropdown, setShowGroupDropdown] = useState(false);

  const fetchBookings = async (isInitial = false) => {
    if (isInitial && bookings.length === 0) setLoading(true);
    try {
      const apiStatus = filter === "most_requested" ? "" : filter;
      const data = await getHostBookings(apiStatus);
      setBookings(data?.data || data?.bookings || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(true);
  }, [filter]);

  const groupedBookings = useMemo(() => {
    const groups: Record<string, any> = {};
    bookings.forEach((b) => {
      const experienceId = b.post?._id || b.post;
      let groupKey: string;
      let displayVal: any;
      if (mostRequestedGroupBy === "price") {
        const price = b.totalAmount || 0;
        groupKey = `${experienceId}_${price}`;
        displayVal = price;
      } else {
        const dateRaw = b.startDate
          ? new Date(b.startDate).toLocaleDateString("en-IN")
          : "Flexible";
        groupKey = `${experienceId}_${dateRaw}`;
        displayVal = dateRaw;
      }
      if (!groups[groupKey]) {
        groups[groupKey] = {
          key: groupKey,
          experienceTitle: b.postTitle,
          experienceId,
          displayValue: displayVal,
          count: 0,
          requests: [],
        };
      }
      groups[groupKey].count += 1;
      groups[groupKey].requests.push(b);
    });
    return Object.values(groups).sort((a: any, b: any) => b.count - a.count);
  }, [bookings, mostRequestedGroupBy]);

  const handleAction = async (id: string, action: string) => {
    if (action === "refresh_list") {
      await fetchBookings();
      return;
    }
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      if (action === "accept") await acceptBooking(id, hostResponse);
      else if (action === "approve_cancel") await approveCancellation(id);
      else await declineBooking(id, hostResponse);
      setHostResponse("");
      setActiveActionId(null);
      await fetchBookings();
      showToast(`Booking ${action}ed successfully`, "success");
      if (selectedGroup) {
        setSelectedGroup((prev: any) => ({
          ...prev,
          requests: prev.requests.filter((r: any) => r._id !== id),
        }));
      }
    } catch (err: any) {
      showToast(
        "Action failed: " + (err?.message || "Unknown error"),
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeFilter = FILTERS.find((f) => f.key === filter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-black uppercase tracking-wider text-[#C59A2F]">
            Bookings
          </h3>
          <p
            className="text-xs text-neutral-400 mt-1 font-medium"
            style={
              isThemed ? { color: "rgba(255,255,255,0.7)" } : undefined
            }
          >
            {loading
              ? "Loading…"
              : `Manage and review requests for ${bookings.length} ${
                  activeFilter?.label?.toLowerCase() || "total"
                } bookings.`}
          </p>
        </div>
        <button
          type="button"
          onClick={() => fetchBookings()}
          className="p-2.5 rounded-xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
          style={{
            background: `${GOLD}18`,
            border: `1px solid ${GOLD}35`,
            color: GOLD,
          }}
        >
          <FiRefreshCw size={15} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Filter Tabs */}
      <div
        className="flex gap-1.5 p-1.5 rounded-2xl overflow-x-auto bg-neutral-100/50 dark:bg-neutral-950/20 border border-neutral-200/50 dark:border-neutral-800/80"
        style={
          isThemed
            ? {
                background: "transparent",
                borderColor: "rgba(255,255,255,0.14)",
              }
            : undefined
        }
      >
        {FILTERS.map(({ key, label, icon: Icon, color }) => {
          const active = filter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest whitespace-nowrap transition-all duration-300 flex-1 justify-center cursor-pointer"
              style={
                active
                  ? {
                      background: "var(--pill-bg, rgba(197,154,47,0.08))",
                      color,
                      border: `1px solid ${color}30`,
                    }
                  : {
                      color: isThemed
                        ? "#ffffff"
                        : "var(--tab-inactive, rgba(120,120,120,0.7))",
                      background: "transparent",
                    }
              }
            >
              <Icon size={12} />
              <span className="inline">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="space-y-3">
        {loading && bookings.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <div
              className="w-8 h-8 border-4 rounded-full animate-spin"
              style={{ borderColor: `${GOLD}25`, borderTopColor: GOLD }}
            />
            <span
              className="text-xs font-bold uppercase tracking-widest text-neutral-400 dark:text-neutral-500"
              style={
                isThemed ? { color: "rgba(255,255,255,0.7)" } : undefined
              }
            >
              Loading bookings
            </span>
          </div>
        ) : bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-16 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/20"
            style={
              isThemed
                ? {
                    borderColor: "rgba(255,255,255,0.14)",
                    background: "transparent",
                  }
                : undefined
            }
          >
            <FiClock
              size={28}
              className="mb-3 text-neutral-300 dark:text-neutral-700"
              style={
                isThemed ? { color: "rgba(255,255,255,0.5)" } : undefined
              }
            />
            <p
              className="text-sm font-bold text-neutral-400 dark:text-neutral-500"
              style={isThemed ? { color: "#ffffff" } : undefined}
            >
              No {activeFilter?.label?.toLowerCase()} bookings
            </p>
          </motion.div>
        ) : filter === "most_requested" ? (
          <motion.div
            key="trending"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-[2rem] overflow-hidden border shadow-sm"
            style={
              isThemed
                ? {
                    borderColor: "rgba(255,255,255,0.14)",
                    background: "transparent",
                  }
                : {
                    borderColor: "var(--panel-border, rgba(255,255,255,0.9))",
                    background:
                      "var(--profile-card-bg, rgba(255,255,255,0.82))",
                    backdropFilter: "blur(20px)",
                  }
            }
          >
            <div
              className="p-4 flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800"
              style={
                isThemed
                  ? {
                      borderColor:
                        theme?.divider || "rgba(255,255,255,0.1)",
                    }
                  : undefined
              }
            >
              <span
                className="text-xs font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500"
                style={
                  isThemed ? { color: "rgba(255,255,255,0.7)" } : undefined
                }
              >
                Experience
              </span>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowGroupDropdown(!showGroupDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer"
                  style={{
                    background: `${GOLD}18`,
                    border: `1px solid ${GOLD}30`,
                    color: GOLD,
                  }}
                >
                  Group: {mostRequestedGroupBy === "price" ? "Price" : "Date"}
                  <FiChevronDown
                    size={11}
                    className={`transition-transform ${
                      showGroupDropdown ? "rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {showGroupDropdown && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowGroupDropdown(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        className="absolute right-0 top-full mt-1.5 w-36 rounded-2xl overflow-hidden z-50 bg-white border border-neutral-100 dark:bg-neutral-900 dark:border-neutral-800 shadow-lg"
                      >
                        {[
                          { key: "price", label: "Package Price" },
                          { key: "date", label: "Specific Date" },
                        ].map((o) => (
                          <button
                            key={o.key}
                            type="button"
                            onClick={() => {
                              setMostRequestedGroupBy(o.key);
                              setShowGroupDropdown(false);
                            }}
                            className="w-full px-4 py-2.5 text-left text-[10px] font-black uppercase tracking-widest transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
                            style={{
                              color:
                                mostRequestedGroupBy === o.key
                                  ? GOLD
                                  : "var(--tab-inactive, #999)",
                            }}
                          >
                            {o.label}
                          </button>
                        ))}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
              <span
                className="text-xs font-black uppercase tracking-widest text-neutral-400 dark:text-neutral-500"
                style={
                  isThemed ? { color: "rgba(255,255,255,0.7)" } : undefined
                }
              >
                Requests
              </span>
            </div>
            <div
              className="divide-y divide-neutral-100 dark:divide-neutral-800"
              style={
                isThemed
                  ? {
                      borderColor:
                        theme?.divider || "rgba(255,255,255,0.08)",
                    }
                  : undefined
              }
            >
              {groupedBookings.map((g: any, i: number) => (
                <motion.div
                  key={g.key}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 px-5 py-4 transition-colors hover:bg-neutral-50 dark:hover:bg-neutral-950/40"
                >
                  <div
                    className="w-7 h-7 rounded-xl flex items-center justify-center text-[11px] font-black shrink-0"
                    style={
                      i === 0
                        ? { background: `${GOLD}25`, color: GOLD }
                        : {
                            background: "var(--tab-bar-bg, rgba(0,0,0,0.04))",
                            color: "var(--tab-inactive, #999)",
                          }
                    }
                  >
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-black text-sm truncate text-neutral-900 dark:text-neutral-100"
                      style={isThemed ? { color: "#ffffff" } : undefined}
                    >
                      {g.experienceTitle}
                    </p>
                    <p
                      className="text-xs font-bold mt-0.5"
                      style={{ color: GOLD }}
                    >
                      {mostRequestedGroupBy === "price"
                        ? `₹${g.displayValue?.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}`
                        : g.displayValue}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedGroup(g)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    style={{
                      background: `${GOLD}18`,
                      border: `1px solid ${GOLD}30`,
                      color: GOLD,
                    }}
                  >
                    {g.count} <span className="hidden sm:inline">Bookings</span>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {bookings.map((b, idx) => (
              <IndividualBookingCard
                key={b._id}
                b={b}
                idx={idx}
                activeActionId={activeActionId}
                setActiveActionId={setActiveActionId}
                hostResponse={hostResponse}
                setHostResponse={setHostResponse}
                handleAction={handleAction}
                isSubmitting={isSubmitting}
                isThemed={isThemed}
                theme={theme}
              />
            ))}
          </motion.div>
        )}
      </div>

      {/* Group Detail Modal */}
      <AnimatePresence>
        {selectedGroup && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGroup(null)}
              className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 20 }}
              className="relative rounded-[2.5rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh] bg-white border border-neutral-100 dark:bg-neutral-900 dark:border-neutral-800"
            >
              <div
                className="h-[2px]"
                style={{
                  background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
                }}
              />
              <div className="flex items-center justify-between p-6 pb-4">
                <div>
                  <h3 className="text-base font-black uppercase tracking-tight leading-tight text-neutral-900 dark:text-neutral-100">
                    {selectedGroup.experienceTitle}
                  </h3>
                  <span
                    className="inline-block mt-1.5 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-lg"
                    style={{ background: `${GOLD}18`, color: GOLD }}
                  >
                    {mostRequestedGroupBy === "price"
                      ? `₹${selectedGroup.displayValue?.toLocaleString()} Package`
                      : `Date: ${selectedGroup.displayValue}`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedGroup(null)}
                  className="p-2.5 rounded-xl transition-all hover:scale-105 bg-neutral-100 hover:bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:hover:bg-neutral-700 dark:text-neutral-400 cursor-pointer"
                >
                  <FiX size={18} />
                </button>
              </div>
              <div className="overflow-y-auto px-6 pb-6 space-y-2.5">
                {selectedGroup.requests.map((r: any, i: number) => (
                  <motion.div
                    key={r._id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-neutral-50 border border-neutral-100 dark:bg-neutral-950/40 dark:border-neutral-800"
                  >
                    <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border-2 shadow-sm border-neutral-200 dark:border-neutral-800">
                      <img
                        loading="lazy"
                        decoding="async"
                        src={
                          r.guest?.avatar?.url ||
                          `https://ui-avatars.com/api/?name=${r.guest?.firstname}&background=C59A2F&color=fff`
                        }
                        className="w-full h-full object-cover"
                        alt="Guest"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-sm truncate text-neutral-900 dark:text-neutral-100">
                        {r.guest?.firstname} {r.guest?.lastname}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5 text-neutral-400 dark:text-neutral-500">
                        Interested Guest
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className="text-sm font-black"
                        style={{ color: GOLD }}
                      >
                        {mostRequestedGroupBy === "price"
                          ? r.startDate
                            ? new Date(r.startDate).toLocaleDateString("en-IN")
                            : "Flexible"
                          : `₹${(r.totalAmount || 0).toLocaleString("en-IN", {
                              maximumFractionDigits: 2,
                            })}`}
                      </p>
                      {r.platformFee > 0 && (
                        <p className="text-[9px] font-bold mt-0.5 text-neutral-400 dark:text-neutral-500">
                          + ₹
                          {r.platformFee.toLocaleString("en-IN", {
                            maximumFractionDigits: 2,
                          })}{" "}
                          fee
                        </p>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

