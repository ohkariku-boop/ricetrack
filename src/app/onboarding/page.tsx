"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { calculateTargets } from "@/lib/nutrition";
import { cn } from "@/lib/utils";
import { ChevronRight, ChevronLeft, Loader2, Sparkles } from "lucide-react";

const STEPS = ["About you", "Body", "Lifestyle", "Goals"] as const;

type FormState = {
  sex: "male" | "female" | "other";
  age: string;
  heightCm: string;
  weightKg: string;
  activity: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal: "lose" | "maintain" | "gain";
  preferredCuisines: string[];
};

const CUISINES = [
  { id: "chinese", label: "Chinese" },
  { id: "japanese", label: "Japanese" },
  { id: "korean", label: "Korean" },
  { id: "thai", label: "Thai" },
  { id: "vietnamese", label: "Vietnamese" },
  { id: "indian", label: "Indian" },
  { id: "malay", label: "Malay" },
  { id: "indonesian", label: "Indonesian" },
  { id: "filipino", label: "Filipino" },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState<FormState>({
    sex: "male",
    age: "28",
    heightCm: "170",
    weightKg: "68",
    activity: "moderate",
    goal: "lose",
    preferredCuisines: ["chinese", "japanese"],
  });

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((f) => ({ ...f, [key]: value }));
  };

  const toggleCuisine = (id: string) => {
    setForm((f) => ({
      ...f,
      preferredCuisines: f.preferredCuisines.includes(id)
        ? f.preferredCuisines.filter((c) => c !== id)
        : [...f.preferredCuisines, id],
    }));
  };

  const canNext = () => {
    if (step === 0) return !!form.sex;
    if (step === 1) return Number(form.age) > 0 && Number(form.heightCm) > 0 && Number(form.weightKg) > 0;
    if (step === 2) return !!form.activity;
    return true;
  };

  const finish = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const targets = calculateTargets({
        sex: form.sex,
        age: Number(form.age),
        heightCm: Number(form.heightCm),
        weightKg: Number(form.weightKg),
        activity: form.activity,
        goal: form.goal,
      });

      const { error: upsertError } = await supabase.from("profiles").upsert({
        id: user.id,
        email: user.email,
        sex: form.sex,
        age: Number(form.age),
        height_cm: Number(form.heightCm),
        weight_kg: Number(form.weightKg),
        activity_level: form.activity,
        goal: form.goal,
        preferred_cuisines: form.preferredCuisines,
        daily_calorie_target: targets.calories,
        daily_protein_target: targets.protein,
        daily_carbs_target: targets.carbs,
        daily_fat_target: targets.fat,
        updated_at: new Date().toISOString(),
      });

      if (upsertError) throw upsertError;
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Progress */}
      <div className="px-5 pt-6 pb-2">
        <div className="flex gap-1.5 max-w-md mx-auto">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 flex-1 rounded-full transition-all duration-500",
                i <= step ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground mt-3 font-medium tracking-wide uppercase">
          {STEPS[step]}
        </p>
      </div>

      <main className="flex-1 flex flex-col px-5 pb-8 max-w-md mx-auto w-full page-enter">
        {/* Step content */}
        <div className="flex-1 flex flex-col justify-center py-6 space-y-8">
          {step === 0 && (
            <div className="space-y-6 animate-fade-up">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">How should we call you?</h1>
                <p className="text-muted-foreground mt-2 text-[15px]">This helps us personalize your plan.</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {(["male", "female", "other"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => update("sex", s)}
                    className={cn(
                      "h-14 rounded-2xl border-2 font-medium capitalize transition-all",
                      form.sex === s
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border bg-card text-foreground hover:border-primary/40"
                    )}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6 animate-fade-up">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Your body</h1>
                <p className="text-muted-foreground mt-2 text-[15px]">Used only to calculate accurate targets.</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Age</label>
                  <input
                    type="number"
                    value={form.age}
                    onChange={(e) => update("age", e.target.value)}
                    className="input-modern mt-1.5 w-full px-4 py-3.5 text-lg font-semibold"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Height (cm)</label>
                    <input
                      type="number"
                      value={form.heightCm}
                      onChange={(e) => update("heightCm", e.target.value)}
                      className="input-modern mt-1.5 w-full px-4 py-3.5 text-lg font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Weight (kg)</label>
                    <input
                      type="number"
                      value={form.weightKg}
                      onChange={(e) => update("weightKg", e.target.value)}
                      className="input-modern mt-1.5 w-full px-4 py-3.5 text-lg font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fade-up">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Activity level</h1>
                <p className="text-muted-foreground mt-2 text-[15px]">How active are you on a typical week?</p>
              </div>
              <div className="space-y-2.5">
                {(
                  [
                    ["sedentary", "Sedentary", "Desk job, little exercise"],
                    ["light", "Lightly active", "Light exercise 1–3 days/week"],
                    ["moderate", "Moderately active", "Exercise 3–5 days/week"],
                    ["active", "Active", "Hard exercise 6–7 days/week"],
                    ["very_active", "Very active", "Physical job + training"],
                  ] as const
                ).map(([id, title, desc]) => (
                  <button
                    key={id}
                    onClick={() => update("activity", id)}
                    className={cn(
                      "w-full text-left px-4 py-3.5 rounded-2xl border-2 transition-all",
                      form.activity === id
                        ? "border-primary bg-primary-soft"
                        : "border-border bg-card hover:border-primary/30"
                    )}
                  >
                    <div className="font-semibold">{title}</div>
                    <div className="text-sm text-muted-foreground mt-0.5">{desc}</div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fade-up">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Your goal</h1>
                <p className="text-muted-foreground mt-2 text-[15px]">We’ll tailor calories and macros for you.</p>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {(
                  [
                    ["lose", "Lose"],
                    ["maintain", "Maintain"],
                    ["gain", "Gain"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    onClick={() => update("goal", id)}
                    className={cn(
                      "h-14 rounded-2xl border-2 font-semibold transition-all",
                      form.goal === id
                        ? "border-primary bg-primary-soft text-primary"
                        : "border-border bg-card"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div>
                <label className="text-sm font-medium text-muted-foreground">Favorite cuisines</label>
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {CUISINES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => toggleCuisine(c.id)}
                      className={cn(
                        "px-3.5 py-2 rounded-full text-sm font-medium border transition-all",
                        form.preferredCuisines.includes(c.id)
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-card border-border text-muted-foreground"
                      )}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="mb-4 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {/* Nav */}
        <div className="flex gap-3">
          {step > 0 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="h-14 w-14 rounded-2xl border border-border bg-card flex items-center justify-center shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button
              onClick={() => canNext() && setStep((s) => s + 1)}
              disabled={!canNext()}
              className="btn-primary flex-1 h-14 flex items-center justify-center gap-2 disabled:opacity-40"
            >
              Continue
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={finish}
              disabled={loading}
              className="btn-primary flex-1 h-14 flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Create my plan
                </>
              )}
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
