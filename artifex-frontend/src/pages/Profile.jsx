import { useEffect, useRef, useState } from "react";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Edit3,
  Check,
  X,
  Camera,
  Briefcase,
  Clock,
  Plus,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Skeleton } from "@/components/ui/Skeleton";
import { getProfile, updateProfile } from "@/services/api/profile";
import { uploadFile } from "@/services/api/upload";
import useAuthStore from "@/store/useAuthStore";
import { formatCurrency, formatDate } from "@/constants/orderStatus";

function isAvatarUrl(value) {
  return typeof value === "string" && /^(https?:\/\/|\/|data:)/.test(value);
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-6">
        <Skeleton className="h-20 w-20 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-56" />
        </div>
      </div>
      <Card>
        <div className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </Card>
    </div>
  );
}

function TagEditor({ value, onChange, placeholder }) {
  const [draft, setDraft] = useState("");

  const addTag = () => {
    const tag = draft.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setDraft("");
  };

  return (
    <div>
      <div className="mt-1.5 flex flex-wrap items-center gap-2">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
          >
            {tag}
            <button
              type="button"
              onClick={() => onChange(value.filter((t) => t !== tag))}
              className="rounded-full hover:bg-primary/20"
              aria-label={`Hapus ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <div className="flex min-w-[160px] flex-1 items-center gap-1 rounded-lg border border-border bg-surface px-2 py-1">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag();
              }
            }}
            placeholder={placeholder}
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-ink/40"
          />
          <button
            type="button"
            onClick={addTag}
            className="text-primary hover:bg-primary/10 rounded p-0.5"
            aria-label="Tambah tag"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function Profile() {
  const { user, fetchUser } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({});
  const fileInputRef = useRef(null);

  const isFreelancer = profile?.role === "freelancer";

  useEffect(() => {
    let mounted = true;
    getProfile()
      .then((p) => {
        if (!mounted) return;
        setProfile(p);
        setForm({
          name: p.name,
          phone: p.phone,
          location: p.location,
          bio: p.bio,
          avatar: p.avatar,
          specialty: p.specialty,
          responseTime: p.responseTime,
          skills: p.skills ?? [],
          languages: p.languages ?? [],
        });
        setIsLoading(false);
      })
      .catch(() => {
        if (mounted) setIsLoading(false);
      });
    return () => (mounted = false);
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setError("");
    try {
      const url = await uploadFile(file);
      setForm((prev) => ({ ...prev, avatar: url }));
    } catch {
      setError("Gagal mengupload foto profil");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError("");
    try {
      const updated = await updateProfile(form);
      setProfile(updated);
      setIsEditing(false);
      if (user) fetchUser();
    } catch {
      setError("Gagal menyimpan profil, coba lagi");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: profile.name,
      phone: profile.phone,
      location: profile.location,
      bio: profile.bio,
      avatar: profile.avatar,
      specialty: profile.specialty,
      responseTime: profile.responseTime,
      skills: profile.skills ?? [],
      languages: profile.languages ?? [],
    });
    setError("");
    setIsEditing(false);
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <h2 className="text-xl font-semibold text-ink">Profil Saya</h2>
      <p className="mt-1 text-sm text-ink/60">
        Kelola informasi profil kamu.
      </p>

      {isLoading ? (
        <div className="mt-6">
          <ProfileSkeleton />
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="mt-6 flex items-start justify-between">
            <div className="flex min-w-0 items-center gap-5">
              <div className="relative shrink-0">
                <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-2xl font-semibold text-primary">
                  {isAvatarUrl(profile.avatar) ? (
                    <img
                      src={profile.avatar}
                      alt={profile.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    profile.name?.[0]?.toUpperCase() ?? "U"
                  )}
                </div>
                {isEditing && (
                  <>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-surface text-primary shadow-sm hover:bg-surface/80 disabled:opacity-50"
                      aria-label="Ubah foto profil"
                    >
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="truncate text-lg font-semibold text-ink">
                    {profile.name}
                  </h3>
                  <Badge variant={isFreelancer ? "primary" : "secondary"}>
                    {isFreelancer ? "Freelancer" : "Klien"}
                  </Badge>
                </div>
                <p className="text-sm text-ink/50">{profile.email}</p>
                <p className="mt-1 text-xs text-ink/40">
                  Member sejak {formatDate(profile.memberSince)}
                </p>
              </div>
            </div>
            {!isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {isFreelancer ? (
              <>
                <StatCard
                  value={profile.stats.totalServices}
                  label="Jasa"
                  className="text-ink"
                />
                <StatCard
                  value={profile.stats.totalPortfolio}
                  label="Portfolio"
                  className="text-ink"
                />
                <StatCard
                  value={profile.stats.activeOrders}
                  label="Order Aktif"
                  className="text-amber-500"
                />
                <StatCard
                  value={profile.stats.rating ? `${profile.stats.rating}★` : "0★"}
                  label={`${profile.stats.reviews} ulasan`}
                  className="text-amber-500"
                />
              </>
            ) : (
              <>
                <StatCard
                  value={profile.stats.totalOrders}
                  label="Total Pesanan"
                  className="text-ink"
                />
                <StatCard
                  value={profile.stats.activeOrders}
                  label="Aktif"
                  className="text-amber-500"
                />
                <StatCard
                  value={profile.stats.completedOrders}
                  label="Selesai"
                  className="text-emerald-500"
                />
                <StatCard
                  value={formatCurrency(profile.stats.totalSpent)}
                  label="Total Pengeluaran"
                  className="text-secondary"
                />
              </>
            )}
          </div>

          {/* Form / Info */}
          <Card className="mt-6">
            <CardContent className="space-y-0 p-0">
              {isEditing ? (
                <div className="space-y-4">
                  <FieldEdit label="Nama" value={form.name} onChange={handleChange("name")} />
                  <FieldEdit label="Telepon" value={form.phone} onChange={handleChange("phone")} />
                  <FieldEdit label="Lokasi" value={form.location} onChange={handleChange("location")} />
                  {isFreelancer && (
                    <>
                      <FieldEdit label="Spesialisasi" value={form.specialty} onChange={handleChange("specialty")} />
                      <FieldEdit
                        label="Waktu Respons"
                        placeholder="cth: dalam 1 hari"
                        value={form.responseTime}
                        onChange={handleChange("responseTime")}
                      />
                    </>
                  )}
                  <div>
                    <label className="block text-xs font-medium text-ink/50">Bio</label>
                    <Textarea
                      value={form.bio}
                      onChange={handleChange("bio")}
                      rows={3}
                      className="mt-1.5"
                    />
                  </div>
                  {isFreelancer && (
                    <>
                      <div>
                        <label className="block text-xs font-medium text-ink/50">Keahlian</label>
                        <TagEditor
                          value={form.skills}
                          onChange={(skills) => setForm((prev) => ({ ...prev, skills }))}
                          placeholder="Tambah keahlian..."
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-ink/50">Bahasa</label>
                        <TagEditor
                          value={form.languages}
                          onChange={(languages) => setForm((prev) => ({ ...prev, languages }))}
                          placeholder="Tambah bahasa..."
                        />
                      </div>
                    </>
                  )}
                  {error && (
                    <p className="text-sm text-red-500">{error}</p>
                  )}
                  <div className="flex items-center gap-3 border-t border-border pt-4">
                    <Button size="sm" onClick={handleSave} isLoading={isSaving}>
                      <Check className="h-4 w-4" />
                      Simpan
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancel}>
                      <X className="h-4 w-4" />
                      Batal
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <FieldRow icon={User} label="Nama" value={profile.name} />
                  <FieldRow icon={Mail} label="Email" value={profile.email} />
                  <FieldRow icon={Phone} label="Telepon" value={profile.phone} />
                  <FieldRow icon={MapPin} label="Lokasi" value={profile.location} />
                  {isFreelancer && (
                    <>
                      <FieldRow icon={Briefcase} label="Spesialisasi" value={profile.specialty} />
                      <FieldRow icon={Clock} label="Waktu Respons" value={profile.responseTime} />
                    </>
                  )}
                  <FieldRow icon={Calendar} label="Member Sejak" value={formatDate(profile.memberSince)} />
                  <div className="border-t border-border pt-4">
                    <p className="text-xs font-medium text-ink/50">Bio</p>
                    <p className="mt-1 text-sm text-ink">{profile.bio || "—"}</p>
                  </div>
                  {isFreelancer && (
                    <>
                      <div className="border-t border-border pt-4">
                        <p className="text-xs font-medium text-ink/50">Keahlian</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {profile.skills?.length ? (
                            profile.skills.map((skill) => (
                              <Badge key={skill} variant="neutral">{skill}</Badge>
                            ))
                          ) : (
                            <p className="text-sm text-ink/40">—</p>
                          )}
                        </div>
                      </div>
                      <div className="border-t border-border pt-4">
                        <p className="text-xs font-medium text-ink/50">Bahasa</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {profile.languages?.length ? (
                            profile.languages.map((lang) => (
                              <Badge key={lang} variant="neutral">{lang}</Badge>
                            ))
                          ) : (
                            <p className="text-sm text-ink/40">—</p>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function StatCard({ value, label, className }) {
  return (
    <Card className="text-center">
      <p className={`text-2xl font-semibold ${className}`}>{value}</p>
      <p className="mt-1 text-xs text-ink/50">{label}</p>
    </Card>
  );
}

function FieldRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 shrink-0 text-ink/40" />
      <div className="min-w-0">
        <p className="text-xs text-ink/50">{label}</p>
        <p className="truncate text-sm text-ink">{value || "—"}</p>
      </div>
    </div>
  );
}

function FieldEdit({ label, placeholder, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink/50">{label}</label>
      <Input
        value={value}
        placeholder={placeholder}
        onChange={onChange}
        className="mt-1.5"
      />
    </div>
  );
}

export default Profile;
