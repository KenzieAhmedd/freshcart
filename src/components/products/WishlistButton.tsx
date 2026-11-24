"use client";

import { Heart } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist.store";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { cn } from "@/utils/format";

interface Props {
  productId: string;
  /** "icon" is the round overlay on cards; "full" is the labelled button on the product page. */
  variant?: "icon" | "full";
  className?: string;
}

export default function WishlistButton({ productId, variant = "icon", className }: Props) {
  const requireAuth = useRequireAuth();
  const active = useWishlistStore((s) => s.ids.includes(productId));
  const busy = useWishlistStore((s) => s.busyIds.includes(productId));

  function handleClick() {
    if (!requireAuth()) return;
    void useWishlistStore.getState().toggle(productId);
  }

  if (variant === "full") {
    return (
      <button type="button" onClick={handleClick} disabled={busy} aria-pressed={active} className={cn("btn-outline", active && "!border-red-300 !text-red-600", className)}>
        <Heart className={cn("h-4 w-4", active && "fill-red-500")} />
        {active ? "In Wishlist" : "Add to Wishlist"}
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={cn("flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-gray-600 shadow-card transition-colors hover:text-red-500 disabled:opacity-60", className)}
    >
      <Heart className={cn("h-[18px] w-[18px]", active && "fill-red-500 text-red-500")} />
    </button>
  );
}
