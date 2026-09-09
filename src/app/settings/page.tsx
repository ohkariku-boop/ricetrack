"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Loader2, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { isGuest, getGuestProfile, setGuestProfile } from "@/lib/guest";

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState({
    daily_calorie_target: 2000,
    daily_protein_target: 120,
    daily_carbs_target: 200,
    daily_fat_target: 65,
    weight_kg: 70,
    targets_manual: true,
  });

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user && isGuest()) {
        const g = getGuestProfile();
        setForm({
          daily_calorie_target: g.daily_calorie_target ?? 2000,
          daily_protein_target: g.daily_protein_target ?? 120,
          daily_carbs_target: g.daily_carbs_target ?? 200,
          daily_fat_target: g.daily_fat_target ?? 65,
          weight_kg: Number(g.weight_kg) || 70,
          targets_manual: true,
        });
        setLoading(false);
        return;
      }
      if (!user) {
        router.push("/login");
        return;
      }
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      if (data) {
        setForm({
          daily_calorie_target: data.daily_calorie_target ?? 2000,
          daily_protein_target: data.daily_protein_target ?? 120,
          daily_carbs_target: data.daily_carbs_target ?? 200,
          daily_fat_target: data.daily_fat_target ?? 65,
          weight_kg: Number(data.weight_kg) || 70,
          targets_manual: data.targets_manual ?? true,
        });
      }
      setLoading(false);
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    setMsg(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user && isGuest()) {
      setGuestProfile({
        daily_calorie_target: form.daily_calorie_target,
        daily_protein_target: form.daily_protein_target,
        daily_carbs_target: form.daily_carbs_target,
        daily_fat_target: form.daily_fat_target,
        weight_kg: form.weight_kg,
        targets_manual: true,
      });
      setSaving(false);
      setMsg("Saved on this device (guest).");
      return;
    }
    if (!user) return;
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      ...form,
      targets_manual: true,
      updated_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) setMsg(error.message);
    else setMsg("Saved — your targets are under your control.");
  };

  const logWeight = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("weight_logs").upsert({
      user_id: user.id,
      weight_kg: form.weight_kg,
      logged_at: new Date().toISOString().slice(0, 10),
    });
    await supabase.from("profiles").update({ weight_kg: form.weight_kg }).eq("id", user.id);
    setMsg("Weight logged for today.");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-lg px-5 h-14 flex items-center gap-3">
          <Link href="/dashboard" className="p-2 -ml-2 rounded-xl hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold">Targets & weight</h1>
        </div>
      </header>
      <main className="mx-auto max-w-lg px-5 py-6 space-y-6">
        <p className="text-sm text-muted-foreground">
          Override anything the calculator suggested. Experienced trackers stay in control.
        </p>
        <div className="space-y-4">
          {(
            [
              ["daily_calorie_target", "Calories (kcal)"],
              ["daily_protein_target", "Protein (g)"],
              ["daily_carbs_target", "Carbs (g)"],
              ["daily_fat_target", "Fat (g)"],
            ] as const
          ).map(([key, label]) => (
            <div key={key}>
              <label className="text-sm font-medium text-muted-foreground">{label}</label>
              <input
                type="number"
                className="input-modern mt-1.5 w-full px-4 py-3"
                value={form[key]}
                onChange={(e) =>
                  setForm((f) => ({ ...f, [key]: Number(e.target.value) || 0 }))
                }
              />
            </div>
          ))}
        </div>
        <button onClick={save} disabled={saving} className="btn-primary w-full h-12">
          {saving ? "Saving…" : "Save targets"}
        </button>

        <div className="border-t border-border pt-6 space-y-3">
          <h2 className="font-semibold">Weight today</h2>
          <input
            type="number"
            step="0.1"
            className="input-modern w-full px-4 py-3"
            value={form.weight_kg}
            onChange={(e) =>
              setForm((f) => ({ ...f, weight_kg: Number(e.target.value) || 0 }))
            }
          />
          <button onClick={logWeight} className="btn-secondary w-full h-11">
            Log weight
          </button>
        </div>

        {msg && (
          <div className="rounded-2xl bg-primary/10 text-primary px-4 py-3 text-sm flex items-center gap-2">
            <Check className="w-4 h-4" />
            {msg}
          </div>
        )}
      </main>
    </div>
  );
}
