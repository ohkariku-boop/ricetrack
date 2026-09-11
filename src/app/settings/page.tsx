"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BottomNav } from "@/components/BottomNav";
import { ArrowLeft, Loader2, Bell } from "lucide-react";
import { isLocalSession, getGuestProfile, setGuestProfile, ensureLocalSession } from "@/lib/guest";
import {
  DEFAULT_REMINDERS,
  getReminderSettings,
  saveReminderSettings,
  requestNotificationPermission,
  notificationPermission,
  registerServiceWorker,
  startReminderScheduler,
  showMealReminder,
  type ReminderSettings,
} from "@/lib/reminders";

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
  const [reminders, setReminders] = useState<ReminderSettings>(DEFAULT_REMINDERS);
  const [perm, setPerm] = useState<NotificationPermission | "unsupported">("default");
  const [reminderMsg, setReminderMsg] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setReminders(getReminderSettings());
    setPerm(notificationPermission());
    (async () => {
      ensureLocalSession();
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
        setLoading(false);
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
    else setMsg("Saved. Your daily calorie goal is under your control.");
  };

  const persistReminders = (next: ReminderSettings) => {
    setReminders(next);
    saveReminderSettings(next);
  };

  const enableReminders = async () => {
    setReminderMsg(null);
    await registerServiceWorker();
    const p = await requestNotificationPermission();
    setPerm(p);
    if (p === "unsupported") {
      setReminderMsg("Notifications are not supported in this browser.");
      return;
    }
    if (p !== "granted") {
      setReminderMsg("Permission blocked. Enable notifications in browser or phone settings.");
      return;
    }
    const next = { ...reminders, enabled: true };
    persistReminders(next);
    startReminderScheduler();
    setReminderMsg("Reminders on. Keep the app installed for best results on Android.");
  };

  const disableReminders = () => {
    persistReminders({ ...reminders, enabled: false });
    setReminderMsg("Reminders off.");
  };

  const testReminder = async () => {
    setReminderMsg(null);
    try {
      await registerServiceWorker();
      const p = await requestNotificationPermission();
      setPerm(p);
      if (p === "unsupported") {
        setReminderMsg("This browser does not support notifications.");
        return;
      }
      if (p !== "granted") {
        setReminderMsg("Allow notifications when prompted, or enable them in system settings.");
        return;
      }
      const result = await showMealReminder({
        id: "test",
        label: "Test",
        time: "00:00",
        enabled: true,
      });
      if (!result.ok) {
        setReminderMsg(result.error || "Notification failed.");
        return;
      }
      // In-app confirmation: mobile OS often hides banners while RiceTrack is open
      setReminderMsg(
        "Reminder fired. If you did not see a system banner, check the notification shade — many phones hide pop-ups while the app is open."
      );
    } catch (e) {
      setReminderMsg(e instanceof Error ? e.message : "Test failed.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-bottom">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-lg px-5 h-14 flex items-center gap-3">
          <Link href="/dashboard" className="p-2 -ml-2 rounded-xl hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="font-semibold flex-1">Settings</h1>
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

        {/* Meal reminders */}
        <div className="card-soft p-4 space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">Meal reminders</div>
              <div className="text-xs text-muted-foreground mt-0.5">
                Local alerts to log breakfast, lunch, or dinner. No account required.
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            {!reminders.enabled ? (
              <button type="button" onClick={enableReminders} className="btn-primary flex-1 h-11 text-sm">
                Turn on
              </button>
            ) : (
              <button type="button" onClick={disableReminders} className="btn-secondary flex-1 h-11 text-sm">
                Turn off
              </button>
            )}
            <button type="button" onClick={testReminder} className="btn-secondary h-11 px-4 text-sm">
              Test
            </button>
          </div>

          <div className="text-[11px] text-muted-foreground">
            Permission:{" "}
            <span className="font-medium text-foreground">
              {perm === "granted" ? "allowed" : perm === "denied" ? "blocked" : perm === "unsupported" ? "unsupported" : "not asked"}
            </span>
            {reminders.enabled ? " · reminders on" : " · reminders off"}
          </div>

          <div className="space-y-3 pt-1">
            {reminders.slots.map((slot, idx) => (
              <div key={slot.id} className="flex items-center gap-3">
                <label className="flex items-center gap-2 min-w-[5.5rem]">
                  <input
                    type="checkbox"
                    checked={slot.enabled}
                    onChange={(e) => {
                      const slots = reminders.slots.map((s, i) =>
                        i === idx ? { ...s, enabled: e.target.checked } : s
                      );
                      persistReminders({ ...reminders, slots });
                    }}
                    className="rounded border-border"
                  />
                  <span className="text-sm font-medium">{slot.label}</span>
                </label>
                <input
                  type="time"
                  value={slot.time}
                  onChange={(e) => {
                    const slots = reminders.slots.map((s, i) =>
                      i === idx ? { ...s, time: e.target.value || s.time } : s
                    );
                    persistReminders({ ...reminders, slots });
                  }}
                  className="input-modern flex-1 px-3 py-2 text-sm"
                />
              </div>
            ))}
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Works best on Android Chrome when RiceTrack is installed to the home screen. iPhone needs
            Add to Home Screen and notification permission. Alerts are most reliable when the app has
            been opened recently.
          </p>

          {reminderMsg && (
            <div className="rounded-xl bg-muted px-3 py-2 text-xs text-center">{reminderMsg}</div>
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold mb-1">Nutrition goals</h2>
          <p className="text-sm text-muted-foreground">
            Your daily targets for calories and macros. Change anytime.
          </p>
        </div>
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
      <BottomNav />
    </div>
  );
}
