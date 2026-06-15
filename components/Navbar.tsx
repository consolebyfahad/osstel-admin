"use client";

import { Bell, Search } from "lucide-react";
import { UserMenu } from "@/components/UserMenu";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Input } from "@/components/ui/input";

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
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              className="w-64 pl-9"
              readOnly
            />
          </div>
          <button
            type="button"
            className="glass-bubble flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-all hover:text-foreground hover:scale-105"
          >
            <Bell className="h-4 w-4" />
          </button>
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
