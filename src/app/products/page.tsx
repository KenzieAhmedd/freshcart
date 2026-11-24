import type { Metadata } from "next";
import ProductsListing, { type SearchParams } from "@/components/products/ProductsListing";

export const metadata: Metadata = { title: "Shop all products" };

export default async function ProductsPage({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="container-fc py-10">
      <h1 className="mb-6 text-3xl font-extrabold">All Products</h1>
      <ProductsListing searchParams={searchParams} basePath="/products" />
    </div>
  );
}
