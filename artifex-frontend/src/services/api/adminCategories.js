import api from "@/lib/axios";

export async function getAdminCategories({ search } = {}) {
  const { data } = await api.get("/admin/categories", { params: { search } });
  return data;
}

export async function createCategory(fields) {
  const { data } = await api.post("/admin/categories", fields);
  return data.data;
}

export async function updateCategory(id, fields) {
  const { data } = await api.put(`/admin/categories/${id}`, fields);
  return data.data;
}

export async function deleteCategory(id) {
  await api.delete(`/admin/categories/${id}`);
}
