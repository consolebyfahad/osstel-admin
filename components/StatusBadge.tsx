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
    className: "bg-green-100 text-green-700 border-green-200",
  },
  blocked: {
    label: "Blocked",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  vacant: {
    label: "Vacant",
    className: "bg-gray-100 text-gray-600 border-gray-200",
  },
};

export function StatusBadge({ status }: { status: Status }) {
  const config = statusConfig[status] ?? {
    label: status,
    className: "bg-gray-100 text-gray-700",
  };

  return (
    <Badge
      className={cn("border font-medium capitalize", config.className)}
    >
      {config.label}
    </Badge>
  );
}
