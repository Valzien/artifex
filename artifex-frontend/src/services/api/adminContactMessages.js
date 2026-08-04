import api from "@/lib/axios";

export async function getAdminContactMessages(status) {
  const { data } = await api.get("/admin/contact-messages", {
    params: status ? { status } : undefined,
  });
  return data;
}

export async function markContactRead(id) {
  const { data } = await api.put(`/admin/contact-messages/${id}/read`);
  return data;
}

export async function deleteContactMessage(id) {
  await api.delete(`/admin/contact-messages/${id}`);
}
