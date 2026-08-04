import { useEffect, useState } from "react";
import {
  User,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Edit3,
  Check,
  X,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Skeleton } from "@/components/ui/Skeleton";
import { getProfile, updateProfile } from "@/services/api/profile";
import { formatCurrency, formatDate } from "@/constants/orderStatus";

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

function ClientProfile() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    getProfile().then((p) => {
      if (mounted) {
        setProfile(p);
        setForm({
          name: p.name,
          phone: p.phone,
          location: p.location,
          bio: p.bio,
        });
        setIsLoading(false);
      }
    });
    return () => (mounted = false);
  }, []);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    const updated = await updateProfile(form);
    setProfile(updated);
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleCancel = () => {
    setForm({
      name: profile.name,
      phone: profile.phone,
      location: profile.location,
      bio: profile.bio,
    });
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
            <div className="flex items-center gap-5 min-w-0">
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl font-semibold text-primary">
                {profile.name?.[0]?.toUpperCase() ?? "U"}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-ink">{profile.name}</h3>
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
            <Card className="text-center">
              <p className="text-2xl font-semibold text-ink">{profile.stats.totalOrders}</p>
              <p className="mt-1 text-xs text-ink/50">Total Pesanan</p>
            </Card>
            <Card className="text-center">
              <p className="text-2xl font-semibold text-amber-500">{profile.stats.activeOrders}</p>
              <p className="mt-1 text-xs text-ink/50">Aktif</p>
            </Card>
            <Card className="text-center">
              <p className="text-2xl font-semibold text-emerald-500">{profile.stats.completedOrders}</p>
              <p className="mt-1 text-xs text-ink/50">Selesai</p>
            </Card>
            <Card className="text-center">
              <p className="text-2xl font-semibold text-secondary">{formatCurrency(profile.stats.totalSpent)}</p>
              <p className="mt-1 text-xs text-ink/50">Total Pengeluaran</p>
            </Card>
          </div>

          {/* Form / Info */}
          <Card className="mt-6">
            <CardContent className="space-y-0 p-0">
              {isEditing ? (
                <div className="space-y-4">
                  <FieldEdit label="Nama" value={form.name} onChange={handleChange("name")} />
                  <FieldEdit label="Telepon" value={form.phone} onChange={handleChange("phone")} />
                  <FieldEdit label="Lokasi" value={form.location} onChange={handleChange("location")} />
                  <div>
                    <label className="block text-xs font-medium text-ink/50">Bio</label>
                    <Textarea
                      value={form.bio}
                      onChange={handleChange("bio")}
                      rows={3}
                      className="mt-1.5"
                    />
                  </div>
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
                  <FieldRow icon={Calendar} label="Member Sejak" value={formatDate(profile.memberSince)} />
                  <div className="border-t border-border pt-4">
                    <p className="text-xs font-medium text-ink/50">Bio</p>
                    <p className="mt-1 text-sm text-ink">{profile.bio}</p>
                  </div>
                  <div className="border-t border-border pt-4">
                    <p className="text-xs font-medium text-ink/50">Skill</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <Badge key={skill} variant="neutral">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

function FieldRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <Icon className="h-4 w-4 shrink-0 text-ink/40" />
      <div className="min-w-0">
        <p className="text-xs text-ink/50">{label}</p>
        <p className="text-sm text-ink truncate">{value}</p>
      </div>
    </div>
  );
}

function FieldEdit({ label, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-medium text-ink/50">{label}</label>
      <Input value={value} onChange={onChange} className="mt-1.5" />
    </div>
  );
}

export default ClientProfile;
