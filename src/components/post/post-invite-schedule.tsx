"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { User, Check, Clock, X } from "lucide-react";
import {
  scheduleExperienceApi,
  checkGuestScheduleApi,
  inviteFriendDirectly,
} from "@/lib/api/bookings-api";
import { getFriendsApi } from "@/lib/api/users-api";
import { useFeedbackStore } from "@/stores/feedback-store";

interface PostInviteScheduleProps {
  postId: string;
  currentUser: any;
  numberOfPeople: number;
  onRequireAuth: () => void;
}

export function PostInviteAndSchedule({
  postId,
  currentUser,
  numberOfPeople,
  onRequireAuth,
}: PostInviteScheduleProps) {
  const router = useRouter();
  const { showToast } = useFeedbackStore();
  const [inviteMode, setInviteMode] = useState(false);
  const [scheduleMode, setScheduleMode] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];
  const [scheduledDate, setScheduledDate] = useState(todayStr);
  const [scheduledTime, setScheduledTime] = useState("09:00");
  const [existingSchedule, setExistingSchedule] = useState<any>(null);
  const [submittingSchedule, setSubmittingSchedule] = useState(false);

  const [friendsList, setFriendsList] = useState<any[]>([]);
  const [selectedFriends, setSelectedFriends] = useState<any[]>([]);
  const [sendingInvites, setSendingInvites] = useState(false);

  useEffect(() => {
    if (currentUser && currentUser.role !== "host" && postId) {
      checkGuestScheduleApi(postId)
        .then((res) => {
          if (res.success && res.isScheduled && res.schedule) {
            setExistingSchedule(res.schedule);
            if (res.schedule.scheduledDate) setScheduledDate(res.schedule.scheduledDate);
            if (res.schedule.scheduledTime) setScheduledTime(res.schedule.scheduledTime);
          }
        })
        .catch(() => {});
    }
  }, [currentUser, postId]);

  useEffect(() => {
    if (currentUser && inviteMode && friendsList.length === 0) {
      getFriendsApi(currentUser._id || currentUser.id)
        .then((res) => {
          const list = (res.data || res.friends || []).filter(
            (f: any) => f.role !== "host"
          );
          setFriendsList(list);
        })
        .catch(() => {});
    }
  }, [currentUser, inviteMode, friendsList.length]);

  const handleSaveSchedule = async () => {
    if (!currentUser) {
      onRequireAuth();
      return;
    }
    setSubmittingSchedule(true);
    try {
      const res = await scheduleExperienceApi({
        postId,
        scheduledDate,
        scheduledTime,
      });
      if (res.success) {
        setExistingSchedule(res.schedule);
        showToast(
          `Experience scheduled for ${scheduledDate} at ${scheduledTime}!`,
          "success"
        );
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to schedule experience", "error");
    } finally {
      setSubmittingSchedule(false);
    }
  };

  const handleSendInvites = async () => {
    if (!currentUser || selectedFriends.length === 0) return;
    setSendingInvites(true);
    try {
      const res = await inviteFriendDirectly(
        postId,
        null,
        null,
        selectedFriends.map((f) => f._id || f.id),
        numberOfPeople
      );
      if (res.success) {
        showToast(`${selectedFriends.length} Invitation(s) sent!`, "success");
        setSelectedFriends([]);
      }
    } catch {
      showToast("Failed to send invitations", "error");
    } finally {
      setSendingInvites(false);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`p-4 rounded-2xl border-2 transition-all ${
          inviteMode
            ? "bg-[#FFD966]/30 border-[#C59A2F]"
            : "bg-[#FFD966]/15 border-[#C59A2F]/40"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-black text-xs md:text-sm uppercase text-neutral-900 dark:text-neutral-100">
              Invite Friends
            </h4>
            <p className="text-[10px] font-bold uppercase text-neutral-600 dark:text-neutral-400">
              Book and invite others
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!currentUser) return onRequireAuth();
              setInviteMode(!inviteMode);
              if (!inviteMode) setScheduleMode(false);
            }}
            className={`w-11 h-6 rounded-full transition-all relative cursor-pointer ${
              inviteMode ? "bg-[#C59A2F]" : "bg-neutral-300"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
                inviteMode ? "left-5.5" : "left-0.5"
              }`}
            />
          </button>
        </div>

        {inviteMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="pt-4 space-y-3"
          >
            {friendsList.length > 0 ? (
              <div className="max-h-36 overflow-y-auto space-y-1.5">
                {friendsList.map((f) => {
                  const fid = f._id || f.id;
                  const isSel = selectedFriends.some((x) => (x._id || x.id) === fid);
                  return (
                    <div
                      key={fid}
                      onClick={() => {
                        if (isSel) {
                          setSelectedFriends((prev) =>
                            prev.filter((x) => (x._id || x.id) !== fid)
                          );
                        } else if (selectedFriends.length < 2) {
                          setSelectedFriends((prev) => [...prev, f]);
                        } else {
                          showToast("Max 2 friends can be invited", "warning");
                        }
                      }}
                      className="flex items-center justify-between p-2 rounded-xl bg-white/80 dark:bg-neutral-800 cursor-pointer text-xs font-bold"
                    >
                      <span>
                        {f.firstname} {f.lastname}
                      </span>
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          isSel ? "bg-[#C59A2F] border-[#C59A2F] text-white" : "border-neutral-300"
                        }`}
                      >
                        {isSel && <Check size={10} />}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[11px] text-neutral-500 text-center py-2">
                No connected friends yet.
              </p>
            )}
            {selectedFriends.length > 0 && (
              <button
                type="button"
                onClick={handleSendInvites}
                disabled={sendingInvites}
                className="w-full py-2.5 bg-[#C59A2F] text-white rounded-xl text-[10px] font-black uppercase tracking-wider cursor-pointer"
              >
                {sendingInvites ? "Sending..." : `Send Invite (${selectedFriends.length})`}
              </button>
            )}
          </motion.div>
        )}
      </div>

      <div
        className={`p-4 rounded-2xl border-2 transition-all ${
          scheduleMode
            ? "bg-[#FFD966]/30 border-[#C59A2F]"
            : "bg-[#FFD966]/15 border-[#C59A2F]/40"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-black text-xs md:text-sm uppercase text-neutral-900 dark:text-neutral-100">
              Save & Schedule
            </h4>
            <p className="text-[10px] font-bold uppercase text-neutral-600 dark:text-neutral-400">
              Plan it now, book it later
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              if (!currentUser) return onRequireAuth();
              setScheduleMode(!scheduleMode);
              if (!scheduleMode) setInviteMode(false);
            }}
            className={`w-11 h-6 rounded-full transition-all relative cursor-pointer ${
              scheduleMode ? "bg-[#C59A2F]" : "bg-neutral-300"
            }`}
          >
            <div
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${
                scheduleMode ? "left-5.5" : "left-0.5"
              }`}
            />
          </button>
        </div>

        {scheduleMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="pt-4 space-y-3"
          >
            <div className="grid grid-cols-2 gap-2">
              <input
                type="date"
                min={todayStr}
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-2.5 py-2 text-xs font-bold"
              />
              <input
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl px-2.5 py-2 text-xs font-bold"
              />
            </div>
            <button
              type="button"
              onClick={handleSaveSchedule}
              disabled={submittingSchedule}
              className="w-full py-2.5 bg-[#C59A2F] text-white rounded-xl font-black text-[11px] uppercase tracking-wider cursor-pointer"
            >
              {existingSchedule ? "Update Schedule" : "Save Schedule"}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
}

