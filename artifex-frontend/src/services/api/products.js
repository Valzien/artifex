import api from "@/lib/axios";

export async function getProducts({ category, search, freelancerId } = {}) {
  return api.get("/products", { params: { category, search, freelancer_id: freelancerId } }).then((r) => r.data.data);
}

export async function getProductById(id) {
  return api.get(`/products/${id}`).then((r) => r.data.data);
}
