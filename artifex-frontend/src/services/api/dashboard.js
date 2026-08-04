import api from "@/lib/axios";

export async function getDashboard() {
  const { data } = await api.get("/client/dashboard");
  return data.data;
}
