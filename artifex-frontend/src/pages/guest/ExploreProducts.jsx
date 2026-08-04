import { useEffect, useState } from "react";
import { Search, Package, X } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import ProductCard from "@/components/shared/ProductCard";
import { cn } from "@/lib/utils";
import { getProducts } from "@/services/api/products";
import { getCategories } from "@/services/api/categories";

function ProductCardSkeleton() {
  return (
    <Card className="p-0 overflow-hidden">
      <Skeleton className="aspect-video" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/3" />
      </div>
    </Card>
  );
}

function ExploreProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    let mounted = true;
    getCategories().then((cats) => {
      if (mounted) setCategories(cats);
    });
    return () => (mounted = false);
  }, []);

  useEffect(() => {
    let mounted = true;
    getProducts({ search: debouncedSearch || undefined, category: selectedCategory || undefined }).then((data) => {
      if (mounted) {
        setProducts(data);
        setIsLoading(false);
      }
    });
    return () => (mounted = false);
  }, [debouncedSearch, selectedCategory]);

  const hasFilters = debouncedSearch || selectedCategory;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-ink">Produk Jadi</h1>
        <p className="mt-2 text-ink/60">Template, aset, dan produk digital siap download.</p>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari produk..."
            className="pl-10"
          />
        </div>
      </div>

      {categories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setSelectedCategory((prev) => (prev === cat.slug ? "" : cat.slug))}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                selectedCategory === cat.slug
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-ink/50 hover:border-primary/30 hover:text-ink"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {hasFilters && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-ink/50">{products.length} hasil</span>
          <button
            onClick={() => { setSearch(""); setSelectedCategory(""); }}
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
          >
            <X className="h-3 w-3" /> Hapus filter
          </button>
        </div>
      )}

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
            <ProductCardSkeleton />
          </>
        ) : products.length === 0 ? (
          <div className="col-span-full py-16 text-center">
            <Package className="mx-auto h-10 w-10 text-ink/20" />
            <p className="mt-3 text-ink/50">Produk tidak ditemukan.</p>
          </div>
        ) : (
          products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}

export default ExploreProducts;
