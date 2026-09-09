export type Cuisine =
  | "chinese"
  | "japanese"
  | "korean"
  | "thai"
  | "vietnamese"
  | "indian"
  | "malay"
  | "indonesian"
  | "filipino"
  | "singaporean"
  | "other_asian"
  | "western"
  | "unknown";

export interface FoodItem {
  id?: string;
  name: string;
  name_original?: string; // original language name
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  portion: string;
  portion_grams?: number;
  confidence: number; // 0-1
  notes?: string;
  is_hidden_calorie_risk?: boolean;
}

export interface MealAnalysis {
  items: FoodItem[];
  /** Human-facing plate name e.g. "Nasi Lemak" — not counted as an extra item */
  meal_title?: string;
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  cuisine_detected: Cuisine;
  cooking_methods?: string[];
  confidence_overall: number;
  notes?: string;
  warnings?: string[];
  raw_response?: string;
}

export interface UserProfile {
  id: string;
  email?: string;
  display_name?: string;
  sex: "male" | "female" | "other";
  age: number;
  height_cm: number;
  weight_kg: number;
  activity_level: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal: "lose" | "maintain" | "gain";
  preferred_cuisines: Cuisine[];
  daily_calorie_target: number;
  daily_protein_target: number;
  daily_carbs_target: number;
  daily_fat_target: number;
  created_at?: string;
  updated_at?: string;
}

export interface LoggedMeal {
  id: string;
  user_id: string;
  photo_url?: string;
  meal_title?: string;
  items: FoodItem[];
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  meal_type?: "breakfast" | "lunch" | "dinner" | "snack";
  notes?: string;
  logged_at: string;
  created_at: string;
}

export interface DailySummary {
  date: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  meals: LoggedMeal[];
}
