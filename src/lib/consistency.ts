import { localDateKey, localDateKeyFromIso } from "@/lib/dates";
import { getActivities } from "@/lib/activity";
import { getSleepLogs, getEnergyForDate } from "@/lib/wellness";
import { getStepsForDate } from "@/lib/steps";

export function last7Days(end = new Date()): string[] {
  const days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(end);
    d.setDate(d.getDate() - i);
    days.push(localDateKey(d));
  }
  return days;
}

export function mealDaysSet(loggedAts: string[]): Set<string> {
  return new Set(loggedAts.map((t) => localDateKeyFromIso(t)));
}

export function movedOnDate(date: string): boolean {
  if (getActivities(date).length > 0) return true;
  return getStepsForDate(date).steps >= 1000;
}

export function weekMealFlags(mealDates: Set<string>, end = new Date()): boolean[] {
  return last7Days(end).map((d) => mealDates.has(d));
}

export function weekMoveFlags(end = new Date()): boolean[] {
  return last7Days(end).map((d) => movedOnDate(d));
}

export function sleepHoursForDate(date: string): number | null {
  const s = getSleepLogs().find((x) => x.date === date);
  return s ? s.duration_hours : null;
}

export function energyLevelForDate(date: string): number | null {
  const e = getEnergyForDate(date);
  return e ? e.level : null;
}
