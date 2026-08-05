import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, Clock, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { getFavorites, toggleFavorite } from "@/services/api/favorites";
import { formatCurrency } from "@/constants/orderStatus";

function FavoriteCardSkeleton() {
  return (
    <Card className="space-y-3">
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <div className="flex justify-between">
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-5 w-16" />
      </div>
    </Card>
  );
}

function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getFavorites().then((data) => {
      if (mounted) {
        setFavorites(data);
        setIsLoading(false);
      }
    });
    return () => (mounted = false);
  }, []);

  const handleRemove = async (serviceId) => {
    await toggleFavorite(serviceId);
    setFavorites((prev) => prev.filter((s) => s.id !== serviceId));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-xl font-semibold text-ink">Favorit Saya</h2>
      <p className="mt-1 text-sm text-ink/60">
        Jasa yang kamu simpan untuk dipesan nanti.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            <FavoriteCardSkeleton />
            <FavoriteCardSkeleton />
            <FavoriteCardSkeleton />
          </>
        ) : favorites.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
            <Heart className="h-8 w-8 text-ink/20" />
            <p className="mt-3 text-sm font-medium text-ink">Belum ada favorit</p>
            <p className="mt-1 text-xs text-ink/50">
              Simpan jasa yang kamu suka dengan menekan ikon hati
            </p>
            <Button asChild variant="outline" size="sm" className="mt-4">
              <Link to="/explore">Explore Jasa</Link>
            </Button>
          </div>
        ) : (
          favorites.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col rounded-xl border border-border bg-surface transition-all hover:border-primary/40 hover:shadow-card"
            >
              {/* Image placeholder */}
              <div className="relative aspect-[4/3] rounded-t-xl bg-surface">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.title}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full rounded-t-xl object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-ink/20">
                    <span className="text-4xl">🎨</span>
                  </div>
                )}
                <Badge variant="primary" className="absolute left-3 top-3">
                  {service.category}
                </Badge>
                <button
                  onClick={() => handleRemove(service.id)}
                  className="absolute right-3 top-3 rounded-full bg-surface/90 p-1.5 text-red-400 shadow-sm transition-colors hover:bg-red-500/20 hover:text-red-400"
                  title="Hapus dari favorit"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-4">
                <Link
                  to={`/service/${service.id}`}
                  className="text-sm font-semibold text-ink line-clamp-2 hover:text-primary"
                >
                  {service.title}
                </Link>

                <div className="mt-3 flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {service.freelancer.name[0]}
                  </div>
                  <span className="text-xs text-ink/60 truncate">
                    {service.freelancer.name}
                  </span>
                  <div className="ml-auto flex items-center gap-1">
                    <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                    <span className="text-xs font-medium text-ink">
                      {service.freelancer.rating}
                    </span>
                    <span className="text-xs text-ink/50">
                      ({service.freelancer.reviews})
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {service.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="rounded-md bg-surface px-2 py-0.5 text-xs text-ink/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto flex items-end justify-between border-t border-border pt-3">
                  <div>
                    <p className="text-xs text-ink/50">Mulai dari</p>
                    <p className="text-base font-semibold text-ink">
                      {formatCurrency(service.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-ink/50">
                    <Clock className="h-3 w-3" />
                    {service.deliveryDays} hari
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Favorites;
