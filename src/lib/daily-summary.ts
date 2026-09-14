/** Daily check-in: calories, water, rest, energy → status + recommendations */

export type CheckStatus = "good" | "ok" | "low" | "high" | "missing";

export type SummaryCheck = {
  id: "calories" | "water" | "rest" | "energy" | "steps";
  label: string;
  status: CheckStatus;
  /** Short value shown in the row, e.g. "1.8L / 2.0L" */
  value: string;
  detail: string;
};

export type DailySummary = {
  overall: "on_track" | "mixed" | "needs_attention" | "incomplete";
  overallLabel: string;
  score: number; // 0–100, only from logged dimensions
  checks: SummaryCheck[];
  recommendations: string[];
};

export type DailySummaryInput = {
  calories: number;
  calorieTarget: number;
  protein?: number;
  proteinTarget?: number;
  waterMl: number;
  /** Optional weight for water goal; default 2000 ml */
  weightKg?: number;
  sleepHours: number | null;
  energy: number | null; // 1–5
  steps?: number;
  stepGoal?: number;
  mealCount?: number;
};

const WATER_DEFAULT_ML = 2000;
const STEP_DEFAULT = 8000;

export function waterTargetMl(weightKg?: number): number {
  if (weightKg && weightKg > 30 && weightKg < 250) {
    return Math.round((weightKg * 33) / 50) * 50; // ~33 ml/kg, round to 50
  }
  return WATER_DEFAULT_ML;
}

function calStatus(cal: number, target: number, mealCount: number): CheckStatus {
  if (mealCount === 0 && cal === 0) return "missing";
  const ratio = cal / Math.max(1, target);
  if (ratio >= 0.9 && ratio <= 1.1) return "good";
  if (ratio >= 0.75 && ratio < 0.9) return "ok";
  if (ratio > 1.1 && ratio <= 1.2) return "ok";
  if (ratio > 1.2) return "high";
  return "low";
}

function waterStatus(ml: number, target: number): CheckStatus {
  if (ml <= 0) return "missing";
  const ratio = ml / target;
  if (ratio >= 0.9) return "good";
  if (ratio >= 0.6) return "ok";
  return "low";
}

function restStatus(hours: number | null): CheckStatus {
  if (hours == null) return "missing";
  if (hours >= 7 && hours <= 9) return "good";
  if (hours >= 6 && hours < 7) return "ok";
  if (hours > 9 && hours <= 10) return "ok";
  if (hours < 6) return "low";
  return "high"; // > 10h
}

function energyStatus(level: number | null): CheckStatus {
  if (level == null) return "missing";
  if (level >= 4) return "good";
  if (level === 3) return "ok";
  return "low";
}

function stepsStatus(steps: number, goal: number): CheckStatus {
  if (steps <= 0) return "missing";
  const ratio = steps / goal;
  if (ratio >= 0.9) return "good";
  if (ratio >= 0.5) return "ok";
  return "low";
}

const STATUS_WEIGHT: Record<CheckStatus, number> = {
  good: 100,
  ok: 70,
  low: 35,
  high: 40,
  missing: -1, // excluded from average
};

