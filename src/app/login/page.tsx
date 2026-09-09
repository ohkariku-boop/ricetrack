"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { enableGuest } from "@/lib/guest";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    setLoading(false);
    if (error) setError(error.message);
    else setMessage("Check your email for the magic link");
  };

  const continueAsGuest = () => {
    enableGuest();
    router.push("/app");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-background">
      <div className="w-full max-w-sm space-y-6 page-enter">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary mx-auto flex items-center justify-center text-primary-foreground font-bold text-xl shadow-sm mb-5">
            RT
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome</h1>
          <p className="text-muted-foreground text-[15px] mt-2">
            Track Asian meals — or try first without an account
          </p>
        </div>

        <button
          type="button"
          onClick={continueAsGuest}
          className="btn-primary w-full h-14 text-[15px]"
        >
          Continue as guest
        </button>

        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or sign in</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input-modern mt-1.5 w-full px-4 py-3.5 text-[15px]"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-secondary w-full h-12 flex items-center justify-center gap-2 disabled:opacity-70"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send magic link"}
          </button>
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

        <p className="text-center text-xs text-muted-foreground leading-relaxed">
          Guest mode saves meals on this device only.{" "}
          <Link href="/app" className="text-primary font-medium">
            Skip to log →
          </Link>
        </p>
      </div>
    </div>
  );
}
