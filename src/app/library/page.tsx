"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { formatCalories, formatMacro, cn } from "@/lib/utils";
import { Search, ArrowLeft, Plus, Loader2 } from "lucide-react";

type Food = {
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
};

const CUISINES = [
  "all",
  "chinese",
  "japanese",
  "korean",
  "thai",
  "vietnamese",
  "indian",
  "malay",
  "indonesian",
  "singaporean",
  "filipino",
  "other_asian",
];

const LABELS: Record<string, string> = {
  all: "All",
  chinese: "Chinese",
  japanese: "Japanese",
  korean: "Korean",
  thai: "Thai",
  vietnamese: "Vietnamese",
  indian: "Indian",
  malay: "Malay",
  indonesian: "Indonesian",
  singaporean: "Singaporean",
  filipino: "Filipino",
  other_asian: "Other Asian",
};

export default function LibraryPage() {
  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState("all");
  const [items, setItems] = useState<Food[]>([]);
  const [totalSeed, setTotalSeed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [source, setSource] = useState("");

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: query,
          cuisine,
          limit: "80",
        });
        const res = await fetch(`/api/library?${params}`);
        const data = await res.json();
        setItems(data.items || []);
        setTotalSeed(data.total_seed || data.count || 0);
        setSource(data.source || "");
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(t);
  }, [query, cuisine]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-lg px-5 h-14 flex items-center gap-3">
          <Link href="/" className="p-2 -ml-2 rounded-xl hover:bg-muted text-muted-foreground">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="font-semibold tracking-tight">Asian food library</h1>
            <p className="text-[11px] text-muted-foreground">
              {totalSeed || "1000"}+ dishes · {source || "loading"}
            </p>
          </div>
          <Link href="/app" className="text-sm font-medium text-primary">
            Track
          </Link>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-lg px-5 py-5 space-y-4 page-enter">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search: pho, dosa, nasi lemak, 麻婆…"
            className="input-modern w-full pl-10 pr-4 py-3 text-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {CUISINES.map((c) => (
            <button
              key={c}
              onClick={() => setCuisine(c)}
              className={cn(
                "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all",
                cuisine === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground"
              )}
            >
              {LABELS[c] || c}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          {loading ? "Searching…" : `${items.length} shown`} · reference servings, always editable when logging
        </p>

        {loading && items.length === 0 ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-2.5">
            {items.map((food) => (
              <div key={food.id} className="card-soft p-4 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{food.name}</div>
                  {food.name_original && (
                    <div className="text-xs text-muted-foreground truncate">{food.name_original}</div>
                  )}
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
                      {food.country || food.cuisine}
                    </span>
                    {food.portion && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {food.portion}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-3 mt-2 text-xs text-muted-foreground font-medium">
                    <span>P {formatMacro(food.protein)}g</span>
                    <span>C {formatMacro(food.carbs)}g</span>
                    <span>F {formatMacro(food.fat)}g</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-bold text-lg leading-none">{formatCalories(food.calories)}</div>
                  <div className="text-[10px] text-muted-foreground mt-0.5">kcal</div>
                  <Link
                    href={`/app?add=${food.id}`}
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Log
                  </Link>
                </div>
              </div>
            ))}
            {!loading && items.length === 0 && (
              <div className="card-soft p-10 text-center text-sm text-muted-foreground">
                No dishes match. Try another name or cuisine.
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
