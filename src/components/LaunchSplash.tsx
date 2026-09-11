"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "rt_splash_shown";

function isMarketingPath(path: string | null) {
  if (!path) return false;
  return (
    path === "/" ||
    path.startsWith("/terms") ||
    path.startsWith("/privacy") ||
    path.startsWith("/disclaimer")
  );
}

/** Phone/PWA launch: rice bowl spins 2 turns in 2s; background stays still. */
export function LaunchSplash() {
  const path = usePathname();
  const marketing = isMarketingPath(path);

  // Start visible for app routes so no logo flash before splash
  const [show, setShow] = useState(() => !marketing);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("rt-hydrated");
    // Remove static boot cover; this component owns the splash now
    const boot = document.getElementById("rt-boot-splash");
    if (boot) boot.remove();

    if (marketing) {
      setShow(false);
      return;
    }
    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        setShow(false);
        return;
      }
    } catch {
      /* ignore */
    }

    setShow(true);
    setLeaving(false);
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
  }, [path, marketing]);

  if (!show || marketing) return null;

  return (
    <div
      id="rt-launch-splash"
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#e8f5ec]"
      style={{
        opacity: leaving ? 0 : 1,
        transition: "opacity 0.35s ease-out",
        pointerEvents: leaving ? "none" : "auto",
      }}
      aria-hidden
    >
      {/* Circle clips the plate; only the bowl spins, not the full-screen bg */}
      <div
        className="relative overflow-hidden rounded-full bg-[#e8f5ec]"
        style={{ width: 192, height: 192 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-plate.png"
          alt=""
          width={192}
          height={192}
          className="rt-bowl-spin block h-full w-full object-cover"
          draggable={false}
        />
      </div>
    </div>
  );
}
