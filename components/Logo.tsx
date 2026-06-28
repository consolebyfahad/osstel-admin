"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "icon" | "full";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: { icon: 32, full: { width: 120, height: 36 } },
  md: { icon: 40, full: { width: 160, height: 48 } },
  lg: { icon: 48, full: { width: 200, height: 60 } },
};

export function Logo({ variant = "full", size = "md", className }: LogoProps) {
  if (variant === "icon") {
    const iconSize = sizes[size].icon;
    return (
      <Image
        src="/osstel.png"
        alt="Osstel"
        width={iconSize}
        height={iconSize}
        className={cn("object-contain", className)}
        priority
      />
    );
  }
  
  const { width, height } = sizes[size].full;
  return (
    <Image
      src="/osstel.png"
      alt="Osstel Admin"
      width={width}
      height={height}
      className={cn("object-contain", className)}
      priority
    />
  );
}
