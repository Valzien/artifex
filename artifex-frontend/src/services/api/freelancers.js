import api from "@/lib/axios";

/**
 * Freelancer API — semua function return Promise.
 */

export async function getFreelancers({ specialty, search } = {}) {
  const { data } = await api.get("/freelancers", { params: { specialty, search } });
  return data.data;
}

export async function getFreelancerById(id) {
  const { data } = await api.get(`/freelancers/${id}`);
  return data.data;
}
