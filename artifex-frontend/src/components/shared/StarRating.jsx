import { Star } from "lucide-react";

export function StarRating({ rating, size = "sm" }) {
  const sizeClass = size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5";

  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={`${sizeClass} ${
            i < rating ? "fill-amber-400 text-amber-400" : "text-ink/20"
          }`}
        />
      ))}
    </div>
  );
}
