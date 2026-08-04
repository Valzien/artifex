import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  Star,
  TrendingUp,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/shared/StatCard";
import { getFreelancerDashboard } from "@/services/api/freelancerDashboard";
import { ORDER_STATUS, formatCurrency, formatDate } from "@/constants/orderStatus";

function StatCardSkeleton() {
  return (
    <Card className="space-y-3">
      <Skeleton className="h-4 w-20" />
      <Skeleton className="h-7 w-16" />
    </Card>
  );
}

function FreelancerDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getFreelancerDashboard().then((d) => {
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
      <p className="mt-1 text-sm text-ink/60">Ringkasan aktivitas freelancer kamu.</p>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 gap-4 overflow-hidden lg:grid-cols-4">
        {isLoading ? (
          <>
            {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
          </>
        ) : (
          <>
            <StatCard icon={ShoppingBag} label="Total Order" value={data.stats.totalOrders} color="text-primary" />
            <StatCard icon={Clock} label="Aktif" value={data.stats.activeOrders} color="text-amber-500" />
            <StatCard icon={CheckCircle2} label="Selesai" value={data.stats.completedOrders} color="text-emerald-500" />
            <StatCard icon={Star} label="Rating" value={`${data.stats.rating} (${data.stats.reviewCount})`} color="text-amber-500" />
          </>
        )}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-semibold text-ink">Order Terbaru</h3>
            <Link to="/freelancer/orders" className="text-sm text-primary hover:underline">
              Lihat Semua
            </Link>
          </div>
          <Card className="mt-3 p-0">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center gap-4 border-b border-border px-6 py-4 last:border-0">
                  <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              ))
            ) : (
              data.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  to={`/freelancer/orders`}
                  className="flex items-center gap-4 border-b border-border px-6 py-4 transition-colors last:border-0 hover:bg-surface"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {order.clientName[0]}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{order.serviceName}</p>
                    <p className="mt-0.5 text-xs text-ink/50">
                      {order.clientName} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <p className="hidden text-sm font-semibold text-ink sm:block">{formatCurrency(order.price)}</p>
                  <Badge variant={ORDER_STATUS[order.status].badge}>{ORDER_STATUS[order.status].label}</Badge>
                </Link>
              ))
            )}
          </Card>
        </div>

        {/* Top Services */}
        <div>
          <h3 className="text-base font-semibold text-ink">Layanan Terlaris</h3>
          <Card className="mt-3 space-y-4">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            ) : (
              data.topServices.map((svc, i) => (
                <div key={i}>
                  <p className="text-sm font-medium text-ink truncate">{svc.name}</p>
                  <div className="mt-1 flex items-center justify-between text-xs text-ink/50">
                    <span>{svc.orders} order</span>
                    <span className="font-medium text-ink">{formatCurrency(svc.revenue)}</span>
                  </div>
                  {i < data.topServices.length - 1 && <div className="mt-4 border-b border-border" />}
                </div>
              ))
            )}
          </Card>
          <Button asChild variant="outline" size="sm" className="mt-4 w-full">
            <Link to="/freelancer/analytics">
              <TrendingUp className="h-4 w-4" />
              Lihat Analytics
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default FreelancerDashboard;
