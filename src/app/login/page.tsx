"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-background">
      <div className="w-full max-w-sm space-y-8 page-enter">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-primary mx-auto flex items-center justify-center text-primary-foreground font-bold text-xl shadow-sm mb-5">
            RT
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
          <p className="text-muted-foreground text-[15px] mt-2">
            Sign in to track Asian meals accurately
          </p>
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
            className="btn-primary w-full h-14 flex items-center justify-center gap-2 disabled:opacity-70"
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
          No password needed. We’ll email you a secure one-time link.
        </p>
      </div>
    </div>
  );
}
