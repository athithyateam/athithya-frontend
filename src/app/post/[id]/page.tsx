"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  MapPin,
  ChevronDown,
  FileText,
  Shield,
  CheckCircle2,
  Star,
} from "lucide-react";
import {
  getPost,
  getService,
  getItinerary,
  listPosts,
  savePostApi,
  unsavePostApi,
  saveItineraryApi,
  unsaveItineraryApi,
} from "@/lib/api/posts-api";
import { useAuthStore } from "@/stores/auth-store";
import { useFeedbackStore } from "@/stores/feedback-store";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { MobileFooter } from "@/components/navigation/mobile-footer";
import { PostHeroGallery } from "@/components/post/post-hero-gallery";
import { BookingWidget } from "@/components/post/booking-widget";
import { HostReviewsSection } from "@/components/post/host-reviews-section";
import { MapViewer } from "@/components/ui/map-viewer";
import { ExperienceCard } from "@/components/cards/experience-card";

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: postId } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user: currentUser, fetchUser, openAuthModal } = useAuthStore();
  const { showToast } = useFeedbackStore();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isDescriptionOpen, setIsDescriptionOpen] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState("overview");
  const [relatedPosts, setRelatedPosts] = useState<any[]>([]);

  useEffect(() => {
    if (currentUser?.savedPosts) {
      const saved = currentUser.savedPosts.some((item: any) => {
        const idStr = typeof item === "object" ? item._id || item.id : item;
        return String(idStr) === String(postId);
      });
      setIsSaved(saved);
    } else {
      setIsSaved(false);
    }
  }, [currentUser, postId]);

  useEffect(() => {
    let isMounted = true;
    const loadPost = async () => {
      setLoading(true);
      try {
        const currentType = searchParams.get("type") || "experience";
        let res: any;
        if (currentType === "service") {
          res = await getService(postId);
        } else if (currentType === "plan") {
          res = await getItinerary(postId);
        } else {
          res = await getPost(postId);
        }

        const data =
          res?.experience ||
          res?.service ||
          res?.post ||
          res?.trek ||
          res?.itinerary ||
          res?.data ||
          res;

        if (isMounted && data?._id) {
          setPost(data);
          const cats = data.categories || [];
          if (cats.length > 0) {
            listPosts({ categories: cats.join(","), limit: 8 })
              .then((r: any) => {
                const list = (r?.posts || r?.data || []).filter(
                  (p: any) => p._id !== postId
                );
                if (isMounted) setRelatedPosts(list.slice(0, 4));
              })
              .catch(() => {});
          }
        } else if (isMounted) {
          setError("Experience not found");
        }
      } catch {
        if (isMounted) setError("Failed to load experience details");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadPost();
    return () => {
      isMounted = false;
    };
  }, [postId, searchParams]);

  const handleToggleSave = async () => {
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
    try {
      const isPlan =
        (searchParams.get("type") || post?.postType) === "plan";
      if (!isSaved) {
        if (isPlan) await saveItineraryApi(postId);
        else await savePostApi(postId);
        showToast("Experience saved to your profile!", "success");
      } else {
        if (isPlan) await unsaveItineraryApi(postId);
        else await unsavePostApi(postId);
        showToast("Experience removed from saved", "success");
      }
      await fetchUser();
    } catch {
      showToast("Failed to save experience", "error");
    }
  };

  const scrollToSection = (tabId: string) => {
    setActiveNavTab(tabId);
    const el = document.getElementById(`section-${tabId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
        <div className="w-10 h-10 border-4 border-[#C59A2F]/20 border-t-[#C59A2F] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-white dark:bg-neutral-950">
        <h2 className="text-xl font-black uppercase mb-4">
          {error || "Not Found"}
        </h2>
        <button
          onClick={() => router.back()}
          className="px-8 py-3 bg-neutral-900 text-white rounded-full font-black text-xs uppercase cursor-pointer"
        >
          Go Back
        </button>
      </div>
    );
  }

  const locationText = [
    post.location?.city,
    post.location?.state,
    post.location?.country,
  ]
    .filter(Boolean)
    .join(", ");

  const navTabs = [
    { id: "overview", label: "Overview", icon: <FileText size={14} />, show: true },
    {
      id: "rules",
      label: "Rules",
      icon: <Shield size={14} />,
      show: Boolean(post?.privacyPolicy?.length),
    },
    {
      id: "amenities",
      label: "Amenities",
      icon: <CheckCircle2 size={14} />,
      show: Boolean(post?.amenities?.length),
    },
    {
      id: "location",
      label: "Location",
      icon: <MapPin size={14} />,
      show: Boolean(post?.location?.coordinates?.coordinates),
    },
    { id: "reviews", label: "Reviews", icon: <Star size={14} />, show: true },
  ].filter((t) => t.show);

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />

      <main className="flex-1 max-w-[1320px] w-full mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-28 pb-16 space-y-6">
        <PostHeroGallery
          post={post}
          onBack={() => router.back()}
          isSaved={isSaved}
          onToggleSave={handleToggleSave}
        />

        <div className="text-left space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {post.categories?.length > 0 ? (
              post.categories.map((cat: string, idx: number) => (
                <span
                  key={idx}
                  className="bg-[#C59A2F]/10 text-[#C59A2F] border border-[#C59A2F]/20 px-3 py-1 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-wider"
                >
                  {cat}
                </span>
              ))
            ) : (
              <span className="bg-[#C59A2F]/10 text-[#C59A2F] border border-[#C59A2F]/20 px-3 py-1 rounded-full text-[10px] md:text-[11px] font-black uppercase tracking-wider">
                {post.postType || "Experience"}
              </span>
            )}
          </div>

          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">
            {post.title}
          </h1>

          {locationText && (
            <div className="flex items-center gap-1.5 text-xs md:text-sm font-semibold text-neutral-700 dark:text-neutral-300 pb-2">
              <MapPin className="text-[#C59A2F] shrink-0" size={14} />
              <span>{locationText}</span>
            </div>
          )}
        </div>

        <div className="sticky top-16 md:top-20 z-20 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-md py-2 border-b border-neutral-200/60 dark:border-neutral-800/80">
          <div className="flex items-center overflow-x-auto bg-neutral-100/90 dark:bg-neutral-900 rounded-2xl p-1.5 border border-neutral-200/80 dark:border-neutral-800 gap-1">
            {navTabs.map((tab) => {
              const active = activeNavTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => scrollToSection(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer z-10 ${
                    active
                      ? "text-white"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900"
                  }`}
                >
                  {active && (
                    <motion.div
                      layoutId="experienceTabIndicator"
                      className="absolute inset-0 rounded-xl -z-10 bg-[#C59A2F]"
                    />
                  )}
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 pt-4">
          <div className="lg:col-span-7 xl:col-span-8 space-y-8 min-w-0">
            <div id="section-overview" className="scroll-mt-32 space-y-4">
              <h3 className="text-base md:text-xl font-black uppercase tracking-tight">
                Overview
              </h3>
              <div className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-medium">
                {post.description}
              </div>

              {post.longDescription && (
                <div className="border border-neutral-200/80 dark:border-neutral-800 rounded-2xl overflow-hidden bg-neutral-50/50 dark:bg-neutral-900/40">
                  <button
                    type="button"
                    onClick={() => setIsDescriptionOpen((p) => !p)}
                    className="w-full p-4 md:p-5 flex items-center justify-between text-left cursor-pointer"
                  >
                    <span className="text-sm md:text-base font-black">
                      Description
                    </span>
                    <ChevronDown
                      className={`transition-transform ${
                        isDescriptionOpen ? "rotate-180 text-[#C59A2F]" : ""
                      }`}
                    />
                  </button>
                  {isDescriptionOpen && (
                    <div className="px-4 pb-5 md:px-5 pt-1 text-sm md:text-base leading-relaxed whitespace-pre-wrap border-t border-neutral-200/60 dark:border-neutral-800/60">
                      {post.longDescription}
                    </div>
                  )}
                </div>
              )}
            </div>

            {post.privacyPolicy?.length > 0 && (
              <div id="section-rules" className="scroll-mt-32">
                <h3 className="text-base md:text-xl font-black uppercase tracking-tight mb-4">
                  Rules
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {post.privacyPolicy.map((rule: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-3.5 p-3.5 bg-neutral-50 dark:bg-neutral-900/60 rounded-2xl border border-neutral-100 dark:border-neutral-800"
                    >
                      <CheckCircle2
                        size={14}
                        className="text-[#C59A2F] shrink-0"
                      />
                      <span className="text-xs md:text-sm font-semibold">
                        {rule}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {post.amenities?.length > 0 && (
              <div id="section-amenities" className="scroll-mt-32">
                <h3 className="text-base md:text-xl font-black uppercase tracking-tight mb-4">
                  Amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {post.amenities.map((amenity: string, i: number) => (
                    <div
                      key={i}
                      className="flex items-center gap-3.5 p-3.5 bg-neutral-50 dark:bg-neutral-900/60 rounded-2xl border border-neutral-100 dark:border-neutral-800"
                    >
                      <CheckCircle2
                        size={14}
                        className="text-emerald-500 shrink-0"
                      />
                      <span className="text-xs md:text-sm font-semibold">
                        {amenity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {post.location?.coordinates?.coordinates && (
              <div id="section-location" className="scroll-mt-32 space-y-4">
                <h3 className="text-base md:text-xl font-black uppercase tracking-tight">
                  Pinned Location
                </h3>
                <div className="rounded-3xl overflow-hidden border border-neutral-200/80 dark:border-neutral-800">
                  <MapViewer
                    lat={post.location.coordinates.coordinates[1]}
                    lng={post.location.coordinates.coordinates[0]}
                    city={post.location.city}
                    state={post.location.state}
                    address={post.location.address}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-5 xl:col-span-4 w-full">
            <div className="lg:sticky lg:top-28 z-20">
              <BookingWidget post={post} />
            </div>
          </div>
        </div>

        <HostReviewsSection
          host={post?.user}
          hostId={post?.user?._id || post?.user?.id}
          postId={postId}
        />

        {relatedPosts.length > 0 && (
          <div className="mt-16 pt-8 border-t border-neutral-100 dark:border-neutral-800">
            <h3 className="text-xl font-black uppercase tracking-tight mb-6">
              Similar <span className="text-[#C59A2F]">Experiences</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {relatedPosts.map((item) => (
                <ExperienceCard key={item._id || item.id} data={item} />
              ))}
            </div>
          </div>
        )}
      </main>

      <Footer />
      <MobileFooter />
    </div>
  );
}
