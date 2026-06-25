import { cn } from "@/lib/utils";
import type { SubscriptionPlan } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const planConfig: Record<
  SubscriptionPlan,
  { label: string; className: string }
> = {
  free: {
    label: "Free",
    className:
      "bg-muted text-muted-foreground border-border dark:bg-primary-100 dark:text-foreground dark:border-primary-200",
  },
  standard: {
    label: "Standard",
    className:
      "bg-primary-100 text-primary border-primary-200 dark:bg-primary-200 dark:text-primary-foreground dark:border-primary-300",
  },
  premium: {
    label: "Pro",
    className:
      "bg-warning/20 text-foreground border-warning/40 dark:bg-warning/15 dark:text-warning dark:border-warning/30",
  },
};

export function PlanBadge({ plan }: { plan: SubscriptionPlan }) {
  const config = planConfig[plan] ?? planConfig.free;
  return (
    <Badge
      className={cn("border font-medium capitalize", config.className)}
    >
      {config.label}
    </Badge>
  );
}
