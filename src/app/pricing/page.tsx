"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Sparkles } from "lucide-react";
import { RiceLogo } from "@/components/RiceLogo";
import {
  PLAN_FEATURES,
  PRO_PRICE_MONTHLY,
  PRO_PRICE_YEARLY,
  activateMockPro,
  cancelMockPro,
  getSubscription,
  isPro,
  type SubscriptionState,
} from "@/lib/entitlements";
import { ensureLocalSession, getSessionAccount } from "@/lib/guest";
import { cn } from "@/lib/utils";

export default function PricingPage() {
  const [sub, setSub] = useState<SubscriptionState>({ plan: "free" });
  const [billing, setBilling] = useState<"monthly" | "yearly">("yearly");
  const [thanks, setThanks] = useState(false);
  const [busy, setBusy] = useState(false);
  const [accountName, setAccountName] = useState("Guest");

  const refresh = () => {
    ensureLocalSession();
    setSub(getSubscription());
    setAccountName(getSessionAccount()?.name || "Guest");
  };

  useEffect(() => {
    refresh();
    const onChange = () => refresh();
    window.addEventListener("rt-plan-changed", onChange);
    return () => window.removeEventListener("rt-plan-changed", onChange);
  }, []);

  const pro = sub.plan === "pro";

  const checkout = async () => {
    setBusy(true);
    // Stripe goes here later
    await new Promise((r) => setTimeout(r, 600));
    activateMockPro();
    setSub(getSubscription());
    setThanks(true);
    setBusy(false);
  };

  if (thanks) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5 text-center">
        <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mb-4">
          <Check className="w-7 h-7 text-primary" />
        </div>
        <h1 className="text-2xl font-semibold tracking-tight">Thank you for subscribing</h1>
        <p className="text-muted-foreground mt-2 max-w-sm text-sm leading-relaxed">
          Pro is active on this device for <span className="font-medium text-foreground">{accountName}</span>.
          Stripe checkout will replace this step later — you were not charged.
        </p>
        <div className="flex flex-col sm:flex-row gap-2 mt-8 w-full max-w-xs">
          <Link href="/app" className="btn-primary h-12 flex items-center justify-center">
            Start logging
          </Link>
          <Link href="/dashboard" className="btn-secondary h-12 flex items-center justify-center">
            Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background safe-bottom">
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto max-w-lg px-5 h-14 flex items-center gap-3">
          <Link href="/settings" className="p-2 -ml-2 rounded-xl hover:bg-muted">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2 font-semibold">
            <RiceLogo size={22} />
            Plans
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-lg px-5 py-6 space-y-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-1">RiceTrack Pro</p>
          <h1 className="text-2xl font-semibold tracking-tight">Built for Asian plates</h1>
          <p className="text-sm text-muted-foreground mt-1.5 leading-snug">
            Free covers daily logging. Pro removes AI limits so photo tracking stays unlimited.
          </p>
        </div>

        {pro && (
          <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm">
            <span className="font-semibold text-primary">Pro active</span>
            <span className="text-muted-foreground">
              {" "}
              · {sub.source === "demo_account" ? "Demo account" : sub.source === "mock" ? "Preview sub" : "Subscribed"}
              {sub.since ? ` · since ${new Date(sub.since).toLocaleDateString()}` : ""}
            </span>
          </div>
        )}

        {/* Billing toggle */}
        <div className="flex p-1 rounded-full bg-muted">
          <button
            type="button"
            onClick={() => setBilling("monthly")}
            className={cn(
              "flex-1 h-9 rounded-full text-sm font-medium transition-colors",
              billing === "monthly" ? "bg-background shadow-sm" : "text-muted-foreground"
            )}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => setBilling("yearly")}
            className={cn(
              "flex-1 h-9 rounded-full text-sm font-medium transition-colors",
              billing === "yearly" ? "bg-background shadow-sm" : "text-muted-foreground"
            )}
          >
            Yearly · save ~20%
          </button>
        </div>

        <div className="grid gap-3">
          {/* Free card */}
          <div className={cn("rounded-2xl border p-4", !pro ? "border-primary/40 bg-primary/[0.03]" : "border-border")}>
            <div className="flex items-baseline justify-between">
              <h2 className="font-semibold">Free</h2>
              {!pro && (
                <span className="text-[11px] font-semibold uppercase tracking-wide text-primary">Current</span>
              )}
            </div>
            <p className="text-2xl font-bold mt-1">
              $0<span className="text-sm font-normal text-muted-foreground"> / forever</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">Manual logging + limited AI scans</p>
          </div>

          {/* Pro card */}
          <div className={cn("rounded-2xl border p-4", pro ? "border-primary/40 bg-primary/[0.03]" : "border-border")}>
            <div className="flex items-baseline justify-between gap-2">
              <h2 className="font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" />
                Pro
              </h2>
              {pro && (
                <span className="text-[11px] font-semibold uppercase tracking-wide text-primary">Current</span>
              )}
            </div>
            <p className="text-2xl font-bold mt-1">
              {billing === "monthly" ? (
                <>
                  ${PRO_PRICE_MONTHLY}
                  <span className="text-sm font-normal text-muted-foreground"> / month</span>
                </>
              ) : (
                <>
                  ${PRO_PRICE_YEARLY}
                  <span className="text-sm font-normal text-muted-foreground"> / year</span>
                </>
              )}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {billing === "yearly"
                ? `≈ $${(PRO_PRICE_YEARLY / 12).toFixed(2)}/mo · unlimited AI`
                : "Unlimited AI photo & text analysis"}
            </p>

            {!pro ? (
              <button
                type="button"
                onClick={checkout}
                disabled={busy}
                className="btn-primary w-full h-12 mt-4 disabled:opacity-50"
              >
                {busy ? "Processing…" : "Checkout now"}
              </button>
            ) : sub.source === "mock" ? (
              <button
                type="button"
                onClick={() => {
                  cancelMockPro();
                  setSub(getSubscription());
                }}
                className="btn-secondary w-full h-11 mt-4 text-sm"
              >
                Cancel preview Pro
              </button>
            ) : null}
            <p className="text-[11px] text-muted-foreground text-center mt-2">
              Payment via Stripe comes later. Checkout activates Pro on this device only.
            </p>
          </div>
        </div>

        {/* Comparison */}
        <div>
          <h3 className="text-sm font-semibold mb-3">What you get</h3>
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="grid grid-cols-[1.4fr_0.8fr_0.8fr] gap-0 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground bg-muted/50 px-3 py-2">
              <span>Feature</span>
              <span className="text-center">Free</span>
              <span className="text-center">Pro</span>
            </div>
            {PLAN_FEATURES.map((row) => (
              <div
                key={row.name}
                className="grid grid-cols-[1.4fr_0.8fr_0.8fr] gap-0 px-3 py-2.5 text-sm border-t border-border/60"
              >
                <span className="pr-2 leading-snug">{row.name}</span>
                <span className="text-center text-muted-foreground text-xs self-center">{row.free}</span>
                <span className="text-center text-xs font-medium text-primary self-center">{row.pro}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[11px] text-muted-foreground text-center pb-8">
          Estimates only, not medical advice. Cancel anytime once Stripe billing is live.
        </p>
      </main>
    </div>
  );
}
