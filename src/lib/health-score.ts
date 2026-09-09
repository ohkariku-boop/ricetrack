import type { FoodItem, MealAnalysis } from "@/types";

/** 1–10 plate health score — protein density, fat quality flags, balance */
export function scoreMeal(analysis: MealAnalysis): {
  score: number;
  label: string;
  reasons: string[];
} {
  const items = analysis.items || [];
  const cal = analysis.total_calories || 1;
  const protein = analysis.total_protein || 0;
  const fat = analysis.total_fat || 0;
  const carbs = analysis.total_carbs || 0;
  const reasons: string[] = [];

  let score = 6;

  // Protein density (g per 100 kcal)
  const pDens = (protein / cal) * 100;
  if (pDens >= 8) {
    score += 1.5;
    reasons.push("Strong protein density");
  } else if (pDens >= 5) {
    score += 0.5;
  } else {
    score -= 0.5;
    reasons.push("Low protein for the calories");
  }

  // Extreme fat share
  const fatKcalShare = (fat * 9) / cal;
  if (fatKcalShare > 0.5) {
    score -= 1.5;
    reasons.push("Very high fat share — common with fried / oily Asian plates");
  } else if (fatKcalShare > 0.4) {
    score -= 0.5;
  }

  // Hidden calorie risks from AI
  const risks = items.filter((i) => i.is_hidden_calorie_risk).length;
  if (risks >= 2) {
    score -= 1;
    reasons.push("Multiple oil / sauce risk items");
  } else if (risks === 1) {
    score -= 0.3;
  }

  // Veggie / fiber-ish names boost
  const vegWords = /salad|vegetable|broccoli|spinach|kangkung|cucumber|tomato|greens|cabbage|bean sprout|edamame/i;
  if (items.some((i) => vegWords.test(i.name))) {
    score += 0.8;
    reasons.push("Includes vegetables");
  }

  // Balanced macros
  const cShare = (carbs * 4) / cal;
  if (cShare > 0.15 && cShare < 0.55 && pDens >= 4) {
    score += 0.5;
    reasons.push("Reasonable macro balance");
  }

  // Very large calorie bomb
  if (cal > 900) {
    score -= 0.5;
    reasons.push("Large calorie load for one meal");
  }

  score = Math.max(1, Math.min(10, Math.round(score * 10) / 10));
  const label =
    score >= 8 ? "Excellent" : score >= 6.5 ? "Good" : score >= 5 ? "Okay" : score >= 3.5 ? "Fair" : "Needs care";

  if (reasons.length === 0) reasons.push("Based on macros and item flags");
  return { score, label, reasons: reasons.slice(0, 3) };
}

export function scoreColor(score: number): string {
  if (score >= 8) return "text-emerald-600";
  if (score >= 6.5) return "text-primary";
  if (score >= 5) return "text-amber-600";
  return "text-red-600";
}
