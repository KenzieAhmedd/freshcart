import type { Metadata } from "next";
import AuthShell, { AuthLink } from "@/components/auth/AuthShell";
import ForgotPasswordFlow from "@/components/auth/ForgotPasswordFlow";

export const metadata: Metadata = { title: "Forgot password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell title="Reset your password" subtitle="We'll email you a code to set a new password." footer={<>Remembered it? <AuthLink href="/login">Back to sign in</AuthLink></>}>
      <ForgotPasswordFlow />
    </AuthShell>
  );
}
