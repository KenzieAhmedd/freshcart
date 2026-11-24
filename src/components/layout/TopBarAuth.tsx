"use client";

import Link from "next/link";
import { useAuthStore } from "@/store/auth.store";

export default function TopBarAuth() {
  const { token, hydrated } = useAuthStore();
  if (!hydrated || token) return null;
  return (
    <div className="flex items-center gap-3 border-l border-gray-200 pl-5">
      <Link href="/login" className="font-medium hover:text-primary-600">Sign In</Link>
      <Link href="/register" className="font-medium hover:text-primary-600">Sign Up</Link>
    </div>
  );
}
