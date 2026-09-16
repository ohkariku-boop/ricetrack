"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  clearLocalIdentityForCloud,
  ensureCloudProfile,
  identityFromUser,
} from "@/lib/identity";
import { Loader2 } from "lucide-react";
import { RiceLogo } from "@/components/RiceLogo";

/**
 * Runs after /auth/callback exchanges the code.
 * Establishes cloud identity, ensures profile, routes to app.
 */
export default function AuthWelcomePage() {
  const router = useRouter();
  const [status, setStatus] = useState("Signing you in…");

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const supabase = createClient();
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (cancelled) return;

      if (error || !user) {
        setStatus("Could not confirm session. Redirecting…");
        router.replace("/login?error=auth");
        return;
      }

      clearLocalIdentityForCloud();
      setStatus("Setting up your account…");

      try {
        await ensureCloudProfile(supabase, user);
      } catch {
        /* profile trigger may already have created the row */
      }

      if (cancelled) return;

      const id = identityFromUser(user);
      setStatus(`Welcome${id?.displayName ? `, ${id.displayName}` : ""}`);

      // Cloud users: check if profile needs onboarding targets
      const { data: profile } = await supabase
        .from("profiles")
        .select("daily_calorie_target, weight_kg, onboarding_complete, targets_manual")
        .eq("id", user.id)
        .maybeSingle();

      const needsPlanner =
        profile &&
        (profile as { onboarding_complete?: boolean }).onboarding_complete === false;

      // If no weight and default-looking targets, send to onboarding once
      const noBody =
        !profile?.weight_kg &&
        !(profile as { targets_manual?: boolean } | null)?.targets_manual;

      await new Promise((r) => setTimeout(r, 400));
      if (cancelled) return;

      if (needsPlanner || noBody) {
        router.replace("/onboarding");
      } else {
        router.replace("/dashboard");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background px-5">
      <RiceLogo size={48} />
      <div className="flex items-center gap-2 text-muted-foreground text-sm">
        <Loader2 className="w-4 h-4 animate-spin" />
        {status}
      </div>
    </div>
  );
}
