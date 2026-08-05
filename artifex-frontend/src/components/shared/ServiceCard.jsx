import { Link } from "react-router-dom";
import { Star, Clock } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatCurrency } from "@/constants/orderStatus";

function isAvatarUrl(value) {
  return typeof value === "string" && /^(https?:\/\/|\/|data:)/.test(value);
}

export function ServiceCard({ service, to, onRemove }) {
  return (
    <div className="group relative overflow-hidden rounded-xl border border-border bg-surface shadow-card transition-shadow hover:shadow-md">
      <Link to={to || `/service/${service.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-surface">
          {service.image ? (
            <img
              src={service.image}
              alt={service.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl">
              {service.category?.charAt(0) || "🎨"}
            </div>
          )}
          <Badge variant="primary" className="absolute left-3 top-3">
            {service.category}
          </Badge>
        </div>

        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 text-sm font-medium text-ink">{service.title}</h3>

          <div className="mt-2 flex items-center gap-2">
            {isAvatarUrl(service.freelancer?.avatar) ? (
              <img
                src={service.freelancer.avatar}
                alt={service.freelancer?.name}
                loading="lazy"
                decoding="async"
                className="h-6 w-6 shrink-0 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                {service.freelancer?.name?.[0] || "F"}
              </div>
            )}
            <span className="text-xs text-ink/60">{service.freelancer?.name}</span>
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span className="text-xs text-ink/60">{service.freelancer?.rating}</span>
          </div>

          {service.tags?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {service.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-md bg-surface px-2 py-0.5 text-[10px] text-ink/50">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
            <div>
              <p className="text-[10px] text-ink/40">Mulai dari</p>
              <p className="text-sm font-semibold text-ink">{formatCurrency(service.price)}</p>
            </div>
            <div className="flex items-center gap-1 text-xs text-ink/50">
              <Clock className="h-3 w-3" />
              <span>{service.deliveryDays} hari</span>
            </div>
          </div>
        </div>
      </Link>

      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onRemove(service.id);
          }}
          className="absolute right-2 top-2 rounded-full bg-surface/80 p-1.5 text-ink/40 opacity-0 transition-opacity hover:bg-red-500/20 hover:text-red-400 group-hover:opacity-100"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      )}
    </div>
  );
}
