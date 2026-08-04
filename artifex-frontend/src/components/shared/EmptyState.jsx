import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Link } from "react-router-dom";

export function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon className="h-10 w-10 text-ink/20" />
      <p className="mt-3 text-sm font-medium text-ink">{title}</p>
      {description && (
        <p className="mt-1 text-xs text-ink/50">{description}</p>
      )}
      {action && (
        <Button asChild variant="outline" size="sm" className="mt-4">
          {action.to ? <Link to={action.to}>{action.label}</Link> : <button onClick={action.onClick}>{action.label}</button>}
        </Button>
      )}
    </div>
  );
}
