import { localDateKey, localDateKeyDaysAgo } from "@/lib/dates";
/** Sleep + energy logs — per local account */

import { getSessionAccount, type LocalAccountId } from "@/lib/guest";

export type SleepLog = {
  date: string; // wake date (morning of)
  bed_time: string; // HH:mm previous evening-ish
  wake_time: string; // HH:mm
  duration_hours: number;
  quality?: 1 | 2 | 3 | 4 | 5;
};

export type EnergyLog = {
  date: string;
  /** 1 = drained, 5 = excellent */
  level: 1 | 2 | 3 | 4 | 5;
  note?: string;
};

function accountId(): LocalAccountId {
  return getSessionAccount()?.id || "guest";
}

function k(suffix: string) {
  return `ricetrack_${suffix}_${accountId()}`;
}

export function calcDurationHours(bed: string, wake: string): number {
  const [bh, bm] = bed.split(":").map(Number);
  const [wh, wm] = wake.split(":").map(Number);
  let start = bh * 60 + (bm || 0);
  let end = wh * 60 + (wm || 0);
  if (end <= start) end += 24 * 60; // crossed midnight
  return Math.round(((end - start) / 60) * 10) / 10;
}

export function getSleepLogs(): SleepLog[] {
  try {
    return JSON.parse(localStorage.getItem(k("sleep")) || "[]");
  } catch {
    return [];
  }
}

export function getSleepForDate(date: string): SleepLog | null {
  return getSleepLogs().find((s) => s.date === date) || null;
}

export function saveSleepLog(input: Omit<SleepLog, "duration_hours"> & { duration_hours?: number }): SleepLog {
  const duration_hours =
    input.duration_hours ?? calcDurationHours(input.bed_time, input.wake_time);
  const entry: SleepLog = {
    date: input.date,
    bed_time: input.bed_time,
    wake_time: input.wake_time,
    duration_hours,
    quality: input.quality,
  };
  const all = getSleepLogs().filter((s) => s.date !== entry.date);
  all.push(entry);
  all.sort((a, b) => a.date.localeCompare(b.date));
  localStorage.setItem(k("sleep"), JSON.stringify(all.slice(-120)));
  return entry;
}

export function getEnergyLogs(): EnergyLog[] {
  try {
    return JSON.parse(localStorage.getItem(k("energy")) || "[]");
  } catch {
    return [];
  }
}

export function getEnergyForDate(date: string): EnergyLog | null {
  return getEnergyLogs().find((e) => e.date === date) || null;
}

export function saveEnergyLog(level: 1 | 2 | 3 | 4 | 5, date?: string, note?: string): EnergyLog {
  const d = date || localDateKey();
  const entry: EnergyLog = { date: d, level, note };
  const all = getEnergyLogs().filter((e) => e.date !== d);
  all.push(entry);
  all.sort((a, b) => a.date.localeCompare(b.date));
  localStorage.setItem(k("energy"), JSON.stringify(all.slice(-120)));
  return entry;
}

export function avgSleepHours(days = 7): number | null {
  const key = localDateKeyDaysAgo(days);
  const recent = getSleepLogs().filter((s) => s.date >= key);
  if (!recent.length) return null;
  return Math.round((recent.reduce((a, s) => a + s.duration_hours, 0) / recent.length) * 10) / 10;
}

export function avgEnergy(days = 7): number | null {
  const key = localDateKeyDaysAgo(days);
  const recent = getEnergyLogs().filter((e) => e.date >= key);
  if (!recent.length) return null;
  return Math.round((recent.reduce((a, e) => a + e.level, 0) / recent.length) * 10) / 10;
}

export const ENERGY_LABELS: Record<number, string> = {
  1: "Drained",
  2: "Low",
  3: "Okay",
  4: "Good",
  5: "On fire",
};
