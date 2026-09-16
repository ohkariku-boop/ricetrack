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
  source?: string | null;
};

function filterRows(rows: FoodRow[], q: string, cuisine: string, country: string): FoodRow[] {
  const query = q.toLowerCase();
  let out = rows;
  if (cuisine && cuisine !== "all") {
    out = out.filter((r) => r.cuisine === cuisine);
  }
  if (country && country !== "all") {
    out = out.filter((r) => (r.country || "") === country);
  }
  if (query) {
    out = out.filter(
      (r) =>
        r.name.toLowerCase().includes(query) ||
        (r.name_original || "").toLowerCase().includes(query) ||
        (r.category || "").toLowerCase().includes(query) ||
        (r.country || "").toLowerCase().includes(query) ||
        (r.tags || []).some((t) => String(t).toLowerCase().includes(query))
    );
    out = [...out].sort((a, b) => {
      const an = a.name.toLowerCase();
      const bn = b.name.toLowerCase();
      const aP = an.startsWith(query) ? 0 : 1;
      const bP = bn.startsWith(query) ? 0 : 1;
      if (aP !== bP) return aP - bP;
      // Prefer user-published when names tie on prefix
      const aU = String(a.id).startsWith("usr-") ? 0 : 1;
      const bU = String(b.id).startsWith("usr-") ? 0 : 1;
      if (aU !== bU) return aU - bU;
      return an.localeCompare(bn);
    });
  }
  return out;
}

function normalizeCloud(row: Record<string, unknown>): FoodRow {
  return {
    id: String(row.id),
    name: String(row.name || ""),
    name_original: (row.name_original as string) || null,
    cuisine: String(row.cuisine || "other"),
    country: (row.country as string) || null,
    category: (row.category as string) || null,
    calories: Number(row.calories) || 0,
    protein: Number(row.protein) || 0,
    carbs: Number(row.carbs) || 0,
    fat: Number(row.fat) || 0,
    portion: (row.portion as string) || null,
    tags: (row.tags as string[]) || [],
    source: (row.source as string) || "supabase",
  };
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

  let cloud: FoodRow[] = [];
  if (url && key) {
    try {
      const supabase = createClient(url, key);
      // Pull a generous slice; merge with seed then filter (catalog still modest)
      let query = supabase.from("food_library").select("*").limit(3000);
      if (cuisine !== "all") query = query.eq("cuisine", cuisine);
      if (country !== "all") query = query.eq("country", country);
      const { data, error } = await query;
      if (!error && data?.length) {
        cloud = data.map((r) => normalizeCloud(r as Record<string, unknown>));
      }
    } catch {
      /* seed only */
    }
  }

  // Merge: cloud overrides seed on same id; also drop seed rows with same name as usr-* cloud
  const byId = new Map<string, FoodRow>();
  for (const r of seed as FoodRow[]) byId.set(r.id, { ...r, source: r.source || "seed" });
  const cloudNames = new Set(
    cloud.filter((c) => String(c.id).startsWith("usr-")).map((c) => c.name.toLowerCase())
  );
  for (const [id, row] of [...byId.entries()]) {
    if (cloudNames.has(row.name.toLowerCase()) && !String(id).startsWith("usr-")) {
      byId.delete(id);
    }
  }
  for (const r of cloud) byId.set(r.id, r);

  const merged = filterRows([...byId.values()], q, cuisine, country);
  const items = merged.slice(offset, offset + limit);

  return NextResponse.json({
    source: cloud.length ? "merged" : "seed",
    cloud_rows: cloud.length,
    count: items.length,
    total_seed: merged.length,
    items,
  });
}
