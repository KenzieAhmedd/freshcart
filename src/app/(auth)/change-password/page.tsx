import type { Metadata } from "next";
import AuthShell from "@/components/auth/AuthShell";
import ChangePasswordForm from "@/components/auth/ChangePasswordForm";

export const metadata: Metadata = { title: "Change password" };

export default function ChangePasswordPage() {
  return (
    <AuthShell title="Change password" subtitle="Enter your current password, then choose a new one.">
      <ChangePasswordForm />
    </AuthShell>
  );
}
