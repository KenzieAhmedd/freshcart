import { api, isNotFound } from "./api";
import type { Cart, CartItem } from "@/types";

interface RawCart {
  status?: string;
  numOfCartItems: number;
  cartId?: string;
  data: {
    _id: string;
    products: (Omit<CartItem, "product"> & { product: CartItem["product"] | string })[];
    totalCartPrice: number;
  };
}

export const EMPTY_CART: Cart = { cartId: null, numOfCartItems: 0, totalCartPrice: 0, products: [] };

/** Returns null when the response only has product ids (not populated) so callers can refetch. */
function normalize(raw: RawCart): Cart | null {
  const products = raw.data.products;
  if (products.some((p) => typeof p.product === "string")) return null;
  return {
    cartId: raw.cartId ?? raw.data._id,
    numOfCartItems: raw.numOfCartItems ?? products.length,
    totalCartPrice: raw.data.totalCartPrice,
    products: products as CartItem[],
  };
}

export const cartService = {
  async get(): Promise<Cart> {
    try {
      const { data } = await api.get<RawCart>("/cart");
      return normalize(data) ?? EMPTY_CART;
    } catch (e) {
      // A user who never added anything has no cart yet (404)
      if (isNotFound(e)) return EMPTY_CART;
      throw e;
    }
  },
  async add(productId: string) {
    await api.post("/cart", { productId });
  },
  async updateCount(productId: string, count: number): Promise<Cart | null> {
    const { data } = await api.put<RawCart>(`/cart/${productId}`, { count });
    return normalize(data);
  },
  async remove(productId: string): Promise<Cart | null> {
    const { data } = await api.delete<RawCart>(`/cart/${productId}`);
    return normalize(data);
  },
  async clear() {
    await api.delete("/cart");
  },
};
