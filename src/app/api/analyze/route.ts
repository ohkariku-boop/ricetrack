import { NextRequest, NextResponse } from "next/server";
import { analyzeFoodPhoto } from "@/lib/ai/analyze-food";

export const maxDuration = 60; // allow longer for vision

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType = "image/jpeg", cuisineHint } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: "imageBase64 is required" },
        { status: 400 }
      );
    }

    // Basic size guard (rough)
    if (imageBase64.length > 8_000_000) {
      return NextResponse.json(
        { error: "Image too large" },
        { status: 400 }
      );
    }

    const analysis = await analyzeFoodPhoto(
      imageBase64,
      mimeType,
      cuisineHint
    );

    return NextResponse.json(analysis);
  } catch (error: any) {
    console.error("Analyze error:", error);
    return NextResponse.json(
      { error: error.message || "Analysis failed" },
      { status: 500 }
    );
  }
}
