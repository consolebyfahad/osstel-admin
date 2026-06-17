"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { setThemeWithAnimation } from "@/lib/theme-transition";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" className="h-9 w-9" disabled>
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const next = isDark ? "light" : "dark";
    setThemeWithAnimation(setTheme, next, e);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className={cn(
        "group glass-bubble relative h-9 w-9 overflow-hidden transition-transform duration-300",
        "hover:scale-105 active:scale-95",
        isDark && "border-primary-200/30"
      )}
      onClick={handleToggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to night mode"}
    >
      {/* Glow ring on hover */}
      <span
        className={cn(
          "pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-500",
          "bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent",
          "group-hover:opacity-100"
        )}
        aria-hidden
      />

      <span className="relative flex h-4 w-4 items-center justify-center">
        <Sun
          className={cn(
            "absolute h-4 w-4 text-warning transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            isDark
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          )}
        />
        <Moon
          className={cn(
            "absolute h-4 w-4 text-primary transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
            isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          )}
        />
      </span>
    </Button>
  );
}
