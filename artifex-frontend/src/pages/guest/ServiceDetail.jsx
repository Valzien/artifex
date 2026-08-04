import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Star, Clock, RefreshCw, MessageSquare, Heart, Share2, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getServiceDetail } from "@/services/api/services";
import { formatCurrency } from "@/constants/orderStatus";
import { ReviewCard } from "@/components/shared/ReviewCard";
import useAuthStore from "@/store/useAuthStore";

function ServiceDetail() {
  const { id } = useParams();
  return <ServiceDetailContent key={id} id={id} />;
}

function ServiceDetailContent({ id }) {
  const navigate = useNavigate();
  const role = useAuthStore((s) => s.role);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [selectedPackage, setSelectedPackage] = useState("Standard");
  const [activeImage, setActiveImage] = useState(0);
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getServiceDetail(id).then((data) => {
      if (mounted) {
        setService(data);
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
          <div className="aspect-[16/9] rounded-xl bg-surface" />
          <div className="h-8 w-2/3 rounded bg-surface" />
          <div className="h-4 w-full rounded bg-surface" />
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-ink/50">
        <p>Jasa tidak ditemukan.</p>
      </div>
    );
  }

  const pkg = service.packages?.find((p) => p.name === selectedPackage);
  const freelancer = service.freelancer;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-ink/50">
        <Link to="/" className="hover:text-ink">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/explore" className="hover:text-ink">Explore</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/explore?category=${service.category}`} className="hover:text-ink truncate">{service.category}</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink">Detail</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Image gallery */}
          <div>
            <div className="aspect-[16/9] overflow-hidden rounded-xl border border-border bg-surface">
              {service.images?.[activeImage] ? (
                <img src={service.images[activeImage]} alt={service.title} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-ink/20"><span className="text-6xl">🎨</span></div>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              {service.images?.map((_, idx) => (
                <button key={idx} onClick={() => setActiveImage(idx)}
                  className={`h-16 w-20 rounded-lg border-2 bg-surface transition-colors ${activeImage === idx ? "border-primary" : "border-transparent hover:border-border"}`}>
                  <span className="text-xs text-ink/30">{idx + 1}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <Badge variant="primary" className="mb-2">{service.category}</Badge>
            <h1 className="text-2xl font-semibold text-ink line-clamp-2">{service.title}</h1>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-medium text-primary">{freelancer?.name?.[0]}</div>
              <div className="min-w-0">
                <Link to={`/freelancer/${freelancer?.id ?? 1}`} className="text-sm font-medium text-ink hover:text-primary truncate">{freelancer?.name}</Link>
                <div className="flex items-center gap-2 text-xs text-ink/50">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                  {freelancer?.rating} ({freelancer?.reviewsCount} review)
                  <span>·</span>
                  {freelancer?.completedOrders} pesanan selesai
                </div>
              </div>
              <div className="ml-auto flex gap-2">
                <Button variant="ghost" size="icon"><Heart className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon"><Share2 className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>

          {/* Description */}
          <Card>
            <h2 className="mb-3 text-lg font-semibold text-ink">Tentang Jasa Ini</h2>
            <div className="whitespace-pre-line text-sm leading-relaxed text-ink/70">{service.description}</div>
          </Card>

          {/* Reviews */}
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">Review</h2>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium text-ink">{freelancer?.rating}</span>
                <span className="text-sm text-ink/50">({service.reviews?.length ?? 0})</span>
              </div>
            </div>
            <div className="mt-4">
              {service.reviews?.length > 0 ? service.reviews.map((review) => (
                <ReviewCard key={review.id} review={{ user: review.userName, date: review.createdAt, rating: review.rating, comment: review.comment }} />
              )) : (
                <p className="text-sm text-ink/50">Belum ada review</p>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card>
              <div className="flex gap-1 rounded-lg bg-surface p-1">
                {service.packages?.map((p) => (
                  <button key={p.name} onClick={() => setSelectedPackage(p.name)}
                    className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition-colors ${selectedPackage === p.name ? "bg-surface text-ink shadow-sm" : "text-ink/50 hover:text-ink"}`}>
                    {p.name}
                  </button>
                ))}
              </div>
              {pkg && (
                <div className="mt-4">
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-semibold text-ink">{pkg.name}</h3>
                    <span className="text-xl font-bold text-ink">{formatCurrency(pkg.price)}</span>
                  </div>
                  <p className="mt-1 text-sm text-ink/60">{pkg.description}</p>
                  <div className="mt-4 flex items-center gap-4 text-sm text-ink/60">
                    <div className="flex items-center gap-1"><Clock className="h-4 w-4" />{pkg.deliveryDays} hari</div>
                    <div className="flex items-center gap-1"><RefreshCw className="h-4 w-4" />Revisi</div>
                  </div>
                  <ul className="mt-4 space-y-2">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm text-ink/70">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />{feature}
                      </li>
                    ))}
                  </ul>
                  <Button className="mt-6 w-full" onClick={() => {
                    if (!isAuthenticated) return navigate("/login");
                    if (role !== "client") return;
                    navigate(`/client/chat?start=${freelancer?.id}`);
                  }}><MessageSquare className="h-4 w-4" />Chat Freelancer</Button>
                  <Button variant="outline" className="mt-2 w-full" onClick={() => {
                    if (!isAuthenticated) return navigate("/login");
                    if (role !== "client") return;
                    navigate(`/client/checkout/${service.id}`);
                  }}>Pesan Sekarang</Button>
                </div>
              )}
            </Card>

            <Card>
              <h3 className="mb-3 text-sm font-semibold text-ink">Tentang Freelancer</h3>
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-medium text-primary">{freelancer?.name?.[0]}</div>
                <div>
                  <p className="font-medium text-ink">{freelancer?.name}</p>
                  <p className="text-xs text-ink/50">{freelancer?.location}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-ink/60">{freelancer?.bio}</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-lg bg-surface p-2">
                  <p className="text-lg font-semibold text-ink">{freelancer?.completedOrders}</p>
                  <p className="text-xs text-ink/50">Pesanan</p>
                </div>
                <div className="rounded-lg bg-surface p-2">
                  <p className="text-lg font-semibold text-ink">{freelancer?.responseTime}</p>
                  <p className="text-xs text-ink/50">Respon</p>
                </div>
              </div>
              <Link to={`/freelancer/${freelancer?.id ?? 1}`}>
                <Button variant="outline" size="sm" className="mt-4 w-full">Lihat Profil</Button>
              </Link>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ServiceDetail;
