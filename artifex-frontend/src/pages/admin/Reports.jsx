import { useEffect, useState } from "react";
import { Wallet, ShoppingBag, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { getAdminAnalytics } from "@/services/api/adminAnalytics";
import { formatCurrency } from "@/constants/orderStatus";

function AdminReports() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getAdminAnalytics().then((d) => {
      if (mounted) {
        setData(d);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const totalRevenue = (data?.revenueByMonth ?? []).reduce((s, m) => s + Number(m.amount || 0), 0);
  const totalOrders = (data?.ordersByMonth ?? []).reduce((s, m) => s + Number(m.count || 0), 0);

  const stats = [
    { label: "Total Pendapatan", value: formatCurrency(totalRevenue), icon: Wallet, color: "bg-emerald-500/10 text-emerald-400" },
    { label: "Total Pesanan", value: totalOrders, icon: ShoppingBag, color: "bg-primary/10 text-primary" },
    { label: "Completion Rate", value: data ? `${data.completionRate ?? 0}%` : "0%", icon: TrendingUp, color: "bg-amber-500/10 text-amber-400" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Card key={s.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-ink/50">{s.label}</p>
                {loading ? <Skeleton className="mt-1 h-5 w-24" /> : <p className="text-lg font-semibold text-ink">{s.value}</p>}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-0">
          <p className="px-4 py-3 text-sm font-semibold text-ink border-b border-border">Pendapatan per Bulan</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/50 bg-surface">
                <th className="px-4 py-3 font-medium">Bulan</th>
                <th className="px-4 py-3 font-medium text-right">Pendapatan</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={2} className="px-4 py-8 text-center text-ink/40">Loading...</td></tr>
              ) : (data?.revenueByMonth ?? []).length === 0 ? (
                <tr><td colSpan={2} className="px-4 py-8 text-center text-ink/40">Belum ada data</td></tr>
              ) : (data?.revenueByMonth ?? []).map((m, i) => (
                <tr key={i} className="border-t border-border/60">
                  <td className="px-4 py-3 text-ink/70">{m.month}</td>
                  <td className="px-4 py-3 text-right font-medium text-ink">{formatCurrency(m.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card className="p-0">
          <p className="px-4 py-3 text-sm font-semibold text-ink border-b border-border">Pesanan per Bulan</p>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/50 bg-surface">
                <th className="px-4 py-3 font-medium">Bulan</th>
                <th className="px-4 py-3 font-medium text-right">Pesanan</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={2} className="px-4 py-8 text-center text-ink/40">Loading...</td></tr>
              ) : (data?.ordersByMonth ?? []).length === 0 ? (
                <tr><td colSpan={2} className="px-4 py-8 text-center text-ink/40">Belum ada data</td></tr>
              ) : (data?.ordersByMonth ?? []).map((m, i) => (
                <tr key={i} className="border-t border-border/60">
                  <td className="px-4 py-3 text-ink/70">{m.month}</td>
                  <td className="px-4 py-3 text-right font-medium text-ink">{m.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <Card className="p-0">
        <p className="px-4 py-3 text-sm font-semibold text-ink border-b border-border">Layanan Terpopuler</p>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/50 bg-surface">
              <th className="px-4 py-3 font-medium">Layanan</th>
              <th className="px-4 py-3 font-medium">Freelancer</th>
              <th className="px-4 py-3 font-medium">Pesanan</th>
              <th className="px-4 py-3 font-medium">Harga</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-ink/40">Loading...</td></tr>
            ) : (data?.topServices ?? []).length === 0 ? (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-ink/40">Belum ada data</td></tr>
            ) : (data?.topServices ?? []).map((s, i) => (
              <tr key={i} className="border-t border-border/60">
                <td className="px-4 py-3 font-medium text-ink">{s.title}</td>
                <td className="px-4 py-3 text-ink/60">{s.freelancer}</td>
                <td className="px-4 py-3">{s.orders}</td>
                <td className="px-4 py-3 text-ink/70">{formatCurrency(s.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default AdminReports;
