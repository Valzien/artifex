import api from "@/lib/axios";

export async function getFreelancerAnalytics() {
  return api.get("/freelancer/analytics").then((r) => r.data.data);
}
