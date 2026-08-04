import api from "@/lib/axios";

export async function getFreelancerEarnings() {
  return api.get("/freelancer/earnings").then((r) => r.data.data);
}

export async function requestWithdraw(amount, bankName, accountNumber) {
  return api
    .post("/freelancer/withdrawals", { amount, bankName, accountNumber })
    .then((r) => r.data);
}
