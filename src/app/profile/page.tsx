import type { Metadata } from "next";
import { ProfileView } from "@/components/profile/profile-view";

export const metadata: Metadata = {
  title: "My Profile | Athithya",
  description: "View and manage your Athithya account, bookings, and hosted experiences.",
};

export default function MyProfilePage() {
  return <ProfileView />;
}
