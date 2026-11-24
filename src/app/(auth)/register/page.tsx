import type { Metadata } from "next";
import AuthShell, { AuthLink } from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <AuthShell title="Create your account" subtitle="Join FreshCart to save your cart and track orders." footer={<>Already have an account? <AuthLink href="/login">Sign in</AuthLink></>}>
      <RegisterForm />
    </AuthShell>
  );
}
