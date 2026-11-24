import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2" aria-label="FreshCart home">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-600 text-white">
        <ShoppingCart className="h-5 w-5" />
      </span>
      <span className={`text-2xl font-extrabold tracking-tight ${light ? "text-white" : "text-gray-900"}`}>
        Fresh<span className="text-primary-600">Cart</span>
      </span>
    </Link>
  );
}
