import { useState, useEffect } from "react";
import { getCategories } from "@/services/api/categories";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { Seo } from "@/components/shared/Seo";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then((data) => { setCategories(data); setLoading(false); });
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <Seo title="Kategori Layanan" description="Jelajahi kategori jasa freelance di Artifex: desain, editing, copywriting, web, dan lainnya." path="/categories" />
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold text-ink">Kategori Layanan</h1>
        <p className="mx-auto mt-3 max-w-lg text-ink/60">Temukan freelancer ahli di berbagai bidang untuk mewujudkan proyekmu</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-border bg-surface p-6 space-y-3">
              <div className="h-8 w-8 rounded bg-surface" />
              <div className="h-4 w-2/3 rounded bg-surface" />
              <div className="h-3 w-full rounded bg-surface" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Categories;
