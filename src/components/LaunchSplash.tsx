"use client";

import { useEffect, useState } from "react";

const SESSION_KEY = "rt_splash_shown";

function isMarketingPath(path: string) {
  return (
    path === "/" ||
    path.startsWith("/terms") ||
    path.startsWith("/privacy") ||
    path.startsWith("/disclaimer")
  );
}

/**
 * PWA/app launch splash. Avoid usePathname() here so we don't need a Suspense
 * boundary in the root layout (that was crashing the client).
 */
export function LaunchSplash() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add("rt-hydrated");
    const boot = document.getElementById("rt-boot-splash");
    if (boot) boot.remove();

    const path = window.location.pathname || "/";
    if (isMarketingPath(path)) {
      setShow(false);
      return;
    }

    try {
      if (sessionStorage.getItem(SESSION_KEY)) {
        setShow(false);
        return;
      }
    } catch {
      /* private mode */
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
  }, []);

  if (!show) return null;

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
