"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardList,
  HeadphonesIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  User,
  Users,
  Building2,
} from "lucide-react";
import { useContactInquiries, useDashboardStats, useSupportRequests } from "@/hooks/use-admin";
import { useAuth } from "@/components/providers/AuthProvider";
import { AdminAvatar } from "@/components/AdminAvatar";
import { Logo } from "@/components/Logo";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/owners", label: "Owners", icon: Users },
  { href: "/hostels", label: "Hostels", icon: Building2 },
  {
    href: "/plan-requests",
    label: "Plan Requests",
    icon: ClipboardList,
    badgeKey: "pendingPlanRequests" as const,
  },
  {
    href: "/contact-inquiries",
    label: "Website Inquiries",
    icon: Mail,
    badgeKey: "newContactInquiries" as const,
  },
  {
    href: "/support-requests",
    label: "Support",
    icon: HeadphonesIcon,
    badgeFromSupport: true as const,
  },
  { href: "/profile", label: "Profile", icon: User },
];

interface SidebarProps {
  mobileOpen?: boolean;
  onNavigate?: () => void;
}

export function Sidebar({ mobileOpen = false, onNavigate }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, avatarUrl, logout } = useAuth();
  const { data: stats } = useDashboardStats();
  const { data: openSupport } = useSupportRequests({
    page: 1,
    limit: 1,
    status: "open",
  });
  const { data: pendingSupport } = useSupportRequests({
    page: 1,
    limit: 1,
    status: "pending",
  });

  const supportBadgeCount =
    (openSupport?.pagination?.total ?? 0) +
    (pendingSupport?.pagination?.total ?? 0);

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <aside
      className={cn(
        "glass-sidebar fixed inset-y-0 left-0 z-30 flex w-64 flex-col text-sidebar-foreground transition-transform duration-300 lg:translate-x-0",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b border-border/50 px-6">
        <Logo variant="icon" size="sm" />
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground">OSSTEL Admin</p>
          <p className="text-xs text-muted-foreground">Hostel Management</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          const badgeCount = item.badgeKey && stats
            ? (stats[item.badgeKey] ?? 0)
            : item.badgeFromSupport
              ? supportBadgeCount
              : 0;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "glass-nav-item-active text-foreground"
                  : "text-muted-foreground rounded-xl hover:bg-primary-100/40 hover:backdrop-blur-sm"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span className="flex-1">{item.label}</span>
              {badgeCount > 0 && (
                <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1.5 text-xs font-medium text-white">
                  {badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div className="border-t border-border/50 p-4 space-y-3">
          <Link
            href="/profile"
            onClick={onNavigate}
            className="glass-bubble flex items-center gap-3 rounded-xl px-3 py-2 transition-all hover:scale-[1.01]"
          >
            <AdminAvatar name={user.name} avatarUrl={avatarUrl} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {user.name}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.phone}
              </p>
            </div>
          </Link>
          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-error/10 hover:text-error"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </aside>
  );
}
