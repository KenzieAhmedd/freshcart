import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categoriesService } from "@/services/categories.service";
import { isNotFound } from "@/services/api";
import type { Category, Subcategory } from "@/types";
import ProductsListing, { type SearchParams } from "@/components/products/ProductsListing";

type Props = { params: { id: string }; searchParams: SearchParams };

async function load(id: string): Promise<Category | null> {
  try { return await categoriesService.get(id); } catch (e) { if (isNotFound(e)) return null; throw e; }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = await load(params.id).catch(() => null);
  return { title: c ? c.name : "Category" };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const [category, subs, all] = await Promise.all([
    load(params.id),
    categoriesService.subcategories(params.id).catch(() => [] as Subcategory[]),
    categoriesService.list().catch(() => [] as Category[]),
  ]);
  if (!category) notFound();

  return (
    <div className="container-fc py-10">
      <nav aria-label="Breadcrumb" className="mb-5 text-sm text-gray-500">
        <Link href="/categories" className="hover:text-primary-600">Categories</Link> / <span className="text-gray-800">{category.name}</span>
      </nav>
      <h1 className="text-3xl font-extrabold">{category.name}</h1>

      <div className="mt-5 flex flex-wrap gap-2" aria-label="Other categories">
        {all.map((c) => (
          <Link key={c._id} href={`/categories/${c._id}`} aria-current={c._id === category._id ? "page" : undefined}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${c._id === category._id ? "border-primary-600 bg-primary-600 text-white" : "border-gray-300 hover:border-primary-600 hover:text-primary-600"}`}>
            {c.name}
          </Link>
        ))}
      </div>

      {subs.length > 0 && (
        <section className="mt-6" aria-label="Subcategories">
          <h2 className="mb-2 text-sm font-semibold text-gray-500">Subcategories</h2>
          <ul className="flex flex-wrap gap-2">
            <li><Link href={`/categories/${category._id}`} className={`rounded-lg px-3 py-1 text-sm ${!searchParams.subcategory ? "bg-primary-600 text-white" : "bg-primary-50 text-primary-800 hover:bg-primary-100"}`}>All</Link></li>
            {subs.map((s) => (
              <li key={s._id}>
                <Link href={`/categories/${category._id}?subcategory=${s._id}`} className={`rounded-lg px-3 py-1 text-sm ${searchParams.subcategory === s._id ? "bg-primary-600 text-white" : "bg-primary-50 text-primary-800 hover:bg-primary-100"}`}>{s.name}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-8">
        <ProductsListing searchParams={searchParams} basePath={`/categories/${category._id}`} fixed={{ category: category._id }} />
      </div>
    </div>
  );
}
