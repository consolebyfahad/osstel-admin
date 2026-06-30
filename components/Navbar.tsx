"use client";

import { AdminNotifications } from "@/components/AdminNotifications";
import { UserMenu } from "@/components/UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";

interface NavbarProps {
  title: string;
  description?: string;
}

export function Navbar({ title, description }: NavbarProps) {
  return (
    <header className="glass-nav sticky top-0 z-20">
      <div className="flex h-16 items-center justify-between px-4 pl-16 sm:px-6 sm:pl-6">
        <div>
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <AdminNotifications />
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
