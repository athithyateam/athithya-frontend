"use client";

import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiClock,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import {
  getMyGuestSchedulesApi,
  deleteGuestScheduleApi,
} from "@/lib/api/bookings-api";
import { useFeedbackStore } from "@/stores/feedback-store";
import { ExperienceCard } from "@/components/cards/experience-card";
import { ProfileTheme } from "./profile-shared";

const formatTimeTo12Hour = (timeStr: string) => {
  if (!timeStr) return "";
  const [hoursStr, minutesStr] = timeStr.split(":");
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr || "00";
  if (isNaN(hours)) return timeStr;
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
  return `${formattedHours}:${minutes} ${ampm}`;
};

interface ScheduledExperiencesTabProps {
  isThemed?: boolean;
  theme?: ProfileTheme;
}

export function ScheduledExperiencesTab({
  isThemed,
}: ScheduledExperiencesTabProps) {
  const router = useRouter();
  const { showToast } = useFeedbackStore();
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setDeletingId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchSchedules = async (isInitial = false) => {
    if (isInitial && schedules.length === 0) setLoading(true);
    try {
      const res = await getMyGuestSchedulesApi();
      if (res?.success || res?.schedules) {
        setSchedules(res.schedules || res.data?.schedules || []);
      }
    } catch (err) {
      console.error("Failed to fetch guest schedules:", err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules(true);
    const interval = setInterval(() => fetchSchedules(false), 20000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const [scheduleToUnschedule, setScheduleToUnschedule] = useState<
    string | null
  >(null);

  const confirmUnschedule = async () => {
    if (!scheduleToUnschedule) return;
    const scheduleId = scheduleToUnschedule;
    setScheduleToUnschedule(null);
    setDeletingId(scheduleId);
    try {
      const res = await deleteGuestScheduleApi(scheduleId);
      if (res?.success !== false) {
        showToast("Experience unscheduled", "info");
        setSchedules((prev) => prev.filter((s) => s._id !== scheduleId));
      }
    } catch (err: any) {
      showToast(
        err?.response?.data?.message || err?.message || "Failed to unschedule",
        "error"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const handleEditSchedule = (e: React.MouseEvent, post: any) => {
    e.stopPropagation();
    const postId = post._id || post.id || post;
    const postType = post.postType || "experience";
    router.push(`/post/${postId}?type=${postType}&scheduleMode=true`);
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft } = scrollRef.current;
      const scrollTo =
        direction === "left" ? scrollLeft - 320 : scrollLeft + 320;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <div className="space-y-6 pt-6 pb-24 md:pb-6">
      <div className="flex justify-between items-center">
        <div>
          <h3
            className="text-lg font-black uppercase tracking-wider text-[#C59A2F]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            Scheduled Experiences
          </h3>
          <p
            className="text-xs text-neutral-400 mt-1 font-medium"
            style={{ color: isThemed ? "#ffffff" : undefined }}
          >
            Experiences you have planned to visit in the future.
          </p>
        </div>

        {!loading && schedules.length > 0 && (
          <div className="hidden md:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              className="p-2 w-9 h-9 rounded-full border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-400 dark:text-neutral-500 hover:text-[#C59A2F] dark:hover:text-[#C59A2F] transition-all flex items-center justify-center shadow-xs cursor-pointer"
              style={
                isThemed
                  ? {
                      background: "rgba(255,255,255,0.08)",
                      borderColor: "rgba(255,255,255,0.18)",
                      color: "#ffffff",
                    }
                  : undefined
              }
              title="Scroll Left"
            >
              <FiChevronLeft size={16} />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              className="p-2 w-9 h-9 rounded-full border border-neutral-100 dark:border-neutral-800 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-neutral-400 dark:text-neutral-500 hover:text-[#C59A2F] dark:hover:text-[#C59A2F] transition-all flex items-center justify-center shadow-xs cursor-pointer"
              style={
                isThemed
                  ? {
                      background: "rgba(255,255,255,0.08)",
                      borderColor: "rgba(255,255,255,0.18)",
                      color: "#ffffff",
                    }
                  : undefined
              }
              title="Scroll Right"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div
          className="flex gap-4 md:gap-6 overflow-x-auto pb-6 scrollbar-hide snap-x snap-mandatory w-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="aspect-[4/5] rounded-[1.2rem] md:rounded-[2rem] animate-pulse shrink-0 min-w-[calc(50%-8px)] max-w-[calc(50%-8px)] md:min-w-[280px] md:max-w-[280px] lg:min-w-[310px] lg:max-w-[310px]"
              style={{
                background: isThemed
                  ? "rgba(255,255,255,0.07)"
                  : "var(--skeleton-bg, #f0efee)",
              }}
            />
          ))}
        </div>
      ) : schedules.length === 0 ? (
        <div
          className="col-span-full py-20 flex flex-col items-center justify-center rounded-3xl border-2 border-dashed"
          style={
            isThemed
              ? {
                  borderColor: "rgba(255,255,255,0.14)",
                  background: "transparent",
                }
              : {
                  borderColor: "var(--empty-state-border, #ebebeb)",
                  background: "var(--empty-state-bg, rgba(250,250,251,0.6))",
                }
          }
        >
          <FiClock className="w-10 h-10 mb-3 opacity-30 text-[#C59A2F]" />
          <p
            className="text-xs uppercase tracking-[0.18em] font-black text-neutral-400"
            style={{ color: isThemed ? "#ffffff" : undefined }}
          >
            No scheduled experiences yet
          </p>
          <p
            className="text-[10px] font-medium text-neutral-400 mt-1"
            style={{
              color: isThemed ? "rgba(255,255,255,0.85)" : undefined,
            }}
          >
            Enable &ldquo;Save &amp; Schedule&rdquo; on any experience to
            schedule future visits!
          </p>
        </div>
      ) : (
        <div
          ref={scrollRef}
          className="flex gap-4 md:gap-6 overflow-x-auto pb-12 md:pb-6 scrollbar-hide snap-x snap-mandatory w-full"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {schedules.map((sch) => {
            if (!sch.post) return null;
            return (
              <div
                key={sch._id}
                className="snap-start shrink-0 min-w-[calc(50%-8px)] max-w-[calc(50%-8px)] md:min-w-[280px] md:max-w-[280px] lg:min-w-[310px] lg:max-w-[310px] relative group"
              >
                <ExperienceCard
                  data={sch.post}
                  className="w-full !h-auto"
                  showBookmark={false}
                  scheduledDate={`${sch.scheduledDate} at ${formatTimeTo12Hour(
                    sch.scheduledTime
                  )}`}
                  onEditSchedule={(e: any) => handleEditSchedule(e, sch.post)}
                  onDeleteSchedule={(e: any) => {
                    e.stopPropagation();
                    setScheduleToUnschedule(sch._id);
                  }}
                  isThemed={isThemed}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Custom Theme Confirmation Modal */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {scheduleToUnschedule && (
              <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setScheduleToUnschedule(null)}
                  className={`absolute inset-0 ${
                    isThemed
                      ? "bg-black/35 backdrop-blur-sm"
                      : "bg-black/60 backdrop-blur-sm"
                  }`}
                />
                <motion.div
                  initial={{ opacity: 0, scale: 0.92, y: 24 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: 24 }}
                  onClick={(e) => e.stopPropagation()}
                  className={`relative rounded-[2rem] p-8 w-full max-w-sm shadow-2xl text-center transition-all ${
                    isThemed
                      ? ""
                      : "bg-white dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800"
                  }`}
                  style={
                    isThemed
                      ? {
                          background: "transparent",
                          backgroundColor: "transparent",
                          border: "1px solid rgba(255, 255, 255, 0.22)",
                          boxShadow: "0 16px 40px rgba(0, 0, 0, 0.3)",
                        }
                      : undefined
                  }
                >
                  <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                    <FiTrash2 size={24} className="text-red-500" />
                  </div>
                  <h3
                    className="text-lg font-black uppercase tracking-tight mb-2"
                    style={{ color: isThemed ? "#ffffff" : undefined }}
                  >
                    Unschedule Experience
                  </h3>
                  <p
                    className="text-xs mb-6 leading-relaxed"
                    style={{
                      color: isThemed ? "rgba(255,255,255,0.85)" : undefined,
                    }}
                  >
                    Are you sure you want to unschedule this experience? This
                    will remove your reminder.
                  </p>
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setScheduleToUnschedule(null)}
                      className={`flex-1 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer ${
                        isThemed
                          ? "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                          : "bg-gray-100 dark:bg-neutral-800 text-gray-600 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-700"
                      }`}
                    >
                      No
                    </button>
                    <button
                      type="button"
                      onClick={confirmUnschedule}
                      className="flex-1 px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-widest bg-red-500 text-white hover:bg-red-600 transition-all shadow-lg cursor-pointer"
                    >
                      Yes
                    </button>
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

