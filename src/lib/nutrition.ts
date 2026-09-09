/** Mifflin-St Jeor BMR + activity + goal planning */

export type Sex = "male" | "female" | "other";
export type Activity = "sedentary" | "light" | "moderate" | "active" | "very_active";
export type GoalType = "lose" | "maintain" | "gain";

export function calcBmi(weightKg: number, heightCm: number): number {
  if (!weightKg || !heightCm) return 0;
  const m = heightCm / 100;
  return Math.round((weightKg / (m * m)) * 10) / 10;
}

export function bmiCategory(bmi: number): string {
  if (bmi <= 0) return "—";
  if (bmi < 18.5) return "Underweight";
  if (bmi < 23) return "Normal (Asian range)";
  if (bmi < 25) return "Normal–high";
  if (bmi < 27.5) return "Overweight";
  if (bmi < 30) return "Overweight–high";
  return "Obese range";
}

export function calcBmr(sex: Sex, age: number, heightCm: number, weightKg: number): number {
  if (sex === "male") return 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  return 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
}

const MULTIPLIERS: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calcTdee(
  sex: Sex,
  age: number,
  heightCm: number,
  weightKg: number,
  activity: Activity
): number {
  return calcBmr(sex, age, heightCm, weightKg) * (MULTIPLIERS[activity] || 1.55);
}

/**
 * Plan daily calories from goal.
 * loseKg + weeks: optional precise deficit (~7700 kcal per kg fat)
 */
export function calculateTargets(params: {
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  activity: Activity;
  goal: GoalType;
  /** kg to lose/gain — optional for more precise plan */
  goalKg?: number;
  /** weeks to reach goal */
  goalWeeks?: number;
}) {
  const { sex, age, heightCm, weightKg, activity, goal, goalKg, goalWeeks } = params;
  const bmr = calcBmr(sex, age, heightCm, weightKg);
  const tdee = bmr * (MULTIPLIERS[activity] || 1.55);
  const bmi = calcBmi(weightKg, heightCm);

  let calories = tdee;

  if (goal === "lose") {
    if (goalKg && goalKg > 0 && goalWeeks && goalWeeks > 0) {
      // 1 kg fat ≈ 7700 kcal
      const dailyDeficit = (goalKg * 7700) / (goalWeeks * 7);
      // Cap aggressive cuts at ~25% TDEE or 1000 kcal
      const capped = Math.min(dailyDeficit, tdee * 0.25, 1000);
      calories = tdee - Math.max(250, capped);
    } else {
      calories = tdee - 400;
    }
  } else if (goal === "gain") {
    if (goalKg && goalKg > 0 && goalWeeks && goalWeeks > 0) {
      const dailySurplus = (goalKg * 7700) / (goalWeeks * 7);
      const capped = Math.min(dailySurplus, 500);
      calories = tdee + Math.max(200, capped);
    } else {
      calories = tdee + 300;
    }
  }

  // Floor by sex for safety
  const floor = sex === "male" ? 1500 : 1200;
  calories = Math.round(Math.max(floor, calories));

  const protein = Math.round((calories * 0.3) / 4);
  const fat = Math.round((calories * 0.3) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);

  return {
    calories,
    protein,
    carbs,
    fat,
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    bmi,
    bmi_label: bmiCategory(bmi),
  };
}
