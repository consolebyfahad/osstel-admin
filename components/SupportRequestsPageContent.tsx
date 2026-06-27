"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Search } from "lucide-react";
import { useSupportRequests } from "@/hooks/use-admin";
import { formatDate } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { PageLoader } from "@/components/PageLoader";
import { Pagination } from "@/components/Pagination";
import { SupportStatusBadge } from "@/components/SupportStatusBadge";
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
import type { SupportRequest, SupportRequestUser } from "@/lib/types";

const filterTabs = [
  { value: "open", label: "Open" },
  { value: "in_progress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
  { value: "closed", label: "Closed" },
  { value: "all", label: "All" },
] as const;

function getRequestUser(request: SupportRequest): SupportRequestUser | undefined {
  return request.user ?? request.owner;
}

export function SupportRequestsPageContent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<typeof filterTabs[number]["value"]>("open");

  const { data, isLoading } = useSupportRequests({
    page,
    limit: 20,
    status: statusFilter,
    search: search || undefined,
  });

  const requests = data?.requests ?? [];
  const pagination = data?.pagination;

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <>
      <Navbar
        title="Support Requests"
        description="Review and respond to owner support tickets"
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
              placeholder="Search by subject or message..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9"
            />
          </div>
          <Button onClick={handleSearch} variant="outline">Search</Button>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Subject</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.length === 0 ? (
                  <TableEmpty message="No support requests found." />
                ) : (
                  requests.map((request) => {
                    const user = getRequestUser(request);
                    return (
                      <TableRow key={request.id}>
                        <TableCell>
                          <p className="font-medium text-foreground line-clamp-1">
                            {request.subject ?? "Support request"}
                          </p>
                          <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                            {request.message}
                          </p>
                        </TableCell>
                        <TableCell>
                          {user ? (
                            <>
                              <p className="font-medium text-foreground">{user.name}</p>
                              <p className="text-xs text-muted-foreground">
                                {user.phone}
                              </p>
                            </>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <SupportStatusBadge status={request.status} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {formatDate(request.createdAt)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/support-requests/${request.id}`}>
                              <Eye className="h-4 w-4" />
                              View
                            </Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
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
