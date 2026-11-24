import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { LayoutGrid } from "lucide-react";
import { categoriesService } from "@/services/categories.service";
import { getErrorMessage } from "@/services/api";
import type { Category } from "@/types";
import EmptyState, { ErrorState } from "@/components/ui/EmptyState";

export const metadata: Metadata = { title: "Categories" };

export default async function CategoriesPage() {
  let categories: Category[] = [];
  let error = "";
  try { categories = await categoriesService.list(); } catch (e) { error = getErrorMessage(e, "We couldn't load categories."); }

  return (
    <div className="container-fc py-10">
      <h1 className="text-3xl font-extrabold">All Categories</h1>
      <p className="mt-1 mb-8 text-gray-500">Pick a department to start browsing.</p>
      {error ? <ErrorState message={error} /> : categories.length === 0 ? (
        <EmptyState icon={LayoutGrid} title="No categories yet" actionLabel="Browse products" actionHref="/products" />
      ) : (
        <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((c) => (
            <li key={c._id}>
              <Link href={`/categories/${c._id}`} className="card group block overflow-hidden transition-shadow hover:shadow-pop">
                <div className="relative aspect-[4/3] bg-gray-50">{c.image && <Image src={c.image} alt="" fill sizes="(min-width:1024px) 22vw, 45vw" className="object-cover transition-transform duration-300 group-hover:scale-105" />}</div>
                <p className="p-4 text-center font-semibold group-hover:text-primary-600">{c.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
