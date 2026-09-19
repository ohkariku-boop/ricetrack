import Link from "next/link";
import { RiceLogo } from "@/components/RiceLogo";
import { PhoneMockup } from "@/components/PhoneMockup";

const HERO = [
  { src: "/food/ramen.jpg", alt: "Ramen" },
  { src: "/food/pho.jpg", alt: "Pho" },
  { src: "/food/noodles2.jpg", alt: "Noodles" },
  { src: "/food/indian-curry.jpg", alt: "Indian curry" },
  { src: "/food/rice.jpg", alt: "Rice meal" },
  { src: "/food/friedrice.jpg", alt: "Fried rice" },
];

const MARQUEE = [
  { src: "/food/thai.jpg", cuisine: "Thai" },
  { src: "/food/chinese2.jpg", cuisine: "Chinese" },
  { src: "/food/japanese.jpg", cuisine: "Japanese" },
  { src: "/food/korean.jpg", cuisine: "Korean" },
  { src: "/food/vietnamese.jpg", cuisine: "Vietnamese" },
  { src: "/food/indian3.jpg", cuisine: "Indian" },
  { src: "/food/indonesian.jpg", cuisine: "Indonesian" },
  { src: "/food/filipino.jpg", cuisine: "Filipino" },
  { src: "/food/srilanka.jpg", cuisine: "Sri Lankan" },
  { src: "/food/singapore.jpg", cuisine: "Singaporean" },
  { src: "/food/malay.jpg", cuisine: "Malay" },
  { src: "/food/taiwan.jpg", cuisine: "Taiwanese" },
  { src: "/food/pho.jpg", cuisine: "Vietnamese" },
  { src: "/food/ramen.jpg", cuisine: "Japanese" },
];

