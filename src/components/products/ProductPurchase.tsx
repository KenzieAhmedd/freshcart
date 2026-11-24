"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import AddToCartButton from "./AddToCartButton";
import WishlistButton from "./WishlistButton";

export default function ProductPurchase({ productId, stock }: { productId: string; stock: number }) {
  const [qty, setQty] = useState(1);
  const soldOut = stock < 1;
  const max = Math.max(1, stock);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium text-gray-700">Quantity</span>
        <div className="flex items-center rounded-lg border border-gray-300">
          <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1 || soldOut} aria-label="Decrease quantity" className="flex h-10 w-10 items-center justify-center text-gray-600 hover:text-primary-600 disabled:opacity-40">
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-10 text-center text-sm font-semibold" aria-live="polite">{qty}</span>
          <button type="button" onClick={() => setQty((q) => Math.min(max, q + 1))} disabled={qty >= max || soldOut} aria-label="Increase quantity" className="flex h-10 w-10 items-center justify-center text-gray-600 hover:text-primary-600 disabled:opacity-40">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <span className={`text-sm ${soldOut ? "text-red-600" : stock <= 10 ? "text-amber-600" : "text-primary-700"}`}>
          {soldOut ? "Out of stock" : stock <= 10 ? `Only ${stock} left` : "In stock"}
        </span>
      </div>
      <div className="flex flex-wrap gap-3">
        <AddToCartButton productId={productId} quantity={qty} outOfStock={soldOut} className="flex-1 sm:flex-none sm:min-w-52" />
        <WishlistButton productId={productId} variant="full" />
      </div>
    </div>
  );
}
