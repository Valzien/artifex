import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import useAuthStore from "@/store/useAuthStore";

const registerSchema = z
  .object({
    name: z.string().min(2, "Nama minimal 2 karakter").max(50, "Nama maksimal 50 karakter"),
    email: z.string().email("Format email tidak valid"),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter")
      .regex(/[A-Z]/, "Password harus mengandung huruf besar")
      .regex(/[0-9]/, "Password harus mengandung angka"),
    confirmPassword: z.string(),
    role: z.enum(["client", "freelancer"], {
      required_error: "Pilih role kamu",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

function Register() {
  const navigate = useNavigate();
  const registerUser = useAuthStore((state) => state.register);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "client",
    },
  });

  const onSubmit = async (data) => {
    setError("");
    try {
      const user = await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        password_confirmation: data.confirmPassword,
        role: data.role,
      });
      navigate(`/${user.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mendaftar. Coba lagi.");
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md items-center px-4 py-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Daftar Akun Baru</CardTitle>
          <CardDescription>
            Buat akun Artifex dan mulai jelajahi layanan kami
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-500/20 p-3 text-sm text-red-300">
                {error}
              </div>
            )}

            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Nama Lengkap</label>
              <Input placeholder="Nama lengkap kamu" {...register("name")} error={errors.name} />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Email</label>
              <Input type="email" placeholder="email@contoh.com" {...register("email")} error={errors.email} />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 8 karakter"
                  {...register("password")}
                  error={errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-ink">Konfirmasi Password</label>
              <Input type="password" placeholder="Ulangi password" {...register("confirmPassword")} error={errors.confirmPassword} />
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-ink">Saya ingin menjadi</label>
              <div className="flex gap-3">
                <label className="flex-1 cursor-pointer">
                  <input type="radio" value="client" {...register("role")} className="peer sr-only" />
                  <div className="rounded-xl border border-border p-3 text-center transition-colors peer-checked:border-primary peer-checked:bg-primary/5">
                    <p className="text-sm font-medium text-ink">Klien</p>
                    <p className="mt-0.5 text-xs text-ink/50">Cari jasa freelancer</p>
                  </div>
                </label>
                <label className="flex-1 cursor-pointer">
                  <input type="radio" value="freelancer" {...register("role")} className="peer sr-only" />
                  <div className="rounded-xl border border-border p-3 text-center transition-colors peer-checked:border-primary peer-checked:bg-primary/5">
                    <p className="text-sm font-medium text-ink">Freelancer</p>
                    <p className="mt-0.5 text-xs text-ink/50">Jual jasa kamu</p>
                  </div>
                </label>
              </div>
              {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
            </div>

            <Button type="submit" className="w-full" isLoading={isSubmitting}>
              Daftar
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink/60">
            Sudah punya akun?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Masuk
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default Register;
