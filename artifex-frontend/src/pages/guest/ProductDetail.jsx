import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Download, ShoppingCart, ChevronRight, Package, Video, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getProductById } from "@/services/api/products";
import { addToCart } from "@/services/api/cart";
import { formatCurrency } from "@/constants/orderStatus";
import useAuthStore from "@/store/useAuthStore";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = useAuthStore((s) => s.role);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePreview, setActivePreview] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    let mounted = true;
    getProductById(id).then((data) => {
      if (mounted) {
        setProduct(data);
        setLoading(false);
      }
    }).catch(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-48 rounded bg-surface" />
          <div className="aspect-video rounded-xl bg-surface" />
          <div className="h-8 w-2/3 rounded bg-surface" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-ink/50">
        <p>Produk tidak ditemukan.</p>
      </div>
    );
  }

  const handleAddToCart = async () => {
    if (!isAuthenticated) return navigate("/login");
    if (role !== "client") return;
    setAddingToCart(true);
    try {
      await addToCart(product.id);
      navigate("/client/cart");
    } catch {
      // already in cart or error
    }
    setAddingToCart(false);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) return navigate("/login");
    if (role !== "client") return;
    navigate(`/client/product-checkout/${product.id}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-ink/50">
        <Link to="/" className="hover:text-ink">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/explore-products" className="hover:text-ink">Produk</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink truncate">{product.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Preview gallery */}
          <div>
            <div className="aspect-video overflow-hidden rounded-xl border border-border bg-surface flex items-center justify-center">
              {product.previews?.[activePreview] ? (
                product.previews[activePreview].type === "video" ? (
                  <div className="flex items-center gap-2 text-ink/40">
                    <Video className="h-12 w-12" />
                    <span>Video Preview</span>
                  </div>
                ) : (
                  <img src={product.previews[activePreview].url} alt={product.title} className="h-full w-full object-cover" />
                )
              ) : (
                <Package className="h-16 w-16 text-ink/15" />
              )}
            </div>
            {product.previews?.length > 1 && (
              <div className="mt-3 flex gap-2">
                {product.previews.map((pv, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePreview(idx)}
                    className={`h-16 w-20 rounded-lg border-2 bg-surface transition-colors flex items-center justify-center ${activePreview === idx ? "border-primary" : "border-transparent hover:border-border"}`}
                  >
                    {pv.type === "video" ? <Video className="h-4 w-4 text-ink/40" /> : <ImageIcon className="h-4 w-4 text-ink/40" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Title */}
          <div>
            <Badge variant="primary" className="mb-2">{product.category}</Badge>
            <h1 className="text-2xl font-semibold text-ink">{product.title}</h1>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">{product.freelancer?.name?.[0]}</div>
              <div>
                <p className="text-sm font-medium text-ink">{product.freelancer?.name}</p>
                <p className="text-xs text-ink/50">{product.freelancer?.location}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <Card>
            <h2 className="mb-3 text-lg font-semibold text-ink">Deskripsi Produk</h2>
            <div className="whitespace-pre-line text-sm leading-relaxed text-ink/70">{product.description}</div>
          </Card>

          {/* File info */}
          {product.file_name && (
            <Card>
              <h2 className="mb-3 text-lg font-semibold text-ink">File</h2>
              <div className="flex items-center gap-3 rounded-lg bg-surface p-3">
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium text-ink">{product.file_name}</p>
                  <p className="text-xs text-ink/50">Setelah pembelian, file bisa didownload langsung</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card>
              <div className="text-center">
                <p className="text-3xl font-bold text-ink">{formatCurrency(product.price)}</p>
              </div>
              <Button className="mt-4 w-full" onClick={handleBuyNow}>
                Beli Sekarang
              </Button>
              <Button variant="outline" className="mt-2 w-full" onClick={handleAddToCart} disabled={addingToCart}>
                <ShoppingCart className="h-4 w-4" /> {addingToCart ? "Ditambahkan..." : "Tambah ke Cart"}
              </Button>
              <div className="mt-4 flex items-center justify-center gap-2 text-sm text-ink/50">
                <Download className="h-4 w-4" />
                <span>{product.downloads ?? 0} orang sudah beli</span>
              </div>
            </Card>

            <Card>
              <h3 className="mb-3 text-sm font-semibold text-ink">Tentang Penjual</h3>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-medium text-primary">{product.freelancer?.name?.[0]}</div>
                <div>
                  <p className="font-medium text-ink">{product.freelancer?.name}</p>
                  <p className="text-xs text-ink/50">{product.freelancer?.location}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-ink/60 line-clamp-3">{product.freelancer?.bio}</p>
              <Link to={`/freelancer/${product.freelancer?.id}`}>
                <Button variant="outline" size="sm" className="mt-4 w-full">Lihat Profil</Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
