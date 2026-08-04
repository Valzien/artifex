import api from "@/lib/axios";

export async function getFreelancerDashboard() {
  return api.get("/freelancer/dashboard").then((r) => r.data.data);
}
