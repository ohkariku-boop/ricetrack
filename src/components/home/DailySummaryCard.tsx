"use client";

import {
  buildDailySummary,
  overallBadgeClass,
  statusDotClass,
  type DailySummaryInput,
} from "@/lib/daily-summary";

type Props = DailySummaryInput & {
  /** e.g. "Today" or "Mon 9 Sep" */
  title?: string;
};

export function DailySummaryCard(props: Props) {
  const summary = buildDailySummary(props);

  return (
    <section
      className="rounded-2xl border border-border bg-card p-3.5 space-y-3 shadow-sm"
      aria-label="Daily summary"
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {props.title || "Daily summary"}
          </div>
          <p className="text-[15px] font-semibold tracking-tight mt-0.5">
            {summary.overallLabel}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${overallBadgeClass(summary.overall)}`}
          >
            {summary.score > 0 ? `${summary.score}` : "—"}
          </span>
          <span className="text-[10px] text-muted-foreground">score</span>
        </div>
      </div>

      <ul className="space-y-2">
        {summary.checks.map((c) => (
          <li key={c.id} className="flex items-start gap-2.5">
            <span
              className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${statusDotClass(c.status)}`}
              aria-hidden
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-[13px] font-medium">{c.label}</span>
                <span className="text-[12px] tabular-nums text-muted-foreground shrink-0">
                  {c.value}
                </span>
              </div>
              <p className="text-[12px] text-muted-foreground leading-snug">{c.detail}</p>
            </div>
          </li>
        ))}
      </ul>

      {summary.recommendations.length > 0 && (
        <div className="rounded-xl bg-muted/50 px-3 py-2.5 space-y-1.5">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            Recommendations
          </div>
          <ul className="space-y-1.5">
            {summary.recommendations.map((r, i) => (
              <li key={i} className="text-[13px] leading-snug text-foreground/90 flex gap-2">
                <span className="text-primary font-semibold shrink-0">→</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
