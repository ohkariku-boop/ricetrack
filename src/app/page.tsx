"use client";

import { useState, useRef } from "react";
import type { MealAnalysis, FoodItem } from "@/types";
import { formatCalories, formatMacro, cn } from "@/lib/utils";
import { Camera, Upload, Loader2, AlertTriangle, Check, X } from "lucide-react";

export default function HomePage() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState("image/jpeg");
  const [analysis, setAnalysis] = useState<MealAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cuisineHint, setCuisineHint] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image");
      return;
    }
    setError(null);
    setAnalysis(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setImagePreview(result);
      const base64 = result.split(",")[1];
      setImageBase64(base64);
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

  const reset = () => {
    setImagePreview(null);
    setImageBase64(null);
    setAnalysis(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-lg px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              RT
            </div>
            <span className="font-semibold text-lg tracking-tight">RiceTrack</span>
          </div>
          <span className="text-xs text-muted-foreground font-medium">Asia-first</span>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-lg px-4 py-6 space-y-6">
        {!imagePreview && (
          <div className="space-y-4">
            <div className="text-center space-y-2 pt-4">
              <h1 className="text-2xl font-bold tracking-tight">Snap your meal</h1>
              <p className="text-muted-foreground text-sm">
                Built for Asian food accuracy — rice bowls, stir-fries, noodles, shared plates & more.
              </p>
            </div>

            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-border rounded-2xl p-10 flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <div className="text-center">
                <p className="font-medium">Take or upload a photo</p>
                <p className="text-sm text-muted-foreground mt-1">Best results with good lighting</p>
              </div>
            </div>

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

        {imagePreview && !analysis && (
          <div className="space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-border">
              <img src={imagePreview} alt="Meal preview" className="w-full max-h-80 object-cover" />
              <button
                onClick={reset}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Cuisine hint (optional)</label>
              <select
                value={cuisineHint}
                onChange={(e) => setCuisineHint(e.target.value)}
                className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm"
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
              className={cn(
                "w-full h-12 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors",
                loading
                  ? "bg-primary/70 text-primary-foreground"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing…
                </>
              ) : (
                <>
                  <Upload className="w-5 h-5" />
                  Analyze Meal
                </>
              )}
            </button>

            {error && (
              <div className="rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-3 text-sm flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                {error}
              </div>
            )}
          </div>
        )}

        {analysis && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">Results</h2>
              <button onClick={reset} className="text-sm text-muted-foreground hover:text-foreground">
                New scan
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="rounded-xl bg-card border border-border p-3 text-center">
                <div className="text-xs text-muted-foreground">Calories</div>
                <div className="text-lg font-bold mt-0.5">{formatCalories(analysis.total_calories)}</div>
              </div>
              <div className="rounded-xl bg-card border border-border p-3 text-center">
                <div className="text-xs text-muted-foreground">Protein</div>
                <div className="text-lg font-bold mt-0.5">{formatMacro(analysis.total_protein)}g</div>
              </div>
              <div className="rounded-xl bg-card border border-border p-3 text-center">
                <div className="text-xs text-muted-foreground">Carbs</div>
                <div className="text-lg font-bold mt-0.5">{formatMacro(analysis.total_carbs)}g</div>
              </div>
              <div className="rounded-xl bg-card border border-border p-3 text-center">
                <div className="text-xs text-muted-foreground">Fat</div>
                <div className="text-lg font-bold mt-0.5">{formatMacro(analysis.total_fat)}g</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground capitalize">
                {analysis.cuisine_detected?.replace("_", " ") || "unknown"}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                Confidence {(analysis.confidence_overall * 100).toFixed(0)}%
              </span>
              {analysis.cooking_methods?.map((m) => (
                <span key={m} className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground capitalize">
                  {m}
                </span>
              ))}
            </div>

            {analysis.warnings && analysis.warnings.length > 0 && (
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-sm space-y-1">
                {analysis.warnings.map((w, i) => (
                  <div key={i} className="flex items-start gap-2 text-amber-700 dark:text-amber-400">
                    <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                    {w}
                  </div>
                ))}
              </div>
            )}

            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">Items detected</h3>
              {analysis.items.map((item, idx) => (
                <FoodItemCard key={idx} item={item} />
              ))}
            </div>

            <button
              onClick={() => alert("Save to diary coming next (auth + Supabase)")}
              className="w-full h-12 rounded-xl bg-primary text-primary-foreground font-medium flex items-center justify-center gap-2"
            >
              <Check className="w-5 h-5" />
              Save to Diary
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        RiceTrack · Optimized for Asian food accuracy
      </footer>
    </div>
  );
}

function FoodItemCard({ item }: { item: FoodItem }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-medium">{item.name}</div>
          {item.name_original && item.name_original !== item.name && (
            <div className="text-xs text-muted-foreground mt-0.5">{item.name_original}</div>
          )}
          <div className="text-xs text-muted-foreground mt-1">{item.portion}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="font-semibold">{formatCalories(item.calories)}</div>
          <div className="text-xs text-muted-foreground">kcal</div>
        </div>
      </div>

      <div className="flex gap-3 text-xs text-muted-foreground">
        <span>P {formatMacro(item.protein)}g</span>
        <span>C {formatMacro(item.carbs)}g</span>
        <span>F {formatMacro(item.fat)}g</span>
        <span className="ml-auto">{(item.confidence * 100).toFixed(0)}% conf</span>
      </div>

      {item.is_hidden_calorie_risk && (
        <div className="flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
          <AlertTriangle className="w-3.5 h-3.5" />
          Possible hidden oil / sauce calories
        </div>
      )}

      {item.notes && <p className="text-xs text-muted-foreground">{item.notes}</p>}
    </div>
  );
}
