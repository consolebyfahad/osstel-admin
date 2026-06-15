"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import {
  useReplySupportRequest,
  useSupportRequest,
  useUpdateSupportStatus,
} from "@/hooks/use-admin";
import { formatDate } from "@/lib/utils";
import type { SupportRequestStatus } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { PageLoader } from "@/components/PageLoader";
import { SupportStatusBadge } from "@/components/SupportStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const statusOptions: SupportRequestStatus[] = [
  "open",
  "pending",
  "in_progress",
  "resolved",
  "closed",
];

interface SupportRequestDetailPageContentProps {
  id: string;
}

export function SupportRequestDetailPageContent({
  id,
}: SupportRequestDetailPageContentProps) {
  const { data, isLoading } = useSupportRequest(id);
  const replyMutation = useReplySupportRequest();
  const statusMutation = useUpdateSupportStatus();

  const request = data?.request;
  const user = request?.user ?? request?.owner;

  const [adminReply, setAdminReply] = useState("");
  const [status, setStatus] = useState<SupportRequestStatus>("open");

  useEffect(() => {
    if (request) {
      setAdminReply(request.adminReply ?? "");
      setStatus(request.status);
    }
  }, [request]);

  const handleReply = async () => {
    if (!adminReply.trim()) return;
    await replyMutation.mutateAsync({ id, adminReply });
  };

  const handleUpdateStatus = async () => {
    await statusMutation.mutateAsync({
      id,
      adminReply: adminReply.trim() || undefined,
      status,
    });
  };

  if (isLoading) {
    return (
      <>
        <Navbar title="Support Request" />
        <PageLoader />
      </>
    );
  }

  if (!request) {
    return (
      <>
        <Navbar title="Support Request" />
        <div className="p-6 text-center text-sm text-error">
          Support request not found.
        </div>
      </>
    );
  }

  const isSubmitting = replyMutation.isPending || statusMutation.isPending;

  return (
    <>
      <Navbar
        title={request.subject ?? "Support Request"}
        description="View message and respond"
      />

      <div className="p-6 space-y-6 max-w-3xl">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/support-requests">
            <ArrowLeft className="h-4 w-4" />
            Back to Support
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <CardTitle className="text-base">Request Details</CardTitle>
              <SupportStatusBadge status={request.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {user && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs text-muted-foreground">From</p>
                  <Link
                    href={`/owners/${user.id}`}
                    className="font-medium text-primary hover:underline"
                  >
                    {user.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">{user.phone}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Submitted</p>
                  <p className="font-medium">{formatDate(request.createdAt)}</p>
                </div>
              </div>
            )}

            {request.subject && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">Subject</p>
                <p className="font-medium">{request.subject}</p>
              </div>
            )}

            <div>
              <p className="text-xs text-muted-foreground mb-1">Message</p>
              <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm leading-relaxed">
                {request.message}
              </p>
            </div>

            {request.adminReply && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Previous admin reply
                </p>
                <p className="rounded-lg border border-primary-200 bg-primary-100/50 p-4 text-sm">
                  {request.adminReply}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Admin Response</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-reply">Reply to user</Label>
              <Textarea
                id="admin-reply"
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
                placeholder="Your plan has been upgraded to standard."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as SupportRequestStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                onClick={handleReply}
                disabled={isSubmitting || !adminReply.trim()}
                variant="outline"
              >
                <Send className="h-4 w-4" />
                Send Reply Only
              </Button>
              <Button
                onClick={handleUpdateStatus}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Update Status & Reply"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
