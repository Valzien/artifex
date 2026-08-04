import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
  {
    variants: {
      variant: {
        primary: "bg-primary/10 text-primary",
        secondary: "bg-secondary/10 text-secondary",
        success: "bg-emerald-500/20 text-emerald-400",
        warning: "bg-amber-500/20 text-amber-400",
        danger: "bg-red-500/20 text-red-400",
        neutral: "bg-surface text-ink/70 border border-border",
      },
    },
    defaultVariants: {
      variant: "neutral",
    },
  },
);

function Badge({ className, variant, children, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
