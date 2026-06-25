"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Search, ShieldBan, ShieldCheck } from "lucide-react";
import {
  useBlockOwner,
  useOwners,
} from "@/hooks/use-admin";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Navbar } from "@/components/Navbar";
import { PageError } from "@/components/PageError";
import { PageLoader } from "@/components/PageLoader";
import { Pagination } from "@/components/Pagination";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { OwnerListItem } from "@/lib/types";
import { getOwnerContact } from "@/lib/utils";
import { TrialBadge } from "@/components/TrialBadge";

export function OwnersPageContent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [blockTarget, setBlockTarget] = useState<OwnerListItem | null>(null);

  const { data, isLoading, isError, refetch } = useOwners({
    page,
    limit: 20,
    status: statusFilter === "all" ? undefined : statusFilter as "active" | "blocked",
    plan: planFilter === "all" ? undefined : planFilter as "free" | "standard" | "premium",
    search: search || undefined,
  });

  const blockMutation = useBlockOwner();

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleBlockConfirm = async () => {
    if (!blockTarget) return;
    const blocked = blockTarget.status === "active";
    await blockMutation.mutateAsync({ id: blockTarget.id, blocked });
    setBlockTarget(null);
  };

  const owners = data?.owners ?? [];
  const pagination = data?.pagination;

  return (
    <>
      <Navbar
        title="Owners"
        description="Manage hostel owners and managers"
      />

      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name, phone, or email..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              className="pl-9"
            />
          </div>
          <Select
            value={statusFilter}
            onValueChange={(v) => {
              setStatusFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={planFilter}
            onValueChange={(v) => {
              setPlanFilter(v);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Plans</SelectItem>
              <SelectItem value="free">Free</SelectItem>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="premium">Premium</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleSearch} variant="outline">Search</Button>
        </div>

        {isLoading ? (
          <PageLoader />
        ) : isError ? (
          <PageError
            title="Failed to load owners"
            message="We couldn't fetch the owners list. Check your connection and try again."
            onRetry={() => refetch()}
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Hostels</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {owners.length === 0 ? (
                  <TableEmpty message="No owners found." />
                ) : (
                  owners.map((owner) => (
                    <TableRow key={owner.id}>
                      <TableCell>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-gray-900">{owner.name}</p>
                          {owner.trial?.active && (
                            <TrialBadge
                              daysRemaining={owner.trial.daysRemaining}
                              compact
                            />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <span
                          className="text-sm text-gray-700"
                          title={
                            owner.contactType === "email"
                              ? "Google sign-in"
                              : undefined
                          }
                        >
                          {getOwnerContact(owner)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <PlanBadge
                          plan={
                            owner.trial?.active && owner.effectivePlan
                              ? owner.effectivePlan
                              : owner.subscriptionPlan
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={owner.status} />
                      </TableCell>
                      <TableCell>{owner.hostelsCount}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/owners/${owner.id}`}>
                              <Eye className="h-4 w-4" />
                              View
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setBlockTarget(owner)}
                          >
                            {owner.status === "active" ? (
                              <>
                                <ShieldBan className="h-4 w-4 text-red-500" />
                                Block
                              </>
                            ) : (
                              <>
                                <ShieldCheck className="h-4 w-4 text-green-600" />
                                Unblock
                              </>
                            )}
                          </Button>
                        </div>
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

      <ConfirmDialog
        open={!!blockTarget}
        onOpenChange={(open) => !open && setBlockTarget(null)}
        title={
          blockTarget?.status === "active"
            ? "Block Owner"
            : "Unblock Owner"
        }
        description={
          blockTarget?.status === "active"
            ? `Are you sure you want to block ${blockTarget?.name}? They will not be able to access the app.`
            : `Are you sure you want to unblock ${blockTarget?.name}?`
        }
        confirmLabel={
          blockTarget?.status === "active" ? "Block Owner" : "Unblock Owner"
        }
        confirmVariant={
          blockTarget?.status === "active" ? "destructive" : "default"
        }
        onConfirm={handleBlockConfirm}
        isLoading={blockMutation.isPending}
      />
    </>
  );
}
