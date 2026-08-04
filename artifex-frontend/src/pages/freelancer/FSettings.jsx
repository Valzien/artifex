import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Shield, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { updatePassword, deleteAccount } from "@/services/api/freelancerSettings";
import useAuthStore from "@/store/useAuthStore";

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Password saat ini wajib diisi"),
    password: z
      .string()
      .min(8, "Password baru minimal 8 karakter")
      .regex(/[A-Z]/, "Harus mengandung huruf besar")
      .regex(/[0-9]/, "Harus mengandung angka"),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Password tidak cocok",
    path: ["password_confirmation"],
  });

function FSettings() {
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saved, setSaved] = useState(false);
  const [apiError, setApiError] = useState("");
  const { logout } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({ resolver: zodResolver(passwordSchema) });

  const onSubmit = async (values) => {
    setApiError("");
    try {
      await updatePassword(values);
      setSaved(true);
      reset();
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      setApiError(err.response?.data?.message ?? "Terjadi kesalahan");
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Apakah kamu yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.")) return;
    try {
      await deleteAccount();
      logout();
      window.location.href = "/";
    } catch (err) {
      setApiError(err.response?.data?.message ?? "Gagal menghapus akun");
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-xl font-semibold text-ink">Pengaturan</h2>
      <p className="mt-1 text-sm text-ink/60">Kelola keamanan akun kamu.</p>

      <Card className="mt-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="rounded-lg bg-primary/10 p-2 text-primary"><Shield className="h-5 w-5" /></div>
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-ink">Ubah Password</h3>
            <p className="text-xs text-ink/50">Pastikan kamu menggunakan password yang kuat</p>
          </div>
        </div>
        <CardContent>
          {saved && (
            <div className="mb-4 rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-4 py-3 text-sm text-emerald-300">
              Password berhasil diubah!
            </div>
          )}
          {apiError && (
            <div className="mb-4 rounded-lg bg-red-500/20 border border-red-500/40 px-4 py-3 text-sm text-red-300">
              {apiError}
            </div>
          )}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Password Saat Ini</label>
              <div className="relative">
                <Input type={showCurrent ? "text" : "password"} placeholder="Masukkan password saat ini" {...register("current_password")} error={errors.current_password} />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink">
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.current_password && <p className="mt-1 text-xs text-red-500">{errors.current_password.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Password Baru</label>
              <div className="relative">
                <Input type={showNew ? "text" : "password"} placeholder="Minimal 8 karakter" {...register("password")} error={errors.password} />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink">
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Konfirmasi Password Baru</label>
              <Input type="password" placeholder="Ulangi password baru" {...register("password_confirmation")} error={errors.password_confirmation} />
              {errors.password_confirmation && <p className="mt-1 text-xs text-red-500">{errors.password_confirmation.message}</p>}
            </div>
            <Button type="submit" isLoading={isSubmitting}>Simpan Perubahan</Button>
          </form>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="mt-6 border-red-500/40">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-semibold text-red-400">Hapus Akun</h3>
            <p className="mt-1 text-sm text-ink/50">
              Menghapus akun akan menghapus semua data secara permanen.
            </p>
          </div>
          <Button variant="danger" size="sm" onClick={handleDeleteAccount}>
            <Trash2 className="h-4 w-4 mr-1" />
            Hapus Akun
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default FSettings;
