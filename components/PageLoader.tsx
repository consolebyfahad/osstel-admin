import { cn } from "@/lib/utils";

interface PageLoaderProps {
  className?: string;
  message?: string;
}

export function PageLoader({ className, message = "Loading..." }: PageLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-24",
        className
      )}
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
