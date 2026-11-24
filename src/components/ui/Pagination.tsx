import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/format";

interface Props {
  current: number;
  total: number;
  /** Builds the href for a page number, preserving other query params. */
  hrefFor: (page: number) => string;
}

export default function Pagination({ current, total, hrefFor }: Props) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === total || Math.abs(p - current) <= 1
  );
  const items: (number | "gap")[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) items.push("gap");
    items.push(p);
  });

  const base = "flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-medium transition-colors";
  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      {current > 1 ? (
        <Link href={hrefFor(current - 1)} className={cn(base, "border-gray-300 hover:border-primary-600 hover:text-primary-600")} aria-label="Previous page">
          <ChevronLeft className="h-4 w-4" />
        </Link>
      ) : null}
      {items.map((it, i) =>
        it === "gap" ? (
          <span key={`g${i}`} className="px-1 text-gray-400">…</span>
        ) : (
          <Link
            key={it}
            href={hrefFor(it)}
            aria-current={it === current ? "page" : undefined}
            className={cn(base, it === current ? "border-primary-600 bg-primary-600 text-white" : "border-gray-300 hover:border-primary-600 hover:text-primary-600")}
          >
            {it}
          </Link>
        )
      )}
      {current < total ? (
        <Link href={hrefFor(current + 1)} className={cn(base, "border-gray-300 hover:border-primary-600 hover:text-primary-600")} aria-label="Next page">
          <ChevronRight className="h-4 w-4" />
        </Link>
      ) : null}
    </nav>
  );
}
