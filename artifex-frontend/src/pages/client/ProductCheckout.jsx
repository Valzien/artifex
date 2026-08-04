import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Check, CreditCard, Wallet, Building2, Package } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { getProductById } from "@/services/api/products";
import { checkoutProduct } from "@/services/api/cart";
import { formatCurrency } from "@/constants/orderStatus";

const PAYMENT_METHODS = [
  { id: "bank_transfer", label: "Transfer Bank", icon: Building2, desc: "BCA, Mandiri, BRI" },
  { id: "ewallet", label: "E-Wallet", icon: Wallet, desc: "GoPay, OVO, Dana" },
  { id: "credit_card", label: "Kartu Kredit", icon: CreditCard, desc: "Visa, Mastercard" },
];

function ProductCheckout() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPayment, setSelectedPayment] = useState("bank_transfer");
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    let mounted = true;
    getProductById(productId).then((data) => {
      if (mounted) {
        setProduct(data);
        setLoading(false);
      }
    }).catch(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, [productId]);

  const handlePay = async () => {
    if (!product || isProcessing) return;
    setIsProcessing(true);
    try {
      const res = await checkoutProduct(product.id, selectedPayment);
      setResult(res);
      setStep(2);
    } catch {
      // handle error
    }
    setIsProcessing(false);
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-1/2 rounded bg-surface" />
          <div className="h-48 rounded-xl bg-surface" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-ink/50">
        <p>Produk tidak ditemukan.</p>
      </div>
    );
  }

  if (step === 2 && result) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
          <Check className="h-8 w-8 text-emerald-400" />
        </div>
        <h2 className="mt-6 text-2xl font-semibold text-ink">Pembayaran Berhasil!</h2>
        <p className="mt-2 text-ink/60">Produk <span className="font-medium text-ink">{result.productName}</span> sudah bisa didownload.</p>
        <p className="mt-1 text-xs text-ink/40">Order: {result.orderCode}</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          {result.fileUrl && (
            <a href={result.fileUrl} target="_blank" rel="noopener noreferrer" download={result.fileName}
              className="inline-flex items-center gap-2 rounded-lg bg-primary text-primary-foreground shadow-soft hover:bg-primary/90 px-5 py-2.5 text-sm font-medium transition-colors duration-150">
              <Package className="h-4 w-4" /> Download {result.fileName}
            </a>
          )}
          <Button variant="outline" onClick={() => navigate("/client/product-orders")}>
            Lihat Produk Dibeli
          </Button>
          <Button variant="ghost" onClick={() => navigate("/client/dashboard")}>
            Kembali ke Dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-xl font-semibold text-ink">Checkout Produk</h2>

      {/* Product summary */}
      <Card className="mt-6">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <Package className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-ink">{product.title}</p>
            <p className="text-xs text-ink/50">{product.category} &middot; {product.file_name}</p>
          </div>
          <p className="text-lg font-bold text-ink">{formatCurrency(product.price)}</p>
        </div>
      </Card>

      {/* Payment method */}
      <Card className="mt-4">
        <h3 className="text-sm font-semibold text-ink mb-3">Metode Pembayaran</h3>
        <div className="space-y-2">
          {PAYMENT_METHODS.map((pm) => (
            <button
              key={pm.id}
              onClick={() => setSelectedPayment(pm.id)}
              className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors ${
                selectedPayment === pm.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/30"
              }`}
            >
              <pm.icon className="h-5 w-5 text-ink/50" />
              <div className="flex-1">
                <p className="text-sm font-medium text-ink">{pm.label}</p>
                <p className="text-xs text-ink/50">{pm.desc}</p>
              </div>
              {selectedPayment === pm.id && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}
        </div>
      </Card>

      {/* Total + Pay */}
      <Card className="mt-4">
        <div className="flex items-center justify-between">
          <span className="text-ink/60">Total</span>
          <span className="text-xl font-bold text-ink">{formatCurrency(product.price)}</span>
        </div>
        <Button className="mt-4 w-full" onClick={handlePay} disabled={isProcessing} isLoading={isProcessing}>
          Bayar Sekarang
        </Button>
        <p className="mt-2 text-center text-xs text-ink/40">Dummy payment - tidak ada transaksi nyata</p>
      </Card>
    </div>
  );
}

export default ProductCheckout;
