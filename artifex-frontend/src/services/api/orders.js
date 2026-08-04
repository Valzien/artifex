import api from "@/lib/axios";

// getOrders({ status? }) → Promise<Order[]>
export async function getOrders({ status } = {}) {
  const { data } = await api.get("/client/orders", { params: { status } });
  return data.data;
}

// getOrderById(id) → Promise<Order | null>
export async function getOrderById(id) {
  const { data } = await api.get(`/client/orders/${id}`);
  return data.data;
}

export async function submitOrderReview(orderId, payload) {
  const { data } = await api.post(`/client/orders/${orderId}/review`, payload);
  return data.data;
}