export function buildDailySummary(input: DailySummaryInput): DailySummary {
  const waterGoal = waterTargetMl(input.weightKg);
  const stepGoal = input.stepGoal ?? STEP_DEFAULT;
  const meals = input.mealCount ?? (input.calories > 0 ? 1 : 0);

  const checks: SummaryCheck[] = [];

  // Calories
  {
    const status = calStatus(input.calories, input.calorieTarget, meals);
    const remaining = input.calorieTarget - input.calories;
    let detail =
      status === "missing"
        ? "No meals logged yet"
        : status === "good"
          ? "Within ~10% of your daily target"
          : status === "high"
            ? `${Math.round(input.calories - input.calorieTarget)} kcal over target`
            : status === "low"
              ? `${Math.round(remaining)} kcal still available`
              : remaining >= 0
                ? `${Math.round(remaining)} kcal left`
                : `${Math.round(-remaining)} kcal over`;
    if (
      input.protein != null &&
      input.proteinTarget &&
      input.proteinTarget > 0 &&
      input.calories > 200 &&
      input.protein < input.proteinTarget * 0.5
    ) {
      detail += " · protein still low";
    }
    checks.push({
      id: "calories",
      label: "Calories",
      status,
      value:
        status === "missing"
          ? "—"
          : `${Math.round(input.calories)} / ${Math.round(input.calorieTarget)}`,
      detail,
    });
  }

  // Water
  {
    const status = waterStatus(input.waterMl, waterGoal);
    const display =
      input.waterMl >= 1000
        ? `${(input.waterMl / 1000).toFixed(1)}L`
        : `${input.waterMl}ml`;
    const goalDisplay =
      waterGoal >= 1000 ? `${(waterGoal / 1000).toFixed(1)}L` : `${waterGoal}ml`;
    checks.push({
      id: "water",
      label: "Water",
      status,
      value: status === "missing" ? "—" : `${display} / ${goalDisplay}`,
      detail:
        status === "missing"
          ? "Log glasses as you go"
          : status === "good"
            ? "Hydration on track"
            : `${Math.max(0, waterGoal - input.waterMl)}ml to go`,
    });
  }

  // Rest
  {
    const status = restStatus(input.sleepHours);
    checks.push({
      id: "rest",
      label: "Rest",
      status,
      value: input.sleepHours != null ? `${input.sleepHours}h` : "—",
      detail:
        status === "missing"
          ? "Log last night’s sleep"
          : status === "good"
            ? "Solid sleep window (7–9h)"
            : status === "low"
              ? "Under 6h — recovery may lag"
              : status === "high"
                ? "Very long sleep — check if you feel rested"
                : "Slightly outside the 7–9h range",
    });
  }

  // Energy
  {
    const status = energyStatus(input.energy);
    const labels: Record<number, string> = {
      1: "Drained",
      2: "Low",
      3: "Okay",
      4: "Good",
      5: "On fire",
    };
    checks.push({
      id: "energy",
      label: "Energy",
      status,
      value: input.energy != null ? `${input.energy}/5` : "—",
      detail:
        status === "missing"
          ? "Tap energy on Rest when you can"
          : labels[input.energy!] || "Logged",
    });
  }

  // Steps (optional dimension)
  {
    const steps = input.steps ?? 0;
    const status = stepsStatus(steps, stepGoal);
    checks.push({
      id: "steps",
      label: "Steps",
      status,
      value: steps > 0 ? `${steps.toLocaleString()} / ${stepGoal.toLocaleString()}` : "—",
      detail:
        status === "missing"
          ? "Walk or log movement"
          : status === "good"
            ? "Movement goal reached"
            : `${Math.max(0, stepGoal - steps).toLocaleString()} steps to goal`,
    });
  }

  // Score from non-missing
  const scored = checks.filter((c) => STATUS_WEIGHT[c.status] >= 0);
  const score =
    scored.length === 0
      ? 0
      : Math.round(scored.reduce((a, c) => a + STATUS_WEIGHT[c.status], 0) / scored.length);

  const missingCount = checks.filter((c) => c.status === "missing").length;
  const badCount = checks.filter((c) => c.status === "low" || c.status === "high").length;
  const goodCount = checks.filter((c) => c.status === "good").length;

  let overall: DailySummary["overall"] = "incomplete";
  let overallLabel = "Log a few items for a summary";
  if (scored.length >= 2) {
    if (badCount === 0 && goodCount >= Math.ceil(scored.length * 0.6)) {
      overall = "on_track";
      overallLabel = "On track today";
    } else if (badCount >= 2 || score < 50) {
      overall = "needs_attention";
      overallLabel = "Needs a little attention";
    } else {
      overall = "mixed";
      overallLabel = "Mixed — room to improve";
    }
  } else if (missingCount === checks.length) {
    overall = "incomplete";
    overallLabel = "Nothing logged yet";
  }

  const recommendations = buildRecommendations(input, checks, waterGoal, stepGoal);

  return { overall, overallLabel, score, checks, recommendations };
}

