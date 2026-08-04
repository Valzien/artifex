import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Textarea = forwardRef(({ className, error, rows = 4, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "w-full resize-none rounded-lg border bg-surface px-4 py-3 text-sm text-ink transition-colors placeholder:text-ink/40",
        "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/40",
        "disabled:cursor-not-allowed disabled:bg-surface disabled:opacity-60",
        error
          ? "border-red-400 focus:border-red-400 focus:ring-red-300"
          : "border-border",
        className,
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";

export { Textarea };
