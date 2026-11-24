"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { useWishlistStore } from "@/store/wishlist.store";
import { formatPrice } from "@/utils/format";
import EmptyState from "@/components/ui/EmptyState";
import { PageSpinner } from "@/components/ui/Spinner";
import AddToCartButton from "@/components/products/AddToCartButton";
import Rating from "@/components/ui/Rating";

export default function WishlistView() {
  const { items, loaded, busyIds, remove } = useWishlistStore();

  if (!loaded) return <PageSpinner label="Loading your wishlist…" />;
  if (items.length === 0) {
    return <EmptyState icon={Heart} title="Your wishlist is empty" description="Tap the heart on any product to save it for later." actionLabel="Browse products" actionHref="/products" />;
  }

  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => {
        const price = p.priceAfterDiscount && p.priceAfterDiscount < p.price ? p.priceAfterDiscount : p.price;
        return (
          <li key={p._id} className="card flex gap-4 p-4">
            <Link href={`/products/${p._id}`} className="relative h-28 w-28 shrink-0 overflow-hidden rounded-lg bg-gray-50">
              <Image src={p.imageCover} alt={p.title} fill sizes="112px" className="object-cover" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <h3 className="line-clamp-2 text-sm font-semibold"><Link href={`/products/${p._id}`} className="hover:text-primary-600">{p.title}</Link></h3>
              <div className="mt-1"><Rating value={p.ratingsAverage} count={p.ratingsQuantity} /></div>
              <p className="mt-1 font-bold">{formatPrice(price)}</p>
              <div className="mt-auto flex items-center gap-2 pt-3">
                <AddToCartButton productId={p._id} outOfStock={p.quantity < 1} className="!px-3 !py-2 text-xs" />
                <button onClick={() => void remove(p._id)} disabled={busyIds.includes(p._id)} aria-label={`Remove ${p.title} from wishlist`} className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-300 text-gray-500 hover:border-red-300 hover:text-red-600 disabled:opacity-50">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
