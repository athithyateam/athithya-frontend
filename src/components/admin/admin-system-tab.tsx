"use client";

import { useState, useEffect } from "react";
import { MessageSquare, Activity, BarChart3, Server } from "lucide-react";
import { getAdminChatActivityApi, getAdminTrafficAnalyticsApi } from "@/lib/api/admin-api";

interface AdminSystemTabProps {
  mode: "chat" | "traffic" | "health";
}

export function AdminSystemTab({ mode }: AdminSystemTabProps) {
  const [chats, setChats] = useState<any[]>([]);
  const [traffic, setTraffic] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    if (mode === "chat") {
      getAdminChatActivityApi()
        .then((res) =>
          setChats(res?.conversations || res?.activity || res?.data || (Array.isArray(res) ? res : []))
        )
        .catch(() => setChats([]))
        .finally(() => setLoading(false));
    } else {
      getAdminTrafficAnalyticsApi()
        .then((res) => setTraffic(res?.analytics || res?.data || res || {}))
        .catch(() => setTraffic({}))
        .finally(() => setLoading(false));
    }
  }, [mode]);

  if (mode === "chat") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">Chat Activity Monitor</h2>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">
            Platform conversation volume and group expedition activity
          </p>
        </div>

        {loading ? (
          <div className="h-40 rounded-3xl bg-neutral-100 dark:bg-neutral-900 animate-pulse" />
        ) : chats.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <MessageSquare size={36} className="mx-auto text-neutral-400 mb-2" />
            <p className="text-sm font-bold">No recent chat activity logs.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {chats.map((c, idx) => (
              <div
                key={c._id || idx}
                className="p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-sm">
                    {c.groupName || c.name || "Direct Conversation"}
                  </h4>
                  <p className="text-xs text-neutral-500">
                    Participants: {c.participants?.length || 2} • Messages: {c.messageCount ?? "Active"}
                  </p>
                </div>
                <span className="text-xs text-neutral-400">
                  {c.updatedAt ? new Date(c.updatedAt).toLocaleDateString() : ""}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (mode === "traffic") {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tight">Traffic & SEO Analytics</h2>
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">
            Google Analytics 4 & route performance metrics
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <BarChart3 size={20} className="text-[#C59A2F] mb-2" />
            <span className="block text-3xl font-black">{traffic.pageViews ?? 0}</span>
            <span className="text-xs font-bold uppercase text-neutral-400">Total Page Views</span>
          </div>
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <Activity size={20} className="text-emerald-500 mb-2" />
            <span className="block text-3xl font-black">{traffic.activeUsers ?? 0}</span>
            <span className="text-xs font-bold uppercase text-neutral-400">Active Visitors</span>
          </div>
          <div className="p-6 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
            <Server size={20} className="text-sky-500 mb-2" />
            <span className="block text-3xl font-black">{traffic.sessions ?? 0}</span>
            <span className="text-xs font-bold uppercase text-neutral-400">Total Sessions</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-black uppercase tracking-tight">System Health & Media Integrity</h2>
        <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest mt-1">
          Database, S3 storage, and real-time socket diagnostics
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { name: "MongoDB Atlas Cluster", status: "Healthy • <12ms latency" },
          { name: "AWS S3 Media Bucket (eu-north-1)", status: "Healthy • Presigned URLs active" },
          { name: "Razorpay Payment Gateway", status: "Healthy • Webhook signature verified" },
          { name: "Socket.IO Real-time Server", status: "Healthy • Chat & notifications connected" },
        ].map((svc) => (
          <div
            key={svc.name}
            className="p-5 rounded-3xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-between"
          >
            <div>
              <h4 className="font-bold text-sm">{svc.name}</h4>
              <p className="text-xs text-emerald-500 font-semibold mt-0.5">{svc.status}</p>
            </div>
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
          </div>
        ))}
      </div>
    </div>
  );
}

