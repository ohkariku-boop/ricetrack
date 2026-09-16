"use client";

import { useState, Suspense, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  enableAccount,
  enableGuest,
  LOCAL_ACCOUNTS,
  needsOnboarding,
} from "@/lib/guest";
import { Loader2, Crown, Mail } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { RiceLogo } from "@/components/RiceLogo";
import { ThemeToggle } from "@/components/ThemeToggle";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showDemo, setShowDemo] = useState(false);
  const [checking, setChecking] = useState(true);
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("error") === "auth") {
      setError("Sign-in link expired or invalid. Request a new one, or continue as guest.");
    }

    // Already signed in with Supabase → go to app
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.replace("/auth/welcome");
        return;
      }
      setChecking(false);
    }).catch(() => setChecking(false));
  }, [searchParams, router, supabase.auth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const origin = window.location.origin;
    const { error: otpError } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: {
        emailRedirectTo: `${origin}/auth/callback?next=/auth/welcome`,
        shouldCreateUser: true,
      },
    });

    setLoading(false);
    if (otpError) {
      setError(otpError.message);
      return;
    }
    setMessage(
      "Check your email for a magic link. Open it on this device to finish signing in."
    );
  };

  const pickAccount = (id: "guest" | "joe" | "mel") => {
    // Prefer not mixing with a lingering cloud session
    supabase.auth.signOut().catch(() => {});

    if (id === "guest") {
      enableGuest();
      router.push("/app");
      return;
    }
    enableAccount(id);
    if (needsOnboarding()) router.push("/onboarding");
    else router.push("/dashboard");
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-background relative page-enter">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <div className="w-full max-w-sm space-y-6 page-enter">
        <div className="text-center">
          <div className="mx-auto mb-5 flex justify-center">
            <RiceLogo size={56} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Your account</h1>
          <p className="text-muted-foreground text-[15px] mt-2 leading-snug">
            Sign in with email so meals and Pro can follow you across devices.
          </p>
        </div>

        {/* Primary: email identity */}
        <form onSubmit={handleLogin} className="space-y-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-modern mt-1.5 w-full px-4 py-3.5 text-[15px]"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="btn-primary w-full h-12 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Mail className="w-4 h-4" />
                Continue with email
              </>
            )}
          </button>
          <p className="text-[11px] text-center text-muted-foreground leading-relaxed">
            We’ll email a magic link — no password. Creates an account if you’re new.
          </p>
        </form>

        {message && (
          <div className="rounded-2xl bg-green-500/10 text-green-700 dark:text-green-400 px-4 py-3.5 text-sm text-center font-medium">
            {message}
          </div>
        )}
        {error && (
          <div className="rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-3.5 text-sm text-center">
            {error}
          </div>
        )}

        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Secondary: guest */}
        <button
          type="button"
          onClick={() => pickAccount("guest")}
          className="btn-secondary w-full h-12 text-[15px]"
        >
          Continue as guest
        </button>
        <p className="text-[11px] text-center text-muted-foreground -mt-2">
          On this device only. Sign in later to keep data if you switch phones.
        </p>

        {/* Tertiary: demo accounts */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowDemo((v) => !v)}
            className="w-full text-center text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showDemo ? "Hide demo accounts" : "Demo accounts (Joe / Mel)"}
          </button>
          {showDemo && (
            <div className="mt-3 space-y-2">
              {LOCAL_ACCOUNTS.filter((a) => a.paid).map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => pickAccount(a.id)}
                  className="btn-secondary w-full h-12 text-[14px] justify-between px-4 flex items-center"
                >
                  <span className="flex items-center gap-2">
                    <Crown className="w-4 h-4 text-primary" />
                    {a.name}
                  </span>
                  <span className="text-xs text-muted-foreground">Pro demo · local</span>
                </button>
              ))}
              <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
                Demo data stays on this browser only. Not a real subscription.
              </p>
            </div>
          )}
        </div>

        <p className="text-center text-[11px] text-muted-foreground pt-2">
          <Link href="/" className="hover:text-foreground">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
