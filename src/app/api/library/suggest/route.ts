import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const name = String(body?.name || "").trim();
    if (!name || name.length > 200) {
      return NextResponse.json({ error: "Invalid name" }, { status: 400 });
    }
    const row = {
      name,
      calories: Number(body.calories) || 0,
      protein: Number(body.protein) || 0,
      carbs: Number(body.carbs) || 0,
      fat: Number(body.fat) || 0,
      portion: body.portion ? String(body.portion).slice(0, 80) : null,
      cuisine: body.cuisine ? String(body.cuisine).slice(0, 40) : null,
      status: "pending",
      source: "user",
      client_id: body.id ? String(body.id).slice(0, 64) : null,
      meal_id: body.meal_id ? String(body.meal_id).slice(0, 64) : null,
    };

    const supabase = await createClient();
    const { data: auth } = await supabase.auth.getUser();
    const payload = {
      ...row,
      user_id: auth.user?.id ?? null,
    };

    const { error } = await supabase.from("library_suggestions").insert(payload);
    if (error) {
      // Table may not exist yet; still OK for local queue
      return NextResponse.json({ ok: true, stored: false, reason: error.message });
    }
    return NextResponse.json({ ok: true, stored: true });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Failed" },
      { status: 500 }
    );
  }
}
