import api from "@/lib/axios";

export async function getClientTransactions() {
  const { data } = await api.get("/client/transactions");
  return data.data;
}
