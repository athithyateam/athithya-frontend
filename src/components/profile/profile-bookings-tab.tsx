"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Calendar, Check, X, Compass, Clock, Trash2, ExternalLink } from "lucide-react";
import {
  getGuestBookings,
  getHostBookings,
  acceptBooking,
  declineBooking,
  approveCancellation,
  getMyGuestSchedulesApi,
  deleteGuestScheduleApi,
} from "@/lib/api/bookings-api";
import { useFeedbackStore } from "@/stores/feedback-store";

interface ProfileBookingsTabProps {
  isHost: boolean;
  mode?: "bookings" | "schedules";
}

export function ProfileBookingsTab({ isHost, mode = "bookings" }: ProfileBookingsTabProps) {
  const { showToast } = useFeedbackStore();
  const [bookings, setBookings] = useState<any[]>([]);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (mode === "schedules") {
        const res = await getMyGuestSchedulesApi();
        setSchedules(res?.schedules || res?.data?.schedules || (Array.isArray(res) ? res : []));
      } else if (isHost) {
        const res = await getHostBookings();
        setBookings(res?.bookings || res?.data?.bookings || (Array.isArray(res) ? res : []));
      } else {
        const res = await getGuestBookings();
        setBookings(res?.bookings || res?.data?.bookings || (Array.isArray(res) ? res : []));
      }
    } catch {
      setBookings([]);
      setSchedules([]);
    } finally {
      setLoading(false);
    }
  }, [isHost, mode]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleHostAction = async (id: string, action: "accept" | "decline" | "approve-cancel") => {
    try {
      if (action === "accept") await acceptBooking(id, "Confirmed! Looking forward to hosting you.");
      if (action === "decline") await declineBooking(id, "Unavailable on selected dates.");
      if (action === "approve-cancel") await approveCancellation(id);
      showToast("Booking updated", "success");
      loadData();
    } catch (err: any) {
      showToast(err?.message || "Action failed", "error");
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    try {
      await deleteGuestScheduleApi(id);
      showToast("Scheduled reminder removed", "success");
      loadData();
    } catch {
      showToast("Could not delete schedule", "error");
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-3xl bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
        ))}
      </div>
    );
  }

  if (mode === "schedules") {
    if (schedules.length === 0) {
      return (
        <div className="p-12 text-center rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
          <Clock size={36} className="mx-auto text-neutral-400 mb-3" />
          <h3 className="text-base font-bold">No scheduled experiences</h3>
          <p className="text-xs text-neutral-500 mt-1">
            Experiences you schedule for future dates will appear here.
          </p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {schedules.map((item) => {
          const post = item.post || item.postId || {};
          return (
            <div
              key={item._id || item.id}
              className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-4"
            >
              <div>
                <Link href={`/post/${post._id || post.id || item.postId}`} className="font-bold text-sm hover:text-[#C59A2F]">
                  {post.title || "Scheduled Experience"}
                </Link>
                <p className="text-xs text-neutral-500 flex items-center gap-2 mt-1">
                  <Calendar size={12} className="text-[#C59A2F]" />
                  {item.scheduledDate ? new Date(item.scheduledDate).toLocaleDateString() : "Upcoming"} • {item.scheduledTime || "Flexible"}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteSchedule(item._id || item.id)}
                className="p-2 rounded-full text-neutral-400 hover:text-rose-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="p-12 text-center rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800">
        <Compass size={36} className="mx-auto text-neutral-400 mb-3" />
        <h3 className="text-base font-bold">No active bookings found</h3>
        <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
          When you reserve or host an authentic experience in Uttarakhand, your bookings appear here.
        </p>
        <Link
          href="/explore-experience"
          className="inline-block mt-4 px-5 py-2.5 rounded-full bg-[#C59A2F] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#A67F26]"
        >
          Explore Experiences
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((b) => {
        const id = b._id || b.id;
        const post = b.post || b.service || {};
        const status = b.status || b.bookingStatus || "pending";
        return (
          <div
            key={id}
            className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#C59A2F]/15 text-[#C59A2F]">
                  {status}
                </span>
                <span className="text-xs text-neutral-400">#{String(id).slice(-6)}</span>
              </div>
              <h4 className="font-bold text-base">{post.title || b.experienceTitle || "Himalayan Experience"}</h4>
              <p className="text-xs text-neutral-500">
                Date: {b.startDate ? new Date(b.startDate).toLocaleDateString() : "Flexible"} • Guests: {b.guests || b.numberOfPeople || 1} • Total: ₹{b.totalAmount || b.amount || 0}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {isHost && status === "pending" && (
                <>
                  <button
                    type="button"
                    onClick={() => handleHostAction(id, "accept")}
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold"
                  >
                    <Check size={13} /> Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => handleHostAction(id, "decline")}
                    className="inline-flex items-center gap-1 px-3.5 py-2 rounded-full bg-rose-600 text-white text-xs font-bold"
                  >
                    <X size={13} /> Decline
                  </button>
                </>
              )}
              {isHost && status === "cancellation_requested" && (
                <button
                  type="button"
                  onClick={() => handleHostAction(id, "approve-cancel")}
                  className="px-3.5 py-2 rounded-full bg-amber-600 text-white text-xs font-bold"
                >
                  Approve Cancellation
                </button>
              )}
              <Link
                href={`/bookings/${id}`}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-700 text-xs font-bold hover:border-[#C59A2F]"
              >
                <span>Manage / OTP</span>
                <ExternalLink size={12} />
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

