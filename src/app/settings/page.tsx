"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { ArrowLeft, Loader2 } from "lucide-react";
import { isLocalSession, getGuestProfile, setGuestProfile } from "@/lib/guest";

export default function SettingsPage() {
  const [form, setForm] = useState({
    daily_calorie_target: 2000,
    daily_protein_target: 120,
    daily_carbs_target: 200,
    daily_fat_target: 65,
    weight_kg: 70,
    targets_manual: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user && isLocalSession()) {
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
  }, [router, supabase]);

  const save = async () => {
    setSaving(true);
    setMsg(null);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user && isLocalSession()) {
      setGuestProfile({
        daily_calorie_target: form.daily_calorie_target,
        daily_protein_target: form.daily_protein_target,
        daily_carbs_target: form.daily_carbs_target,
        daily_fat_target: form.daily_fat_target,
        weight_kg: form.weight_kg,
        targets_manual: true,
      });
      setSaving(false);
      setMsg("Saved on this device.");
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
    else setMsg("Saved — your daily calorie goal is under your control.");
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
          <h1 className="font-semibold flex-1">Daily calorie goal</h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="mx-auto max-w-lg px-5 py-6 space-y-6">
        <div className="card-soft p-4 flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-medium">Appearance</div>
            <div className="text-xs text-muted-foreground">Light or dark background</div>
          </div>
          <ThemeToggle />
        </div>
        <p className="text-sm text-muted-foreground">
          Override the plan calculator anytime. Experienced trackers stay in control.
        </p>
        <div className="space-y-4">
          {(
            [
              ["daily_calorie_target", "Daily calorie goal (kcal)"],
              ["daily_protein_target", "Protein goal (g)"],
              ["daily_carbs_target", "Carbs goal (g)"],
              ["daily_fat_target", "Fat goal (g)"],
              ["weight_kg", "Current weight (kg)"],
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

        <button
          type="button"
          onClick={save}
          disabled={saving}
          className="btn-primary w-full h-12 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save goals"}
        </button>

        {isLocalSession() && (
          <button
            type="button"
            className="btn-secondary w-full h-12 text-sm"
            onClick={() => {
              setGuestProfile({ onboarding_complete: false });
              router.push("/onboarding");
            }}
          >
            Redo fitness plan
          </button>
        )}

        {msg && (
          <div className="rounded-2xl bg-primary/10 text-primary px-4 py-3 text-sm text-center">
            {msg}
          </div>
        )}
      </main>
    </div>
  );
}
