import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/** Soft recovery: spread excess over N days. Always undoable. */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { excess_calories, days = 7, action = "apply", event_id } = body;
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Sign in required" }, { status: 401 });

    if (action === "undo" && event_id) {
      await supabase
        .from("balance_events")
        .update({ undone: true })
        .eq("id", event_id)
        .eq("user_id", user.id);
      return NextResponse.json({ ok: true, undone: true });
    }

    const excess = Number(excess_calories) || 0;
    if (excess <= 0) {
      return NextResponse.json({ error: "No excess to balance" }, { status: 400 });
    }
    const d = Math.min(14, Math.max(3, Number(days) || 7));
    const per_day = Math.round(excess / d);

    const { data, error } = await supabase
      .from("balance_events")
      .insert({
        user_id: user.id,
        excess_calories: excess,
        days: d,
        per_day,
        applied_from: new Date().toISOString().slice(0, 10),
        undone: false,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({
      ok: true,
      event: data,
      message: `Spread ${excess} kcal over ${d} days (~${per_day}/day). You can undo anytime.`,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
