import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getAdminCategories, createCategory, updateCategory, deleteCategory } from "@/services/api/adminCategories";
import { useForm } from "react-hook-form";

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // { mode: "create" } | { mode: "edit", category }

  const load = () => {
    getAdminCategories({ search: search || undefined })
      .then((res) => setCategories(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, [search]);

  const handleDelete = async (id) => {
    if (!confirm("Hapus kategori ini?")) return;
    await deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kategori..."
            className="w-full border border-border bg-surface rounded-xl py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink/40 outline-none focus:border-primary"
          />
        </div>
        <Button size="sm" onClick={() => setModal({ mode: "create" })}>
          <Plus className="h-4 w-4" /> Tambah Kategori
        </Button>
      </div>

      {modal && (
        <CategoryModal
          category={modal.mode === "edit" ? modal.category : null}
          onClose={() => setModal(null)}
          onSaved={(saved) => {
            if (modal.mode === "edit") {
              setCategories((prev) => prev.map((c) => (c.id === saved.id ? saved : c)));
            } else {
              setCategories((prev) => [...prev, saved]);
            }
            setModal(null);
          }}
        />
      )}

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/50 bg-surface">
              <th className="px-4 py-3 font-medium">Kategori</th>
              <th className="px-4 py-3 font-medium">Slug</th>
              <th className="px-4 py-3 font-medium">Deskripsi</th>
              <th className="px-4 py-3 font-medium">Layanan</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-ink/40">Loading...</td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-ink/40">Belum ada kategori</td></tr>
            ) : categories.map((cat) => (
              <tr key={cat.id} className="border-t border-border/60 hover:bg-surface">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{cat.icon}</span>
                    <span className="font-medium text-ink">{cat.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink/60">{cat.slug}</td>
                <td className="px-4 py-3 text-ink/60 max-w-[280px] truncate">{cat.description}</td>
                <td className="px-4 py-3">{cat.serviceCount}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setModal({ mode: "edit", category: cat })} className="text-primary hover:underline text-xs">Edit</button>
                    <button onClick={() => handleDelete(cat.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoryModal({ category, onClose, onSaved }) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
      icon: category?.icon ?? "🎨",
    },
  });

  const onSubmit = async (values) => {
    const saved = category
      ? await updateCategory(category.id, values)
      : await createCategory(values);
    onSaved(saved);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-surface rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-ink mb-4">{category ? "Edit Kategori" : "Tambah Kategori"}</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input {...register("name")} className="w-full border border-border bg-surface rounded-xl px-3 py-2 text-sm text-ink" placeholder="Nama (contoh: Graphic Design)" />
          <input {...register("slug")} className="w-full border border-border bg-surface rounded-xl px-3 py-2 text-sm text-ink" placeholder="Slug (contoh: graphic-design)" />
          <textarea {...register("description")} rows={3} className="w-full border border-border bg-surface rounded-xl px-3 py-2 text-sm text-ink" placeholder="Deskripsi" />
          <input {...register("icon")} className="w-full border border-border bg-surface rounded-xl px-3 py-2 text-sm text-ink" placeholder="Icon (emoji)" />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-ink/60 hover:bg-surface rounded-xl">Cancel</button>
            <Button type="submit" size="sm">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminCategories;
