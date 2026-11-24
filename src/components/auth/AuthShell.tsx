import Link from "next/link";
import { Leaf, Truck, ShieldCheck } from "lucide-react";

export default function AuthShell({ title, subtitle, children, footer }: { title: string; subtitle: string; children: React.ReactNode; footer?: React.ReactNode }) {
  return (
    <div className="container-fc grid min-h-[70vh] items-center gap-12 py-12 lg:grid-cols-2">
      <div className="hidden lg:block">
        <h2 className="text-4xl font-extrabold leading-tight">Fresh picks, <br />delivered to your door.</h2>
        <p className="mt-4 max-w-md text-gray-600">Sign in to keep your cart, wishlist and orders in one place.</p>
        <ul className="mt-8 space-y-4 text-gray-700">
          <li className="flex items-center gap-3"><Leaf className="h-5 w-5 text-primary-600" /> Quality products from top brands</li>
          <li className="flex items-center gap-3"><Truck className="h-5 w-5 text-primary-600" /> Free shipping on orders over 500 EGP</li>
          <li className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-primary-600" /> Secure checkout and easy returns</li>
        </ul>
      </div>
      <div className="mx-auto w-full max-w-md">
        <div className="card p-6 sm:p-8">
          <h1 className="text-2xl font-extrabold">{title}</h1>
          <p className="mt-1 mb-6 text-sm text-gray-500">{subtitle}</p>
          {children}
        </div>
        {footer && <p className="mt-5 text-center text-sm text-gray-600">{footer}</p>}
      </div>
    </div>
  );
}

export function AuthLink({ href, children }: { href: string; children: React.ReactNode }) {
  return <Link href={href} className="font-semibold text-primary-700 hover:underline">{children}</Link>;
}
