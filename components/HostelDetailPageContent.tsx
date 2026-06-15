"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useHostel } from "@/hooks/use-admin";
import { Navbar } from "@/components/Navbar";
import { PageLoader } from "@/components/PageLoader";
import { PlanBadge } from "@/components/PlanBadge";
import { StatCard } from "@/components/StatCard";
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
import { Building2, DoorOpen, Users } from "lucide-react";

interface HostelDetailPageContentProps {
  id: string;
}

export function HostelDetailPageContent({ id }: HostelDetailPageContentProps) {
  const { data, isLoading } = useHostel(id);
  const hostel = data?.hostel;

  if (isLoading) {
    return (
      <>
        <Navbar title="Hostel Details" />
        <PageLoader />
      </>
    );
  }

  if (!hostel) {
    return (
      <>
        <Navbar title="Hostel Details" />
        <div className="p-6 text-center text-sm text-red-600">
          Hostel not found.
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar title={hostel.name} description="Hostel details and tenants" />

      <div className="p-6 space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/hostels">
            <ArrowLeft className="h-4 w-4" />
            Back to Hostels
          </Link>
        </Button>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            title="Total Rooms"
            value={hostel.totalRooms}
            icon={DoorOpen}
          />
          <StatCard
            title="Total Tenants"
            value={hostel.totalTenants}
            icon={Users}
          />
          <StatCard
            title="Total Capacity"
            value={hostel.totalCapacity}
            icon={Building2}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Hostel Information</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <p className="font-medium">{hostel.name}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Status</p>
                <StatusBadge status={hostel.status} />
              </div>
              <div>
                <p className="text-xs text-gray-500">City</p>
                <p className="font-medium">{hostel.city}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Contact Phone</p>
                <p className="font-medium">{hostel.contactPhone}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-xs text-gray-500">Address</p>
                <p className="font-medium">{hostel.address}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Owner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Name</p>
                <Link
                  href={`/owners/${hostel.owner.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {hostel.owner.name}
                </Link>
              </div>
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="font-medium">{hostel.owner.phone}</p>
              </div>
              <div className="flex gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Plan</p>
                  <PlanBadge plan={hostel.owner.subscriptionPlan} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <StatusBadge status={hostel.owner.status} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Rooms</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="border-0 shadow-none rounded-none">
              <TableHeader>
                <TableRow>
                  <TableHead>Room Number</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Rent</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hostel.rooms.length === 0 ? (
                  <TableEmpty message="No rooms found." />
                ) : (
                  hostel.rooms.map((room) => (
                    <TableRow key={room.id}>
                      <TableCell className="font-medium">
                        {room.roomNumber}
                      </TableCell>
                      <TableCell>{room.capacity}</TableCell>
                      <TableCell>Rs. {room.rent.toLocaleString()}</TableCell>
                      <TableCell>
                        <span className="capitalize text-sm">{room.status}</span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Tenants</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table className="border-0 shadow-none rounded-none">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>CNIC</TableHead>
                  <TableHead>Room</TableHead>
                  <TableHead>Check-in Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hostel.tenants.length === 0 ? (
                  <TableEmpty message="No tenants found." />
                ) : (
                  hostel.tenants.map((tenant) => (
                    <TableRow key={tenant.id}>
                      <TableCell className="font-medium">
                        {tenant.name}
                      </TableCell>
                      <TableCell>{tenant.phone}</TableCell>
                      <TableCell>{tenant.cnic}</TableCell>
                      <TableCell>{tenant.roomNumber}</TableCell>
                      <TableCell>{tenant.checkInDate}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
