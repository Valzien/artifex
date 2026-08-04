import { Card } from "@/components/ui/Card";

export function StatCard({ icon: Icon, label, value, color, variant = "flex" }) {
  if (variant === "inline") {
    return (
      <Card>
        <Icon className={`h-5 w-5 ${color}`} />
        <p className="mt-2 text-xs text-ink/50">{label}</p>
        <p className="text-lg font-semibold text-ink">{value}</p>
      </Card>
    );
  }

  return (
    <Card className="flex items-start gap-4">
      <div className={`rounded-lg bg-surface p-2.5 ${color}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-xs text-ink/50">{label}</p>
        <p className="mt-0.5 text-xl font-semibold text-ink">{value}</p>
      </div>
    </Card>
  );
}
