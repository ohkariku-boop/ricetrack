"use client";

import { useEffect, useState } from "react";
import { Moon, Sun, Zap } from "lucide-react";
import {
  calcDurationHours,
  getSleepForDate,
  saveSleepLog,
  getEnergyForDate,
  saveEnergyLog,
  ENERGY_LABELS,
  type SleepLog,
  type EnergyLog,
} from "@/lib/wellness";

export function WellnessCard() {
  const today = new Date().toISOString().slice(0, 10);
  const [sleep, setSleep] = useState<SleepLog | null>(null);
  const [energy, setEnergy] = useState<EnergyLog | null>(null);
  const [bed, setBed] = useState("23:00");
  const [wake, setWake] = useState("07:00");
  const [quality, setQuality] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [openSleep, setOpenSleep] = useState(false);

  useEffect(() => {
    const s = getSleepForDate(today);
    setSleep(s);
    if (s) {
      setBed(s.bed_time);
      setWake(s.wake_time);
      setQuality(s.quality || 3);
    }
    setEnergy(getEnergyForDate(today));
  }, [today]);

  const saveSleep = () => {
    const entry = saveSleepLog({
      date: today,
      bed_time: bed,
      wake_time: wake,
      quality,
    });
    setSleep(entry);
    setOpenSleep(false);
  };

  const duration = calcDurationHours(bed, wake);

  return (
    <div className="card-soft p-4 space-y-4 animate-fade-up">
      <div className="flex items-center justify-between">
        <div className="text-sm font-medium flex items-center gap-1.5">
          <Moon className="w-4 h-4 text-indigo-400" />
          Sleep & energy
        </div>
        {sleep && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {sleep.duration_hours}h last night
          </span>
        )}
      </div>

      {/* Energy quick pick */}
      <div>
        <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
          <Zap className="w-3.5 h-3.5" />
          Energy today
          {energy && (
            <span className="text-foreground font-medium ml-1">
              · {ENERGY_LABELS[energy.level]}
            </span>
          )}
        </div>
        <div className="flex gap-1.5">
          {([1, 2, 3, 4, 5] as const).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setEnergy(saveEnergyLog(n, today))}
              className={`flex-1 h-10 rounded-xl text-sm font-semibold border transition-colors ${
                energy?.level === n
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card border-border text-muted-foreground hover:border-primary/40"
              }`}
              title={ENERGY_LABELS[n]}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      {/* Sleep summary / editor */}
      {!openSleep ? (
        <button
          type="button"
          onClick={() => setOpenSleep(true)}
          className="w-full flex items-center justify-between text-left rounded-xl border border-border bg-card px-3 py-2.5 hover:border-primary/30 transition-colors"
        >
          <div className="flex items-center gap-2 min-w-0">
            <Sun className="w-4 h-4 text-amber-500 shrink-0" />
            <div className="min-w-0">
              <div className="text-sm font-medium truncate">
                {sleep
                  ? `${sleep.bed_time} → ${sleep.wake_time}`
                  : "Log last night’s sleep"}
              </div>
              <div className="text-[11px] text-muted-foreground">
                {sleep
                  ? `Quality ${sleep.quality || "—"}/5`
                  : "Bedtime & wake time"}
              </div>
            </div>
          </div>
          <span className="text-xs text-primary font-medium shrink-0">
            {sleep ? "Edit" : "Add"}
          </span>
        </button>
      ) : (
        <div className="space-y-3 rounded-xl border border-border bg-card p-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[11px] text-muted-foreground">Bedtime</label>
              <input
                type="time"
                value={bed}
                onChange={(e) => setBed(e.target.value)}
                className="input-modern mt-1 w-full px-2 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground">Wake</label>
              <input
                type="time"
                value={wake}
                onChange={(e) => setWake(e.target.value)}
                className="input-modern mt-1 w-full px-2 py-2 text-sm"
              />
            </div>
          </div>
          <div className="text-xs text-muted-foreground tabular-nums">
            Duration ≈ <span className="text-foreground font-semibold">{duration}h</span>
          </div>
          <div>
            <div className="text-[11px] text-muted-foreground mb-1.5">Quality</div>
            <div className="flex gap-1">
              {([1, 2, 3, 4, 5] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setQuality(n)}
                  className={`flex-1 h-9 rounded-lg text-xs font-semibold border ${
                    quality === n
                      ? "bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-300"
                      : "border-border text-muted-foreground"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOpenSleep(false)}
              className="btn-secondary flex-1 h-10 text-sm"
            >
              Cancel
            </button>
            <button type="button" onClick={saveSleep} className="btn-primary flex-1 h-10 text-sm">
              Save sleep
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
