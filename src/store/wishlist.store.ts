import { create } from "zustand";
import { wishlistService } from "@/services/wishlist.service";
import { getErrorMessage } from "@/services/api";
import type { Product } from "@/types";
import { toast } from "./toast.store";

interface WishlistState {
  items: Product[];
  ids: string[];
  loading: boolean;
  loaded: boolean;
  busyIds: string[];
  fetch: () => Promise<void>;
  toggle: (productId: string) => Promise<void>;
  remove: (productId: string) => Promise<void>;
  reset: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  ids: [],
  loading: false,
  loaded: false,
  busyIds: [],

  fetch: async () => {
    set({ loading: true });
    try {
      const items = await wishlistService.get();
      set({ items, ids: items.map((p) => p._id), loaded: true });
    } catch (e) {
      toast.error(getErrorMessage(e, "Couldn't load your wishlist."));
    } finally {
      set({ loading: false });
    }
  },

  toggle: async (productId) => {
    if (get().ids.includes(productId)) return get().remove(productId);
    set((s) => ({ busyIds: [...s.busyIds, productId] }));
    try {
      const ids = await wishlistService.add(productId);
      set({ ids });
      toast.success("Saved to your wishlist");
      // Refresh full items so the wishlist page is current
      set({ items: await wishlistService.get() });
    } catch (e) {
      toast.error(getErrorMessage(e, "Couldn't save this item."));
    } finally {
      set((s) => ({ busyIds: s.busyIds.filter((x) => x !== productId) }));
    }
  },

  remove: async (productId) => {
    const prev = { items: get().items, ids: get().ids };
    set({
      items: prev.items.filter((p) => p._id !== productId),
      ids: prev.ids.filter((id) => id !== productId),
      busyIds: [...get().busyIds, productId],
    });
    try {
      const ids = await wishlistService.remove(productId);
      set({ ids });
      toast.success("Removed from your wishlist");
    } catch (e) {
      set(prev);
      toast.error(getErrorMessage(e, "Couldn't remove this item."));
    } finally {
      set((s) => ({ busyIds: s.busyIds.filter((x) => x !== productId) }));
    }
  },

  reset: () => set({ items: [], ids: [], loaded: false, busyIds: [] }),
}));
