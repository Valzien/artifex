import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, Package } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { getServices } from "@/services/api/services";
import { getProducts } from "@/services/api/products";
import { getCategories } from "@/services/api/categories";
import { ServiceCard } from "@/components/shared/ServiceCard";
import ProductCard from "@/components/shared/ProductCard";
import { SearchInput } from "@/components/shared/SearchInput";

const SORT_OPTIONS = [
  { value: "relevance", label: "Relevan" },
  { value: "newest", label: "Terbaru" },
  { value: "price-low", label: "Harga: Rendah ke Tinggi" },
  { value: "price-high", label: "Harga: Tinggi ke Rendah" },
  { value: "rating", label: "Rating Tertinggi" },
];

function ExploreServices() {
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [sortBy, setSortBy] = useState("relevance");
  const [showFilters, setShowFilters] = useState(false);
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getServices({ category: selectedCategory || undefined, search: search || undefined, sort: sortBy !== "relevance" ? sortBy : undefined })
      .then((data) => { if (!cancelled) { setServices(data); setLoading(false); } });
    return () => { cancelled = true; };
  }, [selectedCategory, search, sortBy]);

  useEffect(() => {
    let cancelled = false;
    getProducts({ category: selectedCategory || undefined, search: search || undefined })
      .then((data) => { if (!cancelled) { setProducts(data); } });
    return () => { cancelled = true; };
  }, [selectedCategory, search]);

  useEffect(() => {
    let cancelled = false;
    getCategories().then((cats) => {
      if (!cancelled) {
        setCategories(cats);
        setSelectedCategory((prev) => {
          if (!prev) return prev;
          const byName = cats.find((c) => c.name === prev);
          return byName ? byName.slug : prev;
        });
      }
    });
    return () => { cancelled = true; };
  }, []);

  const handleCategoryToggle = (slug) => setSelectedCategory((prev) => (prev === slug ? "" : slug));

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("");
    setSortBy("relevance");
  };

  const hasActiveFilters = search || selectedCategory;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Explore Services</h1>
        <p className="mt-1 text-ink/60">Temukan jasa dan produk yang tepat untuk proyekmu</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Cari jasa, produk, kategori, atau tag..." />
        <div className="flex gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-11 rounded-xl border border-border bg-surface px-3 text-sm text-ink focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <Button variant="outline" size="md" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xs text-ink/50">{services.length} jasa · {products.length} produk</span>
          <button onClick={clearFilters} className="text-xs text-primary hover:underline">Hapus semua filter</button>
        </div>
      )}

      <div className="mt-6 flex gap-6">
        <aside className={cn("w-56 shrink-0", showFilters ? "block" : "hidden lg:block")}>
          <div className="sticky top-24">
            <h3 className="mb-3 text-sm font-semibold text-ink">Kategori</h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button key={cat.slug} onClick={() => handleCategoryToggle(cat.slug)}
                  className={cn("w-full rounded-lg px-3 py-2 text-left text-sm transition-colors truncate",
                    selectedCategory === cat.slug ? "bg-primary/10 font-medium text-primary" : "text-ink/60 hover:bg-surface hover:text-ink"
                  )}>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div className="flex-1 space-y-10">
          <section>
            <h2 className="mb-3 text-sm font-semibold text-ink">Jasa</h2>
            {loading ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse rounded-xl border border-border bg-surface">
                    <div className="aspect-[4/3] bg-surface" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 w-3/4 rounded bg-surface" />
                      <div className="h-3 w-1/2 rounded bg-surface" />
                      <div className="h-3 w-full rounded bg-surface" />
                    </div>
                  </div>
                ))}
              </div>
            ) : services.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border py-12 text-center text-sm text-ink/50">
                Tidak ada jasa ditemukan
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2 xl:grid-cols-3">
                {services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-ink">Produk Jadi</h2>
            {products.length === 0 ? (
              <p className="flex items-center gap-2 rounded-xl border border-dashed border-border py-12 text-center justify-center text-sm text-ink/50">
                <Package className="h-4 w-4" />
                Tidak ada produk ditemukan
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default ExploreServices;
