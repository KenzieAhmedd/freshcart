import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { brandsService } from "@/services/brands.service";
import { isNotFound } from "@/services/api";
import type { Brand } from "@/types";
import ProductsListing, { type SearchParams } from "@/components/products/ProductsListing";

type Props = { params: { id: string }; searchParams: SearchParams };

async function load(id: string): Promise<Brand | null> {
  try { return await brandsService.get(id); } catch (e) { if (isNotFound(e)) return null; throw e; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const b = await load(params.id).catch(() => null);
  return { title: b ? `${b.name} products` : "Brand" };
}

export default async function BrandPage({ params, searchParams }: Props) {
  const brand = await load(params.id);
  if (!brand) notFound();
  return (
    <div className="container-fc py-10">
      <nav aria-label="Breadcrumb" className="mb-5 text-sm text-gray-500">
        <Link href="/brands" className="hover:text-primary-600">Brands</Link> / <span className="text-gray-800">{brand.name}</span>
      </nav>
      <div className="mb-8 flex items-center gap-5">
        {brand.image && <div className="relative h-20 w-28 shrink-0 rounded-xl border border-gray-100 bg-white p-2"><Image src={brand.image} alt={brand.name} fill sizes="112px" className="object-contain p-2" /></div>}
        <div><h1 className="text-3xl font-extrabold">{brand.name}</h1><p className="text-gray-500">Everything we carry from {brand.name}.</p></div>
      </div>
      <ProductsListing searchParams={searchParams} basePath={`/brands/${brand._id}`} fixed={{ brand: brand._id }} />
    </div>
  );
}
