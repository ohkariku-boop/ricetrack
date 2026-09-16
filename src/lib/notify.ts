/**
 * Optional email notify (Resend). No-op if RESEND_API_KEY is missing.
 * Target: NOTIFY_EMAIL or chiefsupportofficer@gmail.com
 */

export type NotifySuggestion = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion?: string | null;
  cuisine?: string | null;
};

export async function notifyNewLibrarySuggestion(
  s: NotifySuggestion
): Promise<{ sent: boolean; reason?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to =
    process.env.NOTIFY_EMAIL ||
    process.env.ADMIN_NOTIFY_EMAIL ||
    "chiefsupportofficer@gmail.com";
  const from =
    process.env.NOTIFY_FROM_EMAIL || "RiceTrack <onboarding@resend.dev>";

  if (!apiKey) {
    return { sent: false, reason: "RESEND_API_KEY not set" };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://ricetrack.vercel.app";
  const subject = `[RiceTrack] New library suggestion: ${s.name}`;
  const text = [
    "A user suggested a dish for the public library.",
    "",
    `Name: ${s.name}`,
    `Cuisine: ${s.cuisine || "—"}`,
    `Portion: ${s.portion || "—"}`,
    `Calories: ${s.calories}`,
    `Protein: ${s.protein}g  Carbs: ${s.carbs}g  Fat: ${s.fat}g`,
    "",
    `Review: ${appUrl}/admin/library`,
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject,
        text,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      return { sent: false, reason: body.slice(0, 200) };
    }
    return { sent: true };
  } catch (e) {
    return {
      sent: false,
      reason: e instanceof Error ? e.message : "notify failed",
    };
  }
}
