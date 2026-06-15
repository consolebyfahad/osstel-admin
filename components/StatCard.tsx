import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value?: number | null;
  icon: LucideIcon;
  description?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  icon: Icon,
  description,
  className,
}: StatCardProps) {
  const displayValue = Number(value ?? 0);

  return (
    <div
      className={cn(
        "group glass-card rounded-2xl p-6 transition-all duration-300 hover:scale-[1.01] hover:shadow-lg",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-foreground">
            {displayValue.toLocaleString()}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div className="glass-icon-bubble flex h-11 w-11 items-center justify-center rounded-2xl text-primary transition-transform duration-300 group-hover:scale-105">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
