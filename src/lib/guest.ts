/** Guest / demo mode — no Supabase account required */

export const GUEST_KEY = "ricetrack_guest";
export const GUEST_MEALS_KEY = "ricetrack_guest_meals";
export const GUEST_PROFILE_KEY = "ricetrack_guest_profile";

export type GuestMeal = {
  id: string;
  items: unknown[];
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
  cuisine_detected?: string;
  notes?: string | null;
  logged_at: string;
};

export type GuestProfile = {
  daily_calorie_target: number;
  daily_protein_target: number;
  daily_carbs_target: number;
  daily_fat_target: number;
  weight_kg?: number;
  targets_manual?: boolean;
};

export function isGuest(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(GUEST_KEY) === "1";
}

export function enableGuest(): void {
  localStorage.setItem(GUEST_KEY, "1");
  if (!localStorage.getItem(GUEST_PROFILE_KEY)) {
    localStorage.setItem(
      GUEST_PROFILE_KEY,
      JSON.stringify({
        daily_calorie_target: 2000,
        daily_protein_target: 120,
        daily_carbs_target: 200,
        daily_fat_target: 65,
        targets_manual: true,
      } satisfies GuestProfile)
    );
  }
}

export function disableGuest(): void {
  localStorage.removeItem(GUEST_KEY);
}

export function getGuestMeals(): GuestMeal[] {
  try {
    return JSON.parse(localStorage.getItem(GUEST_MEALS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveGuestMeal(meal: Omit<GuestMeal, "id" | "logged_at">): GuestMeal {
  const full: GuestMeal = {
    ...meal,
    id: `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    logged_at: new Date().toISOString(),
  };
  const meals = getGuestMeals();
  meals.unshift(full);
  localStorage.setItem(GUEST_MEALS_KEY, JSON.stringify(meals.slice(0, 100)));
  return full;
}

export function getGuestProfile(): GuestProfile {
  try {
    return JSON.parse(
      localStorage.getItem(GUEST_PROFILE_KEY) ||
        '{"daily_calorie_target":2000,"daily_protein_target":120,"daily_carbs_target":200,"daily_fat_target":65}'
    );
  } catch {
    return {
      daily_calorie_target: 2000,
      daily_protein_target: 120,
      daily_carbs_target: 200,
      daily_fat_target: 65,
    };
  }
}

export function setGuestProfile(p: Partial<GuestProfile>): void {
  const next = { ...getGuestProfile(), ...p };
  localStorage.setItem(GUEST_PROFILE_KEY, JSON.stringify(next));
}
