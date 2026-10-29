import { Suspense } from "react";
import type { Metadata } from "next";
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
    <Suspense
      fallback={
        <div className="min-h-screen pt-28 text-center text-sm text-neutral-400">
          Loading profile...
        </div>
      }
    >
      <ProfileContent params={params} />
    </Suspense>
  );
}
