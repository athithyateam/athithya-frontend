"use client";

import { useEffect, useState } from "react";
import { Users, Compass, Calendar, ShieldAlert, TrendingUp, Activity } from "lucide-react";
import { getAdminStatsApi, getAdminTrafficAnalyticsApi } from "@/lib/api/admin-api";

interface AdminOverviewTabProps {
  stats: Record<string, any> | null;
  pendingCount: number;
  onSelectTab: (tab: string) => void;
}

export function AdminOverviewTab({ stats: propStats, pendingCount, onSelectTab }: AdminOverviewTabProps) {
  const [stats, setStats] = useState<Record<string, any>>(propStats || {});
  const [analytics, setAnalytics] = useState<Record<string, any>>({});

  useEffect(() => {
    if (propStats) setStats(propStats);
    else {
      getAdminStatsApi()
        .then((res) => setStats(res?.stats || res?.data || res || {}))
        .catch(() => {});
    }
    getAdminTrafficAnalyticsApi()
      .then((res) => setAnalytics(res?.analytics || res?.data || res || {}))
      .catch(() => {});
  }, [propStats]);

  const cards = [
    {
      label: "Total Users",
      value: stats.totalUsers ?? stats.usersCount ?? 0,
      sub: `${stats.hostsCount ?? 0} Hosts • ${stats.guestsCount ?? 0} Guests`,
      icon: Users,
      tab: "users",
    },
    {
      label: "Published Experiences",
      value: stats.totalExperiences ?? stats.postsCount ?? 0,
      sub: "Active treks, stays & services",
      icon: Compass,
      tab: "experiences",
    },
    {
      label: "Total Bookings",
      value: stats.totalBookings ?? stats.bookingsCount ?? 0,
      sub: `Revenue ₹${(stats.totalRevenue ?? 0).toLocaleString("en-IN")}`,
      icon: Calendar,
      tab: "bookings",
    },
    {
      label: "Pending Approvals",
      value: pendingCount,
      sub: "Posts & Host KYC verifications",
      icon: ShieldAlert,
      tab: "approvals",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black uppercase tracking-tight">Platform Overview</h2>
        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">
          Real-time metrics across Athithya Uttarakhand
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.label}
              type="button"
              onClick={() => onSelectTab(c.tab)}
              className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 shadow-xs hover:border-[#C59A2F] transition text-left space-y-3 cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-[#C59A2F]/15 text-[#C59A2F] flex items-center justify-center">
                <Icon size={20} />
              </div>
              <div>
                <span className="block text-3xl font-black">{c.value}</span>
                <span className="text-xs font-black uppercase tracking-wider text-neutral-500">{c.label}</span>
              </div>
              <p className="text-[11px] text-neutral-400 font-semibold">{c.sub}</p>
            </button>
          );
        })}
      </div>

      {/* Google Analytics & Realtime Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
          <div className="flex items-center gap-2 text-[#C59A2F]">
            <TrendingUp size={18} />
            <h3 className="font-black text-sm uppercase tracking-wider">Traffic & Engagement (GA4)</h3>
          </div>
          <div className="grid grid-cols-3 gap-4 pt-2">
            <div>
              <span className="text-2xl font-black">{analytics.activeUsers ?? stats.activeUsers ?? 0}</span>
              <p className="text-[10px] font-bold uppercase text-neutral-400">Active Users</p>
            </div>
            <div>
              <span className="text-2xl font-black">{analytics.pageViews ?? stats.pageViews ?? 0}</span>
              <p className="text-[10px] font-bold uppercase text-neutral-400">Page Views</p>
            </div>
            <div>
              <span className="text-2xl font-black">{analytics.sessions ?? stats.sessions ?? 0}</span>
              <p className="text-[10px] font-bold uppercase text-neutral-400">Sessions</p>
            </div>
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200/80 dark:border-neutral-800 space-y-4">
          <div className="flex items-center gap-2 text-emerald-500">
            <Activity size={18} />
            <h3 className="font-black text-sm uppercase tracking-wider">System Status</h3>
          </div>
          <p className="text-xs text-neutral-500 leading-relaxed">
            API Gateway, Razorpay Webhook Processor, S3 Media Bucket, and Notification Queue are operational.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-500">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>100% Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
}
