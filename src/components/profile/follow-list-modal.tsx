"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FiX } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api/axios-instance";

interface FollowListModalProps {
  userId: string;
  type: string;
  onClose: () => void;
  isThemed?: boolean;
}

export function FollowListModal({
  userId,
  type,
  onClose,
  isThemed = false,
}: FollowListModalProps) {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const res = await apiClient.get(`/api/users/friends/${userId}`);
        if (res.data?.success) {
          const list = res.data.data || res.data.friends || [];
          setUsers(list);
        } else {
          setError(res.data?.message || "Failed to load");
        }
      } catch (err) {
        console.error(`Error fetching ${type}:`, err);
        setError("Something went wrong. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [userId, type]);

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 ${
        isThemed
          ? "bg-black/35 backdrop-blur-sm"
          : "bg-black/60 backdrop-blur-sm"
      }`}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`w-full max-w-md rounded-2xl overflow-hidden flex flex-col max-h-[80vh] transition-colors ${
          isThemed ? "" : "bg-white shadow-2xl dark:bg-neutral-900"
        }`}
        style={
          isThemed
            ? {
                background: "rgba(18,18,22,0.88)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.22)",
                boxShadow: "0 16px 40px rgba(0, 0, 0, 0.3)",
              }
            : undefined
        }
      >
        <div
          className="p-4 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between transition-colors"
          style={
            isThemed
              ? {
                  borderBottomColor: "rgba(255, 255, 255, 0.12)",
                  background: "transparent",
                }
              : undefined
          }
        >
          <h3
            className="font-bold text-xl capitalize text-neutral-900 dark:text-neutral-100"
            style={isThemed ? { color: "#ffffff" } : undefined}
          >
            {type}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              isThemed
                ? "hover:bg-white/10 text-white"
                : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-400"
            }`}
          >
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div
              className="p-10 text-center text-neutral-500 dark:text-neutral-400 transition-colors"
              style={isThemed ? { color: "#ffffff" } : undefined}
            >
              Loading {type}...
            </div>
          ) : error ? (
            <div className="p-10 text-center text-red-400 font-semibold">
              {error}
            </div>
          ) : users.length === 0 ? (
            <div
              className="p-10 text-center text-neutral-500 dark:text-neutral-400 transition-colors"
              style={
                isThemed ? { color: "rgba(255,255,255,0.85)" } : undefined
              }
            >
              No {type} yet.
            </div>
          ) : (
            <div className="space-y-1">
              {users.map((u) => (
                <div
                  key={u._id || u.id}
                  onClick={() => {
                    router.push(`/profile/${u._id || u.id}`);
                    onClose();
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors ${
                    isThemed
                      ? "hover:bg-white/10"
                      : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                  }`}
                >
                  <div
                    className="w-12 h-12 rounded-full overflow-hidden bg-neutral-100 shrink-0 dark:bg-neutral-800 transition-colors"
                    style={
                      isThemed
                        ? { border: "1px solid rgba(255,255,255,0.18)" }
                        : undefined
                    }
                  >
                    {u.avatar?.url || (typeof u.avatar === "string" && u.avatar) ? (
                      <img
                        loading="lazy"
                        decoding="async"
                        src={u.avatar?.url || u.avatar}
                        alt={u.firstname}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-yellow-100 text-yellow-700 font-bold uppercase">
                        {u.firstname?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className="font-semibold text-neutral-900 leading-none dark:text-neutral-100 transition-colors"
                      style={isThemed ? { color: "#ffffff" } : undefined}
                    >
                      {u.firstname} {u.lastname}
                    </p>
                    <p
                      className="text-xs text-neutral-500 mt-1 uppercase tracking-wider font-medium dark:text-neutral-400 transition-colors"
                      style={
                        isThemed
                          ? { color: "rgba(255,255,255,0.70)" }
                          : undefined
                      }
                    >
                      {u.role || "guest"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
