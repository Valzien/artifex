import { useEffect, useState } from "react";
import { Wallet, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { getFreelancerEarnings, requestWithdraw } from "@/services/api/freelancerEarnings";
import { formatCurrency, formatDate } from "@/constants/orderStatus";

const WITHDRAW_STATUS = {
  pending: "bg-amber-500/20 text-amber-400",
  completed: "bg-emerald-500/20 text-emerald-400",
  rejected: "bg-red-500/20 text-red-400",
};

function Withdraw() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;
    getFreelancerEarnings().then((d) => { if (mounted) { setData(d); setIsLoading(false); } });
    return () => (mounted = false);
  }, []);

  const handleWithdraw = async () => {
    const val = Number(amount);
    if (!val || val <= 0 || val > (data?.stats.available ?? 0)) return;
    setIsProcessing(true);
    try {
      await requestWithdraw(val, bankName, accountNumber);
      const updated = await getFreelancerEarnings();
      setData(updated);
      setAmount("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setIsProcessing(false);
    }
  };

  const withdrawals = data?.withdrawals ?? [];

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-xl font-semibold text-ink">Withdraw</h2>
      <p className="mt-1 text-sm text-ink/60">Tarik dana dari saldo yang tersedia.</p>

      {/* Available balance */}
      <Card className="mt-6">
        <div className="flex items-center gap-4">
          <div className="rounded-lg bg-emerald-500/20 p-3 text-emerald-400">
            <Wallet className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-xs text-ink/50">Saldo Tersedia</p>
            <p className="text-2xl font-semibold text-ink">
              {isLoading ? <Skeleton className="inline-block h-7 w-32" /> : formatCurrency(data.stats.available)}
            </p>
          </div>
        </div>
      </Card>

      {/* Withdraw form */}
      <Card className="mt-4">
        {success && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-4 py-3 text-sm text-emerald-300">
            <CheckCircle2 className="h-4 w-4" />
            Withdraw berhasil diproses! Menunggu persetujuan admin.
          </div>
        )}
        <label className="text-sm font-medium text-ink">Jumlah Withdraw (Rp)</label>
        <div className="mt-2 flex gap-3">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Masukkan jumlah"
            className="flex-1"
            disabled={isLoading || isProcessing}
          />
          <Button onClick={handleWithdraw} isLoading={isProcessing} disabled={!amount || !bankName || !accountNumber || isLoading}>
            Withdraw
          </Button>
        </div>
        {data && Number(amount) > data.stats.available && (
          <p className="mt-2 text-xs text-red-500">Jumlah melebihi saldo tersedia</p>
        )}
        <button
          onClick={() => setAmount(String(data?.stats.available ?? 0))}
          className="mt-2 text-xs text-primary hover:underline"
        >
          Tarik Semua
        </button>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className="text-xs text-ink/50">Nama Bank</label>
            <Input
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              placeholder="Contoh: BCA"
              className="mt-1"
              disabled={isProcessing}
            />
          </div>
          <div>
            <label className="text-xs text-ink/50">No. Rekening</label>
            <Input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="Nomor rekening"
              className="mt-1"
              disabled={isProcessing}
            />
          </div>
        </div>
      </Card>

      {/* Withdraw history */}
      <div className="mt-8">
        <h3 className="text-base font-semibold text-ink">Riwayat Withdraw</h3>
        <Card className="mt-3 p-0">
          {isLoading ? (
            [...Array(2)].map((_, i) => (
              <div key={i} className="border-b border-border px-6 py-4 last:border-0"><Skeleton className="h-4 w-2/3" /></div>
            ))
          ) : withdrawals.length === 0 ? (
            <p className="py-12 text-center text-sm text-ink/50">Belum ada riwayat withdraw</p>
          ) : (
            withdrawals.map((w) => (
              <div key={w.id} className="flex items-center gap-4 border-b border-border px-6 py-4 last:border-0">
                <ArrowUpRight className="h-4 w-4 shrink-0 text-ink/40" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink">
                    {w.bankName} • {w.accountNumber}
                  </p>
                  <p className="text-xs text-ink/50">{formatDate(w.date)}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${WITHDRAW_STATUS[w.status] ?? "bg-surface text-ink/60"}`}>
                  {w.status}
                </span>
                <p className="text-sm font-semibold text-ink">-{formatCurrency(w.amount)}</p>
              </div>
            ))
          )}
        </Card>
      </div>
    </div>
  );
}

export default Withdraw;
