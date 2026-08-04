import { useEffect, useState } from "react";
import { Wallet, TrendingUp, Clock, ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { StatCard } from "@/components/shared/StatCard";
import { TransactionRow } from "@/components/shared/TransactionRow";
import { getFreelancerEarnings } from "@/services/api/freelancerEarnings";
import { formatCurrency } from "@/constants/orderStatus";
import { Link } from "react-router-dom";

function StatCardSkeleton() {
  return <Card><Skeleton className="h-16 w-full" /></Card>;
}

function Earnings() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getFreelancerEarnings().then((d) => { if (mounted) { setData(d); setIsLoading(false); } });
    return () => (mounted = false);
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-xl font-semibold text-ink">Pendapatan</h2>
      <p className="mt-1 text-sm text-ink/60">Ringkasan penghasilan kamu.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 overflow-hidden lg:grid-cols-4">
        {isLoading ? (
          <>
            {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
          </>
        ) : (
          <>
            <StatCard icon={Wallet} label="Total Pendapatan" value={formatCurrency(data.stats.totalEarned)} color="text-primary" variant="inline" />
            <StatCard icon={Clock} label="Pending" value={formatCurrency(data.stats.pending)} color="text-amber-500" variant="inline" />
            <StatCard icon={TrendingUp} label="Tersedia" value={formatCurrency(data.stats.available)} color="text-emerald-500" variant="inline" />
            <StatCard icon={ArrowUpRight} label="Total Withdraw" value={formatCurrency(data.stats.withdrawn)} color="text-ink/40" variant="inline" />
          </>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <h3 className="text-base font-semibold text-ink">Riwayat Transaksi</h3>
        <Button asChild size="sm" variant="outline">
          <Link to="/freelancer/withdraw">Withdraw</Link>
        </Button>
      </div>

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
            <TransactionRow key={txn.id} transaction={txn} />
          ))
        )}
      </Card>
    </div>
  );
}

export default Earnings;
