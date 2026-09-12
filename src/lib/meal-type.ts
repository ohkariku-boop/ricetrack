/** Meal slot labels for logging (Asia-friendly day structure). */

export const MEAL_TYPES = [
  { id: "breakfast", label: "Breakfast" },
  { id: "lunch", label: "Lunch" },
  { id: "tea", label: "Tea time" },
  { id: "dinner", label: "Dinner" },
  { id: "supper", label: "Supper" },
  { id: "snack", label: "Snack" },
] as const;

export type MealTypeId = (typeof MEAL_TYPES)[number]["id"];

export function mealTypeLabel(id?: string | null): string {
  if (!id) return "";
  const found = MEAL_TYPES.find((m) => m.id === id);
  return found?.label || id;
}

/** Heuristic default from local hour */
export function defaultMealType(d = new Date()): MealTypeId {
  const h = d.getHours();
  if (h < 10) return "breakfast";
  if (h < 14) return "lunch";
  if (h < 17) return "tea";
  if (h < 21) return "dinner";
  if (h < 24) return "supper";
  return "snack";
}
