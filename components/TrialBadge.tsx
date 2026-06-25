import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface TrialBadgeProps {
  daysRemaining?: number;
  compact?: boolean;
  className?: string;
}

export function TrialBadge({
  daysRemaining,
  compact = false,
  className,
}: TrialBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-warning/40 bg-warning/15 px-2 py-0.5 text-xs font-semibold text-foreground",
        className
      )}
      title={
        daysRemaining != null
          ? `Pro trial · ${daysRemaining} day${daysRemaining === 1 ? "" : "s"} left`
          : "Pro trial active"
      }
    >
      <Sparkles className="h-3 w-3 shrink-0 text-warning" />
      {!compact && (
        <span>
          Pro trial
          {daysRemaining != null ? ` · ${daysRemaining}d` : ""}
        </span>
      )}
    </span>
  );
}
