export function formatPrice(value: number): string {
  return `${new Intl.NumberFormat("en-US").format(Math.round(value))} EGP`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function discountPercent(price: number, after?: number): number {
  if (!after || after >= price) return 0;
  return Math.round(((price - after) / price) * 100);
}

export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(" ");
}

/** Decodes the payload of a JWT (no verification; used only to read the user id). */
export function decodeJwt<T = Record<string, unknown>>(token: string): T | null {
  try {
    const part = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(part)) as T;
  } catch {
    return null;
  }
}

/** Only allow same-site relative redirects after login. */
export function safeRedirect(target: string | null | undefined, fallback = "/"): string {
  if (!target || !target.startsWith("/") || target.startsWith("//")) return fallback;
  return target;
}
