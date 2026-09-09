import { localDateKey } from "@/lib/dates";
/** Local activity, water, weight logs — per account */

import { getSessionAccount, type LocalAccountId } from "@/lib/guest";

export type WeightLog = { date: string; weight_kg: number };
export type ActivityLog = {
  id: string;
  date: string;
  type: "steps" | "weights" | "cardio" | "walk" | "other";
  label: string;
  calories: number;
  minutes?: number;
  steps?: number;
};
export type DayMeta = {
  date: string;
  water_ml: number;
};

function accountId(): LocalAccountId {
  return getSessionAccount()?.id || "guest";
}

function k(suffix: string) {
  return `ricetrack_${suffix}_${accountId()}`;
}

export function getWeightLogs(): WeightLog[] {
  try {
    return JSON.parse(localStorage.getItem(k("weights")) || "[]");
  } catch {
    return [];
  }
}

export function addWeightLog(weight_kg: number, date?: string): WeightLog {
  const entry: WeightLog = {
    date: date || localDateKey(),
    weight_kg,
  };
  const logs = getWeightLogs().filter((l) => l.date !== entry.date);
  logs.push(entry);
  logs.sort((a, b) => a.date.localeCompare(b.date));
  localStorage.setItem(k("weights"), JSON.stringify(logs.slice(-180)));
  return entry;
}

export function getActivities(date?: string): ActivityLog[] {
  try {
    const all: ActivityLog[] = JSON.parse(localStorage.getItem(k("activities")) || "[]");
    if (!date) return all;
    return all.filter((a) => a.date === date);
  } catch {
    return [];
  }
}

export function addActivity(input: Omit<ActivityLog, "id" | "date"> & { date?: string }): ActivityLog {
  const entry: ActivityLog = {
    ...input,
    id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
    date: input.date || localDateKey(),
  };
  const all = getActivities();
  all.unshift(entry);
  localStorage.setItem(k("activities"), JSON.stringify(all.slice(0, 200)));
  return entry;
}

export function deleteActivity(id: string): void {
  const all = getActivities().filter((a) => a.id !== id);
  localStorage.setItem(k("activities"), JSON.stringify(all));
}

export function getWaterMl(date?: string): number {
  const d = date || localDateKey();
  try {
    const map = JSON.parse(localStorage.getItem(k("water")) || "{}") as Record<string, number>;
    return map[d] || 0;
  } catch {
    return 0;
  }
}

export function setWaterMl(ml: number, date?: string): void {
  const d = date || localDateKey();
  try {
    const map = JSON.parse(localStorage.getItem(k("water")) || "{}") as Record<string, number>;
    map[d] = Math.max(0, ml);
    localStorage.setItem(k("water"), JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function loggedDaysSet(mealDates: string[]): Set<string> {
  return new Set(mealDates.map((d) => d.slice(0, 10)));
}

/** Last 7 days ending today, Mon-Sun style labels */
export function weekStrip(today = new Date()): { date: string; label: string; dayNum: number }[] {
  const days: { date: string; label: string; dayNum: number }[] = [];
  const labels = ["S", "M", "T", "W", "T", "F", "S"];
  // Show current week Sun→Sat containing today
  const d = new Date(today);
  const dow = d.getDay(); // 0 Sun
  const start = new Date(d);
  start.setDate(d.getDate() - dow);
  for (let i = 0; i < 7; i++) {
    const x = new Date(start);
    x.setDate(start.getDate() + i);
    days.push({
      date: localDateKey(x),
      label: labels[i],
      dayNum: x.getDate(),
    });
  }
  return days;
}
