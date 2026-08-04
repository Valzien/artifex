import api from "@/lib/axios";

export async function getAdminFaqs() {
  const { data } = await api.get("/admin/faqs");
  return data;
}

export async function createFaq(fields) {
  const { data } = await api.post("/admin/faqs", fields);
  return data.data;
}

export async function updateFaq(id, fields) {
  const { data } = await api.put(`/admin/faqs/${id}`, fields);
  return data.data;
}

export async function deleteFaq(id) {
  await api.delete(`/admin/faqs/${id}`);
}
