import { Suspense } from "react";
import { PackageSearch } from "lucide-react";
import { productsService } from "@/services/products.service";
import { brandsService } from "@/services/brands.service";
import { categoriesService } from "@/services/categories.service";
import { getErrorMessage } from "@/services/api";
import type { Brand, Category, ListResponse, Product } from "@/types";
import EmptyState, { ErrorState } from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import ProductGrid from "./ProductGrid";
import ProductFilters from "./ProductFilters";
import SortSelect from "./SortSelect";

export type SearchParams = Record<string, string | string[] | undefined>;

interface Props {
  searchParams: SearchParams;
  basePath: string;
  /** Scope the listing to one category or brand (detail pages). */
  fixed?: { category?: string; brand?: string };
}

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v);
const num = (v: string | undefined) => (v !== undefined && v !== "" && !Number.isNaN(Number(v)) ? Number(v) : undefined);

/** Server component: reads the URL, fetches from the API, renders filters + grid + pagination. */
export default async function ProductsListing({ searchParams, basePath, fixed }: Props) {
  const page = Math.max(1, num(one(searchParams.page)) ?? 1);
  const query = {
    page,
    limit: 12,
    sort: one(searchParams.sort),
    keyword: one(searchParams.keyword),
    category: fixed?.category ?? one(searchParams.category),
    brand: fixed?.brand ?? one(searchParams.brand),
    subcategory: one(searchParams.subcategory),
    minPrice: num(one(searchParams.minPrice)),
    maxPrice: num(one(searchParams.maxPrice)),
  };

  const hide: ("category" | "brand")[] = [];
  if (fixed?.category) hide.push("category");
  if (fixed?.brand) hide.push("brand");

  let result: ListResponse<Product> | null = null;
  let error = "";
  let categories: Category[] = [];
  let brands: Brand[] = [];

  const [productsRes, catsRes, brandsRes] = await Promise.allSettled([
    productsService.list(query),
    hide.includes("category") ? Promise.resolve([] as Category[]) : categoriesService.list(),
    hide.includes("brand") ? Promise.resolve([] as Brand[]) : brandsService.list(),
  ]);
  if (productsRes.status === "fulfilled") result = productsRes.value;
  else error = getErrorMessage(productsRes.reason, "We couldn't load products right now.");
  if (catsRes.status === "fulfilled") categories = catsRes.value;
  if (brandsRes.status === "fulfilled") brands = brandsRes.value;

  const hrefFor = (p: number) => {
    const qs = new URLSearchParams();
    Object.entries(searchParams).forEach(([k, v]) => {
      const val = one(v);
      if (val && k !== "page") qs.set(k, val);
    });
    if (p > 1) qs.set("page", String(p));
    const s = qs.toString();
    return s ? `${basePath}?${s}` : basePath;
  };

  const totalPages = result?.metadata?.numberOfPages ?? 1;

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      <Suspense fallback={null}>
        <ProductFilters categories={categories} brands={brands} hide={hide} />
      </Suspense>
      <div className="min-w-0 flex-1">
        <div className="mb-5 flex items-center justify-between gap-3">
          <p className="text-sm text-gray-500" aria-live="polite">
            {result ? (
              <>
                {query.keyword && <>Results for <strong className="text-gray-800">“{query.keyword}”</strong> · </>}
                Page {page} of {totalPages}
              </>
            ) : null}
          </p>
          <Suspense fallback={null}><SortSelect /></Suspense>
        </div>

        {error ? (
          <ErrorState message={error} />
        ) : result && result.data.length > 0 ? (
          <>
            <ProductGrid products={result.data} />
            <Pagination current={page} total={totalPages} hrefFor={hrefFor} />
          </>
        ) : (
          <EmptyState icon={PackageSearch} title="No products found" description="Try different keywords or clear some filters." actionLabel="Clear filters" actionHref={basePath} />
        )}
      </div>
    </div>
  );
}
