import api from "@/lib/axios";

export async function getFreelancerOrders({ status } = {}) {
  return api
    .get("/freelancer/orders", { params: { status } })
    .then((r) => r.data.data);
}

export async function getFreelancerOrderById(id) {
  return api.get(`/freelancer/orders/${id}`).then((r) => r.data.data);
}

export async function updateOrderStatus(id, status) {
  return api
    .put(`/freelancer/orders/${id}/status`, { status })
    .then((r) => r.data.data);
}

export async function addOrderDeliverable(id, deliverable) {
  return api
    .post(`/freelancer/orders/${id}/deliverable`, deliverable)
    .then((r) => r.data.data);
}
