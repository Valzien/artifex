import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { getAdminFaqs, createFaq, updateFaq, deleteFaq } from "@/services/api/adminFaqs";
import { useForm } from "react-hook-form";

function AdminFaqs() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    let mounted = true;
    getAdminFaqs().then((res) => {
      if (mounted) {
        setFaqs(res.data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Hapus FAQ ini?")) return;
    await deleteFaq(id);
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  const grouped = faqs.reduce((acc, f) => {
    (acc[f.category] = acc[f.category] || []).push(f);
    return acc;
  }, {});

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink/60">Kelola pertanyaan yang sering diajukan.</p>
        <Button size="sm" onClick={() => setModal({ mode: "create" })}>
          <Plus className="h-4 w-4" /> Tambah FAQ
        </Button>
      </div>

      {modal && (
        <FaqModal
          faq={modal.mode === "edit" ? modal.faq : null}
          onClose={() => setModal(null)}
          onSaved={(saved) => {
            if (modal.mode === "edit") {
              setFaqs((prev) => prev.map((f) => (f.id === saved.id ? saved : f)));
            } else {
              setFaqs((prev) => [...prev, saved]);
            }
            setModal(null);
          }}
        />
      )}

      {loading ? (
        <p className="py-8 text-center text-ink/40">Loading...</p>
      ) : faqs.length === 0 ? (
        <p className="py-8 text-center text-ink/40">Belum ada FAQ</p>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <h3 className="mb-2 text-sm font-semibold text-ink/70">{category}</h3>
              <div className="bg-surface rounded-2xl border border-border overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-ink/50 bg-surface">
                      <th className="px-4 py-3 font-medium">Pertanyaan</th>
                      <th className="px-4 py-3 font-medium">Jawaban</th>
                      <th className="px-4 py-3 font-medium">Urutan</th>
                      <th className="px-4 py-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((f) => (
                      <tr key={f.id} className="border-t border-border/60 hover:bg-surface">
                        <td className="px-4 py-3 font-medium text-ink max-w-[280px]">{f.question}</td>
                        <td className="px-4 py-3 text-ink/60 max-w-[360px] line-clamp-2">{f.answer}</td>
                        <td className="px-4 py-3 text-ink/60">{f.sortOrder}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button onClick={() => setModal({ mode: "edit", faq: f })} className="text-primary hover:underline text-xs">Edit</button>
                            <button onClick={() => handleDelete(f.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function FaqModal({ faq, onClose, onSaved }) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      category: faq?.category ?? "Umum",
      question: faq?.question ?? "",
      answer: faq?.answer ?? "",
      sortOrder: faq?.sortOrder ?? 0,
    },
  });

  const onSubmit = async (values) => {
    const saved = faq
      ? await updateFaq(faq.id, values)
      : await createFaq(values);
    onSaved(saved);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-surface rounded-2xl p-6 w-full max-w-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-ink mb-4">{faq ? "Edit FAQ" : "Tambah FAQ"}</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input {...register("category")} className="w-full border border-border bg-surface rounded-xl px-3 py-2 text-sm text-ink" placeholder="Kategori (Umum, Untuk Klien, Untuk Freelancer)" />
          <input {...register("question")} className="w-full border border-border bg-surface rounded-xl px-3 py-2 text-sm text-ink" placeholder="Pertanyaan" />
          <textarea {...register("answer")} rows={4} className="w-full border border-border bg-surface rounded-xl px-3 py-2 text-sm text-ink" placeholder="Jawaban" />
          <input type="number" {...register("sortOrder")} className="w-full border border-border bg-surface rounded-xl px-3 py-2 text-sm text-ink" placeholder="Urutan (angka)" />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-ink/60 hover:bg-surface rounded-xl">Cancel</button>
            <Button type="submit" size="sm">Save</Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminFaqs;
