import type { Metadata } from "next";
import { Suspense } from "react";
import AuthShell, { AuthLink } from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" subtitle="Sign in to your FreshCart account." footer={<>New here? <AuthLink href="/register">Create an account</AuthLink></>}>
      <Suspense fallback={null}><LoginForm /></Suspense>
    </AuthShell>
  );
}
