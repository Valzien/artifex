import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  ShoppingBag,
  CreditCard,
  MessageSquare,
  Star,
  Info,
  CheckCheck,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
} from "@/services/api/notifications";
import useAuthStore from "@/store/useAuthStore";

const TYPE_ICONS = {
  new_order: ShoppingBag,
  order_update: ShoppingBag,
  payment: CreditCard,
  message: MessageSquare,
  review: Star,
  system: Info,
};

const TYPE_COLORS = {
  new_order: "bg-primary/10 text-primary",
  order_update: "bg-primary/10 text-primary",
  payment: "bg-emerald-500/20 text-emerald-400",
  message: "bg-blue-500/20 text-blue-400",
  review: "bg-amber-500/20 text-amber-400",
  system: "bg-surface text-ink/50",
};

function NotificationSkeleton() {
  return (
    <div className="flex gap-4 border-b border-border px-6 py-4">
      <Skeleton className="h-10 w-10 shrink-0 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}

function NotificationsPage() {
  const role = useAuthStore((s) => s.role);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    let mounted = true;
    getNotifications(role).then((data) => {
      if (mounted) {
        setNotifications(data);
        setIsLoading(false);
      }
    });
    return () => (mounted = false);
  }, [role]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered =
    filter === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  const handleMarkRead = async (id) => {
    await markAsRead(id, role);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = async () => {
    await markAllAsRead(role);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  function formatTime(dateStr) {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now - d;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHr = Math.floor(diffMs / 3600000);
    const diffDay = Math.floor(diffMs / 86400000);
    if (diffMin < 60) return `${diffMin} menit lalu`;
    if (diffHr < 24) return `${diffHr} jam lalu`;
    if (diffDay < 7) return `${diffDay} hari lalu`;
    return d.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">Notifikasi</h2>
          <p className="mt-1 text-sm text-ink/60">
            {unreadCount > 0
              ? `Kamu memiliki ${unreadCount} notifikasi belum dibaca`
              : "Semua notifikasi sudah dibaca"}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button variant="ghost" size="sm" onClick={handleMarkAllRead}>
            <CheckCheck className="h-4 w-4" />
            Tandai semua sudah dibaca
          </Button>
        )}
      </div>

      <div className="mt-4 flex gap-1 border-b border-border">
        {[
          { key: "all", label: "Semua" },
          { key: "unread", label: "Belum Dibaca" },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setFilter(t.key)}
            className={`whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              filter === t.key
                ? "border-primary text-primary"
                : "border-transparent text-ink/50 hover:text-ink"
            }`}
          >
            {t.label}
            {t.key === "unread" && unreadCount > 0 && (
              <span className="ml-1.5 rounded-full bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      <Card className="mt-4 p-0">
        {isLoading ? (
          <>
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
          </>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Bell className="h-8 w-8 text-ink/20" />
            <p className="mt-3 text-sm font-medium text-ink">
              {filter === "unread"
                ? "Semua notifikasi sudah dibaca"
                : "Belum ada notifikasi"}
            </p>
          </div>
        ) : (
          filtered.map((n) => {
            const Icon = TYPE_ICONS[n.type] ?? Info;
            const color = TYPE_COLORS[n.type] ?? "bg-surface text-ink/50";
            return (
              <div
                key={n.id}
                className={`flex gap-4 border-b border-border px-6 py-4 transition-colors last:border-0 ${
                  !n.read ? "bg-primary/[0.03]" : "hover:bg-surface"
                }`}
              >
                <div className={`mt-0.5 shrink-0 rounded-full p-2 ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={`text-sm min-w-0 ${
                        !n.read ? "font-semibold text-ink" : "font-medium text-ink"
                      }`}
                    >
                      {n.title}
                    </p>
                    {!n.read && (
                      <button
                        onClick={() => handleMarkRead(n.id)}
                        className="shrink-0 text-xs text-primary hover:underline"
                      >
                        Tandai dibaca
                      </button>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-ink/60 line-clamp-2">{n.message}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="text-xs text-ink/40">
                      {formatTime(n.createdAt)}
                    </span>
                    {n.link && (
                      <Link
                        to={n.link}
                        className="text-xs text-primary hover:underline"
                      >
                        Lihat detail
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </Card>
    </div>
  );
}

export default NotificationsPage;
