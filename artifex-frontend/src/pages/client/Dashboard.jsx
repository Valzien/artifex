import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronRight,
  ShoppingBag,
  Clock,
  CheckCircle2,
  Search,
  Heart,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/shared/StatCard";
import { getDashboard } from "@/services/api/dashboard";
import { ORDER_STATUS, formatCurrency, formatDate } from "@/constants/orderStatus";

function StatCardSkeleton() {
  return (
    <Card className="space-y-3">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-7 w-16" />
    </Card>
  );
}

function OrderRowSkeleton() {
  return (
    <div className="flex items-center gap-4 border-b border-border px-6 py-4 last:border-0">
      <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  );
}

function ClientDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getDashboard().then((d) => {
      if (mounted) {
        setData(d);
        setIsLoading(false);
      }
    });
    return () => (mounted = false);
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-xl font-semibold text-ink">Dashboard</h2>
      <p className="mt-1 text-sm text-ink/60">
        Selamat datang kembali! Berikut ringkasan aktivitas kamu.
      </p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 overflow-hidden">
        {isLoading ? (
          <>
            <StatCardSkeleton />
            <StatCardSkeleton />
            <StatCardSkeleton />
          </>
        ) : (
          <>
            <StatCard icon={ShoppingBag} label="Total Pesanan" value={data.stats.totalOrders} color="text-primary" />
            <StatCard icon={Clock} label="Aktif" value={data.stats.activeOrders} color="text-amber-500" />
            <StatCard icon={CheckCircle2} label="Selesai" value={data.stats.completedOrders} color="text-emerald-500" />
          </>
        )}
      </div>

      {/* Recent Orders + Quick Actions */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-ink">Pesanan Terbaru</h3>
            <Link
              to="/client/orders"
              className="text-sm text-primary hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          <Card className="mt-3 p-0">
            {isLoading ? (
              <>
                <OrderRowSkeleton />
                <OrderRowSkeleton />
                <OrderRowSkeleton />
              </>
            ) : data.recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <ShoppingBag className="h-8 w-8 text-ink/20" />
                <p className="mt-3 text-sm font-medium text-ink">Belum ada pesanan</p>
                <p className="mt-1 text-xs text-ink/50">
                  Mulai jelajahi jasa yang tersedia
                </p>
                <Button asChild variant="outline" size="sm" className="mt-4">
                  <Link to="/explore">Explore Jasa</Link>
                </Button>
              </div>
            ) : (
              data.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  to={`/client/orders/${order.id}`}
                  className="flex items-center gap-4 border-b border-border px-6 py-4 transition-colors last:border-0 hover:bg-surface"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {order.freelancer.avatar}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">
                      {order.serviceName}
                    </p>
                    <p className="mt-0.5 text-xs text-ink/50">
                      {order.freelancer.name} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <Badge variant={ORDER_STATUS[order.status].badge}>
                    {ORDER_STATUS[order.status].label}
                  </Badge>
                  <ChevronRight className="h-4 w-4 shrink-0 text-ink/30" />
                </Link>
              ))
            )}
          </Card>
        </div>

        {/* Quick Actions */}
        <div>
          <h3 className="text-base font-semibold text-ink">Aksi Cepat</h3>
          <div className="mt-3 space-y-3">
            <QuickAction
              to="/explore"
              icon={Search}
              title="Cari Jasa"
              desc="Temukan jasa yang kamu butuhkan"
            />
            <QuickAction
              to="/client/orders"
              icon={ShoppingBag}
              title="Lihat Pesanan"
              desc="Pantau status pesanan kamu"
            />
            <QuickAction
              to="/client/favorites"
              icon={Heart}
              title="Favorit"
              desc="Jasa yang kamu simpan"
            />
          </div>

          {/* Recommendations */}
          {!isLoading && data.recommendations.length > 0 && (
            <div className="mt-6">
              <h3 className="text-base font-semibold text-ink">Rekomendasi</h3>
              <div className="mt-3 space-y-3">
                {data.recommendations.map((rec) => (
                  <Link
                    key={rec.id}
                    to={`/service/${rec.id}`}
                    className="block rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/40 hover:bg-surface"
                  >
                    <p className="text-sm font-medium text-ink line-clamp-1">
                      {rec.title}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-xs text-ink/50">
                        {rec.freelancer.name}
                      </span>
                      <span className="text-sm font-semibold text-ink">
                        {formatCurrency(rec.price)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function QuickAction({ to, icon: Icon, title, desc }) {
  return (
    <Link
      to={to}
      className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/40 hover:bg-surface"
    >
      <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">{title}</p>
        <p className="mt-0.5 text-xs text-ink/50">{desc}</p>
      </div>
      <ChevronRight className="h-4 w-4 shrink-0 text-ink/30" />
    </Link>
  );
}

export default ClientDashboard;
