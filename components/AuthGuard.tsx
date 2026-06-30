"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { PageLoader } from "@/components/PageLoader";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }

    if (user && user.role !== "admin") {
      logout();
      router.replace("/login");
    }
  }, [hydrated, isAuthenticated, user, logout, router]);

  if (!hydrated) {
    return <PageLoader className="min-h-screen" />;
  }

  if (!isAuthenticated() || (user && user.role !== "admin")) {
    return null;
  }

  return <>{children}</>;
}
