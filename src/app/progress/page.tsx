"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader2, Scale } from "lucide-react";
import {
  getSessionAccount,
  getGuestMeals,
  getGuestProfile,
  isLocalSession,
  needsOnboarding,
  setGuestProfile,
  ensureLocalSession,
} from "@/lib/guest";
import { getWeightLogs, addWeightLog, type WeightLog } from "@/lib/activity";
import { BottomNav } from "@/components/BottomNav";
import { ThemeToggle } from "@/components/ThemeToggle";
import { calcBmi, bmiCategory } from "@/lib/nutrition";
import { localDateKey, localDateKeyFromIso } from "@/lib/dates";
import { avgSleepHours, avgEnergy, getSleepLogs, getEnergyLogs, ENERGY_LABELS } from "@/lib/wellness";

type Range = "30" | "90" | "180" | "all";

export default function ProgressPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [weights, setWeights] = useState<WeightLog[]>([]);
  const [mealDays, setMealDays] = useState(0);
  const [streak, setStreak] = useState(0);
  const [range, setRange] = useState<Range>("90");
  const [weightInput, setWeightInput] = useState("");
  const [profile, setProfile] = useState(getGuestProfile());
  const [name, setName] = useState("You");
  const [sleepAvg, setSleepAvg] = useState<number | null>(null);
  const [energyAvg, setEnergyAvg] = useState<number | null>(null);
  const [lastSleep, setLastSleep] = useState<string | null>(null);

  const refresh = () => {
    ensureLocalSession();
    if (!isLocalSession()) {
      // still show local progress for demo accounts primarily
    }
    if (needsOnboarding()) {
      router.replace("/onboarding");
      return;
    }
    const acc = getSessionAccount();
    setName(acc?.name || "You");
    const p = getGuestProfile();
    setProfile(p);
    setWeights(getWeightLogs());
    const meals = getGuestMeals();
    const days = new Set(meals.map((m) => localDateKeyFromIso(m.logged_at)));
    setMealDays(days.size);
    let s = 0;
    const d = new Date();
    for (let i = 0; i < 60; i++) {
      const key = localDateKey(d);
      if (days.has(key)) {
        s++;
        d.setDate(d.getDate() - 1);
      } else if (i === 0) {
        d.setDate(d.getDate() - 1);
      } else break;
    }
    setStreak(s);
    if (p.weight_kg) setWeightInput(String(p.weight_kg));
    setSleepAvg(avgSleepHours(7));
    setEnergyAvg(avgEnergy(7));
    const sleeps = getSleepLogs();
    const last = sleeps[sleeps.length - 1];
    setLastSleep(last ? `${last.duration_hours}h (${last.bed_time}→${last.wake_time})` : null);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  const filtered = useMemo(() => {
    if (range === "all") return weights;
    const days = Number(range);
    const cut = new Date();
    cut.setDate(cut.getDate() - days);
    const key = localDateKey(cut);
    return weights.filter((w) => w.date >= key);
  }, [weights, range]);

  const chart = useMemo(() => {
    if (filtered.length === 0) return null;
    const vals = filtered.map((w) => w.weight_kg);
    const min = Math.min(...vals) - 1;
    const max = Math.max(...vals) + 1;
    const w = 320;
    const h = 140;
    const pts = filtered.map((entry, i) => {
      const x = filtered.length === 1 ? w / 2 : (i / (filtered.length - 1)) * w;
      const y = h - ((entry.weight_kg - min) / (max - min || 1)) * h;
      return { x, y, ...entry };
    });
    const path = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
    return { min, max, pts, path, w, h };
  }, [filtered]);

  const startW = filtered[0]?.weight_kg;
  const lastW = filtered[filtered.length - 1]?.weight_kg ?? profile.weight_kg;
  const goalKg = profile.goal_kg;
  const goalType = profile.goal || "maintain";
  let goalPct = 0;
  if (goalType === "lose" && goalKg && startW && lastW) {
    const lost = Math.max(0, startW - lastW);
    goalPct = Math.min(100, Math.round((lost / goalKg) * 100));
  } else if (goalType === "gain" && goalKg && startW && lastW) {
    const gained = Math.max(0, lastW - startW);
    goalPct = Math.min(100, Math.round((gained / goalKg) * 100));
  }

  const bmi = lastW && profile.height_cm ? calcBmi(lastW, profile.height_cm) : profile.bmi || 0;

  const logWeight = () => {
    const v = Number(weightInput);
    if (!v || v < 30 || v > 300) return;
    addWeightLog(v);
    setGuestProfile({ weight_kg: v, bmi: profile.height_cm ? calcBmi(v, profile.height_cm) : profile.bmi });
    refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Loading progress…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-bottom">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto max-w-lg px-4 h-14 flex items-center justify-between">
          <div>
            <div className="font-semibold tracking-tight">Progress</div>
            <div className="text-[11px] text-muted-foreground">{name}&apos;s journey</div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle className="!p-2" />
            <Link href="/settings" className="text-xs text-primary font-medium">
              Edit goals
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-4 py-5 space-y-5 page-enter">
        {weights.length === 0 && (
          <div className="card-soft p-4 text-sm text-muted-foreground">
            <p className="font-medium text-foreground mb-1">Build your progress</p>
            Log meals on Home and add a weight below. Charts fill in as you go.
            <Link href="/app" className="block mt-2 text-primary font-semibold text-sm">
              Log a meal →
            </Link>
          </div>
        )}
        <div className="grid grid-cols-2 gap-3">
          <div className="card-elevated p-4">
            <div className="text-xs text-muted-foreground">Sleep (7-day avg)</div>
            <div className="text-2xl font-bold tabular-nums mt-1">
              {sleepAvg != null ? sleepAvg : ", "}
              {sleepAvg != null && (
                <span className="text-sm font-medium text-muted-foreground ml-1">h</span>
              )}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1 truncate">
              {lastSleep || "Log sleep on Home"}
            </div>
          </div>
          <div className="card-elevated p-4">
            <div className="text-xs text-muted-foreground">Energy (7-day avg)</div>
            <div className="text-2xl font-bold tabular-nums mt-1">
              {energyAvg != null ? energyAvg : ", "}
              {energyAvg != null && (
                <span className="text-sm font-medium text-muted-foreground ml-1">/5</span>
              )}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">
              {energyAvg != null
                ? ENERGY_LABELS[Math.round(energyAvg) as 1 | 2 | 3 | 4 | 5] || ", "
                : "Tap 1–5 on Home"}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="card-elevated p-4">
            <div className="flex items-center gap-2 text-muted-foreground text-xs">
              <Scale className="w-3.5 h-3.5" />
              Latest weight
            </div>
            <div className="text-2xl font-bold tabular-nums mt-1">
              {lastW ? `${lastW}` : ", "}
              <span className="text-sm font-medium text-muted-foreground ml-1">kg</span>
            </div>
            {bmi > 0 && (
              <div className="text-[11px] text-muted-foreground mt-1">
                BMI {bmi} · {bmiCategory(bmi)}
              </div>
            )}
          </div>
          <div className="card-elevated p-4">
            <div className="text-xs text-muted-foreground">Days logged</div>
            <div className="text-2xl font-bold tabular-nums mt-1">{mealDays}</div>
            <div className="text-[11px] text-muted-foreground mt-1">
              {streak > 0 ? `${streak}-day streak` : "Log today to start a streak"}
            </div>
          </div>
        </div>

        {/* Range */}
        <div className="flex gap-1.5 flex-wrap">
          {(
            [
              ["30", "30 days"],
              ["90", "90 days"],
              ["180", "6 months"],
              ["all", "All time"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              onClick={() => setRange(id)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border ${
                range === id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="card-soft p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-sm">Weight trend</div>
            {goalType !== "maintain" && goalKg ? (
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                {goalPct}% of {goalKg} kg goal
              </span>
            ) : null}
          </div>

          {chart ? (
            <div className="overflow-x-auto">
              <svg viewBox={`0 0 ${chart.w} ${chart.h}`} className="w-full h-36">
                <path
                  d={chart.path}
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {chart.pts.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r={i === chart.pts.length - 1 ? 4.5 : 3} fill="var(--primary)" />
                ))}
              </svg>
              <div className="flex justify-between text-[10px] text-muted-foreground px-1">
                <span>{filtered[0]?.date.slice(5)}</span>
                <span>{filtered[filtered.length - 1]?.date.slice(5)}</span>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground py-6 text-center">
              Log your weight below to see the trend.
            </p>
          )}

          {goalType === "lose" && goalKg ? (
            <p className="text-xs text-primary leading-relaxed">
              Consistency beats perfection, Asian plates are trackable one component at a time.
            </p>
          ) : (
            <p className="text-xs text-muted-foreground leading-relaxed">
              Track weight weekly under the same conditions for cleaner trends.
            </p>
          )}
        </div>

        <div className="card-soft p-4 space-y-3">
          <div className="font-semibold text-sm">Log weight</div>
          <div className="flex gap-2">
            <input
              type="number"
              inputMode="decimal"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              placeholder="kg"
              className="input-modern flex-1 px-3 py-2.5 text-sm"
            />
            <button type="button" onClick={logWeight} className="btn-primary px-5 h-11 text-sm">
              Save
            </button>
          </div>
        </div>
      </main>
      <BottomNav />
    </div>
  );
}
