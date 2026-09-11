/** Local queue for library suggestions (guest + offline). */

export type LibrarySuggestion = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion?: string;
  cuisine?: string;
  source: "user";
  status: "pending" | "approved" | "rejected";
  created_at: string;
  meal_id?: string;
};

const KEY = "ricetrack_library_suggestions_v1";

function read(): LibrarySuggestion[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}

function write(rows: LibrarySuggestion[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(rows.slice(0, 500)));
}

export function listLocalSuggestions(): LibrarySuggestion[] {
  return read();
}

export function addLocalSuggestion(
  input: Omit<LibrarySuggestion, "id" | "created_at" | "status" | "source">
): LibrarySuggestion {
  const entry: LibrarySuggestion = {
    ...input,
    id: `sug_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    source: "user",
    status: "pending",
    created_at: new Date().toISOString(),
  };
  const all = read().filter(
    (x) => x.name.toLowerCase() !== entry.name.toLowerCase() || x.status !== "pending"
  );
  all.unshift(entry);
  write(all);
  return entry;
}

/** Submit suggestion locally + best-effort API. */
export async function submitLibrarySuggestion(input: {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion?: string;
  cuisine?: string;
  meal_id?: string;
}): Promise<{ ok: boolean; local: LibrarySuggestion }> {
  const name = input.name.trim();
  if (!name) throw new Error("Name required");
  const local = addLocalSuggestion({
    name,
    calories: Math.round(input.calories) || 0,
    protein: Math.round(input.protein * 10) / 10 || 0,
    carbs: Math.round(input.carbs * 10) / 10 || 0,
    fat: Math.round(input.fat * 10) / 10 || 0,
    portion: input.portion,
    cuisine: input.cuisine,
    meal_id: input.meal_id,
  });
  try {
    await fetch("/api/library/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(local),
    });
  } catch {
    // local queue is enough for guests
  }
  return { ok: true, local };
}
