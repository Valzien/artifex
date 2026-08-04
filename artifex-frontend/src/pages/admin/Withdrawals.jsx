import { useEffect, useState } from "react";
import { getAdminWithdrawals, updateWithdrawalStatus } from "@/services/api/adminWithdrawals";
import { formatCurrency, formatDate } from "@/constants/orderStatus";

const STATUS_OPTIONS = [
  { key: "", label: "Semua Status" },
  { key: "pending", label: "Pending" },
  { key: "completed", label: "Completed" },
  { key: "rejected", label: "Rejected" },
];

const STATUS_BADGE = {
  pending: "bg-amber-500/20 text-amber-400",
  completed: "bg-emerald-500/20 text-emerald-400",
  rejected: "bg-red-500/20 text-red-400",
};

function AdminWithdrawals() {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAdminWithdrawals({ status: statusFilter || undefined }).then((res) => {
      if (mounted) {
        setWithdrawals(res.data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [statusFilter]);

  const handleStatus = async (id, status) => {
    if (!confirm(status === "completed" ? "Approve penarikan ini?" : "Tolak penarikan ini?")) return;
    const updated = await updateWithdrawalStatus(id, status);
    setWithdrawals((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-border bg-surface rounded-xl px-3 py-2 text-sm text-ink"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s.key} value={s.key}>{s.label}</option>
          ))}
        </select>
      </div>

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/50 bg-surface">
              <th className="px-4 py-3 font-medium">Freelancer</th>
              <th className="px-4 py-3 font-medium">Jumlah</th>
              <th className="px-4 py-3 font-medium">Bank</th>
              <th className="px-4 py-3 font-medium">No. Rekening</th>
              <th className="px-4 py-3 font-medium">Tanggal</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-ink/40">Loading...</td></tr>
            ) : withdrawals.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-ink/40">Belum ada penarikan</td></tr>
            ) : withdrawals.map((w) => (
              <tr key={w.id} className="border-t border-border/60 hover:bg-surface">
                <td className="px-4 py-3">
                  <p className="font-medium text-ink">{w.user?.name ?? "Unknown"}</p>
                  <p className="text-xs text-ink/50">{w.user?.email}</p>
                </td>
                <td className="px-4 py-3 font-semibold text-ink">{formatCurrency(w.amount)}</td>
                <td className="px-4 py-3 text-ink/60">{w.bankName}</td>
                <td className="px-4 py-3 text-ink/60">{w.accountNumber}</td>
                <td className="px-4 py-3 text-ink/60">{formatDate(w.date)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_BADGE[w.status] ?? "bg-surface text-ink/60"}`}>
                    {w.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    {w.status === "pending" && (
                      <>
                        <button onClick={() => handleStatus(w.id, "completed")} className="text-emerald-500 hover:underline text-xs">Approve</button>
                        <button onClick={() => handleStatus(w.id, "rejected")} className="text-red-500 hover:underline text-xs">Tolak</button>
                      </>
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

export default AdminWithdrawals;
