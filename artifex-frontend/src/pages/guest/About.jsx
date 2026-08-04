import { Link } from "react-router-dom";
import { ArrowRight, Users, Briefcase, Globe, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const STATS = [
  { label: "Freelancer Aktif", value: "2,500+", icon: Users },
  { label: "Pesanan Selesai", value: "15,000+", icon: Briefcase },
  { label: "Klien Puas", value: "8,000+", icon: Globe },
  { label: "Transaksi Aman", value: "100%", icon: Shield },
];

const VALUES = [
  {
    title: "Kualitas Terjamin",
    description: "Setiap freelancer melewati proses verifikasi untuk memastikan kualitas kerja terbaik.",
  },
  {
    title: "Transaksi Aman",
    description: "Sistem escrow memastikan uang kamu aman sampai pekerjaan selesai sesuai standar.",
  },
  {
    title: "Komunikasi Mudah",
    description: "Chat langsung dengan freelancer untuk koordinasi proyek secara real-time.",
  },
  {
    title: "Harga Transparan",
    description: "Tidak ada biaya tersembunyi. Lihat harga jelas sebelum memesan.",
  },
];

function About() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
          Tentang Artifex
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-ink/60">
          Artifex adalah marketplace digital yang menghubungkan klien dengan
          freelancer berkualitas untuk mewujudkan berbagai kebutuhan kreatif
          dan teknologi.
        </p>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 px-4 py-12 sm:px-6 md:grid-cols-4 lg:px-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="mx-auto h-6 w-6 text-primary" />
              <p className="mt-2 text-2xl font-bold text-ink">{stat.value}</p>
              <p className="text-sm text-ink/50">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-ink">Misi Kami</h2>
            <p className="mt-4 text-ink/60 leading-relaxed">
              Kami percaya bahwa setiap orang memiliki keahlian unik yang
              layak dihargai. Artifex hadir untuk menjadi jembatan antara
              talenta kreatif dengan klien yang membutuhkan layanan digital
              berkualitas.
            </p>
            <p className="mt-4 text-ink/60 leading-relaxed">
              Dengan platform yang transparan, aman, dan mudah digunakan,
              kami berkomitmen untuk membantu freelancer berkembang dan klien
              mendapatkan hasil terbaik.
            </p>
          </div>
          <div className="flex aspect-square items-center justify-center rounded-2xl bg-surface">
            <span className="text-6xl">🎨</span>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-8 text-center text-2xl font-semibold text-ink">
            Nilai-Nilai Kami
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {VALUES.map((value) => (
              <Card key={value.title}>
                <h3 className="font-semibold text-ink">{value.title}</h3>
                <p className="mt-2 text-sm text-ink/60">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-br from-secondary/40 via-primary/25 to-accent/30 px-8 py-12 text-center">
          <h2 className="text-2xl font-semibold text-white">
            Siap memulai?
          </h2>
          <p className="mx-auto mt-2 max-w-md text-white/70">
            Bergabung dengan Artifex sekarang dan temukan freelancer atau
            klien yang tepat untuk proyekmu.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register">
              <Button variant="primary">
                Daftar Sekarang
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/explore">
              <Button variant="outline" className="border-white/25 text-white hover:bg-white/10">
                Explore Services
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default About;
