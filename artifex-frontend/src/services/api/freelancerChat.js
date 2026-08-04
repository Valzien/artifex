import api from "@/lib/axios";

export async function getConversations() {
  const { data } = await api.get("/freelancer/chat/conversations");
  return data.data;
}

export async function getMessages(conversationId) {
  const { data } = await api.get(`/freelancer/chat/${conversationId}/messages`);
  return data.data;
}

export async function sendMessage(conversationId, payload) {
  const { data } = await api.post(`/freelancer/chat/${conversationId}/messages`, payload);
  return data.data;
}
