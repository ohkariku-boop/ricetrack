"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, TrendingUp, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

/** Center Log mark — fork + spoon (not the app favicon) */
function LogUtensils({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.85"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {/* fork */}
      <path d="M6 3v4.5c0 1 .6 1.5 1.4 1.5H8" />
      <path d="M6 3c0 0 .2 2.2 0 3.2" />
      <path d="M8.2 3v3.2" />
      <path d="M10.2 3c0 0-.2 2.2 0 3.2" />
      <path d="M8.1 9v12" />
      {/* spoon */}
      <path d="M16.5 8.5c1.8 0 3.2-1.5 3.2-3.2S18.3 2 16.5 2s-3.2 1.5-3.2 3.3c0 1.2.6 2.2 1.6 2.8v13.9" />
    </svg>
  );
}

const ITEMS = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/library", label: "Library", icon: BookOpen },
  { href: "/app", label: "Log", icon: null },
  { href: "/progress", label: "Progress", icon: TrendingUp },
  { href: "/settings", label: "Settings", icon: Settings2 },
] as const;

export function BottomNav() {
  const path = usePathname();
  return (
    <nav
      className="bottom-nav-fixed border-t border-border/70 bg-background/95 backdrop-blur-xl"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="mx-auto max-w-lg grid grid-cols-5 h-[3.6rem]">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            path === href || (href !== "/dashboard" && !!path?.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold tracking-wide",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              {href === "/app" ? (
                <span
                  className={cn(
                    "w-11 h-11 -mt-6 rounded-full flex items-center justify-center shadow-lg border transition-transform",
                    active
                      ? "bg-primary border-primary text-primary-foreground scale-105"
                      : "bg-card border-border text-foreground"
                  )}
                >
                  <LogUtensils className="w-5 h-5" />
                </span>
              ) : Icon ? (
                <Icon
                  className={cn("w-[1.35rem] h-[1.35rem]", active && "stroke-[2.25px]")}
                  strokeWidth={active ? 2.25 : 1.75}
                />
              ) : null}
              <span className={cn(href === "/app" && "mt-0.5")}>{label}</span>
              {active && href !== "/app" && (
                <span className="nav-active-dot absolute bottom-1" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
