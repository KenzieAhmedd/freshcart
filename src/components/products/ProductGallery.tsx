"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/utils/format";

export default function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  const list = images.length ? images : [];
  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
        {list[active] && <Image src={list[active]} alt={title} fill priority sizes="(min-width:1024px) 45vw, 100vw" className="object-contain" />}
      </div>
      {list.length > 1 && (
        <ul className="mt-3 flex gap-3 overflow-x-auto pb-1">
          {list.map((src, i) => (
            <li key={src + i}>
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Show image ${i + 1}`}
                aria-current={i === active}
                className={cn("relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 bg-gray-50 transition-colors", i === active ? "border-primary-600" : "border-transparent hover:border-gray-300")}
              >
                <Image src={src} alt="" fill sizes="80px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
