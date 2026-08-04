import api from "@/lib/axios";

export async function getConversations() {
  const { data } = await api.get("/client/chat/conversations");
  return data.data;
}

export async function startConversation(freelancerId) {
  const { data } = await api.post("/client/chat/conversations", { freelancer_id: freelancerId });
  return data.data;
}

export async function getMessages(conversationId) {
  const { data } = await api.get(`/client/chat/${conversationId}/messages`);
  return data.data;
}

export async function sendMessage(conversationId, payload) {
  const { data } = await api.post(`/client/chat/${conversationId}/messages`, payload);
  return data.data;
}

export async function payChatMessage(conversationId, messageId) {
  const { data } = await api.post(`/client/chat/${conversationId}/messages/${messageId}/pay`);
  return data.data;
}
