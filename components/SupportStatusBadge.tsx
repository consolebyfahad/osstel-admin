import { cn } from "@/lib/utils";
import type { SupportRequestStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<
  SupportRequestStatus,
  { label: string; className: string }
> = {
  open: {
    label: "Open",
    className: "bg-primary-100 text-primary border-primary-200",
  },
  pending: {
    label: "Pending",
    className: "bg-warning/20 text-warning border-warning/30",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-secondary-100 text-secondary-foreground border-secondary-200",
  },
  resolved: {
    label: "Resolved",
    className: "bg-success/20 text-success border-success/30",
  },
  closed: {
    label: "Closed",
    className: "bg-muted text-muted-foreground border-border",
  },
};

export function SupportStatusBadge({ status }: { status: SupportRequestStatus }) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground",
  };

  return (
    <Badge className={cn("border font-medium capitalize", config.className)}>
      {config.label}
    </Badge>
  );
}
