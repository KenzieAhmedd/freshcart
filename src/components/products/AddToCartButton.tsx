"use client";

import { ShoppingCart } from "lucide-react";
import Spinner from "@/components/ui/Spinner";
import { useCartStore } from "@/store/cart.store";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { cn } from "@/utils/format";

interface Props {
  productId: string;
  outOfStock?: boolean;
  /** Extra copies to add (product page quantity selector). Defaults to 1. */
  quantity?: number;
  compact?: boolean;
  className?: string;
}

export default function AddToCartButton({ productId, outOfStock, quantity = 1, compact, className }: Props) {
  const requireAuth = useRequireAuth();
  const busy = useCartStore((s) => s.busyIds.includes(productId));

  async function handleClick() {
    if (!requireAuth()) return;
    const { add, setCount, cart } = useCartStore.getState();
    const before = cart.products.find((p) => p.product._id === productId)?.count ?? 0;
    const ok = await add(productId); // the API adds one unit per call
    if (ok && quantity > 1) await setCount(productId, before + quantity);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy || outOfStock}
      aria-label={compact ? "Add to cart" : undefined}
      className={cn(compact ? "flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white transition-colors hover:bg-primary-700 disabled:bg-gray-300" : "btn-primary", className)}
    >
      {busy ? <Spinner className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
      {!compact && (outOfStock ? "Out of stock" : "Add to Cart")}
    </button>
  );
}
