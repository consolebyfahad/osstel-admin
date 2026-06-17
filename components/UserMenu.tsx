"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, Settings, User } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
import { AdminAvatar } from "@/components/AdminAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
  const router = useRouter();
  const { user, avatarUrl, logout } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    router.replace("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="rounded-full transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <AdminAvatar
            name={user.name}
            avatarUrl={avatarUrl}
            size="sm"
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex items-center gap-3 py-1">
            <AdminAvatar
              name={user.name}
              avatarUrl={avatarUrl}
              size="sm"
            />
            <div className="min-w-0">
              <p className="truncate font-medium text-foreground">{user.name}</p>
              <p className="truncate text-xs text-muted-foreground">{user.phone}</p>
            </div>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="h-4 w-4 text-gray-500" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <Settings className="h-4 w-4 text-gray-500" />
            Account Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
