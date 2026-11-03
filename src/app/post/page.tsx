"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { MobileFooter } from "@/components/navigation/mobile-footer";
import { HostServiceForm } from "@/components/forms/host-service-form";

function PostFormContent() {
  const { user, loading, setShowHostStatusModal } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !loading && user) {
      const rawRole = (user.role || "guest").toLowerCase();
      const isHost = rawRole === "host" || rawRole === "admin";
      if (!isHost) {
        router.replace("/");
        return;
      }
      const isApprovedHost =
        rawRole === "admin" ||
        (rawRole === "host" && user.hostStatus === "approved");
      if (isHost && !isApprovedHost) {
        setShowHostStatusModal(true);
      }
    }
  }, [user, loading, mounted, setShowHostStatusModal, router]);

  if (!mounted || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C59A2F]" />
        <p className="mt-4 text-neutral-500 font-medium dark:text-neutral-400 transition-colors">
          Verifying your role...
        </p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-neutral-100 max-w-sm dark:bg-neutral-900 dark:border-neutral-800 transition-colors">
          <h2 className="text-2xl font-bold text-neutral-800 mb-2 dark:text-neutral-200 transition-colors">
            Login Required
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6 transition-colors">
            You need to be logged in to create posts or offerings.
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="w-full py-3 bg-[#C59A2F] text-white rounded-full font-semibold hover:opacity-90 transition shadow-lg cursor-pointer"
          >
            Go to Home to Login
          </button>
        </div>
      </div>
    );
  }

  const rawRole = (user.role || "guest").toLowerCase();
  const isHost = rawRole === "host" || rawRole === "admin";
  const isApprovedHost =
    rawRole === "admin" ||
    (rawRole === "host" && user.hostStatus === "approved");

  const editId = searchParams.get("edit");

  if (!isHost) {
    return null;
  }

  if (isHost && !isApprovedHost) {
    return (
      <div className="min-h-[90vh] bg-[#FDFBF7]/30 dark:bg-neutral-950 flex flex-col justify-center py-12 md:py-24 px-4 md:px-0 transition-colors">
        <div className="max-w-5xl mx-auto w-full text-center py-20">
          <div className="animate-pulse">
            <p className="text-neutral-400 font-bold text-xl">
              Verification Required to Host
            </p>
            <p className="text-neutral-500 mt-2">
              Please complete the verification process in the modal.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] bg-[#FDFBF7]/30 dark:bg-neutral-950 flex flex-col justify-center py-12 md:py-24 px-4 md:px-0 transition-colors">
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

export default function CreateExperiencePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]/30 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100">
      <Navbar />
      <main className="flex-1 pt-20 pb-20">
        <Suspense
          fallback={
            <div className="py-20 text-center text-sm text-neutral-400">
              Loading form...
            </div>
          }
        >
          <PostFormContent />
        </Suspense>
      </main>
      <Footer />
      <MobileFooter />
    </div>
  );
}
