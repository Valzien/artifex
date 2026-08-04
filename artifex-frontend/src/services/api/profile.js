import api from "@/lib/axios";

// getProfile() → Promise<Profile>
export async function getProfile() {
  const { data } = await api.get("/profile");
  return data.data;
}

// updateProfile(fields) → Promise<Profile>
export async function updateProfile(fields) {
  const { data } = await api.put("/profile", fields);
  return data.data;
}
