import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FolderOpen } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { getPublicPortfolios } from "@/services/api/portfolio";
import { Seo } from "@/components/shared/Seo";

function Portfolio() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("");

  const categories = [...new Set(items.map((i) => i.category).filter(Boolean))];

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getPublicPortfolios({ category: category || undefined }).then((data) => {
      if (!cancelled) { setItems(data); setLoading(false); }
    });
    return () => { cancelled = true; };
  }, [category]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Seo title="Portfolio Freelancer" description="Karya terbaik freelancer Artifex di bidang desain, ilustrasi, dan kreatif digital." path="/portfolio" />
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Portfolio</h1>
        <p className="mt-1 text-ink/60">Karya terbaik dari para freelancer di Artifex</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button
          onClick={() => setCategory("")}
          className={cn("rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            !category ? "bg-primary text-primary-foreground" : "bg-surface text-ink/60 hover:text-ink")}
        >
          Semua
        </button>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={cn("rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              category === c ? "bg-primary text-primary-foreground" : "bg-surface text-ink/60 hover:text-ink")}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse overflow-hidden rounded-xl border border-border bg-surface">
              <div className="aspect-video bg-surface" />
              <div className="space-y-2 p-4">
                <div className="h-4 w-2/3 rounded bg-surface" />
                <div className="h-3 w-1/3 rounded bg-surface" />
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <FolderOpen className="h-10 w-10 text-ink/30" />
            <p className="mt-3 text-lg font-medium text-ink">Belum ada karya di kategori ini</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => setCategory("")}>Reset Filter</Button>
          </div>
        ) : (
          items.map((item) => (
            <Link
              key={item.id}
              to={`/portfolio/${item.id}`}
              className="group overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-border"
            >
              {item.image ? (
                <img src={item.image} alt={item.title} loading="lazy" decoding="async" className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105" />
              ) : (
                <div className="flex aspect-video w-full items-center justify-center bg-gradient-to-br from-secondary/30 to-accent/20 text-4xl">
                  🎨
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate text-sm font-semibold text-ink">{item.title}</h3>
                  {item.category && <Badge variant="secondary" className="shrink-0 text-[10px]">{item.category}</Badge>}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  {item.freelancer?.avatar ? (
                    <img src={item.freelancer.avatar} alt="" loading="lazy" decoding="async" className="h-6 w-6 rounded-full object-cover" />
                  ) : (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-semibold text-primary">
                      {item.freelancer?.name?.[0] ?? "?"}
                    </div>
                  )}
                  <span className="text-xs text-ink/60">{item.freelancer?.name}</span>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default Portfolio;
