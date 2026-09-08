"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, LogOut, Loader2, Settings2 } from "lucide-react";
import { formatCalories, formatMacro } from "@/lib/utils";
import { ProgressRing } from "@/components/ProgressRing";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUser(user);

      // Profile
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

      // Today's meals
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const { data } = await supabase
        .from("meals")
        .select("*")
        .eq("user_id", user.id)
        .gte("logged_at", today.toISOString())
        .order("logged_at", { ascending: false });

      setMeals(data || []);
      if (data) {
        setTotals({
          calories: data.reduce((s, m) => s + Number(m.total_calories), 0),
          protein: data.reduce((s, m) => s + Number(m.total_protein), 0),
          carbs: data.reduce((s, m) => s + Number(m.total_carbs), 0),
          fat: data.reduce((s, m) => s + Number(m.total_fat), 0),
        });
      }
      setLoading(false);
    };
    load();
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const targets = {
    calories: profile?.daily_calorie_target || 2000,
    protein: profile?.daily_protein_target || 120,
    carbs: profile?.daily_carbs_target || 200,
    fat: profile?.daily_fat_target || 65,
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/60">
        <div className="mx-auto max-w-lg px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-sm">
              RT
            </div>
            <span className="font-semibold tracking-tight">RiceTrack</span>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/onboarding" className="p-2.5 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-colors">
              <Settings2 className="w-5 h-5" />
            </Link>
            <button onClick={signOut} className="p-2.5 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-colors">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-lg px-5 py-6 space-y-7 page-enter">
        <div>
          <p className="text-sm text-muted-foreground font-medium">
            {new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}
          </p>
          <h1 className="text-2xl font-bold tracking-tight mt-0.5">Today’s nutrition</h1>
        </div>

        {/* Progress rings */}
        <div className="card-elevated p-5">
          <div className="flex justify-between items-center gap-2">
            <ProgressRing value={totals.calories} max={targets.calories} label="Calories" unit="kcal" size={96} stroke={8} />
            <ProgressRing value={totals.protein} max={targets.protein} label="Protein" unit="g" size={72} />
            <ProgressRing value={totals.carbs} max={targets.carbs} label="Carbs" unit="g" size={72} />
            <ProgressRing value={totals.fat} max={targets.fat} label="Fat" unit="g" size={72} />
          </div>
          <div className="mt-4 pt-4 border-t border-border flex justify-between text-xs text-muted-foreground">
            <span>Target {formatCalories(targets.calories)} kcal</span>
            <span>
              {totals.calories > targets.calories
                ? `${formatCalories(totals.calories - targets.calories)} over`
                : `${formatCalories(targets.calories - totals.calories)} left`}
            </span>
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="btn-primary w-full h-[3.75rem] flex items-center justify-center gap-2.5 text-[17px]"
        >
          <Camera className="w-5 h-5" />
          Log a meal
        </Link>

        {/* Meals */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Meals</h2>
            <span className="text-xs text-muted-foreground">{meals.length} logged</span>
          </div>

          {meals.length === 0 ? (
            <div className="card-soft p-10 text-center">
              <div className="w-12 h-12 rounded-2xl bg-primary-soft mx-auto flex items-center justify-center mb-3">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <p className="font-medium">No meals yet</p>
              <p className="text-sm text-muted-foreground mt-1">Snap your first Asian meal to start tracking</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {meals.map((meal, i) => (
                <div
                  key={meal.id}
                  className="card-soft p-3.5 flex items-center gap-3.5 animate-fade-up"
                  style={{ animationDelay: `${i * 40}ms` }}
                >
                  {meal.photo_url ? (
                    <img
                      src={meal.photo_url}
                      alt=""
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-muted flex items-center justify-center shrink-0">
                      <Camera className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate">
                      {meal.items?.[0]?.name || "Meal"}
                      {meal.items?.length > 1 ? ` +${meal.items.length - 1}` : ""}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {new Date(meal.logged_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      {meal.cuisine_detected && (
                        <span className="capitalize"> · {meal.cuisine_detected.replace("_", " ")}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-bold">{formatCalories(meal.total_calories)}</div>
                    <div className="text-[11px] text-muted-foreground">kcal</div>
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
