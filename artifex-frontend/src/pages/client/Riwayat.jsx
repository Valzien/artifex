import { useEffect, useState } from "react";
import { Wallet, ShoppingBag, Clock } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/shared/StatCard";
import { TransactionRow } from "@/components/shared/TransactionRow";
import { getClientTransactions } from "@/services/api/clientTransactions";
import { formatCurrency } from "@/constants/orderStatus";

function StatCardSkeleton() {
  return <Card><Skeleton className="h-16 w-full" /></Card>;
}

function Riwayat() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getClientTransactions().then((d) => {
      if (mounted) {
        setData(d);
        setIsLoading(false);
      }
    });
    return () => (mounted = false);
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-xl font-semibold text-ink">Riwayat</h2>
      <p className="mt-1 text-sm text-ink/60">Semua transaksi dan pembayaran kamu.</p>

      <div className="mt-6 grid grid-cols-3 gap-4 overflow-hidden">
        {isLoading ? (
          <>
            {[...Array(3)].map((_, i) => <StatCardSkeleton key={i} />)}
          </>
        ) : (
          <>
            <StatCard icon={Wallet} label="Total Pengeluaran" value={formatCurrency(data.stats.totalSpent)} color="text-primary" variant="inline" />
            <StatCard icon={ShoppingBag} label="Total Pesanan" value={data.stats.totalOrders} color="text-emerald-500" variant="inline" />
            <StatCard icon={Clock} label="Menunggu Pembayaran" value={formatCurrency(data.stats.pending)} color="text-amber-500" variant="inline" />
          </>
        )}
      </div>

      <h3 className="mt-8 text-base font-semibold text-ink">Riwayat Transaksi</h3>

      <Card className="mt-3 p-0">
        {isLoading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="border-b border-border px-6 py-4 last:border-0">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="mt-2 h-3 w-1/3" />
            </div>
          ))
        ) : data.transactions.length === 0 ? (
          <p className="py-12 text-center text-sm text-ink/50">Belum ada transaksi</p>
        ) : (
          data.transactions.map((txn) => (
            <TransactionRow key={txn.id} transaction={txn} orderLinkPrefix="/client/orders" />
          ))
        )}
      </Card>
    </div>
  );
}

export default Riwayat;
