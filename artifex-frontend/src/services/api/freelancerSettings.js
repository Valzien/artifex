import api from "@/lib/axios";

export async function updatePassword({ current_password, password, password_confirmation }) {
  const { data } = await api.put("/freelancer/settings", {
    current_password,
    password,
    password_confirmation,
  });
  return data;
}

export async function deleteAccount() {
  const { data } = await api.delete("/freelancer/settings");
  return data;
}
