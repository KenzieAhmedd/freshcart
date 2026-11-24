import { api } from "./api";
import type { ListResponse, Product, ProductQuery, Review } from "@/types";

export const productsService = {
  async list(query: ProductQuery = {}) {
    const params: Record<string, string | number> = {};
    if (query.page) params.page = query.page;
    params.limit = query.limit ?? 12;
    if (query.sort) params.sort = query.sort;
    if (query.keyword) params.keyword = query.keyword;
    if (query.category) params.category = query.category;
    if (query.brand) params.brand = query.brand;
    if (query.subcategory) params.subcategory = query.subcategory;
    if (query.minPrice !== undefined) params["price[gte]"] = query.minPrice;
    if (query.maxPrice !== undefined) params["price[lte]"] = query.maxPrice;
    const { data } = await api.get<ListResponse<Product>>("/products", { params });
    return data;
  },
  async get(id: string) {
    const { data } = await api.get<{ data: Product }>(`/products/${id}`);
    return data.data;
  },
  async reviews(productId: string) {
    const { data } = await api.get<ListResponse<Review>>(`/products/${productId}/reviews`);
    return data.data;
  },
  async addReview(productId: string, review: string, rating: number) {
    const { data } = await api.post<{ data: Review }>(`/products/${productId}/reviews`, { review, rating });
    return data.data;
  },
};
