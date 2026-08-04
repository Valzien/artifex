import { useEffect, useState } from "react";
import { getAdminDashboard } from "@/services/api/adminDashboard";
import { formatCurrency, formatDate } from "@/constants/orderStatus";

function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getAdminDashboard().then((d) => {
      if (mounted) setData(d);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!data) return <p className="p-6">No data</p>;

  const { stats, recentOrders } = data;

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, color: "bg-primary/10 text-primary" },
    { label: "Total Freelancers", value: stats.totalFreelancers, color: "bg-emerald-500/10 text-emerald-400" },
    { label: "Total Clients", value: stats.totalClients, color: "bg-amber-500/10 text-amber-400" },
    { label: "Total Orders", value: stats.totalOrders, color: "bg-rose-500/10 text-rose-400" },
    { label: "Revenue", value: formatCurrency(stats.totalRevenue), color: "bg-emerald-500/10 text-emerald-400" },
    { label: "Pending Orders", value: stats.pendingOrders, color: "bg-red-500/10 text-red-400" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((card) => (
          <div key={card.label} className={`rounded-2xl p-5 ${card.color}`}>
            <p className="text-sm opacity-80">{card.label}</p>
            <p className="text-2xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-surface rounded-2xl p-6 shadow-sm border border-border">
        <h2 className="text-lg font-bold text-ink mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/50 border-b border-border">
                <th className="pb-3 font-medium">Order Code</th>
                <th className="pb-3 font-medium">Service</th>
                <th className="pb-3 font-medium">Client</th>
                <th className="pb-3 font-medium">Freelancer</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders?.map((order) => (
                <tr key={order.id} className="border-b border-border/60">
                  <td className="py-3 font-medium">{order.orderCode}</td>
                  <td className="py-3">{order.serviceName}</td>
                  <td className="py-3">{order.client?.name}</td>
                  <td className="py-3">{order.freelancer?.name}</td>
                  <td className="py-3">{formatCurrency(order.price)}</td>
                  <td className="py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="py-3 text-ink/60">
                    {formatDate(order.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    pending: "bg-amber-500/20 text-amber-400",
    in_progress: "bg-blue-500/20 text-blue-400",
    completed: "bg-emerald-500/20 text-emerald-400",
    cancelled: "bg-red-500/20 text-red-400",
    rejected: "bg-red-500/20 text-red-400",
    disputed: "bg-orange-500/20 text-orange-400",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${map[status] ?? "bg-surface text-ink/60"}`}>
      {status?.replace("_", " ")}
    </span>
  );
}

export default AdminDashboard;
