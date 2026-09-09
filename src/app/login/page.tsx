"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { enableAccount, enableGuest, LOCAL_ACCOUNTS, needsOnboarding } from "@/lib/guest";
import { Loader2, Crown } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { RiceLogo } from "@/components/RiceLogo";
import { ThemeToggle } from "@/components/ThemeToggle";

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

  const pickAccount = (id: "guest" | "joe" | "mel") => {
    if (id === "guest") {
      enableGuest();
      router.push("/app");
      return;
    }
    enableAccount(id);
    // Paid demo users: complete fitness planner first
    if (needsOnboarding()) router.push("/onboarding");
    else router.push("/dashboard");
  };

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
          <h1 className="text-2xl font-bold tracking-tight">Welcome</h1>
          <p className="text-muted-foreground text-[15px] mt-2">
            Choose an account to continue
          </p>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => pickAccount("guest")}
            className="btn-secondary w-full h-14 text-[15px] justify-between px-5 flex items-center"
          >
            <span>Continue as guest</span>
            <span className="text-xs text-muted-foreground font-normal">Free</span>
          </button>

          {LOCAL_ACCOUNTS.filter((a) => a.paid).map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => pickAccount(a.id)}
              className="btn-primary w-full h-14 text-[15px] justify-between px-5 flex items-center"
            >
              <span className="flex items-center gap-2">
                <Crown className="w-4 h-4 opacity-90" />
                Continue as {a.name}
              </span>
              <span className="text-xs font-medium opacity-90">Paid</span>
            </button>
          ))}
        </div>

        <div className="relative flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground">or email magic link</span>
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
          Joe & Mel are paid demo accounts on this device. Data stays separate per account.
        </p>
      </div>
    </div>
  );
}
