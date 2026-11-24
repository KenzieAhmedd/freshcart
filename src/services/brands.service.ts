import { api } from "./api";
import type { Brand, ListResponse } from "@/types";

export const brandsService = {
  async list(limit = 100) {
    const { data } = await api.get<ListResponse<Brand>>("/brands", { params: { limit } });
    return data.data;
  },
  async get(id: string) {
    const { data } = await api.get<{ data: Brand }>(`/brands/${id}`);
    return data.data;
  },
};
