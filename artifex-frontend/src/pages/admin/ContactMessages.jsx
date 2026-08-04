import { useEffect, useState } from "react";
import { Mail, MailOpen, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  getAdminContactMessages,
  markContactRead,
  deleteContactMessage,
} from "@/services/api/adminContactMessages";

function AdminContactMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    getAdminContactMessages(filter || undefined).then((res) => {
      if (mounted) {
        setMessages(res.data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, [filter]);

  const handleMarkRead = async (id) => {
    const res = await markContactRead(id);
    setMessages((prev) => prev.map((m) => (m.id === id ? res.data : m)));
  };

  const handleDelete = async (id) => {
    if (!confirm("Hapus pesan ini?")) return;
    await deleteContactMessage(id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setSelected(null);
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-ink/60">Pesan dari form kontak.</p>
        <div className="flex gap-2">
          <Button size="sm" variant={filter === "" ? "primary" : "outline"} onClick={() => setFilter("")}>Semua</Button>
          <Button size="sm" variant={filter === "unread" ? "primary" : "outline"} onClick={() => setFilter("unread")}>Belum Dibaca</Button>
        </div>
      </div>

      {loading ? (
        <p className="py-8 text-center text-ink/40">Loading...</p>
      ) : messages.length === 0 ? (
        <p className="py-8 text-center text-ink/40">Belum ada pesan</p>
      ) : (
        <div className="bg-surface rounded-2xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/50 bg-surface">
                <th className="px-4 py-3 font-medium">Pengirim</th>
                <th className="px-4 py-3 font-medium">Subjek</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr
                  key={m.id}
                  className={`border-t border-border/60 hover:bg-surface cursor-pointer ${m.read ? "" : "font-medium"}`}
                  onClick={() => setSelected(m)}
                >
                  <td className="px-4 py-3 text-ink max-w-[200px]">
                    <div className="truncate">{m.name}</div>
                    <div className="text-xs text-ink/50 truncate">{m.email}</div>
                  </td>
                  <td className="px-4 py-3 text-ink/70 max-w-[260px] truncate">{m.subject}</td>
                  <td className="px-4 py-3 text-ink/60 whitespace-nowrap">{new Date(m.createdAt).toLocaleString("id-ID")}</td>
                  <td className="px-4 py-3">
                    {m.read ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-300"><MailOpen className="h-3 w-3" /> Dibaca</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-300"><Mail className="h-3 w-3" /> Baru</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {!m.read && (
                        <button onClick={(e) => { e.stopPropagation(); handleMarkRead(m.id); }} className="text-primary hover:underline text-xs">Tandai dibaca</button>
                      )}
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(m.id); }} className="text-red-500 hover:underline text-xs">Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50" onClick={() => setSelected(null)}>
          <div className="bg-surface rounded-2xl p-6 w-full max-w-lg shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold text-ink">{selected.subject}</h3>
                <p className="mt-1 text-sm text-ink/60">{selected.name} &lt;{selected.email}&gt;</p>
              </div>
              <Button variant="danger" size="sm" onClick={() => handleDelete(selected.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <p className="mt-4 text-sm text-ink/80 whitespace-pre-wrap max-h-72 overflow-y-auto">{selected.message}</p>
            <div className="flex justify-end pt-4">
              {!selected.read && (
                <Button size="sm" onClick={() => { handleMarkRead(selected.id); setSelected((prev) => (prev ? { ...prev, read: true } : prev)); }}>
                  Tandai dibaca
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminContactMessages;
