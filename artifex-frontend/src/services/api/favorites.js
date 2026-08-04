import api from "@/lib/axios";

// getFavorites() → Promise<Service[]>
export async function getFavorites() {
  const { data } = await api.get("/client/favorites");
  return data.data;
}

// toggleFavorite(serviceId) → Promise<{ isFavorite: boolean }>
export async function toggleFavorite(serviceId) {
  const { data } = await api.post(`/client/favorites/${serviceId}`);
  return data.data;
}
