import { useEffect, useState } from "react";
import { getUsers, updateUser, deleteUser } from "@/services/api/adminUsers";
import { useForm } from "react-hook-form";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState("");
  const [meta, setMeta] = useState(null);
  const [page, setPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);

  useEffect(() => {
    let mounted = true;
    getUsers({ role: roleFilter || undefined }).then((res) => {
      if (mounted) {
        setUsers(res.data);
        setMeta(res.meta);
        setPage(1);
      }
    }).finally(() => {
      if (mounted) setLoading(false);
    });
    return () => { mounted = false; };
  }, [roleFilter]);

  const handleDelete = async (id) => {
    if (!confirm("Delete this user?")) return;
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-border bg-surface rounded-xl px-3 py-2 text-sm text-ink"
        >
          <option value="">All Roles</option>
          <option value="client">Client</option>
          <option value="freelancer">Freelancer</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {editingUser && <EditModal user={editingUser} onClose={() => setEditingUser(null)} onSave={(updated) => {
        setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
        setEditingUser(null);
      }} />}

      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/50 bg-surface">
              <th className="px-4 py-3 font-medium">User</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Services</th>
              <th className="px-4 py-3 font-medium">Orders</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-ink/40">Loading...</td></tr>
            ) : users.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-ink/40">No users found</td></tr>
            ) : users.map((user) => (
              <tr key={user.id} className="border-t border-border/60 hover:bg-surface">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <img src={user.avatar || "/avatar.jpg"} className="w-8 h-8 rounded-full object-cover" alt="" />
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink/60">{user.email}</td>
                <td className="px-4 py-3">
                  <RoleBadge role={user.role} />
                </td>
                <td className="px-4 py-3">{user.servicesCount}</td>
                <td className="px-4 py-3">{(user.clientOrdersCount ?? 0) + (user.freelancerOrdersCount ?? 0)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setEditingUser(user)} className="text-primary hover:underline text-xs">Edit</button>
                    <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:underline text-xs">Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {meta && meta.lastPage > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: meta.lastPage }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => {
                setLoading(true);
                getUsers({ role: roleFilter || undefined }).then((res) => {
                  setUsers(res.data);
                  setMeta(res.meta);
                  setPage(i + 1);
                }).finally(() => setLoading(false));
              }}
              className={`px-3 py-1 rounded-lg text-sm ${page === i + 1 ? "bg-primary text-primary-foreground" : "bg-surface text-ink/60"}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function EditModal({ user, onClose, onSave }) {
  const { register, handleSubmit } = useForm({
    defaultValues: { name: user.name, email: user.email, role: user.role, phone: user.phone ?? "", location: user.location ?? "", specialty: user.specialty ?? "" },
  });

  const onSubmit = async (values) => {
    const updated = await updateUser(user.id, values);
    onSave(updated);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-surface rounded-2xl p-6 w-full max-w-md shadow-xl" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-bold text-ink mb-4">Edit User</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <input {...register("name")} className="w-full border border-border bg-surface rounded-xl px-3 py-2 text-sm text-ink" placeholder="Name" />
          <input {...register("email")} className="w-full border border-border bg-surface rounded-xl px-3 py-2 text-sm text-ink" placeholder="Email" />
          <select {...register("role")} className="w-full border border-border bg-surface rounded-xl px-3 py-2 text-sm text-ink">
            <option value="client">Client</option>
            <option value="freelancer">Freelancer</option>
            <option value="admin">Admin</option>
          </select>
          <input {...register("phone")} className="w-full border border-border bg-surface rounded-xl px-3 py-2 text-sm text-ink" placeholder="Phone" />
          <input {...register("location")} className="w-full border border-border bg-surface rounded-xl px-3 py-2 text-sm text-ink" placeholder="Location" />
          <input {...register("specialty")} className="w-full border border-border bg-surface rounded-xl px-3 py-2 text-sm text-ink" placeholder="Specialty" />
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-ink/60 hover:bg-surface rounded-xl">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-xl">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RoleBadge({ role }) {
  const map = {
    client: "bg-blue-500/20 text-blue-400",
    freelancer: "bg-emerald-500/20 text-emerald-400",
    admin: "bg-rose-500/20 text-rose-400",
  };
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${map[role] ?? "bg-surface text-ink/60"}`}>
      {role}
    </span>
  );
}

export default AdminUsers;
