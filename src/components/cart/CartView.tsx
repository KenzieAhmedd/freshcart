"use client";

import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart.store";
import { formatPrice } from "@/utils/format";
import EmptyState from "@/components/ui/EmptyState";
import { PageSpinner } from "@/components/ui/Spinner";

export default function CartView() {
  const { cart, loaded, loading, busyIds, setCount, remove, clear } = useCartStore();

  if (!loaded && loading) return <PageSpinner label="Loading your cart…" />;
  if (!loaded) return <PageSpinner label="Loading your cart…" />;

  if (cart.products.length === 0) {
    return <EmptyState icon={ShoppingCart} title="Your cart is empty" description="Add a few things you love and they'll show up here." actionLabel="Start shopping" actionHref="/products" />;
  }

  const blocked = cart.products.filter((p) => p.product.quantity < 1 || p.count > p.product.quantity);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <section aria-label="Cart items">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-500">{cart.numOfCartItems} item{cart.numOfCartItems === 1 ? "" : "s"}</p>
          <button onClick={() => { if (window.confirm("Remove every item from your cart?")) void clear(); }} className="text-sm font-medium text-red-600 hover:underline">Clear cart</button>
        </div>
        <ul className="space-y-4">
          {cart.products.map((item) => {
            const p = item.product;
            const busy = busyIds.includes(p._id);
            const soldOut = p.quantity < 1;
            const overStock = !soldOut && item.count > p.quantity;
            return (
              <li key={item._id} className="card flex gap-4 p-4">
                <Link href={`/products/${p._id}`} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-gray-50 sm:h-28 sm:w-28">
                  <Image src={p.imageCover} alt={p.title} fill sizes="112px" className="object-cover" />
                </Link>
                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-sm font-semibold sm:text-base"><Link href={`/products/${p._id}`} className="hover:text-primary-600">{p.title}</Link></h3>
                      {p.category && <p className="mt-0.5 text-xs text-gray-500">{p.category.name}</p>}
                    </div>
                    <p className="shrink-0 text-right font-bold">{formatPrice(item.price * item.count)}</p>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">{formatPrice(item.price)} each</p>
                  {(soldOut || overStock) && (
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-red-600"><AlertTriangle className="h-4 w-4" />{soldOut ? "This item is out of stock. Remove it to check out." : `Only ${p.quantity} available. Lower the quantity to check out.`}</p>
                  )}
                  <div className="mt-auto flex items-center justify-between pt-3">
                    <div className="flex items-center rounded-lg border border-gray-300">
                      <button onClick={() => void setCount(p._id, item.count - 1)} disabled={busy || item.count <= 1} aria-label={`Decrease quantity of ${p.title}`} className="flex h-9 w-9 items-center justify-center hover:text-primary-600 disabled:opacity-40"><Minus className="h-4 w-4" /></button>
                      <span className="w-9 text-center text-sm font-semibold" aria-live="polite">{item.count}</span>
                      <button onClick={() => void setCount(p._id, item.count + 1)} disabled={busy || item.count >= p.quantity} aria-label={`Increase quantity of ${p.title}`} className="flex h-9 w-9 items-center justify-center hover:text-primary-600 disabled:opacity-40"><Plus className="h-4 w-4" /></button>
                    </div>
                    <button onClick={() => void remove(p._id)} disabled={busy} className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-red-600 disabled:opacity-50"><Trash2 className="h-4 w-4" /> Remove</button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <aside className="h-fit lg:sticky lg:top-24">
        <div className="card p-6">
          <h2 className="text-lg font-bold">Order summary</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-gray-600">Subtotal</dt><dd className="font-medium">{formatPrice(cart.totalCartPrice)}</dd></div>
            <div className="flex justify-between border-t border-gray-100 pt-3 text-base"><dt className="font-bold">Total</dt><dd className="font-extrabold text-primary-700">{formatPrice(cart.totalCartPrice)}</dd></div>
          </dl>
          {blocked.length > 0 ? (
            <p className="mt-5 rounded-lg bg-red-50 p-3 text-sm text-red-700">Fix the items marked above to continue to checkout.</p>
          ) : (
            <Link href="/checkout" className="btn-primary mt-5 w-full">Proceed to checkout</Link>
          )}
          <Link href="/products" className="mt-3 block text-center text-sm font-medium text-primary-700 hover:underline">Continue shopping</Link>
        </div>
      </aside>
    </div>
  );
}
