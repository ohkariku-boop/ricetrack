import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Daily DB maintenance for food_library.
 * - Ensures planner stats (ANALYZE) stay fresh as the catalog grows
 * - Reports row + index counts
 *
 * Auth: Authorization: Bearer $CRON_SECRET  (or ?secret=)
 */
export async function POST(req: Request) {
  const url = new URL(req.url);
  const header = req.headers.get("authorization") || "";
  const token =
    header.replace(/^Bearer\s+/i, "") || url.searchParams.get("secret") || "";
  const expected = process.env.CRON_SECRET || process.env.LIBRARY_CRON_SECRET;
  if (!expected || token !== expected) {
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
          "Missing SUPABASE_SERVICE_ROLE_KEY. Seed search still works; run optimize SQL in Supabase when cloud DB is used.",
      },
      { status: 200 }
    );
  }

  const admin = createClient(supabaseUrl, serviceKey);

  // Prefer RPC (ANALYZE + stats)
  const { data, error } = await admin.rpc("optimize_food_library");
  if (error) {
    // Fallback: lightweight count probe if function not deployed yet
    const { count, error: cErr } = await admin
      .from("food_library")
      .select("*", { count: "exact", head: true });
    return NextResponse.json({
      ok: !cErr,
      rpc_error: error.message,
      hint: "Run supabase/schema.sql optimize section (pg_trgm + optimize_food_library) in SQL editor.",
      food_library_rows: count ?? null,
      analyzed: false,
    });
  }

  return NextResponse.json({ ok: true, ...(typeof data === "object" && data ? data : { result: data }) });
}

export async function GET(req: Request) {
  return POST(req);
}
