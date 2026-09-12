"use client";

import { BottomNav } from "@/components/BottomNav";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatCalories, formatMacro, cn } from "@/lib/utils";
import {
  Search,
  ArrowLeft,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
} from "lucide-react";
import { getDishGuide } from "@/lib/dish-guide";
import { ensureLocalSession, saveGuestMeal, isLocalSession } from "@/lib/guest";
import { createClient } from "@/lib/supabase/client";

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
  const [selected, setSelected] = useState<Food | null>(null);
  const [logging, setLogging] = useState(false);
  const [logMsg, setLogMsg] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

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
  const guide = selected ? getDishGuide(selected) : null;

  const logDish = async () => {
    if (!selected) return;
    setLogging(true);
    setLogMsg(null);
    const item = {
      name: selected.name,
      name_original: selected.name_original || undefined,
      calories: Number(selected.calories) || 0,
      protein: Number(selected.protein) || 0,
      carbs: Number(selected.carbs) || 0,
      fat: Number(selected.fat) || 0,
      portion: selected.portion || "1 serving",
      confidence: 0.95,
    };
    const totals = {
      total_calories: item.calories,
      total_protein: item.protein,
      total_carbs: item.carbs,
      total_fat: item.fat,
    };

    try {
      ensureLocalSession();
      if (isLocalSession()) {
        saveGuestMeal({
          meal_title: selected.name,
          items: [item],
          ...totals,
          cuisine_detected: selected.cuisine,
          notes: `Library · ${selected.portion || "1 serving"}`,
        });
        setLogMsg("Logged for today.");
        setLogging(false);
        setTimeout(() => {
          setSelected(null);
          router.push("/dashboard");
        }, 600);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        ensureLocalSession();
        saveGuestMeal({
          meal_title: selected.name,
          items: [item],
          ...totals,
          cuisine_detected: selected.cuisine,
          notes: `Library · ${selected.portion || "1 serving"}`,
        });
        setLogMsg("Logged on this device.");
        setLogging(false);
        setTimeout(() => {
          setSelected(null);
          router.push("/dashboard");
        }, 600);
        return;
      }

      const { error } = await supabase.from("meals").insert({
        user_id: user.id,
        meal_title: selected.name,
        items: [item],
        ...totals,
        cuisine_detected: selected.cuisine,
        notes: `Library · ${selected.portion || "1 serving"}`,
        logged_at: new Date().toISOString(),
      });
      if (error) throw new Error(error.message);
      setLogMsg("Logged for today.");
      setLogging(false);
      setTimeout(() => {
        setSelected(null);
        router.push("/dashboard");
      }, 600);
    } catch (e) {
      setLogging(false);
      setLogMsg(e instanceof Error ? e.message : "Could not log dish.");
    }
  };

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
              Asia-first · {total > 0 ? `${total.toLocaleString()} dishes` : "search"} · tap for details
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
                  : "bg-muted text-muted-foreground"
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
          <div className="card-soft p-8 text-center text-sm text-muted-foreground">
            No dishes match. Try another search or cuisine.
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {items.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setLogMsg(null);
                    setSelected(f);
                  }}
                  className="w-full text-left card-soft p-3.5 flex gap-3 items-start pressable border border-border/50 hover:border-primary/30 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold uppercase shrink-0 ${
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
                </button>
              ))}
            </div>

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

      {/* Dish detail sheet */}
      {selected && guide && (
        <div className="fixed inset-0 z-[80] flex flex-col justify-end">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close"
            onClick={() => setSelected(null)}
          />
          <div className="relative mx-auto w-full max-w-lg rounded-t-3xl bg-background border-t border-border shadow-2xl max-h-[88vh] overflow-y-auto animate-in slide-in-from-bottom">
            <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border/60 px-5 py-4 flex items-start gap-3 z-10">
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold leading-tight">{selected.name}</h2>
                {selected.name_original && (
                  <p className="text-sm text-muted-foreground mt-0.5">{selected.name_original}</p>
                )}
                <p className="text-[11px] text-muted-foreground mt-1 capitalize">
                  {selected.cuisine?.replace("_", " ")}
                  {selected.portion ? ` · ${selected.portion}` : ""}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="p-2 rounded-xl hover:bg-muted shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-5 py-4 space-y-4">
              <div className="grid grid-cols-4 gap-2">
                {[
                  ["kcal", formatCalories(selected.calories)],
                  ["Protein", `${formatMacro(selected.protein)}g`],
                  ["Carbs", `${formatMacro(selected.carbs)}g`],
                  ["Fat", `${formatMacro(selected.fat)}g`],
                ].map(([k, v]) => (
                  <div key={k} className="card-soft p-2.5 text-center">
                    <div className="text-[10px] uppercase text-muted-foreground">{k}</div>
                    <div className="text-sm font-bold tabular-nums mt-0.5">{v}</div>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">Typical components</h3>
                <ul className="space-y-1.5">
                  {guide.components.map((c) => (
                    <li
                      key={c}
                      className="text-sm text-foreground/90 flex gap-2 leading-snug"
                    >
                      <span className="text-primary mt-1.5 w-1 h-1 rounded-full bg-primary shrink-0" />
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl bg-muted/60 px-3.5 py-3">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                  Logging tip
                </div>
                <p className="text-sm leading-snug text-foreground/90">{guide.tip}</p>
              </div>

              {logMsg && (
                <p className="text-sm text-center text-primary font-medium">{logMsg}</p>
              )}

              <button
                type="button"
                onClick={logDish}
                disabled={logging}
                className="btn-primary w-full h-12 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {logging ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5" />
                    Log this
                  </>
                )}
              </button>
              <p className="text-[11px] text-center text-muted-foreground pb-4">
                Adds one serving to today. You can edit on Home after.
              </p>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
