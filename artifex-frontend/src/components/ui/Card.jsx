import { cn } from "@/lib/utils";

function Card({ className, children, ...props }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface p-6 shadow-card",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn("mb-4 flex flex-col gap-1", className)} {...props}>
      {children}
    </div>
  );
}

function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn("text-lg font-semibold text-ink", className)}
      {...props}
    >
      {children}
    </h3>
  );
}

function CardDescription({ className, children, ...props }) {
  return (
    <p className={cn("text-sm text-ink/60", className)} {...props}>
      {children}
    </p>
  );
}

function CardContent({ className, children, ...props }) {
  return (
    <div className={cn("text-sm text-ink/80", className)} {...props}>
      {children}
    </div>
  );
}

function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn("mt-4 flex items-center gap-3", className)} {...props}>
      {children}
    </div>
  );
}

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};
