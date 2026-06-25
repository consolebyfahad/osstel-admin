import { cn } from "@/lib/utils";
import type { HostelStatus, OwnerStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

type Status = OwnerStatus | HostelStatus;

const statusConfig: Record<
  Status,
  { label: string; className: string }
> = {
  active: {
    label: "Active",
    className:
      "bg-success/15 text-success border-success/30 dark:bg-success/10 dark:text-success",
  },
  blocked: {
    label: "Blocked",
    className:
      "bg-error/15 text-error border-error/30 dark:bg-error/10 dark:text-error",
  },
  vacant: {
    label: "Vacant",
    className:
      "bg-muted text-muted-foreground border-border dark:bg-primary-100 dark:text-muted-foreground",
  },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-muted text-muted-foreground border-border",
  };

  return (
    <Badge
      className={cn("border font-medium capitalize", config.className)}
    >
      {config.label}
    </Badge>
  );
}
