import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function CategoryCard({ category, variant = "full" }) {
  if (variant === "compact") {
    return (
      <Link
        to={`/categories?cat=${category.slug}`}
        className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-4 transition-colors hover:bg-surface/80"
      >
        <span className="text-sm font-medium text-ink">{category.name}</span>
        <ArrowRight className="h-4 w-4 text-ink/30" />
      </Link>
    );
  }

  return (
    <Link
      to={`/categories?cat=${category.slug}`}
      className="group block rounded-xl border border-border bg-surface p-6 shadow-card transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <span className="text-3xl">{category.icon}</span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-ink group-hover:text-primary">{category.name}</h3>
          <p className="mt-1 line-clamp-2 text-xs text-ink/50">{category.description}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="text-xs text-ink/50">{category.serviceCount} jasa tersedia</span>
        <ArrowRight className="h-4 w-4 text-ink/30 transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
      </div>
    </Link>
  );
}
