import type { Metadata } from "next";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <div className="container-fc py-10">
      <h1 className="mb-6 text-3xl font-extrabold">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
