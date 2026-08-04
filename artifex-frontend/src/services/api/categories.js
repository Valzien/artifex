import api from "@/lib/axios";

/**
 * Category API — semua function return Promise.
 */

export async function getCategories() {
  const { data } = await api.get("/categories");
  return data.data;
}

export async function getCategoryBySlug(slug) {
  const { data } = await api.get(`/categories/${slug}`);
  return data.data;
}
