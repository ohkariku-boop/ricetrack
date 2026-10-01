/**
 * Server-side AI scan quota (P0).
 * Client localStorage is UX only — this is the real limit.
 *
 * Requires Supabase table public.ai_scan_usage (see supabase/ai_scan_usage.sql)
 * and SUPABASE_SERVICE_ROLE_KEY.
 */

import { createClient } from "@supabase/supabase-js";
import { createHash, randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export const FREE_AI_SCANS_PER_WEEK = 5;
export const QUOTA_COOKIE = "rt_qid";

/** ISO week key: 2026-W40 */
export function weekKey(d = new Date()): string {
  const start = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const day = start.getUTCDay() || 7;
  start.setUTCDate(start.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(start.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((start.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${start.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** Stable anonymous id in httpOnly cookie */
export function getOrCreateQuotaId(req: NextRequest): { id: string; setCookie: boolean } {
  const existing = req.cookies.get(QUOTA_COOKIE)?.value;
  if (existing && /^[a-zA-Z0-9_-]{8,64}$/.test(existing)) {
    return { id: existing, setCookie: false };
  }
  return { id: randomUUID().replace(/-/g, ""), setCookie: true };
}

function ipKey(req: NextRequest): string {
  const fwd = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const real = req.headers.get("x-real-ip")?.trim();
  const ip = fwd || real || "unknown";
  return createHash("sha256").update(ip).digest("hex").slice(0, 24);
}

export type QuotaResult =
  | { ok: true; remaining: number; used: number; week: string; clientKey: string; setCookieId?: string }
  | {
      ok: false;
      status: 429 | 503;
      error: string;
      remaining: number;
      used: number;
      week: string;
      clientKey: string;
      setCookieId?: string;
    };

/**
 * Check + increment one AI scan. Returns remaining after increment on success.
 * Uses client cookie id + IP hash so clearing cookies alone is not enough to fully reset
 * (IP bucket still counts). Full reset needs new IP + new cookie.
 */
export async function consumeAiScan(req: NextRequest): Promise<QuotaResult> {
  const week = weekKey();
  const { id, setCookie } = getOrCreateQuotaId(req);
  const ip = ipKey(req);
  // Primary key: device cookie. Secondary enforcement also writes IP key.
  const clientKey = `d:${id}`;
  const ipBucket = `ip:${ip}`;
  const setCookieId = setCookie ? id : undefined;

  // Optional: unlimited only when explicitly enabled (e.g. internal)
  if (process.env.AI_QUOTA_DISABLED === "1") {
    return { ok: true, remaining: 999, used: 0, week, clientKey, setCookieId };
  }

  const admin = adminClient();
  if (!admin) {
    return {
      ok: false,
      status: 503,
      error: "AI quota not configured (missing Supabase service role). Scans temporarily unavailable.",
      remaining: 0,
      used: 0,
      week,
      clientKey,
      setCookieId,
    };
  }

  try {
    // Check device quota
    const usedDevice = await getCount(admin, clientKey, week);
    if (usedDevice >= FREE_AI_SCANS_PER_WEEK) {
      return {
        ok: false,
        status: 429,
        error: `Free plan includes ${FREE_AI_SCANS_PER_WEEK} AI scans per week. Limit reached. Manual and library logging stay free.`,
        remaining: 0,
        used: usedDevice,
        week,
        clientKey,
        setCookieId,
      };
    }

    // Soft IP cap: 2× free limit (shared networks) — stops API hammering
    const usedIp = await getCount(admin, ipBucket, week);
    if (usedIp >= FREE_AI_SCANS_PER_WEEK * 2) {
      return {
        ok: false,
        status: 429,
        error: `Too many AI scans from this network this week. Try again next week or use manual logging.`,
        remaining: 0,
        used: usedDevice,
        week,
        clientKey,
        setCookieId,
      };
    }

    const nextDevice = await incrementCount(admin, clientKey, week);
    await incrementCount(admin, ipBucket, week);

    if (nextDevice > FREE_AI_SCANS_PER_WEEK) {
      // Race: another request won — still deny if over
      return {
        ok: false,
        status: 429,
        error: `Free plan includes ${FREE_AI_SCANS_PER_WEEK} AI scans per week. Limit reached.`,
        remaining: 0,
        used: nextDevice,
        week,
        clientKey,
        setCookieId,
      };
    }

    return {
      ok: true,
      remaining: Math.max(0, FREE_AI_SCANS_PER_WEEK - nextDevice),
      used: nextDevice,
      week,
      clientKey,
      setCookieId,
    };
  } catch (e) {
    console.error("AI quota error:", e);
    // Fail closed on quota errors so we don't burn OpenRouter credits
    return {
      ok: false,
      status: 503,
      error: "Could not verify AI scan quota. Please try again in a moment.",
      remaining: 0,
      used: 0,
      week,
      clientKey,
      setCookieId,
    };
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getCount(admin: any, clientKey: string, week: string): Promise<number> {
  const { data, error } = await admin
    .from("ai_scan_usage")
    .select("scan_count")
    .eq("client_key", clientKey)
    .eq("week_key", week)
    .maybeSingle();
  if (error) throw error;
  return Number(data?.scan_count || 0);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function incrementCount(admin: any, clientKey: string, week: string): Promise<number> {
  const current = await getCount(admin, clientKey, week);
  const next = current + 1;
  const { error } = await admin.from("ai_scan_usage").upsert(
    {
      client_key: clientKey,
      week_key: week,
      scan_count: next,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "client_key,week_key" }
  );
  if (error) throw error;
  return next;
}

export function applyQuotaCookie(res: NextResponse, setCookieId?: string) {
  if (!setCookieId) return res;
  res.cookies.set(QUOTA_COOKIE, setCookieId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 400, // ~13 months
  });
  return res;
}
