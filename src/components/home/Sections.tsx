import Image from "next/image";
import Link from "next/link";
import { ArrowRight, RotateCcw, ShieldCheck, Truck, Headphones } from "lucide-react";
import type { Brand, Category, Product } from "@/types";
import ProductGrid from "@/components/products/ProductGrid";

export function SectionHeader({ title, href, label = "View all" }: { title: string; href?: string; label?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <h2 className="text-2xl font-extrabold sm:text-3xl">{title}</h2>
      {href && <Link href={href} className="flex items-center gap-1 text-sm font-semibold text-primary-700 hover:underline">{label} <ArrowRight className="h-4 w-4" /></Link>}
    </div>
  );
}

export function FeaturesStrip() {
  const items = [
    { icon: Truck, title: "Free Shipping", text: "On orders over 500 EGP" },
    { icon: ShieldCheck, title: "Secure Payment", text: "100% secure transactions" },
    { icon: RotateCcw, title: "Easy Returns", text: "14-day return policy" },
    { icon: Headphones, title: "24/7 Support", text: "Dedicated support team" },
  ];
  return (
    <section className="container-fc -mt-8 relative z-10">
      <ul className="card grid grid-cols-2 gap-4 p-5 lg:grid-cols-4">
        {items.map(({ icon: Icon, title, text }) => (
          <li key={title} className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600"><Icon className="h-6 w-6" /></span>
            <div><h3 className="text-sm font-bold">{title}</h3><p className="text-xs text-gray-500">{text}</p></div>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function CategoryGrid({ categories }: { categories: Category[] }) {
  if (!categories.length) return null;
  return (
    <section className="container-fc mt-14" aria-labelledby="cat-title">
      <SectionHeader title="Shop By Category" href="/categories" label="View All Categories" />
      <h2 id="cat-title" className="sr-only">Categories</h2>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {categories.slice(0, 10).map((c) => (
          <li key={c._id}>
            <Link href={`/categories/${c._id}`} className="card group flex flex-col items-center p-4 text-center transition-shadow hover:shadow-pop">
              <span className="relative h-24 w-24 overflow-hidden rounded-full bg-gray-50">{c.image && <Image src={c.image} alt="" fill sizes="96px" className="object-cover transition-transform duration-300 group-hover:scale-110" />}</span>
              <span className="mt-3 text-sm font-semibold group-hover:text-primary-600">{c.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function PromoBanners() {
  return (
    <section className="container-fc mt-14 grid gap-5 md:grid-cols-2" aria-label="Promotions">
      <div className="rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-white">
        <p className="text-sm font-semibold text-primary-100">Deal of the Day</p>
        <h3 className="mt-2 text-2xl font-extrabold">Fresh Organic Fruits</h3>
        <p className="mt-1 text-primary-50">Get up to 40% off on selected organic fruits</p>
        <p className="mt-4 text-sm">Use code: <span className="rounded bg-white/20 px-2 py-0.5 font-mono font-bold">ORGANIC40</span></p>
        <Link href="/deals" className="btn mt-5 bg-white text-primary-700 hover:bg-primary-50">Shop Now</Link>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 p-8 text-white">
        <p className="text-sm font-semibold text-amber-50">New Arrivals</p>
        <h3 className="mt-2 text-2xl font-extrabold">Exotic Vegetables</h3>
        <p className="mt-1 text-amber-50">Discover our latest collection of premium vegetables</p>
        <p className="mt-4 text-sm">Use code: <span className="rounded bg-white/25 px-2 py-0.5 font-mono font-bold">FRESH25</span></p>
        <Link href="/products?sort=-createdAt" className="btn mt-5 bg-white text-orange-600 hover:bg-orange-50">Explore Now</Link>
      </div>
    </section>
  );
}

export function FeaturedProducts({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return (
    <section className="container-fc mt-14" aria-labelledby="feat-title">
      <SectionHeader title="Featured Products" href="/products" />
      <h2 id="feat-title" className="sr-only">Featured products</h2>
      <ProductGrid products={products} />
    </section>
  );
}

export function BrandsStrip({ brands }: { brands: Brand[] }) {
  if (!brands.length) return null;
  return (
    <section className="container-fc mt-14" aria-labelledby="brand-title">
      <SectionHeader title="Top Brands" href="/brands" label="All brands" />
      <h2 id="brand-title" className="sr-only">Brands</h2>
      <ul className="grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-8">
        {brands.slice(0, 8).map((b) => (
          <li key={b._id}>
            <Link href={`/brands/${b._id}`} className="card flex h-24 items-center justify-center p-3 transition-shadow hover:shadow-pop" aria-label={b.name}>
              <span className="relative block h-full w-full">{b.image && <Image src={b.image} alt={b.name} fill sizes="120px" className="object-contain" />}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function AppPromo() {
  return (
    <section className="container-fc mt-16">
      <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-gray-900 px-8 py-10 text-white md:flex-row">
        <div>
          <h2 className="text-2xl font-extrabold sm:text-3xl">Shop Faster on Our App</h2>
          <p className="mt-2 text-gray-300">Get app-exclusive deals and 15% off your first order.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <span className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold">App Store · coming soon</span>
          <span className="rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold">Google Play · coming soon</span>
        </div>
      </div>
    </section>
  );
}
