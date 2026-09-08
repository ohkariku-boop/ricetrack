import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ items: [], meals: [] });
    }

    const { data: meals } = await supabase
      .from("meals")
      .select("id, items, total_calories, total_protein, total_carbs, total_fat, logged_at, meal_type")
      .eq("user_id", user.id)
      .order("logged_at", { ascending: false })
      .limit(20);

    const { data: foods } = await supabase
      .from("user_foods")
      .select("*")
      .eq("user_id", user.id)
      .order("times_logged", { ascending: false })
      .limit(30);

    return NextResponse.json({
      meals: meals || [],
      foods: foods || [],
    });
  } catch {
    return NextResponse.json({ meals: [], foods: [] });
  }
}
