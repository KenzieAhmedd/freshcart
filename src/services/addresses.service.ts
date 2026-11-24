import { api } from "./api";
import type { SavedAddress } from "@/types";

export const addressesService = {
  async list() {
    const { data } = await api.get<{ data: SavedAddress[] }>("/addresses");
    return data.data;
  },
  async add(address: Omit<SavedAddress, "_id">) {
    const { data } = await api.post<{ data: SavedAddress[] }>("/addresses", address);
    return data.data;
  },
  async remove(id: string) {
    const { data } = await api.delete<{ data: SavedAddress[] }>(`/addresses/${id}`);
    return data.data;
  },
};
