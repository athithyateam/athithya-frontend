"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  FiUsers,
  FiMap,
  FiCheckCircle,
  FiActivity,
  FiShoppingBag,
  FiCompass,
  FiArchive,
  FiServer,
  FiSidebar,
  FiMessageSquare,
  FiXCircle,
} from "react-icons/fi";
import { useAuthStore } from "@/stores/auth-store";
import {
  getAdminStatsApi,
  getAdminPendingExperiencesApi,
  getAdminPendingVerificationsApi,
} from "@/lib/api/admin-api";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { MobileFooter } from "@/components/navigation/mobile-footer";
import { AdminOverviewTab } from "@/components/admin/admin-overview-tab";
import { AdminApprovalsTab } from "@/components/admin/admin-approvals-tab";
import { AdminUsersHostsTab } from "@/components/admin/admin-users-hosts-tab";
import { AdminExperiencesBookingsTab } from "@/components/admin/admin-experiences-bookings-tab";
import { AdminSystemTab } from "@/components/admin/admin-system-tab";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: FiActivity },
  { id: "users", label: "Users", icon: FiUsers },
  { id: "experiences", label: "Experiences", icon: FiMap },
  { id: "bookings", label: "Bookings", icon: FiShoppingBag },
  { id: "journeys", label: "Journeys", icon: FiCompass },
  { id: "chat-activity", label: "Chat Activity", icon: FiMessageSquare },
  { id: "approvals", label: "Pending", icon: FiCheckCircle },
  { id: "traffic", label: "Traffic", icon: FiActivity },
  { id: "history", label: "Old Data", icon: FiArchive },
  { id: "health", label: "System Health", icon: FiServer },
];

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<Record<string, any> | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [sidebarVisible, setSidebarVisible] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  const loadSummary = useCallback(async () => {
    try {
      const [statsRes, postsRes, kycRes] = await Promise.all([
        getAdminStatsApi().catch(() => null),
        getAdminPendingExperiencesApi().catch(() => []),
        getAdminPendingVerificationsApi().catch(() => []),
      ]);
      if (statsRes) setStats(statsRes?.statistics || statsRes?.stats || statsRes?.data || statsRes);
      const pCount =
        (postsRes?.experiences?.length ?? postsRes?.posts?.length ?? (Array.isArray(postsRes) ? postsRes.length : 0)) +
        (kycRes?.data?.length ?? kycRes?.verifications?.length ?? kycRes?.users?.length ?? (Array.isArray(kycRes) ? kycRes.length : 0));
      setPendingCount(pCount);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    if (user?.role === "admin") {
      loadSummary();
    }
  }, [user, loadSummary]);

  if (!mounted || authLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-950 transition-colors">
          <div className="w-12 h-12 border-4 border-[#C59A2F] border-t-transparent rounded-full animate-spin" />
        </div>
        <Footer />
        <MobileFooter />
      </>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-neutral-950 p-4 text-center transition-colors">
          <FiXCircle className="text-4xl text-red-500 mb-4" />
          <h1 className="text-2xl font-black text-slate-900 dark:text-neutral-100 uppercase tracking-tighter mb-2">
            Access Denied
          </h1>
          <p className="text-slate-400 dark:text-neutral-500 font-bold text-xs uppercase tracking-widest">
            You must be an administrator to view this page.
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-6 bg-slate-900 dark:bg-neutral-800 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-colors cursor-pointer"
          >
            Go Home
          </button>
        </div>
        <Footer />
        <MobileFooter />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pt-28 pb-16 px-4 md:px-8 transition-colors">
        <div
          className={`${
            sidebarVisible ? "max-w-7xl" : "max-w-full"
          } mx-auto flex flex-col lg:flex-row gap-8 transition-all duration-300`}
        >
          {/* Left Sidebar Navigation matching athithya-app */}
          <aside
            className={`w-full ${
              sidebarVisible ? "lg:w-64" : "lg:hidden"
            } shrink-0 transition-all duration-300`}
          >
            <div className="flex flex-col gap-4 sticky top-24">
              {/* Header */}
              <div className="px-2 flex items-center justify-between">
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-neutral-100 tracking-tight transition-colors">
                    Athithya <span className="text-[#C59A2F]">Admin</span>
                  </h1>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-neutral-500 mt-0.5">
                    Control Panel
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSidebarVisible(false)}
                  title="Hide Sidebar for Full Width View"
                  className="hidden lg:flex p-2 rounded-xl bg-slate-100 dark:bg-neutral-800/80 text-slate-500 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-neutral-100 hover:bg-slate-200 dark:hover:bg-neutral-700 transition-colors items-center justify-center shrink-0 shadow-sm cursor-pointer"
                >
                  <FiSidebar className="text-lg" />
                </button>
              </div>

              {/* Vertical Navigation (Desktop) & Horizontal Scrollable Bar (Mobile) */}
              <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800 p-2 transition-colors gap-1 scrollbar-hide">
                {NAV_ITEMS.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative flex items-center gap-3 px-4 py-3 rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider transition-all shrink-0 lg:shrink text-left z-10 cursor-pointer ${
                        isActive
                          ? "bg-[#C59A2F] text-white shadow-sm"
                          : "text-slate-600 dark:text-neutral-400 hover:text-slate-900 dark:hover:text-neutral-100 hover:bg-slate-50 dark:hover:bg-neutral-800/60"
                      }`}
                    >
                      <span className="text-base flex items-center justify-center shrink-0">
                        <Icon />
                      </span>
                      <span className="truncate">{tab.label}</span>

                      {tab.id === "approvals" && pendingCount > 0 && (
                        <span
                          className={`ml-auto text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-black animate-pulse shrink-0 ${
                            isActive
                              ? "bg-white text-[#C59A2F]"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {pendingCount}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Right Main Content Area */}
          <main className="flex-1 min-w-0">
            {!sidebarVisible && (
              <div className="hidden lg:flex mb-6 items-center justify-between bg-white dark:bg-neutral-900 p-3 rounded-2xl shadow-sm border border-slate-100 dark:border-neutral-800 transition-colors">
                <button
                  type="button"
                  onClick={() => setSidebarVisible(true)}
                  className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#C59A2F] hover:underline cursor-pointer"
                >
                  <FiSidebar size={16} /> Show Sidebar
                </button>
                <span className="text-xs font-bold text-neutral-400 capitalize">
                  Current View: {activeTab}
                </span>
              </div>
            )}

            {activeTab === "overview" && (
              <AdminOverviewTab
                stats={stats}
                pendingCount={pendingCount}
                onSelectTab={setActiveTab}
              />
            )}
            {activeTab === "users" && <AdminUsersHostsTab mode="users" />}
            {activeTab === "experiences" && (
              <AdminExperiencesBookingsTab mode="experiences" />
            )}
            {activeTab === "bookings" && (
              <AdminExperiencesBookingsTab mode="bookings" />
            )}
            {activeTab === "journeys" && (
              <AdminExperiencesBookingsTab mode="journeys" />
            )}
            {activeTab === "chat-activity" && (
              <AdminSystemTab mode="chat" />
            )}
            {activeTab === "approvals" && (
              <AdminApprovalsTab onRefreshCounts={loadSummary} />
            )}
            {activeTab === "traffic" && <AdminSystemTab mode="traffic" />}
            {activeTab === "history" && <AdminUsersHostsTab mode="hosts" />}
            {activeTab === "health" && <AdminSystemTab mode="health" />}
          </main>
        </div>
      </div>
      <Footer />
      <MobileFooter />
    </>
  );
}
