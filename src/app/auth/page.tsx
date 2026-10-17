import type { Metadata } from "next";
import { AuthCard } from "@/macro-components/auth/auth-card";

export const metadata: Metadata = {
  title: "Sign In or Register",
  description:
    "Join Athithya to discover, book, and host authentic travel experiences.",
};

export default function AuthPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center p-4 sm:p-6 md:p-8 bg-[#050506] relative overflow-hidden">
      {/* Background Ambience: Subtle Warm Golden Radiance only */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[#DF9E26]/[0.04] rounded-full blur-[140px] pointer-events-none" />

      {/* Main Split Authentication Card */}
      <div className="relative z-10 w-full flex items-center justify-center">
        <AuthCard />
      </div>
    </main>
  );
}
