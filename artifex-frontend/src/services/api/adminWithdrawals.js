import api from "@/lib/axios";

export async function getAdminWithdrawals({ status } = {}) {
  const { data } = await api.get("/admin/withdrawals", { params: { status } });
  return data;
}

export async function updateWithdrawalStatus(id, status) {
  const { data } = await api.put(`/admin/withdrawals/${id}/status`, { status });
  return data.data;
}
