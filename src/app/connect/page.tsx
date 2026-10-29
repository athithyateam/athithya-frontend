"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Users, Compass, MapPin, Calendar, MessageSquare, UserPlus, Plus } from "lucide-react";
import { listExploreItineraries } from "@/lib/api/posts-api";
import { getGuestsApi, friendRequestApi } from "@/lib/api/users-api";
import { useAuthStore } from "@/stores/auth-store";
import { useFeedbackStore } from "@/stores/feedback-store";

export default function ConnectPage() {
  const router = useRouter();
  const { user, openAuthModal } = useAuthStore();
  const { showToast } = useFeedbackStore();

  const [activeTab, setActiveTab] = useState<"plans" | "travelers">("plans");
  const [search, setSearch] = useState("");
  const [plans, setPlans] = useState<any[]>([]);
  const [travelers, setTravelers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConnectData = useCallback(async () => {
    setLoading(true);
    try {
      const [plansRes, guestsRes] = await Promise.all([
        listExploreItineraries({ search, limit: 24 }),
        getGuestsApi({ search, page: 1, limit: 24 }),
      ]);
      const planList =
        plansRes?.itineraries || plansRes?.data?.itineraries || plansRes?.posts || (Array.isArray(plansRes) ? plansRes : []);
      const guestList =
        guestsRes?.guests || guestsRes?.users || guestsRes?.data?.guests || (Array.isArray(guestsRes) ? guestsRes : []);
      setPlans(planList);
      setTravelers(guestList);
    } catch {
      setPlans([]);
      setTravelers([]);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const t = setTimeout(fetchConnectData, 250);
    return () => clearTimeout(t);
  }, [fetchConnectData]);

  const handleConnect = async (targetId: string) => {
    if (!user) return openAuthModal("login");
    try {
      await friendRequestApi(targetId);
      showToast("Connection request sent!", "success");
    } catch (err: any) {
      showToast(err?.message || "Could not send request", "error");
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-20 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 md:px-8 space-y-8">
        {/* Hero */}
        <div className="p-6 sm:p-10 rounded-3xl bg-neutral-900 text-white border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="px-3 py-1 rounded-full bg-[#C59A2F]/20 text-[#C59A2F] text-xs font-black uppercase tracking-wider">
              Athithya Connect
            </span>
            <h1 className="text-2xl sm:text-4xl font-black">
              Find Fellow Travelers & Join Mountain Plans
            </h1>
            <p className="text-xs sm:text-sm text-neutral-300">
              Explore upcoming traveler itineraries across Uttarakhand, split group costs, and connect with like-minded explorers.
            </p>
          </div>
          <Link
            href="/post?type=plan"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#C59A2F] text-white text-xs font-black uppercase tracking-wider hover:bg-[#A67F26] transition shrink-0"
          >
            <Plus size={16} /> Post Travel Plan
          </Link>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="inline-flex p-1.5 rounded-full bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <button
              type="button"
              onClick={() => setActiveTab("plans")}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition ${
                activeTab === "plans" ? "bg-[#C59A2F] text-white" : "text-neutral-500"
              }`}
            >
              <Compass size={14} /> Open Travel Plans ({plans.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("travelers")}
              className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition ${
                activeTab === "travelers" ? "bg-[#C59A2F] text-white" : "text-neutral-500"
              }`}
            >
              <Users size={14} /> Travelers Directory ({travelers.length})
            </button>
          </div>

          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destination, plan, or traveler..."
              className="w-full pl-10 pr-4 py-2.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 text-xs"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="h-56 rounded-3xl bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
            ))}
          </div>
        ) : activeTab === "plans" ? (
          plans.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
              <p className="text-sm font-bold">No public travel plans match your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan) => {
                const id = plan._id || plan.id;
                const author = plan.user || plan.author || plan.host || {};
                return (
                  <div
                    key={id}
                    className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs flex flex-col justify-between gap-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-neutral-500">
                        <span className="inline-flex items-center gap-1 font-bold text-[#C59A2F]">
                          <MapPin size={13} /> {plan.location?.city || plan.destination || "Uttarakhand"}
                        </span>
                        {plan.startDate && (
                          <span className="inline-flex items-center gap-1">
                            <Calendar size={12} /> {new Date(plan.startDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <Link href={`/post/${id}?type=plan`} className="block font-black text-lg hover:text-[#C59A2F]">
                        {plan.title || "Himalayan Group Expedition"}
                      </Link>
                      <p className="text-xs text-neutral-500 line-clamp-2">{plan.description}</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
                      <Link href={`/profile/${author._id || author.id}`} className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#C59A2F] text-white flex items-center justify-center text-xs font-bold">
                          {(author.firstname?.charAt(0) || "T").toUpperCase()}
                        </div>
                        <span className="text-xs font-bold">{author.firstname || "Traveler"}</span>
                      </Link>
                      <Link
                        href={`/post/${id}?type=plan`}
                        className="px-4 py-1.5 rounded-full bg-[#C59A2F]/15 text-[#C59A2F] text-xs font-black uppercase"
                      >
                        View Plan
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {travelers.map((t) => {
              const id = t._id || t.id;
              return (
                <div
                  key={id}
                  className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 text-center space-y-3"
                >
                  <Link href={`/profile/${id}`} className="block">
                    <div className="w-16 h-16 mx-auto rounded-full bg-[#C59A2F] text-white flex items-center justify-center font-black text-xl overflow-hidden">
                      {t.avatar?.url ? (
                        <img src={t.avatar.url} alt={t.firstname} className="w-full h-full object-cover" />
                      ) : (
                        (t.firstname?.charAt(0) || "T").toUpperCase()
                      )}
                    </div>
                    <h4 className="font-bold text-sm mt-2 capitalize">
                      {t.firstname} {t.lastname}
                    </h4>
                  </Link>
                  <p className="text-xs text-neutral-500 line-clamp-2">{t.bio || "Mountain traveler on Athithya"}</p>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => handleConnect(id)}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#C59A2F] text-white text-xs font-bold"
                    >
                      <UserPlus size={12} /> Connect
                    </button>
                    <button
                      type="button"
                      onClick={() => router.push(`/chat?userId=${id}`)}
                      className="p-2 rounded-full border border-neutral-200 dark:border-neutral-700 hover:border-[#C59A2F]"
                    >
                      <MessageSquare size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
