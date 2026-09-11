"use client";

import { Droplets, Footprints, Moon, Zap } from "lucide-react";

type Props = {
  steps: number;
  waterMl: number;
  sleepHours: number | null;
  energy: number | null;
  onWater?: (delta: number) => void;
  readOnly?: boolean;
};

function Cell({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: typeof Footprints;
  label: string;
  value: string;
  sub?: string;
  accent: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card px-2.5 py-2.5 min-w-0">
      <div className={`flex items-center gap-1 text-[10px] font-medium ${accent}`}>
        <Icon className="w-3 h-3 shrink-0" />
        <span className="truncate">{label}</span>
      </div>
      <div className="text-sm font-bold tabular-nums mt-0.5 truncate text-foreground">{value}</div>
      {sub ? <div className="text-[10px] text-muted-foreground truncate">{sub}</div> : null}
    </div>
  );
}

export function TodayStrip({ steps, waterMl, sleepHours, energy, onWater, readOnly }: Props) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-4 gap-2">
        <Cell
          icon={Footprints}
          label="Steps"
          value={steps.toLocaleString()}
          sub="/ 8k"
          accent="text-emerald-600 dark:text-emerald-400"
        />
        <Cell
          icon={Droplets}
          label="Water"
          value={waterMl >= 1000 ? `${(waterMl / 1000).toFixed(1)}L` : `${waterMl}ml`}
          sub={waterMl > 0 ? "" : "—"}
          accent="text-sky-600 dark:text-sky-400"
        />
        <Cell
          icon={Moon}
          label="Sleep"
          value={sleepHours != null ? `${sleepHours}h` : "—"}
          sub={sleepHours != null ? "" : "—"}
          accent="text-indigo-600 dark:text-indigo-400"
        />
        <Cell
          icon={Zap}
          label="Energy"
          value={energy != null ? `${energy}/5` : "—"}
          accent="text-amber-600 dark:text-amber-400"
        />
      </div>
      {!readOnly && onWater && (
        <div className="flex gap-2">
          <button
            type="button"
            className="flex-1 h-9 rounded-xl border border-border text-xs font-medium text-sky-700 dark:text-sky-300 bg-sky-500/5"
            onClick={() => onWater(-250)}
          >
            −250 ml
          </button>
          <button
            type="button"
            className="flex-1 h-9 rounded-xl border border-border text-xs font-medium text-sky-700 dark:text-sky-300 bg-sky-500/5"
            onClick={() => onWater(250)}
          >
            +250 ml
          </button>
        </div>
      )}
    </div>
  );
}
