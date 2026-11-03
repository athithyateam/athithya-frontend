"use client";

import React, { useState, useEffect, useCallback } from "react";
import { FiCheckCircle, FiExternalLink } from "react-icons/fi";
import Link from "next/link";
import {
  getAdminPendingExperiencesApi,
  updateAdminExperienceStatusApi,
  getAdminPendingVerificationsApi,
  updateAdminVerificationStatusApi,
} from "@/lib/api/admin-api";
import { useFeedbackStore } from "@/stores/feedback-store";
import { ReviewVerificationModal } from "./modals/review-verification-modal";
import { ReviewExperienceModal } from "./modals/review-experience-modal";

interface AdminApprovalsTabProps {
  onRefreshCounts?: () => void;
}

export function AdminApprovalsTab({ onRefreshCounts }: AdminApprovalsTabProps) {
  const { showToast } = useFeedbackStore();
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);
  const [pendingKyc, setPendingKyc] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal inspection states matching athithya-app
  const [selectedVerification, setSelectedVerification] = useState<any>(null);
  const [selectedExperience, setSelectedExperience] = useState<any>(null);

  const loadApprovals = useCallback(async () => {
    setLoading(true);
    try {
      const [postsRes, kycRes] = await Promise.all([
        getAdminPendingExperiencesApi(),
        getAdminPendingVerificationsApi(),
      ]);
      setPendingPosts(
        postsRes?.experiences || postsRes?.posts || postsRes?.data?.posts || (Array.isArray(postsRes) ? postsRes : [])
      );
      setPendingKyc(
        kycRes?.data || kycRes?.verifications || kycRes?.users || kycRes?.data?.verifications || (Array.isArray(kycRes) ? kycRes : [])
      );
    } catch {
      setPendingPosts([]);
      setPendingKyc([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApprovals();
  }, [loadApprovals]);

  const handlePostDecision = async (id: string, status: "approved" | "rejected") => {
    try {
      const backendStatus = status === "approved" ? "active" : "inactive";
      await updateAdminExperienceStatusApi(id, {
        status: backendStatus,
        remarks:
          status === "rejected"
            ? "Does not meet Athithya quality guidelines"
            : "Approved by administrator",
      });
      showToast(`Experience ${status === "approved" ? "approved & published" : "rejected"}!`, "success");
      await loadApprovals();
      onRefreshCounts?.();
    } catch (err: any) {
      showToast(err?.message || "Failed to update post status", "error");
    }
  };

  const handleKycDecision = async (userId: string, status: "approved" | "rejected") => {
    try {
      await updateAdminVerificationStatusApi(userId, {
        status,
        rejectionReason: status === "rejected" ? "Incomplete KYC verification documents" : undefined,
      });
      showToast(`Host verification ${status}!`, "success");
      loadApprovals();
      onRefreshCounts?.();
    } catch (err: any) {
      showToast(err?.message || "Failed to update KYC status", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="w-8 h-8 border-4 border-[#C59A2F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isEmpty = pendingPosts.length === 0 && pendingKyc.length === 0;

  return (
    <div className="space-y-10">
      {isEmpty ? (
        <div className="bg-white dark:bg-neutral-900 rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100 dark:border-neutral-800 transition-colors">
          <div className="w-20 h-20 bg-slate-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors">
            <FiCheckCircle size={40} className="text-[#C59A2F]" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-neutral-100 uppercase tracking-tighter transition-colors">
            All caught up!
          </h3>
          <p className="text-slate-400 dark:text-neutral-500 font-bold text-xs uppercase tracking-widest mt-2 transition-colors">
            No items awaiting approval.
          </p>
        </div>
      ) : (
        <div className="space-y-12">
          {/* Pending Host Verifications Section matching athithya-app */}
          {pendingKyc.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 px-4">
                <span className="w-12 h-[2px] bg-[#C59A2F]" />
                <h3 className="text-sm font-black text-slate-900 dark:text-neutral-100 uppercase tracking-[0.3em]">
                  Host Applications ({pendingKyc.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingKyc.map((user) => {
                  const id = user._id || user.id || user.userId;
                  const isProfileUpdate =
                    user.hostStatus === "approved" &&
                    !!(user.pendingHostDetails && Object.keys(user.pendingHostDetails).length > 0);
                  const details = isProfileUpdate
                    ? { ...(user.hostDetails || {}), ...(user.pendingHostDetails || {}) }
                    : user.hostDetails || {};
                  const displayFirstname =
                    isProfileUpdate && user.pendingHostDetails?.firstname
                      ? user.pendingHostDetails.firstname
                      : user.firstname;
                  const displayLastname =
                    isProfileUpdate && user.pendingHostDetails?.lastname
                      ? user.pendingHostDetails.lastname
                      : user.lastname;
                  const displayAvatar =
                    (isProfileUpdate && user.pendingHostDetails?.avatar?.url) || user.avatar?.url;

                  return (
                    <div
                      key={id}
                      className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-50 dark:border-neutral-800 transition-colors"
                    >
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-neutral-800 flex items-center justify-center text-[#C59A2F] text-xl font-black transition-colors overflow-hidden shrink-0">
                          {displayAvatar ? (
                            <img src={displayAvatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            displayFirstname?.[0] || "H"
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-lg font-black text-slate-900 dark:text-neutral-100 leading-tight transition-colors">
                              {displayFirstname} {displayLastname}
                            </h4>
                            {isProfileUpdate ? (
                              <span className="px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-blue-50 text-blue-600 border border-blue-100 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800">
                                Update
                              </span>
                            ) : (
                              <span className="px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                                New
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest transition-colors">
                            {isProfileUpdate ? "Update requested" : "Applied"} on{" "}
                            {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-slate-500 dark:text-neutral-400">
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            Phone: {details.phone || user.phone || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500 dark:text-neutral-400">
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            City: {details.city || "N/A"}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-500 dark:text-neutral-400">
                          <span className="text-[10px] font-bold uppercase tracking-widest">
                            Pin Code: {details.pincode || "N/A"}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedVerification(user)}
                        className="w-full bg-[#C59A2F] text-white rounded-2xl py-3.5 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-[#a67f26] shadow-lg shadow-yellow-100 dark:shadow-none cursor-pointer"
                      >
                        {isProfileUpdate ? "Review Updates" : "Review Application"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Pending Experiences Section matching athithya-app */}
          {pendingPosts.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 px-4">
                <span className="w-12 h-[2px] bg-[#C59A2F]" />
                <h3 className="text-sm font-black text-slate-900 dark:text-neutral-100 uppercase tracking-[0.3em]">
                  Experience Submissions ({pendingPosts.length})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingPosts.map((post) => {
                  const id = post._id || post.id;
                  const coverPhoto =
                    post.photos?.[0]?.url || post.coverImage?.url || post.images?.[0] || "";

                  return (
                    <div
                      key={id}
                      className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-6 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-50 dark:border-neutral-800 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        {coverPhoto && (
                          <div className="h-44 w-full rounded-2xl overflow-hidden mb-4 bg-neutral-100 dark:bg-neutral-800">
                            <img src={coverPhoto} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest bg-amber-50 text-[#C59A2F] border border-amber-100 dark:bg-amber-950/20">
                            {post.postType || post.category || "Experience"}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            By {post.user?.firstname || post.host?.firstname || "Host"}
                          </span>
                        </div>
                        <h4 className="text-lg font-black text-slate-900 dark:text-neutral-100 leading-tight mb-2">
                          {post.title}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-neutral-400 line-clamp-2 mb-4">
                          {post.description}
                        </p>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-6">
                          <span>₹{post.price?.perPerson || post.price || 0} / person</span>
                          <span>{post.location?.city || "Uttarakhand"}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Link
                          href={`/post/${id}`}
                          className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 text-slate-600 dark:text-neutral-300 hover:border-[#C59A2F]"
                        >
                          <FiExternalLink /> Preview Experience
                        </Link>
                        <button
                          type="button"
                          onClick={() => setSelectedExperience(post)}
                          className="w-full bg-[#C59A2F] text-white rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-[#a67f26] flex items-center justify-center gap-1 cursor-pointer"
                        >
                          Review Experience
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Review Host Application Modal */}
      {selectedVerification && (
        <ReviewVerificationModal
          user={selectedVerification}
          onClose={() => setSelectedVerification(null)}
          onUpdateStatus={handleKycDecision}
        />
      )}

      {/* Review Experience Submission Modal */}
      {selectedExperience && (
        <ReviewExperienceModal
          experience={selectedExperience}
          onClose={() => setSelectedExperience(null)}
          onUpdateStatus={handlePostDecision}
        />
      )}
    </div>
  );
}
