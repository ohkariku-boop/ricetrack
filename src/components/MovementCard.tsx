"use client";

import { useMemo, useState } from "react";
import { Dumbbell, Flame, Footprints, Plus, Trash2, X } from "lucide-react";
import {
  addActivity,
  deleteActivity,
  estimateActivityCalories,
  formatActivityDetail,
  type ActivityLog,
  type ActivityType,
} from "@/lib/activity";

type Props = {
  date: string;
  activities: ActivityLog[];
  onChange: (list: ActivityLog[]) => void;
  readOnly?: boolean;
};

const PRESETS: {
  type: ActivityType;
  label: string;
  icon: typeof Footprints;
  hint: string;
}[] = [
  { type: "walk", label: "Walk", icon: Footprints, hint: "km or minutes" },
  { type: "weights", label: "Weights", icon: Dumbbell, hint: "sets × reps" },
  { type: "cardio", label: "Cardio", icon: Flame, hint: "minutes" },
  { type: "other", label: "Custom", icon: Plus, hint: "anything" },
];

export function MovementCard({ date, activities, onChange, readOnly }: Props) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<ActivityType>("walk");
  const [name, setName] = useState("");
  const [minutes, setMinutes] = useState("");
  const [km, setKm] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [kcal, setKcal] = useState("");

  const burned = useMemo(
    () => activities.reduce((s, a) => s + (Number(a.calories) || 0), 0),
    [activities]
  );

  const estimated = useMemo(() => {
    return estimateActivityCalories({
      type,
      minutes: Number(minutes) || 0,
      distance_km: Number(km) || 0,
      sets: Number(sets) || 0,
      reps: Number(reps) || 0,
    });
  }, [type, minutes, km, sets, reps]);

  const resetForm = () => {
    setName("");
    setMinutes("");
    setKm("");
    setSets("");
    setReps("");
    setKcal("");
  };

  const openType = (t: ActivityType) => {
    setType(t);
    setOpen(true);
    if (t === "walk") setName("Walk");
    else if (t === "weights") setName("Weights");
    else if (t === "cardio") setName("Cardio");
    else setName("");
  };

  const save = () => {
    const cal = Number(kcal) > 0 ? Math.round(Number(kcal)) : estimated;
    if (cal <= 0 && !name.trim()) return;

    const label =
      name.trim() ||
      (type === "walk"
        ? "Walk"
        : type === "weights"
          ? "Weights"
          : type === "cardio"
            ? "Cardio"
            : "Activity");

    addActivity({
      type,
      label,
      calories: Math.max(1, cal),
      minutes: Number(minutes) || undefined,
      distance_km: Number(km) || undefined,
      sets: Number(sets) || undefined,
      reps: Number(reps) || undefined,
      date,
    });
    onChange(
      // re-read would need getActivities — parent passes refresh
      []
    );
    // Parent should refresh; call with getActivities via callback pattern
    resetForm();
    setOpen(false);
  };

  const handleSave = () => {
    const cal = Number(kcal) > 0 ? Math.round(Number(kcal)) : estimated;
    if (cal <= 0) return;
    const label =
      name.trim() ||
      (type === "walk" ? "Walk" : type === "weights" ? "Weights" : type === "cardio" ? "Cardio" : "Activity");
    addActivity({
      type,
      label,
      calories: Math.max(1, cal),
      minutes: Number(minutes) || undefined,
      distance_km: Number(km) || undefined,
      sets: Number(sets) || undefined,
      reps: Number(reps) || undefined,
      date,
    });
    // signal parent to reload — use custom event pattern via onChange with placeholder
    onChange([{ ...activities[0] }]); // parent ignores content and reloads
    resetForm();
    setOpen(false);
  };

  const remove = (id: string) => {
    deleteActivity(id);
    onChange([]);
  };

  return (
    <div className="card-soft p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium flex items-center gap-1.5">
          <Flame className="w-4 h-4 text-orange-500" />
          Movement
        </div>
        <span className="text-xs text-muted-foreground tabular-nums">{burned} kcal</span>
      </div>

      {!readOnly && (
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.type}
              type="button"
              onClick={() => openType(p.type)}
              className="text-xs font-medium px-3 py-2 rounded-full border border-border bg-card hover:border-primary/40 flex items-center gap-1.5"
            >
              <p.icon className="w-3.5 h-3.5" />
              {p.label}
            </button>
          ))}
        </div>
      )}

      {open && !readOnly && (
        <div className="rounded-xl border border-border bg-card p-3 space-y-3 animate-scale-in">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold capitalize">{type}</div>
            <button type="button" onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-muted">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label className="text-[11px] text-muted-foreground">Name</label>
            <input
              className="input-modern mt-1 w-full px-3 py-2 text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={type === "other" ? "e.g. Yoga, Swim" : undefined}
            />
          </div>

          {type === "walk" && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-muted-foreground">Distance (km)</label>
                <input
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  className="input-modern mt-1 w-full px-3 py-2 text-sm"
                  value={km}
                  onChange={(e) => setKm(e.target.value)}
                  placeholder="e.g. 2.5"
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">or Minutes</label>
                <input
                  type="number"
                  inputMode="numeric"
                  className="input-modern mt-1 w-full px-3 py-2 text-sm"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  placeholder="e.g. 30"
                />
              </div>
            </div>
          )}

          {type === "weights" && (
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[11px] text-muted-foreground">Sets</label>
                <input
                  type="number"
                  inputMode="numeric"
                  className="input-modern mt-1 w-full px-3 py-2 text-sm"
                  value={sets}
                  onChange={(e) => setSets(e.target.value)}
                  placeholder="4"
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">Reps</label>
                <input
                  type="number"
                  inputMode="numeric"
                  className="input-modern mt-1 w-full px-3 py-2 text-sm"
                  value={reps}
                  onChange={(e) => setReps(e.target.value)}
                  placeholder="10"
                />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground">Min (opt.)</label>
                <input
                  type="number"
                  inputMode="numeric"
                  className="input-modern mt-1 w-full px-3 py-2 text-sm"
                  value={minutes}
                  onChange={(e) => setMinutes(e.target.value)}
                  placeholder="45"
                />
              </div>
            </div>
          )}

          {type === "cardio" && (
            <div>
              <label className="text-[11px] text-muted-foreground">Duration (minutes)</label>
              <input
                type="number"
                inputMode="numeric"
                className="input-modern mt-1 w-full px-3 py-2 text-sm"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                placeholder="e.g. 25"
              />
            </div>
          )}

          {type === "other" && (
            <div>
              <label className="text-[11px] text-muted-foreground">Minutes (optional)</label>
              <input
                type="number"
                inputMode="numeric"
                className="input-modern mt-1 w-full px-3 py-2 text-sm"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                placeholder="20"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] text-muted-foreground">
              Calories {Number(kcal) > 0 ? "(manual)" : `(est. ~${estimated})`}
            </label>
            <input
              type="number"
              inputMode="numeric"
              className="input-modern mt-1 w-full px-3 py-2 text-sm"
              value={kcal}
              onChange={(e) => setKcal(e.target.value)}
              placeholder={`Auto ~${estimated} — or type exact`}
            />
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="btn-primary w-full h-11 text-sm"
            disabled={estimated <= 0 && !(Number(kcal) > 0)}
          >
            Add activity
          </button>
        </div>
      )}

      {activities.length > 0 ? (
        <div className="space-y-1.5 pt-1">
          {activities.map((a) => {
            const detail = formatActivityDetail(a);
            return (
              <div
                key={a.id}
                className="flex items-center gap-2 text-sm rounded-xl border border-border/60 bg-card px-3 py-2"
              >
                <div className="min-w-0 flex-1">
                  <div className="font-medium truncate">{a.label}</div>
                  {detail && (
                    <div className="text-[11px] text-muted-foreground truncate">{detail}</div>
                  )}
                </div>
                <span className="text-xs tabular-nums text-muted-foreground shrink-0">
                  +{a.calories}
                </span>
                {!readOnly && (
                  <button
                    type="button"
                    onClick={() => remove(a.id)}
                    className="p-1.5 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-500/10 shrink-0"
                    aria-label="Remove activity"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-[11px] text-muted-foreground">
          Log walk by km, weights by sets×reps, cardio by minutes — or type calories.
        </p>
      )}
    </div>
  );
}
