import { Link } from "react-router-dom";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { StarRating } from "@/components/shared/StarRating";

function isAvatarUrl(value) {
  return typeof value === "string" && /^(https?:\/\/|\/|data:)/.test(value);
}

export function FreelancerCard({ freelancer }) {
  return (
    <Link
      to={`/freelancer/${freelancer.id}`}
      className="block rounded-xl border border-border bg-surface p-5 shadow-card transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="relative">
          {isAvatarUrl(freelancer.avatar) ? (
            <img
              src={freelancer.avatar}
              alt={freelancer.name}
              loading="lazy"
              decoding="async"
              className="h-14 w-14 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary">
              {freelancer.name?.[0] || "F"}
            </div>
          )}
          {freelancer.isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-background bg-emerald-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-ink">{freelancer.name}</h3>
            <Badge variant="secondary">{freelancer.specialty}</Badge>
          </div>

          <div className="mt-1 flex items-center gap-1 text-xs text-ink/50">
            <MapPin className="h-3 w-3" />
            <span>{freelancer.location}</span>
          </div>

          <p className="mt-1 line-clamp-2 text-xs text-ink/60">{freelancer.bio}</p>

          {freelancer.skills?.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {freelancer.skills.slice(0, 3).map((skill) => (
                <span key={skill} className="rounded-md bg-surface px-2 py-0.5 text-[10px] text-ink/50">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <div className="flex items-center gap-1.5">
          <StarRating rating={freelancer.rating} />
          <span className="text-xs text-ink/50">({freelancer.reviews})</span>
        </div>
        <span className="text-xs text-ink/50">{freelancer.completedOrders} pesanan selesai</span>
      </div>
    </Link>
  );
}
