"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Star, CheckCircle2, ExternalLink } from "lucide-react";
import {
  getHostReviewsApi,
  checkReviewEligibilityApi,
  submitReview,
} from "@/lib/api/bookings-api";
import { getOptimizedImage } from "@/lib/image-helper";
import { useAuthStore } from "@/stores/auth-store";
import { useFeedbackStore } from "@/stores/feedback-store";

interface HostReviewsSectionProps {
  host: any;
  hostId?: string;
  postId?: string;
}

export function HostReviewsSection({
  host,
  hostId,
  postId,
}: HostReviewsSectionProps) {
  const router = useRouter();
  const { user: currentUser } = useAuthStore();
  const { showToast } = useFeedbackStore();

  const [loading, setLoading] = useState(false);
  const [hostReviewsData, setHostReviewsData] = useState<any>(null);
  const [displayCount, setDisplayCount] = useState(6);
  const [selectedRatingFilter, setSelectedRatingFilter] = useState("all");

  const [canReview, setCanReview] = useState(false);
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  const actualHostId = hostId || host?._id || host?.id;

  const fetchReviews = async () => {
    if (!actualHostId) return;
    setLoading(true);
    try {
      const res = await getHostReviewsApi(actualHostId);
      if (res?.success) {
        setHostReviewsData(res);
      }
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [actualHostId]);

  useEffect(() => {
    if (currentUser && actualHostId && currentUser.role !== "host") {
      checkReviewEligibilityApi(actualHostId)
        .then((res) => {
          if (res?.canReview || res?.eligible) setCanReview(true);
        })
        .catch(() => {});
    }
  }, [currentUser, actualHostId]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postId) return;
    setSubmittingReview(true);
    try {
      const res = await submitReview({
        postId,
        rating: ratingInput,
        comment: commentInput,
      });
      if (res?.success) {
        showToast("Review submitted!", "success");
        setCommentInput("");
        setCanReview(false);
        fetchReviews();
      }
    } catch (err: any) {
      showToast(err?.message || "Failed to submit review", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

  const hostName = host?.firstname
    ? `${host.firstname} ${host.lastname || ""}`.trim()
    : "Host";
  const reviewsList: any[] = useMemo(
    () => hostReviewsData?.reviews || [],
    [hostReviewsData]
  );
  const avgRating = Number(
    hostReviewsData?.averageRating || host?.hostRating?.average || 0
  );
  const totalCount = Number(
    hostReviewsData?.totalRatings ||
      hostReviewsData?.total ||
      host?.hostRating?.count ||
      reviewsList.length ||
      0
  );

  const filteredReviews = useMemo(() => {
    if (selectedRatingFilter === "all") return reviewsList;
    const targetStar = Number(selectedRatingFilter);
    return reviewsList.filter(
      (r) => Math.round(Number(r.rating) || 5) === targetStar
    );
  }, [reviewsList, selectedRatingFilter]);

  if (!actualHostId) return null;

  return (
    <div id="section-reviews" className="scroll-mt-32 mt-16 pt-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 lg:sticky lg:top-36">
          <div className="p-6 md:p-7 bg-gradient-to-b from-white via-amber-50/20 to-amber-50/40 dark:from-neutral-900 dark:to-neutral-900/60 rounded-3xl border border-neutral-200/90 dark:border-neutral-800 shadow-sm space-y-5">
            <div className="flex items-center gap-4">
              <div
                onClick={() => router.push(`/profile/${actualHostId}`)}
                className="relative shrink-0 cursor-pointer"
              >
                <img
                  src={
                    getOptimizedImage(host?.avatar?.url, {
                      width: 140,
                      height: 140,
                    }) ||
                    `https://ui-avatars.com/api/?name=${host?.firstname || "H"}&background=C59A2F&color=fff`
                  }
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white dark:border-neutral-800 shadow-md ring-2 ring-[#C59A2F]/40"
                  alt={hostName}
                />
                {(host?.isHostVerified || host?.verifiedBadge) && (
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#C59A2F] text-white flex items-center justify-center shadow-md border-2 border-white dark:border-neutral-900">
                    <CheckCircle2 size={12} />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#C59A2F] block">
                  Experience Host
                </span>
                <h4
                  onClick={() => router.push(`/profile/${actualHostId}`)}
                  className="font-extrabold text-neutral-900 text-base sm:text-lg dark:text-neutral-100 truncate mt-0.5 cursor-pointer hover:text-[#C59A2F]"
                >
                  {hostName}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                  Uttarakhand, India
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <div className="p-3 rounded-2xl bg-white/90 dark:bg-neutral-800/80 border border-neutral-200/70 dark:border-neutral-700/60">
                <span className="text-[10px] font-bold text-neutral-400 uppercase block">
                  Rating
                </span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  {avgRating > 0 ? (
                    <>
                      <Star
                        size={13}
                        className="text-[#C59A2F] fill-[#C59A2F]"
                      />
                      <span className="text-sm font-black">
                        {avgRating.toFixed(1)}
                      </span>
                    </>
                  ) : (
                    <span className="text-xs font-bold text-neutral-500">
                      New Host
                    </span>
                  )}
                </div>
              </div>
              <div className="p-3 rounded-2xl bg-white/90 dark:bg-neutral-800/80 border border-neutral-200/70 dark:border-neutral-700/60">
                <span className="text-[10px] font-bold text-neutral-400 uppercase block">
                  Reviews
                </span>
                <span className="text-sm font-black text-[#C59A2F] mt-0.5 block">
                  {totalCount} Verified
                </span>
              </div>
            </div>

            {host?.bio && (
              <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-3">
                &ldquo;{host.bio}&rdquo;
              </p>
            )}

            <button
              type="button"
              onClick={() => router.push(`/profile/${actualHostId}`)}
              className="w-full py-2.5 px-4 bg-[#C59A2F] hover:bg-[#A67F26] text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View Host Profile</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div>
            <h3 className="text-lg md:text-xl font-black text-neutral-900 dark:text-neutral-100">
              Reviews for {hostName}
            </h3>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium mt-0.5">
              Guest feedback and ratings from verified experiences
            </p>
          </div>

          {canReview && (
            <form
              onSubmit={handleReviewSubmit}
              className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 space-y-3"
            >
              <h4 className="text-xs font-black uppercase tracking-wider text-[#C59A2F]">
                Share Your Experience
              </h4>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setRatingInput(s)}
                    className="cursor-pointer"
                  >
                    <Star
                      size={18}
                      className={
                        s <= ratingInput
                          ? "fill-[#C59A2F] text-[#C59A2F]"
                          : "text-neutral-300"
                      }
                    />
                  </button>
                ))}
              </div>
              <textarea
                rows={2}
                value={commentInput}
                onChange={(e) => setCommentInput(e.target.value)}
                placeholder="Write your feedback..."
                className="w-full rounded-xl p-3 text-xs border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 outline-none"
              />
              <button
                type="submit"
                disabled={submittingReview}
                className="px-5 py-2 rounded-xl bg-[#C59A2F] text-white text-xs font-black uppercase cursor-pointer"
              >
                {submittingReview ? "Submitting..." : "Post Review"}
              </button>
            </form>
          )}

          {reviewsList.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {["all", "5", "4", "3", "2", "1"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedRatingFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedRatingFilter === tab
                      ? "bg-[#C59A2F] text-white"
                      : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                  }`}
                >
                  {tab === "all" ? `All (${reviewsList.length})` : `${tab} ★`}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="py-8 text-center text-xs font-bold text-neutral-400">
              Loading reviews...
            </div>
          ) : filteredReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredReviews.slice(0, displayCount).map((r: any) => {
                const reviewerName = r.reviewer?.firstname
                  ? `${r.reviewer.firstname} ${r.reviewer.lastname || ""}`.trim()
                  : "Verified Guest";
                const starCount = Math.min(
                  5,
                  Math.max(1, Math.round(Number(r.rating || 5)))
                );
                return (
                  <div
                    key={r._id || r.id}
                    className="bg-neutral-50/70 dark:bg-neutral-900/60 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-800 space-y-2.5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-sm">{reviewerName}</p>
                        <div className="flex items-center gap-1 mt-0.5 text-[#EAB308]">
                          {[1, 2, 3, 4, 5].map((idx) => (
                            <Star
                              key={idx}
                              size={12}
                              className={
                                idx <= starCount
                                  ? "fill-[#EAB308] text-[#EAB308]"
                                  : "text-neutral-200 dark:text-neutral-700"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-[11px] text-neutral-400">
                        {r.createdAt
                          ? new Date(r.createdAt).toLocaleDateString("en-GB", {
                              month: "short",
                              year: "numeric",
                            })
                          : ""}
                      </p>
                    </div>
                    {r.comment && (
                      <p className="text-xs md:text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                        {r.comment}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-6 px-5 bg-neutral-50 dark:bg-neutral-900/40 rounded-2xl border border-neutral-100 dark:border-neutral-800 text-center">
              <p className="text-sm font-medium text-neutral-500">
                No reviews yet for this host.
              </p>
            </div>
          )}

          {filteredReviews.length > displayCount && (
            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={() => setDisplayCount((p) => p + 6)}
                className="text-xs font-bold border border-neutral-200 dark:border-neutral-700 px-6 py-2.5 rounded-full cursor-pointer"
              >
                Show more reviews
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
