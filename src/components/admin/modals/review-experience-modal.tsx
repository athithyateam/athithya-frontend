"use client";

import React, { useState } from "react";
import { FiX, FiCheckCircle, FiXCircle, FiMapPin, FiCalendar, FiClock } from "react-icons/fi";
import Link from "next/link";

interface ReviewExperienceModalProps {
  experience: any;
  onClose: () => void;
  onUpdateStatus: (expId: string, status: "approved" | "rejected") => Promise<void>;
}

export function ReviewExperienceModal({
  experience,
  onClose,
  onUpdateStatus,
}: ReviewExperienceModalProps) {
  const [actionLoading, setActionLoading] = useState(false);

  if (!experience) return null;

  const handleAction = async (status: "approved" | "rejected") => {
    setActionLoading(true);
    try {
      await onUpdateStatus(experience._id || experience.id, status);
      onClose();
    } finally {
      setActionLoading(false);
    }
  };

  const photos = experience.photos || experience.images || [];
  const price = experience.price?.perPerson || experience.price || 0;
  const duration = experience.duration?.hours || experience.duration?.days || experience.duration || 1;
  const period = experience.price?.period || "hour";

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-neutral-900 w-full max-w-3xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-neutral-800 transition-colors z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-slate-50 dark:border-neutral-800 flex items-center justify-between bg-slate-50/50 dark:bg-neutral-800/50 transition-colors shrink-0">
          <div>
            <span className="text-[10px] font-black text-[#C59A2F] uppercase tracking-widest mb-1 block">
              Experience Submission Review
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-neutral-100 tracking-tighter transition-colors">
              {experience.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-12 h-12 rounded-2xl bg-white dark:bg-neutral-800 text-slate-400 hover:text-slate-900 dark:hover:text-white shadow-sm flex items-center justify-center transition-all cursor-pointer"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-6 overflow-y-auto flex-1">
          {/* Gallery Carousel / Grid */}
          {photos.length > 0 && (
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">
                Experience Media ({photos.length})
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {photos.map((p: any, i: number) => {
                  const url = typeof p === "string" ? p : p?.url || "";
                  return (
                    <div key={i} className="aspect-video rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Key Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/40 space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Category</span>
              <p className="text-sm font-black text-slate-900 dark:text-neutral-100">
                {experience.postType || experience.category || "Trek"}
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/40 space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Price Per Person</span>
              <p className="text-sm font-black text-[#C59A2F]">₹{price} / {period}</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/40 space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-400">Duration</span>
              <p className="text-sm font-black text-slate-900 dark:text-neutral-100">
                {duration} {period === "day" ? "Days" : "Hours"}
              </p>
            </div>
          </div>

          {/* Description */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-neutral-800/40 space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-400">Short Description</span>
            <p className="text-xs text-slate-700 dark:text-neutral-300 font-medium leading-relaxed">
              {experience.description}
            </p>
          </div>

          {experience.longDescription && (
            <div className="p-5 rounded-2xl bg-slate-50 dark:bg-neutral-800/40 space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-400">Detailed Itinerary & Overview</span>
              <p className="text-xs text-slate-700 dark:text-neutral-300 font-medium whitespace-pre-line leading-relaxed">
                {experience.longDescription}
              </p>
            </div>
          )}

          {/* Location */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-neutral-800/40 space-y-2">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-[#C59A2F]">
              <FiMapPin size={16} /> Location Details
            </div>
            <p className="text-xs text-slate-700 dark:text-neutral-300">
              {experience.location?.address || experience.location?.city || "Uttarakhand, India"}
            </p>
            {experience.location?.startPoint && (
              <p className="text-xs text-slate-500">
                Start: <strong>{experience.location.startPoint}</strong> • End:{" "}
                <strong>{experience.location.endPoint || "Same"}</strong>
              </p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-slate-50/50 dark:bg-neutral-800/50 border-t border-slate-50 dark:border-neutral-800 flex flex-col sm:flex-row gap-4 transition-colors shrink-0">
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => handleAction("rejected")}
            className="flex-1 h-14 rounded-2xl border-2 border-red-100 dark:border-red-900/30 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-950/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
          >
            <FiXCircle size={18} />
            {actionLoading ? "Processing..." : "Reject Submission"}
          </button>
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => handleAction("approved")}
            className="flex-1 h-14 rounded-2xl bg-[#C59A2F] text-white font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-[#a67f26] transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
          >
            <FiCheckCircle size={18} />
            {actionLoading ? "Processing..." : "Approve Experience"}
          </button>
        </div>
      </div>
    </div>
  );
}
