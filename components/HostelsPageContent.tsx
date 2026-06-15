"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Search } from "lucide-react";
import { useHostels } from "@/hooks/use-admin";
import { Navbar } from "@/components/Navbar";
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

export function HostelsPageContent() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading } = useHostels({
    page,
    limit: 20,
    search: search || undefined,
  });

  const hostels = data?.hostels ?? [];
  const pagination = data?.pagination;

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  return (
    <>
      <Navbar
        title="Hostels"
        description="Manage hostel properties and listings"
      />

      <div className="p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search by name, city, or address..."
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
                  <TableHead>Hostel Name</TableHead>
                  <TableHead>City / Address</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Owner Plan</TableHead>
                  <TableHead>Owner Status</TableHead>
                  <TableHead>Rooms</TableHead>
                  <TableHead>Tenants</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hostels.length === 0 ? (
                  <TableEmpty message="No hostels found." />
                ) : (
                  hostels.map((hostel) => (
                    <TableRow key={hostel.id}>
                      <TableCell>
                        <p className="font-medium text-gray-900">{hostel.name}</p>
                      </TableCell>
                      <TableCell>
                        <p>{hostel.city}</p>
                        <p className="text-xs text-gray-400">{hostel.address}</p>
                      </TableCell>
                      <TableCell>
                        <Link
                          href={`/owners/${hostel.owner.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {hostel.owner.name}
                        </Link>
                        <p className="text-xs text-gray-400">
                          {hostel.owner.phone}
                        </p>
                      </TableCell>
                      <TableCell>
                        <PlanBadge plan={hostel.owner.subscriptionPlan} />
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={hostel.owner.status} />
                      </TableCell>
                      <TableCell>{hostel.roomsCount}</TableCell>
                      <TableCell>{hostel.tenantsCount}</TableCell>
                      <TableCell>
                        <StatusBadge status={hostel.status} />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/hostels/${hostel.id}`}>
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
