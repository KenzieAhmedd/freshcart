import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

const PAGES: Record<string, { title: string; body: string[] }> = {
  contact: { title: "Contact us", body: ["Questions about an order or a product? Our team replies within one business day.", "Email support@freshcart.com or call +1 (800) 123-4567. Support is available 24/7."] },
  help: { title: "Help Center", body: ["Find answers about orders, payments, returns and your account.", "Can't find what you need? Contact support and we'll sort it out."] },
  shipping: { title: "Shipping info", body: ["Orders over 500 EGP ship free. Delivery times depend on your city and are confirmed after you place the order."] },
  delivery: { title: "Delivery info", body: ["Same-day delivery is available in selected areas. Enter your address at checkout to see what applies to you."] },
  returns: { title: "Returns & refunds", body: ["You can return most items within 14 days of delivery. Items must be unused and in their original packaging."] },
  about: { title: "About FreshCart", body: ["FreshCart brings quality products from top brands to your door, from fashion to electronics, at competitive prices."] },
  privacy: { title: "Privacy policy", body: ["We collect only the details needed to process your orders and keep your account secure. We never sell your personal data."] },
  terms: { title: "Terms of service", body: ["By using FreshCart you agree to shop fairly, keep your account secure and follow our returns and payment policies."] },
  cookies: { title: "Cookie policy", body: ["We use a small session cookie to keep you signed in and remember your cart. We don't use advertising cookies."] },
};

export function generateStaticParams() {
  return Object.keys(PAGES).map((slug) => ({ slug }));
}
export const dynamicParams = false;

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  return { title: PAGES[params.slug]?.title ?? "Page" };
}

export default function InfoPage({ params }: { params: { slug: string } }) {
  const page = PAGES[params.slug];
  if (!page) notFound();
  return (
    <div className="container-fc max-w-3xl py-12">
      <h1 className="text-3xl font-extrabold">{page.title}</h1>
      <div className="mt-6 space-y-4 leading-relaxed text-gray-600">{page.body.map((p) => <p key={p}>{p}</p>)}</div>
      <Link href="/" className="btn-outline mt-8">Back to home</Link>
    </div>
  );
}
