"use client";

import { FormEvent, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import type { Brand, Category } from "@/types";

interface Props {
  categories?: Category[];
  brands?: Brand[];
  /** Hide a filter group when the page is already scoped to it (e.g. a brand page). */
  hide?: ("category" | "brand")[];
}

export const SORT_OPTIONS = [
  { value: "", label: "Featured" },
  { value: "-createdAt", label: "Newest" },
  { value: "price", label: "Price: low to high" },
  { value: "-price", label: "Price: high to low" },
  { value: "-ratingsAverage", label: "Top rated" },
  { value: "-sold", label: "Best selling" },
];

export default function ProductFilters({ categories = [], brands = [], hide = [] }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [open, setOpen] = useState(false);
  const [min, setMin] = useState(params.get("minPrice") ?? "");
  const [max, setMax] = useState(params.get("maxPrice") ?? "");

  function update(changes: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    Object.entries(changes).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    next.delete("page");
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  function applyPrice(e: FormEvent) {
    e.preventDefault();
    update({ minPrice: min || null, maxPrice: max || null });
  }

  const activeCount = ["category", "brand", "minPrice", "maxPrice", "keyword"].filter((k) => params.get(k)).length;

  const panel = (
    <div className="space-y-7">
      {!hide.includes("category") && categories.length > 0 && (
        <fieldset>
          <legend className="mb-3 text-sm font-semibold">Category</legend>
          <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="radio" name="category" checked={!params.get("category")} onChange={() => update({ category: null })} className="accent-primary-600" /> All
            </label>
            {categories.map((c) => (
              <label key={c._id} className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="radio" name="category" checked={params.get("category") === c._id} onChange={() => update({ category: c._id })} className="accent-primary-600" /> {c.name}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      {!hide.includes("brand") && brands.length > 0 && (
        <fieldset>
          <legend className="mb-3 text-sm font-semibold">Brand</legend>
          <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input type="radio" name="brand" checked={!params.get("brand")} onChange={() => update({ brand: null })} className="accent-primary-600" /> All
            </label>
            {brands.map((b) => (
              <label key={b._id} className="flex cursor-pointer items-center gap-2 text-sm">
                <input type="radio" name="brand" checked={params.get("brand") === b._id} onChange={() => update({ brand: b._id })} className="accent-primary-600" /> {b.name}
              </label>
            ))}
          </div>
        </fieldset>
      )}
      <form onSubmit={applyPrice}>
        <p className="mb-3 text-sm font-semibold">Price (EGP)</p>
        <div className="flex items-center gap-2">
          <input type="number" min={0} inputMode="numeric" value={min} onChange={(e) => setMin(e.target.value)} placeholder="Min" aria-label="Minimum price" className="input !px-3" />
          <span className="text-gray-400">–</span>
          <input type="number" min={0} inputMode="numeric" value={max} onChange={(e) => setMax(e.target.value)} placeholder="Max" aria-label="Maximum price" className="input !px-3" />
        </div>
        <button type="submit" className="btn-outline mt-3 w-full !py-2">Apply price</button>
      </form>
      {activeCount > 0 && (
        <button
          onClick={() => { setMin(""); setMax(""); router.push(pathname); }}
          className="w-full text-sm font-medium text-red-600 hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      <button onClick={() => setOpen(true)} className="btn-outline lg:hidden">
        <SlidersHorizontal className="h-4 w-4" /> Filters{activeCount > 0 && ` (${activeCount})`}
      </button>
      <aside className="hidden w-64 shrink-0 lg:block" aria-label="Filters">
        <div className="card sticky top-24 p-5">{panel}</div>
      </aside>
      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden" role="dialog" aria-modal="true" aria-label="Filters">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] animate-slideIn overflow-y-auto rounded-t-2xl bg-white p-5">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold">Filters</h2>
              <button onClick={() => setOpen(false)} aria-label="Close filters" className="rounded-lg p-2 hover:bg-gray-100"><X className="h-5 w-5" /></button>
            </div>
            {panel}
            <button onClick={() => setOpen(false)} className="btn-primary mt-6 w-full">Show results</button>
          </div>
        </div>
      )}
    </>
  );
}
