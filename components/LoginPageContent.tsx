"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { LoginForm } from "@/components/LoginForm";
import { PageLoader } from "@/components/PageLoader";

export function LoginPageContent() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && isAuthenticated()) {
      router.replace("/dashboard");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) {
    return <PageLoader className="min-h-screen" />;
  }

  if (isAuthenticated()) {
    return null;
  }

  return <LoginForm />;
}
