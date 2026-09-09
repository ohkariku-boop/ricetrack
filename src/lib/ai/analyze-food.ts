import type { MealAnalysis, Cuisine, FoodItem } from "@/types";

const ASIAN_SYSTEM_PROMPT = `You are an expert nutritionist and food recognition AI specialized in Asian cuisines (Chinese, Japanese, Korean, Thai, Vietnamese, Indian, Malay, Indonesian, Filipino, and other Asian foods).

Your job is to analyze a photo of a meal and return accurate calorie and macro estimates with strong focus on Asian food accuracy.

CRITICAL RULES FOR ASIAN FOOD:
1. Identify specific dishes when possible (e.g. "Mapo Tofu", "Chicken Rice", "Bibimbap", "Pad Thai", "Nasi Lemak", "Adobo", "Pho", "Ramen", "Sushi", "Dim Sum" items, etc.).
2. Always consider cooking methods: stir-fried, deep-fried, steamed, braised, grilled, raw, boiled. These dramatically affect calories (especially oil).
3. Flag hidden calorie risks: wok oil, coconut milk, peanut sauce, thick gravies, deep-frying, fatty cuts, sweet sauces.
4. Portion strings MUST be in English by default, e.g. "1 bowl of rice (150g)", "1 plate of noodles", "small shared dish", "1 serving", "1 piece of dim sum". Do NOT use Chinese characters in portion unless the user explicitly wrote Chinese in their description.
5. For set meals / combo plates (nasi lemak, chicken rice, bento, thali, economy rice, etc.):
   - Set "meal_title" to the set name in English (e.g. "Nasi Lemak").
   - List ONLY the component items with their own calories (coconut rice, egg, fried chicken, sambal…).
   - NEVER also add a full-calorie line item that duplicates the whole set (no item named "Nasi Lemak" with the full plate calories).
6. Primary item names in English. Optional original script only in name_original.
7. Be conservative on oil/fat estimation for stir-fries and fried foods — better to slightly overestimate than underestimate.
8. Confidence should be lower for complex mixed dishes, soups, and items with heavy sauce.

Return ONLY valid JSON in this exact shape (no markdown, no extra text):

{
  "meal_title": "English plate/set name e.g. Nasi Lemak (required when it is a named set; else short summary)",
  "items": [
    {
      "name": "English component name",
      "name_original": "original name if known",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number,
      "fiber": number or null,
      "portion": "English descriptive portion e.g. 1 medium bowl (180g)",
      "portion_grams": number or null,
      "confidence": 0.0 to 1.0,
      "is_hidden_calorie_risk": true/false,
      "notes": "optional short note"
    }
  ],
  "total_calories": number,
  "total_protein": number,
  "total_carbs": number,
  "total_fat": number,
  "cuisine_detected": "chinese" | "japanese" | "korean" | "thai" | "vietnamese" | "indian" | "malay" | "indonesian" | "filipino" | "other_asian" | "western" | "unknown",
  "cooking_methods": ["stir-fried", "steamed", ...],
  "confidence_overall": 0.0 to 1.0,
  "warnings": ["optional list of warnings e.g. high oil risk"]
}`;

