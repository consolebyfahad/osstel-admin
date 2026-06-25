"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, AlertCircle, Clock } from "lucide-react";
import {
  useBlockOwner,
  useCancelOwnerTrial,
  useGrantOwnerTrial,
  useOwner,
  useUpdateOwnerPlan,
} from "@/hooks/use-admin";
import { formatDate } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Navbar } from "@/components/Navbar";
import { PageLoader } from "@/components/PageLoader";
import { PlanBadge } from "@/components/PlanBadge";
import { StatusBadge } from "@/components/StatusBadge";
import {
  Table,
  TableBody,
  TableCell,
  TableEmpty,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/Table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { SubscriptionPlan } from "@/lib/types";

interface OwnerDetailPageContentProps {
  id: string;
}

export function OwnerDetailPageContent({ id }: OwnerDetailPageContentProps) {
  const { data, isLoading } = useOwner(id);
  const blockMutation = useBlockOwner();
  const planMutation = useUpdateOwnerPlan();
  const trialMutation = useGrantOwnerTrial();
  const cancelTrialMutation = useCancelOwnerTrial();
  const [showBlockDialog, setShowBlockDialog] = useState(false);

  const owner = data?.owner;

  const handleBlock = async () => {
    if (!owner) return;
    await blockMutation.mutateAsync({
      id: owner.id,
      blocked: owner.status === "active",
    });
    setShowBlockDialog(false);
  };

  const handlePlanChange = async (plan: SubscriptionPlan) => {
    if (!owner) return;
    await planMutation.mutateAsync({ id: owner.id, plan });
  };

  const handleGrantTrial = async (days: 10 | 20 | 30) => {
    if (!owner) return;
    await trialMutation.mutateAsync({ id: owner.id, days });
  };

  const handleCancelTrial = async () => {
    if (!owner) return;
    await cancelTrialMutation.mutateAsync(owner.id);
  };

  const isTrialActive = Boolean(owner?.trial?.active);

  if (isLoading) {
    return (
      <>
        <Navbar title="Owner Details" />
        <PageLoader />
      </>
    );
  }

  if (!owner) {
    return (
      <>
        <Navbar title="Owner Details" />
        <div className="p-6 text-center text-sm text-red-600">
          Owner not found.
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar title={owner.name} description="Owner details and hostels" />

      <div className="p-6 space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/owners">
            <ArrowLeft className="h-4 w-4" />
            Back to Owners
          </Link>
        </Button>

        {owner.pendingPlanRequest && (
          <div className="flex items-start gap-3 rounded-xl border border-warning/30 bg-warning/10 p-4 dark:bg-warning/5">
            <AlertCircle className="h-5 w-5 text-warning shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Pending Plan Request</p>
              <p className="text-sm text-muted-foreground mt-1">
                Requesting upgrade from{" "}
                <PlanBadge plan={owner.pendingPlanRequest.currentPlan} /> to{" "}
                <PlanBadge plan={owner.pendingPlanRequest.requestedPlan} />
              </p>
              {owner.pendingPlanRequest.note && (
                <p className="text-sm text-muted-foreground mt-1">
                  Note: {owner.pendingPlanRequest.note}
                </p>
              )}
              <Button variant="outline" size="sm" className="mt-2" asChild>
                <Link href="/plan-requests">Review in Plan Requests</Link>
              </Button>
            </div>
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Owner Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
                  <p className="font-medium">{owner.name}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="font-medium">{owner.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Status</p>
                  <StatusBadge status={owner.status} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Base Plan</p>
                  <PlanBadge plan={owner.subscriptionPlan} />
                </div>
                {isTrialActive && owner.trial && (
                  <div>
                    <p className="text-xs text-muted-foreground">Active Trial</p>
                    <div className="flex items-center gap-2">
                      <PlanBadge plan={owner.trial.plan} />
                      <span className="text-xs text-muted-foreground">
                        {owner.trial.daysRemaining} day
                        {owner.trial.daysRemaining === 1 ? "" : "s"} left
                      </span>
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="font-medium">{formatDate(owner.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Hostels</p>
                  <p className="font-medium">{owner.hostelsCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button
                variant={owner.status === "active" ? "destructive" : "default"}
                className="w-full"
                onClick={() => setShowBlockDialog(true)}
              >
                {owner.status === "active" ? "Block Owner" : "Unblock Owner"}
              </Button>

              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">
                  Change Plan Manually
                </p>
                <Select
                  value={owner.subscriptionPlan}
                  onValueChange={(v) =>
                    handlePlanChange(v as SubscriptionPlan)
                  }
                  disabled={planMutation.isPending}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium (Pro)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3 border-t border-border/50 pt-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <p className="text-sm font-medium text-foreground">
                    Pro Trial
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Grant temporary Pro access. After the trial ends, the owner
                  returns to their base plan ({owner.subscriptionPlan}).
                </p>
                {isTrialActive && owner.trial ? (
                  <div className="space-y-2 rounded-lg border border-primary-200 bg-primary-100/40 p-3">
                    <p className="text-sm font-medium text-foreground">
                      Trial active — ends{" "}
                      {formatDate(owner.trial.endsAt)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {owner.trial.daysRemaining} day
                      {owner.trial.daysRemaining === 1 ? "" : "s"} remaining
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={handleCancelTrial}
                      disabled={cancelTrialMutation.isPending}
                    >
                      {cancelTrialMutation.isPending
                        ? "Cancelling..."
                        : "End trial now"}
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-2">
                    {([10, 20, 30] as const).map((days) => (
                      <Button
                        key={days}
                        variant="outline"
                        size="sm"
                        onClick={() => handleGrantTrial(days)}
                        disabled={trialMutation.isPending}
                      >
                        {days} days
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Hostels</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="border-0 shadow-none rounded-none">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Rooms</TableHead>
                  <TableHead>Tenants</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {owner.hostels.length === 0 ? (
                  <TableEmpty message="No hostels for this owner." />
                ) : (
                  owner.hostels.map((hostel) => (
                    <TableRow key={hostel.id}>
                      <TableCell>
                        <Link
                          href={`/hostels/${hostel.id}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {hostel.name}
                        </Link>
                      </TableCell>
                      <TableCell>{hostel.city}</TableCell>
                      <TableCell>{hostel.address}</TableCell>
                      <TableCell>{hostel.roomsCount}</TableCell>
                      <TableCell>{hostel.tenantsCount}</TableCell>
                      <TableCell>
                        <StatusBadge status={hostel.status} />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog
        open={showBlockDialog}
        onOpenChange={setShowBlockDialog}
        title={
          owner.status === "active" ? "Block Owner" : "Unblock Owner"
        }
        description={
          owner.status === "active"
            ? `Are you sure you want to block ${owner.name}?`
            : `Are you sure you want to unblock ${owner.name}?`
        }
        confirmLabel={
          owner.status === "active" ? "Block Owner" : "Unblock Owner"
        }
        confirmVariant={
          owner.status === "active" ? "destructive" : "default"
        }
        onConfirm={handleBlock}
        isLoading={blockMutation.isPending}
      />
    </>
  );
}
