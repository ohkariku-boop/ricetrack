"use client";

import { BottomNav } from "@/components/BottomNav";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCalories, formatMacro, cn } from "@/lib/utils";
import { Search, ArrowLeft, Loader2, ChevronLeft, ChevronRight } from "lucide-react";

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

const PAGE_SIZE = 10;


const CUISINE_AVATAR: Record<string, string> = {
  chinese: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  japanese: "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
  korean: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
  thai: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  vietnamese: "bg-lime-100 text-lime-900 dark:bg-lime-950 dark:text-lime-300",
  indian: "bg-yellow-100 text-yellow-900 dark:bg-yellow-950 dark:text-yellow-200",
  malay: "bg-emerald-100 text-emerald-900 dark:bg-emerald-950 dark:text-emerald-300",
  indonesian: "bg-teal-100 text-teal-900 dark:bg-teal-950 dark:text-teal-300",
  singaporean: "bg-cyan-100 text-cyan-900 dark:bg-cyan-950 dark:text-cyan-300",
  filipino: "bg-sky-100 text-sky-900 dark:bg-sky-950 dark:text-sky-300",
  western: "bg-indigo-100 text-indigo-900 dark:bg-indigo-950 dark:text-indigo-300",
  other_asian: "bg-violet-100 text-violet-900 dark:bg-violet-950 dark:text-violet-300",
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
  "western",
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
  other_asian: "Other Asia / ME",
  western: "Western",
};

export default function LibraryPage() {
  const [query, setQuery] = useState("");
  const [cuisine, setCuisine] = useState("all");
  const [items, setItems] = useState<Food[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setPage(1);
  }, [query, cuisine]);

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          q: query,
          cuisine,
          limit: String(PAGE_SIZE),
          offset: String((page - 1) * PAGE_SIZE),
        });
        const res = await fetch(`/api/library?${params}`);
        const data = await res.json();
        setItems((data.items || []).slice(0, PAGE_SIZE));
        setTotal(data.total_seed || data.count || data.items?.length || 0);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }, 180);
    return () => clearTimeout(t);
  }, [query, cuisine, page]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen safe-bottom bg-background flex flex-col">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto max-w-lg px-5 h-14 flex items-center gap-3">
          <Link href="/app" className="p-2 -ml-2 rounded-xl hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold tracking-tight">Food library</h1>
            <p className="text-[11px] text-muted-foreground truncate">
              Asia-first · {total > 0 ? `${total.toLocaleString()} dishes` : "search"}
            </p>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-lg px-5 py-3 space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search laksa, dosa, 麻婆…"
            className="input-modern w-full pl-10 pr-4 py-3 text-[15px]"
          />
        </div>

        <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1 no-scrollbar">
          {CUISINES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCuisine(c)}
              className={cn(
                "shrink-0 px-3.5 py-1.5 rounded-full text-xs font-semibold transition-colors",
                cuisine === c
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              )}
            >
              {LABELS[c] || c}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : items.length === 0 ? (
          <div className="card-soft p-10 text-center text-sm text-muted-foreground">
            No dishes match. Try another search or cuisine.
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {items.map((f) => (
                <div
                  key={f.id}
                  className="card-soft p-3 flex items-start justify-between gap-3 pressable"
                >
                  <div
                    className={`w-11 h-11 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold uppercase ${
                      CUISINE_AVATAR[f.cuisine] || "bg-muted text-muted-foreground"
                    }`}
                    aria-hidden
                  >
                    {(f.cuisine || "f").slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-medium leading-snug">{f.name}</div>
                    {f.name_original && (
                      <div className="text-xs text-muted-foreground mt-0.5">{f.name_original}</div>
                    )}
                    <div className="text-[11px] text-muted-foreground mt-1 capitalize">
                      {f.cuisine?.replace("_", " ")}
                      {f.portion ? ` · ${f.portion}` : ""}
                    </div>
                  </div>
                  <div className="text-right shrink-0 tabular-nums">
                    <div className="font-bold">{formatCalories(f.calories)}</div>
                    <div className="text-[10px] text-muted-foreground">kcal</div>
                    <div className="text-[10px] text-muted-foreground mt-1">
                      P{formatMacro(f.protein)} C{formatMacro(f.carbs)} F{formatMacro(f.fat)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination — no endless scroll */}
            <div className="flex items-center justify-between pt-2 pb-4">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="btn-secondary h-10 px-3 disabled:opacity-40 flex items-center gap-1 text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                Prev
              </button>
              <span className="text-sm text-muted-foreground tabular-nums">
                {page} / {totalPages}
              </span>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="btn-secondary h-10 px-3 disabled:opacity-40 flex items-center gap-1 text-sm"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </main>
      <BottomNav />
    </div>
  );
}
