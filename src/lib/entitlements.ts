/**
 * Free vs Pro entitlements.
 * Stripe wiring comes later; mock subscribe sets local Pro status.
 */

import { getSessionAccount, isPaidUser, type LocalAccountId } from "@/lib/guest";

export const FREE_AI_SCANS_PER_WEEK = 5;

export type PlanId = "free" | "pro";

const SUB_KEY = "ricetrack_subscription_v1";
const USAGE_KEY = "ricetrack_ai_usage_v1";

export type SubscriptionState = {
  plan: PlanId;
  /** ISO when mock/real sub started */
  since?: string;
  /** source: mock | stripe | demo_account */
  source?: "mock" | "stripe" | "demo_account";
};

function weekKey(d = new Date()): string {
  // ISO week-ish: year + week number
  const start = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = start.getUTCDay() || 7;
  start.setUTCDate(start.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(start.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((start.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${start.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function getSubscription(): SubscriptionState {
  if (typeof window === "undefined") return { plan: "free" };
  // Demo Joe/Mel are always Pro
  if (isPaidUser()) {
    return { plan: "pro", source: "demo_account", since: new Date().toISOString() };
  }
  try {
    const raw = localStorage.getItem(SUB_KEY);
    if (!raw) return { plan: "free" };
    const parsed = JSON.parse(raw) as SubscriptionState;
    if (parsed.plan === "pro") return parsed;
    return { plan: "free" };
  } catch {
    return { plan: "free" };
  }
}

export function isPro(): boolean {
  return getSubscription().plan === "pro";
}

/** Mock checkout — replace with Stripe later */
export function activateMockPro(): SubscriptionState {
  const state: SubscriptionState = {
    plan: "pro",
    since: new Date().toISOString(),
    source: "mock",
  };
  if (typeof window !== "undefined") {
    localStorage.setItem(SUB_KEY, JSON.stringify(state));
    window.dispatchEvent(new Event("rt-plan-changed"));
  }
  return state;
}

export function cancelMockPro(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SUB_KEY, JSON.stringify({ plan: "free" }));
  window.dispatchEvent(new Event("rt-plan-changed"));
}

type UsageMap = Record<string, number>;

function readUsage(): UsageMap {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(USAGE_KEY) || "{}") as UsageMap;
  } catch {
    return {};
  }
}

function writeUsage(m: UsageMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem(USAGE_KEY, JSON.stringify(m));
}

export function getAiScansUsedThisWeek(): number {
  const m = readUsage();
  return Number(m[weekKey()] || 0);
}

export function getAiScansRemaining(): number | "unlimited" {
  if (isPro()) return "unlimited";
  return Math.max(0, FREE_AI_SCANS_PER_WEEK - getAiScansUsedThisWeek());
}

export function canUseAiScan(): { ok: boolean; reason?: string; remaining: number | "unlimited" } {
  if (isPro()) return { ok: true, remaining: "unlimited" };
  const used = getAiScansUsedThisWeek();
  const remaining = Math.max(0, FREE_AI_SCANS_PER_WEEK - used);
  if (remaining <= 0) {
    return {
      ok: false,
      remaining: 0,
      reason: `Free plan includes ${FREE_AI_SCANS_PER_WEEK} AI scans per week. Upgrade to Pro for unlimited.`,
    };
  }
  return { ok: true, remaining };
}

export function recordAiScan(): void {
  if (isPro()) return;
  const m = readUsage();
  const k = weekKey();
  m[k] = (Number(m[k]) || 0) + 1;
  writeUsage(m);
}

export type FeatureRow = {
  name: string;
  free: string;
  pro: string;
};

export const PLAN_FEATURES: FeatureRow[] = [
  { name: "AI photo & text analysis", free: `${FREE_AI_SCANS_PER_WEEK} / week`, pro: "Unlimited" },
  { name: "Manual & library logging", free: "Unlimited", pro: "Unlimited" },
  { name: "Asian food library", free: "Full access", pro: "Full access" },
  { name: "Edit macros & meal slots", free: "Yes", pro: "Yes" },
  { name: "Backdate meals", free: "Yes", pro: "Yes" },
  { name: "Meal reminders", free: "Yes", pro: "Yes" },
  { name: "Progress & weekly history", free: "Yes", pro: "Yes" },
  { name: "Suggest dishes to library", free: "Limited", pro: "Priority" },
  { name: "Pro badge", free: "—", pro: "Yes" },
  { name: "Support", free: "Standard", pro: "Priority email" },
];

export const PRO_PRICE_MONTHLY = 3.99;
export const PRO_PRICE_YEARLY = 35;
