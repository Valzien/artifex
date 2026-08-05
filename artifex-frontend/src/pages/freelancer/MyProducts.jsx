import { useEffect, useState } from "react";
import {
  Plus,
  Edit3,
  Trash2,
  Eye,
  EyeOff,
  Package,
  X,
  Image,
  Video,
  UploadCloud,
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
  getFreelancerProducts,
  addFreelancerProduct,
  updateFreelancerProduct,
  deleteFreelancerProduct,
} from "@/services/api/freelancerProducts";
import { uploadFile } from "@/services/api/upload";
import { getCategories } from "@/services/api/categories";
import { formatCurrency } from "@/constants/orderStatus";

function ProductSkeleton() {
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
  file_url: "",
  file_name: "",
  previews: [],
  tags: [],
  status: "active",
};

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(initialForm);
  const [newPreviewUrl, setNewPreviewUrl] = useState("");
  const [newPreviewType, setNewPreviewType] = useState("image");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = () => {
      Promise.all([getFreelancerProducts(), getCategories()]).then(([prods, cats]) => {
        if (mounted) {
          setProducts(prods);
          setCategories(cats);
          setIsLoading(false);
        }
      });
    };
    load();
    window.addEventListener("focus", load);
    return () => {
      mounted = false;
      window.removeEventListener("focus", load);
    };
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setNewPreviewUrl("");
    setNewPreviewType("image");
  };

  const handleEdit = (product) => {
    setForm({
      title: product.title,
      description: product.description || "",
      category_id: product.category_id || "",
      price: product.price,
      file_url: product.file_url || "",
      file_name: product.file_name || "",
      previews: product.previews || [],
      tags: product.tags || [],
      status: product.status || "active",
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const handleAddPreview = () => {
    if (!newPreviewUrl.trim()) return;
    setForm((p) => ({
      ...p,
      previews: [...p.previews, { type: newPreviewType, url: newPreviewUrl.trim() }],
    }));
    setNewPreviewUrl("");
  };

  const handleRemovePreview = (idx) => {
    setForm((p) => ({
      ...p,
      previews: p.previews.filter((_, i) => i !== idx),
    }));
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setUploadError("");
    try {
      const url = await uploadFile(file);
      setForm((p) => ({
        ...p,
        previews: [...p.previews, { type: "image", url }],
      }));
    } catch {
      setUploadError("Upload gagal. Pastikan file valid (maks 20MB).");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    if (isSaving) return;
    if (!form.title || !form.category_id || !form.price) {
      setSaveError("Lengkapi judul, kategori, dan harga produk.");
      return;
    }
    setSaveError("");
    setIsSaving(true);
    const payload = {
      title: form.title,
      description: form.description || null,
      category_id: form.category_id ? Number(form.category_id) : undefined,
      price: Number(form.price),
      file_url: form.file_url || null,
      file_name: form.file_name || null,
      previews: form.previews.length > 0 ? form.previews : null,
      tags: form.tags.length > 0 ? form.tags : null,
      status: form.status,
    };

    try {
      if (editingId) {
        const updated = await updateFreelancerProduct(editingId, payload);
        setProducts((prev) =>
          prev.map((p) =>
            p.id === editingId
              ? { ...p, title: updated.title, price: updated.price, status: updated.status }
              : p
          )
        );
      } else {
        const created = await addFreelancerProduct(payload);
        setProducts((prev) => [...prev, created]);
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
      await deleteFreelancerProduct(deleteTarget);
      setProducts((prev) => prev.filter((p) => p.id !== deleteTarget));
      setDeleteTarget(null);
    } catch {
      setSaveError("Gagal menghapus produk.");
      setDeleteTarget(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink">Produk Saya</h2>
          <p className="mt-1 text-sm text-ink/60">Kelola produk jadi yang bisa dibeli langsung.</p>
        </div>
        <Button
          size="sm"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          <Plus className="h-4 w-4" />
          Tambah Produk
        </Button>
      </div>

      {showForm && (
        <Card className="mt-4">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-ink/50">Judul Produk</label>
              <Input
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                placeholder="Contoh: Template Instagram Food & Beverage"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-ink/50">Deskripsi</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                placeholder="Deskripsi produk..."
                rows={3}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-ink/50">Kategori</label>
                <select
                  value={form.category_id}
                  onChange={(e) => setForm((p) => ({ ...p, category_id: e.target.value }))}
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                >
                  <option value="">Pilih kategori...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-ink/50">Harga (Rp)</label>
                <Input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
                  placeholder="50000"
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-medium text-ink/50">File URL (untuk download)</label>
                <Input
                  value={form.file_url}
                  onChange={(e) => setForm((p) => ({ ...p, file_url: e.target.value }))}
                  placeholder="https://drive.google.com/..."
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-ink/50">Nama File</label>
                <Input
                  value={form.file_name}
                  onChange={(e) => setForm((p) => ({ ...p, file_name: e.target.value }))}
                  placeholder="template-ig-fb.psd"
                  className="mt-1"
                />
              </div>
            </div>

            {/* Preview Media */}
            <div>
              <label className="text-xs font-medium text-ink/50">Preview (foto/video)</label>
              <div className="mt-2 flex gap-2">
                <select
                  value={newPreviewType}
                  onChange={(e) => setNewPreviewType(e.target.value)}
                  className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
                >
                  <option value="image">Gambar</option>
                  <option value="video">Video</option>
                </select>
                <Input
                  value={newPreviewUrl}
                  onChange={(e) => setNewPreviewUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1"
                />
                <Button size="sm" variant="outline" onClick={handleAddPreview}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex items-center gap-3">
                <input
                  id="product-file-upload"
                  type="file"
                  accept="image/*,video/*,.pdf"
                  className="hidden"
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                <label
                  htmlFor="product-file-upload"
                  className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-border/50"
                >
                  <UploadCloud className="h-4 w-4 text-primary" />
                  {isUploading ? "Mengupload..." : "Upload Gambar / Video"}
                </label>
                <span className="text-xs text-ink/40">atau tempel URL di kolom atas</span>
                {uploadError && <span className="text-xs text-red-500">{uploadError}</span>}
              </div>
              {form.previews.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.previews.map((pv, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-1 rounded-lg border border-border bg-surface px-2 py-1 text-xs"
                    >
                      {pv.type === "video" ? (
                        <Video className="h-3 w-3 text-blue-500" />
                      ) : (
                        <Image className="h-3 w-3 text-green-500" />
                      )}
                      <span className="max-w-[120px] truncate">{pv.url}</span>
                      <button
                        onClick={() => handleRemovePreview(idx)}
                        className="ml-1 rounded-full p-0.5 hover:bg-red-500/20"
                      >
                        <X className="h-3 w-3 text-red-400" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-ink/50">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                className="mt-1 rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              >
                <option value="active">Aktif</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2">
            {saveError && <span className="text-xs text-red-500">{saveError}</span>}
            <Button size="sm" onClick={handleSave} isLoading={isSaving}>
              {editingId ? "Update" : "Simpan"}
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={isSaving}
              onClick={() => {
                resetForm();
                setShowForm(false);
              }}
            >
              Batal
            </Button>
          </div>
        </Card>
      )}

      {/* Products List */}
      <div className="mt-6 space-y-3">
        {isLoading ? (
          <>
            <ProductSkeleton />
            <ProductSkeleton />
            <ProductSkeleton />
          </>
        ) : products.length === 0 ? (
          <Card className="py-12 text-center">
            <Package className="mx-auto h-8 w-8 text-ink/20" />
            <p className="mt-3 text-sm text-ink/50">Belum ada produk. Klik "Tambah Produk" untuk mulai.</p>
          </Card>
        ) : (
          products.map((prod) => (
            <Card key={prod.id} className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-primary/10">
                {prod.previews?.[0]?.type === "image" && prod.previews[0].url ? (
                  <img src={prod.previews[0].url} alt={prod.title} className="h-full w-full object-cover" />
                ) : prod.previews?.[0]?.type === "video" ? (
                  <Video className="h-5 w-5 text-primary" />
                ) : (
                  <Package className="h-5 w-5 text-primary" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-ink truncate">{prod.title}</p>
                  <Badge variant={prod.status === "active" ? "success" : "neutral"}>
                    {prod.status === "active" ? (
                      <><Eye className="inline h-3 w-3 mr-1" />Aktif</>
                    ) : (
                      <><EyeOff className="inline h-3 w-3 mr-1" />Draft</>
                    )}
                  </Badge>
                </div>
                <div className="mt-1 flex items-center gap-4 text-xs text-ink/50">
                  <span>{prod.category}</span>
                  <span>{prod.downloads ?? 0} download</span>
                  <span>{prod.previews?.length ?? 0} preview</span>
                </div>
              </div>
              <p className="text-sm font-semibold text-ink">{formatCurrency(prod.price)}</p>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isSaving || isDeleting} onClick={() => handleEdit(prod)}>
                  <Edit3 className="h-4 w-4 text-ink/50" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8" disabled={isDeleting} onClick={() => handleDelete(prod.id)}>
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      <Dialog isOpen={deleteTarget !== null} onClose={() => setDeleteTarget(null)} title="Hapus produk">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10">
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-sm text-ink/70">
            Yakin ingin menghapus produk ini? Tindakan ini tidak bisa dibatalkan.
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

export default MyProducts;
