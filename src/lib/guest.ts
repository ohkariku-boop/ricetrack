/** Local session accounts — guest + demo paid users (Joe, Mel). No Supabase required. */

export type LocalAccountId = "guest" | "joe" | "mel";

export type LocalAccount = {
  id: LocalAccountId;
  name: string;
  paid: boolean;
  email?: string;
};

export const LOCAL_ACCOUNTS: LocalAccount[] = [
  { id: "guest", name: "Guest", paid: false },
  { id: "joe", name: "Joe", paid: true, email: "joe@ricetrack.app" },
  { id: "mel", name: "Mel", paid: true, email: "mel@ricetrack.app" },
];

const SESSION_KEY = "ricetrack_local_session";

export type GuestMeal = {
  id: string;
  items: unknown[];
  meal_title?: string;
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
  display_name?: string;
  is_paid?: boolean;
};

function mealsKey(id: LocalAccountId) {
  return `ricetrack_meals_${id}`;
}
function profileKey(id: LocalAccountId) {
  return `ricetrack_profile_${id}`;
}

const DEFAULT_PROFILES: Record<LocalAccountId, GuestProfile> = {
  guest: {
    daily_calorie_target: 2000,
    daily_protein_target: 120,
    daily_carbs_target: 200,
    daily_fat_target: 65,
    targets_manual: true,
    display_name: "Guest",
    is_paid: false,
  },
  joe: {
    daily_calorie_target: 2200,
    daily_protein_target: 150,
    daily_carbs_target: 220,
    daily_fat_target: 70,
    weight_kg: 75,
    targets_manual: true,
    display_name: "Joe",
    is_paid: true,
  },
  mel: {
    daily_calorie_target: 1800,
    daily_protein_target: 110,
    daily_carbs_target: 180,
    daily_fat_target: 55,
    weight_kg: 58,
    targets_manual: true,
    display_name: "Mel",
    is_paid: true,
  },
};

/** @deprecated use getSessionAccount */
export const GUEST_KEY = "ricetrack_guest";
export const GUEST_MEALS_KEY = "ricetrack_meals_guest";
export const GUEST_PROFILE_KEY = "ricetrack_profile_guest";

export function getSessionAccount(): LocalAccount | null {
  if (typeof window === "undefined") return null;
  const id = localStorage.getItem(SESSION_KEY) as LocalAccountId | null;
  if (!id) {
    // migrate old guest flag
    if (localStorage.getItem(GUEST_KEY) === "1") {
      return LOCAL_ACCOUNTS.find((a) => a.id === "guest") || null;
    }
    return null;
  }
  return LOCAL_ACCOUNTS.find((a) => a.id === id) || null;
}

export function isLocalSession(): boolean {
  return getSessionAccount() !== null;
}

export function isGuest(): boolean {
  const a = getSessionAccount();
  return a?.id === "guest" || (typeof window !== "undefined" && localStorage.getItem(GUEST_KEY) === "1" && !localStorage.getItem(SESSION_KEY));
}

export function isPaidUser(): boolean {
  return getSessionAccount()?.paid === true;
}

export function enableGuest(): void {
  enableAccount("guest");
}

export function enableAccount(id: LocalAccountId): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(SESSION_KEY, id);
  if (id === "guest") localStorage.setItem(GUEST_KEY, "1");
  else localStorage.removeItem(GUEST_KEY);

  if (!localStorage.getItem(profileKey(id))) {
    localStorage.setItem(profileKey(id), JSON.stringify(DEFAULT_PROFILES[id]));
  }
}

export function disableGuest(): void {
  clearLocalSession();
}

export function clearLocalSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(GUEST_KEY);
}

function activeId(): LocalAccountId {
  return getSessionAccount()?.id || "guest";
}

export function getGuestMeals(): GuestMeal[] {
  try {
    const id = activeId();
    const raw =
      localStorage.getItem(mealsKey(id)) ||
      (id === "guest" ? localStorage.getItem("ricetrack_guest_meals") : null) ||
      "[]";
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveGuestMeal(meal: Omit<GuestMeal, "id" | "logged_at">): GuestMeal {
  const full: GuestMeal = {
    ...meal,
    id: `local_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    logged_at: new Date().toISOString(),
  };
  const id = activeId();
  const meals = getGuestMeals();
  meals.unshift(full);
  localStorage.setItem(mealsKey(id), JSON.stringify(meals.slice(0, 100)));
  return full;
}

export function updateGuestMeal(
  mealId: string,
  patch: Partial<Omit<GuestMeal, "id">>
): GuestMeal | null {
  const id = activeId();
  const meals = getGuestMeals();
  const i = meals.findIndex((m) => m.id === mealId);
  if (i < 0) return null;
  meals[i] = { ...meals[i], ...patch };
  if (patch.items && Array.isArray(patch.items)) {
    const items = patch.items as {
      calories?: number;
      protein?: number;
      carbs?: number;
      fat?: number;
    }[];
    meals[i].total_calories = items.reduce((s, x) => s + (Number(x.calories) || 0), 0);
    meals[i].total_protein = items.reduce((s, x) => s + (Number(x.protein) || 0), 0);
    meals[i].total_carbs = items.reduce((s, x) => s + (Number(x.carbs) || 0), 0);
    meals[i].total_fat = items.reduce((s, x) => s + (Number(x.fat) || 0), 0);
  }
  localStorage.setItem(mealsKey(id), JSON.stringify(meals));
  return meals[i];
}

export function deleteGuestMeal(mealId: string): void {
  const id = activeId();
  const meals = getGuestMeals().filter((m) => m.id !== mealId);
  localStorage.setItem(mealsKey(id), JSON.stringify(meals));
}

export function getGuestProfile(): GuestProfile {
  try {
    const id = activeId();
    const raw =
      localStorage.getItem(profileKey(id)) ||
      (id === "guest" ? localStorage.getItem("ricetrack_guest_profile") : null);
    if (raw) return { ...DEFAULT_PROFILES[id], ...JSON.parse(raw) };
    return { ...DEFAULT_PROFILES[id] };
  } catch {
    return { ...DEFAULT_PROFILES.guest };
  }
}

export function setGuestProfile(p: Partial<GuestProfile>): void {
  const id = activeId();
  const next = { ...getGuestProfile(), ...p };
  localStorage.setItem(profileKey(id), JSON.stringify(next));
}
