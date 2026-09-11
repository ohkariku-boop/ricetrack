import Link from "next/link";
import { RiceLogo } from "@/components/RiceLogo";

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
  { src: "/food/japanese2.jpg", cuisine: "Japanese" },
  { src: "/food/taiwan.jpg", cuisine: "Taiwanese" },
  { src: "/food/pho.jpg", cuisine: "Vietnamese" },
  { src: "/food/indian-curry.jpg", cuisine: "Indian" },
];

function MarqueeStrip() {
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <section className="relative overflow-hidden border-y border-[#1a1814]/8" aria-label="Cuisines across Asia">
      <div className="marquee-track flex w-max gap-0">
        {items.map((item, i) => (
          <div
            key={`${item.cuisine}-${i}`}
            className="relative shrink-0 w-[132px] sm:w-[156px] h-[84px] sm:h-[96px] overflow-hidden"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.cuisine}
              className="absolute inset-0 w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-[#1a1814]/30" />
            <span className="absolute inset-0 flex items-center justify-center text-[12px] sm:text-[13px] font-semibold tracking-wide text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              {item.cuisine}
            </span>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#f6f3ee] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#f6f3ee] to-transparent z-10" />
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f6f3ee] text-[#1a1814] antialiased">
      <header className="sticky top-0 z-40 border-b border-[#1a1814]/8 bg-[#f6f3ee]/90 backdrop-blur-md">
        <div className="mx-auto max-w-5xl px-4 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-semibold text-[15px] tracking-tight">
            <RiceLogo size={22} />
            RiceTrack
          </Link>
          <nav className="hidden sm:flex items-center gap-5 text-[14px] text-[#1a1814]/55">
            <a href="#how" className="hover:text-[#1a1814]">
              How
            </a>
            <a href="#why" className="hover:text-[#1a1814]">
              Why
            </a>
            <Link href="/library" className="hover:text-[#1a1814]">
              Library
            </Link>
          </nav>
          <Link
            href="/app"
            className="text-[13px] font-semibold text-[#3d8f5c] hover:text-[#2d6b45]"
          >
            Open app
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 pt-7 pb-5 sm:pt-10 sm:pb-6">
        <div className="mx-auto max-w-5xl grid lg:grid-cols-2 gap-5 lg:gap-8 items-center">
          <div className="space-y-3 order-2 lg:order-1">
            <p className="text-[11px] tracking-[0.16em] uppercase text-[#1a1814]/45 font-medium">
              Asia-first · Photo AI · 1000+ dishes and counting, updated weekly
            </p>
            <h1 className="font-semibold tracking-[-0.035em] leading-[1.02] text-[clamp(2.1rem,5.4vw,3.25rem)]">
              Easy to use.
              <br />
              Hard to fool
              <br />
              <span className="text-[#3d8f5c]">on Asian food.</span>
            </h1>
            <p className="text-[15px] leading-snug text-[#1a1814]/55 max-w-sm">
              Snap or type rice bowls, noodles, curry, hawker sets. Not Western defaults.
            </p>
            <div className="flex flex-wrap gap-2 pt-0.5">
              <Link
                href="/app"
                className="inline-flex h-10 px-6 items-center rounded-full bg-[#1a1814] text-[#f6f3ee] text-[13px] font-semibold hover:bg-[#3d8f5c] transition-colors"
              >
                Try free
              </Link>
              <Link
                href="/library"
                className="inline-flex h-10 px-6 items-center rounded-full border border-[#1a1814]/12 text-[13px] font-medium hover:border-[#1a1814]/30 transition-colors"
              >
                Library
              </Link>
            </div>
            <div className="pt-1 max-w-md">
              <p className="text-[11px] font-semibold text-[#1a1814]/40 uppercase tracking-wide mb-1.5">
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

          <div className="relative order-1 lg:order-2">
            <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
              <div className="col-span-1 row-span-2 rounded-lg overflow-hidden shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={HERO[0].src}
                  alt={HERO[0].alt}
                  className="w-full h-full object-cover aspect-[3/5]"
                  width={360}
                  height={600}
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={HERO[1].src}
                  alt={HERO[1].alt}
                  className="w-full object-cover aspect-square"
                  width={280}
                  height={280}
                />
              </div>
              <div className="rounded-lg overflow-hidden shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={HERO[2].src}
                  alt={HERO[2].alt}
                  className="w-full object-cover aspect-square"
                  width={280}
                  height={280}
                />
              </div>
              <div className="col-span-2 rounded-lg overflow-hidden shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={HERO[3].src}
                  alt={HERO[3].alt}
                  className="w-full object-cover aspect-[2/1]"
                  width={560}
                  height={280}
                />
              </div>
            </div>
            <div className="mt-1 grid grid-cols-2 gap-1 sm:gap-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HERO[4].src}
                alt={HERO[4].alt}
                className="w-full object-cover aspect-[2/1] rounded-lg shadow-sm"
                width={280}
                height={140}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HERO[5].src}
                alt={HERO[5].alt}
                className="w-full object-cover aspect-[2/1] rounded-lg shadow-sm"
                width={280}
                height={140}
              />
            </div>
          </div>
        </div>
      </section>

      <MarqueeStrip />

      {/* How */}
      <section id="how" className="px-4 py-8 sm:py-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-[11px] tracking-[0.16em] uppercase text-[#1a1814]/40 font-medium mb-1.5">
            How it works
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight mb-1">
            Snap, type, or re-log. Built for how Asia eats.
          </h2>
          <p className="text-[14px] text-[#1a1814]/45 mb-4 max-w-lg">
            Three ways in. One honest macro log out.
          </p>
          <div className="grid sm:grid-cols-3 gap-2">
            {[
              { t: "Snap", d: "Photo the whole plate. Rice, sides, oil, egg." },
              { t: "Type", d: "Any language. Nasi lemak, 麻婆豆腐, phở." },
              { t: "Re-log", d: "Recents and templates for daily plates." },
            ].map((x) => (
              <div
                key={x.t}
                className="rounded-xl border border-[#1a1814]/8 bg-white/60 px-3.5 py-3"
              >
                <div className="text-[15px] font-semibold mb-0.5">{x.t}</div>
                <p className="text-[13px] text-[#1a1814]/55 leading-snug">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why */}
      <section id="why" className="px-4 py-8 sm:py-10 bg-[#ebe6dc]/60 border-y border-[#1a1814]/8">
        <div className="mx-auto max-w-5xl">
          <p className="text-[11px] tracking-[0.16em] uppercase text-[#1a1814]/40 font-medium mb-1.5">
            Why RiceTrack
          </p>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight max-w-md mb-4">
            Built for Asian plates. Free core loop.
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {[
              "Cuisine-aware AI",
              "Editable macros",
              "Oil and sauce flags",
              "Recents and templates",
              "Daily targets",
              "1000+ dish library",
            ].map((t) => (
              <div
                key={t}
                className="rounded-lg border border-[#1a1814]/8 bg-[#f6f3ee] px-3 py-2.5 text-[14px] font-medium"
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 py-10 sm:py-12 text-center">
        <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
          Start with the meal in front of you.
        </h2>
        <Link
          href="/app"
          className="mt-4 inline-flex h-10 px-8 items-center rounded-full bg-[#1a1814] text-[#f6f3ee] text-[13px] font-semibold hover:bg-[#3d8f5c] transition-colors"
        >
          Open RiceTrack
        </Link>
      </section>

      <footer className="px-4 py-7 border-t border-[#1a1814]/8 text-[12px] text-[#1a1814]/45">
        <div className="mx-auto max-w-5xl flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div className="space-y-1 max-w-xs">
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
            <div className="grid grid-cols-2 gap-6 text-[13px]">
              <div className="space-y-1.5">
                <div className="font-semibold text-[#1a1814]/50 uppercase tracking-wide text-[10px]">
                  Product
                </div>
                <Link href="/app" className="block hover:text-[#1a1814]">
                  Open app
                </Link>
                <Link href="/library" className="block hover:text-[#1a1814]">
                  Food library
                </Link>
                <Link href="/login" className="block hover:text-[#1a1814]">
                  Sign in
                </Link>
              </div>
              <div className="space-y-1.5">
                <div className="font-semibold text-[#1a1814]/50 uppercase tracking-wide text-[10px]">
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
          <div className="flex flex-col sm:flex-row justify-between gap-1 pt-3 border-t border-[#1a1814]/8 text-[11px]">
            <span>© {new Date().getFullYear()} RiceTrack</span>
            <span className="text-[#1a1814]/35">Built for Asian plates first</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
