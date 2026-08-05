import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { getFreelancers } from "@/services/api/freelancers";
import { FreelancerCard } from "@/components/shared/FreelancerCard";
import { SearchInput } from "@/components/shared/SearchInput";
import { Seo } from "@/components/shared/Seo";

const SPECIALTIES = [
  "Graphic Design", "Video Editing", "Copywriting", "Web Development",
  "Art Commission", "Voice Over", "Live2D Rigging", "Social Media Management", "Motion Graphics",
];

function FreelancerList() {
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getFreelancers({ specialty: selectedSpecialty || undefined, search: search || undefined })
      .then((data) => { if (!cancelled) { setFreelancers(data); setLoading(false); } });
    return () => { cancelled = true; };
  }, [selectedSpecialty, search]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Seo title="Cari Freelancer" description="Temukan freelancer profesional di bidang desain, video editing, copywriting, web development dan lainnya di Artifex." path="/freelancers" />
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-ink">Freelancer</h1>
        <p className="mt-1 text-ink/60">Temukan freelancer terbaik untuk proyekmu</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchInput value={search} onChange={setSearch} placeholder="Cari nama, keahlian, atau spesialisasi..." />
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => setSelectedSpecialty("")}
          className={cn("rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            !selectedSpecialty ? "bg-primary text-primary-foreground" : "bg-surface text-ink/60 hover:bg-surface hover:text-ink")}>
          Semua
        </button>
        {SPECIALTIES.map((spec) => (
          <button key={spec} onClick={() => setSelectedSpecialty(spec)}
            className={cn("rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              selectedSpecialty === spec ? "bg-primary text-primary-foreground" : "bg-surface text-ink/60 hover:bg-surface hover:text-ink")}>
            {spec}
          </button>
        ))}
      </div>

      <div className="mt-6"><p className="text-sm text-ink/50">{loading ? "Memuat..." : `${freelancers.length} freelancer ditemukan`}</p></div>

      <div className="mt-4 grid grid-cols-1 gap-4 overflow-hidden md:grid-cols-2">
        {loading ? (
          [...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-xl border border-border bg-surface p-5">
              <div className="flex gap-4">
                <div className="h-14 w-14 rounded-full bg-surface" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/3 rounded bg-surface" />
                  <div className="h-3 w-1/2 rounded bg-surface" />
                  <div className="h-3 w-full rounded bg-surface" />
                </div>
              </div>
            </div>
          ))
        ) : freelancers.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
            <p className="text-lg font-medium text-ink">Tidak ada freelancer ditemukan</p>
            <p className="mt-1 text-sm text-ink/50">Coba ubah filter atau kata kunci pencarianmu</p>
            <Button variant="outline" size="sm" className="mt-4" onClick={() => { setSearch(""); setSelectedSpecialty(""); }}>Reset Filter</Button>
          </div>
        ) : (
          freelancers.map((freelancer) => <FreelancerCard key={freelancer.id} freelancer={freelancer} />)
        )}
      </div>
    </div>
  );
}

export default FreelancerList;
