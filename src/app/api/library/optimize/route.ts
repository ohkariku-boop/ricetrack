import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Daily DB maintenance for food_library.
 * - Ensures search indexes exist (idempotent)
 * - ANALYZE refreshes planner stats as the catalog grows
 * - Returns row / index / size health report
 *
 * Auth: Authorization: Bearer $CRON_SECRET  (or ?secret=)
 * Schedulers: GitHub Actions daily-db-optimize.yml + Vercel Cron
 */
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function authorize(req: Request): boolean {
  const url = new URL(req.url);
  const header = req.headers.get("authorization") || "";
  const token =
    header.replace(/^Bearer\s+/i, "") || url.searchParams.get("secret") || "";
  const expected = process.env.CRON_SECRET || process.env.LIBRARY_CRON_SECRET;
  if (!expected) return false;
  return token === expected;
}

export async function POST(req: Request) {
  if (!authorize(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      {
        ok: false,
        skipped: true,
        reason:
          "Missing SUPABASE_SERVICE_ROLE_KEY. App falls back to seed JSON; run supabase/optimize_food_library.sql when cloud DB is live.",
        analyzed_at: new Date().toISOString(),
      },
      { status: 200 }
    );
  }

  const admin = createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const started = Date.now();
  const { data, error } = await admin.rpc("optimize_food_library");

  if (error) {
    const { count, error: cErr } = await admin
      .from("food_library")
      .select("*", { count: "exact", head: true });
    return NextResponse.json({
      ok: !cErr,
      rpc_error: error.message,
      hint: "Deploy function: paste supabase/optimize_food_library.sql into Supabase SQL editor, then re-run this job.",
      food_library_rows: count ?? null,
      analyzed: false,
      duration_ms: Date.now() - started,
      analyzed_at: new Date().toISOString(),
    });
  }

  return NextResponse.json({
    ok: true,
    ...(typeof data === "object" && data ? data : { result: data }),
    duration_ms: Date.now() - started,
  });
}

export async function GET(req: Request) {
  return POST(req);
}
