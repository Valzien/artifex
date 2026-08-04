import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Check, CreditCard, Package, ArrowLeft, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { getServiceById } from "@/services/api/services";
import { getPaymentMethods, createOrder } from "@/services/api/checkout";
import { formatCurrency } from "@/constants/orderStatus";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "package", label: "Pilih Paket", icon: Package },
  { key: "payment", label: "Pembayaran", icon: CreditCard },
  { key: "confirm", label: "Konfirmasi", icon: Check },
];

function CheckoutSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-1/3" />
      <Card>
        <div className="space-y-4">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-12 w-full" />
        </div>
      </Card>
    </div>
  );
}

function Checkout() {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState("package");
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderResult, setOrderResult] = useState(null);

  useEffect(() => {
    let mounted = true;
    Promise.all([getServiceById(serviceId), getPaymentMethods()]).then(
      ([svc, methods]) => {
        if (mounted) {
          setService(svc);
          setPaymentMethods(methods);
          setIsLoading(false);
        }
      }
    );
    return () => (mounted = false);
  }, [serviceId]);

  const packages = service?.packages ?? [];
  const customRange = {
    min: service?.price ?? 0,
    max: Math.round((service?.price ?? 0) * 2),
    dp: Math.round((service?.price ?? 0) * 0.4),
  };
  const isCustom = selectedPackage?.type === "custom";

  const handleOrder = async () => {
    setIsProcessing(true);
    const result = await createOrder(
      isCustom
        ? {
            type: "custom",
            serviceId,
            customMin: customRange.min,
            customMax: customRange.max,
            paymentMethod: selectedPayment,
          }
        : {
            type: "package",
            serviceId,
            packageId: selectedPackage.id,
            paymentMethod: selectedPayment,
          }
    );
    setOrderResult(result);
    setStep("confirm");
    setIsProcessing(false);
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <CheckoutSkeleton />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        <p className="text-sm text-ink/60">Jasa tidak ditemukan.</p>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link to="/explore">Kembali ke Explore</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        to={`/service/${serviceId}`}
        className="mb-4 inline-flex items-center gap-1 text-sm text-ink/60 hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> Kembali ke Detail Jasa
      </Link>

      <h2 className="text-xl font-semibold text-ink">Checkout</h2>
      <p className="mt-1 text-sm text-ink/60 truncate">{service.title}</p>

      {/* Step indicator */}
      <div className="mt-6 flex items-center gap-2">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isCurrent = s.key === step;
          const isDone =
            (s.key === "package" && selectedPackage) ||
            (s.key === "payment" && selectedPayment) ||
            (s.key === "confirm" && orderResult);
          return (
            <div key={s.key} className="flex items-center gap-2">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors",
                  isCurrent
                    ? "bg-primary text-primary-foreground"
                    : isDone
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-surface text-ink/40"
                )}
              >
                {isDone ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <span
                className={cn(
                  "text-sm font-medium hidden sm:block",
                  isCurrent ? "text-ink" : "text-ink/40"
                )}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && (
                <div className="mx-1 hidden h-px w-8 bg-border sm:block" />
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6">
        {/* Step 1: Package Selection */}
        {step === "package" && (
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-ink">Pilih Paket</h3>
            {packages.map((pkg) => (
              <button
                key={pkg.name}
                onClick={() => {
                  setSelectedPackage(pkg);
                  setStep("payment");
                }}
                className={cn(
                  "w-full rounded-xl border p-4 text-left transition-all hover:border-primary/40",
                  selectedPackage?.name === pkg.name
                    ? "border-primary bg-primary/5"
                    : "border-border bg-surface"
                )}
              >
                <div className="flex items-center justify-between">
                   <div className="min-w-0">
                     <div className="flex items-center gap-2">
                       <p className="text-sm font-semibold text-ink truncate">{pkg.name}</p>
                      {pkg.popular && (
                        <Badge variant="primary" className="text-[10px]">
                          Populer
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-ink/50">{pkg.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-semibold text-ink">
                      {formatCurrency(pkg.price)}
                    </p>
                    <p className="mt-0.5 text-xs text-ink/50">
                      {pkg.deliveryDays} hari
                    </p>
                  </div>
                </div>
                {pkg.features && (
                  <ul className="mt-3 space-y-1">
                    {pkg.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-ink/60">
                        <Check className="h-3 w-3 shrink-0 text-emerald-500" />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </button>
            ))}

            {/* Custom option */}
            <button
              onClick={() => {
                setSelectedPackage({ type: "custom" });
                setStep("payment");
              }}
              className={cn(
                "w-full rounded-xl border p-4 text-left transition-all hover:border-primary/40",
                isCustom ? "border-primary bg-primary/5" : "border-dashed border-border bg-surface"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-ink">Custom</p>
                    <Badge variant="secondary" className="text-[10px]">
                      Deal di chat
                    </Badge>
                  </div>
                  <p className="mt-1 text-xs text-ink/50">
                    Harga disepakati langsung dengan freelancer lewat chat. Bayar DP 40% di muka.
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold text-ink">
                    {formatCurrency(customRange.min)} – {formatCurrency(customRange.max)}
                  </p>
                  <p className="mt-0.5 text-xs text-ink/50">
                    DP 40%: {formatCurrency(customRange.dp)}
                  </p>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Step 2: Payment Method */}
        {step === "payment" && (
          <div className="space-y-3">
            <h3 className="text-base font-semibold text-ink">Metode Pembayaran</h3>
            {paymentMethods.map((pm) => (
              <button
                key={pm.id}
                onClick={() => setSelectedPayment(pm.id)}
                className={cn(
                  "w-full rounded-xl border p-4 text-left transition-all hover:border-primary/40",
                  selectedPayment === pm.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-surface"
                )}
              >
                <p className="text-sm font-semibold text-ink">{pm.name}</p>
                <p className="mt-0.5 text-xs text-ink/50">{pm.description}</p>
              </button>
            ))}

            {/* Order summary */}
            {selectedPackage && (
              <Card className="mt-4">
                <CardContent className="space-y-2">
                  {isCustom ? (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-ink/60">Tipe</span>
                        <span className="font-medium text-ink">Custom (deal di chat)</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-ink/60">Range harga</span>
                        <span className="font-medium text-ink">
                          {formatCurrency(customRange.min)} – {formatCurrency(customRange.max)}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-ink/60">Estimasi</span>
                        <span className="font-medium text-ink">{service.deliveryDays} hari</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-ink/60">Pelunasan</span>
                        <span className="font-medium text-ink">Setelah deal di chat</span>
                      </div>
                      <div className="flex justify-between border-t border-border pt-2 text-sm">
                        <span className="font-semibold text-ink">DP 40%</span>
                        <span className="font-semibold text-primary">
                          {formatCurrency(customRange.dp)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-ink/60">Paket</span>
                        <span className="font-medium text-ink">{selectedPackage.name}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-ink/60">Estimasi</span>
                        <span className="font-medium text-ink">{selectedPackage.deliveryDays} hari</span>
                      </div>
                      <div className="flex justify-between border-t border-border pt-2 text-sm">
                        <span className="font-semibold text-ink">Total</span>
                        <span className="font-semibold text-primary">
                          {formatCurrency(selectedPackage.price)}
                        </span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setStep("package")}>
                Kembali
              </Button>
              <Button
                onClick={handleOrder}
                disabled={!selectedPayment}
                isLoading={isProcessing}
              >
                {isCustom ? "Bayar DP 40%" : "Bayar Sekarang"}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation */}
        {step === "confirm" && orderResult && (
          <Card className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
              <Check className="h-8 w-8 text-emerald-400" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-ink">
              Pesanan Berhasil Dibuat!
            </h3>
            <p className="mt-2 text-sm text-ink/60">
              Pesanan kamu dengan ID <span className="font-mono font-medium">{orderResult.orderId}</span> sedang diproses.
            </p>
            {orderResult.type === "custom" && (
              <p className="mx-auto mt-2 max-w-sm text-sm text-ink/60">
                DP 40% sudah dibayar. Sepakati harga final lewat chat dengan freelancer — dia akan mengirim nominal harga manual.
              </p>
            )}
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              {orderResult.type === "custom" && (
                <Button
                  onClick={() => navigate(`/client/chat?conv=${orderResult.conversationId}`)}
                >
                  <MessageSquare className="h-4 w-4" />
                  Chat Freelancer
                </Button>
              )}
              <Button asChild variant="outline">
                <Link to="/client/orders">Lihat Pesanan</Link>
              </Button>
              <Button asChild>
                <Link to="/client/dashboard">Kembali ke Dashboard</Link>
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Checkout;
