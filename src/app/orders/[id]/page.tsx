import type { Metadata } from "next";
import OrderDetailView from "@/components/orders/OrderDetailView";

export const metadata: Metadata = { title: "Order details" };

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="container-fc py-10">
      <OrderDetailView id={params.id} />
    </div>
  );
}
