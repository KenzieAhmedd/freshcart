import type { Metadata } from "next";
import { Suspense } from "react";
import OrdersView from "@/components/orders/OrdersView";

export const metadata: Metadata = { title: "My orders" };

export default function OrdersPage() {
  return (
    <div className="container-fc py-10">
      <h1 className="mb-6 text-3xl font-extrabold">My Orders</h1>
      <Suspense fallback={null}><OrdersView /></Suspense>
    </div>
  );
}
