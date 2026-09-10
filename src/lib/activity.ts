import { localDateKey } from "@/lib/dates";
import { getSessionAccount, type LocalAccountId } from "@/lib/guest";

export type WeightLog = { date: string; weight_kg: number };

export type ActivityType = "walk" | "weights" | "cardio" | "other";

export type ActivityLog = {
  id: string;
  date: string;
  type: ActivityType;
  label: string;
  calories: number;
  /** duration in minutes */
  minutes?: number;
  /** walking / running distance */
  distance_km?: number;
  sets?: number;
  reps?: number;
  note?: string;
};

function accountId(): LocalAccountId {
  return getSessionAccount()?.id || "guest";
}

function k(suffix: string) {
  return `ricetrack_${suffix}_${accountId()}`;
}

/** Rough kcal estimates — honest enough for logging, not lab-grade */
export function estimateActivityCalories(input: {
  type: ActivityType;
  minutes?: number;
  distance_km?: number;
  sets?: number;
  reps?: number;
}): number {
  const { type, minutes = 0, distance_km = 0, sets = 0, reps = 0 } = input;
  if (type === "walk") {
    if (distance_km > 0) return Math.round(distance_km * 55); // ~55 kcal/km easy pace
    if (minutes > 0) return Math.round(minutes * 4); // ~4 kcal/min walking
  }
  if (type === "cardio") {
    if (minutes > 0) return Math.round(minutes * 8);
  }
  if (type === "weights") {
    // strength: prefer volume proxy, else time
    if (sets > 0 && reps > 0) return Math.round(sets * reps * 0.5 + sets * 5);
    if (minutes > 0) return Math.round(minutes * 5);
  }
  if (minutes > 0) return Math.round(minutes * 5);
  return 50;
}

export function formatActivityDetail(a: ActivityLog): string {
  const parts: string[] = [];
  if (a.distance_km) parts.push(`${a.distance_km} km`);
  if (a.minutes) parts.push(`${a.minutes} min`);
  if (a.sets && a.reps) parts.push(`${a.sets}×${a.reps} reps`);
  else if (a.sets) parts.push(`${a.sets} sets`);
  else if (a.reps) parts.push(`${a.reps} reps`);
  if (a.note) parts.push(a.note);
  return parts.join(" · ");
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

export function addActivity(
  input: Omit<ActivityLog, "id" | "date"> & { date?: string }
): ActivityLog {
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

export function weekStrip(
  anchor = new Date(),
  weekOffset = 0
): { date: string; label: string; dayNum: number }[] {
  const days: { date: string; label: string; dayNum: number }[] = [];
  const labels = ["S", "M", "T", "W", "T", "F", "S"];
  const d = new Date(anchor);
  d.setDate(d.getDate() + weekOffset * 7);
  const dow = d.getDay();
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
