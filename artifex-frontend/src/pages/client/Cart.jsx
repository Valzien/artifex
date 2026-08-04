import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, Check, Building2, Wallet, CreditCard, Package } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { getCartItems, removeFromCart, cartCheckout } from "@/services/api/cart";
import { formatCurrency } from "@/constants/orderStatus";

const PAYMENT_METHODS = [
  { id: "bank_transfer", label: "Transfer Bank", icon: Building2 },
  { id: "ewallet", label: "E-Wallet", icon: Wallet },
  { id: "credit_card", label: "Kartu Kredit", icon: CreditCard },
];

function CartSkeleton() {
  return <Card className="space-y-3"><Skeleton className="h-4 w-2/3" /><Skeleton className="h-3 w-1/3" /></Card>;
}

function Cart() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState({ total: 0, count: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("bank_transfer");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let mounted = true;
    getCartItems().then(({ items: data, meta: m }) => {
      if (mounted) {
        setItems(data);
        setMeta(m);
        setIsLoading(false);
      }
    });
    return () => (mounted = false);
  }, []);

  const updateMeta = (newItems) => {
    const total = newItems.reduce((sum, i) => sum + i.product.price, 0);
    setMeta({ total, count: newItems.length });
  };

  const handleRemove = async (itemId) => {
    await removeFromCart(itemId);
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== itemId);
      updateMeta(next);
      return next;
    });
  };

  const handleCheckout = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const res = await cartCheckout(selectedPayment);
      setResult(res);
      setItems([]);
      setMeta({ total: 0, count: 0 });
    } catch {
      // error
    }
    setIsProcessing(false);
  };

  if (result) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
          <Check className="h-8 w-8 text-emerald-400" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-ink">Pembayaran Berhasil!</h2>
        <p className="mt-2 text-ink/60">{result.totalOrders} produk berhasil dibeli.</p>
        <div className="mt-6 space-y-3 text-left max-w-md mx-auto">
          {result.orders.map((order) => (
            <Card key={order.orderId} className="flex items-center gap-3">
              <Package className="h-5 w-5 text-primary shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-ink truncate">{order.productName}</p>
                <p className="text-xs text-ink/40">{order.orderCode}</p>
              </div>
              {order.fileUrl && (
                <a href={order.fileUrl} target="_blank" rel="noopener noreferrer" download={order.fileName}
                  className="shrink-0 text-xs font-medium text-primary hover:underline">
                  Download
                </a>
              )}
            </Card>
          ))}
        </div>
        <div className="mt-6 flex gap-3 justify-center">
          <Button variant="outline" onClick={() => window.location.href = "/client/product-orders"}>
            Lihat Produk Dibeli
          </Button>
          <Button variant="ghost" onClick={() => window.location.href = "/client/dashboard"}>
            Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-xl font-semibold text-ink">Keranjang Belanja</h2>
      <p className="mt-1 text-sm text-ink/60">{meta.count} produk di keranjang</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          {isLoading ? (
            <><CartSkeleton /><CartSkeleton /></>
          ) : items.length === 0 ? (
            <Card className="py-12 text-center">
              <ShoppingBag className="mx-auto h-8 w-8 text-ink/20" />
              <p className="mt-3 text-sm text-ink/50">Keranjang kosong</p>
              <Link to="/explore-products">
                <Button size="sm" className="mt-4">Jelajahi Produk</Button>
              </Link>
            </Card>
          ) : (
            items.map((item) => (
              <Card key={item.id} className="flex items-center gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link to={`/product/${item.product.id}`} className="text-sm font-medium text-ink hover:text-primary truncate block">{item.product.title}</Link>
                  <p className="text-xs text-ink/50">{item.product.freelancer} &middot; {item.product.category}</p>
                </div>
                <p className="text-sm font-semibold text-ink shrink-0">{formatCurrency(item.product.price)}</p>
                <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" onClick={() => handleRemove(item.id)}>
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </Card>
            ))
          )}
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-24">
            <h3 className="text-sm font-semibold text-ink">Ringkasan</h3>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-ink/60">Subtotal</span><span className="font-medium text-ink">{formatCurrency(meta.total)}</span></div>
              <div className="border-t border-border pt-2 flex justify-between"><span className="font-semibold text-ink">Total</span><span className="font-semibold text-ink">{formatCurrency(meta.total)}</span></div>
            </div>

            {showPayment ? (
              <div className="mt-4 space-y-2">
                <p className="text-xs font-medium text-ink/50">Metode Pembayaran</p>
                {PAYMENT_METHODS.map((pm) => (
                  <button key={pm.id} onClick={() => setSelectedPayment(pm.id)}
                    className={`flex w-full items-center gap-2 rounded-lg border p-2.5 text-left text-sm transition-colors ${selectedPayment === pm.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"}`}>
                    <pm.icon className="h-4 w-4 text-ink/50" />
                    <span className="flex-1">{pm.label}</span>
                    {selectedPayment === pm.id && <Check className="h-3.5 w-3.5 text-primary" />}
                  </button>
                ))}
                <Button className="mt-2 w-full" onClick={handleCheckout} disabled={isProcessing} isLoading={isProcessing}>
                  Bayar {formatCurrency(meta.total)}
                </Button>
                <p className="text-center text-[10px] text-ink/40">Dummy payment</p>
                <Button variant="ghost" size="sm" className="w-full" onClick={() => setShowPayment(false)}>Batal</Button>
              </div>
            ) : (
              items.length > 0 && (
                <Button className="mt-4 w-full" onClick={() => setShowPayment(true)}>
                  Checkout
                </Button>
              )
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Cart;
