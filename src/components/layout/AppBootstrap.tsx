"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";

/** Loads the signed-in user's cart and wishlist once, and clears them on sign-out. */
export default function AppBootstrap() {
  const token = useAuthStore((s) => s.token);
  const hydrated = useAuthStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;
    if (token) {
      void useCartStore.getState().fetch();
      void useWishlistStore.getState().fetch();
    } else {
      useCartStore.getState().reset();
      useWishlistStore.getState().reset();
    }
  }, [token, hydrated]);

  return null;
}
