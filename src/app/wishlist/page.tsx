import type { Metadata } from "next";
import WishlistView from "@/components/wishlist/WishlistView";

export const metadata: Metadata = { title: "Wishlist" };

export default function WishlistPage() {
  return (
    <div className="container-fc py-10">
      <h1 className="mb-6 text-3xl font-extrabold">My Wishlist</h1>
      <WishlistView />
    </div>
  );
}
