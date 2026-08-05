import { StarRating } from "@/components/shared/StarRating";

function isAvatarUrl(value) {
  return typeof value === "string" && /^(https?:\/\/|\/|data:)/.test(value);
}

export function ReviewCard({ review, showAvatar = true }) {
  const name = review.user || review.clientName;
  const avatar = review.clientAvatar;
  const serviceName = review.service || review.serviceName;

  return (
    <div className="border-t border-border py-4 first:border-0 first:pt-0">
      <div className="flex items-start gap-3">
        {showAvatar && (
          isAvatarUrl(avatar) ? (
            <img src={avatar} alt={name} className="h-8 w-8 shrink-0 rounded-full object-cover" />
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface text-xs font-semibold text-ink/60">
              {avatar || name?.[0] || "U"}
            </div>
          )
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-ink">{name}</p>
              {serviceName && (
                <p className="text-xs text-ink/50">{serviceName}</p>
              )}
            </div>
            <span className="text-xs text-ink/40">{review.date}</span>
          </div>

          <div className="mt-1.5">
            <StarRating rating={review.rating} />
          </div>

          {review.comment && (
            <p className="mt-2 text-sm text-ink/70 line-clamp-3">{review.comment}</p>
          )}
        </div>
      </div>
    </div>
  );
}
