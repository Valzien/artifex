import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Inbox } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { TabBar } from "@/components/shared/TabBar";
import { Avatar } from "@/components/shared/Avatar";
import { getOrders } from "@/services/api/orders";
import { ORDER_STATUS, ORDER_STATUS_TABS, formatCurrency, formatDate } from "@/constants/orderStatus";

function OrderSkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4">
      <Skeleton className="h-12 w-12 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  );
}

function Orders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    let mounted = true;
    getOrders({ status: tab }).then((data) => {
      if (mounted) {
        setOrders(data);
        setIsLoading(false);
      }
    });
    return () => (mounted = false);
  }, [tab]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-xl font-semibold text-ink">Pesanan Saya</h2>
      <p className="mt-1 text-sm text-ink/60">Pantau status semua pesanan jasa kamu.</p>

      <div className="mt-6">
        <TabBar tabs={ORDER_STATUS_TABS} activeTab={tab} onChange={setTab} />
      </div>

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <>
            <OrderSkeleton />
            <OrderSkeleton />
            <OrderSkeleton />
          </>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
            <Inbox className="h-8 w-8 text-ink/30" />
            <p className="mt-3 text-sm font-medium text-ink">Belum ada pesanan di kategori ini</p>
          </div>
        ) : (
          orders.map((order) => (
            <Link
              key={order.id}
              to={`/client/orders/${order.id}`}
              className="flex items-center gap-4 rounded-xl border border-border bg-surface p-4 transition-colors hover:border-primary/40 hover:bg-surface"
            >
              <Avatar src={order.freelancer.avatar} name={order.freelancer.name} className="h-12 w-12 text-sm" />
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 truncate text-sm font-medium text-ink">
                  {order.serviceName}
                  {order.type === "custom" && (
                    <Badge variant="secondary" className="shrink-0 text-[10px]">
                      Custom
                    </Badge>
                  )}
                </p>
                <p className="mt-0.5 text-xs text-ink/50">
                  {order.freelancer.name} · {formatDate(order.createdAt)}
                </p>
              </div>
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold text-ink">{formatCurrency(order.price)}</p>
                {order.type === "custom" && (
                  <p className="text-[11px] text-ink/50">
                    DP 40%{order.dealPrice ? ` · Deal ${formatCurrency(order.dealPrice)}` : ""}
                  </p>
                )}
              </div>
              <Badge variant={ORDER_STATUS[order.status].badge}>{ORDER_STATUS[order.status].label}</Badge>
              <ChevronRight className="h-4 w-4 shrink-0 text-ink/30" />
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Orders;
