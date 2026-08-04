import api from "@/lib/axios";

// getNotifications(role) -> Promise<Notification[]>
export async function getNotifications(role) {
  const { data } = await api.get(`/${role}/notifications`);
  return data.data;
}

// markAsRead(id, role) -> Promise<void>
export async function markAsRead(id, role) {
  await api.put(`/${role}/notifications/${id}/read`);
}

// markAllAsRead(role) -> Promise<void>
export async function markAllAsRead(role) {
  await api.put(`/${role}/notifications/read-all`);
}
