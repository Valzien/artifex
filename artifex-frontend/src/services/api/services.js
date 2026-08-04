import api from "@/lib/axios";

/**
 * Service API — semua function return Promise supaya pas ganti axios tinggal ganti.
 */

export async function getServices({ category, search, sort } = {}) {
  const { data } = await api.get("/services", { params: { category, search, sort } });
  return data.data;
}

export async function getServiceById(id) {
  const { data } = await api.get(`/services/${id}`);
  return data.data;
}

// Service detail data (paket harga, review, deskripsi lengkap)
export async function getServiceDetail(id) {
  const { data } = await api.get(`/services/${id}/detail`);
  return data.data;
}
