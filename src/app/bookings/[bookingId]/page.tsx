"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Calendar,
  Users,
  MessageSquare,
  CheckCircle2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import {
  getBookingDetails,
  acceptBooking,
  declineBooking,
  requestCancellation,
  approveCancellation,
  sendStartOTP,
  verifyStartOTP,
  sendCompletionOTP,
  verifyCompletionOTP,
} from "@/lib/api/bookings-api";
import { useAuthStore } from "@/stores/auth-store";
import { useFeedbackStore } from "@/stores/feedback-store";
import { Navbar } from "@/components/navigation/navbar";
import { MobileFooter } from "@/components/navigation/mobile-footer";

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ bookingId: string }>;
}) {
  const { bookingId } = use(params);
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const { showToast } = useFeedbackStore();

  const [booking, setBooking] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [otpInput, setOtpInput] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const loadBooking = async () => {
    try {
      const res = await getBookingDetails(bookingId);
      if (res?.success) setBooking(res.data || res.booking);
      else if (res?.booking) setBooking(res.booking);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-900">
        <div className="w-10 h-10 border-4 border-[#D4A017]/20 border-t-[#D4A017] rounded-full animate-spin" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-neutral-900">
        <h2 className="text-2xl font-black text-neutral-900 dark:text-neutral-100 mb-4">
          Booking not found
        </h2>
        <button
          onClick={() => router.back()}
          className="px-6 py-2 bg-[#D4A017] text-white rounded-full font-bold cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const isPending = booking.status === "pending";
  const isAccepted =
    booking.status === "accepted" || booking.status === "confirmed";
  const isDeclined =
    booking.status === "declined" || booking.status === "cancelled";

  const currentUserId = String(currentUser?._id || currentUser?.id || "");
  const isHost =
    currentUserId &&
    String(booking.host?._id || booking.host?.id || booking.host) ===
      currentUserId;
  const isGuest =
    currentUserId &&
    String(booking.guest?._id || booking.guest?.id || booking.guest) ===
      currentUserId;

  const handleHostRespond = async (status: "accepted" | "declined") => {
    setActionLoading(true);
    try {
      const res =
        status === "accepted"
          ? await acceptBooking(bookingId)
          : await declineBooking(bookingId);
      if (res?.success) {
        showToast(`Booking ${status}`, "success");
        loadBooking();
      }
    } catch {
      showToast("Failed to update booking", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelRequest = async () => {
    setActionLoading(true);
    try {
      const res = isHost
        ? await approveCancellation(bookingId)
        : await requestCancellation(bookingId);
      if (res?.success) {
        showToast(res.message || "Cancellation updated", "success");
        loadBooking();
      }
    } catch (err: any) {
      showToast(err?.message || "Action failed", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendOtp = async (mode: "start" | "complete") => {
    setActionLoading(true);
    try {
      const res =
        mode === "start"
          ? await sendStartOTP(bookingId)
          : await sendCompletionOTP(bookingId);
      if (res?.success) {
        showToast("OTP sent to guest!", "success");
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to send OTP", "error");
    } finally {
      setActionLoading(false);
    }
  };

  const handleVerifyOtp = async (mode: "start" | "complete") => {
    if (!otpInput.trim()) return;
    setActionLoading(true);
    try {
      const res =
        mode === "start"
          ? await verifyStartOTP(bookingId, otpInput.trim())
          : await verifyCompletionOTP(bookingId, otpInput.trim());
      if (res?.success) {
        showToast(
          mode === "start" ? "Journey started!" : "Journey completed!",
          "success"
        );
        setOtpInput("");
        loadBooking();
      }
    } catch (err: any) {
      showToast(err?.message || "Invalid OTP", "error");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-20">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-24">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-8 text-sm font-bold text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
        >
          <ArrowLeft size={16} /> BACK TO PREVIOUS
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-neutral-100 dark:bg-neutral-900 dark:border-neutral-800"
        >
          <div
            className={`py-4 px-8 border-b text-center text-xs font-black uppercase tracking-[0.2em] ${
              isAccepted
                ? "bg-green-50 text-green-600 border-green-100"
                : isDeclined
                ? "bg-red-50 text-red-600 border-red-100"
                : "bg-yellow-50 text-yellow-600 border-yellow-100"
            }`}
          >
            Booking Status: {booking.status}
          </div>

          <div className="p-8 md:p-12">
            <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
              <div>
                <h1 className="text-3xl md:text-4xl font-black text-neutral-900 mb-4 dark:text-neutral-100">
                  {booking.postTitle || booking.post?.title || "Experience"}
                </h1>
                <div className="flex flex-wrap items-center gap-3 text-neutral-500 font-bold">
                  {booking.startDate && (
                    <span className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 px-4 py-2 rounded-full text-xs">
                      <Calendar size={14} className="text-[#D4A017]" />
                      {new Date(booking.startDate).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  )}
                  <span className="flex items-center gap-2 bg-neutral-100 dark:bg-neutral-800 px-4 py-2 rounded-full text-xs">
                    <Users size={14} className="text-[#D4A017]" />
                    {booking.numberOfPeople || 1} Explorers
                  </span>
                </div>
              </div>
              <div className="text-left md:text-right bg-[#FFF7E6] dark:bg-neutral-800 p-6 rounded-3xl border border-[#D4A017]/10 w-full md:w-auto">
                <div className="text-[10px] font-black text-[#D4A017] uppercase tracking-widest mb-1">
                  Total Amount
                </div>
                <div className="text-4xl font-black text-neutral-900 dark:text-neutral-100">
                  ₹{Number(booking.totalAmount || 0).toLocaleString("en-IN")}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 py-8 border-y border-neutral-100 dark:border-neutral-800">
              <div
                onClick={() =>
                  (booking.guest?._id || booking.guest?.id) &&
                  router.push(
                    `/profile/${booking.guest._id || booking.guest.id}`
                  )
                }
                className="flex items-center gap-4 cursor-pointer"
              >
                <img
                  src={
                    booking.guest?.avatar?.url ||
                    `https://ui-avatars.com/api/?name=${booking.guest?.firstname || "G"}`
                  }
                  alt=""
                  className="w-16 h-16 rounded-3xl object-cover"
                />
                <div>
                  <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block mb-1">
                    Guest
                  </span>
                  <div className="font-black text-lg uppercase">
                    {booking.guest?.firstname} {booking.guest?.lastname}
                  </div>
                </div>
              </div>

              <div
                onClick={() =>
                  (booking.host?._id || booking.host?.id) &&
                  router.push(`/profile/${booking.host._id || booking.host.id}`)
                }
                className="flex items-center gap-4 md:flex-row-reverse md:text-right cursor-pointer"
              >
                <img
                  src={
                    booking.host?.avatar?.url ||
                    `https://ui-avatars.com/api/?name=${booking.host?.firstname || "H"}`
                  }
                  alt=""
                  className="w-16 h-16 rounded-3xl object-cover"
                />
                <div>
                  <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block mb-1">
                    Host
                  </span>
                  <div className="font-black text-lg uppercase">
                    {booking.host?.firstname} {booking.host?.lastname}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shrink-0">
                  <MessageSquare size={16} className="text-neutral-400" />
                </div>
                <div className="bg-neutral-50 dark:bg-neutral-800/60 p-6 rounded-3xl flex-1">
                  <div className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">
                    Guest&apos;s Message
                  </div>
                  <p className="text-neutral-700 dark:text-neutral-300 font-medium italic">
                    {booking.guestMessage || "No message provided."}
                  </p>
                </div>
              </div>

              {isHost && isPending && (
                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => handleHostRespond("accepted")}
                    disabled={actionLoading}
                    className="flex-1 py-3 rounded-2xl bg-green-600 text-white font-black text-xs uppercase cursor-pointer"
                  >
                    Accept Booking
                  </button>
                  <button
                    onClick={() => handleHostRespond("declined")}
                    disabled={actionLoading}
                    className="flex-1 py-3 rounded-2xl bg-red-600 text-white font-black text-xs uppercase cursor-pointer"
                  >
                    Decline Booking
                  </button>
                </div>
              )}

              {isHost && isAccepted && (
                <div className="p-5 rounded-3xl bg-amber-50/60 dark:bg-neutral-800 border border-[#C59A2F]/30 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-black uppercase text-[#C59A2F]">
                    <ShieldCheck size={16} />
                    <span>Journey OTP Verification</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleSendOtp("start")}
                      disabled={actionLoading}
                      className="px-4 py-2 rounded-xl bg-[#C59A2F] text-white text-xs font-bold cursor-pointer"
                    >
                      Send Start OTP
                    </button>
                    <button
                      onClick={() => handleSendOtp("complete")}
                      disabled={actionLoading}
                      className="px-4 py-2 rounded-xl bg-neutral-900 text-white text-xs font-bold cursor-pointer"
                    >
                      Send Complete OTP
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      placeholder="Enter 6-digit OTP"
                      className="flex-1 rounded-xl border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-3 py-2 text-xs font-bold"
                    />
                    <button
                      onClick={() => handleVerifyOtp("start")}
                      className="px-4 py-2 rounded-xl bg-green-600 text-white text-xs font-bold cursor-pointer"
                    >
                      Verify Start
                    </button>
                    <button
                      onClick={() => handleVerifyOtp("complete")}
                      className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer"
                    >
                      Verify End
                    </button>
                  </div>
                </div>
              )}

              {(isGuest || isHost) && isAccepted && (
                <div className="pt-2 text-right">
                  <button
                    onClick={handleCancelRequest}
                    disabled={actionLoading}
                    className="text-xs font-bold text-red-500 hover:underline cursor-pointer"
                  >
                    {isHost ? "Approve Cancellation" : "Request Cancellation"}
                  </button>
                </div>
              )}

              {!booking.hostResponse && isPending && (
                <div className="flex gap-2 items-center justify-center py-4 text-neutral-400 italic text-sm">
                  <Clock size={15} /> Waiting for host to respond...
                </div>
              )}
            </div>

            <div className="mt-10 pt-6 border-t border-neutral-100 dark:border-neutral-800 text-center text-[10px] font-black text-neutral-400 uppercase tracking-widest">
              Requested on{" "}
              {booking.createdAt
                ? new Date(booking.createdAt).toLocaleDateString()
                : ""}
            </div>
          </div>
        </motion.div>
      </div>
      <MobileFooter />
    </div>
  );
}
