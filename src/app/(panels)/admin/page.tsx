"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShieldAlert,
  Users,
  Compass,
  Calendar,
  Navigation,
  MessageSquare,
  BarChart3,
  History,
  Activity,
  XCircle,
} from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import {
  getAdminStatsApi,
  getAdminPendingExperiencesApi,
  getAdminPendingVerificationsApi,
} from "@/lib/api/admin-api";
import { AdminOverviewTab } from "@/components/admin/admin-overview-tab";
import { AdminApprovalsTab } from "@/components/admin/admin-approvals-tab";
import { AdminUsersHostsTab } from "@/components/admin/admin-users-hosts-tab";
import { AdminExperiencesBookingsTab } from "@/components/admin/admin-experiences-bookings-tab";
import { AdminSystemTab } from "@/components/admin/admin-system-tab";

const NAV_ITEMS = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "approvals", label: "Approvals & KYC", icon: ShieldAlert },
  { id: "users", label: "User Management", icon: Users },
  { id: "experiences", label: "Experiences", icon: Compass },
  { id: "bookings", label: "Bookings", icon: Calendar },
  { id: "journeys", label: "Journey Tracking", icon: Navigation },
  { id: "chat", label: "Chat Activity", icon: MessageSquare },
  { id: "traffic", label: "Traffic & GA4", icon: BarChart3 },
  { id: "hosts", label: "Host History", icon: History },
  { id: "health", label: "System Health", icon: Activity },
];

export default function AdminPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<Record<string, any> | null>(null);
  const [pendingCount, setPendingCount] = useState(0);

  const loadSummary = useCallback(async () => {
    try {
      const [statsRes, postsRes, kycRes] = await Promise.all([
        getAdminStatsApi().catch(() => null),
        getAdminPendingExperiencesApi().catch(() => []),
        getAdminPendingVerificationsApi().catch(() => []),
      ]);
      if (statsRes) setStats(statsRes?.stats || statsRes?.data || statsRes);
      const pCount =
        (postsRes?.experiences?.length ?? postsRes?.posts?.length ?? (Array.isArray(postsRes) ? postsRes.length : 0)) +
        (kycRes?.verifications?.length ?? kycRes?.users?.length ?? (Array.isArray(kycRes) ? kycRes.length : 0));
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
        <div className="w-10 h-10 border-4 border-[#C59A2F] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-50 dark:bg-neutral-950 p-4 text-center">
        <XCircle className="w-12 h-12 text-rose-500 mb-4" />
        <h1 className="text-2xl font-black uppercase tracking-tight mb-2">Access Denied</h1>
        <p className="text-neutral-400 font-bold text-xs uppercase tracking-widest">
          You must be an administrator to view this page.
        </p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="mt-6 bg-neutral-900 dark:bg-neutral-800 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 pt-28 pb-16 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="p-4 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs space-y-1">
            <div className="px-3 py-2 mb-2 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#C59A2F]">
                Athithya Admin Console
              </span>
            </div>
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer ${
                    isActive
                      ? "bg-[#C59A2F] text-white shadow-xs"
                      : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon size={15} />
                    <span>{item.label}</span>
                  </span>
                  {item.id === "approvals" && pendingCount > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white">
                      {pendingCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          {activeTab === "overview" && (
            <AdminOverviewTab stats={stats} pendingCount={pendingCount} onSelectTab={setActiveTab} />
          )}
          {activeTab === "approvals" && <AdminApprovalsTab onRefreshCounts={loadSummary} />}
          {activeTab === "users" && <AdminUsersHostsTab mode="users" />}
          {activeTab === "hosts" && <AdminUsersHostsTab mode="hosts" />}
          {activeTab === "experiences" && <AdminExperiencesBookingsTab mode="experiences" />}
          {activeTab === "bookings" && <AdminExperiencesBookingsTab mode="bookings" />}
          {activeTab === "journeys" && <AdminExperiencesBookingsTab mode="journeys" />}
          {activeTab === "chat" && <AdminSystemTab mode="chat" />}
          {activeTab === "traffic" && <AdminSystemTab mode="traffic" />}
          {activeTab === "health" && <AdminSystemTab mode="health" />}
        </main>
      </div>
    </div>
  );
}
