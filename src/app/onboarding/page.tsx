"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { calculateTargets, calcBmi, bmiCategory } from "@/lib/nutrition";
import {
  getSessionAccount,
  getGuestProfile,
  setGuestProfile,
  isLocalSession,
  needsOnboarding,
} from "@/lib/guest";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft, Loader2, Sparkles } from "lucide-react";
import { RiceLogo } from "@/components/RiceLogo";

const STEPS = ["Body", "Activity", "Goal", "Plan"] as const;

type FormState = {
  sex: "male" | "female" | "other";
  age: string;
  heightCm: string;
  weightKg: string;
  activity: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal: "lose" | "maintain" | "gain";
  goalKg: string;
  goalWeeks: string;
};

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accountName, setAccountName] = useState("You");
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState<FormState>({
    sex: "male",
    age: "30",
    heightCm: "170",
    weightKg: "70",
    activity: "moderate",
    goal: "lose",
    goalKg: "5",
    goalWeeks: "10",
  });

  useEffect(() => {
    const acc = getSessionAccount();
    if (acc) {
      setAccountName(acc.name);
      const p = getGuestProfile();
      setForm((f) => ({
        ...f,
        sex: (p.sex as FormState["sex"]) || (acc.id === "mel" ? "female" : "male"),
        age: String(p.age || (acc.id === "mel" ? 28 : 30)),
        heightCm: String(p.height_cm || (acc.id === "mel" ? 162 : 175)),
        weightKg: String(p.weight_kg || (acc.id === "mel" ? 58 : 75)),
        activity: (p.activity as FormState["activity"]) || "moderate",
        goal: (p.goal as FormState["goal"]) || "lose",
        goalKg: String(p.goal_kg || 5),
        goalWeeks: String(p.goal_weeks || 10),
      }));
    } else {
      // Supabase path or no session — still allow form; finish handles both
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (!user && !isLocalSession()) router.replace("/login");
      });
    }
  }, [router, supabase.auth]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const live = useMemo(() => {
    const weightKg = Number(form.weightKg) || 0;
    const heightCm = Number(form.heightCm) || 0;
    const age = Number(form.age) || 25;
    const bmi = calcBmi(weightKg, heightCm);
    const plan = calculateTargets({
      sex: form.sex,
      age,
      heightCm,
      weightKg,
      activity: form.activity,
      goal: form.goal,
      goalKg: form.goal !== "maintain" ? Number(form.goalKg) || undefined : undefined,
      goalWeeks: form.goal !== "maintain" ? Number(form.goalWeeks) || undefined : undefined,
    });
    return { bmi, bmiLabel: bmiCategory(bmi), plan };
  }, [form]);

  const canNext = () => {
    if (step === 0)
      return (
        Number(form.age) > 10 &&
        Number(form.heightCm) > 100 &&
        Number(form.weightKg) > 30
      );
    if (step === 1) return !!form.activity;
    if (step === 2) {
      if (form.goal === "maintain") return true;
      return Number(form.goalKg) > 0 && Number(form.goalWeeks) > 0;
    }
    return true;
  };

  const finish = async () => {
    setLoading(true);
    setError(null);
    try {
      const weightKg = Number(form.weightKg);
      const heightCm = Number(form.heightCm);
      const age = Number(form.age);
      const plan = calculateTargets({
        sex: form.sex,
        age,
        heightCm,
        weightKg,
        activity: form.activity,
        goal: form.goal,
        goalKg: form.goal !== "maintain" ? Number(form.goalKg) || undefined : undefined,
        goalWeeks: form.goal !== "maintain" ? Number(form.goalWeeks) || undefined : undefined,
      });

      if (isLocalSession()) {
        setGuestProfile({
          sex: form.sex,
          age,
          height_cm: heightCm,
          weight_kg: weightKg,
          activity: form.activity,
          goal: form.goal,
          goal_kg: form.goal !== "maintain" ? Number(form.goalKg) : undefined,
          goal_weeks: form.goal !== "maintain" ? Number(form.goalWeeks) : undefined,
          bmi: plan.bmi,
          bmr: plan.bmr,
          tdee: plan.tdee,
          daily_calorie_target: plan.calories,
          daily_protein_target: plan.protein,
          daily_carbs_target: plan.carbs,
          daily_fat_target: plan.fat,
          targets_manual: false,
          onboarding_complete: true,
        });
        router.push("/dashboard");
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { error: upErr } = await supabase.from("profiles").upsert({
        id: user.id,
        sex: form.sex,
        age,
        height_cm: heightCm,
        weight_kg: weightKg,
        activity_level: form.activity,
        goal: form.goal,
        daily_calorie_target: plan.calories,
        daily_protein_target: plan.protein,
        daily_carbs_target: plan.carbs,
        daily_fat_target: plan.fat,
        targets_manual: false,
        updated_at: new Date().toISOString(),
      });
      if (upErr) throw upErr;
      router.push("/dashboard");
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Could not save plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col page-enter">
      <header className="px-5 h-14 flex items-center gap-2 border-b border-border/60">
        <RiceLogo size={28} />
        <div className="leading-tight">
          <div className="text-sm font-semibold">Fitness plan</div>
          <div className="text-[11px] text-muted-foreground">for {accountName}</div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-lg px-5 py-6 flex flex-col">
        {/* Progress */}
        <div className="flex gap-1.5 mb-8">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={cn(
                "h-1 flex-1 rounded-full",
                i <= step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>

        <div className="flex-1">
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Your body</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  We&apos;ll calculate BMI and a starting energy budget.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    ["male", "Male"],
                    ["female", "Female"],
                    ["other", "Other"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => update("sex", id)}
                    className={cn(
                      "h-11 rounded-xl text-sm font-medium border",
                      form.sex === id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground">Age</label>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={form.age}
                    onChange={(e) => update("age", e.target.value)}
                    className="input-modern mt-1 w-full px-3 py-3 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Height (cm)</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={form.heightCm}
                    onChange={(e) => update("heightCm", e.target.value)}
                    className="input-modern mt-1 w-full px-3 py-3 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground">Weight (kg)</label>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={form.weightKg}
                    onChange={(e) => update("weightKg", e.target.value)}
                    className="input-modern mt-1 w-full px-3 py-3 font-semibold"
                  />
                </div>
              </div>
              {live.bmi > 0 && (
                <div className="card-soft p-4">
                  <div className="text-xs text-muted-foreground uppercase">BMI</div>
                  <div className="text-2xl font-bold tabular-nums mt-0.5">
                    {live.bmi}
                    <span className="text-sm font-medium text-muted-foreground ml-2">
                      {live.bmiLabel}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    Asian cut-offs: healthy often cited ~18.5–22.9.
                  </p>
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Weekly activity</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  How active are you on a typical week?
                </p>
              </div>
              <div className="space-y-2">
                {(
                  [
                    ["sedentary", "Sedentary", "Desk job, little or no exercise"],
                    ["light", "Lightly active", "Walks / light exercise 1–3 days"],
                    ["moderate", "Moderately active", "Exercise 3–5 days a week"],
                    ["active", "Active", "Hard exercise 6–7 days"],
                    ["very_active", "Very active", "Physical job or 2× training"],
                  ] as const
                ).map(([id, title, desc]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => update("activity", id)}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl border transition-colors",
                      form.activity === id
                        ? "border-primary bg-primary/10"
                        : "border-border bg-card"
                    )}
                  >
                    <div className="font-semibold text-sm">{title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Your goal</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Lose fat, hold steady, or build up — from a food budget.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    ["lose", "Lose weight"],
                    ["maintain", "Maintain"],
                    ["gain", "Bulk / gain"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => update("goal", id)}
                    className={cn(
                      "h-12 rounded-xl text-xs font-semibold border px-1",
                      form.goal === id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-card border-border"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {form.goal !== "maintain" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground">
                      {form.goal === "lose" ? "Lose (kg)" : "Gain (kg)"}
                    </label>
                    <input
                      type="number"
                      inputMode="decimal"
                      value={form.goalKg}
                      onChange={(e) => update("goalKg", e.target.value)}
                      className="input-modern mt-1 w-full px-3 py-3 font-semibold"
                      placeholder="e.g. 10"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">In how many weeks?</label>
                    <input
                      type="number"
                      inputMode="numeric"
                      value={form.goalWeeks}
                      onChange={(e) => update("goalWeeks", e.target.value)}
                      className="input-modern mt-1 w-full px-3 py-3 font-semibold"
                      placeholder="e.g. 8"
                    />
                  </div>
                </div>
              )}
              {form.goal === "lose" && Number(form.goalKg) > 0 && Number(form.goalWeeks) > 0 && (
                <p className="text-xs text-muted-foreground leading-relaxed">
                  ~{(Number(form.goalKg) / (Number(form.goalWeeks) / 4.33)).toFixed(1)} kg / month.
                  Safer pace is often ~0.5–1% body weight per week.
                </p>
              )}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Your daily plan</h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Recommended daily calorie goal from your stats.
                </p>
              </div>
              <div className="card-elevated p-5 space-y-3">
                <div>
                  <div className="text-xs uppercase text-muted-foreground">Daily calorie goal</div>
                  <div className="text-4xl font-bold tabular-nums mt-1">
                    {live.plan.calories}
                    <span className="text-base font-medium text-muted-foreground ml-1">kcal</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="rounded-xl bg-muted/60 p-2">
                    <div className="text-[10px] text-muted-foreground">Protein</div>
                    <div className="font-semibold">{live.plan.protein}g</div>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-2">
                    <div className="text-[10px] text-muted-foreground">Carbs</div>
                    <div className="font-semibold">{live.plan.carbs}g</div>
                  </div>
                  <div className="rounded-xl bg-muted/60 p-2">
                    <div className="text-[10px] text-muted-foreground">Fat</div>
                    <div className="font-semibold">{live.plan.fat}g</div>
                  </div>
                </div>
                <div className="text-xs text-muted-foreground space-y-1 pt-1 border-t border-border/60">
                  <div>BMI {live.plan.bmi} · {live.plan.bmi_label}</div>
                  <div>
                    BMR ~{live.plan.bmr} · TDEE ~{live.plan.tdee} kcal
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You can fine-tune this anytime under <strong>Daily calorie goal</strong> in
                settings. Food logging stays the main lever.
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-3 rounded-2xl bg-red-500/10 text-red-600 px-4 py-3 text-sm">{error}</div>
        )}

        <div className="flex gap-3 pt-4">
          {step > 0 && (
            <button
              type="button"
              onClick={() => setStep((s) => s - 1)}
              className="h-14 w-14 rounded-2xl border border-border bg-card flex items-center justify-center shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              type="button"
              onClick={() => canNext() && setStep((s) => s + 1)}
              disabled={!canNext()}
              className="btn-primary flex-1 h-14 flex items-center justify-center gap-2 disabled:opacity-40"
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={finish}
              disabled={loading}
              className="btn-primary flex-1 h-14 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Start my plan
                </>
              )}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
