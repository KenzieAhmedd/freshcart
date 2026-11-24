import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone, RotateCcw, ShieldCheck, Truck, Twitter, Headphones, Youtube } from "lucide-react";
import Logo from "@/components/ui/Logo";

const COLUMNS: { title: string; links: [string, string][] }[] = [
  { title: "Shop", links: [["All Products", "/products"], ["Categories", "/categories"], ["Brands", "/brands"], ["Deals", "/deals"]] },
  { title: "Account", links: [["My Account", "/profile"], ["Order History", "/orders"], ["Wishlist", "/wishlist"], ["Shopping Cart", "/cart"], ["Sign In", "/login"], ["Create Account", "/register"]] },
  { title: "Support", links: [["Contact Us", "/contact"], ["Help Center", "/help"], ["Shipping Info", "/shipping"], ["Returns & Refunds", "/returns"], ["Track Order", "/orders"]] },
  { title: "Legal", links: [["Privacy Policy", "/privacy"], ["Terms of Service", "/terms"], ["Cookie Policy", "/cookies"]] },
];

const PERKS = [
  { icon: Truck, title: "Free Shipping", text: "On orders over 500 EGP" },
  { icon: RotateCcw, title: "Easy Returns", text: "14-day return policy" },
  { icon: ShieldCheck, title: "Secure Payment", text: "100% secure checkout" },
  { icon: Headphones, title: "24/7 Support", text: "Contact us anytime" },
];

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200 bg-gray-50">
      <div className="container-fc grid grid-cols-2 gap-6 border-b border-gray-200 py-8 lg:grid-cols-4">
        {PERKS.map(({ icon: Icon, title, text }) => (
          <div key={title} className="flex items-center gap-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700"><Icon className="h-5 w-5" /></span>
            <div><h4 className="text-sm font-semibold">{title}</h4><p className="text-xs text-gray-500">{text}</p></div>
          </div>
        ))}
      </div>

      <div className="container-fc grid gap-10 py-12 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-600">
            FreshCart is your one-stop destination for quality products. From fashion to electronics, we bring you the best brands at competitive prices with a seamless shopping experience.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary-600" /> +1 (800) 123-4567</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-primary-600" /> support@freshcart.com</li>
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary-600" /> 123 Commerce Street, New York, NY 10001</li>
          </ul>
          <div className="mt-5 flex gap-2">
            {[[Facebook, "Facebook"], [Twitter, "Twitter"], [Instagram, "Instagram"], [Youtube, "YouTube"]].map(([Icon, label]) => {
              const I = Icon as typeof Facebook;
              return (
                <a key={label as string} href="#" aria-label={label as string} className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 shadow-card transition-colors hover:bg-primary-600 hover:text-white">
                  <I className="h-4 w-4" />
                </a>
              );
            })}
          </div>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="mb-4 text-sm font-semibold text-gray-900">{col.title}</h3>
            <ul className="space-y-2.5 text-sm text-gray-600">
              {col.links.map(([label, href]) => (
                <li key={label}><Link href={href} className="hover:text-primary-600">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-200">
        <div className="container-fc flex flex-col items-center justify-between gap-3 py-5 text-sm text-gray-500 sm:flex-row">
          <p>© {new Date().getFullYear()} FreshCart. All rights reserved.</p>
          <p className="flex items-center gap-4 font-medium text-gray-600"><span>Visa</span><span>Mastercard</span><span>PayPal</span></p>
        </div>
      </div>
    </footer>
  );
}
