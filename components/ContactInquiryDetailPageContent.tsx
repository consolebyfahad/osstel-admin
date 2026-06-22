"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Send } from "lucide-react";
import {
  useContactInquiry,
  useReplyContactInquiry,
  useUpdateContactInquiryStatus,
} from "@/hooks/use-admin";
import { formatDate } from "@/lib/utils";
import type { ContactInquiryStatus } from "@/lib/types";
import { Navbar } from "@/components/Navbar";
import { PageLoader } from "@/components/PageLoader";
import { ContactInquiryStatusBadge } from "@/components/ContactInquiryStatusBadge";
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

const statusOptions: ContactInquiryStatus[] = [
  "new",
  "in_progress",
  "replied",
  "closed",
];

interface ContactInquiryDetailPageContentProps {
  id: string;
}

export function ContactInquiryDetailPageContent({
  id,
}: ContactInquiryDetailPageContentProps) {
  const { data, isLoading } = useContactInquiry(id);
  const replyMutation = useReplyContactInquiry();
  const statusMutation = useUpdateContactInquiryStatus();

  const inquiry = data?.inquiry;

  const [adminReply, setAdminReply] = useState("");
  const [status, setStatus] = useState<ContactInquiryStatus>("new");

  useEffect(() => {
    if (inquiry) {
      setAdminReply(inquiry.adminReply ?? "");
      setStatus(inquiry.status);
    }
  }, [inquiry]);

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
        <Navbar title="Website Inquiry" />
        <PageLoader />
      </>
    );
  }

  if (!inquiry) {
    return (
      <>
        <Navbar title="Website Inquiry" />
        <div className="p-6 text-center text-sm text-error">
          Inquiry not found.
        </div>
      </>
    );
  }

  const isSubmitting = replyMutation.isPending || statusMutation.isPending;

  return (
    <>
      <Navbar
        title={inquiry.name}
        description="Website contact form submission"
      />

      <div className="p-6 space-y-6 max-w-3xl">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/contact-inquiries">
            <ArrowLeft className="h-4 w-4" />
            Back to Inquiries
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <CardTitle className="text-base">Inquiry Details</CardTitle>
              <ContactInquiryStatusBadge status={inquiry.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Name</p>
                <p className="font-medium">{inquiry.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Submitted</p>
                <p className="font-medium">{formatDate(inquiry.createdAt)}</p>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <a
                  href={`tel:${inquiry.phone}`}
                  className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
                >
                  <Phone className="h-4 w-4" />
                  {inquiry.phone}
                </a>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <a
                  href={`mailto:${inquiry.email}`}
                  className="inline-flex items-center gap-2 font-medium text-primary hover:underline"
                >
                  <Mail className="h-4 w-4" />
                  {inquiry.email}
                </a>
              </div>
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-1">Message</p>
              <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-wrap">
                {inquiry.message}
              </p>
            </div>

            {inquiry.adminReply && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">
                  Previous admin reply
                </p>
                <p className="rounded-lg border border-primary-200 bg-primary-100/50 p-4 text-sm whitespace-pre-wrap">
                  {inquiry.adminReply}
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
              <Label htmlFor="admin-reply">Internal reply / notes</Label>
              <Textarea
                id="admin-reply"
                value={adminReply}
                onChange={(e) => setAdminReply(e.target.value)}
                placeholder="Follow-up notes or reply sent to the visitor..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(v) => setStatus(v as ContactInquiryStatus)}
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
                Save Reply
              </Button>
              <Button onClick={handleUpdateStatus} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Update Status"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
