"use client";

import { useEffect } from "react";
import {
  getReminderSettings,
  notificationPermission,
  registerServiceWorker,
  startReminderScheduler,
} from "@/lib/reminders";

/** Registers SW + local meal reminder scheduler. */
export function ReminderBootstrap() {
  useEffect(() => {
    let stop: (() => void) | undefined;

    const sync = () => {
      stop?.();
      stop = undefined;
      if (getReminderSettings().enabled && notificationPermission() === "granted") {
        stop = startReminderScheduler();
      }
    };

    const onChange = () => sync();

    (async () => {
      await registerServiceWorker();
      sync();
    })();

    window.addEventListener("rt-reminders-changed", onChange);
    return () => {
      stop?.();
      window.removeEventListener("rt-reminders-changed", onChange);
    };
  }, []);

  return null;
}
