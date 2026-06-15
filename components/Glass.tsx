import { cn } from "@/lib/utils";

type GlassVariant = "default" | "strong" | "card" | "bubble" | "input";

const variantClass: Record<GlassVariant, string> = {
  default: "glass rounded-2xl",
  strong: "glass-strong rounded-2xl",
  card: "glass-card rounded-2xl",
  bubble: "glass-bubble rounded-xl",
  input: "glass-input rounded-xl",
};

interface GlassProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: GlassVariant;
}

export function Glass({
  variant = "default",
  className,
  children,
  ...props
}: GlassProps) {
  return (
    <div className={cn(variantClass[variant], className)} {...props}>
      {children}
    </div>
  );
}
