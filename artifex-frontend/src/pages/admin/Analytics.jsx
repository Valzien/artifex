import { useEffect, useState } from "react";
import { BarChart3, Users, Package, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { getAdminAnalytics } from "@/services/api/adminAnalytics";
import { formatCurrency } from "@/constants/orderStatus";

function StatSkeleton() {
  return (
    <Card className="space-y-3">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-7 w-16" />
    </Card>
  );
}

function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getAdminAnalytics()
      .then((d) => {
        if (mounted) setData(d);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  const maxOrders = data
    ? Math.max(...data.ordersByMonth.map((m) => m.count), 1)
    : 1;
  const maxRevenue = data
    ? Math.max(...data.revenueByMonth.map((m) => m.amount), 1)
    : 1;
  const maxUsers = data
    ? Math.max(...data.newUsersByMonth.map((m) => m.count), 1)
    : 1;

  const statCards = data
    ? [
        {
          label: "Total Users",
          value: data.totalUsers,
          icon: Users,
          color: "text-primary",
        },
        {
          label: "Total Services",
          value: data.totalServices,
          icon: Package,
          color: "text-emerald-500",
        },
        {
          label: "Total Orders",
          value: data.totalOrders,
          icon: BarChart3,
          color: "text-amber-500",
        },
        {
          label: "Completion Rate",
          value: `${data.completionRate}%`,
          icon: TrendingUp,
          color: "text-secondary",
        },
      ]
    : [];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-ink">Analytics</h2>
        <p className="mt-1 text-sm text-ink/60">
          Statistik dan performa platform.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? [...Array(4)].map((_, i) => <StatSkeleton key={i} />)
          : statCards.map((stat) => (
              <Card key={stat.label} className="text-center">
                <stat.icon className={`mx-auto h-5 w-5 ${stat.color}`} />
                <p className="mt-2 text-2xl font-semibold text-ink">
                  {stat.value}
                </p>
                <p className="text-xs text-ink/50">{stat.label}</p>
              </Card>
            ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Orders by month */}
        <Card>
          <h3 className="text-base font-semibold text-ink">Order per Bulan</h3>
          <div
            className="mt-4 flex items-end gap-2"
            style={{ height: 180 }}
          >
            {loading
              ? [...Array(6)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="flex-1"
                    style={{ height: `${30 + i * 10}%` }}
                  />
                ))
              : data.ordersByMonth.map((m) => (
                  <div
                    key={m.month}
                    className="flex flex-1 flex-col items-center gap-1"
                  >
                    <span className="text-[10px] font-medium text-ink">
                      {m.count}
                    </span>
                    <div
                      className="w-full rounded-t-md bg-primary/80 transition-all"
                      style={{
                        height: `${(m.count / maxOrders) * 140}px`,
                      }}
                    />
                    <span className="text-[10px] text-ink/50">
                      {m.month}
                    </span>
                  </div>
                ))}
          </div>
        </Card>

        {/* Revenue by month */}
        <Card>
          <h3 className="text-base font-semibold text-ink">
            Pendapatan per Bulan
          </h3>
          <div
            className="mt-4 flex items-end gap-2"
            style={{ height: 180 }}
          >
            {loading
              ? [...Array(6)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="flex-1"
                    style={{ height: `${30 + i * 10}%` }}
                  />
                ))
              : data.revenueByMonth.map((m) => (
                  <div
                    key={m.month}
                    className="flex flex-1 flex-col items-center gap-1"
                  >
                    <span className="text-[10px] font-medium text-ink">
                      {formatCurrency(m.amount)}
                    </span>
                    <div
                      className="w-full rounded-t-md bg-emerald-500/80 transition-all"
                      style={{
                        height: `${(m.amount / maxRevenue) * 140}px`,
                      }}
                    />
                    <span className="text-[10px] text-ink/50">
                      {m.month}
                    </span>
                  </div>
                ))}
          </div>
        </Card>

        {/* New users by month */}
        <Card>
          <h3 className="text-base font-semibold text-ink">
            Pengguna Baru per Bulan
          </h3>
          <div
            className="mt-4 flex items-end gap-2"
            style={{ height: 180 }}
          >
            {loading
              ? [...Array(6)].map((_, i) => (
                  <Skeleton
                    key={i}
                    className="flex-1"
                    style={{ height: `${30 + i * 10}%` }}
                  />
                ))
              : data.newUsersByMonth.map((m) => (
                  <div
                    key={m.month}
                    className="flex flex-1 flex-col items-center gap-1"
                  >
                    <span className="text-[10px] font-medium text-ink">
                      {m.count}
                    </span>
                    <div
                      className="w-full rounded-t-md bg-amber-500/80 transition-all"
                      style={{
                        height: `${(m.count / maxUsers) * 140}px`,
                      }}
                    />
                    <span className="text-[10px] text-ink/50">
                      {m.month}
                    </span>
                  </div>
                ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top services */}
        <Card>
          <h3 className="text-base font-semibold text-ink">
            Service Terlaris
          </h3>
          <div className="mt-4 space-y-3">
            {loading
              ? [...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))
              : data.topServices.map((svc) => (
                  <div
                    key={svc.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-ink truncate">
                        {svc.title}
                      </p>
                      <p className="text-xs text-ink/50">{svc.freelancer}</p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-xs text-ink/50">
                        {svc.orders} orders
                      </span>
                      <span className="font-medium text-ink">
                        {formatCurrency(svc.price)}
                      </span>
                    </div>
                  </div>
                ))}
          </div>
        </Card>

        {/* Services by category */}
        <Card>
          <h3 className="text-base font-semibold text-ink">
            Kategori Service
          </h3>
          <div className="mt-4 space-y-3">
            {loading
              ? [...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))
              : data.servicesByCategory.map((cat) => (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ink truncate">{cat.name}</span>
                      <span className="font-medium text-ink">
                        {cat.percentage}%
                      </span>
                    </div>
                    <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-surface">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${cat.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

export default AdminAnalytics;
