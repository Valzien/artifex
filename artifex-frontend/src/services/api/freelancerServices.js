import api from "@/lib/axios";

export async function getFreelancerServices() {
  return api.get("/freelancer/services").then((r) => r.data.data);
}

export async function addFreelancerService(service) {
  return api.post("/freelancer/services", service).then((r) => r.data.data);
}

export async function updateFreelancerService(id, fields) {
  return api.put(`/freelancer/services/${id}`, fields).then((r) => r.data.data);
}

export async function deleteFreelancerService(id) {
  return api.delete(`/freelancer/services/${id}`);
}
