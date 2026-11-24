"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ChevronDown, Heart, Headphones, LogOut, Menu, Package, ShoppingCart, UserCircle, KeyRound, X } from "lucide-react";
import Logo from "@/components/ui/Logo";
import SearchBar from "./SearchBar";
import { useAuthStore } from "@/store/auth.store";
import { useCartStore } from "@/store/cart.store";
import { useWishlistStore } from "@/store/wishlist.store";
import { toast } from "@/store/toast.store";
import { cn } from "@/utils/format";
import type { Category } from "@/types";

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-600 px-1 text-[11px] font-bold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

export default function Header({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const { token, user, hydrated, logout } = useAuthStore();
  const cartCount = useCartStore((s) => s.cart.numOfCartItems);
  const wishCount = useWishlistStore((s) => s.ids.length);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const catRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
    setCatOpen(false);
    setUserOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (catRef.current && !catRef.current.contains(e.target as Node)) setCatOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") { setCatOpen(false); setUserOpen(false); setMobileOpen(false); }
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onClick); document.removeEventListener("keydown", onKey); };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  function handleLogout() {
    logout();
    useCartStore.getState().reset();
    useWishlistStore.getState().reset();
    toast.info("You've been signed out");
    router.push("/login");
  }

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={cn("text-sm font-medium transition-colors hover:text-primary-600", (href === "/" ? pathname === "/" : pathname.startsWith(href)) ? "text-primary-600" : "text-gray-700")}
    >
      {label}
    </Link>
  );

  const signedIn = hydrated && !!token;

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="container-fc flex h-16 items-center gap-4 lg:gap-8">
        <button className="rounded-lg p-2 text-gray-700 hover:bg-gray-100 lg:hidden" onClick={() => setMobileOpen(true)} aria-label="Open menu">
          <Menu className="h-6 w-6" />
        </button>
        <Logo />

        <nav className="ml-2 hidden items-center gap-6 lg:flex" aria-label="Main">
          {navLink("/", "Home")}
          {navLink("/products", "Shop")}
          <div className="relative" ref={catRef}>
            <button
              onClick={() => setCatOpen((o) => !o)}
              aria-expanded={catOpen}
              aria-haspopup="true"
              className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-primary-600"
            >
              Categories <ChevronDown className={cn("h-4 w-4 transition-transform", catOpen && "rotate-180")} />
            </button>
            {catOpen && (
              <div className="absolute left-0 top-full z-50 mt-3 w-60 animate-slideIn rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
                <Link href="/categories" className="block rounded-lg px-3 py-2 text-sm font-semibold text-primary-700 hover:bg-primary-50">All Categories</Link>
                {categories.slice(0, 8).map((c) => (
                  <Link key={c._id} href={`/categories/${c._id}`} className="block rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700">
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          {navLink("/brands", "Brands")}
        </nav>

        <div className="ml-auto hidden max-w-md flex-1 md:block">
          <Suspense fallback={null}><SearchBar /></Suspense>
        </div>

        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Link href="/contact" className="mr-2 hidden items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 xl:flex">
            <Headphones className="h-5 w-5 text-primary-600" />
            <span className="leading-tight"><span className="block text-[11px] text-gray-500">Support</span>24/7 Help</span>
          </Link>
          <Link href="/wishlist" aria-label={`Wishlist, ${wishCount} items`} className="relative rounded-lg p-2.5 text-gray-700 hover:bg-gray-100 hover:text-primary-600">
            <Heart className="h-6 w-6" /><Badge count={signedIn ? wishCount : 0} />
          </Link>
          <Link href="/cart" aria-label={`Cart, ${cartCount} items`} className="relative rounded-lg p-2.5 text-gray-700 hover:bg-gray-100 hover:text-primary-600">
            <ShoppingCart className="h-6 w-6" /><Badge count={signedIn ? cartCount : 0} />
          </Link>

          {signedIn ? (
            <div className="relative ml-1" ref={userRef}>
              <button onClick={() => setUserOpen((o) => !o)} aria-expanded={userOpen} aria-haspopup="true" className="flex items-center gap-2 rounded-lg p-2 text-sm font-medium text-gray-700 hover:bg-gray-100">
                <UserCircle className="h-6 w-6 text-primary-600" />
                <span className="hidden max-w-[110px] truncate sm:block">{user?.name?.split(" ")[0] || "Account"}</span>
              </button>
              {userOpen && (
                <div className="absolute right-0 top-full z-50 mt-3 w-56 animate-slideIn rounded-xl border border-gray-100 bg-white p-2 shadow-xl">
                  <div className="border-b border-gray-100 px-3 pb-2 pt-1">
                    <p className="truncate text-sm font-semibold">{user?.name}</p>
                    <p className="truncate text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <Link href="/profile" className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-primary-50"><UserCircle className="h-4 w-4" /> My Account</Link>
                  <Link href="/orders" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-primary-50"><Package className="h-4 w-4" /> My Orders</Link>
                  <Link href="/change-password" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-primary-50"><KeyRound className="h-4 w-4" /> Change Password</Link>
                  <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"><LogOut className="h-4 w-4" /> Sign Out</button>
                </div>
              )}
            </div>
          ) : (
            hydrated && <Link href="/login" className="btn-primary ml-2 hidden !py-2 sm:inline-flex">Sign In</Link>
          )}
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 flex w-[85%] max-w-sm animate-slideIn flex-col overflow-y-auto bg-white p-5 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <Logo />
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="rounded-lg p-2 hover:bg-gray-100"><X className="h-6 w-6" /></button>
            </div>
            <Suspense fallback={null}><SearchBar onDone={() => setMobileOpen(false)} className="mb-5" /></Suspense>
            <nav className="flex flex-col gap-1 text-base font-medium" aria-label="Mobile">
              {[["/", "Home"], ["/products", "Shop"], ["/categories", "Categories"], ["/brands", "Brands"], ["/wishlist", "Wishlist"], ["/cart", "Cart"], ["/orders", "My Orders"]].map(([href, label]) => (
                <Link key={href} href={href} className="rounded-lg px-3 py-3 hover:bg-primary-50 hover:text-primary-700">{label}</Link>
              ))}
            </nav>
            <div className="mt-auto border-t border-gray-100 pt-5">
              {signedIn ? (
                <button onClick={handleLogout} className="btn-outline w-full"><LogOut className="h-4 w-4" /> Sign Out</button>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Link href="/login" className="btn-primary">Sign In</Link>
                  <Link href="/register" className="btn-outline">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
