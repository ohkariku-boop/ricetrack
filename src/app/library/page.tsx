"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ASIAN_FOODS, CUISINE_LABELS, type LibraryFood } from "@/data/asian-foods";
import { formatCalories, formatMacro, cn } from "@/lib/utils";
import { Search, ArrowLeft, Plus } from "lucide-react";

const ALL_CUISINES = ["all", ...Object.keys(CUISINE_LABELS)];

export default function LibraryPage() {
  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ASIAN_FOODS.filter((f) => {
      if (cuisine !== "all" && f.cuisine !== cuisine) return false;
      if (!q) return true;
      return (
        f.name.toLowerCase().includes(q) ||
        (f.name_original || "").toLowerCase().includes(q) ||
        f.category.includes(q) ||
        (f.tags || []).some((t) => t.includes(q))
      );
    });
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
            <p className="text-[11px] text-muted-foreground">{ASIAN_FOODS.length}+ reference dishes</p>
          </div>
          <Link href="/app" className="text-sm font-medium text-primary">
            Track
          </Link>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-lg px-5 py-5 space-y-4 page-enter">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search dishes, e.g. pho, nasi lemak…"
            className="input-modern w-full pl-10 pr-4 py-3 text-sm"
          />
        </div>

        {/* Cuisine chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          {ALL_CUISINES.map((c) => (
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
              {c === "all" ? "All" : CUISINE_LABELS[c] || c}
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          {filtered.length} dishes · values are typical servings (editable when you log)
        </p>

        <div className="space-y-2.5">
          {filtered.map((food) => (
            <FoodRow key={food.id} food={food} />
          ))}
          {filtered.length === 0 && (
            <div className="card-soft p-10 text-center text-sm text-muted-foreground">
              No dishes match. Try another name or cuisine.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function FoodRow({ food }: { food: LibraryFood }) {
  return (
    <div className="card-soft p-4 flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <div className="font-semibold truncate">{food.name}</div>
        {food.name_original && (
          <div className="text-xs text-muted-foreground truncate">{food.name_original}</div>
        )}
        <div className="flex flex-wrap gap-1.5 mt-1.5">
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground capitalize">
            {CUISINE_LABELS[food.cuisine] || food.cuisine}
          </span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
            {food.portion}
          </span>
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
  );
}
