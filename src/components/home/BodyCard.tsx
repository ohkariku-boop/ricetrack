"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Scale } from "lucide-react";
import { getWeightLogs, addWeightLog } from "@/lib/activity";
import { getGuestProfile, setGuestProfile, isLocalSession } from "@/lib/guest";
import { calcBmi, bmiCategory } from "@/lib/nutrition";

type Props = {
  readOnly?: boolean;
};

export function BodyCard({ readOnly }: Props) {
  const [weight, setWeight] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [editing, setEditing] = useState(false);

  const refresh = () => {
    const logs = getWeightLogs();
    const last = logs[logs.length - 1];
    const p = getGuestProfile();
    const w = last?.weight_kg ?? (typeof p.weight_kg === "number" ? p.weight_kg : null);
    const h = typeof p.height_cm === "number" ? p.height_cm : null;
    setWeight(w);
    setHeight(h);
    if (w) setInput(String(w));
  };

  useEffect(() => {
    refresh();
  }, []);

  const bmi = weight && height ? calcBmi(weight, height) : 0;
  const cat = bmi ? bmiCategory(bmi) : "";

  const save = () => {
    const v = parseFloat(input);
    if (!v || v < 30 || v > 300) return;
    addWeightLog(v);
    if (isLocalSession()) {
      setGuestProfile({
        weight_kg: v,
        bmi: height ? calcBmi(v, height) : undefined,
      });
    }
    setWeight(v);
    setEditing(false);
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold flex items-center gap-1.5">
          <Scale className="w-4 h-4 text-muted-foreground" />
          Body
        </div>
        <Link href="/progress" className="text-xs font-medium text-primary">
          Chart
        </Link>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="text-[11px] text-muted-foreground">Weight</div>
          <div className="text-xl font-bold tabular-nums">
            {weight != null ? weight : "—"}
            {weight != null && <span className="text-sm font-medium text-muted-foreground ml-1">kg</span>}
          </div>
        </div>
        <div>
          <div className="text-[11px] text-muted-foreground">BMI</div>
          <div className="text-xl font-bold tabular-nums">{bmi ? bmi.toFixed(1) : "—"}</div>
          {cat ? <div className="text-[11px] text-muted-foreground">{cat}</div> : null}
        </div>
      </div>
      {!readOnly &&
        (editing ? (
          <div className="flex gap-2">
            <input
              type="number"
              inputMode="decimal"
              step="0.1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-modern flex-1 px-3 py-2 text-sm"
              placeholder="kg"
            />
            <button type="button" onClick={save} className="btn-primary h-10 px-4 text-sm">
              Save
            </button>
            <button type="button" onClick={() => setEditing(false)} className="btn-secondary h-10 px-3 text-sm">
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => setEditing(true)} className="text-xs font-medium text-muted-foreground hover:text-foreground">
            Log weight
          </button>
        ))}
    </div>
  );
}
