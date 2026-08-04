import api from "@/lib/axios";

export async function getUsers({ role } = {}) {
  const { data } = await api.get("/admin/users", { params: { role } });
  return data;
}

export async function getUserById(id) {
  const { data } = await api.get(`/admin/users/${id}`);
  return data.data;
}

export async function updateUser(id, fields) {
  const { data } = await api.put(`/admin/users/${id}`, fields);
  return data.data;
}

export async function deleteUser(id) {
  await api.delete(`/admin/users/${id}`);
}
