"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Search } from "lucide-react";
import { useContactInquiries } from "@/hooks/use-admin";
import { formatDate } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { PageLoader } from "@/components/PageLoader";
import { Pagination } from "@/components/Pagination";
import { ContactInquiryStatusBadge } from "@/components/ContactInquiryStatusBadge";
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
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const filterTabs = [
  { value: "new", label: "New" },
  { value: "in_progress", label: "In Progress" },
  { value: "replied", label: "Replied" },
  { value: "closed", label: "Closed" },
  { value: "all", label: "All" },
] as const;

export function ContactInquiriesPageContent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<(typeof filterTabs)[number]["value"]>("new");

  const { data, isLoading } = useContactInquiries({
    page,
    limit: 20,
    status: statusFilter,
    search: search || undefined,
  });

  const inquiries = data?.inquiries ?? [];
  const pagination = data?.pagination;

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <>
      <Navbar
        title="Website Inquiries"
        description="Messages submitted through the marketing website"
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
                  : "bg-card-gradient text-muted-foreground border border-border hover:bg-primary-100"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch} variant="outline">
            Search
          </Button>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Contact</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {inquiries.length === 0 ? (
                  <TableEmpty message="No website inquiries found." />
                ) : (
                  inquiries.map((inquiry) => (
                    <TableRow key={inquiry.id}>
                      <TableCell>
                        <p className="font-medium text-foreground">
                          {inquiry.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {inquiry.phone}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {inquiry.email}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-foreground/80 line-clamp-2">
                          {inquiry.message}
                        </p>
                      </TableCell>
                      <TableCell>
                        <ContactInquiryStatusBadge status={inquiry.status} />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDate(inquiry.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/contact-inquiries/${inquiry.id}`}>
                            <Eye className="h-4 w-4" />
                            View
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {pagination && (
              <Pagination
                page={pagination.page}
                pages={pagination.pages}
                total={pagination.total}
                limit={pagination.limit}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </>
  );
}
