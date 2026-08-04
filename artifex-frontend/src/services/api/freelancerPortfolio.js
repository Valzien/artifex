import api from "@/lib/axios";

export async function getPortfolioItems() {
  return api.get("/freelancer/portfolio").then((r) => r.data.data);
}

export async function addPortfolioItem(item) {
  return api.post("/freelancer/portfolio", item).then((r) => r.data.data);
}

export async function deletePortfolioItem(id) {
  return api.delete(`/freelancer/portfolio/${id}`);
}
