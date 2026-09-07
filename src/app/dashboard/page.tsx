"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, LogOut, Loader2 } from "lucide-react";
import { formatCalories, formatMacro } from "@/lib/utils";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
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

      // Load today's meals
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-lg px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              RT
            </div>
            <span className="font-semibold">RiceTrack</span>
          </div>
          <button onClick={signOut} className="p-2 text-muted-foreground hover:text-foreground">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-lg px-4 py-6 space-y-6">
        <div>
          <h1 className="text-xl font-bold">Today</h1>
          <p className="text-sm text-muted-foreground">{new Date().toLocaleDateString(undefined, { weekday: "long", month: "short", day: "numeric" })}</p>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-4 gap-2">
          <div className="rounded-xl bg-card border border-border p-3 text-center">
            <div className="text-xs text-muted-foreground">Calories</div>
            <div className="text-lg font-bold">{formatCalories(totals.calories)}</div>
          </div>
          <div className="rounded-xl bg-card border border-border p-3 text-center">
            <div className="text-xs text-muted-foreground">Protein</div>
            <div className="text-lg font-bold">{formatMacro(totals.protein)}g</div>
          </div>
          <div className="rounded-xl bg-card border border-border p-3 text-center">
            <div className="text-xs text-muted-foreground">Carbs</div>
            <div className="text-lg font-bold">{formatMacro(totals.carbs)}g</div>
          </div>
          <div className="rounded-xl bg-card border border-border p-3 text-center">
            <div className="text-xs text-muted-foreground">Fat</div>
            <div className="text-lg font-bold">{formatMacro(totals.fat)}g</div>
          </div>
        </div>

        {/* Log button */}
        <Link
          href="/"
          className="w-full h-14 rounded-2xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2 text-lg"
        >
          <Camera className="w-6 h-6" />
          Log a meal
        </Link>

        {/* Meals list */}
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground">Today's meals</h2>
          {meals.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground text-sm">
              No meals logged yet. Snap your first Asian meal!
            </div>
          ) : (
            meals.map((meal) => (
              <div key={meal.id} className="rounded-xl border border-border bg-card p-4 flex items-center gap-4">
                {meal.photo_url && (
                  <img src={meal.photo_url} alt="" className="w-16 h-16 rounded-lg object-cover" />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">
                    {meal.items?.[0]?.name || "Meal"} {meal.items?.length > 1 ? `+${meal.items.length - 1}` : ""}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(meal.logged_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{formatCalories(meal.total_calories)}</div>
                  <div className="text-xs text-muted-foreground">kcal</div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
