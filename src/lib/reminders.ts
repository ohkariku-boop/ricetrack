export type ReminderSlot = {
  id: string;
  label: string;
  time: string; // "HH:MM" 24h local
  enabled: boolean;
};

export type ReminderSettings = {
  enabled: boolean;
  slots: ReminderSlot[];
};

const KEY = "ricetrack_reminders_v1";

export const DEFAULT_REMINDERS: ReminderSettings = {
  enabled: false,
  slots: [
    { id: "breakfast", label: "Breakfast", time: "08:00", enabled: true },
    { id: "lunch", label: "Lunch", time: "12:30", enabled: true },
    { id: "dinner", label: "Dinner", time: "19:00", enabled: true },
  ],
};

export function getReminderSettings(): ReminderSettings {
  if (typeof window === "undefined") return DEFAULT_REMINDERS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return structuredClone(DEFAULT_REMINDERS);
    const parsed = JSON.parse(raw) as ReminderSettings;
    if (!parsed.slots?.length) return structuredClone(DEFAULT_REMINDERS);
    return {
      enabled: !!parsed.enabled,
      slots: parsed.slots.map((s) => ({
        id: String(s.id),
        label: String(s.label || s.id),
        time: /^\d{2}:\d{2}$/.test(s.time) ? s.time : "12:00",
        enabled: s.enabled !== false,
      })),
    };
  } catch {
    return structuredClone(DEFAULT_REMINDERS);
  }
}

export function saveReminderSettings(s: ReminderSettings) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new Event("rt-reminders-changed"));
}

export function notificationPermission(): NotificationPermission | "unsupported" {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<NotificationPermission | "unsupported"> {
  if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
  if (Notification.permission === "granted") return "granted";
  if (Notification.permission === "denied") return "denied";
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    await navigator.serviceWorker.ready;
    // Ensure we control this page when possible
    if (navigator.serviceWorker.controller == null && reg.waiting) {
      reg.waiting.postMessage({ type: "SKIP_WAITING" });
    }
    return reg;
  } catch (err) {
    console.warn("SW register failed", err);
    return null;
  }
}

export function nextOccurrence(timeHHMM: string, from = new Date()): Date {
  const [h, m] = timeHHMM.split(":").map(Number);
  const d = new Date(from);
  d.setSeconds(0, 0);
  d.setHours(h || 0, m || 0, 0, 0);
  if (d.getTime() <= from.getTime() + 15_000) {
    d.setDate(d.getDate() + 1);
  }
  return d;
}

export function nextReminder(
  settings: ReminderSettings,
  from = new Date()
): { slot: ReminderSlot; at: Date } | null {
  if (!settings.enabled) return null;
  const active = settings.slots.filter((s) => s.enabled);
  if (!active.length) return null;
  let best: { slot: ReminderSlot; at: Date } | null = null;
  for (const slot of active) {
    const at = nextOccurrence(slot.time, from);
    if (!best || at.getTime() < best.at.getTime()) best = { slot, at };
  }
  return best;
}

const FIRED_KEY = "ricetrack_reminder_fired";

function firedKey(slotId: string, at: Date) {
  const day = `${at.getFullYear()}-${at.getMonth() + 1}-${at.getDate()}`;
  return `${slotId}@${day}@${at.getHours()}:${at.getMinutes()}`;
}

function alreadyFired(key: string) {
  try {
    const raw = sessionStorage.getItem(FIRED_KEY);
    const set = raw ? (JSON.parse(raw) as string[]) : [];
    return set.includes(key);
  } catch {
    return false;
  }
}

function markFired(key: string) {
  try {
    const raw = sessionStorage.getItem(FIRED_KEY);
    const set = raw ? (JSON.parse(raw) as string[]) : [];
    set.push(key);
    sessionStorage.setItem(FIRED_KEY, JSON.stringify(set.slice(-40)));
  } catch {
    /* ignore */
  }
}

export type ShowReminderResult = {
  ok: boolean;
  method?: "service-worker" | "notification-api" | "in-app-only";
  error?: string;
};

/**
 * Show a meal reminder. Prefers ServiceWorkerRegistration.showNotification
 * (most reliable). Falls back to Notification constructor.
 * Note: many mobile browsers suppress heads-up banners while the tab is focused;
 * the notification still often appears in the shade.
 */
export async function showMealReminder(slot: ReminderSlot): Promise<ShowReminderResult> {
  const title = "RiceTrack";
  const body = `${slot.label}: time to log a meal.`;
  const tag = `rt-${slot.id}-${Date.now()}`;
  const options: NotificationOptions = {
    body,
    icon: "/icon-192.png",
    badge: "/favicon-32.png",
    tag,
    requireInteraction: false,
    data: { url: "/app" },
  };

  if (!("Notification" in window)) {
    return { ok: false, error: "Notifications not supported in this browser." };
  }
  if (Notification.permission !== "granted") {
    return { ok: false, error: "Notification permission is not granted." };
  }

  // 1) Direct SW registration API (best)
  if ("serviceWorker" in navigator) {
    try {
      const reg = (await registerServiceWorker()) || (await navigator.serviceWorker.ready);
      if (reg?.showNotification) {
        await reg.showNotification(title, options);
        return { ok: true, method: "service-worker" };
      }
    } catch (err) {
      console.warn("SW showNotification failed", err);
    }
  }

  // 2) Page Notification API
  try {
    const n = new Notification(title, options);
    // Some browsers need a reference held briefly
    window.setTimeout(() => n.close(), 8000);
    return { ok: true, method: "notification-api" };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Could not show notification.";
    return { ok: false, error: msg };
  }
}

export function startReminderScheduler(): () => void {
  let timer: ReturnType<typeof setTimeout> | null = null;
  let stopped = false;

  const clear = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
  };

  const arm = () => {
    clear();
    if (stopped) return;
    if (notificationPermission() !== "granted") return;
    const settings = getReminderSettings();
    const next = nextReminder(settings);
    if (!next) return;

    const delay = Math.max(1000, next.at.getTime() - Date.now());
    timer = setTimeout(async () => {
      const key = firedKey(next.slot.id, next.at);
      if (!alreadyFired(key)) {
        markFired(key);
        await showMealReminder(next.slot);
      }
      arm();
    }, Math.min(delay, 24 * 60 * 60 * 1000));
  };

  arm();
  const onChange = () => arm();
  window.addEventListener("rt-reminders-changed", onChange);
  document.addEventListener("visibilitychange", onChange);

  return () => {
    stopped = true;
    clear();
    window.removeEventListener("rt-reminders-changed", onChange);
    document.removeEventListener("visibilitychange", onChange);
  };
}
