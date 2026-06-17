"use client";

import Lottie from "lottie-react";
import { cn } from "@/lib/utils";

interface LottiePlayerProps {
  animationData: object;
  className?: string;
  loop?: boolean;
}

export function LottiePlayer({
  animationData,
  className,
  loop = true,
}: LottiePlayerProps) {
  return (
    <Lottie
      animationData={animationData}
      loop={loop}
      className={cn("mx-auto", className)}
    />
  );
}
