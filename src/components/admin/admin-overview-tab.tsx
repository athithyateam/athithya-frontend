"use client";

import React, { useState, useEffect } from "react";
import { FiUsers, FiMap, FiShoppingCart, FiGrid, FiSearch } from "react-icons/fi";
import { getAdminStatsApi } from "@/lib/api/admin-api";

interface AdminOverviewTabProps {
  stats: Record<string, any> | null;
  pendingCount?: number;
  onSelectTab?: (tab: string) => void;
}

const colorClasses = {
  blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/20",
  purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/20",
  green: "bg-green-50 text-green-600 dark:bg-green-900/20",
  yellow: "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20",
};

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: "blue" | "purple" | "green" | "yellow";
}) {
  return (
    <div className="bg-white dark:bg-neutral-900 p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-50 dark:border-neutral-800 relative overflow-hidden group hover:border-[#C59A2F]/30 transition-all duration-500">
      <div
        className={`absolute top-0 right-0 w-32 h-32 -mr-8 -mt-8 opacity-5 dark:opacity-10 rounded-full transition-transform duration-700 group-hover:scale-150 ${
          colorClasses[color].split(" ")[0]
        }`}
      />
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div
          className={`p-4 rounded-2xl ${colorClasses[color]} text-xl shadow-lg shadow-current/10 transition-transform group-hover:-translate-y-1`}
        >
          {icon}
        </div>
        <p className="text-4xl font-black text-slate-900 dark:text-neutral-100 tracking-tighter transition-colors">
          {value}
        </p>
      </div>
      <p className="text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest relative z-10 transition-colors">
        {title}
      </p>
    </div>
  );
}

