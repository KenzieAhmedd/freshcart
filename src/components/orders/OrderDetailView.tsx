"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useOrders } from "@/hooks/useOrders";
import EmptyState, { ErrorState } from "@/components/ui/EmptyState";
import { PageSpinner } from "@/components/ui/Spinner";
import { OrderLines, OrderSummaryRows, Pill, orderStatus, paymentLabel } from "./OrderBits";
import { PackageOpen } from "lucide-react";

export default function OrderDetailView({ id }: { id: string }) {
  const { orders, error, reload, ready } = useOrders();
  if (!ready || (!orders && !error)) return <PageSpinner label="Loading order…" />;
  if (error) return <ErrorState message={error} onRetry={reload} />;
  const order = orders?.find((o) => o._id === id);
  if (!order) return <EmptyState icon={PackageOpen} title="Order not found" description="It may belong to a different account." actionLabel="Back to orders" actionHref="/orders" />;
  const status = orderStatus(order);
  const pay = paymentLabel(order);

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/orders" className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary-700 hover:underline"><ArrowLeft className="h-4 w-4" /> All orders</Link>
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-extrabold">Order #{order.id ?? order._id.slice(-6)}</h1>
          <div className="flex gap-2"><Pill tone={status.tone}>{status.label}</Pill><Pill tone={pay.tone}>{pay.label}</Pill></div>
        </div>
        <div className="mt-4"><OrderLines order={order} /></div>
        <div className="mt-4 border-t border-gray-100 pt-4"><OrderSummaryRows order={order} /></div>
      </div>
    </div>
  );
}
