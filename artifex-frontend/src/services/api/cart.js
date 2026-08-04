import api from "@/lib/axios";

export async function getCartItems() {
  return api.get("/client/cart").then((r) => ({ items: r.data.data, meta: r.data.meta }));
}

export async function addToCart(productId) {
  return api.post("/client/cart", { product_id: productId }).then((r) => r.data);
}

export async function removeFromCart(itemId) {
  return api.delete(`/client/cart/${itemId}`);
}

export async function clearCart() {
  return api.delete("/client/cart");
}

export async function cartCheckout(paymentMethod) {
  return api.post("/client/cart/checkout", { payment_method: paymentMethod }).then((r) => r.data.data);
}

export async function checkoutProduct(productId, paymentMethod) {
  return api.post("/client/product-checkout", { product_id: productId, payment_method: paymentMethod }).then((r) => r.data.data);
}

export async function getProductOrders() {
  return api.get("/client/product-orders").then((r) => r.data.data);
}

export async function downloadProduct(token) {
  return api.get(`/client/download/${token}`).then((r) => r.data.data);
}