export function AdminOverviewTab({ stats: propStats }: AdminOverviewTabProps) {
  const [stats, setStats] = useState<Record<string, any>>(() => {
    if (!propStats) return {};
    return propStats.statistics || propStats.stats || propStats.data || propStats;
  });
  const [hostSearch, setHostSearch] = useState("");

  useEffect(() => {
    if (propStats) {
      setStats(propStats.statistics || propStats.stats || propStats.data || propStats);
    } else {
      getAdminStatsApi()
        .then((res) => {
          const s = res?.statistics || res?.stats || res?.data || res || {};
          setStats(s);
        })
        .catch(() => {});
    }
  }, [propStats]);

  // Group hostCategoryStats by host (userId) matching athithya-app
  const hostsMap: Record<string, any> = {};
  if (Array.isArray(stats?.hostCategoryStats)) {
    stats.hostCategoryStats.forEach((item: any) => {
      const { userId, firstname, lastname, email, avatar, category, count } = item;
      if (!userId) return;
      if (!hostsMap[userId]) {
        hostsMap[userId] = {
          userId,
          firstname,
          lastname,
          email,
          avatar,
          categories: [],
        };
      }
      hostsMap[userId].categories.push({ category, count: count || 1 });
    });
  }

  const hostRows = Object.values(hostsMap).filter(
    (h: any) =>
      `${h.firstname} ${h.lastname}`.toLowerCase().includes(hostSearch.toLowerCase()) ||
      (h.email || "").toLowerCase().includes(hostSearch.toLowerCase())
  );

  return (
    <div className="space-y-10">
      {/* 3 Main Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers || 0}
          icon={<FiUsers />}
          color="blue"
        />
        <StatCard
          title="Total Experiences"
          value={stats?.totalPosts || 0}
          icon={<FiMap />}
          color="purple"
        />
        <StatCard
          title="Total Bookings"
          value={stats?.totalBookings || 0}
          icon={<FiShoppingCart />}
          color="green"
        />
      </div>

      {/* Row 1: Recent Signups & New Experiences */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Signups */}
        <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-50 dark:border-neutral-800 transition-all duration-500">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-neutral-100 uppercase tracking-tighter transition-colors">
              Recent Signups
            </h3>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl transition-colors">
              <FiUsers />
            </div>
          </div>
          <div className="space-y-6">
            {stats?.activities?.recentUsers?.map((u: any) => (
              <div key={u._id} className="flex items-center gap-4 group">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-50 dark:border-neutral-800 group-hover:border-[#C59A2F] transition-all bg-neutral-100 dark:bg-neutral-800 shrink-0">
                  <img
                    src={
                      u.avatar?.url ||
                      `https://ui-avatars.com/api/?background=C59A2F&color=fff&name=${encodeURIComponent(
                        u.firstname || "User"
                      )}`
                    }
                    className="w-full h-full object-cover"
                    alt=""
                    onError={(e: any) => {
                      e.target.src = `https://ui-avatars.com/api/?background=C59A2F&color=fff&name=${encodeURIComponent(
                        u.firstname || "User"
                      )}`;
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 dark:text-neutral-200 text-sm group-hover:text-[#C59A2F] transition-colors truncate">
                    {u.firstname} {u.lastname}
                  </p>
                  <p className="text-[10px] text-slate-400 dark:text-neutral-500 font-bold uppercase tracking-tight transition-colors">
                    {u.role}
                  </p>
                </div>
                <span className="text-[9px] font-black text-slate-300 dark:text-neutral-600 uppercase shrink-0 transition-colors">
                  {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : ""}
                </span>
              </div>
            ))}
            {(!stats?.activities?.recentUsers || stats.activities.recentUsers.length === 0) && (
              <p className="text-center py-4 text-slate-400 dark:text-neutral-600 text-xs font-bold uppercase tracking-widest">
                No recent signups
              </p>
            )}
          </div>
        </div>

        {/* New Experiences */}
        <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-50 dark:border-neutral-800 lg:col-span-2 transition-all duration-500">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-neutral-100 uppercase tracking-tighter transition-colors">
              New Experiences
            </h3>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 rounded-xl transition-colors">
              <FiMap />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-50 dark:border-neutral-800">
                  <th className="pb-4 text-left text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest transition-colors">
                    Post Title
                  </th>
                  <th className="pb-4 text-left text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest transition-colors">
                    Creator
                  </th>
                  <th className="pb-4 text-left text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest transition-colors">
                    Status
                  </th>
                  <th className="pb-4 text-right text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest px-2 transition-colors">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {(stats?.activities?.recentExperiences || stats?.activities?.recentPosts)?.map(
                  (post: any) => (
                    <tr
                      key={post._id}
                      className="group hover:bg-slate-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                    >
                      <td className="py-4">
                        <p className="font-bold text-slate-900 dark:text-neutral-200 text-sm group-hover:text-[#C59A2F] transition-colors">
                          {post.title}
                        </p>
                        <p className="text-[9px] text-slate-400 dark:text-neutral-500 font-bold uppercase tracking-widest transition-colors">
                          {post.postType || "Experience"}
                        </p>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-2">
                          <img
                            src={
                              post.user?.avatar?.url ||
                              `https://ui-avatars.com/api/?background=C59A2F&color=fff&name=${encodeURIComponent(
                                post.user?.firstname || "Host"
                              )}`
                            }
                            className="w-6 h-6 rounded-full border border-slate-100 dark:border-neutral-700 transition-colors object-cover"
                            alt=""
                            onError={(e: any) => {
                              e.target.src = "https://ui-avatars.com/api/?background=C59A2F&color=fff&name=Host";
                            }}
                          />
                          <span className="text-[10px] font-bold text-slate-600 dark:text-neutral-400 transition-colors">
                            {post.user?.firstname}
                          </span>
                        </div>
                      </td>
                      <td className="py-4">
                        <span
                          className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full transition-colors ${
                            post.status === "active" || post.status === "approved"
                              ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                              : post.status === "pending"
                              ? "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400"
                              : "bg-slate-50 text-slate-400 dark:bg-neutral-800 dark:text-neutral-500"
                          }`}
                        >
                          {post.status}
                        </span>
                      </td>
                      <td className="py-4 text-right text-[9px] font-black text-slate-300 dark:text-neutral-600 uppercase px-2 transition-colors">
                        {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : ""}
                      </td>
                    </tr>
                  )
                )}
                {(!(stats?.activities?.recentExperiences || stats?.activities?.recentPosts) ||
                  (stats?.activities?.recentExperiences || stats?.activities?.recentPosts).length === 0) && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-slate-400 dark:text-neutral-600 text-xs font-bold uppercase tracking-widest"
                    >
                      No recent experiences
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 2: Category Bifurcation & Host Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category count list */}
        <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-50 dark:border-neutral-800 transition-all duration-500">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-neutral-100 uppercase tracking-tighter transition-colors">
              By Category
            </h3>
            <div className="p-2 bg-amber-50 dark:bg-amber-900/20 text-[#C59A2F] rounded-xl transition-colors">
              <FiGrid />
            </div>
          </div>
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2">
            {stats?.categoryStats && Object.keys(stats.categoryStats).length > 0 ? (
              Object.entries(stats.categoryStats)
                .sort((a: any, b: any) => b[1] - a[1])
                .map(([category, count]) => (
                  <div
                    key={category}
                    className="flex items-center justify-between p-3 bg-slate-50/50 dark:bg-neutral-950/20 rounded-2xl border border-slate-100/40 dark:border-neutral-800 transition-colors"
                  >
                    <span className="font-bold text-slate-700 dark:text-neutral-300 text-xs">
                      {category}
                    </span>
                    <span className="px-2.5 py-1 bg-white dark:bg-neutral-800 text-[#C59A2F] text-[10px] font-black rounded-xl shadow-sm border border-slate-100 dark:border-neutral-700">
                      {count as number}
                    </span>
                  </div>
                ))
            ) : (
              <p className="text-center py-8 text-slate-400 dark:text-neutral-600 text-xs font-bold uppercase tracking-widest">
                No category data
              </p>
            )}
          </div>
        </div>

        {/* Host Experience Count by Category */}
        <div className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-50 dark:border-neutral-800 lg:col-span-2 transition-all duration-500">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <h3 className="text-xl font-black text-slate-900 dark:text-neutral-100 uppercase tracking-tighter transition-colors">
              Host Experience Count by Category
            </h3>
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={hostSearch}
                onChange={(e) => setHostSearch(e.target.value)}
                placeholder="Search host..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-neutral-950 rounded-xl text-xs font-bold border border-slate-100 dark:border-neutral-800 focus:outline-none focus:ring-1 focus:ring-[#C59A2F] transition-all"
              />
            </div>
          </div>
          <div className="overflow-x-auto max-h-[350px] overflow-y-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-50 dark:border-neutral-800">
                  <th className="pb-4 text-left text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest transition-colors">
                    Host
                  </th>
                  <th className="pb-4 text-left text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest transition-colors">
                    Email
                  </th>
                  <th className="pb-4 text-left text-[10px] font-black text-slate-400 dark:text-neutral-500 uppercase tracking-widest transition-colors">
                    Categories
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 dark:divide-neutral-800">
                {hostRows.map((h: any) => (
                  <tr
                    key={h.userId}
                    className="group hover:bg-slate-50/50 dark:hover:bg-neutral-800/30 transition-colors"
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            h.avatar?.url ||
                            `https://ui-avatars.com/api/?background=C59A2F&color=fff&name=${encodeURIComponent(
                              h.firstname || "Host"
                            )}`
                          }
                          className="w-8 h-8 rounded-full border border-slate-100 dark:border-neutral-700 transition-colors object-cover"
                          alt=""
                          onError={(e: any) => {
                            e.target.src = "https://ui-avatars.com/api/?background=C59A2F&color=fff&name=Host";
                          }}
                        />
                        <span className="font-bold text-slate-900 dark:text-neutral-200 text-xs group-hover:text-[#C59A2F] transition-colors">
                          {h.firstname} {h.lastname}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 text-[11px] text-slate-400 dark:text-neutral-500 font-bold">
                      {h.email}
                    </td>
                    <td className="py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {h.categories.map((c: any, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-50/60 dark:bg-amber-950/20 text-[#C59A2F] text-[9px] font-black border border-amber-100/50 dark:border-amber-900/30"
                          >
                            <span>{c.category}</span>
                            <span className="opacity-60">({c.count})</span>
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
                {hostRows.length === 0 && (
                  <tr>
                    <td
                      colSpan={3}
                      className="py-8 text-center text-slate-400 dark:text-neutral-600 text-xs font-bold uppercase tracking-widest"
                    >
                      No host data found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
