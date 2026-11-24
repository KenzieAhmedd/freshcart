"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/format";

const SLIDES = [
  { title: "Fresh Products Delivered to your Door", text: "Get 20% off your first order", a: { label: "Shop Now", href: "/products" }, b: { label: "View Deals", href: "/deals" }, bg: "from-primary-700 via-primary-600 to-primary-500" },
  { title: "Premium Quality Guaranteed", text: "Fresh from farm to your table", a: { label: "Shop Now", href: "/products" }, b: { label: "Learn More", href: "/about" }, bg: "from-primary-800 via-primary-700 to-primary-600" },
  { title: "Fast & Free Delivery", text: "Same day delivery available", a: { label: "Order Now", href: "/products" }, b: { label: "Delivery Info", href: "/delivery" }, bg: "from-emerald-700 via-primary-600 to-lime-500" },
];

export default function HeroSlider() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), 6000);
    return () => clearInterval(t);
  }, [paused]);

  const go = (n: number) => setI((n + SLIDES.length) % SLIDES.length);

  return (
    <section aria-roledescription="carousel" aria-label="Promotions" className="relative overflow-hidden" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${i * 100}%)` }}>
        {SLIDES.map((s, idx) => (
          <div key={s.title} aria-roledescription="slide" aria-label={`${idx + 1} of ${SLIDES.length}`} aria-hidden={idx !== i} className={cn("flex min-h-[340px] w-full shrink-0 items-center bg-gradient-to-r text-white sm:min-h-[420px]", s.bg)}>
            <div className="container-fc">
              <div className="max-w-xl">
                <h1 className="text-3xl font-extrabold leading-tight sm:text-5xl">{s.title}</h1>
                <p className="mt-3 text-lg text-white/90">{s.text}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link tabIndex={idx === i ? 0 : -1} href={s.a.href} className="btn bg-white text-primary-700 hover:bg-primary-50">{s.a.label}</Link>
                  <Link tabIndex={idx === i ? 0 : -1} href={s.b.href} className="btn border border-white/70 text-white hover:bg-white/10">{s.b.label}</Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => go(i - 1)} aria-label="Previous slide" className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30 sm:flex"><ChevronLeft className="h-5 w-5" /></button>
      <button onClick={() => go(i + 1)} aria-label="Next slide" className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur hover:bg-white/30 sm:flex"><ChevronRight className="h-5 w-5" /></button>
      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
        {SLIDES.map((s, idx) => (
          <button key={s.title} onClick={() => setI(idx)} aria-label={`Go to slide ${idx + 1}`} aria-current={idx === i} className={cn("h-2 rounded-full transition-all", idx === i ? "w-6 bg-white" : "w-2 bg-white/50")} />
        ))}
      </div>
    </section>
  );
}
