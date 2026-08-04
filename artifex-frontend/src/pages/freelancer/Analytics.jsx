import { useEffect, useState } from "react";
import { BarChart3, Users, Star } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { getFreelancerAnalytics } from "@/services/api/freelancerAnalytics";
import { formatCurrency } from "@/constants/orderStatus";

function AnalyticsSkeleton() {
  return <Card><Skeleton className="h-48 w-full" /></Card>;
}

function Analytics() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getFreelancerAnalytics().then((d) => { if (mounted) { setData(d); setIsLoading(false); } });
    return () => (mounted = false);
  }, []);

  const maxOrders = data ? Math.max(...data.ordersByMonth.map((m) => m.count)) : 1;
  const maxEarnings = data ? Math.max(...data.earningsByMonth.map((m) => m.amount)) : 1;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-xl font-semibold text-ink">Analytics</h2>
      <p className="mt-1 text-sm text-ink/60">Statistik performa freelancer kamu.</p>

      {/* Quick stats */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        {isLoading ? (
          <>
            {[...Array(3)].map((_, i) => <AnalyticsSkeleton key={i} />)}
          </>
        ) : (
          <>
            <Card className="text-center">
              <BarChart3 className="mx-auto h-5 w-5 text-primary" />
              <p className="mt-2 text-2xl font-semibold text-ink">{data.conversionRate}%</p>
              <p className="text-xs text-ink/50">Conversion Rate</p>
            </Card>
            <Card className="text-center">
              <Star className="mx-auto h-5 w-5 text-amber-500" />
              <p className="mt-2 text-2xl font-semibold text-ink">{data.averageRating}</p>
              <p className="text-xs text-ink/50">Rata-rata Rating</p>
            </Card>
            <Card className="text-center">
              <Users className="mx-auto h-5 w-5 text-secondary" />
              <p className="mt-2 text-2xl font-semibold text-ink">{data.repeatClientRate}%</p>
              <p className="text-xs text-ink/50">Repeat Client</p>
            </Card>
          </>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Orders by month */}
        <Card>
          <h3 className="text-base font-semibold text-ink">Order per Bulan</h3>
          <div className="mt-4 flex items-end gap-2" style={{ height: 180 }}>
            {isLoading ? (
              [...Array(6)].map((_, i) => <Skeleton key={i} className="flex-1" style={{ height: `${30 + i * 10}%` }} />)
            ) : (
              data.ordersByMonth.map((m) => (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] font-medium text-ink">{m.count}</span>
                  <div
                    className="w-full rounded-t-md bg-primary/80 transition-all"
                    style={{ height: `${(m.count / maxOrders) * 140}px` }}
                  />
                  <span className="text-[10px] text-ink/50">{m.month}</span>
                </div>
              ))
            )}
          </div>
        </Card>

        {/* Earnings by month */}
        <Card>
          <h3 className="text-base font-semibold text-ink">Pendapatan per Bulan</h3>
          <div className="mt-4 flex items-end gap-2" style={{ height: 180 }}>
            {isLoading ? (
              [...Array(6)].map((_, i) => <Skeleton key={i} className="flex-1" style={{ height: `${30 + i * 10}%` }} />)
            ) : (
              data.earningsByMonth.map((m) => (
                <div key={m.month} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[10px] font-medium text-ink">{formatCurrency(m.amount)}</span>
                  <div
                    className="w-full rounded-t-md bg-emerald-500/80 transition-all"
                    style={{ height: `${(m.amount / maxEarnings) * 140}px` }}
                  />
                  <span className="text-[10px] text-ink/50">{m.month}</span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Top categories */}
      <Card className="mt-6">
        <h3 className="text-base font-semibold text-ink">Kategori Terlaris</h3>
        <div className="mt-4 space-y-3">
          {isLoading ? (
            [...Array(3)].map((_, i) => <Skeleton key={i} className="h-4 w-full" />)
          ) : (
            data.topCategories.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-ink truncate">{cat.name}</span>
                  <span className="font-medium text-ink">{cat.percentage}%</span>
                </div>
                <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
}

export default Analytics;
