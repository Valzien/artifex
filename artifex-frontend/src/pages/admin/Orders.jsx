import { useEffect, useState } from "react";
import { getAdminOrders, updateOrderStatus } from "@/services/api/adminOrders";
import { formatCurrency, formatDate } from "@/constants/orderStatus";

const STATUS_OPTIONS = ["pending", "in_progress", "completed", "cancelled", "rejected", "disputed"];

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    let mounted = true;
    getAdminOrders({ status: statusFilter || undefined }).then((res) => {
      if (mounted) setOrders(res.data);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, [statusFilter]);

  const handleStatus = async (id, status) => {
    await updateOrderStatus(id, status);
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-border bg-surface rounded-xl px-3 py-2 text-sm text-ink"
        >
          <option value="">All Status</option>
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s.replace("_", " ")}</option>
          ))}
        </select>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/50 bg-surface">
              <th className="px-4 py-3 font-medium">Order Code</th>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">Client</th>
              <th className="px-4 py-3 font-medium">Freelancer</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-ink/40">Loading...</td></tr>
            ) : orders.length === 0 ? (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-ink/40">No orders found</td></tr>
            ) : orders.map((order) => (
              <tr key={order.id} className="border-t border-border/60 hover:bg-surface">
                <td className="px-4 py-3 font-medium">{order.orderCode}</td>
                <td className="px-4 py-3">{order.serviceName}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <img src={order.client?.avatar || "/avatar.jpg"} className="w-6 h-6 rounded-full object-cover" alt="" />
                    <span>{order.client?.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <img src={order.freelancer?.avatar || "/avatar.jpg"} className="w-6 h-6 rounded-full object-cover" alt="" />
                    <span>{order.freelancer?.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{formatCurrency(order.price)}</td>
                <td className="px-4 py-3">
                  <StatusSelect status={order.status} onChange={(s) => handleStatus(order.id, s)} />
                </td>
                <td className="px-4 py-3 text-ink/60">{formatDate(order.createdAt)}</td>
                <td className="px-4 py-3 text-ink/40 text-xs">{order.deadline ? formatDate(order.deadline) : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusSelect({ status, onChange }) {
  const map = {
    pending: "bg-amber-500/20 text-amber-400",
    in_progress: "bg-blue-500/20 text-blue-400",
    completed: "bg-emerald-500/20 text-emerald-400",
    cancelled: "bg-red-500/20 text-red-400",
    rejected: "bg-red-500/20 text-red-400",
    disputed: "bg-orange-500/20 text-orange-400",
  };
  return (
    <select
      value={status}
      onChange={(e) => onChange(e.target.value)}
      className={`px-2 py-1 rounded-lg text-xs font-medium border-0 cursor-pointer ${map[status] ?? "bg-surface text-ink/60"}`}
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>{s.replace("_", " ")}</option>
      ))}
    </select>
  );
}

export default AdminOrders;
