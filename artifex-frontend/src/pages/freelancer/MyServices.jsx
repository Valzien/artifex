import { useEffect, useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Star,
  Clock,
  Eye,
  EyeOff,
  Image,
  UploadCloud,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  getFreelancerServices,
  addFreelancerService,
  updateFreelancerService,
  deleteFreelancerService,
} from "@/services/api/freelancerServices";
import { getCategories } from "@/services/api/categories";
import { uploadFile } from "@/services/api/upload";
import { formatCurrency } from "@/constants/orderStatus";

function ServiceSkeleton() {
  return (
    <Card className="space-y-3">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-3 w-1/2" />
    </Card>
  );
}

const initialForm = {
  title: "",
  description: "",
  category_id: "",
  price: "",
  deliveryDays: "",
  image: "",
};

function MyServices() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    let mounted = true;
    Promise.all([getFreelancerServices(), getCategories()]).then(([svcs, cats]) => {
      if (mounted) {
        setServices(svcs);
        setCategories(cats);
        setIsLoading(false);
      }
    });
    return () => (mounted = false);
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setSaveError("");
  };

  const handleEdit = (svc) => {
    setForm({
      title: svc.title,
      description: svc.description || "",
      category_id: svc.category_id || "",
      price: svc.price,
      deliveryDays: svc.deliveryDays || "",
      image: svc.image || "",
    });
    setEditingId(svc.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.description.trim() || !form.category_id || !form.price) {
      setSaveError("Lengkapi judul, deskripsi, kategori, dan harga jasa.");
      return;
    }
    setSaveError("");
    const payload = {
      title: form.title,
      description: form.description,
      category_id: Number(form.category_id),
      price: Number(form.price),
      delivery_days: Number(form.deliveryDays) || 3,
      image: form.image || null,
    };
    try {
      if (editingId) {
        const updated = await updateFreelancerService(editingId, payload);
        setServices((prev) => prev.map((s) => (s.id === editingId ? updated : s)));
      } else {
        const newSvc = await addFreelancerService(payload);
        setServices((prev) => [...prev, newSvc]);
      }
      resetForm();
      setShowForm(false);
    } catch {
      setSaveError("Gagal menyimpan. Cek kembali isian form.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteFreelancerService(id);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch {
      setSaveError("Gagal menghapus jasa.");
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadError("");
    try {
      const url = await uploadFile(file);
      setForm((p) => ({ ...p, image: url }));
    } catch {
      setUploadError("Upload gagal. Pastikan file valid (maks 20MB).");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">Layanan Saya</h2>
          <p className="mt-1 text-sm text-ink/60">Kelola jasa yang kamu tawarkan.</p>
        </div>
        <Button size="sm" onClick={() => { resetForm(); setShowForm(!showForm); }}>
          <Plus className="h-4 w-4" />
          {showForm && editingId ? "Batal" : "Tambah Jasa"}
        </Button>
      </div>

      {/* Add Form */}
      {showForm && (
        <Card className="mt-4">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-ink">{editingId ? "Edit Jasa" : "Tambah Jasa Baru"}</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-medium text-ink/50">Judul Jasa</label>
              <Input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Contoh: Desain Logo Profesional"
                className="mt-1"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-ink/50">Deskripsi</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Deskripsi jasa..."
                rows={3}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink/50">Kategori</label>
              <select
                value={form.category_id}
                onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value }))}
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              >
                <option value="">Pilih kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-ink/50">Harga Mulai dari (Rp)</label>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                placeholder="250000"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink/50">Estimasi Hari</label>
              <Input
                type="number"
                value={form.deliveryDays}
                onChange={(e) => setForm((p) => ({ ...p, deliveryDays: e.target.value }))}
                placeholder="3"
                className="mt-1"
              />
            </div>
            <div className="col-span-2">
              <label className="text-xs font-medium text-ink/50">Gambar Jasa</label>
              <div className="mt-1 flex items-center gap-3">
                <input
                  id="service-file-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                <label
                  htmlFor="service-file-upload"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-border/50"
                >
                  <UploadCloud className="h-4 w-4 text-primary" />
                  {isUploading ? "Mengupload..." : form.image ? "Ganti Gambar" : "Upload Gambar"}
                </label>
                {form.image && (
                  <img
                    src={form.image}
                    alt="Preview jasa"
                    className="h-12 w-12 rounded-lg border border-border object-cover"
                  />
                )}
                {uploadError && <span className="text-xs text-red-500">{uploadError}</span>}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            {saveError && <span className="text-xs text-red-500">{saveError}</span>}
            <Button size="sm" onClick={handleSave}>{editingId ? "Update" : "Simpan"}</Button>
            <Button size="sm" variant="ghost" onClick={() => { resetForm(); setShowForm(false); }}>Batal</Button>
          </div>
        </Card>
      )}

      {/* Services List */}
      <div className="mt-6 space-y-3">
        {isLoading ? (
          <>
            <ServiceSkeleton />
            <ServiceSkeleton />
            <ServiceSkeleton />
          </>
        ) : services.length === 0 ? (
          <Card className="py-12 text-center">
            <p className="text-sm text-ink/50">Belum ada jasa. Klik "Tambah Jasa" untuk mulai.</p>
          </Card>
        ) : (
          services.map((svc) => (
            <Card key={svc.id} className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10">
                {svc.image ? (
                  <img src={svc.image} alt={svc.title} className="h-full w-full object-cover" />
                ) : (
                  <Image className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-ink">{svc.title}</p>
                  <Badge variant={svc.status === "active" ? "success" : "neutral"}>
                    {svc.status === "active" ? (
                      <><Eye className="inline h-3 w-3 mr-1" />Aktif</>
                    ) : (
                      <><EyeOff className="inline h-3 w-3 mr-1" />Draft</>
                    )}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-4 text-xs text-ink/50">
                  <span>{svc.category}</span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />{svc.deliveryDays} hari
                  </span>
                  {svc.rating > 0 && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />{svc.rating}
                    </span>
                  )}
                  <span>{svc.orders} order</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-ink">{formatCurrency(svc.price)}</p>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(svc)}>
                  <Edit3 className="h-4 w-4 text-ink/50" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(svc.id)}>
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default MyServices;
