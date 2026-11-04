import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { MobileFooter } from "@/components/navigation/mobile-footer";
import { PostFormClient } from "@/components/forms/post-form-client";

export const metadata: Metadata = {
  title: "Host Dashboard - Create Experience | Athithya",
  description: "List and manage your travel experiences on Athithya.",
  robots: { index: false, follow: false },
};

export default function CreateExperiencePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7]/30 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors">
      <Navbar />
      <main className="flex-1 pt-20 pb-20">
        <Suspense
          fallback={
            <div className="py-24 flex flex-col items-center justify-center gap-3">
              <div className="w-8 h-8 border-2 border-[#C59A2F]/20 border-t-[#C59A2F] rounded-full animate-spin" />
              <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                Loading host dashboard...
              </p>
            </div>
          }
        >
          <PostFormClient />
        </Suspense>
      </main>
      <Footer />
      <MobileFooter />
    </div>
  );
}
