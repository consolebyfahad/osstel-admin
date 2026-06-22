import { cn } from "@/lib/utils";
import type { ContactInquiryStatus } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

const statusConfig: Record<
  ContactInquiryStatus,
  { label: string; className: string }
> = {
  new: {
    label: "New",
    className: "bg-primary-100 text-primary border-primary-200",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-secondary-100 text-secondary-foreground border-secondary-200",
  },
  replied: {
    label: "Replied",
    className: "bg-success/20 text-success border-success/30",
  },
  closed: {
    label: "Closed",
    className: "bg-muted text-muted-foreground border-border",
  },
};

export function ContactInquiryStatusBadge({
  status,
}: {
  status: ContactInquiryStatus;
}) {
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
