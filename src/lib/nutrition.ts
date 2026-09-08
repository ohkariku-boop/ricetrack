/** Mifflin-St Jeor BMR + activity multipliers */
export function calculateTargets(params: {
  sex: "male" | "female" | "other";
  age: number;
  heightCm: number;
  weightKg: number;
  activity: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal: "lose" | "maintain" | "gain";
}) {
  const { sex, age, heightCm, weightKg, activity, goal } = params;

  // BMR
  let bmr: number;
  if (sex === "male") {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    // female / other use female formula as safer default
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  const multipliers: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9,
  };

  let tdee = bmr * (multipliers[activity] || 1.55);

  // Goal adjustment
  if (goal === "lose") tdee -= 400;
  if (goal === "gain") tdee += 300;

  const calories = Math.round(Math.max(1200, tdee));

  // Macro split: higher protein for Asian diets / satiety (30P / 40C / 30F)
  const protein = Math.round((calories * 0.3) / 4);
  const fat = Math.round((calories * 0.3) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);

  return { calories, protein, carbs, fat };
}
