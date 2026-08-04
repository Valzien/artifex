import api from "@/lib/axios";

/**
 * FAQ API — semua function return Promise.
 */

export async function getFaq() {
  const { data } = await api.get("/faq");
  return data.data;
}
