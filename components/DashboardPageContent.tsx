"use client";

import {
  Building2,
  Clock,
  Crown,
  ShieldBan,
  Users,
} from "lucide-react";
import { useDashboardStats } from "@/hooks/use-admin";
import { Navbar } from "@/components/Navbar";
import { PageLoader } from "@/components/PageLoader";
import { StatCard } from "@/components/StatCard";

export function DashboardPageContent() {
  const { data: stats, isLoading, isError } = useDashboardStats();

  if (isLoading) {
    return (
      <>
        <Navbar
          title="Dashboard"
          description="Overview of your hostel management platform"
        />
        <PageLoader />
      </>
    );
  }

  if (isError || !stats) {
    return (
      <>
        <Navbar title="Dashboard" />
        <div className="p-6 text-center text-sm text-red-600">
          Failed to load dashboard stats.
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar
        title="Dashboard"
        description="Overview of your hostel management platform"
      />

      <div className="p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total Owners"
            value={stats.totalOwners}
            icon={Users}
            description="Registered owners & managers"
          />
          <StatCard
            title="Blocked Owners"
            value={stats.blockedOwners}
            icon={ShieldBan}
            description="Currently blocked accounts"
          />
          <StatCard
            title="Total Hostels"
            value={stats.totalHostels}
            icon={Building2}
            description="All hostel properties"
          />
          <StatCard
            title="Pending Plan Requests"
            value={stats.pendingPlanRequests}
            icon={Clock}
            description="Awaiting admin approval"
          />
          <StatCard
            title="Standard Owners"
            value={stats.standardOwners}
            icon={Users}
            description="On standard plan"
          />
          <StatCard
            title="Premium Owners"
            value={stats.premiumOwners}
            icon={Crown}
            description="On premium plan"
          />
        </div>
      </div>
    </>
  );
}
