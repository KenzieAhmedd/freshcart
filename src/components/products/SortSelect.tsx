"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SORT_OPTIONS } from "./ProductFilters";

export default function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function onChange(value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set("sort", value); else next.delete("sort");
    next.delete("page");
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <label htmlFor="sort" className="hidden text-gray-500 sm:block">Sort by</label>
      <select id="sort" value={params.get("sort") ?? ""} onChange={(e) => onChange(e.target.value)} className="input !w-auto !py-2 pr-8">
        {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}
