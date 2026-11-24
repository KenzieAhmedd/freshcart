import { api } from "./api";
import type { Order, ShippingAddress } from "@/types";

export const ordersService = {
  /** Cash on delivery: creates the order from the cart. */
  async createCashOrder(cartId: string, shippingAddress: ShippingAddress) {
    const { data } = await api.post<{ status: string; data: Order }>(`/orders/${cartId}`, { shippingAddress });
    return data.data;
  },
  async listForUser(userId: string) {
    const { data } = await api.get<Order[] | { data: Order[] }>(`/orders/user/${userId}`);
    const list = Array.isArray(data) ? data : data.data;
    return [...list].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  },
};
