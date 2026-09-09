"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, TrendingUp, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { RiceLogo } from "@/components/RiceLogo";

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
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border/70 bg-background/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
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
                      ? "bg-primary border-primary scale-105"
                      : "bg-card border-border"
                  )}
                >
                  <RiceLogo size={24} />
                </span>
              ) : Icon ? (
                <Icon
                  className={cn("w-[1.35rem] h-[1.35rem]", active && "stroke-[2.25px]")}
                  strokeWidth={active ? 2.25 : 1.75}
                />
              ) : null}
              <span className={cn(href === "/app" && "mt-0.5")}>{label}</span>
              {active && href !== "/app" && <span className="nav-active-dot absolute bottom-1" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
