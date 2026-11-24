"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, PackageOpen } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import EmptyState, { ErrorState } from "@/components/ui/EmptyState";
import { PageSpinner } from "@/components/ui/Spinner";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatDate, formatPrice } from "@/utils/format";
import { OrderLines, Pill, orderStatus, paymentLabel } from "./OrderBits";

export default function OrdersView() {
  const { orders, error, reload, ready, noUser } = useOrders();
  const placed = useSearchParams().get("placed");

  if (!ready) return <PageSpinner label="Loading your orders…" />;
  if (noUser) return <ErrorState message="We couldn't identify your account. Please sign out and sign in again." />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  if (!orders) return <div className="space-y-4">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-40 w-full" />)}</div>;

  return (
    <div className="space-y-6">
      {placed === "cash" && (
        <div role="status" className="flex items-start gap-3 rounded-xl border border-primary-200 bg-primary-50 p-4 text-primary-900">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" />
          <p className="text-sm"><strong>Order placed.</strong> Pay with cash when it arrives. You can follow it below.</p>
        </div>
      )}
      {orders.length === 0 ? (
        <EmptyState icon={PackageOpen} title="No orders yet" description="When you place an order it will appear here." actionLabel="Start shopping" actionHref="/products" />
      ) : (
        <ul className="space-y-5">
          {orders.map((o) => {
            const status = orderStatus(o);
            const pay = paymentLabel(o);
            return (
              <li key={o._id} className="card overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-gray-50 px-5 py-3">
                  <div className="text-sm"><p className="font-semibold">Order #{o.id ?? o._id.slice(-6)}</p><p className="text-gray-500">{formatDate(o.createdAt)}</p></div>
                  <div className="flex flex-wrap items-center gap-2"><Pill tone={status.tone}>{status.label}</Pill><Pill tone={pay.tone}>{pay.label}</Pill></div>
                </div>
                <div className="px-5"><OrderLines order={o} /></div>
                <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
                  <p className="text-sm text-gray-600">Total <span className="ml-1 text-base font-extrabold text-gray-900">{formatPrice(o.totalOrderPrice)}</span></p>
                  <Link href={`/orders/${o._id}`} className="btn-outline !py-2">View details</Link>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
