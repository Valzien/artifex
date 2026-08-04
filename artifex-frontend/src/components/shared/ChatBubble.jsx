import { CreditCard, Download } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/constants/orderStatus";

function formatTime(dateStr) {
  return new Date(dateStr).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
}

function ChatBubble({ message, isMine, onPay }) {
  const bubbleClass = isMine
    ? "bg-primary text-primary-foreground rounded-br-md"
    : "bg-surface border border-border rounded-bl-md";

  return (
    <div className={cn("flex", isMine ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[75%] rounded-2xl px-4 py-2.5", bubbleClass)}>
        {message.type === "image" && message.attachment?.url && (
          <a href={message.attachment.url} target="_blank" rel="noreferrer" className="block">
            <img
              src={message.attachment.url}
              alt={message.attachment.name || "Foto"}
              className="max-h-56 w-full rounded-lg object-cover"
            />
          </a>
        )}

        {message.type === "payment" && (
          <div className={cn("min-w-[220px]", isMine ? "text-primary-foreground" : "text-ink")}>
            <div className="flex items-center gap-2 text-xs opacity-80">
              <CreditCard className="h-4 w-4" />
              Permintaan Pembayaran
            </div>
            <p className="mt-2 text-xl font-semibold">{formatCurrency(message.amount)}</p>
            <p className="mt-0.5 text-xs opacity-70">Pembayaran custom dari freelancer</p>
            <div className="mt-3">
              {message.paymentStatus === "paid" ? (
                <Badge variant="success">Sudah Dibayar</Badge>
              ) : isMine ? (
                <Badge variant="neutral">Menunggu Pembayaran</Badge>
              ) : onPay ? (
                <Button size="sm" className="w-full" onClick={() => onPay(message)}>
                  Bayar Sekarang
                </Button>
              ) : null}
            </div>
          </div>
        )}

        {message.type !== "image" && message.content && (
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        )}

        {message.type === "image" && message.attachment?.name && (
          <p className={cn("mt-1 flex items-center gap-1 text-[10px]", isMine ? "text-primary-foreground/60" : "text-ink/40")}>
            <Download className="h-3 w-3" />
            {message.attachment.name}
          </p>
        )}

        <p className={cn("mt-1 text-[10px]", isMine ? "text-primary-foreground/60" : "text-ink/40")}>
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

export default ChatBubble;
