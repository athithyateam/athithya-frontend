"use client";

import React, { useState } from "react";
import {
  FiX,
  FiCheckCircle,
  FiXCircle,
  FiUser,
  FiPhone,
  FiMapPin,
  FiFileText,
  FiAward,
} from "react-icons/fi";

interface ReviewVerificationModalProps {
  user: any;
  onClose: () => void;
  onUpdateStatus: (userId: string, status: "approved" | "rejected") => Promise<void>;
}

export function ReviewVerificationModal({
  user,
  onClose,
  onUpdateStatus,
}: ReviewVerificationModalProps) {
  const [actionLoading, setActionLoading] = useState(false);

  if (!user) return null;

  const isProfileUpdate =
    user.hostStatus === "approved" &&
    !!(user.pendingHostDetails && Object.keys(user.pendingHostDetails).length > 0);

  const details = isProfileUpdate
    ? { ...(user.hostDetails || {}), ...(user.pendingHostDetails || {}) }
    : user.hostDetails || {};

  const expYears =
    details.yearsOfExperience !== undefined
      ? details.yearsOfExperience
      : user.hostDetails?.yearsOfExperience || 0;

  const displayFirstname =
    isProfileUpdate && user.pendingHostDetails?.firstname
      ? user.pendingHostDetails.firstname
      : user.firstname;
  const displayLastname =
    isProfileUpdate && user.pendingHostDetails?.lastname
      ? user.pendingHostDetails.lastname
      : user.lastname;
  const displayAvatar =
    (isProfileUpdate && user.pendingHostDetails?.avatar?.url) ||
    (typeof user.avatar === "string" ? user.avatar : user.avatar?.url);
  const displayBio =
    isProfileUpdate && user.pendingHostDetails?.description !== undefined
      ? user.pendingHostDetails.description
      : user.description;

  // Documents
  let rawDocs: any[] = [];
  if (
    isProfileUpdate &&
    user.pendingHostDetails?.aadhaarCard &&
    Array.isArray(user.pendingHostDetails.aadhaarCard) &&
    user.pendingHostDetails.aadhaarCard.length > 0
  ) {
    rawDocs = user.pendingHostDetails.aadhaarCard;
  } else if (
    user.hostDetails?.aadhaarCard &&
    Array.isArray(user.hostDetails.aadhaarCard) &&
    user.hostDetails.aadhaarCard.length > 0
  ) {
    rawDocs = user.hostDetails.aadhaarCard;
  } else if (details.aadhaarCard) {
    rawDocs = Array.isArray(details.aadhaarCard) ? details.aadhaarCard : [details.aadhaarCard];
  }

  const aadhaarFiles: string[] = [];
  rawDocs.forEach((doc) => {
    const docUrl = typeof doc === "string" ? doc : doc?.url || doc?.fileUrl || "";
    if (docUrl) aadhaarFiles.push(docUrl);
  });

  const handleAction = async (status: "approved" | "rejected") => {
    setActionLoading(true);
    try {
      await onUpdateStatus(user._id || user.id, status);
      onClose();
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-100 dark:border-neutral-800 transition-colors z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-8 border-b border-slate-50 dark:border-neutral-800 flex items-center justify-between bg-slate-50/50 dark:bg-neutral-800/50 transition-colors shrink-0">
          <div>
            <span className="text-[10px] font-black text-[#C59A2F] uppercase tracking-widest mb-1 block">
              {isProfileUpdate ? "Profile Update Review" : "Verification Review"}
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-neutral-100 tracking-tighter transition-colors">
              {isProfileUpdate ? "Profile Details Update" : "Host Application"}
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
        <div className="p-8 space-y-8 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* User Info */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/40">
                <div className="w-14 h-14 bg-slate-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-[#C59A2F] overflow-hidden shrink-0">
                  {displayAvatar ? (
                    <img src={displayAvatar} alt="Applicant" className="w-full h-full object-cover" />
                  ) : (
                    <FiUser size={24} />
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Applicant Name
                  </p>
                  <p className="text-lg font-black text-slate-900 dark:text-neutral-100">
                    {displayFirstname} {displayLastname}
                  </p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </div>
              </div>

              {displayBio && (
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/40">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    Bio / Description
                  </p>
                  <p className="text-xs text-slate-700 dark:text-neutral-300 font-medium leading-relaxed">
                    {displayBio}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/40">
                <div className="w-14 h-14 bg-slate-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-[#C59A2F]">
                  <FiAward size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Years of Experience
                  </p>
                  <p className="text-lg font-black text-slate-900 dark:text-neutral-100">
                    {expYears} {expYears === 1 ? "Year" : "Years"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/40">
                <div className="w-14 h-14 bg-slate-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-[#C59A2F]">
                  <FiPhone size={24} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Phone Number
                  </p>
                  <p className="text-lg font-black text-slate-900 dark:text-neutral-100">
                    {details.phone || user.phone || "N/A"}
                  </p>
                </div>
              </div>
            </div>

            {/* Address Info */}
            <div className="space-y-4 p-4 rounded-2xl bg-slate-50 dark:bg-neutral-800/40">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-slate-100 dark:bg-neutral-800 rounded-2xl flex items-center justify-center text-[#C59A2F] shrink-0">
                  <FiMapPin size={24} />
                </div>
                <div className="grow">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Current Address
                  </p>
                  <p className="text-sm font-bold text-slate-700 dark:text-neutral-300 leading-relaxed">
                    {details.physicalAddress || "N/A"}
                  </p>

                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">
                    District
                  </p>
                  <p className="text-sm font-bold text-slate-700 dark:text-neutral-300">
                    {details.district || "N/A"}
                  </p>

                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">
                    State
                  </p>
                  <p className="text-sm font-bold text-slate-700 dark:text-neutral-300">
                    {details.state || "Uttarakhand"}
                  </p>

                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">
                    City
                  </p>
                  <p className="text-sm font-bold text-slate-700 dark:text-neutral-300">
                    {details.city || "N/A"}
                  </p>

                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-3">
                    Pin Code
                  </p>
                  <p className="text-sm font-bold text-slate-700 dark:text-neutral-300">
                    {details.pincode || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Aadhaar Documents */}
          <div className="rounded-3xl p-6 bg-slate-50 dark:bg-neutral-800/50 border border-slate-100 dark:border-neutral-800">
            <div className="flex items-center gap-3 mb-4">
              <FiFileText className="text-[#C59A2F]" size={20} />
              <span className="text-sm font-black text-slate-900 dark:text-neutral-100 uppercase tracking-widest">
                Aadhaar Verification Documents
              </span>
            </div>

            {aadhaarFiles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {aadhaarFiles.map((docUrl, idx) => {
                  const isPdf =
                    docUrl.toLowerCase().endsWith(".pdf") ||
                    docUrl.toLowerCase().includes(".pdf?") ||
                    docUrl.toLowerCase().includes("/pdf");

                  return (
                    <div
                      key={idx}
                      className="border border-slate-200 dark:border-neutral-700 p-3 rounded-2xl bg-white dark:bg-neutral-900 space-y-2"
                    >
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Document ({idx + 1})
                        </span>
                        <a
                          href={docUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#C59A2F] hover:underline text-[10px] font-black uppercase tracking-widest"
                        >
                          View Full ↗
                        </a>
                      </div>
                      <a href={docUrl} target="_blank" rel="noopener noreferrer" className="block group">
                        <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 dark:bg-neutral-950 flex items-center justify-center border border-slate-100 dark:border-neutral-800">
                          {isPdf ? (
                            <div className="flex flex-col items-center justify-center text-slate-500 p-4 text-center">
                              <FiFileText size={36} className="mb-2 text-[#C59A2F]" />
                              <span className="text-[10px] font-black uppercase">PDF Document</span>
                              <span className="text-[8px] text-slate-400 mt-1">Click to view/download</span>
                            </div>
                          ) : (
                            <img
                              src={docUrl}
                              alt={`Document ${idx + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          )}
                        </div>
                      </a>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs font-bold text-slate-400">No documents uploaded.</p>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-8 bg-slate-50/50 dark:bg-neutral-800/50 border-t border-slate-50 dark:border-neutral-800 flex flex-col sm:flex-row gap-4 transition-colors shrink-0">
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => handleAction("rejected")}
            className="flex-1 h-14 rounded-2xl border-2 border-red-100 dark:border-red-900/30 text-red-500 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
          >
            <FiXCircle size={18} />
            {actionLoading ? "Processing..." : isProfileUpdate ? "Reject Updates" : "Reject Application"}
          </button>
          <button
            type="button"
            disabled={actionLoading}
            onClick={() => handleAction("approved")}
            className="flex-1 h-14 rounded-2xl bg-[#C59A2F] text-white font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-[#a67f26] transition-all flex items-center justify-center gap-3 disabled:opacity-50 cursor-pointer"
          >
            <FiCheckCircle size={18} />
            {actionLoading ? "Processing..." : isProfileUpdate ? "Approve Updates" : "Approve Verification"}
          </button>
        </div>
      </div>
    </div>
  );
}
