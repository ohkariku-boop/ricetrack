import { NextRequest, NextResponse } from "next/server";
import { analyzeFoodPhoto, analyzeFoodText } from "@/lib/ai/analyze-food";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      imageBase64,
      mimeType = "image/jpeg",
      cuisineHint,
      text,
    } = body;

    // Text logging path
    if (text && typeof text === "string" && text.trim()) {
      const analysis = await analyzeFoodText(text, cuisineHint);
      return NextResponse.json(analysis);
    }

    // Photo path
    if (!imageBase64) {
      return NextResponse.json(
        { error: "Provide a photo (imageBase64) or a text description (text)" },
        { status: 400 }
      );
    }

    if (imageBase64.length > 8_000_000) {
      return NextResponse.json({ error: "Image too large" }, { status: 400 });
    }

    const analysis = await analyzeFoodPhoto(imageBase64, mimeType, cuisineHint);
    return NextResponse.json(analysis);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    console.error("Analyze error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
