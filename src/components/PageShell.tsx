"use client";

import { cn } from "@/lib/utils";

export function PageShell({
  children,
  className,
  withNav = true,
}: {
  children: React.ReactNode;
  className?: string;
  withNav?: boolean;
}) {
  return (
    <div
      className={cn(
        "min-h-screen bg-background text-foreground",
        withNav && "safe-bottom",
        className
      )}
    >
      {children}
    </div>
  );
}

export function AppHeader({
  title,
  subtitle,
  right,
}: {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  right?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto max-w-lg px-4 h-14 flex items-center justify-between gap-3">
        <div className="leading-tight min-w-0">
          <div className="font-semibold tracking-tight truncate">{title}</div>
          {subtitle ? (
            <div className="text-[11px] text-muted-foreground truncate">{subtitle}</div>
          ) : null}
        </div>
        {right ? <div className="flex items-center gap-1 shrink-0">{right}</div> : null}
      </div>
    </header>
  );
}
