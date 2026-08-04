import api from "@/lib/axios";

export async function getFreelancerProducts() {
  return api.get("/freelancer/products").then((r) => r.data.data);
}

export async function addFreelancerProduct(product) {
  return api.post("/freelancer/products", product).then((r) => r.data.data);
}

export async function updateFreelancerProduct(id, fields) {
  return api.put(`/freelancer/products/${id}`, fields).then((r) => r.data.data);
}

export async function deleteFreelancerProduct(id) {
  return api.delete(`/freelancer/products/${id}`);
}
