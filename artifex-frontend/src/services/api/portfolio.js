import api from "@/lib/axios";

export async function getPublicPortfolios({ category } = {}) {
  const { data } = await api.get("/portfolio", { params: { category } });
  return data.data;
}

export async function getPublicPortfolioById(id) {
  const { data } = await api.get(`/portfolio/${id}`);
  return data.data;
}
