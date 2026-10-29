"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { Minus, Plus, Clock, Calendar as CalendarIcon, Zap, ArrowRight } from "lucide-react";
import { getPlatformFeeRate } from "@/lib/pricing";
import { formatExperienceDuration } from "@/lib/duration-helper";
import { createBooking, verifyPayment } from "@/lib/api/bookings-api";
import { useAuthStore } from "@/stores/auth-store";
import { useFeedbackStore } from "@/stores/feedback-store";
import { useNotificationStore } from "@/stores/notification-store";
import { PostInviteAndSchedule } from "./post-invite-schedule";
import { SuccessModal, BreakdownModal } from "./post-modals";

const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export function BookingWidget({ post }: { post: any }) {
  const { user: currentUser, openAuthModal, fetchUser } = useAuthStore();
  const { showToast } = useFeedbackStore();
  const { fetchNotifications } = useNotificationStore();

  const postId = post?._id || post?.id;
  const isOwner = Boolean(
    currentUser &&
      post?.user &&
      String(currentUser._id || currentUser.id) ===
        String(post.user._id || post.user.id)
  );

  const maxGuests = post?.capacity?.maxPeople || post?.capacity?.guests || 3;
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("10:00");
  const [agreedHost, setAgreedHost] = useState(false);
  const [agreedAthithya, setAgreedAthithya] = useState(false);
  const [triedBooking, setTriedBooking] = useState(false);
  const [useWallet, setUseWallet] = useState(false);

  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingSubmitting, setBookingSubmitting] = useState(false);

  const unitPrice =
    post?.price?.perPerson || post?.price?.amount || post?.price?.total || 0;
  const baseAmount = unitPrice * numberOfPeople;
  const feeRate = getPlatformFeeRate(unitPrice);
  const platformFee = useMemo(() => {
    if (!unitPrice) return 0;
    const rawFee = unitPrice * feeRate;
    const feePerPerson = rawFee < 1 ? Number(rawFee.toFixed(2)) : Math.round(rawFee);
    return post?.price?.perPerson ? feePerPerson * numberOfPeople : feePerPerson;
  }, [unitPrice, feeRate, numberOfPeople, post?.price?.perPerson]);

  const appliedDiscount = useMemo(() => {
    if (!post?.discounts || post.discounts.length === 0) return null;
    const sorted = [...post.discounts].sort(
      (a: any, b: any) => Number(b.threshold) - Number(a.threshold)
    );
    const applicable = sorted.find(
      (d: any) => Number(d.threshold) <= numberOfPeople
    );
    if (!applicable) return null;
    const pct = Number(applicable.percentage);
    const discountAmount = Math.round((baseAmount * pct) / 100);
    return {
      ...applicable,
      percentage: pct,
      discountAmount,
      label: `Group Discount (${pct}%)`,
    };
  }, [post?.discounts, baseAmount, numberOfPeople]);

  const totalAmount = Math.max(
    1,
    baseAmount - (appliedDiscount?.discountAmount || 0) + platformFee
  );

  const experienceDuration = formatExperienceDuration(
    post?.duration,
    post?.price?.period,
    post
  );

  const handleOpenBreakdown = () => {
    if (!currentUser) {
      openAuthModal("login");
      return;
    }
    if (currentUser.role === "host") {
      showToast(
        "Hosts cannot engage with another host's experience. Only guests can.",
        "error"
      );
      return;
    }
    if (!selectedDate || !selectedTime) {
      showToast("Please select both a date and start time", "warning");
      return;
    }
    if (!agreedHost || !agreedAthithya) {
      setTriedBooking(true);
      showToast(
        "Please agree to the host rules and terms & conditions",
        "error"
      );
      return;
    }
    fetchUser();
    setShowBreakdown(true);
  };

  const handleConfirmBooking = async () => {
    if (!currentUser) return;
    setBookingSubmitting(true);
    try {
      const bookingData: any = {
        postId,
        numberOfPeople,
        startDate: selectedDate,
        selectedTime,
        discountAmount: appliedDiscount?.discountAmount || 0,
        discountPercentage: appliedDiscount?.percentage || 0,
        useWallet,
      };
      const res = await createBooking(bookingData);
      if (res.success && res.data?.orderId) {
        setShowBreakdown(false);
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          showToast("Failed to load payment gateway", "error");
          return;
        }
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "",
          amount: res.data.amount * 100,
          currency: res.data.currency || "INR",
          name: "Athithya Experience",
          description: `Booking for ${post.title}`,
          order_id: res.data.orderId,
          handler: async (response: any) => {
            showToast("Verifying payment...", "info");
            const vRes = await verifyPayment({
              ...response,
              bookingId: res.data.bookingId,
            });
            if (vRes.success) {
              setShowSuccessModal(true);
              fetchNotifications();
            } else {
              showToast("Payment verification failed", "error");
            }
          },
          prefill: {
            name: `${currentUser.firstname} ${currentUser.lastname || ""}`,
            email: currentUser.email,
          },
          theme: { color: "#D4A017" },
        };
        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      } else if (res.success) {
        setShowBreakdown(false);
        setShowSuccessModal(true);
        fetchNotifications();
      } else {
        showToast(res.message || "Booking failed", "error");
      }
    } catch (err: any) {
      showToast(err?.message || "Operation failed", "error");
    } finally {
      setBookingSubmitting(false);
    }
  };

  return (
    <>
      <div className="p-6 md:p-7 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-xl space-y-5 transition-colors">
        {!isOwner && (
          <PostInviteAndSchedule
            postId={postId}
            currentUser={currentUser}
            numberOfPeople={numberOfPeople}
            onRequireAuth={() => openAuthModal("login")}
          />
        )}

        <div className="border-b border-neutral-100 dark:border-neutral-800 pb-4 space-y-2.5">
          <div className="flex items-baseline justify-between gap-3 flex-wrap">
            <div className="flex items-baseline gap-2">
              {appliedDiscount && (
                <span className="text-sm font-semibold text-neutral-400 line-through">
                  ₹{Math.round(baseAmount + platformFee).toLocaleString("en-IN")}
                </span>
              )}
              <span className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-neutral-100">
                ₹{Math.round(totalAmount).toLocaleString("en-IN")}
              </span>
              <span className="text-xs font-medium text-neutral-500">
                / person
              </span>
            </div>
            {appliedDiscount && (
              <span className="bg-emerald-50 dark:bg-emerald-500/15 border border-emerald-300 px-3 py-1 rounded-full text-[10px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                {Math.round(appliedDiscount.percentage)}% OFF
              </span>
            )}
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200/70 dark:border-neutral-700/60 text-xs font-semibold">
            <Clock size={14} className="text-[#C59A2F]" />
            <span className="text-neutral-400 text-[11px] font-bold uppercase">
              Duration:
            </span>
            <strong className="font-extrabold">{experienceDuration}</strong>
          </div>
        </div>

        {!isOwner && (
          <>
            <div className="rounded-2xl border border-neutral-300 dark:border-neutral-700 overflow-hidden divide-y divide-neutral-300 dark:divide-neutral-700">
              <div className="grid grid-cols-2 divide-x divide-neutral-300 dark:divide-neutral-700">
                <div className="p-3">
                  <label className="block text-[9px] font-black uppercase tracking-wider mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold outline-none cursor-pointer"
                  />
                </div>
                <div className="p-3">
                  <label className="block text-[9px] font-black uppercase tracking-wider mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full bg-transparent text-xs font-bold outline-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="p-3.5 flex items-center justify-between">
                <div>
                  <label className="block text-[9px] font-black uppercase tracking-wider">
                    Guests / Travelers
                  </label>
                  <p className="text-xs font-bold mt-0.5">
                    {numberOfPeople} guest{numberOfPeople > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    disabled={numberOfPeople <= 1}
                    onClick={() => setNumberOfPeople((p) => Math.max(1, p - 1))}
                    className="w-7 h-7 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center disabled:opacity-25 cursor-pointer"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="font-black text-sm w-4 text-center">
                    {numberOfPeople}
                  </span>
                  <button
                    type="button"
                    disabled={numberOfPeople >= maxGuests}
                    onClick={() =>
                      setNumberOfPeople((p) => Math.min(maxGuests, p + 1))
                    }
                    className="w-7 h-7 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center disabled:opacity-25 cursor-pointer"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-1 text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedHost}
                  onChange={(e) => setAgreedHost(e.target.checked)}
                  className="w-4 h-4 accent-[#C59A2F]"
                />
                <span className={triedBooking && !agreedHost ? "text-red-500" : ""}>
                  I agree to Host Rules
                </span>
              </label>
              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedAthithya}
                  onChange={(e) => setAgreedAthithya(e.target.checked)}
                  className="w-4 h-4 accent-[#C59A2F]"
                />
                <span
                  className={triedBooking && !agreedAthithya ? "text-red-500" : ""}
                >
                  I agree to{" "}
                  <Link href="/terms" className="text-[#C59A2F] underline">
                    Terms & Conditions
                  </Link>
                </span>
              </label>
            </div>

            <button
              type="button"
              onClick={handleOpenBreakdown}
              className="w-full py-4 rounded-2xl bg-[#C59A2F] hover:bg-[#A67F26] text-white font-black text-sm uppercase tracking-wider shadow-lg transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Zap size={16} />
              <span>Book Now</span>
              <ArrowRight size={16} />
            </button>
          </>
        )}
      </div>

      <BreakdownModal
        isOpen={showBreakdown}
        onClose={() => setShowBreakdown(false)}
        baseAmount={baseAmount}
        platformFee={platformFee}
        appliedDiscount={appliedDiscount}
        totalAmount={totalAmount}
        onConfirm={handleConfirmBooking}
        walletBalance={(currentUser as any)?.walletBalance || 0}
        useWallet={useWallet}
        setUseWallet={setUseWallet}
        submitting={bookingSubmitting}
      />

      <SuccessModal
        isOpen={showSuccessModal}
        postTitle={post?.title || "Experience"}
        onClose={() => setShowSuccessModal(false)}
      />
    </>
  );
}
