import { useEffect, useState } from "react";
import { getUsers, updateUser, deleteUser } from "@/services/api/adminUsers";
import { useForm } from "react-hook-form";
import { formatDate } from "@/constants/orderStatus";

function AdminFreelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);

  const load = () => {
    getUsers({ role: "freelancer" }).then((res) => {
      setFreelancers(res.data);
      setLoading(false);
    });
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (id) => {
    if (!confirm("Hapus freelancer ini?")) return;
    await deleteUser(id);
    setFreelancers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="p-6 space-y-4">
      {editing && (
        <EditModal
          user={editing}
          onClose={() => setEditing(null)}
          onSaved={(updated) => {
            setFreelancers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
            setEditing(null);
          }}
        />
      )}

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/50 bg-surface">
              <th className="px-4 py-3 font-medium">Freelancer</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Spesialisasi</th>
              <th className="px-4 py-3 font-medium">Layanan</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Bergabung</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-ink/40">Loading...</td></tr>
            ) : freelancers.length === 0 ? (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-ink/40">Belum ada freelancer</td></tr>
            ) : freelancers.map((u) => (
              <tr key={u.id} className="border-t border-border/60 hover:bg-surface">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <img src={u.avatar || "/avatar.jpg"} className="w-8 h-8 rounded-full object-cover" alt="" />
                    <span className="font-medium text-ink">{u.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink/60">{u.email}</td>
                <td className="px-4 py-3 text-ink/60">{u.specialty ?? "-"}</td>
                <td className="px-4 py-3">{u.servicesCount}</td>
                <td className="px-4 py-3">{u.freelancerOrdersCount ?? 0}</td>
                <td className="px-4 py-3 text-ink/60">{formatDate(u.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setEditing(u)} className="text-primary hover:underline text-xs">Edit</button>
                    <button onClick={() => handleDelete(u.id)} className="text-red-500 hover:underline text-xs">Delete</button>
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

function EditModal({ user, onClose, onSaved }) {
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
      location: user.location ?? "",
      specialty: user.specialty ?? "",
      bio: user.bio ?? "",
    },
  });

  const onSubmit = async (values) => {
    const updated = await updateUser(user.id, values);
    onSaved(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-surface rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-ink mb-4">Edit Freelancer</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input {...register("name")} className="w-full border border-border bg-surface rounded-xl px-3 py-2 text-sm text-ink" placeholder="Nama" />
          <input {...register("email")} className="w-full border border-border bg-surface rounded-xl px-3 py-2 text-sm text-ink" placeholder="Email" />
          <input {...register("phone")} className="w-full border border-border bg-surface rounded-xl px-3 py-2 text-sm text-ink" placeholder="Phone" />
          <input {...register("location")} className="w-full border border-border bg-surface rounded-xl px-3 py-2 text-sm text-ink" placeholder="Lokasi" />
          <input {...register("specialty")} className="w-full border border-border bg-surface rounded-xl px-3 py-2 text-sm text-ink" placeholder="Spesialisasi" />
          <textarea {...register("bio")} rows={3} className="w-full border border-border bg-surface rounded-xl px-3 py-2 text-sm text-ink" placeholder="Bio" />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-ink/60 hover:bg-surface rounded-xl">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-xl">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminFreelancers;
