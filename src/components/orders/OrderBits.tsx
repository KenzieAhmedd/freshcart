import Image from "next/image";
import Link from "next/link";
import type { Order } from "@/types";
import { cn, formatDate, formatPrice } from "@/utils/format";

export function orderStatus(o: Order) {
  if (o.isDelivered) return { label: "Delivered", tone: "bg-primary-100 text-primary-800" };
  return { label: "Processing", tone: "bg-amber-100 text-amber-800" };
}

export function paymentLabel(o: Order) {
  if (o.paymentMethodType === "card") return o.isPaid ? { label: "Paid online", tone: "bg-primary-100 text-primary-800" } : { label: "Payment pending", tone: "bg-red-100 text-red-700" };
  return o.isPaid ? { label: "Paid (cash)", tone: "bg-primary-100 text-primary-800" } : { label: "Pay on delivery", tone: "bg-gray-100 text-gray-700" };
}

export function Pill({ children, tone }: { children: React.ReactNode; tone: string }) {
  return <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold", tone)}>{children}</span>;
}

export function OrderLines({ order }: { order: Order }) {
  return (
    <ul className="divide-y divide-gray-100">
      {order.cartItems.map((it) => (
        <li key={it._id} className="flex items-center gap-4 py-3">
          <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-gray-50">
            {it.product?.imageCover && <Image src={it.product.imageCover} alt="" fill sizes="64px" className="object-cover" />}
          </span>
          <div className="min-w-0 flex-1 text-sm">
            {it.product?._id ? <Link href={`/products/${it.product._id}`} className="line-clamp-2 font-medium hover:text-primary-600">{it.product.title}</Link> : <span className="font-medium">Product no longer available</span>}
            <p className="text-gray-500">{it.count} × {formatPrice(it.price)}</p>
          </div>
          <p className="text-sm font-semibold">{formatPrice(it.price * it.count)}</p>
        </li>
      ))}
    </ul>
  );
}

export function OrderSummaryRows({ order }: { order: Order }) {
  return (
    <dl className="space-y-1.5 text-sm">
      <div className="flex justify-between"><dt className="text-gray-500">Placed</dt><dd>{formatDate(order.createdAt)}</dd></div>
      {order.shippingAddress && <div className="flex justify-between gap-4"><dt className="text-gray-500">Ship to</dt><dd className="text-right">{order.shippingAddress.details}, {order.shippingAddress.city} · {order.shippingAddress.phone}</dd></div>}
      <div className="flex justify-between"><dt className="text-gray-500">Shipping</dt><dd>{order.shippingPrice ? formatPrice(order.shippingPrice) : "Free"}</dd></div>
      {order.taxPrice ? <div className="flex justify-between"><dt className="text-gray-500">Tax</dt><dd>{formatPrice(order.taxPrice)}</dd></div> : null}
      <div className="flex justify-between border-t border-gray-100 pt-2 text-base"><dt className="font-bold">Total</dt><dd className="font-extrabold text-primary-700">{formatPrice(order.totalOrderPrice)}</dd></div>
    </dl>
  );
}
