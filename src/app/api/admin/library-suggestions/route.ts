import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getAdminSecret, isAdminAuthorized } from "@/lib/admin-auth";

export const dynamic = "force-dynamic";

function adminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/** GET — list suggestions by status (default pending) */
export async function GET(req: Request) {
  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = adminClient();
  if (!admin) {
    return NextResponse.json(
      {
        error: "Missing SUPABASE_SERVICE_ROLE_KEY",
        hint: "Set service role on Vercel to manage cloud suggestions.",
        items: [],
      },
      { status: 503 }
    );
  }

  const url = new URL(req.url);
  const status = url.searchParams.get("status") || "pending";
  const limit = Math.min(Number(url.searchParams.get("limit") || 50), 200);

  let q = admin
    .from("library_suggestions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (status !== "all") {
    q = q.eq("status", status);
  }

  const { data, error } = await q;
  if (error) {
    return NextResponse.json(
      {
        error: error.message,
        hint: "Create table via supabase/schema.sql library_suggestions section.",
        items: [],
      },
      { status: 500 }
    );
  }

  const { count: pendingCount } = await admin
    .from("library_suggestions")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending");

  const { count: approvedCount } = await admin
    .from("library_suggestions")
    .select("*", { count: "exact", head: true })
    .eq("status", "approved");

  return NextResponse.json({
    ok: true,
    items: data || [],
    counts: {
      pending: pendingCount ?? 0,
      approved: approvedCount ?? 0,
    },
  });
}

/**
 * POST actions:
 * { action: "login", password }
 * { action: "approve" | "reject", id }
 * { action: "approve_all_pending" }
 * { action: "publish_approved" } — promote approved → food_library now
 * { action: "update", id, fields }
 */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const action = String(body?.action || "");

  // Login sets cookie if password matches
  if (action === "login") {
    const expected = getAdminSecret();
    if (!expected) {
      return NextResponse.json(
        { error: "ADMIN_SECRET or CRON_SECRET not configured on server" },
        { status: 503 }
      );
    }
    if (String(body?.password || "") !== expected) {
      return NextResponse.json({ error: "Wrong password" }, { status: 401 });
    }
    const res = NextResponse.json({ ok: true });
    res.cookies.set("rt_admin", expected, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });
    return res;
  }

  if (!isAdminAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = adminClient();
  if (!admin) {
    return NextResponse.json(
      { error: "Missing SUPABASE_SERVICE_ROLE_KEY" },
      { status: 503 }
    );
  }

  if (action === "approve" || action === "reject") {
    const id = String(body?.id || "");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const status = action === "approve" ? "approved" : "rejected";
    const { error } = await admin
      .from("library_suggestions")
      .update({ status })
      .eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, id, status });
  }

  if (action === "approve_all_pending") {
    const { data, error } = await admin
      .from("library_suggestions")
      .update({ status: "approved" })
      .eq("status", "pending")
      .select("id");
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, approved: data?.length || 0 });
  }

  if (action === "update") {
    const id = String(body?.id || "");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const patch: Record<string, unknown> = {};
    for (const k of ["name", "portion", "cuisine", "calories", "protein", "carbs", "fat"]) {
      if (body[k] !== undefined) patch[k] = body[k];
    }
    const { error } = await admin.from("library_suggestions").update(patch).eq("id", id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, id });
  }

  if (action === "publish_approved") {
    const { data: approved, error } = await admin
      .from("library_suggestions")
      .select("*")
      .eq("status", "approved")
      .limit(200);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

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
          source: "user",
          updated_at: new Date().toISOString(),
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

  if (action === "logout") {
    const res = NextResponse.json({ ok: true });
    res.cookies.set("rt_admin", "", { httpOnly: true, path: "/", maxAge: 0 });
    return res;
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
