import { api } from "./api";
import type { Product } from "@/types";

export const wishlistService = {
  async get() {
    const { data } = await api.get<{ count: number; data: Product[] }>("/wishlist");
    return data.data;
  },
  async add(productId: string) {
    const { data } = await api.post<{ data: string[] }>("/wishlist", { productId });
    return data.data;
  },
  async remove(productId: string) {
    const { data } = await api.delete<{ data: string[] }>(`/wishlist/${productId}`);
    return data.data;
  },
};
