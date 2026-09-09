"use client";

import { useState, useRef, useEffect } from "react";
import type { MealAnalysis, FoodItem } from "@/types";
import { formatCalories, formatMacro, cn } from "@/lib/utils";
import {
  Camera,
  Image as ImageIcon,
  Loader2,
  AlertTriangle,
  Check,
  X,
  LayoutDashboard,
  Pencil,
  Plus,
  Minus,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MEAL_TEMPLATES, PORTION_PRESETS } from "@/data/meal-templates";
import { isGuest, enableGuest, saveGuestMeal, getGuestMeals } from "@/lib/guest";

type RecentMeal = {
  id: string;
  items: FoodItem[];
  total_calories: number;
  total_protein: number;
  total_carbs: number;
  total_fat: number;
};

export default function TrackerPage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState("image/jpeg");
  const [analysis, setAnalysis] = useState<MealAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cuisineHint, setCuisineHint] = useState("");
  const [mode, setMode] = useState<"photo" | "text">("photo");
  const [textDescription, setTextDescription] = useState("");
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [guest, setGuest] = useState(false);
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [recents, setRecents] = useState<RecentMeal[]>([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [correctionHint, setCorrectionHint] = useState("");
  const [reanalyzing, setReanalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const g = isGuest();
    setGuest(g);
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
      if (user) {
        fetch("/api/recents")
          .then((r) => r.json())
          .then((d) => setRecents((d.meals || []).slice(0, 10)))
          .catch(() => {});
      } else if (g) {
        const meals = getGuestMeals().slice(0, 10).map((m) => ({
          id: m.id,
          items: (m.items || []) as any,
          total_calories: m.total_calories,
          total_protein: m.total_protein,
          total_carbs: m.total_carbs,
          total_fat: m.total_fat,
        }));
        setRecents(meals);
      }
    });
  }, []);

  const compressImage = (file: File): Promise<{ base64: string; preview: string; mime: string }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = () => reject(new Error("Could not read image"));
      reader.onload = () => {
        const img = new window.Image();
        img.onload = () => {
          const maxSide = 1280;
          let { width, height } = img;
          if (width > maxSide || height > maxSide) {
            const scale = maxSide / Math.max(width, height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          if (!ctx) {
            reject(new Error("Could not process image"));
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const mime = "image/jpeg";
          const dataUrl = canvas.toDataURL(mime, 0.82);
          resolve({
            base64: dataUrl.split(",")[1],
            preview: dataUrl,
            mime,
          });
        };
        img.onerror = () => reject(new Error("Invalid image"));
        img.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/") && !file.name.match(/\.(jpe?g|png|webp|heic|heif)$/i)) {
      setError("Please select an image");
      return;
    }
    setError(null);
    setAnalysis(null);
    setSuccess(null);
    try {
      const { base64, preview, mime } = await compressImage(file);
      setImagePreview(preview);
      setImageBase64(base64);
      setMimeType(mime);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not process image");
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const analyze = async () => {
    if (mode === "photo" && !imageBase64) return;
    if (mode === "text" && !textDescription.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const body =
        mode === "photo"
          ? { imageBase64, mimeType, cuisineHint }
          : { text: textDescription.trim(), cuisineHint };
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      setAnalysis(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Something went wrong";
      setError(
        msg.toLowerCase().includes("terminated") || msg.toLowerCase().includes("fetch")
          ? "Analysis timed out or failed. Try a smaller/clearer photo, or use Type it."
          : msg
      );
    } finally {
      setLoading(false);
    }
  };

  const reanalyzeWithCorrection = async () => {
    if (!analysis) return;
    setReanalyzing(true);
    setError(null);
    try {
      const itemNames = analysis.items.map((i) => i.name).join(", ");
      const hint = correctionHint.trim();
      const text = hint
        ? `User correction for this meal: ${hint}. Current detected items were: ${itemNames}. Please re-estimate calories and macros using the correction as ground truth.`
        : `Please re-estimate this meal. Confirmed items: ${itemNames}. Use these names as the dishes present.`;
      const body: Record<string, string> = { text, cuisineHint };
      // If we still have the photo, include it for better portion sense
      if (imageBase64) {
        body.imageBase64 = imageBase64;
        body.mimeType = mimeType;
        body.text = text; // API prioritizes text if both? Check API - text takes precedence. Better send only image with hint in cuisine or custom field.
      }
      // Send as text path with strong correction (most reliable)
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          cuisineHint: cuisineHint || analysis.cuisine_detected || "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Re-analysis failed");
      setAnalysis(data);
      setCorrectionHint("");
      setEditingIdx(null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Re-analysis failed");
    } finally {
      setReanalyzing(false);
    }
  };

    const updateItem = (idx: number, patch: Partial<FoodItem>) => {
    if (!analysis) return;
    const items = analysis.items.map((item, i) =>
      i === idx ? { ...item, ...patch } : item
    );
    setAnalysis({
      ...analysis,
      items,
      total_calories: items.reduce((s, x) => s + Number(x.calories), 0),
      total_protein: items.reduce((s, x) => s + Number(x.protein), 0),
      total_carbs: items.reduce((s, x) => s + Number(x.carbs), 0),
      total_fat: items.reduce((s, x) => s + Number(x.fat), 0),
    });
  };

  const removeItem = (idx: number) => {
    if (!analysis) return;
    const items = analysis.items.filter((_, i) => i !== idx);
    if (items.length === 0) {
      setAnalysis(null);
      return;
    }
    setAnalysis({
      ...analysis,
      items,
      total_calories: items.reduce((s, x) => s + Number(x.calories), 0),
      total_protein: items.reduce((s, x) => s + Number(x.protein), 0),
      total_carbs: items.reduce((s, x) => s + Number(x.carbs), 0),
      total_fat: items.reduce((s, x) => s + Number(x.fat), 0),
    });
    setEditingIdx(null);
  };

  const saveMeal = async () => {
    if (!analysis) return;

    // Guest path — local only, no account needed
    if (!user) {
      if (!isGuest()) enableGuest();
      setGuest(true);
      setSaving(true);
      setError(null);
      try {
        saveGuestMeal({
          items: analysis.items,
          total_calories: analysis.total_calories,
          total_protein: analysis.total_protein,
          total_carbs: analysis.total_carbs,
          total_fat: analysis.total_fat,
          cuisine_detected: analysis.cuisine_detected,
          notes: analysis.notes || null,
        });
        const meals = getGuestMeals().slice(0, 10).map((m) => ({
          id: m.id,
          items: (m.items || []) as any,
          total_calories: m.total_calories,
          total_protein: m.total_protein,
          total_carbs: m.total_carbs,
          total_fat: m.total_fat,
        }));
        setRecents(meals);
        setSuccess("Saved on this device (guest)");
        setTimeout(() => {
          reset();
          router.push("/dashboard");
        }, 900);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Could not save");
      } finally {
        setSaving(false);
      }
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const { error: insertError } = await supabase.from("meals").insert({
        user_id: user.id,
        items: analysis.items,
        total_calories: analysis.total_calories,
        total_protein: analysis.total_protein,
        total_carbs: analysis.total_carbs,
        total_fat: analysis.total_fat,
        cuisine_detected: analysis.cuisine_detected,
        notes: analysis.notes || null,
      });
      if (insertError) throw insertError;

      for (const item of analysis.items) {
        await supabase.from("user_foods").insert({
          user_id: user.id,
          name: item.name,
          name_original: item.name_original || null,
          calories: item.calories,
          protein: item.protein,
          carbs: item.carbs,
          fat: item.fat,
          portion: item.portion,
          cuisine: analysis.cuisine_detected,
          times_logged: 1,
        });
      }

      setSuccess("Saved to your diary");
      fetch("/api/recents")
        .then((r) => r.json())
        .then((d) => setRecents((d.meals || []).slice(0, 10)))
        .catch(() => {});
      setTimeout(() => {
        reset();
        router.push("/dashboard");
      }, 900);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Could not save");
    } finally {
      setSaving(false);
    }
  };

  const relogMeal = (meal: RecentMeal) => {
    setAnalysis({
      items: (meal.items || []).map((i) => ({
        ...i,
        confidence: i.confidence ?? 0.9,
      })),
      total_calories: meal.total_calories,
      total_protein: meal.total_protein,
      total_carbs: meal.total_carbs,
      total_fat: meal.total_fat,
      cuisine_detected: "unknown",
      confidence_overall: 0.9,
    });
    setImagePreview(null);
    setImageBase64(null);
    setError(null);
    setSuccess(null);
  };

  const applyTemplate = (id: string) => {
    const tpl = MEAL_TEMPLATES.find((x) => x.id === id);
    if (!tpl) return;
    const items = tpl.items.map((i) => ({
      ...i,
      confidence: 0.95,
      is_hidden_calorie_risk: false,
    }));
    setAnalysis({
      items,
      total_calories: items.reduce((s, i) => s + i.calories, 0),
      total_protein: items.reduce((s, i) => s + i.protein, 0),
      total_carbs: items.reduce((s, i) => s + i.carbs, 0),
      total_fat: items.reduce((s, i) => s + i.fat, 0),
      cuisine_detected: tpl.cuisine as MealAnalysis["cuisine_detected"],
      confidence_overall: 0.95,
    });
    setShowTemplates(false);
  };

  const applyPortionFactor = (idx: number, factor: number) => {
    if (!analysis) return;
    const items = analysis.items.map((item, i) => {
      if (i !== idx) return item;
      return {
        ...item,
        calories: Math.round(item.calories * factor),
        protein: Math.round(item.protein * factor * 10) / 10,
        carbs: Math.round(item.carbs * factor * 10) / 10,
        fat: Math.round(item.fat * factor * 10) / 10,
      };
    });
    setAnalysis({
      ...analysis,
      items,
      total_calories: items.reduce((s, x) => s + x.calories, 0),
      total_protein: items.reduce((s, x) => s + x.protein, 0),
      total_carbs: items.reduce((s, x) => s + x.carbs, 0),
      total_fat: items.reduce((s, x) => s + x.fat, 0),
    });
  };

  const reset = () => {
    setImagePreview(null);
    setImageBase64(null);
    setAnalysis(null);
    setError(null);
    setSuccess(null);
    setEditingIdx(null);
    setTextDescription("");
    setCorrectionHint("");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  };

  const cuisineOptions = (
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
      <option value="singaporean">Singaporean</option>
      <option value="indonesian">Indonesian</option>
      <option value="filipino">Filipino</option>
      <option value="other_asian">Other Asian</option>
    </select>
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-20 bg-background/90 backdrop-blur-xl border-b border-border/60">
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
            aria-label="Dashboard"
          >
            <LayoutDashboard className="w-5 h-5" />
          </Link>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-lg px-5 py-4 space-y-4">
        {/* Empty state */}
        {!imagePreview && !analysis && (
          <div className="space-y-5">
            <div className="text-center space-y-2 pt-1">
              <h1 className="text-2xl font-bold tracking-tight">Log a meal</h1>
              <p className="text-muted-foreground text-[15px] leading-relaxed max-w-xs mx-auto">
                Snap a photo or type what you ate — Asian dishes in any language.
              </p>
            </div>

            <div className="flex p-1 rounded-2xl bg-muted gap-1">
              <button
                type="button"
                onClick={() => setMode("photo")}
                className={cn(
                  "flex-1 h-11 rounded-xl text-sm font-semibold transition-all",
                  mode === "photo" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                )}
              >
                Photo
              </button>
              <button
                type="button"
                onClick={() => setMode("text")}
                className={cn(
                  "flex-1 h-11 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-1.5",
                  mode === "text" ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"
                )}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Type it
              </button>
            </div>

            {mode === "photo" ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="card-elevated p-6 flex flex-col items-center gap-3 hover:border-primary/40 transition-all active:scale-[0.99]"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Camera className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-sm">Camera</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Take a photo</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="card-elevated p-6 flex flex-col items-center gap-3 hover:border-primary/40 transition-all active:scale-[0.99]"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-sm">Gallery</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Photos & files</p>
                    </div>
                  </button>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  className="hidden"
                  onChange={onFileChange}
                />
                <input
                  ref={galleryInputRef}
                  type="file"
                  accept="image/*,.jpg,.jpeg,.png,.webp,.heic,.heif"
                  className="hidden"
                  onChange={onFileChange}
                />
              </div>
            ) : (
              <div className="space-y-4">
                <textarea
                  value={textDescription}
                  onChange={(e) => setTextDescription(e.target.value)}
                  placeholder="e.g. 半碗米饭 + 麻婆豆腐, or chicken rice with dark soy"
                  rows={4}
                  className="input-modern w-full px-4 py-3 text-[15px] resize-none"
                />
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cuisine hint</label>
                  {cuisineOptions}
                </div>
                <button
                  type="button"
                  onClick={analyze}
                  disabled={loading || !textDescription.trim()}
                  className="btn-primary w-full h-14 flex items-center justify-center gap-2 text-[16px] disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Analyzing…
                    </>
                  ) : (
                    "Estimate calories"
                  )}
                </button>
              </div>
            )}

            {error && (
              <div className="rounded-2xl bg-red-500/10 text-red-600 px-4 py-3 text-sm">{error}</div>
            )}

            {/* Templates — max visible, no endless scroll */}
            <div className="pt-1">
              <button
                type="button"
                onClick={() => setShowTemplates((v) => !v)}
                className="flex items-center gap-1.5 text-xs font-semibold text-primary"
              >
                Quick templates
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", showTemplates && "rotate-180")} />
              </button>
              {showTemplates && (
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {MEAL_TEMPLATES.slice(0, 8).map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => applyTemplate(tpl.id)}
                      className="card-soft p-3 text-left hover:border-primary/40 transition-colors"
                    >
                      <div className="text-sm font-medium leading-tight">{tpl.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-1 line-clamp-2">
                        {tpl.description}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Recents — 10 max */}
            {recents.length > 0 && (
              <div className="space-y-2 pt-1">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Re-log · last {Math.min(10, recents.length)}
                </div>
                <div className="space-y-2">
                  {recents.slice(0, 10).map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => relogMeal(m)}
                      className="w-full card-soft p-3.5 flex justify-between items-center text-left hover:border-primary/40 transition-colors"
                    >
                      <span className="text-sm font-medium truncate pr-3">
                        {(m.items || []).map((i) => i.name).join(", ") || "Meal"}
                      </span>
                      <span className="text-sm font-bold tabular-nums shrink-0">
                        {Math.round(m.total_calories)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Photo preview */}
        {imagePreview && !analysis && (
          <div className="space-y-5">
            <div className="relative rounded-3xl overflow-hidden border border-border shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imagePreview} alt="Meal" className="w-full max-h-[340px] object-cover" />
              <button
                type="button"
                onClick={reset}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/50 backdrop-blur text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Cuisine hint</label>
              {cuisineOptions}
            </div>
            <button
              type="button"
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
                "Analyze plate"
              )}
            </button>
            {error && (
              <div className="rounded-2xl bg-red-500/10 text-red-600 px-4 py-3 text-sm">{error}</div>
            )}
          </div>
        )}

        {/* Results */}
        {analysis && (
          <div className="space-y-5">
            <div className="card-elevated p-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Total
                  </div>
                  <div className="text-4xl font-bold tracking-tight tabular-nums mt-1">
                    {formatCalories(analysis.total_calories)}
                    <span className="text-base font-medium text-muted-foreground ml-1">kcal</span>
                  </div>
                </div>
                <div className="text-right text-sm space-y-0.5 tabular-nums">
                  <div>
                    <span className="text-muted-foreground">P </span>
                    {formatMacro(analysis.total_protein)}g
                  </div>
                  <div>
                    <span className="text-muted-foreground">C </span>
                    {formatMacro(analysis.total_carbs)}g
                  </div>
                  <div>
                    <span className="text-muted-foreground">F </span>
                    {formatMacro(analysis.total_fat)}g
                  </div>
                </div>
              </div>
              {analysis.cuisine_detected && analysis.cuisine_detected !== "unknown" && (
                <div className="mt-3 text-xs text-muted-foreground capitalize">
                  {String(analysis.cuisine_detected).replace("_", " ")} · confidence{" "}
                  {Math.round((analysis.confidence_overall || 0.8) * 100)}%
                </div>
              )}
            </div>

            <div className="space-y-2">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-1">
                Items · tap to edit
              </div>
              {analysis.items.map((item, idx) => (
                <div key={idx} className="card-soft p-3 sm:p-4 space-y-3 overflow-hidden">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="font-medium leading-snug">{item.name}</div>
                      {item.portion && (
                        <div className="text-xs text-muted-foreground mt-0.5">{item.portion}</div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setEditingIdx(editingIdx === idx ? null : idx)}
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeItem(idx)}
                        className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-sm tabular-nums">
                    <span className="font-semibold">{formatCalories(item.calories)} kcal</span>
                    <span className="text-muted-foreground">P {formatMacro(item.protein)}</span>
                    <span className="text-muted-foreground">C {formatMacro(item.carbs)}</span>
                    <span className="text-muted-foreground">F {formatMacro(item.fat)}</span>
                  </div>

                  {item.is_hidden_calorie_risk && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-400">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Oil / sauce may be undercounted — adjust if needed
                    </div>
                  )}

                  <div className="flex flex-wrap gap-1.5">
                    {PORTION_PRESETS.map((p) => (
                      <button
                        key={p.label}
                        type="button"
                        onClick={() => applyPortionFactor(idx, p.factor)}
                        className="text-[11px] px-2.5 py-1 rounded-full bg-muted font-medium hover:bg-primary/15 hover:text-primary transition-colors"
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>

                  {editingIdx === idx && (
                    <div className="space-y-3 pt-2 border-t border-border/60">
                      <div>
                        <label className="text-[10px] uppercase text-muted-foreground">Dish name</label>
                        <input
                          type="text"
                          className="input-modern mt-0.5 w-full px-3 py-2 text-sm"
                          value={item.name}
                          onChange={(e) => updateItem(idx, { name: e.target.value })}
                          placeholder="e.g. Char kway teow"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase text-muted-foreground">Portion</label>
                        <input
                          type="text"
                          className="input-modern mt-0.5 w-full px-3 py-2 text-sm"
                          value={item.portion || ""}
                          onChange={(e) => updateItem(idx, { portion: e.target.value })}
                          placeholder="e.g. 1 plate, half bowl"
                        />
                      </div>
                      <div className="grid grid-cols-1 gap-2 min-w-0">
                        {(
                          [
                            ["calories", "kcal"],
                            ["protein", "protein g"],
                            ["carbs", "carbs g"],
                            ["fat", "fat g"],
                          ] as const
                        ).map(([key, label]) => (
                          <div key={key} className="flex items-center gap-2 min-w-0">
                            <label className="w-16 shrink-0 text-[11px] uppercase text-muted-foreground">
                              {label}
                            </label>
                            <button
                              type="button"
                              className="p-2 rounded-lg bg-muted shrink-0"
                              onClick={() =>
                                updateItem(idx, {
                                  [key]: Math.max(0, Number(item[key]) - (key === "calories" ? 10 : 1)),
                                })
                              }
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              inputMode="decimal"
                              className="input-modern min-w-0 flex-1 px-2 py-2 text-sm text-center tabular-nums"
                              value={item[key]}
                              onChange={(e) =>
                                updateItem(idx, { [key]: Number(e.target.value) || 0 })
                              }
                            />
                            <button
                              type="button"
                              className="p-2 rounded-lg bg-muted shrink-0"
                              onClick={() =>
                                updateItem(idx, {
                                  [key]: Number(item[key]) + (key === "calories" ? 10 : 1),
                                })
                              }
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {success && (
              <div className="rounded-2xl bg-primary/10 text-primary px-4 py-3 text-sm flex items-center gap-2">
                <Check className="w-4 h-4" />
                {success}
              </div>
            )}
            {error && (
              <div className="rounded-2xl bg-red-500/10 text-red-600 px-4 py-3 text-sm">{error}</div>
            )}

            <div className="card-soft p-4 space-y-3">
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                Wrong dish? Correct it
              </div>
              <input
                type="text"
                value={correctionHint}
                onChange={(e) => setCorrectionHint(e.target.value)}
                placeholder="e.g. It's Hokkien mee, not spaghetti"
                className="input-modern w-full px-3 py-2.5 text-sm"
              />
              <button
                type="button"
                onClick={reanalyzeWithCorrection}
                disabled={reanalyzing}
                className="btn-secondary w-full h-11 text-sm disabled:opacity-50"
              >
                {reanalyzing ? "Re-analyzing…" : "Re-analyze with my correction"}
              </button>
              <p className="text-[11px] text-muted-foreground leading-snug">
                Or tap the pencil on any item to rename it and edit macros — your edit is what gets saved.
              </p>
            </div>

            <div className="flex gap-2 sticky bottom-4 pt-1 pb-2 bg-background">
              <button type="button" onClick={reset} className="btn-secondary flex-1 h-12">
                Cancel
              </button>
              <button
                type="button"
                onClick={saveMeal}
                disabled={saving}
                className="btn-primary flex-[2] h-12 disabled:opacity-50"
              >
                {saving ? "Saving…" : user ? "Save meal" : "Save (guest)"}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
