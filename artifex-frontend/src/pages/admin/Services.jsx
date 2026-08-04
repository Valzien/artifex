import { useEffect, useState } from "react";
import { getAdminServices, updateServiceStatus } from "@/services/api/adminServices";
import { formatCurrency } from "@/constants/orderStatus";

function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    let mounted = true;
    getAdminServices({ status: statusFilter || undefined }).then((res) => {
      if (mounted) setServices(res.data);
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, [statusFilter]);

  const handleStatus = async (id, status) => {
    await updateServiceStatus(id, status);
    setServices((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
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
          <option value="active">Active</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/50 bg-surface">
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Freelancer</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Delivery</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-ink/40">Loading...</td></tr>
            ) : services.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-ink/40">No services found</td></tr>
            ) : services.map((service) => (
              <tr key={service.id} className="border-t border-border/60 hover:bg-surface">
                <td className="px-4 py-3 font-medium">{service.title}</td>
                <td className="px-4 py-3 text-ink/60">{service.category}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <img src={service.freelancer?.avatar || "/avatar.jpg"} className="w-6 h-6 rounded-full object-cover" alt="" />
                    <span>{service.freelancer?.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{formatCurrency(service.price)}</td>
                <td className="px-4 py-3">{service.deliveryDays} days</td>
                <td className="px-4 py-3">
                  <StatusBadge status={service.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {service.status !== "active" && (
                      <button onClick={() => handleStatus(service.id, "active")} className="text-emerald-400 hover:underline text-xs">Approve</button>
                    )}
                    {service.status !== "rejected" && (
                      <button onClick={() => handleStatus(service.id, "rejected")} className="text-red-400 hover:underline text-xs">Reject</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    active: "bg-emerald-500/20 text-emerald-400",
    pending: "bg-amber-500/20 text-amber-400",
    rejected: "bg-red-500/20 text-red-400",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${map[status] ?? "bg-surface text-ink/60"}`}>
      {status}
    </span>
  );
}

export default AdminServices;
