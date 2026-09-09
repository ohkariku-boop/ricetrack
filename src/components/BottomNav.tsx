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
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto max-w-lg grid grid-cols-5 h-14">
        {ITEMS.map(({ href, label, icon: Icon }) => {
          const active =
            path === href ||
            (href !== "/dashboard" && !!path?.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              {href === "/app" ? (
                <span
                  className={cn(
                    "w-10 h-10 -mt-5 rounded-full flex items-center justify-center shadow-md border border-border",
                    active
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-foreground"
                  )}
                >
                  <RiceLogo size={22} />
                </span>
              ) : Icon ? (
                <Icon className="w-5 h-5" />
              ) : null}
              {label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
