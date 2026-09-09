"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Camera,
  LogOut,
  Loader2,
  Settings2,
  Scale,
  RotateCcw,
  X,
  ChevronRight,
  Minus,
  Plus,
  Trash2,
} from "lucide-react";
import { formatCalories, formatMacro } from "@/lib/utils";
import { ProgressRing } from "@/components/ProgressRing";
import {
  isGuest,
  getGuestMeals,
  getGuestProfile,
  disableGuest,
  updateGuestMeal,
  deleteGuestMeal,
  getSessionAccount,
  isLocalSession,
} from "@/lib/guest";
import type { FoodItem } from "@/types";

type MealRow = {
  id: string;
  meal_title?: string;
  items: FoodItem[];
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  logged_at: string;
  notes?: string | null;
};

function normalizeItems(raw: unknown): FoodItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((x: any) => ({
    name: String(x?.name || "Item"),
    name_original: x?.name_original,
    calories: Number(x?.calories) || 0,
    protein: Number(x?.protein) || 0,
    carbs: Number(x?.carbs) || 0,
    fat: Number(x?.fat) || 0,
    portion: String(x?.portion || "1 serving"),
    confidence: Number(x?.confidence) || 0.8,
    notes: x?.notes,
  }));
}

export default function DashboardPage() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [profile, setProfile] = useState<Record<string, number | string | boolean> | null>(null);
  const [meals, setMeals] = useState<MealRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [balanceMsg, setBalanceMsg] = useState<string | null>(null);
  const [lastBalanceId, setLastBalanceId] = useState<string | null>(null);
  const [selected, setSelected] = useState<MealRow | null>(null);
  const [draftItems, setDraftItems] = useState<FoodItem[]>([]);
  const [savingMeal, setSavingMeal] = useState(false);
  const [swipeId, setSwipeId] = useState<string | null>(null);
  const [swipeX, setSwipeX] = useState(0);
  const touchStartX = useState<{ current: number }>({ current: 0 })[0];
  const touchStartY = useState<{ current: number }>({ current: 0 })[0];
  const swiping = useState<{ current: boolean }>({ current: false })[0];
  const router = useRouter();
  const supabase = createClient();

  const load = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user && isLocalSession()) {
      const gp = getGuestProfile();
      setProfile(gp as any);
      const today = new Date().toISOString().slice(0, 10);
      const all = getGuestMeals();
      const todays = all.filter((m) => m.logged_at.slice(0, 10) === today);
      setMeals(
        todays.map((m) => ({
          id: m.id,
          meal_title: m.meal_title,
          items: normalizeItems(m.items),
          total_calories: m.total_calories,
          total_protein: m.total_protein,
          total_carbs: m.total_carbs,
          total_fat: m.total_fat,
          logged_at: m.logged_at,
          notes: m.notes,
        }))
      );
      const days = new Set(all.map((m) => m.logged_at.slice(0, 10)));
      let s = 0;
      const d = new Date();
      for (let i = 0; i < 60; i++) {
        const key = d.toISOString().slice(0, 10);
        if (days.has(key)) {
          s++;
          d.setDate(d.getDate() - 1);
        } else if (i === 0) {
          d.setDate(d.getDate() - 1);
        } else break;
      }
      setStreak(s);
      setLoading(false);
      return;
    }

    if (!user) {
      router.push("/login");
      return;
    }
    setUser(user);

    const { data: prof } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (!prof || !prof.daily_calorie_target) {
      router.push("/onboarding");
      return;
    }
    setProfile(prof);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const { data } = await supabase
      .from("meals")
      .select("*")
      .eq("user_id", user.id)
      .gte("logged_at", today.toISOString())
      .order("logged_at", { ascending: false });

    setMeals(
      (data || []).map((m: any) => {
        let meal_title: string | undefined;
        const notes = m.notes as string | null;
        if (notes?.startsWith("[title] ")) {
          meal_title = notes.replace("[title] ", "").split(" · ")[0];
        }
        return {
        id: m.id,
        meal_title,
        items: normalizeItems(m.items),
        total_calories: m.total_calories,
        total_protein: m.total_protein,
        total_carbs: m.total_carbs,
        total_fat: m.total_fat,
        logged_at: m.logged_at,
        notes: m.notes,
      };
      })
    );

    const { data: recent } = await supabase
      .from("meals")
      .select("logged_at")
      .eq("user_id", user.id)
      .order("logged_at", { ascending: false })
      .limit(60);
    if (recent?.length) {
      const days = new Set(recent.map((r) => r.logged_at.slice(0, 10)));
      let s = 0;
      const d = new Date();
      for (let i = 0; i < 60; i++) {
        const key = d.toISOString().slice(0, 10);
        if (days.has(key)) {
          s++;
          d.setDate(d.getDate() - 1);
        } else if (i === 0) {
          d.setDate(d.getDate() - 1);
        } else break;
      }
      setStreak(s);
    }

    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const totals = useMemo(() => {
    return meals.reduce(
      (acc, m) => ({
        cal: acc.cal + (m.total_calories || 0),
        p: acc.p + (m.total_protein || 0),
        c: acc.c + (m.total_carbs || 0),
        f: acc.f + (m.total_fat || 0),
      }),
      { cal: 0, p: 0, c: 0, f: 0 }
    );
  }, [meals]);

  const targets = {
    cal: Number(profile?.daily_calorie_target) || 2000,
    p: Number(profile?.daily_protein_target) || 120,
    c: Number(profile?.daily_carbs_target) || 200,
    f: Number(profile?.daily_fat_target) || 65,
  };

  const remaining = Math.max(0, targets.cal - totals.cal);
  const over = totals.cal > targets.cal;

  const openMeal = (m: MealRow) => {
    setSelected(m);
    setDraftItems(m.items.map((i) => ({ ...i })));
  };

  const updateDraft = (idx: number, patch: Partial<FoodItem>) => {
    setDraftItems((prev) => prev.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };

  const removeDraftItem = (idx: number) => {
    setDraftItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const draftTotals = useMemo(() => {
    return {
      cal: draftItems.reduce((s, i) => s + (Number(i.calories) || 0), 0),
      p: draftItems.reduce((s, i) => s + (Number(i.protein) || 0), 0),
      c: draftItems.reduce((s, i) => s + (Number(i.carbs) || 0), 0),
      f: draftItems.reduce((s, i) => s + (Number(i.fat) || 0), 0),
    };
  }, [draftItems]);

  const saveSelectedMeal = async () => {
    if (!selected) return;
    setSavingMeal(true);
    try {
      const patch = {
        items: draftItems,
        total_calories: draftTotals.cal,
        total_protein: draftTotals.p,
        total_carbs: draftTotals.c,
        total_fat: draftTotals.f,
      };

      if (!user && isLocalSession()) {
        updateGuestMeal(selected.id, patch);
      } else if (user) {
        const { error } = await supabase
          .from("meals")
          .update(patch)
          .eq("id", selected.id)
          .eq("user_id", user.id);
        if (error) throw error;
      }

      setMeals((prev) =>
        prev.map((m) =>
          m.id === selected.id
            ? {
                ...m,
                items: draftItems,
                total_calories: draftTotals.cal,
                total_protein: draftTotals.p,
                total_carbs: draftTotals.c,
                total_fat: draftTotals.f,
              }
            : m
        )
      );
      setSelected(null);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Could not save");
    } finally {
      setSavingMeal(false);
    }
  };

  const deleteMealById = async (id: string, skipConfirm = false) => {
    if (!skipConfirm && !confirm("Delete this meal?")) return;
    setSavingMeal(true);
    try {
      if (!user && isLocalSession()) {
        deleteGuestMeal(id);
      } else if (user) {
        const { error } = await supabase.from("meals").delete().eq("id", id).eq("user_id", user.id);
        if (error) throw error;
      }
      setMeals((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
      setSwipeId(null);
      setSwipeX(0);
    } catch (e: unknown) {
      alert(e instanceof Error ? e.message : "Could not delete");
    } finally {
      setSavingMeal(false);
    }
  };

  const deleteSelectedMeal = async () => {
    if (!selected) return;
    await deleteMealById(selected.id);
  };

  const signOut = async () => {
    disableGuest();
    await supabase.auth.signOut();
    router.push("/");
  };

  const balanceGently = async () => {
    if (!user) {
      setBalanceMsg("Sign in to use Balance (guest keeps local control).");
      return;
    }
    setBalanceMsg(null);
    const res = await fetch("/api/balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ remaining_calories: remaining }),
    });
    const data = await res.json();
    if (!res.ok) {
      setBalanceMsg(data.error || "Balance failed");
      return;
    }
    setLastBalanceId(data.meal_id || null);
    setBalanceMsg(data.message || "Balanced");
    load();
  };

  const undoBalance = async () => {
    if (!lastBalanceId || !user) return;
    await supabase.from("meals").delete().eq("id", lastBalanceId).eq("user_id", user.id);
    setLastBalanceId(null);
    setBalanceMsg("Undone");
    load();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto max-w-lg px-4 h-14 flex items-center justify-between">
          <div className="leading-tight">
            <div className="font-semibold tracking-tight">Today</div>
            {typeof window !== "undefined" && getSessionAccount() && (
              <div className="text-[11px] text-muted-foreground">
                {getSessionAccount()?.name}
                {getSessionAccount()?.paid ? " · Paid" : ""}
              </div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Link href="/settings" className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
              <Settings2 className="w-4 h-4" />
            </Link>
            <button type="button" onClick={signOut} className="p-2 rounded-lg hover:bg-muted text-muted-foreground">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-5 space-y-5">
        <div className="card-elevated p-5 flex items-center gap-5">
          <ProgressRing value={totals.cal} max={targets.cal} size={96} stroke={8} label="kcal" unit="" />
          <div className="min-w-0 flex-1">
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Calories</div>
            <div className="text-2xl font-bold tabular-nums">
              {formatCalories(totals.cal)}
              <span className="text-sm font-medium text-muted-foreground"> / {formatCalories(targets.cal)}</span>
            </div>
            <div className={`text-sm mt-1 ${over ? "text-amber-600" : "text-muted-foreground"}`}>
              {over ? `${formatCalories(totals.cal - targets.cal)} over` : `${formatCalories(remaining)} left`}
              {streak > 0 && <span className="ml-2">· {streak}d streak</span>}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            ["Protein", totals.p, targets.p],
            ["Carbs", totals.c, targets.c],
            ["Fat", totals.f, targets.f],
          ].map(([label, val, tgt]) => (
            <div key={String(label)} className="card-soft p-3 text-center">
              <div className="text-[10px] uppercase text-muted-foreground">{label}</div>
              <div className="font-semibold tabular-nums mt-0.5">{formatMacro(Number(val))}g</div>
              <div className="text-[10px] text-muted-foreground">/ {formatMacro(Number(tgt))}g</div>
            </div>
          ))}
        </div>

        {remaining > 80 && user && (
          <div className="card-soft p-4 space-y-2">
            <div className="text-sm font-medium">Still room today</div>
            <div className="flex gap-2">
              <button type="button" onClick={balanceGently} className="btn-secondary flex-1 h-10 text-sm">
                Balance gently
              </button>
              {lastBalanceId && (
                <button type="button" onClick={undoBalance} className="btn-secondary h-10 px-3 text-sm flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5" />
                  Undo
                </button>
              )}
            </div>
            {balanceMsg && <p className="text-xs text-muted-foreground">{balanceMsg}</p>}
          </div>
        )}

        <Link href="/app" className="btn-primary w-full h-14 flex items-center justify-center gap-2 text-[16px]">
          <Camera className="w-5 h-5" />
          Log a meal
        </Link>

        <div className="flex gap-2">
          <Link href="/library" className="btn-secondary flex-1 h-11 text-sm text-center leading-[2.75rem]">
            Library
          </Link>
          <Link href="/settings" className="btn-secondary flex-1 h-11 text-sm flex items-center justify-center gap-1">
            <Scale className="w-4 h-4" />
            Targets
          </Link>
        </div>

        <div>
          <h2 className="text-sm font-semibold text-muted-foreground mb-3">Today&apos;s meals</h2>
          {meals.length === 0 ? (
            <div className="card-soft p-8 text-center text-sm text-muted-foreground">
              Nothing logged yet. Snap or type your next plate.
            </div>
          ) : (
            <div className="space-y-2">
              {meals.map((m) => {
                const open = swipeId === m.id;
                const dx = open ? Math.min(0, Math.max(-88, swipeX)) : 0;
                return (
                  <div key={m.id} className="relative overflow-hidden rounded-2xl">
                    {/* Delete revealed behind */}
                    <div className="absolute inset-y-0 right-0 w-[88px] flex items-stretch">
                      <button
                        type="button"
                        disabled={savingMeal}
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteMealById(m.id);
                        }}
                        className="flex-1 bg-red-600 text-white text-sm font-semibold flex items-center justify-center gap-1 active:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>

                    {/* Swipeable row */}
                    <div
                      className="relative card-soft p-4 flex justify-between gap-3 bg-card border border-border/60 select-none"
                      style={{
                        transform: `translateX(${dx}px)`,
                        transition: open && swipeX === -88 ? "transform 0.15s ease-out" : undefined,
                      }}
                      onTouchStart={(e) => {
                        touchStartX.current = e.touches[0].clientX;
                        touchStartY.current = e.touches[0].clientY;
                        swiping.current = false;
                        setSwipeId(m.id);
                        setSwipeX(0);
                      }}
                      onTouchMove={(e) => {
                        const x = e.touches[0].clientX - touchStartX.current;
                        const y = e.touches[0].clientY - touchStartY.current;
                        if (!swiping.current) {
                          if (Math.abs(x) > 8 && Math.abs(x) > Math.abs(y)) {
                            swiping.current = true;
                          } else if (Math.abs(y) > 8) {
                            return;
                          }
                        }
                        if (swiping.current) {
                          setSwipeX(Math.min(0, Math.max(-88, x)));
                        }
                      }}
                      onTouchEnd={() => {
                        if (swiping.current) {
                          if (swipeX < -48) {
                            setSwipeX(-88);
                          } else {
                            setSwipeX(0);
                            setSwipeId(null);
                          }
                        }
                        swiping.current = false;
                      }}
                      onClick={() => {
                        if (swipeX < -20) {
                          setSwipeX(0);
                          setSwipeId(null);
                          return;
                        }
                        openMeal(m);
                      }}
                    >
                      <div className="min-w-0 flex-1 pointer-events-none">
                        <div className="font-medium truncate">
                          {m.meal_title ||
                            (m.items || []).map((i) => i.name).join(", ") ||
                            "Meal"}
                        </div>
                        {m.meal_title && m.items?.length > 0 && (
                          <div className="text-xs text-muted-foreground truncate mt-0.5">
                            {(m.items || []).map((i) => i.name).join(", ")}
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {new Date(m.logged_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                          {" · "}
                          P {formatMacro(m.total_protein)} · C {formatMacro(m.total_carbs)} · F{" "}
                          {formatMacro(m.total_fat)}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 pointer-events-none">
                        <div className="text-right">
                          <div className="font-bold tabular-nums">{formatCalories(m.total_calories)}</div>
                          <div className="text-[10px] text-muted-foreground">kcal</div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Meal detail / edit sheet */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            aria-label="Close"
            onClick={() => setSelected(null)}
          />
          <div className="relative w-full max-w-lg max-h-[92vh] overflow-y-auto bg-background rounded-t-3xl sm:rounded-2xl shadow-xl border border-border">
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-border bg-background/95 backdrop-blur">
              <div className="min-w-0">
                <div className="font-semibold truncate">
                  {selected.meal_title || "Meal details"}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(selected.logged_at).toLocaleString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-muted">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="card-elevated p-4">
                <div className="text-xs text-muted-foreground uppercase">Total</div>
                <div className="text-3xl font-bold tabular-nums mt-1">
                  {formatCalories(draftTotals.cal)}
                  <span className="text-sm font-medium text-muted-foreground ml-1">kcal</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm tabular-nums text-muted-foreground">
                  <span>P {formatMacro(draftTotals.p)}g</span>
                  <span>C {formatMacro(draftTotals.c)}g</span>
                  <span>F {formatMacro(draftTotals.f)}g</span>
                </div>
              </div>

              <div className="space-y-3">
                {draftItems.map((item, idx) => (
                  <div key={idx} className="card-soft p-3 space-y-2 min-w-0 overflow-hidden">
                    <div className="flex gap-2">
                      <input
                        className="input-modern flex-1 min-w-0 px-3 py-2 text-sm font-medium"
                        value={item.name}
                        onChange={(e) => updateDraft(idx, { name: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => removeDraftItem(idx)}
                        className="p-2 rounded-lg text-muted-foreground hover:bg-muted shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      className="input-modern w-full px-3 py-2 text-sm"
                      value={item.portion || ""}
                      onChange={(e) => updateDraft(idx, { portion: e.target.value })}
                      placeholder="Portion e.g. 1 bowl"
                    />
                    <div className="grid grid-cols-1 gap-2 min-w-0">
                      {(
                        [
                          ["calories", "kcal", 10],
                          ["protein", "protein", 1],
                          ["carbs", "carbs", 1],
                          ["fat", "fat", 1],
                        ] as const
                      ).map(([key, label, step]) => (
                        <div key={key} className="flex items-center gap-2 min-w-0">
                          <label className="w-14 shrink-0 text-[11px] uppercase text-muted-foreground">
                            {label}
                          </label>
                          <button
                            type="button"
                            className="p-2 rounded-lg bg-muted shrink-0"
                            onClick={() =>
                              updateDraft(idx, {
                                [key]: Math.max(0, Number(item[key]) - step),
                              })
                            }
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <input
                            type="number"
                            inputMode="decimal"
                            className="input-modern min-w-0 flex-1 px-2 py-2 text-sm text-center tabular-nums"
                            value={item[key]}
                            onChange={(e) =>
                              updateDraft(idx, { [key]: Number(e.target.value) || 0 })
                            }
                          />
                          <button
                            type="button"
                            className="p-2 rounded-lg bg-muted shrink-0"
                            onClick={() =>
                              updateDraft(idx, {
                                [key]: Number(item[key]) + step,
                              })
                            }
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pb-4">
                <button
                  type="button"
                  onClick={deleteSelectedMeal}
                  disabled={savingMeal}
                  className="h-12 px-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-600 font-semibold text-sm flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
                <button
                  type="button"
                  onClick={saveSelectedMeal}
                  disabled={savingMeal}
                  className="btn-primary flex-1 h-12 disabled:opacity-50"
                >
                  {savingMeal ? "Saving…" : "Save changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
