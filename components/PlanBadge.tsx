import { cn } from "@/lib/utils";
import type { SubscriptionPlan } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const planConfig: Record<
  SubscriptionPlan,
  { label: string; className: string }
> = {
  free: {
    label: "Free",
    className: "bg-gray-100 text-gray-700 border-gray-200",
  },
  standard: {
    label: "Standard",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  premium: {
    label: "Premium",
    className: "bg-amber-100 text-amber-800 border-amber-200",
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
