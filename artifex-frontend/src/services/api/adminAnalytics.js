import api from "@/lib/axios";

export async function getAdminAnalytics() {
  const { data } = await api.get("/admin/analytics");
  return data.data;
}
