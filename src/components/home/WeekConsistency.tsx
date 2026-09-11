"use client";

import { last7Days } from "@/lib/consistency";

type Props = {
  mealFlags: boolean[];
  moveFlags: boolean[];
};

function Bars({ flags, color }: { flags: boolean[]; color: string }) {
  const days = last7Days();
  return (
    <div className="flex items-end gap-1 h-8">
      {flags.map((on, i) => (
        <div key={days[i] || i} className="flex-1 flex flex-col items-center gap-0.5 min-w-0">
          <div className={`w-full rounded-sm ${on ? color : "bg-muted"}`} style={{ height: on ? 24 : 8 }} />
        </div>
      ))}
    </div>
  );
}

export function WeekConsistency({ mealFlags, moveFlags }: Props) {
  const labels = last7Days().map((d) => d.slice(8));
  return (
    <div className="rounded-2xl border border-border bg-card p-4 space-y-3">
      <div className="text-sm font-semibold">Last 7 days</div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Meals logged</span>
          <span className="tabular-nums">{mealFlags.filter(Boolean).length}/7</span>
        </div>
        <Bars flags={mealFlags} color="bg-primary" />
        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
          <span>Moved</span>
          <span className="tabular-nums">{moveFlags.filter(Boolean).length}/7</span>
        </div>
        <Bars flags={moveFlags} color="bg-orange-500" />
        <div className="flex justify-between text-[9px] text-muted-foreground tabular-nums px-0.5">
          {labels.map((l, i) => (
            <span key={`${l}-${i}`} className="flex-1 text-center">
              {Number(l)}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
