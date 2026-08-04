import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, FileText, Download, MessageSquare, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { getOrderById, submitOrderReview } from "@/services/api/orders";
import { ORDER_STATUS, formatCurrency, formatDate } from "@/constants/orderStatus";

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let mounted = true;
    getOrderById(id).then((data) => {
      if (mounted) {
        setOrder(data);
        setIsLoading(false);
      }
    });
    return () => (mounted = false);
  }, [id]);

  const handleReview = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    try {
      await submitOrderReview(order.id, { rating, comment: comment.trim() || undefined });
      setOrder((prev) => ({ ...prev, reviewed: true }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/client/orders" className="mb-4 inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Pesanan
      </Link>

      {isLoading ? (
        <Card>
          <Skeleton className="h-6 w-2/3" />
          <Skeleton className="mt-3 h-4 w-1/3" />
          <Skeleton className="mt-6 h-24 w-full" />
        </Card>
      ) : !order ? (
        <p className="text-sm text-ink/60">Pesanan tidak ditemukan.</p>
      ) : (
        <Card>
          <div className="flex items-start justify-between">
            <div className="min-w-0">
               <p className="text-xs text-ink/40">{order.id}</p>
               <div className="mt-1 flex items-center gap-2">
                 <h1 className="text-lg font-semibold text-ink line-clamp-2">{order.serviceName}</h1>
                 {order.type === "custom" && (
                   <Badge variant="secondary" className="shrink-0 text-[10px]">
                     Custom
                   </Badge>
                 )}
               </div>
            </div>
            <Badge variant={ORDER_STATUS[order.status].badge}>{ORDER_STATUS[order.status].label}</Badge>
          </div>

          <CardContent className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-6">
            <div>
              <p className="text-xs text-ink/50">Freelancer</p>
              <p className="mt-1 text-sm font-medium text-ink">{order.freelancer.name}</p>
            </div>
            <div>
              <p className="text-xs text-ink/50">Kategori</p>
              <p className="mt-1 text-sm font-medium text-ink">{order.category}</p>
            </div>
            <div>
              <p className="text-xs text-ink/50">Tanggal Pesan</p>
              <p className="mt-1 text-sm font-medium text-ink">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-xs text-ink/50">Deadline</p>
              <p className="mt-1 text-sm font-medium text-ink">{formatDate(order.deadline)}</p>
            </div>
            {order.type === "custom" ? (
              <>
                <div>
                  <p className="text-xs text-ink/50">DP Dibayar (40%)</p>
                  <p className="mt-1 text-sm font-semibold text-primary">{formatCurrency(order.price)}</p>
                </div>
                <div>
                  <p className="text-xs text-ink/50">Range Harga</p>
                  <p className="mt-1 text-sm font-medium text-ink">
                    {formatCurrency(order.customMin)} – {formatCurrency(order.customMax)}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-xs text-ink/50">Harga Final (Deal di Chat)</p>
                  {order.dealPrice ? (
                    <p className="mt-1 text-sm font-semibold text-ink">{formatCurrency(order.dealPrice)}</p>
                  ) : (
                    <p className="mt-1 text-sm text-ink/60">
                      Belum disepakati — negosiasikan lewat chat dengan freelancer.
                    </p>
                  )}
                </div>
              </>
            ) : (
              <div>
                <p className="text-xs text-ink/50">Total Harga</p>
                <p className="mt-1 text-sm font-semibold text-primary">{formatCurrency(order.price)}</p>
              </div>
            )}
          </CardContent>

          {order.type === "custom" && order.conversationId && !order.dealPrice && (
            <CardContent className="border-t border-border pt-4">
              <Button onClick={() => navigate(`/client/chat?conv=${order.conversationId}`)}>
                <MessageSquare className="h-4 w-4" />
                Chat Freelancer
              </Button>
            </CardContent>
          )}

          {(order.deliverables || []).length > 0 && (
            <CardContent className="mt-6 border-t border-border pt-6">
              <p className="text-xs font-medium text-ink/50">File Hasil dari Freelancer</p>
              <div className="mt-3 space-y-2">
                {order.deliverables.map((d, idx) => (
                  <a
                    key={idx}
                    href={d.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 hover:bg-border/50"
                  >
                    <FileText className="h-5 w-5 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-ink">{d.name}</p>
                      <p className="text-xs text-ink/50">Dikirim {formatDate(d.createdAt)}</p>
                    </div>
                    <Download className="h-4 w-4 shrink-0 text-ink/40" />
                  </a>
                ))}
              </div>
            </CardContent>
          )}

          {order.status === "completed" && !order.reviewed && (
            <CardContent className="mt-6 border-t border-border pt-6">
              <p className="text-sm font-semibold text-ink">Beri Review</p>
              <p className="mt-1 text-xs text-ink/50">Bagaimana pengalamanmu bekerja dengan freelancer ini?</p>
              <div className="mt-4 flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-0.5"
                  >
                    <Star
                      className={`h-7 w-7 transition-colors ${
                        (hoverRating || rating) >= star ? "fill-amber-400 text-amber-400" : "text-ink/30"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-ink/60">{rating > 0 ? `${rating}/5` : "Pilih rating"}</span>
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tulis komentarmu (opsional)..."
                rows={3}
                className="mt-4 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-ink placeholder:text-ink/40 focus:border-primary focus:outline-none"
              />
              <Button className="mt-4" onClick={handleReview} disabled={rating === 0 || submitting}>
                {submitting ? "Mengirim..." : "Kirim Review"}
              </Button>
            </CardContent>
          )}

          {order.status === "completed" && order.reviewed && (
            <CardContent className="mt-6 border-t border-border pt-6">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <p className="text-sm font-medium text-ink">Terima kasih, reviewmu sudah terkirim!</p>
              </div>
            </CardContent>
          )}
        </Card>
      )}
    </div>
  );
}

export default OrderDetail;
