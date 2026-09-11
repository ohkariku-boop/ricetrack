import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

/**
 * Weekly job: promote approved library_suggestions into food_library.
 * Auth: Authorization: Bearer $CRON_SECRET or ?secret=
 */
export async function POST(req: Request) {
  const url = new URL(req.url);
  const header = req.headers.get("authorization") || "";
  const token = header.replace(/^Bearer\s+/i, "") || url.searchParams.get("secret") || "";
  const expected = process.env.CRON_SECRET || process.env.LIBRARY_CRON_SECRET;
  if (!expected || token !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceKey) {
    return NextResponse.json(
      { error: "Missing SUPABASE_SERVICE_ROLE_KEY or URL" },
      { status: 500 }
    );
  }

  const admin = createClient(supabaseUrl, serviceKey);

  const { data: approved, error } = await admin
    .from("library_suggestions")
    .select("*")
    .eq("status", "approved")
    .limit(200);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  let inserted = 0;
  const errors: string[] = [];

  for (const s of approved || []) {
    const id = `usr-${String(s.id).replace(/-/g, "").slice(0, 12)}`;
    const { error: upErr } = await admin.from("food_library").upsert(
      {
        id,
        name: s.name,
        cuisine: s.cuisine || "other",
        category: "main",
        calories: s.calories,
        protein: s.protein,
        carbs: s.carbs,
        fat: s.fat,
        portion: s.portion || "1 serving",
        tags: ["user-suggested"],
      },
      { onConflict: "id" }
    );
    if (upErr) {
      errors.push(`${s.name}: ${upErr.message}`);
      continue;
    }
    await admin
      .from("library_suggestions")
      .update({ status: "published", published_at: new Date().toISOString() })
      .eq("id", s.id);
    inserted++;
  }

  return NextResponse.json({
    ok: true,
    approved: approved?.length || 0,
    inserted,
    errors: errors.slice(0, 10),
  });
}

export async function GET(req: Request) {
  return POST(req);
}
