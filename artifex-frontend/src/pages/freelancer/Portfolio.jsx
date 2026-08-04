import { useEffect, useState } from "react";
import { Plus, Trash2, Image, Video, FileText, X, UploadCloud } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  getPortfolioItems,
  addPortfolioItem,
  deletePortfolioItem,
} from "@/services/api/freelancerPortfolio";
import { uploadFile } from "@/services/api/upload";

function PortfolioSkeleton() {
  return (
    <Card className="space-y-3">
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/2" />
    </Card>
  );
}

const MEDIA_ICONS = { image: Image, video: Video, pdf: FileText };

const detectMediaType = (file) => {
  const name = file.name.toLowerCase();
  if (/\.(mp4|webm|mov)$/.test(name)) return "video";
  if (/\.pdf$/.test(name)) return "pdf";
  return "image";
};

function Portfolio() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "", image: "", media: [] });
  const [newMediaUrl, setNewMediaUrl] = useState("");
  const [newMediaType, setNewMediaType] = useState("image");
  const [newMediaName, setNewMediaName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    let mounted = true;
    getPortfolioItems().then((data) => {
      if (mounted) {
        setItems(data);
        setIsLoading(false);
      }
    });
    return () => (mounted = false);
  }, []);

  const handleAdd = async () => {
    if (!form.title) return;
    const payload = {
      title: form.title,
      description: form.description || null,
      category: form.category || null,
      image: form.image || null,
      media: form.media.length > 0 ? form.media : null,
    };
    const newItem = await addPortfolioItem(payload);
    setItems((prev) => [...prev, newItem]);
    setForm({ title: "", description: "", category: "", image: "", media: [] });
    setShowForm(false);
  };

  const handleFileUpload = async (e, target) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadError("");
    try {
      const url = await uploadFile(file);
      setForm((p) => {
        if (target === "cover") return { ...p, image: url };
        const type = detectMediaType(file);
        return { ...p, media: [...p.media, { type, url, name: file.name }] };
      });
    } catch {
      setUploadError("Upload gagal. Pastikan file valid (maks 20MB).");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleAddMedia = () => {
    if (!newMediaUrl.trim()) return;
    setForm((p) => ({
      ...p,
      media: [...p.media, { type: newMediaType, url: newMediaUrl.trim(), name: newMediaName.trim() || undefined }],
    }));
    setNewMediaUrl("");
    setNewMediaName("");
  };

  const handleRemoveMedia = (idx) => {
    setForm((p) => ({
      ...p,
      media: p.media.filter((_, i) => i !== idx),
    }));
  };

  const handleDelete = async (id) => {
    await deletePortfolioItem(id);
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">Portfolio</h2>
          <p className="mt-1 text-sm text-ink/60">Tunjukkan karya terbaik kamu.</p>
        </div>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          Tambah Portofolio
        </Button>
      </div>

      {showForm && (
        <Card className="mt-4">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-ink/50">Judul</label>
              <Input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Contoh: Brand Identity — Kopi Nusantara"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink/50">Deskripsi</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Deskripsi singkat tentang proyek ini..."
                rows={3}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink/50">Kategori</label>
              <Input
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
                placeholder="Branding, Logo Design, dll."
                className="mt-1"
              />
            </div>

            {/* Cover image upload */}
            <div>
              <label className="text-xs font-medium text-ink/50">Gambar Sampul</label>
              <div className="mt-1 flex items-center gap-3">
                <input
                  id="portfolio-cover-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "cover")}
                  disabled={isUploading}
                />
                <label
                  htmlFor="portfolio-cover-upload"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-border/50"
                >
                  <UploadCloud className="h-4 w-4 text-primary" />
                  {isUploading ? "Mengupload..." : form.image ? "Ganti Sampul" : "Upload Sampul"}
                </label>
                {form.image && (
                  <img
                    src={form.image}
                    alt="Preview sampul"
                    className="h-12 w-12 rounded-lg border border-border object-cover"
                  />
                )}
                {uploadError && <span className="text-xs text-red-500">{uploadError}</span>}
              </div>
            </div>

            {/* Media upload */}
            <div>
              <label className="text-xs font-medium text-ink/50">Media (foto/video/pdf)</label>
              <div className="mt-2 flex gap-2">
                <select
                  value={newMediaType}
                  onChange={(e) => setNewMediaType(e.target.value)}
                  className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                >
                  <option value="image">Gambar</option>
                  <option value="video">Video</option>
                  <option value="pdf">PDF</option>
                </select>
                <Input
                  value={newMediaUrl}
                  onChange={(e) => setNewMediaUrl(e.target.value)}
                  placeholder="URL media..."
                  className="flex-1"
                />
                <Input
                  value={newMediaName}
                  onChange={(e) => setNewMediaName(e.target.value)}
                  placeholder="Nama (opsional)"
                  className="w-32"
                />
                <Button size="sm" variant="outline" onClick={handleAddMedia}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <input
                  id="portfolio-media-upload"
                  type="file"
                  accept="image/*,video/*,.pdf"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "media")}
                  disabled={isUploading}
                />
                <label
                  htmlFor="portfolio-media-upload"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-border/50"
                >
                  <UploadCloud className="h-4 w-4 text-primary" />
                  {isUploading ? "Mengupload..." : "Upload Gambar / Video / PDF"}
                </label>
                <span className="text-xs text-ink/40">atau tempel URL di kolom atas</span>
              </div>
              {form.media.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.media.map((m, idx) => {
                    const Icon = MEDIA_ICONS[m.type] || Image;
                    return (
                      <div key={idx} className="flex items-center gap-1 rounded-lg border border-border bg-surface px-2 py-1 text-xs">
                        <Icon className="h-3 w-3 text-primary" />
                        <span className="max-w-[100px] truncate">{m.name || m.url}</span>
                        <button onClick={() => handleRemoveMedia(idx)} className="ml-1 rounded-full p-0.5 hover:bg-red-500/20">
                          <X className="h-3 w-3 text-red-400" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="sm" onClick={handleAdd}>Simpan</Button>
            <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>Batal</Button>
          </div>
        </Card>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 overflow-hidden sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <>
            <PortfolioSkeleton />
            <PortfolioSkeleton />
            <PortfolioSkeleton />
          </>
        ) : items.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
            <Image className="h-8 w-8 text-ink/20" />
            <p className="mt-3 text-sm font-medium text-ink">Belum ada portofolio</p>
          </div>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="group p-0">
              <div className="flex aspect-[4/3] items-center justify-center rounded-t-xl bg-surface">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="h-full w-full rounded-t-xl object-cover" />
                ) : item.media?.[0] ? (
                  item.media[0].type === "video" ? (
                    <div className="flex items-center gap-2 text-ink/40">
                      <Video className="h-8 w-8" />
                    </div>
                  ) : item.media[0].type === "pdf" ? (
                    <div className="flex items-center gap-2 text-ink/40">
                      <FileText className="h-8 w-8" />
                    </div>
                  ) : item.media[0].url ? (
                    <img src={item.media[0].url} alt={item.title} className="h-full w-full rounded-t-xl object-cover" />
                  ) : (
                    <div className="flex items-center gap-2 text-ink/40">
                      <Image className="h-8 w-8" />
                    </div>
                  )
                ) : (
                  <Image className="h-10 w-10 text-ink/15" />
                )}
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-ink line-clamp-1">{item.title}</p>
                    <p className="mt-1 text-xs text-ink/50 line-clamp-2">{item.description}</p>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="shrink-0 rounded-lg p-1.5 text-ink/30 opacity-0 transition-opacity hover:text-red-500 group-hover:opacity-100"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <Badge variant="neutral">{item.category}</Badge>
                  <div className="flex items-center gap-1">
                    {(item.media || []).slice(0, 3).map((m, idx) => {
                      const Icon = MEDIA_ICONS[m.type] || Image;
                      return <Icon key={idx} className="h-3 w-3 text-ink/30" />;
                    })}
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default Portfolio;
