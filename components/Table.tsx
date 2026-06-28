import { cn } from "@/lib/utils";

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

export function Table({ children, className }: TableProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl glass-card text-card-foreground",
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-inherit">{children}</table>
      </div>
    </div>
  );
}

export function TableHeader({ children }: { children: React.ReactNode }) {
  return (
    <thead className="border-b border-border/60 bg-muted/30 backdrop-blur-sm">
      {children}
    </thead>
  );
}

export function TableBody({ children }: { children: React.ReactNode }) {
  return <tbody className="divide-y divide-border">{children}</tbody>;
}

export function TableRow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <tr className={cn("transition-colors hover:bg-accent/50", className)}>
      {children}
    </tr>
  );
}

export function TableHead({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground",
        className
      )}
    >
      {children}
    </th>
  );
}

export function TableCell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td className={cn("px-4 py-3.5 text-inherit", className)}>{children}</td>
  );
}

export function TableEmpty({
  message = "No results found.",
}: {
  message?: string;
}) {
  return (
    <tr>
      <td
        colSpan={100}
        className="px-4 py-12 text-center text-sm text-muted-foreground"
      >
        {message}
      </td>
    </tr>
  );
}
