"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { HostServiceForm } from "./host-service-form";

export function PostFormClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");

  const [mounted, setMounted] = useState(false);
  const { user, loading, openAuthModal, setShowHostStatusModal } = useAuthStore();

  const rawRole = (user?.role || "guest").toLowerCase();
  const isHost = rawRole === "host" || rawRole === "admin";
  const isApprovedHost =
    rawRole === "admin" ||
    (rawRole === "host" && user?.hostStatus === "approved");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || loading) return;

    if (user && !isHost) {
      router.replace("/");
      return;
    }

    if (user && isHost && !isApprovedHost) {
      setShowHostStatusModal(true);
    }
  }, [mounted, loading, user, isHost, isApprovedHost, router, setShowHostStatusModal]);

  // Loading / hydration state
  if (!mounted || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <div className="w-8 h-8 border-2 border-[#C59A2F]/20 border-t-[#C59A2F] rounded-full animate-spin" />
        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
          Verifying host credentials...
        </p>
      </div>
    );
  }

  // Not logged in: Show in-place sign in trigger
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-sm border border-neutral-200/80 dark:border-neutral-800 max-w-md w-full">
          <h2 className="text-2xl font-black uppercase tracking-tight text-neutral-900 dark:text-neutral-100 mb-2">
            Host Sign In Required
          </h2>
          <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-6">
            Please sign in to your host account to create or manage travel experiences.
          </p>
          <button
            type="button"
            onClick={() => openAuthModal("login", "host")}
            className="w-full py-3 bg-[#C59A2F] text-white rounded-xl font-bold uppercase tracking-wider hover:bg-[#A67F26] transition shadow-md cursor-pointer"
          >
            Sign In as Host
          </button>
        </div>
      </div>
    );
  }

  // Logged in as regular guest: Handled by router.replace in useEffect
  if (!isHost) {
    return null;
  }

  // Host pending verification: Clean card with direct modal trigger
  if (!isApprovedHost) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 text-center">
        <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl shadow-sm border border-neutral-200/80 dark:border-neutral-800 max-w-md w-full">
          <h2 className="text-xl font-black uppercase tracking-tight text-[#C59A2F] mb-2">
            Verification Required
          </h2>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 font-medium">
            Your host profile must be verified before listing new experiences. Please complete your verification details.
          </p>
          <button
            type="button"
            onClick={() => setShowHostStatusModal(true)}
            className="w-full py-3 bg-[#C59A2F] text-white rounded-xl font-bold uppercase tracking-wider hover:bg-[#A67F26] transition shadow-md cursor-pointer"
          >
            Open Verification Form
          </button>
        </div>
      </div>
    );
  }

  // Verified host or admin: Render form
  return (
    <div className="min-h-[90vh] bg-[#FDFBF7]/30 dark:bg-neutral-950 flex flex-col justify-center py-6 md:py-12 px-4 md:px-0 transition-colors">
      <div className="max-w-5xl mx-auto w-full">
        <div className="mx-auto p-4 md:p-6 bg-[#fffdf8] dark:bg-neutral-900 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-[#C59A2F]">
              Host Dashboard
            </h2>
          </div>
          <HostServiceForm editId={editId} />
        </div>
      </div>
    </div>
  );
}
