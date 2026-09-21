"use client";

import { useEffect, useState, type ReactNode } from "react";
import { RiceLogo } from "@/components/RiceLogo";

/**
 * Marketing mock of /app log flow — matches real UI states:
 * 0 empty → 1 photo preview → 2 analyzing → 3 macros result
 */
const STEPS = 4;
const STEP_MS = 2800;
const NASI = "/food/singapore.jpg";

export function PhoneMockup() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setStep((s) => (s + 1) % STEPS);
    }, STEP_MS);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="relative mx-auto w-[min(100%,280px)] sm:w-[300px] lg:w-[280px] xl:w-[300px]">
      <div
        className="pointer-events-none absolute -inset-8 rounded-[3rem] bg-[#3d8f5c]/[0.12] blur-2xl"
        aria-hidden
      />
      <div className="relative rounded-[2.35rem] bg-[#1a1814] p-[10px] shadow-[0_28px_60px_-20px_rgba(26,24,20,0.45)] ring-1 ring-black/20">
        <div className="absolute -left-[2px] top-24 h-8 w-[3px] rounded-l bg-[#2a2723]" aria-hidden />
        <div className="absolute -left-[2px] top-36 h-12 w-[3px] rounded-l bg-[#2a2723]" aria-hidden />
        <div className="absolute -right-[2px] top-28 h-14 w-[3px] rounded-r bg-[#2a2723]" aria-hidden />

        <div className="relative overflow-hidden rounded-[1.85rem] bg-[#f7f2ea] aspect-[9/19.5] text-[#1a1814]">
          {/* Status bar */}
          <div className="relative flex items-center justify-between px-5 pt-3 pb-1 text-[10px] font-semibold text-[#1a1814]/70 z-10">
            <span>9:41</span>
            <div
              className="absolute left-1/2 -translate-x-1/2 top-2 h-[22px] w-[88px] rounded-full bg-[#1a1814]"
              aria-hidden
            />
            <span className="tracking-tight">●●●</span>
          </div>

          {/* App header — same as /app */}
          <div className="px-3.5 pt-2 pb-2 flex items-center justify-between border-b border-[#1a1814]/[0.06]">
            <div className="flex items-center gap-1.5">
              <RiceLogo size={18} />
              <span className="text-[12px] font-semibold tracking-tight">RiceTrack</span>
            </div>
            <span className="text-[9px] text-[#1a1814]/40">Free · 5 scans left</span>
          </div>

          <div className="relative h-[calc(100%-52px)] overflow-hidden">
            {/* Step 0 — empty: snap or type */}
            <Screen visible={step === 0}>
              <p className="text-[11px] text-[#1a1814]/50 leading-snug px-0.5">
                Snap a photo or type what you ate, Asian dishes in any language.
              </p>
              <div className="mt-2 flex rounded-xl bg-[#1a1814]/[0.06] p-0.5 text-[10px] font-medium">
                <span className="flex-1 text-center py-1.5 rounded-lg bg-white shadow-sm">
                  Photo
                </span>
                <span className="flex-1 text-center py-1.5 text-[#1a1814]/40">Type it</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl border border-dashed border-[#1a1814]/15 bg-white/70 py-5 flex flex-col items-center gap-1">
                  <span className="text-[16px]">📷</span>
                  <span className="text-[10px] font-medium">Camera</span>
                  <span className="text-[8px] text-[#1a1814]/40">Take a photo</span>
                </div>
                <div className="rounded-xl border border-dashed border-[#1a1814]/15 bg-white/70 py-5 flex flex-col items-center gap-1">
                  <span className="text-[16px]">🖼️</span>
                  <span className="text-[10px] font-medium">Gallery</span>
                  <span className="text-[8px] text-[#1a1814]/40">Upload image</span>
                </div>
              </div>
              <div className="mt-3">
                <div className="text-[9px] font-medium text-[#1a1814]/40 mb-1">Cuisine hint</div>
                <div className="rounded-lg border border-[#1a1814]/10 bg-white px-2.5 py-2 text-[10px] text-[#1a1814]/55">
                  Auto-detect
                </div>
              </div>
            </Screen>

            {/* Step 1 — photo captured (nasi lemak) */}
            <Screen visible={step === 1}>
              <div className="rounded-xl overflow-hidden border border-[#1a1814]/[0.08] bg-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={NASI}
                  alt="Nasi lemak"
                  className="w-full aspect-[4/3] object-cover"
                />
              </div>
              <div className="mt-2 text-[9px] text-[#1a1814]/40 truncate">nasi-lemak.jpg</div>
              <div className="mt-2">
                <div className="text-[9px] font-medium text-[#1a1814]/40 mb-1">Cuisine hint</div>
                <div className="rounded-lg border border-[#1a1814]/10 bg-white px-2.5 py-2 text-[10px]">
                  Malay
                </div>
              </div>
              <div className="mt-3 h-10 rounded-full bg-[#3d8f5c] text-white text-[12px] font-semibold flex items-center justify-center shadow-sm">
                Analyze plate
              </div>
              <button
                type="button"
                className="mt-2 w-full text-center text-[10px] text-[#1a1814]/40"
                tabIndex={-1}
              >
                Change photo
              </button>
            </Screen>

            {/* Step 2 — analyzing */}
            <Screen visible={step === 2}>
              <div className="rounded-xl overflow-hidden border border-[#1a1814]/[0.08] bg-white shadow-sm relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={NASI}
                  alt="Nasi lemak"
                  className="w-full aspect-[4/3] object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-[#1a1814]/25 flex items-center justify-center">
                  <div className="h-9 w-9 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                </div>
              </div>
              <div className="mt-3 h-10 rounded-full bg-[#3d8f5c]/80 text-white text-[12px] font-semibold flex items-center justify-center gap-2">
                <span className="h-3.5 w-3.5 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                Analyzing...
              </div>
              <p className="mt-2 text-center text-[9px] text-[#1a1814]/40">
                Reading Asian plate components
              </p>
            </Screen>

            {/* Step 3 — result macros (matches post-analyze + save) */}
            <Screen visible={step === 3}>
              <div className="flex gap-2 items-start">
                <div className="h-11 w-11 rounded-lg overflow-hidden shrink-0 border border-[#1a1814]/[0.06]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={NASI} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-[12px] font-semibold leading-tight">Nasi lemak</div>
                  <div className="text-[9px] text-[#1a1814]/45 mt-0.5">Malay · 1 plate</div>
                </div>
              </div>
              <div className="mt-2.5 rounded-xl bg-white border border-[#1a1814]/[0.06] p-2.5">
                <div className="text-[9px] text-[#1a1814]/40 uppercase tracking-wide">Total</div>
                <div className="text-[22px] font-semibold tabular-nums leading-none mt-0.5">
                  620
                  <span className="text-[10px] font-medium text-[#1a1814]/40 ml-1">kcal</span>
                </div>
                <div className="mt-1.5 flex gap-3 text-[10px] tabular-nums text-[#1a1814]/55">
                  <span>P 18g</span>
                  <span>C 68g</span>
                  <span>F 28g</span>
                </div>
              </div>
              <div className="mt-2 space-y-1.5">
                {[
                  ["Coconut rice", "280 kcal"],
                  ["Sambal egg", "90 kcal"],
                  ["Fried chicken", "180 kcal"],
                  ["Anchovies & peanuts", "70 kcal"],
                ].map(([name, cal]) => (
                  <div
                    key={name}
                    className="flex justify-between gap-2 rounded-lg bg-white/80 border border-[#1a1814]/[0.05] px-2 py-1.5 text-[10px]"
                  >
                    <span className="truncate font-medium">{name}</span>
                    <span className="tabular-nums text-[#1a1814]/50 shrink-0">{cal}</span>
                  </div>
                ))}
              </div>
              <div className="mt-2.5 h-10 rounded-full bg-[#3d8f5c] text-white text-[12px] font-semibold flex items-center justify-center">
                Save to diary
              </div>
            </Screen>
          </div>

          {/* Step dots */}
          <div className="absolute bottom-2.5 inset-x-0 flex justify-center gap-1.5 z-10">
            {Array.from({ length: STEPS }).map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === step ? "w-3 bg-[#3d8f5c]" : "w-1 bg-[#1a1814]/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Screen({
  visible,
  children,
}: {
  visible: boolean;
  children: ReactNode;
}) {
  return (
    <div
      className={`absolute inset-0 px-3 pt-2.5 pb-8 transition-opacity duration-500 ${
        visible ? "opacity-100 z-[1]" : "opacity-0 z-0 pointer-events-none"
      }`}
      aria-hidden={!visible}
    >
      {children}
    </div>
  );
}
