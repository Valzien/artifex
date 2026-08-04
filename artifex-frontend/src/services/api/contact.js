import api from "@/lib/axios";

export async function submitContact(fields) {
  const { data } = await api.post("/contact", fields);
  return data;
}
