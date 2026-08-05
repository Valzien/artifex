import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { getCategories } from "@/services/api/categories";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { Seo } from "@/components/shared/Seo";

function Home() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  return (
    <div>
      <Seo title="Artifex - Marketplace Freelance & Produk Digital Indonesia" description="Temukan jasa desain, video editing, copywriting, web development dan produk digital siap download dari freelancer Indonesia." path="/" />
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 py-24 text-center sm:px-6 lg:px-8">
        <Badge variant="primary" className="mb-4">Marketplace jasa freelance</Badge>
        <h1 className="text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          Temukan pengrajin digital<br />untuk setiap proyekmu
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink/70">
          Dari desain, video, hingga pengembangan web — Artifex mempertemukan
          kamu dengan freelancer berkualitas yang siap mengerjakan idemu.
        </p>
        <div className="mx-auto mt-8 flex max-w-xl items-center gap-2 rounded-full border border-white/15 bg-white/10 p-2 shadow-lg shadow-black/20 backdrop-blur-xl">
          <Search className="ml-3 h-5 w-5 text-ink/50" />
          <input
            type="text"
            placeholder="Cari jasa, misal: desain logo, edit video..."
            className="flex-1 bg-transparent px-2 py-2 text-sm text-ink placeholder:text-ink/50 focus:outline-none"
          />
          <Link to="/explore"><Button size="sm">Cari</Button></Link>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-xl font-semibold text-ink">Jelajahi Kategori</h2>
        <div className="grid grid-cols-2 gap-3 overflow-hidden sm:grid-cols-3 lg:grid-cols-4">
          {categories.map((cat) => (
            <CategoryCard key={cat.slug} category={cat} variant="compact" />
          ))}
        </div>
      </section>

      {/* CTA jadi freelancer */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-br from-secondary/40 via-primary/25 to-accent/30 px-8 py-12 text-center">
          <h2 className="text-2xl font-semibold text-white">Punya keahlian? Mulai berkarya di Artifex</h2>
          <p className="mx-auto mt-2 max-w-md text-white/70">
            Bergabung sebagai freelancer dan dapatkan klien dari seluruh Indonesia.
          </p>
          <Link to="/become-freelancer">
            <Button variant="primary" className="mt-6">Mulai Sebagai Freelancer</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
