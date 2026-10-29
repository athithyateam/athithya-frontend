import { Suspense } from "react";
import type { Metadata } from "next";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { MobileFooter } from "@/components/navigation/mobile-footer";
import { ProfileView } from "@/components/profile/profile-view";

export const metadata: Metadata = {
  title: "User Profile | Athithya",
  description: "User and Host profile on Athithya.",
};

async function ProfileContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <ProfileView userId={id} />;
}

export default function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="relative min-h-screen flex flex-col pb-16 md:pb-0 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-300">
      <Navbar />
      <main className="grow">
        <Suspense
          fallback={
            <div className="min-h-screen pt-28 text-center text-sm text-neutral-400">
              Loading profile...
            </div>
          }
        >
          <ProfileContent params={params} />
        </Suspense>
      </main>
      <Footer />
      <MobileFooter />
    </div>
  );
}
