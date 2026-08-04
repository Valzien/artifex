import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/constants/orderStatus";
import { getPublicPortfolioById } from "@/services/api/portfolio";

function PortfolioDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getPublicPortfolioById(id).then((data) => {
      if (!cancelled) { setItem(data); setLoading(false); }
    }).catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="h-4 w-24 animate-pulse rounded bg-surface" />
        <div className="mt-4 aspect-video w-full animate-pulse rounded-xl bg-surface" />
        <div className="mt-4 space-y-2">
          <div className="h-6 w-1/3 animate-pulse rounded bg-surface" />
          <div className="h-4 w-full animate-pulse rounded bg-surface" />
          <div className="h-4 w-2/3 animate-pulse rounded bg-surface" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="mx-auto flex max-w-5xl flex-col items-center px-4 py-24 text-center">
        <p className="text-lg font-medium text-ink">Karya tidak ditemukan</p>
        <Button asChild variant="outline" size="sm" className="mt-4">
          <Link to="/portfolio">Kembali ke Portfolio</Link>
        </Button>
      </div>
    );
  }

  const cover = item.image ?? item.media?.[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link to="/portfolio" className="inline-flex items-center gap-1.5 text-sm text-ink/60 transition-colors hover:text-ink">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Portfolio
      </Link>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-surface">
        {cover ? (
          <img src={cover} alt={item.title} className="aspect-video w-full object-cover" />
        ) : (
          <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-secondary/30 to-accent/20 text-5xl">
            🎨
          </div>
        )}
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-semibold text-ink">{item.title}</h1>
        {item.category && <Badge variant="secondary">{item.category}</Badge>}
      </div>
      {item.createdAt && <p className="mt-1 text-sm text-ink/50">Dibuat {formatDate(item.createdAt)}</p>}

      {item.description && (
        <p className="mt-4 whitespace-pre-line leading-relaxed text-ink/80">{item.description}</p>
      )}

      {item.media?.length > 1 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-ink">Galeri</h2>
          <div className="mt-2 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {item.media.filter((m) => m !== cover).map((m, i) => (
              <img key={i} src={m} alt={`${item.title} ${i + 1}`} className="aspect-square w-full rounded-lg border border-border object-cover" />
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 rounded-xl border border-border bg-surface p-5">
        <h2 className="text-sm font-semibold text-ink">Freelancer</h2>
        <div className="mt-3 flex items-center gap-3">
          {item.freelancer?.avatar ? (
            <img src={item.freelancer.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
              {item.freelancer?.name?.[0] ?? "?"}
            </div>
          )}
          <div className="flex-1">
            <p className="font-medium text-ink">{item.freelancer?.name ?? "Freelancer"}</p>
            {item.freelancer?.specialty && <p className="text-sm text-ink/60">{item.freelancer.specialty}</p>}
            {item.freelancer?.location && (
              <p className="mt-0.5 flex items-center gap-1 text-xs text-ink/50">
                <MapPin className="h-3 w-3" /> {item.freelancer.location}
              </p>
            )}
          </div>
          {item.freelancer?.id && (
            <Button asChild variant="outline" size="sm">
              <Link to={`/freelancer/${item.freelancer.id}`} className="inline-flex items-center gap-1.5">
                <User className="h-3.5 w-3.5" /> Lihat Profil
              </Link>
            </Button>
          )}
        </div>

        {item.freelancer?.services?.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">Layanan Lainnya</p>
            <div className="mt-2 space-y-2">
              {item.freelancer.services.map((s) => (
                <Link
                  key={s.id}
                  to={`/service/${s.id}`}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2 transition-colors hover:bg-surface"
                >
                  <span className="truncate text-sm text-ink">{s.title}</span>
                  <span className="shrink-0 text-sm font-semibold text-primary">Rp {Number(s.price).toLocaleString("id-ID")}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PortfolioDetail;
