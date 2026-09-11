"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "rt_splash_shown";

/** Phone/PWA launch: rice bowl spins 2 turns in 2s; background stays still. */
export function LaunchSplash() {
  const path = usePathname();
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    if (
      path === "/" ||
      path?.startsWith("/terms") ||
      path?.startsWith("/privacy") ||
      path?.startsWith("/disclaimer")
    ) {
      return;
    }
    try {
      if (sessionStorage.getItem(SESSION_KEY)) return;
    } catch {
      /* ignore */
    }
    setShow(true);
    const t1 = window.setTimeout(() => setLeaving(true), 2000);
    const t2 = window.setTimeout(() => {
      setShow(false);
      try {
        sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
    }, 2400);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [path]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: "#e8f5ec",
        opacity: leaving ? 0 : 1,
        transition: "opacity 0.35s ease-out",
        pointerEvents: leaving ? "none" : "auto",
      }}
      aria-hidden
    >
      <div
        className="relative overflow-hidden rounded-full"
        style={{ width: 96, height: 96, background: "#e8f5ec" }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-plate.png"
          alt=""
          width={96}
          height={96}
          className="rt-bowl-spin block h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