function MarqueeStrip() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <section
      className="relative overflow-hidden border-y border-[#1a1814]/[0.06]"
      aria-label="Cuisines across Asia"
    >
      <div className="marquee-track flex w-max gap-0">
        {items.map((item, i) => (
          <div
            key={`${item.cuisine}-${i}`}
            className="relative shrink-0 w-[140px] sm:w-[168px] h-[92px] sm:h-[108px] overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.cuisine}
              className="absolute inset-0 w-full h-full object-cover scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1814]/55 via-[#1a1814]/15 to-transparent" />
            <span className="absolute inset-x-0 bottom-2.5 text-center text-[12px] sm:text-[13px] font-semibold tracking-wide text-white drop-shadow">
              {item.cuisine}
            </span>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#f7f2ea] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#f7f2ea] to-transparent z-10" />
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] sm:text-[13px] font-semibold tracking-[0.14em] uppercase text-[#3d8f5c]">
      {children}
    </p>
  );
}


export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f7f2ea] text-[#1a1814] antialiased selection:bg-[#3d8f5c]/20">
      {/* Soft decorative blobs */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden -z-10"
        aria-hidden
      >
        <div className="absolute -top-24 -right-20 h-72 w-72 rounded-full bg-[#3d8f5c]/[0.07] blur-3xl" />
        <div className="absolute top-[40%] -left-24 h-80 w-80 rounded-full bg-[#e8a87c]/[0.12] blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-[#3d8f5c]/[0.05] blur-3xl" />
      </div>

      <header className="sticky top-0 z-40 border-b border-[#1a1814]/[0.06] bg-[#f7f2ea]/85 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 min-w-0 group">
            <RiceLogo size={28} className="transition-transform group-hover:scale-105" />
            <span className="flex flex-col leading-tight min-w-0">
              <span className="font-semibold text-[15px] tracking-tight">RiceTrack</span>
              <span className="text-[11px] font-medium text-[#1a1814]/40 tracking-tight">
                Built for Asian plates first
              </span>
            </span>
          </Link>

          <nav className="hidden sm:flex items-center gap-6 text-[14px] text-[#1a1814]/50">
            <a href="#how" className="hover:text-[#1a1814] transition-colors">
              How
            </a>
            <a href="#why" className="hover:text-[#1a1814] transition-colors">
              Why
            </a>
            <a href="#pricing" className="hover:text-[#1a1814] transition-colors">
              Pricing
            </a>
            <Link href="/library" className="hover:text-[#1a1814] transition-colors">
              Library
            </Link>
          </nav>
          <Link
            href="/app"
            className="text-[13px] font-semibold rounded-full bg-[#3d8f5c] text-white px-4 py-2 hover:bg-[#4aa56c] transition-colors"
          >
            Open app
          </Link>
        </div>
      </header>

      {/* Hero — copy + phone mockup */}
      <section className="px-4 pt-7 pb-5 sm:pt-10 sm:pb-6">
        <div className="mx-auto max-w-5xl grid lg:grid-cols-2 gap-5 lg:gap-8 items-center">
          <div className="space-y-3 order-2 lg:order-1">
            <p className="text-[12px] tracking-[0.16em] uppercase text-[#1a1814]/45 font-medium">
              Asia-first · Photo AI · 1000+ dishes and counting, updated weekly
            </p>
            <h1 className="font-semibold tracking-[-0.035em] leading-[1.02] text-[clamp(2.1rem,5.4vw,3.25rem)]">
              Snap the plate.
              <br />
              Get macros that
              <br />
              <span className="text-[#3d8f5c]">actually get Asia.</span>
            </h1>
            <p className="text-[15px] leading-snug text-[#1a1814]/55 max-w-sm">
              Snap or type rice bowls, noodles, curry, hawker sets. Not Western defaults.
            </p>
            <div className="flex flex-wrap gap-2 pt-0.5">
              <Link
                href="/app"
                className="inline-flex h-10 px-6 items-center rounded-full bg-[#3d8f5c] text-white text-[13px] font-semibold hover:bg-[#4aa56c] transition-colors"
              >
                Try free
              </Link>
              <Link
                href="/library"
                className="inline-flex h-10 px-6 items-center rounded-full bg-[#3d8f5c] text-white text-[13px] font-semibold hover:bg-[#4aa56c] transition-colors"
              >
                Library
              </Link>
            </div>
            <div className="pt-1 max-w-md">
              <p className="text-[12px] font-semibold text-[#1a1814]/40 uppercase tracking-wide mb-1.5">
                Install on phone
              </p>
              <div className="grid grid-cols-2 gap-1.5 text-[13px] leading-snug text-[#1a1814]/60">
                <div className="rounded-lg border border-[#1a1814]/8 bg-white/50 px-2.5 py-2">
                  <div className="font-semibold text-[#1a1814] text-[12px] mb-0.5">iPhone</div>
                  <p>Safari → Share → Add to Home Screen</p>
                </div>
                <div className="rounded-lg border border-[#1a1814]/8 bg-white/50 px-2.5 py-2">
                  <div className="font-semibold text-[#1a1814] text-[12px] mb-0.5">Android</div>
                  <p>Chrome → Menu ⋮ → Install app</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative order-1 lg:order-2 flex justify-center lg:justify-end py-2">
            <PhoneMockup />
          </div>
        </div>
      </section>

      <MarqueeStrip />

      {/* How + Why */}
      <section className="px-4 py-14 sm:py-16" id="how">
        <div className="mx-auto max-w-5xl grid lg:grid-cols-2 gap-8 lg:gap-10">
          <div className="rounded-3xl border border-[#1a1814]/[0.06] bg-white/70 backdrop-blur-sm p-6 sm:p-8 shadow-[0_20px_50px_-30px_rgba(26,24,20,0.25)]">
            <SectionLabel>How it works</SectionLabel>
            <h2 className="mt-2 text-[1.65rem] sm:text-[1.85rem] font-semibold tracking-tight leading-snug">
              Three steps. No spreadsheet energy.
            </h2>
            <ol className="mt-6 space-y-5">
              {[
                {
                  n: "01",
                  t: "Snap or type",
                  d: "Photo a plate, search the library, or re-log a favourite. Hawker sets and home cooking welcome.",
                },
                {
                  n: "02",
                  t: "Review the breakdown",
                  d: "See the dish title, components, and macros. Fix a name or portion — the AI learns your correction.",
                },
                {
                  n: "03",
                  t: "Track the day",
                  d: "Calories, water, rest, energy, and a daily summary that tells you if you’re on track.",
                },
              ].map((step) => (
                <li key={step.n} className="flex gap-4">
                  <span className="text-[13px] font-semibold tabular-nums text-[#3d8f5c] pt-0.5 shrink-0">
                    {step.n}
                  </span>
                  <div>
                    <div className="font-semibold text-[15px]">{step.t}</div>
                    <p className="text-[14px] text-[#1a1814]/55 leading-relaxed mt-0.5">
                      {step.d}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div
            id="why"
            className="rounded-3xl border border-[#3d8f5c]/25 bg-[#2f7a52] text-white p-6 sm:p-8 shadow-[0_20px_50px_-28px_rgba(47,122,82,0.45)]"
          >
            <p className="text-[12px] sm:text-[13px] font-semibold tracking-[0.14em] uppercase text-white/80">
              Why RiceTrack
            </p>
            <h2 className="mt-2 text-[1.65rem] sm:text-[1.85rem] font-semibold tracking-tight leading-snug">
              Western defaults miss the gravy.
            </h2>
            <ul className="mt-6 space-y-4 text-[14px] leading-relaxed text-white/85">
              {[
                "Cuisine-aware prompts for wok oil, coconut milk, sambal, and shared plates.",
                "Library built around Asian dishes first — not an afterthought tag.",
                "Edit anything. Teach the model when it almost gets it right.",
                "Daily summary: calories, water, rest, energy — with plain recommendations.",
              ].map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="text-white font-bold shrink-0">✓</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/library"
              className="mt-8 inline-flex h-11 items-center rounded-full bg-white px-5 text-[13px] font-semibold text-[#2f7a52] hover:bg-[#f0faf4] transition-colors"
            >
              Browse the library
            </Link>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="px-4 pb-6">
        <div className="mx-auto max-w-5xl grid sm:grid-cols-3 gap-3">
          {[
            {
              title: "Photo AI",
              body: "Point at the plate. Get a dish title and macros you can trust enough to edit.",
            },
            {
              title: "Asian library",
              body: "1000+ dishes and counting — from thali to tom yum to Taiwanese bentos.",
            },
            {
              title: "Daily picture",
              body: "Not only calories. Water, sleep, energy, and a short “how’d today go?”",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-[#1a1814]/[0.06] bg-white/50 px-5 py-5 hover:bg-white/80 transition-colors"
            >
              <h3 className="font-semibold text-[15px] tracking-tight">{f.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-[#1a1814]/55">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing — food collage soft background */}
      <section id="pricing" className="relative px-4 py-14 sm:py-16 scroll-mt-16 overflow-hidden">
        {/* Collage at ~70% opacity, washed so cards stay readable */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute inset-0 grid grid-cols-3 sm:grid-cols-6 opacity-70">
            {HERO.map((item) => (
              <div key={item.src} className="relative min-h-[140px] sm:min-h-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <div className="absolute inset-0 bg-[#f7f2ea]/82" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f7f2ea] via-transparent to-[#f7f2ea]" />
        </div>
        <div className="relative mx-auto max-w-5xl">
          <div className="text-center max-w-lg mx-auto mb-8">
            <SectionLabel>Pricing</SectionLabel>
            <h2 className="mt-2 text-[1.65rem] sm:text-[1.9rem] font-semibold tracking-tight">
              Start free. Go Pro when the plate gets daily.
            </h2>
            <p className="text-[15px] text-[#1a1814]/50 mt-2 leading-snug">
              Full Asian library on every plan. Pro unlocks unlimited AI scans.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
            <div className="rounded-3xl border border-[#1a1814]/[0.08] bg-white/95 backdrop-blur-sm p-6 flex flex-col shadow-sm">
              <div className="text-[12px] font-semibold uppercase tracking-wide text-[#1a1814]/40">
                Free
              </div>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-[2.25rem] font-semibold tracking-tight">$0</span>
                <span className="text-[13px] text-[#1a1814]/40">forever</span>
              </div>
              <p className="text-[13px] text-[#1a1814]/50 mt-2 leading-snug">
                Try photo logging and the full dish library without a card.
              </p>
              <ul className="mt-5 space-y-2.5 text-[13px] text-[#1a1814]/70 flex-1">
                {[
                  "5 AI photo / text scans per week",
                  "Unlimited manual & library logging",
                  "Full Asian food library",
                  "Progress, history & meal reminders",
                ].map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="text-[#3d8f5c] font-bold shrink-0">✓</span>
                    {x}
                  </li>
                ))}
              </ul>
              <Link
                href="/app"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#3d8f5c] text-white text-[13px] font-semibold hover:bg-[#4aa56c] transition-colors"
              >
                Try free
              </Link>
            </div>

            <div className="rounded-3xl border-2 border-[#3d8f5c] bg-white p-6 flex flex-col relative shadow-[0_16px_40px_-18px_rgba(61,143,92,0.4)]">
              <div className="absolute -top-2.5 right-5 rounded-full bg-[#3d8f5c] text-white text-[10px] font-semibold uppercase tracking-wide px-2.5 py-0.5">
                Popular
              </div>
              <div className="text-[12px] font-semibold uppercase tracking-wide text-[#3d8f5c]">
                Pro
              </div>
              <div className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="inline-flex items-baseline gap-1">
                  <span className="text-[2.25rem] font-semibold tracking-tight">$3.99</span>
                  <span className="text-[13px] text-[#1a1814]/40">/ month</span>
                </span>
                <span className="text-[13px] text-[#1a1814]/25">or</span>
                <span className="inline-flex items-baseline gap-1">
                  <span className="text-[2.25rem] font-semibold tracking-tight">$35</span>
                  <span className="text-[13px] text-[#1a1814]/40">/ year</span>
                </span>
              </div>
              <p className="text-[13px] text-[#1a1814]/50 mt-2 leading-snug">
                Unlimited AI for everyday Asian plates.
              </p>
              <p className="text-[12px] font-medium text-[#3d8f5c] mt-1">
                Yearly saves $12.88 (27%) vs $3.99 × 12
              </p>
              <ul className="mt-5 space-y-2.5 text-[13px] text-[#1a1814]/70 flex-1">
                {[
                  "Unlimited AI photo & text analysis",
                  "Everything in Free",
                  "Priority dish suggestions to the library",
                  "Priority email support",
                ].map((x) => (
                  <li key={x} className="flex gap-2">
                    <span className="text-[#3d8f5c] font-bold shrink-0">✓</span>
                    {x}
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#3d8f5c] text-white text-[13px] font-semibold hover:bg-[#4aa56c] transition-colors"
              >
                Get Pro
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Install */}
      <section className="px-4 pb-14">
        <div className="mx-auto max-w-5xl rounded-3xl border border-[#1a1814]/[0.06] bg-white/60 p-6 sm:p-8">
          <div className="grid sm:grid-cols-2 gap-6 items-center">
            <div>
              <SectionLabel>On your phone</SectionLabel>
              <h2 className="mt-2 text-[1.4rem] font-semibold tracking-tight">
                Install as an app in a minute
              </h2>
              <p className="mt-2 text-[14px] text-[#1a1814]/55 leading-relaxed">
                Works as a PWA — home-screen icon, full-screen feel, no store wait.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 text-[13px]">
              <div className="rounded-2xl border border-[#1a1814]/[0.06] bg-[#f7f2ea]/80 px-3.5 py-3">
                <div className="font-semibold text-[#1a1814]/80">iPhone</div>
                <p className="mt-1 text-[#1a1814]/50 leading-snug">
                  Safari → Share → Add to Home Screen
                </p>
              </div>
              <div className="rounded-2xl border border-[#1a1814]/[0.06] bg-[#f7f2ea]/80 px-3.5 py-3">
                <div className="font-semibold text-[#1a1814]/80">Android</div>
                <p className="mt-1 text-[#1a1814]/50 leading-snug">
                  Chrome → menu → Install app / Add to Home screen
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-4 pb-16">
        <div className="mx-auto max-w-5xl rounded-[2rem] bg-[#2f7a52] text-white px-6 py-12 sm:py-14 text-center relative overflow-hidden">
          <div
            className="pointer-events-none absolute -top-16 right-0 h-48 w-48 rounded-full bg-[#3d8f5c]/25 blur-3xl"
            aria-hidden
          />
          <h2 className="relative text-[1.75rem] sm:text-[2.1rem] font-semibold tracking-tight">
            Ready when the next meal is.
          </h2>
          <p className="relative mt-3 text-[15px] text-white/75 max-w-md mx-auto">
            Snap, type, or re-log. Built for how Asia eats.
          </p>
          <Link
            href="/app"
            className="relative mt-7 inline-flex h-12 px-8 items-center rounded-full bg-white text-[#2f7a52] text-[14px] font-semibold hover:bg-[#f0faf4] transition-colors"
          >
            Open RiceTrack
          </Link>
        </div>
      </section>

      <footer className="px-4 py-8 border-t border-[#1a1814]/[0.06] text-[12px] text-[#1a1814]/45">
        <div className="mx-auto max-w-5xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
            <div className="space-y-1.5 max-w-xs">
              <div className="flex items-center gap-1.5 text-[15px] font-semibold text-[#1a1814]/70">
                <RiceLogo size={20} />
                RiceTrack
              </div>
              <p className="leading-relaxed text-[13px]">
                Asia-first calorie tracking. Estimates only, not medical advice. 1000+ dishes and
                counting, updated weekly.
              </p>
              <p className="pt-1">
                Support:{" "}
                <a
                  href="mailto:chiefsupportofficer@gmail.com"
                  className="text-[#3d8f5c] font-medium hover:underline"
                >
                  chiefsupportofficer@gmail.com
                </a>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-8 text-[13px]">
              <div className="space-y-1.5">
                <div className="font-semibold text-[#1a1814]/45 uppercase tracking-wide text-[11px]">
                  Product
                </div>
                <Link href="/app" className="block hover:text-[#1a1814]">
                  Open app
                </Link>
                <Link href="/library" className="block hover:text-[#1a1814]">
                  Food library
                </Link>
                <Link href="/pricing" className="block hover:text-[#1a1814]">
                  Pricing
                </Link>
                <Link href="/login" className="block hover:text-[#1a1814]">
                  Sign in
                </Link>
              </div>
              <div className="space-y-1.5">
                <div className="font-semibold text-[#1a1814]/45 uppercase tracking-wide text-[11px]">
                  Legal
                </div>
                <Link href="/terms" className="block hover:text-[#1a1814]">
                  Terms
                </Link>
                <Link href="/privacy" className="block hover:text-[#1a1814]">
                  Privacy
                </Link>
                <Link href="/disclaimer" className="block hover:text-[#1a1814]">
                  Disclaimer
                </Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between gap-1 pt-4 border-t border-[#1a1814]/[0.06] text-[12px]">
            <span>© {new Date().getFullYear()} RiceTrack</span>
            <span className="text-[#1a1814]/30">Built for Asian plates first</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
