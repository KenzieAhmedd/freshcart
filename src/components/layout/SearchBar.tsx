"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar({ onDone, className = "" }: { onDone?: () => void; className?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(params.get("keyword") ?? "");

  function submit(e: FormEvent) {
    e.preventDefault();
    const q = value.trim();
    router.push(q ? `/products?keyword=${encodeURIComponent(q)}` : "/products");
    onDone?.();
  }

  return (
    <form onSubmit={submit} role="search" className={`relative ${className}`}>
      <label htmlFor="site-search" className="sr-only">Search products</label>
      <input
        id="site-search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for products…"
        className="input pr-12"
      />
      <button type="submit" aria-label="Search" className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-gray-500 hover:text-primary-600">
        <Search className="h-4 w-4" />
      </button>
    </form>
  );
}
