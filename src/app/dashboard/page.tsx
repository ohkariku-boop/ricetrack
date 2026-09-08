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
  Sparkles,
} from "lucide-react";
import { formatCalories, formatMacro } from "@/lib/utils";
import { ProgressRing } from "@/components/ProgressRing";

export default function DashboardPage() {
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [profile, setProfile] = useState<Record<string, number | string | boolean> | null>(null);
  const [meals, setMeals] = useState<
    {
      id: string;
      items: { name: string }[];
      total_calories: number;
      total_protein: number;
      total_carbs: number;
      total_fat: number;
      logged_at: string;
    }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [streak, setStreak] = useState(0);
  const [balanceMsg, setBalanceMsg] = useState<string | null>(null);
  const [lastBalanceId, setLastBalanceId] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const load = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
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

    setMeals(data || []);

    // Streak: consecutive days with ≥1 meal
    const { data: recent } = await supabase
      .from("meals")
      .select("logged_at")
      .eq("user_id", user.id)
      .order("logged_at", { ascending: false })
      .limit(60);
    if (recent?.length) {
      const days = new Set(
        recent.map((m) => new Date(m.logged_at).toISOString().slice(0, 10))
      );
      let s = 0;
      const d = new Date();
      for (let i = 0; i < 60; i++) {
        const key = d.toISOString().slice(0, 10);
        if (days.has(key)) {
          s++;
          d.setDate(d.getDate() - 1);
        } else if (i === 0) {
          d.setDate(d.getDate() - 1);
          continue;
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
        calories: acc.calories + Number(m.total_calories),
        protein: acc.protein + Number(m.total_protein),
        carbs: acc.carbs + Number(m.total_carbs),
        fat: acc.fat + Number(m.total_fat),
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0 }
    );
  }, [meals]);

  const targets = {
    calories: Number(profile?.daily_calorie_target) || 2000,
    protein: Number(profile?.daily_protein_target) || 120,
    carbs: Number(profile?.daily_carbs_target) || 200,
    fat: Number(profile?.daily_fat_target) || 65,
  };

  const remaining = {
    calories: Math.max(0, targets.calories - totals.calories),
    protein: Math.max(0, targets.protein - totals.protein),
  };

  const excess = totals.calories - targets.calories;

  const applyBalance = async () => {
    if (excess <= 0) return;
    const res = await fetch("/api/balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ excess_calories: Math.round(excess), days: 7 }),
    });
    const data = await res.json();
    if (data.ok) {
      setLastBalanceId(data.event?.id || null);
      setBalanceMsg(data.message);
    } else setBalanceMsg(data.error || "Failed");
  };

  const undoBalance = async () => {
    if (!lastBalanceId) return;
    await fetch("/api/balance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "undo", event_id: lastBalanceId }),
    });
    setBalanceMsg("Balance undone. Targets unchanged for future days.");
    setLastBalanceId(null);
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-lg px-5 h-14 flex items-center justify-between">
          <div>
            <div className="font-semibold tracking-tight">Today</div>
            {streak > 0 && (
              <div className="text-[11px] text-muted-foreground">{streak}-day streak</div>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Link href="/settings" className="p-2 rounded-xl hover:bg-muted text-muted-foreground">
              <Settings2 className="w-5 h-5" />
            </Link>
            <button onClick={signOut} className="p-2 rounded-xl hover:bg-muted text-muted-foreground">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-lg px-5 py-6 space-y-6">
        {/* Rings — single source of truth from meals sum */}
        <div className="card-elevated p-6">
          <div className="flex justify-center mb-2">
            <ProgressRing
              value={totals.calories}
              max={targets.calories}
              size={120}
              stroke={9}
              label="kcal"
              unit={`/ ${targets.calories}`}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            <ProgressRing value={totals.protein} max={targets.protein} label="Protein" unit="g" size={72} stroke={6} />
            <ProgressRing value={totals.carbs} max={targets.carbs} label="Carbs" unit="g" size={72} stroke={6} />
            <ProgressRing value={totals.fat} max={targets.fat} label="Fat" unit="g" size={72} stroke={6} />
          </div>
        </div>

        {/* What fits rest of day */}
        {remaining.calories > 50 && (
          <div className="card-soft p-4 flex gap-3 items-start">
            <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div className="text-sm">
              <div className="font-semibold">Rest of today</div>
              <p className="text-muted-foreground mt-1 leading-relaxed">
                ~{formatCalories(remaining.calories)} kcal left
                {remaining.protein > 10 && (
                  <> · aim for ~{formatMacro(remaining.protein)}g protein</>
                )}
                . A rice bowl set or pho often fits; go lighter on fried noodles if oil is high.
              </p>
            </div>
          </div>
        )}

        {/* Soft balance if over */}
        {excess > 80 && (
          <div className="card-soft p-4 space-y-3 border border-amber-500/20">
            <div className="text-sm">
              <div className="font-semibold">Over by ~{formatCalories(excess)} kcal</div>
              <p className="text-muted-foreground mt-1">
                Optional: spread across the next 7 days (~{Math.round(excess / 7)}/day). Always undoable.
              </p>
            </div>
            <div className="flex gap-2">
              <button onClick={applyBalance} className="btn-secondary flex-1 h-10 text-sm">
                Balance gently
              </button>
              {lastBalanceId && (
                <button onClick={undoBalance} className="btn-secondary h-10 px-3 text-sm flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5" />
                  Undo
                </button>
              )}
            </div>
            {balanceMsg && <p className="text-xs text-muted-foreground">{balanceMsg}</p>}
          </div>
        )}

        <Link
          href="/app"
          className="btn-primary w-full h-14 flex items-center justify-center gap-2 text-[16px]"
        >
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
              {meals.map((m) => (
                <div key={m.id} className="card-soft p-4 flex justify-between gap-3">
                  <div className="min-w-0">
                    <div className="font-medium truncate">
                      {(m.items || []).map((i) => i.name).join(", ") || "Meal"}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {new Date(m.logged_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold">{formatCalories(m.total_calories)}</div>
                    <div className="text-[10px] text-muted-foreground">kcal</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
