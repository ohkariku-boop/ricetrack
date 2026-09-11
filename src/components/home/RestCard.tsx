"use client";

import { useEffect, useState } from "react";
import { Moon } from "lucide-react";
import {
  calcDurationHours,
  getSleepForDate,
  saveSleepLog,
  getEnergyForDate,
  saveEnergyLog,
  type SleepLog,
  type EnergyLog,
} from "@/lib/wellness";

type Props = {
  date: string;
  readOnly?: boolean;
  onUpdate?: () => void;
};

export function RestCard({ date, readOnly, onUpdate }: Props) {
  const [sleep, setSleep] = useState<SleepLog | null>(null);
  const [energy, setEnergy] = useState<EnergyLog | null>(null);
  const [open, setOpen] = useState(false);
  const [bed, setBed] = useState("23:00");
  const [wake, setWake] = useState("07:00");
  const [quality, setQuality] = useState<1 | 2 | 3 | 4 | 5>(3);

  useEffect(() => {
    const s = getSleepForDate(date);
    setSleep(s);
    if (s) {
      setBed(s.bed_time);
      setWake(s.wake_time);
      setQuality(s.quality || 3);
    }
    setEnergy(getEnergyForDate(date));
  }, [date]);

  const duration = calcDurationHours(bed, wake);

  const save = () => {
    const entry = saveSleepLog({ date, bed_time: bed, wake_time: wake, quality });
    setSleep(entry);
    setOpen(false);
    onUpdate?.();
  };

  return (
    <div className="rounded-2xl border border-indigo-500/20 bg-indigo-500/[0.06] p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold flex items-center gap-1.5">
          <Moon className="w-4 h-4 text-indigo-500" />
          Rest
        </div>
        {sleep && (
          <span className="text-xs tabular-nums text-muted-foreground">{sleep.duration_hours}h</span>
        )}
      </div>

      <div>
        <div className="text-[11px] text-muted-foreground mb-1.5">Energy</div>
        <div className="flex gap-1.5">
          {([1, 2, 3, 4, 5] as const).map((n) => (
            <button
              key={n}
              type="button"
              disabled={readOnly}
              onClick={() => {
                setEnergy(saveEnergyLog(n, date));
                onUpdate?.();
              }}
              className={`flex-1 h-9 rounded-lg text-sm font-semibold border ${
                energy?.level === n
                  ? "bg-indigo-500 text-white border-indigo-500"
                  : "bg-card border-border text-muted-foreground"
              } disabled:opacity-50`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {!open ? (
        <button
          type="button"
          disabled={readOnly}
          onClick={() => setOpen(true)}
          className="w-full text-left rounded-xl border border-border bg-card px-3 py-2.5 disabled:opacity-60"
        >
          <div className="text-sm font-medium">
            {sleep ? `${sleep.bed_time} → ${sleep.wake_time}` : "Log sleep"}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {sleep ? `Quality ${sleep.quality ?? "—"}/5` : "Bedtime and wake"}
          </div>
        </button>
      ) : (
        <div className="space-y-2 rounded-xl border border-border bg-card p-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-muted-foreground">Bed</label>
              <input type="time" value={bed} onChange={(e) => setBed(e.target.value)} className="input-modern mt-1 w-full px-2 py-2 text-sm" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground">Wake</label>
              <input type="time" value={wake} onChange={(e) => setWake(e.target.value)} className="input-modern mt-1 w-full px-2 py-2 text-sm" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground tabular-nums">≈ {duration}h</div>
          <div className="flex gap-1">
            {([1, 2, 3, 4, 5] as const).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setQuality(n)}
                className={`flex-1 h-8 rounded-lg text-xs font-semibold border ${
                  quality === n
                    ? "border-indigo-500 bg-indigo-500/15 text-indigo-600 dark:text-indigo-300"
                    : "border-border text-muted-foreground"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => setOpen(false)} className="btn-secondary flex-1 h-9 text-sm">
              Cancel
            </button>
            <button type="button" onClick={save} className="btn-primary flex-1 h-9 text-sm">
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
