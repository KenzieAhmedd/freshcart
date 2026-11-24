import { create } from "zustand";
import { cartService, EMPTY_CART } from "@/services/cart.service";
import { getErrorMessage } from "@/services/api";
import type { Cart } from "@/types";
import { toast } from "./toast.store";

interface CartState {
  cart: Cart;
  loading: boolean;
  loaded: boolean;
  busyIds: string[];
  fetch: () => Promise<void>;
  add: (productId: string) => Promise<boolean>;
  setCount: (productId: string, count: number) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  clear: () => Promise<void>;
  reset: () => void;
}

const withBusy = (ids: string[], id: string) => (ids.includes(id) ? ids : [...ids, id]);
const withoutBusy = (ids: string[], id: string) => ids.filter((x) => x !== id);

export const useCartStore = create<CartState>((set, get) => ({
  cart: EMPTY_CART,
  loading: false,
  loaded: false,
  busyIds: [],

  fetch: async () => {
    set({ loading: true });
    try {
      const cart = await cartService.get();
      set({ cart, loaded: true });
    } catch (e) {
      toast.error(getErrorMessage(e, "Couldn't load your cart."));
    } finally {
      set({ loading: false });
    }
  },

  add: async (productId) => {
    set((s) => ({ busyIds: withBusy(s.busyIds, productId) }));
    try {
      await cartService.add(productId);
      // The add response only holds product ids, so reload the populated cart.
      set({ cart: await cartService.get(), loaded: true });
      toast.success("Added to your cart");
      return true;
    } catch (e) {
      toast.error(getErrorMessage(e, "Couldn't add this item to your cart."));
      return false;
    } finally {
      set((s) => ({ busyIds: withoutBusy(s.busyIds, productId) }));
    }
  },

  setCount: async (productId, count) => {
    if (count < 1) return;
    const previous = get().cart;
    // Update immediately, roll back if the API rejects it.
    const products = previous.products.map((p) => (p.product._id === productId ? { ...p, count } : p));
    set({
      cart: {
        ...previous,
        products,
        totalCartPrice: products.reduce((sum, p) => sum + p.price * p.count, 0),
      },
      busyIds: withBusy(get().busyIds, productId),
    });
    try {
      const fresh = await cartService.updateCount(productId, count);
      set({ cart: fresh ?? (await cartService.get()) });
    } catch (e) {
      set({ cart: previous });
      toast.error(getErrorMessage(e, "Couldn't update the quantity."));
    } finally {
      set((s) => ({ busyIds: withoutBusy(s.busyIds, productId) }));
    }
  },

  remove: async (productId) => {
    const previous = get().cart;
    const products = previous.products.filter((p) => p.product._id !== productId);
    set({
      cart: {
        ...previous,
        products,
        numOfCartItems: products.length,
        totalCartPrice: products.reduce((sum, p) => sum + p.price * p.count, 0),
      },
      busyIds: withBusy(get().busyIds, productId),
    });
    try {
      const fresh = await cartService.remove(productId);
      set({ cart: fresh ?? (await cartService.get()) });
      toast.success("Item removed");
    } catch (e) {
      set({ cart: previous });
      toast.error(getErrorMessage(e, "Couldn't remove this item."));
    } finally {
      set((s) => ({ busyIds: withoutBusy(s.busyIds, productId) }));
    }
  },

  clear: async () => {
    const previous = get().cart;
    set({ cart: EMPTY_CART });
    try {
      await cartService.clear();
    } catch (e) {
      set({ cart: previous });
      toast.error(getErrorMessage(e, "Couldn't clear your cart."));
    }
  },

  reset: () => set({ cart: EMPTY_CART, loaded: false, busyIds: [] }),
}));
