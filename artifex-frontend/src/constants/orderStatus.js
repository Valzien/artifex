export const ORDER_STATUS = {
  pending: { label: "Pending", badge: "warning" },
  in_progress: { label: "In Progress", badge: "primary" },
  completed: { label: "Completed", badge: "success" },
  cancelled: { label: "Cancelled", badge: "danger" },
};

export const ORDER_STATUS_TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

export const formatCurrency = (v) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(v);

export const formatDate = (d) =>
  new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(new Date(d));
