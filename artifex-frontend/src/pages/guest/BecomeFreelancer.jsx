import { Link } from "react-router-dom";
import {
  CheckCircle,
  Upload,
  MessageSquare,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

const STEPS = [
  {
    icon: CheckCircle,
    title: "Daftar & Verifikasi",
    description: "Buat akun dan lengkapi profil kamu. Tim kami akan melakukan verifikasi dalam 1-2 hari kerja.",
  },
  {
    icon: Upload,
    title: "Buat Portfolio",
    description: "Tampilkan karya terbaikmu untuk menarik perhatian klien potensial.",
  },
  {
    icon: MessageSquare,
    title: "Terima Pesanan",
    description: "Mulai menerima pesanan dari klien dan kerjakan sesuai deadline yang disepakati.",
  },
  {
    icon: Wallet,
    title: "Dapatkan Bayaran",
    description: "Terima pembayaran setelah pekerjaan selesai dan disetujui klien.",
  },
];

const BENEFITS = [
  "Komisi hanya 10% per transaksi",
  "Pembayaran cepat dan aman",
  "Jangkauan klien nasional",
  "Sistem chat real-time",
  "Dashboard analytics lengkap",
  "Tidak ada biaya langganan",
];

function BecomeFreelancer() {
  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
          Jadilah Freelancer di Artifex
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-ink/60">
          Tunjukkan keahlianmu kepada ribuan klien yang mencari jasa
          berkualitas. Mulai dari sekarang, tanpa biaya langganan.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link to="/register">
            <Button size="lg">
              Mulai Sekarang
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/faq">
            <Button variant="outline" size="lg">
              Pelajari Lebih Lanjut
            </Button>
          </Link>
        </div>
      </section>

      {/* Steps */}
      <section className="border-t border-border bg-surface">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="mb-10 text-center text-2xl font-semibold text-ink">
            Cara Kerja
          </h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, idx) => (
              <div key={step.title} className="relative">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <p className="mt-3 text-xs font-medium text-primary">
                  Langkah {idx + 1}
                </p>
                <h3 className="mt-1 font-semibold text-ink">{step.title}</h3>
                <p className="mt-1 text-sm text-ink/60">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-2xl font-semibold text-ink">
              Kenapa Bergabung dengan Artifex?
            </h2>
            <p className="mt-3 text-ink/60">
              Kami memberikan lingkungan yang adil dan transparan untuk
              freelancer berkembang.
            </p>
            <ul className="mt-6 space-y-3">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 text-sm text-ink/70">
                  <CheckCircle className="h-4 w-4 shrink-0 text-primary" />
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <Card>
            <h3 className="mb-4 font-semibold text-ink">Siap Memulai?</h3>
            <p className="text-sm text-ink/60">
              Daftar sekarang dan mulai terima pesanan dalam hitungan hari.
            </p>
            <Link to="/register">
              <Button className="mt-4 w-full">
                Daftar sebagai Freelancer
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>
        </div>
      </section>
    </div>
  );
}

export default BecomeFreelancer;
