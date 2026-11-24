import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";

export const metadata: Metadata = { title: "Shopping cart" };

export default function CartPage() {
  return (
    <div className="container-fc py-10">
      <h1 className="mb-6 text-3xl font-extrabold">Shopping Cart</h1>
      <CartView />
    </div>
  );
}
