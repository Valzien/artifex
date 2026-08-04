import { useState } from "react";
import { Mail, MapPin, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Card } from "@/components/ui/Card";
import { submitContact } from "@/services/api/contact";

const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@artifex.id",
  },
  {
    icon: Phone,
    label: "Telepon",
    value: "+62 812-3456-7890",
  },
  {
    icon: MapPin,
    label: "Alamat",
    value: "Jakarta, Indonesia",
  },
];

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await submitContact(form);
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setError(err.response?.data?.message ?? "Gagal mengirim pesan. Coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-semibold text-ink">Hubungi Kami</h1>
        <p className="mt-3 text-ink/60">
          Punya pertanyaan atau masukan? Kami siap membantu.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {/* Contact info */}
        <div className="space-y-4">
          {CONTACT_INFO.map((item) => (
            <Card key={item.label}>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                  <item.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-ink/50">{item.label}</p>
                  <p className="mt-0.5 text-sm font-medium text-ink">{item.value}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Contact form */}
        <div className="md:col-span-2">
          <Card>
            {submitted ? (
              <div className="flex flex-col items-center py-8 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/20">
                  <Send className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ink">
                  Pesan Terkirim!
                </h3>
                <p className="mt-2 text-sm text-ink/60">
                  Terima kasih telah menghubungi kami. Kami akan merespon
                  dalam 1×24 jam.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSubmitted(false)}
                >
                  Kirim Pesan Lain
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-ink">
                      Nama Lengkap
                    </label>
                    <Input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Nama kamu"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-ink">
                      Email
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="email@contoh.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Subjek
                  </label>
                  <Input
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Perihal pesan kamu"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-ink">
                    Pesan
                  </label>
                  <Textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tulis pesan kamu di sini..."
                    rows={5}
                    required
                  />
                </div>
                {error && (
                  <div className="rounded-lg bg-red-500/20 border border-red-500/40 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}
                <Button type="submit" className="w-full sm:w-auto" isLoading={submitting}>
                  <Send className="h-4 w-4" />
                  Kirim Pesan
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Contact;
