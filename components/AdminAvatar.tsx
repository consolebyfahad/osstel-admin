import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/store/auth-store";

interface AdminAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-16 w-16 text-lg",
  xl: "h-24 w-24 text-2xl",
};

export function AdminAvatar({
  name,
  avatarUrl,
  size = "md",
  className,
}: AdminAvatarProps) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={name}
        className={cn(
          "rounded-full object-cover ring-2 ring-card",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-primary font-medium text-primary-foreground ring-2 ring-card",
        sizeClasses[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
