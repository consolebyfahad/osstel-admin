"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  HeadphonesIcon,
  LayoutDashboard,
  LogOut,
  Mail,
  User,
  Users,
  Building2,
} from "lucide-react";
import { useDashboardStats } from "@/hooks/use-admin";
import { useAuth } from "@/components/providers/AuthProvider";
import { AdminAvatar } from "@/components/AdminAvatar";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
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
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onNavigate?: () => void;
}

export function Sidebar({
  mobileOpen = false,
  collapsed = false,
  onToggleCollapse,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, avatarUrl, logout } = useAuth();
  const { data: stats } = useDashboardStats();

  const supportBadgeCount = stats?.openSupportRequests ?? 0;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <aside
      className={cn(
        "glass-sidebar fixed inset-y-0 left-0 z-30 flex flex-col text-sidebar-foreground transition-all duration-300 lg:translate-x-0",
        collapsed ? "w-[72px]" : "w-64",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}
    >
      <div
        className={cn(
          "flex border-b border-border/50",
          collapsed
            ? "h-auto flex-col items-center gap-1 py-3 px-2"
            : "h-16 items-center gap-3 px-4"
        )}
      >
        <Logo variant="icon" size="sm" />
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-foreground">Osstel Admin</p>
            <p className="text-xs text-muted-foreground">Hostel Management</p>
          </div>
        )}
        {onToggleCollapse && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="hidden h-8 w-8 shrink-0 lg:inline-flex"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        )}
      </div>

      <nav className={cn("flex-1 space-y-1 p-3", collapsed && "px-2")}>
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
              title={collapsed ? item.label : undefined}
              className={cn(
                "relative flex items-center rounded-xl text-sm font-medium transition-all duration-200",
                collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5",
                isActive
                  ? "glass-nav-item-active text-foreground"
                  : "text-muted-foreground rounded-xl hover:bg-primary-100/40 hover:backdrop-blur-sm"
              )}
            >
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              {!collapsed && <span className="flex-1">{item.label}</span>}
              {badgeCount > 0 && (
                <span
                  className={cn(
                    "flex h-5 min-w-5 items-center justify-center rounded-full bg-error px-1.5 text-xs font-medium text-white",
                    collapsed &&
                      "absolute -right-0.5 -top-0.5 h-4 min-w-4 px-1 text-[10px]"
                  )}
                >
                  {badgeCount > 99 ? "99+" : badgeCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {user && (
        <div
          className={cn(
            "border-t border-border/50 space-y-2",
            collapsed ? "p-2" : "p-4 space-y-3"
          )}
        >
          <Link
            href="/profile"
            onClick={onNavigate}
            title={collapsed ? user.name : undefined}
            className={cn(
              "glass-bubble flex items-center rounded-xl transition-all hover:scale-[1.01]",
              collapsed ? "justify-center p-2" : "gap-3 px-3 py-2"
            )}
          >
            <AdminAvatar name={user.name} avatarUrl={avatarUrl} size="sm" />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {user.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {user.phone}
                </p>
              </div>
            )}
          </Link>
          <button
            type="button"
            title={collapsed ? "Logout" : undefined}
            className={cn(
              "flex w-full items-center rounded-lg text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-error/10 hover:text-error",
              collapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2.5"
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && "Logout"}
          </button>
        </div>
      )}
    </aside>
  );
}
