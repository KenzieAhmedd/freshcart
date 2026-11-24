import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Tags } from "lucide-react";
import { brandsService } from "@/services/brands.service";
import { getErrorMessage } from "@/services/api";
import type { Brand } from "@/types";
import EmptyState, { ErrorState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Brands" };

export default async function BrandsPage() {
  let brands: Brand[] = [];
  let error = "";
  try { brands = await brandsService.list(); } catch (e) { error = getErrorMessage(e, "We couldn't load brands."); }

  return (
    <div className="container-fc py-10">
      <h1 className="text-3xl font-extrabold">Top Brands</h1>
      <p className="mt-1 mb-8 text-gray-500">Shop by the labels you trust.</p>
      {error ? <ErrorState message={error} /> : brands.length === 0 ? (
        <EmptyState icon={Tags} title="No brands yet" description="Check back soon." actionLabel="Browse products" actionHref="/products" />
      ) : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {brands.map((b) => (
            <li key={b._id}>
              <Link href={`/brands/${b._id}`} className="card group flex h-full flex-col items-center p-4 text-center transition-shadow hover:shadow-pop">
                <div className="relative h-24 w-full">{b.image && <Image src={b.image} alt="" fill sizes="160px" className="object-contain" />}</div>
                <span className="mt-3 text-sm font-semibold group-hover:text-primary-600">{b.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
