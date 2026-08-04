import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { Inbox, UploadCloud, FileText, CheckCircle2, MessageSquare } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { TabBar } from "@/components/shared/TabBar";
import { getFreelancerOrders, updateOrderStatus, addOrderDeliverable } from "@/services/api/freelancerOrders";
import { uploadFile } from "@/services/api/upload";
import { ORDER_STATUS, formatCurrency, formatDate } from "@/constants/orderStatus";

const FREELANCER_TABS = [
  { key: "all", label: "Semua" },
  { key: "pending", label: "Menunggu" },
  { key: "in_progress", label: "Dikerjakan" },
  { key: "completed", label: "Selesai" },
];

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

function FreelancerOrders() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [deliverableFor, setDeliverableFor] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    getFreelancerOrders({ status: tab }).then((data) => {
      if (mounted) {
        setOrders(data);
        setIsLoading(false);
      }
    });
    return () => (mounted = false);
  }, [tab]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    await updateOrderStatus(orderId, newStatus);
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
  };

  const handleDeliverableUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !deliverableFor || isUploading) return;
    setIsUploading(true);
    try {
      const url = await uploadFile(file);
      const deliverables = await addOrderDeliverable(deliverableFor, {
        url,
        name: file.name,
      });
      setOrders((prev) =>
        prev.map((o) => (o.id === deliverableFor ? { ...o, deliverables } : o))
      );
    } finally {
      setIsUploading(false);
      setDeliverableFor(null);
      e.target.value = "";
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-xl font-semibold text-ink">Order Masuk</h2>
      <p className="mt-1 text-sm text-ink/60">Kelola pesanan dari klien kamu.</p>

      <div className="mt-6">
        <TabBar tabs={FREELANCER_TABS} activeTab={tab} onChange={setTab} />
      </div>

      <div className="mt-6 space-y-3">
        {isLoading ? (
          <>
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
            <Card key={order.id} className="p-0">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,.pdf,.zip,.psd,.ai,.mp4,.zip,.rar"
                className="hidden"
                onChange={handleDeliverableUpload}
                disabled={isUploading}
              />
              <div className="flex items-start gap-4 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-sm font-semibold text-primary">
                  {/^(https?:\/\/|\/|data:)/.test(order.clientAvatar) ? (
                    <img src={order.clientAvatar} alt={order.clientName} className="h-full w-full object-cover" />
                  ) : (
                    order.clientName?.[0]?.toUpperCase() ?? "C"
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="flex items-center gap-2 text-sm font-medium text-ink truncate">
                        {order.serviceName}
                        {order.type === "custom" && (
                          <Badge variant="secondary" className="shrink-0 text-[10px]">
                            Custom
                          </Badge>
                        )}
                      </p>
                      <p className="mt-0.5 text-xs text-ink/50">
                        {order.clientName} · {order.packageName} · {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <Badge variant={ORDER_STATUS[order.status].badge}>
                      {ORDER_STATUS[order.status].label}
                    </Badge>
                  </div>
                  {order.message && (
                    <p className="mt-2 rounded-lg bg-surface px-3 py-2 text-xs text-ink/60 italic line-clamp-3">
                      &ldquo;{order.message}&rdquo;
                    </p>
                  )}

                  {(order.deliverables || []).length > 0 && (
                    <div className="mt-3 space-y-1.5">
                      <p className="text-xs font-medium text-ink/50">File hasil terkirim:</p>
                      {order.deliverables.map((d, idx) => (
                        <a
                          key={idx}
                          href={d.url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-xs text-ink hover:bg-border/50"
                        >
                          <FileText className="h-4 w-4 shrink-0 text-primary" />
                          <span className="truncate">{d.name}</span>
                          <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-emerald-500" />
                        </a>
                      ))}
                    </div>
                  )}

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink/50">
                      <span>Deadline: {formatDate(order.deadline)}</span>
                      {order.type === "custom" ? (
                        <>
                          <span>
                            DP 40%: <span className="font-semibold text-ink">{formatCurrency(order.price)}</span>
                          </span>
                          <span>
                            Range: {formatCurrency(order.customMin)} – {formatCurrency(order.customMax)}
                          </span>
                          <span className="font-semibold text-ink">
                            {order.dealPrice
                              ? `Deal: ${formatCurrency(order.dealPrice)}`
                              : "Deal: kirim harga di chat"}
                          </span>
                        </>
                      ) : (
                        <span className="font-semibold text-ink">{formatCurrency(order.price)}</span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {order.type === "custom" && order.conversationId && (
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/freelancer/chat?conv=${order.conversationId}`}>
                            <MessageSquare className="h-4 w-4" />
                            Chat Klien
                          </Link>
                        </Button>
                      )}
                      {order.status === "pending" && (
                        <>
                          <Button size="sm" variant="primary" onClick={() => handleStatusUpdate(order.id, "in_progress")}>
                            Terima
                          </Button>
                          <Button size="sm" variant="danger" onClick={() => handleStatusUpdate(order.id, "rejected")}>
                            Tolak
                          </Button>
                        </>
                      )}
                      {order.status === "in_progress" && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => { setDeliverableFor(order.id); fileInputRef.current?.click(); }}
                            disabled={isUploading}
                          >
                            <UploadCloud className="h-4 w-4" />
                            {isUploading && deliverableFor === order.id ? "Mengupload..." : "Kirim File Hasil"}
                          </Button>
                          <Button size="sm" onClick={() => handleStatusUpdate(order.id, "completed")}>
                            Selesai
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default FreelancerOrders;
