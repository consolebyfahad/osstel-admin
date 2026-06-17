"use client";

import loaderAnimation from "@/public/animations/Loader.json";
import { LottiePlayer } from "@/components/LottiePlayer";
import { cn } from "@/lib/utils";

interface PageLoaderProps {
  className?: string;
  message?: string;
}

export function PageLoader({
  className,
  message = "Loading...",
}: PageLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2 py-16",
        className
      )}
    >
      <LottiePlayer
        animationData={loaderAnimation}
        className="h-40 w-40 sm:h-48 sm:w-48"
      />
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
}