export async function analyzeFoodPhoto(
  imageBase64: string,
  mimeType: string = "image/jpeg",
  cuisineHint?: Cuisine | string
): Promise<MealAnalysis> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  const userPrompt = cuisineHint
    ? `This meal is likely ${cuisineHint} cuisine. Analyze the photo carefully for accurate Asian food nutrition.`
    : `Analyze this meal photo. Prioritize accurate recognition of Asian dishes and realistic portion + oil estimates.`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://ricetrack.vercel.app",
      "X-Title": "RiceTrack",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash", // strong vision + free/cheap tier friendly
      messages: [
        {
          role: "system",
          content: ASIAN_SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: [
            { type: "text", text: userPrompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${imageBase64}`,
              },
            },
          ],
        },
      ],
      temperature: 0.2,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("OpenRouter error:", errText);
    let detail = `AI analysis failed (${response.status})`;
    try {
      const j = JSON.parse(errText);
      if (j?.error?.message) detail = j.error.message;
    } catch { /* keep default */ }
    throw new Error(detail);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("No content returned from AI");
  }

  // Clean possible markdown fences
  let jsonStr = content.trim();
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  try {
    const parsed = JSON.parse(jsonStr) as MealAnalysis;

    // Basic validation & defaults
    parsed.items = (parsed.items || []).map((item: FoodItem) => ({
      ...item,
      calories: Number(item.calories) || 0,
      protein: Number(item.protein) || 0,
      carbs: Number(item.carbs) || 0,
      fat: Number(item.fat) || 0,
      confidence: Math.min(1, Math.max(0, Number(item.confidence) || 0.5)),
    }));

    parsed.total_calories =
      parsed.total_calories ||
      parsed.items.reduce((s, i) => s + i.calories, 0);
    parsed.total_protein =
      parsed.total_protein ||
      parsed.items.reduce((s, i) => s + i.protein, 0);
    parsed.total_carbs =
      parsed.total_carbs ||
      parsed.items.reduce((s, i) => s + i.carbs, 0);
    parsed.total_fat =
      parsed.total_fat ||
      parsed.items.reduce((s, i) => s + i.fat, 0);

    parsed.meal_title = parsed.meal_title || (parsed.items?.[0]?.name ?? "Meal");
  // Drop combo line that duplicates the title with near-full calories
  if (parsed.meal_title && parsed.items?.length > 1) {
    const title = String(parsed.meal_title).toLowerCase().trim();
    const total = Number(parsed.total_calories) || parsed.items.reduce((s: number, i: FoodItem) => s + (Number(i.calories) || 0), 0);
    parsed.items = parsed.items.filter((item: FoodItem) => {
      const n = String(item.name || "").toLowerCase().trim();
      if (n === title || n.includes(title) || title.includes(n)) {
        // Keep only if it's clearly a small component, not the whole plate
        const cal = Number(item.calories) || 0;
        if (total > 0 && cal >= total * 0.55) return false;
        if (parsed.items.length > 2 && cal >= total * 0.45) return false;
      }
      return true;
    });
  }
  parsed.confidence_overall =
      parsed.confidence_overall ||
      (parsed.items.length
        ? parsed.items.reduce((s, i) => s + i.confidence, 0) / parsed.items.length
        : 0.5);

    return parsed;
  } catch (e) {
    console.error("Failed to parse AI response:", content);
    throw new Error("Failed to parse nutrition analysis");
  }
}

const TEXT_SYSTEM_PROMPT = `You are an expert nutritionist specialized in Asian cuisines (Chinese, Japanese, Korean, Thai, Vietnamese, Indian, Malay, Indonesian, Filipino, Singaporean hawker food, and other Asian foods).

The user describes a meal in free text (English, Chinese, Malay, etc.). Parse it into structured nutrition.
Always set meal_title to a short English plate name. For set meals, items are COMPONENTS only — never double-count the set as an item.

CRITICAL RULES:
1. Expand shorthand: "半碗饭" = half bowl rice ~75-100g; "一碟青菜" = side of greens; "大份" = large portion.
2. Account for cooking oil in stir-fries and coconut milk in curries.
3. Split mixed meals into items (rice + dish + soup).
4. Output portion labels in English (e.g. "half bowl", "1 plate"). Primary name in English; original script only in name_original.
5. Prefer official-style estimates for common dishes (chicken rice, nasi lemak, dosa, pho, etc.).
6. Flag hidden calorie risks.

Return ONLY valid JSON in this exact shape:
{
  "items": [
    {
      "name": "English name",
      "name_original": "original if given",
      "calories": number,
      "protein": number,
      "carbs": number,
      "fat": number,
      "fiber": number or null,
      "portion": "descriptive portion",
      "portion_grams": number or null,
      "confidence": 0.0 to 1.0,
      "is_hidden_calorie_risk": true/false,
      "notes": "optional"
    }
  ],
  "total_calories": number,
  "total_protein": number,
  "total_carbs": number,
  "total_fat": number,
  "cuisine_detected": "chinese"|"japanese"|"korean"|"thai"|"vietnamese"|"indian"|"malay"|"indonesian"|"filipino"|"other_asian"|"western"|"unknown",
  "cooking_methods": [],
  "confidence_overall": 0.0 to 1.0,
  "warnings": []
}`;

function normalizeAnalysis(parsed: MealAnalysis): MealAnalysis {
  parsed.items = (parsed.items || []).map((item: FoodItem) => ({
    ...item,
    calories: Number(item.calories) || 0,
    protein: Number(item.protein) || 0,
    carbs: Number(item.carbs) || 0,
    fat: Number(item.fat) || 0,
    confidence: Math.min(1, Math.max(0, Number(item.confidence) || 0.5)),
  }));

  parsed.total_calories =
    parsed.total_calories ||
    parsed.items.reduce((s, i) => s + i.calories, 0);
  parsed.total_protein =
    parsed.total_protein ||
    parsed.items.reduce((s, i) => s + i.protein, 0);
  parsed.total_carbs =
    parsed.total_carbs ||
    parsed.items.reduce((s, i) => s + i.carbs, 0);
  parsed.total_fat =
    parsed.total_fat ||
    parsed.items.reduce((s, i) => s + i.fat, 0);

  parsed.meal_title = parsed.meal_title || (parsed.items?.[0]?.name ?? "Meal");
  // Drop combo line that duplicates the title with near-full calories
  if (parsed.meal_title && parsed.items?.length > 1) {
    const title = String(parsed.meal_title).toLowerCase().trim();
    const total = Number(parsed.total_calories) || parsed.items.reduce((s: number, i: FoodItem) => s + (Number(i.calories) || 0), 0);
    parsed.items = parsed.items.filter((item: FoodItem) => {
      const n = String(item.name || "").toLowerCase().trim();
      if (n === title || n.includes(title) || title.includes(n)) {
        // Keep only if it's clearly a small component, not the whole plate
        const cal = Number(item.calories) || 0;
        if (total > 0 && cal >= total * 0.55) return false;
        if (parsed.items.length > 2 && cal >= total * 0.45) return false;
      }
      return true;
    });
  }
  parsed.confidence_overall =
    parsed.confidence_overall ||
    (parsed.items.length
      ? parsed.items.reduce((s, i) => s + i.confidence, 0) / parsed.items.length
      : 0.5);

  return parsed;
}

function parseAiJson(content: string): MealAnalysis {
  let jsonStr = content.trim();
  if (jsonStr.startsWith("```")) {
    jsonStr = jsonStr.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }
  const parsed = JSON.parse(jsonStr) as MealAnalysis;
  return normalizeAnalysis(parsed);
}

export async function analyzeFoodText(
  text: string,
  cuisineHint?: Cuisine | string
): Promise<MealAnalysis> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not set");
  }

  const trimmed = text.trim();
  if (!trimmed || trimmed.length < 2) {
    throw new Error("Please describe what you ate");
  }

  const userPrompt = cuisineHint
    ? `Cuisine hint: ${cuisineHint}.\n\nMeal description:\n${trimmed}`
    : `Meal description:\n${trimmed}`;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "https://ricetrack.vercel.app",
      "X-Title": "RiceTrack",
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: TEXT_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error("OpenRouter error:", errText);
    let detail = `AI analysis failed (${response.status})`;
    try {
      const j = JSON.parse(errText);
      if (j?.error?.message) detail = j.error.message;
    } catch { /* keep default */ }
    throw new Error(detail);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error("No content returned from AI");

  try {
    return parseAiJson(content);
  } catch {
    console.error("Failed to parse text AI response:", content);
    throw new Error("Failed to parse nutrition analysis");
  }
}
