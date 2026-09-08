import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import seed from "@/data/food_library_seed.json";

export const dynamic = "force-dynamic";

type FoodRow = {
  id: string;
  name: string;
  name_original?: string | null;
  cuisine: string;
  country?: string | null;
  category?: string | null;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion?: string | null;
  tags?: string[] | null;
};

function filterSeed(q: string, cuisine: string, country: string): FoodRow[] {
  const query = q.toLowerCase();
  let rows = seed as FoodRow[];
  if (cuisine && cuisine !== "all") {
    rows = rows.filter((r) => r.cuisine === cuisine);
  }
  if (country && country !== "all") {
    rows = rows.filter((r) => r.country === country);
  }
  if (query) {
    rows = rows.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        (r.name_original || "").toLowerCase().includes(query) ||
        (r.category || "").toLowerCase().includes(query) ||
        (r.country || "").toLowerCase().includes(query)
    );
  }
  return rows;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const cuisine = searchParams.get("cuisine") || "all";
  const country = searchParams.get("country") || "all";
  const limit = Math.min(Number(searchParams.get("limit") || 10), 50);
  const offset = Math.max(0, Number(searchParams.get("offset") || 0));

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (url && key) {
    try {
      const supabase = createClient(url, key);
      let query = supabase.from("food_library").select("*", { count: "exact" });
      if (cuisine !== "all") query = query.eq("cuisine", cuisine);
      if (country !== "all") query = query.eq("country", country);
      if (q) {
        query = query.or(
          `name.ilike.%${q}%,name_original.ilike.%${q}%,category.ilike.%${q}%`
        );
      }
      query = query.order("name").range(offset, offset + limit - 1);
      const { data, error, count } = await query;
      if (!error && data && data.length > 0) {
        return NextResponse.json({
          source: "supabase",
          count: data.length,
          total_seed: count ?? data.length,
          items: data,
        });
      }
    } catch {
      // fall through
    }
  }

  const filtered = filterSeed(q, cuisine, country);
  const items = filtered.slice(offset, offset + limit);
  return NextResponse.json({
    source: "seed",
    count: items.length,
    total_seed: filtered.length,
    items,
  });
}
