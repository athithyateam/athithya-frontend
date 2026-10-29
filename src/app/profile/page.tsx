import type { Metadata } from "next";
import { Suspense } from "react";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { MobileFooter } from "@/components/navigation/mobile-footer";
import { ProfileView } from "@/components/profile/profile-view";

export const metadata: Metadata = {
  title: "My Profile | Athithya",
  description:
    "View and manage your Athithya account, bookings, and hosted experiences.",
};

export default function MyProfilePage() {
  return (
    <div className="relative min-h-screen flex flex-col pb-16 md:pb-0 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      <Navbar />
      <main className="grow">
        <Suspense
          fallback={
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
              <div className="w-10 h-10 border-3 border-[#C59A2F]/20 border-t-[#C59A2F] rounded-full animate-spin" />
            </div>
          }
        >
          <ProfileView />
        </Suspense>
      </main>
      <Footer />
      <MobileFooter />
    </div>
  );
}