function buildRecommendations(
  input: DailySummaryInput,
  checks: SummaryCheck[],
  waterGoal: number,
  stepGoal: number
): string[] {
  const recs: string[] = [];
  const byId = Object.fromEntries(checks.map((c) => [c.id, c])) as Record<
    string,
    SummaryCheck
  >;

  const cal = byId.calories;
  if (cal?.status === "missing") {
    recs.push("Snap or log a meal so calorie tracking can guide the rest of the day.");
  } else if (cal?.status === "high") {
    recs.push(
      "You’re over target — favor lighter options next (soup, steamed, less gravy) or take a walk."
    );
  } else if (cal?.status === "low" && (input.mealCount ?? 0) >= 1) {
    recs.push("Still under target — don’t skip a balanced meal if you’re hungry.");
  }

  if (
    input.protein != null &&
    input.proteinTarget &&
    input.calories > 300 &&
    input.protein < input.proteinTarget * 0.55
  ) {
    recs.push(
      `Protein is low (${Math.round(input.protein)}g). Add egg, tofu, fish, chicken, or dal.`
    );
  }

  const water = byId.water;
  if (water?.status === "missing" || water?.status === "low") {
    const left = Math.max(0, waterGoal - input.waterMl);
    recs.push(
      left > 0
        ? `Drink about ${left >= 1000 ? `${(left / 1000).toFixed(1)}L` : `${left}ml`} more water today.`
        : "Start logging water — aim for steady sips, not only late evening."
    );
  }

  const rest = byId.rest;
  if (rest?.status === "missing") {
    recs.push("Log last night’s sleep so rest can factor into your daily picture.");
  } else if (rest?.status === "low") {
    recs.push(
      "Short sleep — keep caffeine earlier, dim screens tonight, and aim for a consistent bedtime."
    );
  } else if (rest?.status === "high") {
    recs.push("Long sleep window — if you still feel tired, check energy and daytime movement.");
  }

  const energy = byId.energy;
  if (energy?.status === "low") {
    recs.push(
      "Energy is low — prioritize a protein-forward meal, water, and a short walk if you can."
    );
  } else if (energy?.status === "missing" && rest?.status === "good") {
    recs.push("Quick: rate today’s energy (1–5) on the Rest card.");
  }

  const steps = byId.steps;
  if (steps?.status === "low" || steps?.status === "missing") {
    const left = Math.max(0, stepGoal - (input.steps ?? 0));
    if (left > 0) {
      recs.push(
        `Move a bit more — about ${left.toLocaleString()} steps (or a 15–20 min walk) toward your goal.`
      );
    }
  }

  // Positive close if doing well
  if (recs.length === 0) {
    recs.push("Keep the same rhythm: meals near target, water steady, rest protected.");
  }

  return recs.slice(0, 4);
}

export function statusColorClass(status: CheckStatus): string {
  switch (status) {
    case "good":
      return "text-emerald-600 dark:text-emerald-400";
    case "ok":
      return "text-primary";
    case "low":
    case "high":
      return "text-amber-600 dark:text-amber-400";
    default:
      return "text-muted-foreground";
  }
}

export function statusDotClass(status: CheckStatus): string {
  switch (status) {
    case "good":
      return "bg-emerald-500";
    case "ok":
      return "bg-primary";
    case "low":
    case "high":
      return "bg-amber-500";
    default:
      return "bg-muted-foreground/40";
  }
}

export function overallBadgeClass(overall: DailySummary["overall"]): string {
  switch (overall) {
    case "on_track":
      return "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400";
    case "mixed":
      return "bg-primary/15 text-primary";
    case "needs_attention":
      return "bg-amber-500/15 text-amber-700 dark:text-amber-400";
    default:
      return "bg-muted text-muted-foreground";
  }
}
