import api from "@/lib/axios";

export async function getFreelancerReviews() {
  return api.get("/freelancer/reviews").then((r) => r.data.data);
}
