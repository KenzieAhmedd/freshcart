"use client";

import { useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "@/store/toast.store";

/** Returns a guard: call it before an action that needs a session. It returns false (and redirects) when signed out. */
export function useRequireAuth() {
  const router = useRouter();
  const pathname = usePathname();
  const token = useAuthStore((s) => s.token);

  return useCallback((): boolean => {
    if (token) return true;
    toast.info("Sign in to continue");
    router.push(`/login?redirect=${encodeURIComponent(pathname)}`);
    return false;
  }, [token, router, pathname]);
}
