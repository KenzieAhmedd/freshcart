import { api } from "./api";
import type { Category, ListResponse, Subcategory } from "@/types";

export const categoriesService = {
  async list(limit = 100) {
    const { data } = await api.get<ListResponse<Category>>("/categories", { params: { limit } });
    return data.data;
  },
  async get(id: string) {
    const { data } = await api.get<{ data: Category }>(`/categories/${id}`);
    return data.data;
  },
  async subcategories(categoryId: string) {
    const { data } = await api.get<ListResponse<Subcategory>>(`/categories/${categoryId}/subcategories`);
    return data.data;
  },
};
