import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/cart", "/wishlist", "/checkout", "/orders", "/profile", "/change-password"];
const GUEST_ONLY = ["/login", "/register", "/forgot-password"];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const signedIn = req.cookies.has("fc_token");

  if (!signedIn && PROTECTED.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = `?redirect=${encodeURIComponent(pathname + req.nextUrl.search)}`;
    return NextResponse.redirect(url);
  }

  if (signedIn && GUEST_ONLY.includes(pathname)) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/cart/:path*", "/wishlist/:path*", "/checkout/:path*", "/orders/:path*", "/profile/:path*", "/change-password", "/login", "/register", "/forgot-password"],
};
