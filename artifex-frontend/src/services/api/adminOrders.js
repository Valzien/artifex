import api from "@/lib/axios";

export async function getAdminOrders({ status } = {}) {
  const { data } = await api.get("/admin/orders", { params: { status } });
  return data;
}

export async function getAdminOrderById(id) {
  const { data } = await api.get(`/admin/orders/${id}`);
  return data.data;
}

export async function updateOrderStatus(id, status) {
  const { data } = await api.put(`/admin/orders/${id}/status`, { status });
  return data.data;
}
