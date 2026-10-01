import { NextRequest, NextResponse } from "next/server";
import { analyzeFoodPhoto, analyzeFoodText } from "@/lib/ai/analyze-food";
import { applyQuotaCookie, consumeAiScan } from "@/lib/ai-quota-server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    // P0: hard server-side free-tier limit (before calling OpenRouter)
    const quota = await consumeAiScan(req);
    if (!quota.ok) {
      const res = NextResponse.json(
        {
          error: quota.error,
          code: quota.status === 429 ? "QUOTA_EXCEEDED" : "QUOTA_UNAVAILABLE",
          remaining: quota.remaining,
          used: quota.used,
          week: quota.week,
        },
        { status: quota.status }
      );
      return applyQuotaCookie(res, quota.setCookieId);
    }

    const body = await req.json();
    const {
      imageBase64,
      mimeType = "image/jpeg",
      cuisineHint,
      text,
    } = body;

    let analysis;
    if (text && typeof text === "string" && text.trim()) {
      analysis = await analyzeFoodText(text, cuisineHint);
    } else if (imageBase64) {
      if (imageBase64.length > 8_000_000) {
        return NextResponse.json({ error: "Image too large" }, { status: 400 });
      }
      analysis = await analyzeFoodPhoto(imageBase64, mimeType, cuisineHint);
    } else {
      return NextResponse.json(
        { error: "Provide a photo (imageBase64) or a text description (text)" },
        { status: 400 }
      );
    }

    const res = NextResponse.json({
      ...analysis,
      _quota: {
        remaining: quota.remaining,
        used: quota.used,
        week: quota.week,
        limit: 5,
      },
    });
    return applyQuotaCookie(res, quota.setCookieId);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Analysis failed";
    console.error("Analyze error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
