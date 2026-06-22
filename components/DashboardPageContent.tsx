"use client";

import {
  Building2,
  Clock,
  Crown,
  Mail,
  ShieldBan,
  Users,
} from "lucide-react";
import { useDashboardStats } from "@/hooks/use-admin";
import { Navbar } from "@/components/Navbar";
import { PageError } from "@/components/PageError";
import { PageLoader } from "@/components/PageLoader";
import { StatCard } from "@/components/StatCard";

export function DashboardPageContent() {
  const { data: stats, isLoading, isError, refetch } = useDashboardStats();

  if (isLoading) {
    return (
      <>
        <Navbar
          title="Dashboard"
          description="Overview of your hostel management platform"
        />
        <PageLoader message="Loading dashboard stats..." />
      </>
    );
  }

  if (isError || !stats) {
    return (
      <>
        <Navbar title="Dashboard" />
        <PageError
          title="Failed to load dashboard"
          message="We couldn't fetch dashboard stats. Check your connection and try again."
          onRetry={() => refetch()}
        />
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
            title="New Website Inquiries"
            value={stats.newContactInquiries ?? 0}
            icon={Mail}
            description="Unread contact form messages"
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
