import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Download, Package } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { getProductOrders } from "@/services/api/cart";
import { formatCurrency } from "@/constants/orderStatus";

function OrderSkeleton() {
  return <Card className="space-y-3"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-3 w-1/3" /></Card>;
}

function ProductOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getProductOrders().then((data) => {
      if (mounted) {
        setOrders(data);
        setIsLoading(false);
      }
    });
    return () => (mounted = false);
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-xl font-semibold text-ink">Produk Dibeli</h2>
      <p className="mt-1 text-sm text-ink/60">Produk yang sudah kamu beli dan bisa didownload.</p>

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <><OrderSkeleton /><OrderSkeleton /></>
        ) : orders.length === 0 ? (
          <Card className="py-12 text-center">
            <Package className="mx-auto h-8 w-8 text-ink/20" />
            <p className="mt-3 text-sm text-ink/50">Belum ada produk dibeli.</p>
            <Link to="/explore-products">
              <Button size="sm" className="mt-4">Jelajahi Produk</Button>
            </Link>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ink truncate">{order.product.title}</p>
                <div className="mt-1 flex items-center gap-3 text-xs text-ink/50">
                  <span>{order.orderCode}</span>
                  <Badge variant={order.status === "completed" ? "success" : "warning"}>
                    {order.status === "completed" ? "Selesai" : "Proses"}
                  </Badge>
                </div>
              </div>
              <p className="text-sm font-semibold text-ink shrink-0">{formatCurrency(order.price)}</p>
              {order.status === "completed" && order.fileUrl && (
                <a href={order.fileUrl} target="_blank" rel="noopener noreferrer" download={order.fileName}
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-ink hover:bg-surface/80 transition-colors">
                  <Download className="h-4 w-4" /> Download
                </a>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default ProductOrders;
