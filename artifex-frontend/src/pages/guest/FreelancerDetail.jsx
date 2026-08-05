import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Star, MapPin, Calendar, MessageSquare, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { getFreelancerById } from "@/services/api/freelancers";
import { formatCurrency } from "@/constants/orderStatus";
import { ReviewCard } from "@/components/shared/ReviewCard";
import useAuthStore from "@/store/useAuthStore";

function FreelancerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const role = useAuthStore((s) => s.role);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getFreelancerById(id).then((data) => {
      setFreelancer(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse space-y-6">
          <div className="h-4 w-48 rounded bg-surface" />
          <div className="h-48 rounded-xl bg-surface" />
          <div className="grid gap-8 lg:grid-cols-3"><div className="lg:col-span-2 space-y-4"><div className="h-32 rounded-xl bg-surface" /></div><div className="space-y-4"><div className="h-48 rounded-xl bg-surface" /></div></div>
        </div>
      </div>
    );
  }

  if (!freelancer) {
    return <div className="flex min-h-[50vh] items-center justify-center text-ink/50"><p>Freelancer tidak ditemukan.</p></div>;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex items-center gap-2 text-sm text-ink/50">
        <Link to="/" className="hover:text-ink">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/freelancers" className="hover:text-ink">Freelancers</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-ink truncate">{freelancer.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile header */}
          <Card>
            <div className="flex items-start gap-5">
              <div className="relative">
                {freelancer.avatar && /^(https?:\/\/|\/|data:)/.test(freelancer.avatar) ? (
                  <img
                    src={freelancer.avatar}
                    alt={freelancer.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-medium text-primary">{freelancer.name[0]}</div>
                )}
                <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white bg-emerald-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-semibold text-ink min-w-0 truncate">{freelancer.name}</h1>
                  <Badge variant="primary">{freelancer.specialty}</Badge>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-ink/60">
                  <span className="flex items-center gap-1"><MapPin className="h-4 w-4" />{freelancer.location}</span>
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />Bergabung {freelancer.memberSince}</span>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-ink/70 line-clamp-3">{freelancer.bio}</p>
                <div className="mt-4 flex gap-2">
                  <Button onClick={() => {
                    if (!isAuthenticated) return navigate("/login");
                    if (role !== "client") return;
                    navigate(`/client/chat?start=${freelancer.id}`);
                  }}><MessageSquare className="h-4 w-4" />Chat</Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Services */}
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-ink">Jasa yang Ditawarkan</h2>
            <div className="space-y-3">
              {freelancer.services?.map((service) => (
                <Link key={service.id} to={`/service/${service.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:border-primary/40 hover:bg-surface">
                  <div>
                    <h3 className="font-medium text-ink">{service.title}</h3>
                    <div className="mt-1 flex items-center gap-3 text-xs text-ink/50">
                      <Badge variant="neutral">{service.category}</Badge>
                      <span className="flex items-center gap-1"><Star className="h-3 w-3 fill-amber-400 text-amber-400" />{service.rating} ({service.reviews})</span>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-ink">{formatCurrency(service.price)}</p>
                </Link>
              ))}
            </div>
          </Card>

          {/* Portfolio */}
          <Card>
            <h2 className="mb-4 text-lg font-semibold text-ink">Portfolio</h2>
            <div className="grid grid-cols-2 gap-3">
              {freelancer.portfolio?.length > 0 ? freelancer.portfolio.map((item) => (
                <Link key={item.id} to={`/portfolio/${item.id}`} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-surface">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-ink/20"><span className="text-3xl">🖼️</span></div>
                  )}
                  <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 transition-opacity group-hover:opacity-100">
                    <p className="text-sm font-medium text-white">{item.title}</p>
                  </div>
                </Link>
              )) : (
                <p className="col-span-full text-sm text-ink/50">Belum ada karya di portfolio freelancer ini.</p>
              )}
            </div>
          </Card>

          {/* Reviews */}
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-ink">Review</h2>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-medium text-ink">{freelancer.rating}</span>
                <span className="text-sm text-ink/50">({freelancer.reviewCount})</span>
              </div>
            </div>
            <div className="mt-4">
              {freelancer.reviews?.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 space-y-4">
            <Card>
              <h3 className="mb-4 text-sm font-semibold text-ink">Statistik</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-ink">{freelancer.completedOrders}</p>
                  <p className="text-xs text-ink/50">Pesanan Selesai</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-ink">{freelancer.rating}</p>
                  <p className="text-xs text-ink/50">Rating Rata-rata</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-ink">{freelancer.repeatClients}%</p>
                  <p className="text-xs text-ink/50">Klien Repeat</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium text-ink">{freelancer.lastDelivery}</p>
                  <p className="text-xs text-ink/50">Terakhir Online</p>
                </div>
              </div>
            </Card>

            <Card>
              <h3 className="mb-3 text-sm font-semibold text-ink">Keahlian</h3>
              <div className="flex flex-wrap gap-2">
                {freelancer.skills?.map((skill) => (
                  <span key={skill} className="rounded-full bg-surface px-3 py-1 text-xs font-medium text-ink/70">{skill}</span>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="mb-3 text-sm font-semibold text-ink">Bahasa</h3>
              <div className="space-y-2">
                {freelancer.languages?.map((lang) => (
                  <div key={lang} className="flex items-center justify-between text-sm">
                    <span className="text-ink/70">{lang}</span>
                    <span className="text-xs text-ink/50">Fluent</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <h3 className="mb-3 text-sm font-semibold text-ink">Waktu Respons</h3>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-sm text-ink/70">{freelancer.responseTime}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FreelancerDetail;
