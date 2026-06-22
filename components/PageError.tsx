"use client";

import failedAnimation from "@/assets/animations/Failed.json";
import { LottiePlayer } from "@/components/LottiePlayer";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PageErrorProps {
  className?: string;
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function PageError({
  className,
  title = "Something went wrong",
  message = "Failed to load data. Please try again.",
  onRetry,
}: PageErrorProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 px-6 py-16 text-center",
        className
      )}
    >
      <LottiePlayer
        animationData={failedAnimation}
        className="h-44 w-44 sm:h-52 sm:w-52"
      />
      <div className="space-y-1">
        <p className="text-base font-semibold text-foreground">{title}</p>
        <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry} className="mt-2">
          Try again
        </Button>
      )}
    </div>
  );
}
