import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border",
  {
    variants: {
      variant: {
        default:
          "bg-primary-100 text-primary border-primary-200 dark:bg-primary-200 dark:text-primary-foreground dark:border-primary-300",
        secondary:
          "bg-secondary-100 text-secondary-foreground border-secondary-200 dark:bg-secondary-200 dark:text-secondary-foreground",
        success:
          "bg-success/15 text-success border-success/30 dark:bg-success/10",
        warning:
          "bg-warning/20 text-foreground border-warning/40 dark:bg-warning/15 dark:text-warning",
        destructive:
          "bg-error/15 text-error border-error/30 dark:bg-error/10",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
