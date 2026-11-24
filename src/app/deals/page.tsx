import type { Metadata } from "next";
import { BadgePercent } from "lucide-react";
import { productsService } from "@/services/products.service";
import { getErrorMessage } from "@/services/api";
import type { Product } from "@/types";
import ProductGrid from "@/components/products/ProductGrid";
import EmptyState, { ErrorState } from "@/components/ui/EmptyState";
import { discountPercent } from "@/utils/format";

export const metadata: Metadata = { title: "Deals" };

export default async function DealsPage() {
  let deals: Product[] = [];
  let error = "";
  try {
    // The API has no "on sale" filter, so scan a large page and keep discounted items.
    const res = await productsService.list({ limit: 100 });
    deals = res.data
      .filter((p) => p.priceAfterDiscount && p.priceAfterDiscount < p.price)
      .sort((a, b) => discountPercent(b.price, b.priceAfterDiscount) - discountPercent(a.price, a.priceAfterDiscount));
  } catch (e) { error = getErrorMessage(e, "We couldn't load deals."); }

  return (
    <div className="container-fc py-10">
      <h1 className="text-3xl font-extrabold">Deals</h1>
      <p className="mt-1 mb-8 text-gray-500">Biggest discounts first.</p>
      {error ? <ErrorState message={error} /> : deals.length === 0 ? <EmptyState icon={BadgePercent} title="No deals right now" actionLabel="Browse products" actionHref="/products" /> : <ProductGrid products={deals} />}
    </div>
  );
}
