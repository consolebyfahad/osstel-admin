"use client";

import Link from "next/link";
import { ArrowLeft, CheckCircle2, Mail, MessageCircle, Phone } from "lucide-react";
import {
  useContactInquiry,
  useUpdateContactInquiryStatus,
} from "@/hooks/use-admin";
import { formatDate } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { PageLoader } from "@/components/PageLoader";
import { ContactInquiryStatusBadge } from "@/components/ContactInquiryStatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function whatsAppLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  const normalized = digits.startsWith("92")
    ? digits
    : digits.startsWith("0")
      ? `92${digits.slice(1)}`
      : digits;
  return `https://wa.me/${normalized}`;
}

interface ContactInquiryDetailPageContentProps {
  id: string;
}

export function ContactInquiryDetailPageContent({
  id,
}: ContactInquiryDetailPageContentProps) {
  const { data, isLoading } = useContactInquiry(id);
  const statusMutation = useUpdateContactInquiryStatus();

  const inquiry = data?.inquiry;

  const handleMarkHandled = async () => {
    await statusMutation.mutateAsync({ id, status: "closed" });
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

  return (
    <>
      <Navbar
        title={inquiry.name}
        description="Contact the visitor directly by phone, email, or WhatsApp"
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

            <div>
              <p className="text-xs text-muted-foreground mb-1">Message</p>
              <p className="rounded-lg border border-border bg-muted/30 p-4 text-sm leading-relaxed whitespace-pre-wrap">
                {inquiry.message}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Contact Visitor</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Reply outside the admin panel using the details below.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <a href={`tel:${inquiry.phone}`}>
                  <Phone className="h-4 w-4" />
                  Call {inquiry.phone}
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href={`mailto:${inquiry.email}`}>
                  <Mail className="h-4 w-4" />
                  Email
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a
                  href={whatsAppLink(inquiry.phone)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">{inquiry.email}</p>
          </CardContent>
        </Card>

        {inquiry.status !== "closed" && (
          <div className="flex justify-end">
            <Button
              onClick={handleMarkHandled}
              disabled={statusMutation.isPending}
            >
              <CheckCircle2 className="h-4 w-4" />
              {statusMutation.isPending ? "Saving..." : "Mark as handled"}
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
