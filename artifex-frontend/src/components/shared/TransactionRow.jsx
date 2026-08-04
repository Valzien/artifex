import { Link } from "react-router-dom";
import { ArrowDownRight, ArrowUpRight, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency, formatDate } from "@/constants/orderStatus";

export function TransactionRow({ transaction, orderLinkPrefix }) {
  const typeConfig = {
    earning: { icon: ArrowDownRight, color: "bg-emerald-500/20 text-emerald-400", sign: "+" },
    income: { icon: ArrowDownRight, color: "bg-emerald-500/20 text-emerald-400", sign: "+" },
    refund: { icon: RefreshCw, color: "bg-amber-500/20 text-amber-400", sign: "+" },
    withdrawal: { icon: ArrowUpRight, color: "bg-surface text-ink/50", sign: "-" },
    expense: { icon: ArrowUpRight, color: "bg-amber-500/20 text-amber-400", sign: "-" },
    payment: { icon: ArrowUpRight, color: "bg-amber-500/20 text-amber-400", sign: "-" },
  };

  const config = typeConfig[transaction.type] || typeConfig.income;
  const Icon = config.icon;

  const content = (
    <div className="flex items-center gap-4 border-b border-border px-6 py-4 last:border-0">
      <div className={`shrink-0 rounded-full p-2 ${config.color}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-ink">{transaction.description}</p>
        <p className="mt-0.5 text-xs text-ink/50">{formatDate(transaction.date)}</p>
      </div>
      <p className={`text-sm font-semibold ${
        transaction.type === "refund" || transaction.type === "income" || transaction.type === "earning" ? "text-emerald-400" : "text-ink"
      }`}>
        {config.sign}{formatCurrency(transaction.amount)}
      </p>
      <Badge variant={transaction.status === "completed" ? "success" : "warning"}>
        {transaction.status === "completed" ? "Selesai" : "Proses"}
      </Badge>
    </div>
  );

  if (orderLinkPrefix && transaction.orderId) {
    return (
      <Link to={`${orderLinkPrefix}/${transaction.orderId}`} className="block transition-colors hover:bg-surface">
        {content}
      </Link>
    );
  }

  return content;
}
