"use client";

import Link from "next/link";
import { Bell, ClipboardList, HeadphonesIcon, Mail } from "lucide-react";
import {
  useContactInquiries,
  useDashboardStats,
  usePlanRequests,
  useSupportRequests,
} from "@/hooks/use-admin";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminNotifications() {
  const { data: stats } = useDashboardStats();
  const { data: inquiriesData } = useContactInquiries({
    page: 1,
    limit: 5,
    status: "new",
  });
  const { data: planData } = usePlanRequests({
    page: 1,
    limit: 5,
    status: "pending",
  });
  const { data: supportData } = useSupportRequests({
    page: 1,
    limit: 5,
    status: "open",
  });

  const newInquiries = inquiriesData?.inquiries ?? [];
  const pendingPlans = planData?.requests ?? [];
  const openSupport = supportData?.requests ?? [];

  const totalCount =
    (stats?.newContactInquiries ?? 0) +
    (stats?.pendingPlanRequests ?? 0) +
    (stats?.openSupportRequests ?? 0);

  const hasItems =
    newInquiries.length > 0 ||
    pendingPlans.length > 0 ||
    openSupport.length > 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="glass-bubble relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all hover:scale-105 hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          {totalCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-semibold text-white">
              {totalCount > 99 ? "99+" : totalCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="border-b border-border/50 px-4 py-3">
          <p className="text-sm font-semibold text-foreground">Notifications</p>
          <p className="text-xs text-muted-foreground">
            {totalCount > 0
              ? `${totalCount} item${totalCount === 1 ? "" : "s"} need attention`
              : "You're all caught up"}
          </p>
        </div>

        {!hasItems ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No new notifications
          </div>
        ) : (
          <div className="max-h-96 overflow-y-auto py-1">
            {newInquiries.length > 0 && (
              <>
                <DropdownMenuLabel className="text-muted-foreground">
                  Website Inquiries
                </DropdownMenuLabel>
                {newInquiries.map((inquiry) => (
                  <DropdownMenuItem key={inquiry.id} asChild>
                    <Link
                      href={`/contact-inquiries/${inquiry.id}`}
                      className="flex cursor-pointer flex-col items-start gap-0.5 py-2.5"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <Mail className="h-3.5 w-3.5 text-primary" />
                        {inquiry.name}
                      </span>
                      <span className="line-clamp-1 pl-5 text-xs text-muted-foreground">
                        {inquiry.message}
                      </span>
                      <span className="pl-5 text-xs text-muted-foreground">
                        {formatDate(inquiry.createdAt)}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}

            {pendingPlans.length > 0 && (
              <>
                <DropdownMenuLabel className="text-muted-foreground">
                  Plan Requests
                </DropdownMenuLabel>
                {pendingPlans.map((request) => (
                  <DropdownMenuItem key={request.id} asChild>
                    <Link
                      href="/plan-requests"
                      className="flex cursor-pointer flex-col items-start gap-0.5 py-2.5"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <ClipboardList className="h-3.5 w-3.5 text-warning" />
                        {request.owner.name}
                      </span>
                      <span className="pl-5 text-xs text-muted-foreground">
                        {request.currentPlan} → {request.requestedPlan}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
              </>
            )}

            {openSupport.length > 0 && (
              <>
                <DropdownMenuLabel className="text-muted-foreground">
                  Support
                </DropdownMenuLabel>
                {openSupport.map((request) => (
                  <DropdownMenuItem key={request.id} asChild>
                    <Link
                      href={`/support-requests/${request.id}`}
                      className="flex cursor-pointer flex-col items-start gap-0.5 py-2.5"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        <HeadphonesIcon className="h-3.5 w-3.5 text-secondary" />
                        {request.subject || "Support request"}
                      </span>
                      <span className="line-clamp-1 pl-5 text-xs text-muted-foreground">
                        {request.message}
                      </span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </>
            )}
          </div>
        )}

        <div className="border-t border-border/50 p-2">
          <DropdownMenuItem asChild>
            <Link
              href="/dashboard"
              className={cn(
                "justify-center text-center text-xs font-medium text-primary"
              )}
            >
              Open dashboard
            </Link>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
