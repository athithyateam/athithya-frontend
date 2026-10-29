"use client";

import { useState, useEffect, useCallback } from "react";
import { Check, X, ShieldCheck, FileText, ExternalLink } from "lucide-react";
import Link from "next/link";
import {
  getAdminPendingExperiencesApi,
  updateAdminExperienceStatusApi,
  getAdminPendingVerificationsApi,
  updateAdminVerificationStatusApi,
} from "@/lib/api/admin-api";
import { useFeedbackStore } from "@/stores/feedback-store";

interface AdminApprovalsTabProps {
  onRefreshCounts?: () => void;
}

export function AdminApprovalsTab({ onRefreshCounts }: AdminApprovalsTabProps) {
  const { showToast } = useFeedbackStore();
  const [subTab, setSubTab] = useState<"posts" | "kyc">("posts");
  const [pendingPosts, setPendingPosts] = useState<any[]>([]);
  const [pendingKyc, setPendingKyc] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        kycRes?.verifications || kycRes?.users || kycRes?.data?.verifications || (Array.isArray(kycRes) ? kycRes : [])
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
      await updateAdminExperienceStatusApi(id, {
        status,
        rejectionReason: status === "rejected" ? "Does not meet Athithya quality guidelines" : undefined,
      });
      showToast(`Experience ${status}!`, "success");
      loadApprovals();
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">Approvals & KYC Queue</h2>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">
            Review host experiences and identity verifications
          </p>
        </div>
        <div className="inline-flex p-1.5 rounded-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <button
            type="button"
            onClick={() => setSubTab("posts")}
            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase transition ${
              subTab === "posts" ? "bg-[#C59A2F] text-white" : "text-neutral-500"
            }`}
          >
            Pending Posts ({pendingPosts.length})
          </button>
          <button
            type="button"
            onClick={() => setSubTab("kyc")}
            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase transition ${
              subTab === "kyc" ? "bg-[#C59A2F] text-white" : "text-neutral-500"
            }`}
          >
            Host KYC ({pendingKyc.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-3xl bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
          ))}
        </div>
      ) : subTab === "posts" ? (
        pendingPosts.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <FileText size={36} className="mx-auto text-neutral-400 mb-2" />
            <p className="text-sm font-bold">All experience submissions have been reviewed!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingPosts.map((post) => {
              const id = post._id || post.id;
              return (
                <div
                  key={id}
                  className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-500 text-[10px] font-black uppercase">
                        {post.postType || post.category || "Experience"}
                      </span>
                      <span className="text-xs text-neutral-400">
                        Host: {post.user?.firstname || post.host?.firstname || "Host"}
                      </span>
                    </div>
                    <h4 className="font-bold text-base">{post.title}</h4>
                    <p className="text-xs text-neutral-500 line-clamp-1">{post.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/post/${id}`}
                      className="inline-flex items-center gap-1 px-3 py-2 rounded-full border text-xs font-bold"
                    >
                      Preview <ExternalLink size={12} />
                    </Link>
                    <button
                      type="button"
                      onClick={() => handlePostDecision(id, "approved")}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold"
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePostDecision(id, "rejected")}
                      className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-bold"
                    >
                      <X size={14} /> Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : pendingKyc.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <ShieldCheck size={36} className="mx-auto text-neutral-400 mb-2" />
          <p className="text-sm font-bold">No pending host KYC verifications.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingKyc.map((u) => {
            const id = u._id || u.id || u.userId;
            return (
              <div
                key={id}
                className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-base capitalize">
                    {u.firstname || u.fullName} {u.lastname}
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Email: {u.email} • Phone: {u.phone || "N/A"} • ID Type: {u.verification?.idType || "Govt ID"}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleKycDecision(id, "approved")}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-emerald-600 text-white text-xs font-bold"
                  >
                    <Check size={14} /> Approve Host
                  </button>
                  <button
                    type="button"
                    onClick={() => handleKycDecision(id, "rejected")}
                    className="inline-flex items-center gap-1 px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-bold"
                  >
                    <X size={14} /> Reject
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

