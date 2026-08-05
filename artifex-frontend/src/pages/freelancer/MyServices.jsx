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
  X,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Skeleton } from "@/components/ui/Skeleton";
import { Dialog } from "@/components/shared/Dialog";
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

const emptyPackage = () => ({
  name: "",
  price: "",
  delivery_days: "",
  description: "",
  features: [],
  popular: false,
});

const initialForm = {
  title: "",
  description: "",
  category_id: "",
  price: "",
  deliveryDays: "",
  images: [],
  packages: [],
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
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

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
      images: svc.images?.length ? svc.images : svc.image ? [svc.image] : [],
      packages: (svc.packages || []).map((p) => ({
        name: p.name,
        price: p.price,
        delivery_days: p.deliveryDays || "",
        description: p.description || "",
        features: p.features || [],
        popular: p.popular || false,
      })),
    });
    setEditingId(svc.id);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (isSaving) return;
    if (!form.title || !form.description.trim() || !form.category_id || !form.price) {
      setSaveError("Lengkapi judul, deskripsi, kategori, dan harga jasa.");
      return;
    }
    setSaveError("");
    setIsSaving(true);
    const packages = form.packages
      .filter((p) => p.name?.trim() && p.price !== "" && p.price != null)
      .map((p) => ({
        name: p.name.trim(),
        price: Number(p.price),
        delivery_days: Number(p.delivery_days) || 3,
        description: p.description?.trim() || "",
        popular: !!p.popular,
        features: (p.features || []).filter((f) => f.trim()),
      }));
    const payload = {
      title: form.title,
      description: form.description,
      category_id: Number(form.category_id),
      price: Number(form.price),
      delivery_days: Number(form.deliveryDays) || 3,
      image: form.images[0] || null,
      images: form.images,
      packages,
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
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteTarget(id);
  };

  const confirmDelete = async () => {
    if (!deleteTarget || isDeleting) return;
    setIsDeleting(true);
    setSaveError("");
    try {
      await deleteFreelancerService(deleteTarget);
      setServices((prev) => prev.filter((s) => s.id !== deleteTarget));
      setDeleteTarget(null);
    } catch {
      setSaveError("Gagal menghapus jasa.");
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFilesUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setIsUploading(true);
    setUploadError("");
    try {
      const urls = [];
      for (const file of files.slice(0, Math.max(0, 5 - form.images.length))) {
        urls.push(await uploadFile(file));
      }
      setForm((p) => ({ ...p, images: [...p.images, ...urls] }));
    } catch {
      setUploadError("Upload gagal. Pastikan file valid (maks 20MB).");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (idx) => {
    setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));
  };

  const addPackage = () => {
    setForm((p) => ({ ...p, packages: [...p.packages, emptyPackage()] }));
  };

  const updatePackage = (idx, field, value) => {
    setForm((p) => ({
      ...p,
      packages: p.packages.map((pkg, i) => (i === idx ? { ...pkg, [field]: value } : pkg)),
    }));
  };

  const removePackage = (idx) => {
    setForm((p) => ({ ...p, packages: p.packages.filter((_, i) => i !== idx) }));
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
              <label className="text-xs font-medium text-ink/50">Gambar Jasa (maks 5)</label>
              <div className="mt-2 flex flex-wrap gap-3">
                {form.images.map((url, i) => (
                  <div key={url} className="relative">
                    <img
                      src={url}
                      alt={`Gambar ${i + 1}`}
                      className="h-16 w-20 rounded-lg border border-border object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow-sm hover:bg-red-600"
                      aria-label="Hapus gambar"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
                {form.images.length < 5 && (
                  <>
                    <input
                      id="service-file-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleFilesUpload}
                      disabled={isUploading}
                    />
                    <label
                      htmlFor="service-file-upload"
                      className="flex h-16 w-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-ink/40 transition-colors hover:border-primary/40 hover:text-ink/60"
                    >
                      <UploadCloud className="h-4 w-4 text-primary" />
                      <span className="text-[10px]">{isUploading ? "..." : "Upload"}</span>
                    </label>
                  </>
                )}
              </div>
              {uploadError && <span className="mt-1 block text-xs text-red-500">{uploadError}</span>}
            </div>

            <div className="col-span-2">
              <label className="text-xs font-medium text-ink/50">Paket Harga</label>
              <p className="mt-0.5 text-xs text-ink/40">
                Opsional — kamu yang tentukan opsi &amp; harganya sendiri. Biarkan kosong jika hanya 1 harga.
              </p>
              <div className="mt-2 space-y-3">
                {form.packages.map((pkg, i) => (
                  <div key={i} className="rounded-lg border border-border p-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium text-ink/50">Nama Paket</label>
                        <Input
                          value={pkg.name}
                          onChange={(e) => updatePackage(i, "name", e.target.value)}
                          placeholder="Contoh: Basic / Bust / Standar"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-ink/50">Harga (Rp)</label>
                        <Input
                          type="number"
                          value={pkg.price}
                          onChange={(e) => updatePackage(i, "price", e.target.value)}
                          placeholder="250000"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-ink/50">Estimasi Hari</label>
                        <Input
                          type="number"
                          value={pkg.delivery_days}
                          onChange={(e) => updatePackage(i, "delivery_days", e.target.value)}
                          placeholder="3"
                          className="mt-1"
                        />
                      </div>
                      <div className="flex items-end pb-1">
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-ink/70">
                          <input
                            type="checkbox"
                            checked={pkg.popular}
                            onChange={(e) => updatePackage(i, "popular", e.target.checked)}
                            className="h-4 w-4 accent-primary"
                          />
                          Paket populer
                        </label>
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-medium text-ink/50">Deskripsi Paket</label>
                        <Textarea
                          value={pkg.description}
                          onChange={(e) => updatePackage(i, "description", e.target.value)}
                          placeholder="Isi paket ini mencakup apa..."
                          rows={2}
                          className="mt-1"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="text-xs font-medium text-ink/50">Fitur (satu per baris)</label>
                        <Textarea
                          value={pkg.features.join("\n")}
                          onChange={(e) => updatePackage(i, "features", e.target.value.split("\n"))}
                          placeholder={"1 konsep logo\nFile PNG & JPG"}
                          rows={2}
                          className="mt-1"
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removePackage(i)}
                      className="mt-2 flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />Hapus paket
                    </button>
                  </div>
                ))}
                {form.packages.length < 5 && (
                  <Button type="button" variant="outline" size="sm" onClick={addPackage}>
                    <Plus className="h-4 w-4" />Tambah Paket
                  </Button>
                )}
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            {saveError && <span className="text-xs text-red-500">{saveError}</span>}
            <Button size="sm" onClick={handleSave} isLoading={isSaving}>{editingId ? "Update" : "Simpan"}</Button>
            <Button size="sm" variant="ghost" disabled={isSaving} onClick={() => { resetForm(); setShowForm(false); }}>Batal</Button>
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
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isSaving || isDeleting} onClick={() => handleEdit(svc)}>
                  <Edit3 className="h-4 w-4 text-ink/50" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isDeleting} onClick={() => handleDelete(svc.id)}>
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <Dialog isOpen={deleteTarget !== null} onClose={() => setDeleteTarget(null)} title="Hapus jasa">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-sm text-ink/70">
            Yakin ingin menghapus jasa ini? Tindakan ini tidak bisa dibatalkan.
          </p>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button size="sm" variant="ghost" disabled={isDeleting} onClick={() => setDeleteTarget(null)}>
            Batal
          </Button>
          <Button size="sm" variant="danger" isLoading={isDeleting} onClick={confirmDelete}>
            Hapus
          </Button>
        </div>
      </Dialog>
    </div>
  );
}

export default MyServices;
