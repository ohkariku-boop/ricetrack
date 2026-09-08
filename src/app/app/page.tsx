"use client";

import { useState, useRef, useEffect } from "react";
import type { MealAnalysis, FoodItem } from "@/types";
import { formatCalories, formatMacro, cn } from "@/lib/utils";
import {
  Camera,
  Loader2,
  AlertTriangle,
  Check,
  X,
  LayoutDashboard,
  Pencil,
  Plus,
  Minus,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState("image/jpeg");
  const [analysis, setAnalysis] = useState<MealAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cuisineHint, setCuisineHint] = useState("");
  const [user, setUser] = useState<any>(null);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image");
      return;
    }
    setError(null);
    setAnalysis(null);
    setSuccess(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      setImageBase64(result.split(",")[1]);
      setMimeType(file.type || "image/jpeg");
    };
    reader.readAsDataURL(file);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const analyze = async () => {
    if (!imageBase64) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64,
          mimeType,
          cuisineHint: cuisineHint || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setAnalysis(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateItem = (idx: number, patch: Partial<FoodItem>) => {
    if (!analysis) return;
    const items = [...analysis.items];
    items[idx] = { ...items[idx], ...patch };

    // Recalculate totals
    const total_calories = items.reduce((s, i) => s + Number(i.calories), 0);
    const total_protein = items.reduce((s, i) => s + Number(i.protein), 0);
    const total_carbs = items.reduce((s, i) => s + Number(i.carbs), 0);
    const total_fat = items.reduce((s, i) => s + Number(i.fat), 0);

    setAnalysis({
      ...analysis,
      items,
      total_calories,
      total_protein,
      total_carbs,
      total_fat,
    });
  };

  const adjustCalories = (idx: number, delta: number) => {
    const item = analysis!.items[idx];
    const newCal = Math.max(0, Number(item.calories) + delta);
    // Scale macros roughly
    const ratio = item.calories > 0 ? newCal / item.calories : 1;
    updateItem(idx, {
      calories: Math.round(newCal),
      protein: Math.round(Number(item.protein) * ratio),
      carbs: Math.round(Number(item.carbs) * ratio),
      fat: Math.round(Number(item.fat) * ratio),
    });
  };

  const saveToDiary = async () => {
    if (!analysis) return;
    if (!user) {
      router.push("/login");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      let photoUrl: string | null = null;

      // Upload photo to Supabase Storage if available
      if (imageBase64 && imagePreview) {
        try {
          const blob = await (await fetch(imagePreview)).blob();
          const fileName = `${user.id}/${Date.now()}.jpg`;
          const { error: uploadError } = await supabase.storage
            .from("meal-photos")
            .upload(fileName, blob, { contentType: mimeType, upsert: false });

          if (!uploadError) {
            const { data: urlData } = supabase.storage
              .from("meal-photos")
              .getPublicUrl(fileName);
            photoUrl = urlData.publicUrl;
          }
        } catch {
          // Storage optional — continue without photo
        }
      }

      const { error: insertError } = await supabase.from("meals").insert({
        user_id: user.id,
        photo_url: photoUrl,
        items: analysis.items,
        total_calories: analysis.total_calories,
        total_protein: analysis.total_protein,
        total_carbs: analysis.total_carbs,
        total_fat: analysis.total_fat,
        cuisine_detected: analysis.cuisine_detected,
        logged_at: new Date().toISOString(),
      });

      if (insertError) throw insertError;

      setSuccess("Saved to your diary");
      setTimeout(() => router.push("/dashboard"), 900);
    } catch (err: any) {
      setError(err.message || "Failed to save meal");
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setImagePreview(null);
    setImageBase64(null);
    setAnalysis(null);
    setError(null);
    setSuccess(null);
    setEditingIdx(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-xl border-b border-border/60">
        <div className="mx-auto max-w-lg px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-sm">
              RT
            </div>
            <span className="font-semibold tracking-tight">RiceTrack</span>
          </div>
          <Link
            href="/dashboard"
            className="p-2.5 text-muted-foreground hover:text-foreground rounded-xl hover:bg-muted transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-lg px-5 py-6 space-y-6 page-enter">
        {/* Empty state */}
        {!imagePreview && (
          <div className="space-y-6 pt-4">
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold tracking-tight">Snap your meal</h1>
              <p className="text-muted-foreground text-[15px] leading-relaxed max-w-xs mx-auto">
                Built for Asian food — rice bowls, stir-fries, noodles, shared plates & more.
              </p>
            </div>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full card-elevated p-12 flex flex-col items-center gap-4 hover:border-primary/40 transition-all active:scale-[0.98]"
            >
              <div className="w-16 h-16 rounded-2xl bg-primary-soft flex items-center justify-center">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-semibold">Take or upload photo</p>
                <p className="text-sm text-muted-foreground mt-1">Good lighting works best</p>
              </div>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={onFileChange}
            />
          </div>
        )}

        {/* Preview + Analyze */}
        {imagePreview && !analysis && (
          <div className="space-y-5 animate-scale-in">
            <div className="relative rounded-3xl overflow-hidden border border-border shadow-sm">
              <img src={imagePreview} alt="Meal" className="w-full max-h-[340px] object-cover" />
              <button
                onClick={reset}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Cuisine hint</label>
              <select
                value={cuisineHint}
                onChange={(e) => setCuisineHint(e.target.value)}
                className="input-modern mt-1.5 w-full px-4 py-3 text-sm font-medium"
              >
                <option value="">Auto-detect</option>
                <option value="chinese">Chinese</option>
                <option value="japanese">Japanese</option>
                <option value="korean">Korean</option>
                <option value="thai">Thai</option>
                <option value="vietnamese">Vietnamese</option>
                <option value="indian">Indian</option>
                <option value="malay">Malay</option>
                <option value="indonesian">Indonesian</option>
                <option value="filipino">Filipino</option>
                <option value="other_asian">Other Asian</option>
              </select>
            </div>

            <button
              onClick={analyze}
              disabled={loading}
              className="btn-primary w-full h-14 flex items-center justify-center gap-2 text-[16px] disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing…
                </>
              ) : (
                "Analyze meal"
              )}
            </button>

            {error && (
              <div className="rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-3 text-sm flex gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}
          </div>
        )}

        {/* Results with editable items */}
        {analysis && (
          <div className="space-y-5 animate-fade-up">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold tracking-tight">Results</h2>
              <button onClick={reset} className="text-sm font-medium text-muted-foreground hover:text-foreground">
                New scan
              </button>
            </div>

            {/* Totals card */}
            <div className="card-elevated p-4">
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Cal</div>
                  <div className="text-xl font-bold mt-0.5">{formatCalories(analysis.total_calories)}</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Prot</div>
                  <div className="text-xl font-bold mt-0.5">{formatMacro(analysis.total_protein)}g</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Carb</div>
                  <div className="text-xl font-bold mt-0.5">{formatMacro(analysis.total_carbs)}g</div>
                </div>
                <div>
                  <div className="text-[11px] text-muted-foreground font-medium uppercase tracking-wide">Fat</div>
                  <div className="text-xl font-bold mt-0.5">{formatMacro(analysis.total_fat)}g</div>
                </div>
              </div>
            </div>

            {/* Meta chips */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 rounded-full bg-primary-soft text-primary text-xs font-semibold capitalize">
                {analysis.cuisine_detected?.replace("_", " ") || "unknown"}
              </span>
              <span className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                {(analysis.confidence_overall * 100).toFixed(0)}% confidence
              </span>
              {analysis.cooking_methods?.slice(0, 3).map((m) => (
                <span key={m} className="px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-xs font-medium capitalize">
                  {m}
                </span>
              ))}
            </div>

            {analysis.warnings && analysis.warnings.length > 0 && (
              <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 px-4 py-3 space-y-1.5">
                {analysis.warnings.map((w, i) => (
                  <div key={i} className="flex gap-2 text-sm text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    {w}
                  </div>
                ))}
              </div>
            )}

            {/* Editable items */}
            <div className="space-y-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Items · tap to adjust
              </p>
              {analysis.items.map((item, idx) => (
                <div key={idx} className="card-soft p-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="font-semibold">{item.name}</div>
                      {item.name_original && item.name_original !== item.name && (
                        <div className="text-xs text-muted-foreground mt-0.5">{item.name_original}</div>
                      )}
                      <div className="text-xs text-muted-foreground mt-1">{item.portion}</div>
                    </div>
                    <button
                      onClick={() => setEditingIdx(editingIdx === idx ? null : idx)}
                      className="p-2 rounded-xl hover:bg-muted text-muted-foreground"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Quick calorie adjust */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => adjustCalories(idx, -20)}
                        className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <div className="text-center min-w-[4.5rem]">
                        <div className="font-bold text-lg">{formatCalories(item.calories)}</div>
                        <div className="text-[10px] text-muted-foreground">kcal</div>
                      </div>
                      <button
                        onClick={() => adjustCalories(idx, 20)}
                        className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground font-medium">
                      <span>P {formatMacro(item.protein)}</span>
                      <span>C {formatMacro(item.carbs)}</span>
                      <span>F {formatMacro(item.fat)}</span>
                    </div>
                  </div>

                  {editingIdx === idx && (
                    <div className="pt-2 border-t border-border space-y-2.5 animate-fade-up">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] text-muted-foreground">Name</label>
                          <input
                            value={item.name}
                            onChange={(e) => updateItem(idx, { name: e.target.value })}
                            className="input-modern mt-1 w-full px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-muted-foreground">Portion</label>
                          <input
                            value={item.portion}
                            onChange={(e) => updateItem(idx, { portion: e.target.value })}
                            className="input-modern mt-1 w-full px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label className="text-[11px] text-muted-foreground">Protein (g)</label>
                          <input
                            type="number"
                            value={item.protein}
                            onChange={(e) => updateItem(idx, { protein: Number(e.target.value) })}
                            className="input-modern mt-1 w-full px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-muted-foreground">Carbs (g)</label>
                          <input
                            type="number"
                            value={item.carbs}
                            onChange={(e) => updateItem(idx, { carbs: Number(e.target.value) })}
                            className="input-modern mt-1 w-full px-3 py-2 text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] text-muted-foreground">Fat (g)</label>
                          <input
                            type="number"
                            value={item.fat}
                            onChange={(e) => updateItem(idx, { fat: Number(e.target.value) })}
                            className="input-modern mt-1 w-full px-3 py-2 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {item.is_hidden_calorie_risk && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Possible hidden oil / sauce
                    </div>
                  )}
                </div>
              ))}
            </div>

            {success && (
              <div className="rounded-2xl bg-green-500/10 text-green-700 dark:text-green-400 px-4 py-3 text-sm text-center font-medium">
                {success}
              </div>
            )}
            {error && (
              <div className="rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-3 text-sm flex gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}

            <button
              onClick={saveToDiary}
              disabled={saving}
              className="btn-primary w-full h-14 flex items-center justify-center gap-2 text-[16px] disabled:opacity-70"
            >
              {saving ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  {user ? "Save to diary" : "Sign in to save"}
                </>
              )}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
