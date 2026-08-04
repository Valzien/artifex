import api from "@/lib/axios";

export async function uploadFile(file) {
  const { data } = await api.post("/upload", {
    name: file.name,
    type: file.type || "application/octet-stream",
    size: file.size,
  });
  await fetch(data.data.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": file.type || "application/octet-stream" },
    body: file,
  });
  return data.data.url;
}
