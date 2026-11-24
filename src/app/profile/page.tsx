import type { Metadata } from "next";
import ProfileView from "@/components/auth/ProfileView";

export const metadata: Metadata = { title: "My account" };

export default function ProfilePage() {
  return (
    <div className="container-fc py-10">
      <h1 className="mb-6 text-3xl font-extrabold">My Account</h1>
      <ProfileView />
    </div>
  );
}
