"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import {
  useApprovePlanRequest,
  usePlanRequests,
  useRejectPlanRequest,
} from "@/hooks/use-admin";
import { formatDate } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Navbar } from "@/components/Navbar";
import { PageLoader } from "@/components/PageLoader";
import { Pagination } from "@/components/Pagination";
import { PlanBadge } from "@/components/PlanBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PlanRequest } from "@/lib/types";

const filterTabs = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
  { value: "all", label: "All" },
] as const;

export function PlanRequestsPageContent() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] =
    useState<"pending" | "approved" | "rejected" | "all">("pending");
  const [approveTarget, setApproveTarget] = useState<PlanRequest | null>(null);
  const [rejectTarget, setRejectTarget] = useState<PlanRequest | null>(null);
  const [adminNote, setAdminNote] = useState("");

  const { data, isLoading } = usePlanRequests({
    page,
    limit: 20,
    status: statusFilter,
  });

  const approveMutation = useApprovePlanRequest();
  const rejectMutation = useRejectPlanRequest();

  const requests = data?.requests ?? [];
  const pagination = data?.pagination;

  const openApprove = (request: PlanRequest) => {
    setAdminNote("Payment received via bank transfer");
    setApproveTarget(request);
  };

  const openReject = (request: PlanRequest) => {
    setAdminNote("");
    setRejectTarget(request);
  };

  const handleApprove = async () => {
    if (!approveTarget) return;
    await approveMutation.mutateAsync({
      id: approveTarget.id,
      adminNote,
    });
    setApproveTarget(null);
    setAdminNote("");
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    await rejectMutation.mutateAsync({
      id: rejectTarget.id,
      adminNote,
    });
    setRejectTarget(null);
    setAdminNote("");
  };

  return (
    <>
      <Navbar
        title="Plan Requests"
        description="Review and approve owner plan upgrade requests"
      />

      <div className="p-6 space-y-6">
        <div className="flex flex-wrap gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => {
                setStatusFilter(tab.value);
                setPage(1);
              }}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                statusFilter === tab.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground border border-border hover:bg-accent"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <PageLoader />
        ) : requests.length === 0 ? (
          <div className="rounded-xl border border-border bg-card-gradient p-12 text-center text-sm text-muted-foreground">
            No plan requests found.
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <Card key={request.id}>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <div>
                        <Link
                          href={`/owners/${request.owner.id}`}
                          className="font-semibold text-foreground hover:text-primary"
                        >
                          {request.owner.name}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          {request.owner.phone}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <PlanBadge plan={request.currentPlan} />
                        <span className="text-muted-foreground">→</span>
                        <PlanBadge plan={request.requestedPlan} />
                      </div>

                      {request.note && (
                        <p className="text-sm text-foreground/80">
                          <span className="font-medium">Owner note:</span>{" "}
                          {request.note}
                        </p>
                      )}

                      {request.adminNote && (
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium">Admin note:</span>{" "}
                          {request.adminNote}
                        </p>
                      )}

                      <p className="text-xs text-muted-foreground">
                        Requested on {formatDate(request.createdAt)}
                      </p>
                    </div>

                    {request.status === "pending" && (
                      <div className="flex gap-2 shrink-0">
                        <Button
                          size="sm"
                          onClick={() => openApprove(request)}
                        >
                          <Check className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openReject(request)}
                        >
                          <X className="h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    )}

                    {request.status !== "pending" && (
                      <span
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium capitalize",
                          request.status === "approved"
                            ? "bg-success/15 text-success border border-success/30"
                            : "bg-error/15 text-error border border-error/30"
                        )}
                      >
                        {request.status}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}

            {pagination && (
              <Pagination
                page={pagination.page}
                pages={pagination.pages}
                total={pagination.total}
                limit={pagination.limit}
                onPageChange={setPage}
              />
            )}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!approveTarget}
        onOpenChange={(open) => !open && setApproveTarget(null)}
        title="Approve Plan Request"
        description={`Approve upgrade to ${approveTarget?.requestedPlan} for ${approveTarget?.owner.name}? This activates their plan for 30 days. After that, it returns to Free unless renewed or extended.`}
        confirmLabel="Approve"
        onConfirm={handleApprove}
        isLoading={approveMutation.isPending}
        showNoteInput
        noteLabel="Admin Note"
        notePlaceholder="Payment received via bank transfer"
        noteValue={adminNote}
        onNoteChange={setAdminNote}
      />

      <ConfirmDialog
        open={!!rejectTarget}
        onOpenChange={(open) => !open && setRejectTarget(null)}
        title="Reject Plan Request"
        description={`Reject upgrade request for ${rejectTarget?.owner.name}?`}
        confirmLabel="Reject"
        confirmVariant="destructive"
        onConfirm={handleReject}
        isLoading={rejectMutation.isPending}
        showNoteInput
        noteLabel="Admin Note"
        notePlaceholder="Payment not received"
        noteValue={adminNote}
        onNoteChange={setAdminNote}
      />
    </>
  );
}
