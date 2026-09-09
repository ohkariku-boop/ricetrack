/** Best-effort step tracking for PWA — sensor when available, manual otherwise */

import { localDateKey } from "@/lib/dates";

const KEY = "ricetrack_steps_v1";

type DaySteps = { date: string; steps: number; source: "sensor" | "manual" | "estimate" };

function today() {
  return localDateKey();
}

function load(): Record<string, DaySteps> {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "{}");
  } catch {
    return {};
  }
}

function save(map: Record<string, DaySteps>) {
  localStorage.setItem(KEY, JSON.stringify(map));
}

export function getStepsForDate(date: string): DaySteps {
  const map = load();
  return map[date] || { date, steps: 0, source: "manual" };
}

export function getTodaySteps(): DaySteps {
  const map = load();
  const d = today();
  return map[d] || { date: d, steps: 0, source: "manual" };
}

export function setTodaySteps(steps: number, source: DaySteps["source"] = "manual") {
  const map = load();
  const d = today();
  map[d] = { date: d, steps: Math.max(0, Math.round(steps)), source };
  save(map);
  return map[d];
}

export function addTodaySteps(delta: number, source: DaySteps["source"] = "manual") {
  const cur = getTodaySteps();
  return setTodaySteps(cur.steps + delta, source);
}

/**
 * Try continuous motion-based step estimate (mobile browsers).
 * Not as accurate as native pedometer — we label as estimate.
 */
export function startStepListener(onUpdate: (steps: number) => void): () => void {
  if (typeof window === "undefined") return () => {};
  let lastMag = 0;
  let lastStepAt = 0;
  let local = getTodaySteps().steps;

  const handler = (e: DeviceMotionEvent) => {
    const a = e.accelerationIncludingGravity;
    if (!a || a.x == null || a.y == null || a.z == null) return;
    const mag = Math.sqrt(a.x * a.x + a.y * a.y + a.z * a.z);
    const diff = Math.abs(mag - lastMag);
    lastMag = mag;
    const now = Date.now();
    // crude peak detection
    if (diff > 1.8 && now - lastStepAt > 280) {
      lastStepAt = now;
      local += 1;
      if (local % 5 === 0) {
        setTodaySteps(local, "estimate");
        onUpdate(local);
      }
    }
  };

  const start = async () => {
    try {
      // iOS 13+ permission
      const anyDM = DeviceMotionEvent as unknown as {
        requestPermission?: () => Promise<string>;
      };
      if (typeof anyDM.requestPermission === "function") {
        const res = await anyDM.requestPermission();
        if (res !== "granted") return;
      }
      window.addEventListener("devicemotion", handler);
    } catch {
      /* ignore */
    }
  };
  start();

  return () => window.removeEventListener("devicemotion", handler);
}
