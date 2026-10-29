"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Star, Trash2, ExternalLink, Compass } from "lucide-react";
import {
  getAdminExperiencesApi,
  updateAdminExperienceApi,
  deleteAdminExperienceApi,
  getAdminBookingsApi,
  updateAdminBookingApi,
  deleteAdminBookingApi,
} from "@/lib/api/admin-api";
import { useFeedbackStore } from "@/stores/feedback-store";

interface AdminExperiencesBookingsTabProps {
  mode: "experiences" | "bookings" | "journeys";
}

export function AdminExperiencesBookingsTab({ mode }: AdminExperiencesBookingsTabProps) {
  const { showToast } = useFeedbackStore();
  const [search, setSearch] = useState("");
  const [experiences, setExperiences] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (mode === "experiences") {
        const res = await getAdminExperiencesApi({ search, limit: 50 });
        setExperiences(
          res?.experiences || res?.posts || res?.data?.experiences || (Array.isArray(res) ? res : [])
        );
      } else {
        const res = await getAdminBookingsApi({ search, limit: 50 });
        const list = res?.bookings || res?.data?.bookings || (Array.isArray(res) ? res : []);
        setBookings(
          mode === "journeys"
            ? list.filter((b: any) => ["confirmed", "in_progress", "started"].includes(b.status))
            : list
        );
      }
    } catch {
      setExperiences([]);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, [mode, search]);

  useEffect(() => {
    const t = setTimeout(loadData, 200);
    return () => clearTimeout(t);
  }, [loadData]);

  const handleToggleFeatured = async (exp: any) => {
    const id = exp._id || exp.id;
    const isFeatured = !exp.isFeatured;
    try {
      await updateAdminExperienceApi(id, { isFeatured });
      showToast(`Experience ${isFeatured ? "featured" : "unfeatured"}`, "success");
      loadData();
    } catch {
      showToast("Failed to update featured flag", "error");
    }
  };

  const handleDeleteExp = async (id: string) => {
    try {
      await deleteAdminExperienceApi(id);
      showToast("Experience deleted", "success");
      loadData();
    } catch {
      showToast("Could not delete experience", "error");
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: string) => {
    try {
      await updateAdminBookingApi(id, { status });
      showToast(`Booking marked ${status}`, "success");
      loadData();
    } catch {
      showToast("Could not update booking", "error");
    }
  };

  const handleDeleteBooking = async (id: string) => {
    try {
      await deleteAdminBookingApi(id);
      showToast("Booking removed", "success");
      loadData();
    } catch {
      showToast("Could not delete booking", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">
            {mode === "experiences"
              ? "Experience & Service Catalog"
              : mode === "journeys"
              ? "Live Journey & OTP Tracking"
              : "Booking Management"}
          </h2>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">
            {mode === "experiences"
              ? "Feature, inspect, or remove listings across Uttarakhand"
              : "Monitor reservations, payments, and trip OTP statuses"}
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title, ID, or guest..."
            className="w-full pl-9 pr-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 text-xs"
          />
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
          ))}
        </div>
      ) : mode === "experiences" ? (
        <div className="space-y-3">
          {experiences.map((exp) => {
            const id = exp._id || exp.id;
            return (
              <div
                key={id}
                className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-bold text-sm">{exp.title}</h4>
                  <p className="text-xs text-neutral-500">
                    {exp.category || exp.postType || "Experience"} • ₹{exp.pricePerPerson || exp.price || 0} •{" "}
                    {exp.location?.city || "Uttarakhand"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleFeatured(exp)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold ${
                      exp.isFeatured
                        ? "bg-[#C59A2F] text-white"
                        : "border border-neutral-200 dark:border-neutral-700 text-neutral-500"
                    }`}
                  >
                    <Star size={12} /> {exp.isFeatured ? "Featured" : "Feature"}
                  </button>
                  <Link
                    href={`/post/${id}`}
                    className="p-2 rounded-full border border-neutral-200 dark:border-neutral-700 hover:border-[#C59A2F]"
                  >
                    <ExternalLink size={13} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeleteExp(id)}
                    className="p-2 rounded-full text-neutral-400 hover:text-rose-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : bookings.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <Compass size={36} className="mx-auto text-neutral-400 mb-2" />
          <p className="text-sm font-bold">No matching bookings found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => {
            const id = b._id || b.id;
            return (
              <div
                key={id}
                className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <h4 className="font-bold text-sm">
                    {b.post?.title || b.experienceTitle || "Booking"} (#{String(id).slice(-6)})
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Guest: {b.guest?.firstname || "Traveler"} • Amount: ₹{b.totalAmount || b.amount || 0} • Status:{" "}
                    <strong className="uppercase text-[#C59A2F]">{b.status}</strong>
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={b.status || "pending"}
                    onChange={(e) => handleUpdateBookingStatus(id, e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-transparent text-xs font-bold"
                  >
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="in_progress">in_progress</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                  <Link href={`/bookings/${id}`} className="p-2 rounded-full border">
                    <ExternalLink size={13} />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDeleteBooking(id)}
                    className="p-2 text-neutral-400 hover:text-rose-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

