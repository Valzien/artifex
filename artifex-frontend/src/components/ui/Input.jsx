import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Input = forwardRef(
  ({ className, type = "text", error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "h-11 w-full rounded-lg border bg-surface px-4 text-sm text-ink transition-colors placeholder:text-ink/40",
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
  },
);

Input.displayName = "Input";

export { Input };
