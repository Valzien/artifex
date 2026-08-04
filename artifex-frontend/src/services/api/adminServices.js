import api from "@/lib/axios";

export async function getAdminServices({ status } = {}) {
  const { data } = await api.get("/admin/services", { params: { status } });
  return data;
}

export async function updateServiceStatus(id, status) {
  const { data } = await api.put(`/admin/services/${id}/status`, { status });
  return data.data;
}
