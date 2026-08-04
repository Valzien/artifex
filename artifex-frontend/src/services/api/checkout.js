import api from "@/lib/axios";

export async function getPaymentMethods() {
  const { data } = await api.get("/client/checkout/payment-methods");
  return data.data;
}

export async function createOrder(payload) {
  const { data } = await api.post("/client/checkout", payload);
  return data.data;
}
