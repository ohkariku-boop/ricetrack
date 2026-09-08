import Link from "next/link";

/** Unsplash License — free commercial use */
const FOOD = [
  {
    src: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=900&q=80",
    alt: "Ramen",
  },
  {
    src: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?auto=format&fit=crop&w=900&q=80",
    alt: "Pho",
  },
  {
    src: "https://images.unsplash.com/photo-1559314809-0d155014e69e?auto=format&fit=crop&w=900&q=80",
    alt: "Pad Thai",
  },
  {
    src: "https://images.unsplash.com/photo-1496116218417-1a781b1c416f?auto=format&fit=crop&w=900&q=80",
    alt: "Dumplings",
  },
  {
    src: "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=80",
    alt: "Rice meal",
  },
  {
    src: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80",
    alt: "Fried rice",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f6f3ee] text-[#1a1814]">
      <header className="fixed top-0 inset-x-0 z-50 border-b border-[#1a1814]/8 bg-[#f6f3ee]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="text-[13px] tracking-[0.2em] uppercase font-medium">
            RiceTrack
          </Link>
          <nav className="hidden sm:flex items-center gap-8 text-[13px] text-[#1a1814]/55">
            <a href="#easy" className="hover:text-[#1a1814]">
              Easy
            </a>
            <a href="#accuracy" className="hover:text-[#1a1814]">
              Accuracy
            </a>
            <Link href="/library" className="hover:text-[#1a1814]">
              Library
            </Link>
          </nav>
          <Link href="/app" className="text-[13px] font-medium text-[#2d5a3d]">
            Open →
          </Link>
        </div>
      </header>

      {/* HERO — text + visible food mosaic */}
      <section className="pt-24 sm:pt-28 pb-16 px-6 sm:px-10">
        <div className="mx-auto max-w-[1400px] grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <p className="text-[11px] tracking-[0.25em] uppercase text-[#1a1814]/45">
              Asia-first nutrition · Photo AI · 1000+ dishes
            </p>
            <h1 className="font-medium tracking-[-0.04em] leading-[0.95] text-[clamp(2.5rem,7vw,4.75rem)]">
              Easy to use.
              <br />
              Hard to fool
              <br />
              <span className="text-[#2d5a3d]">on Asian food.</span>
            </h1>
            <p className="text-[16px] leading-relaxed text-[#1a1814]/55 max-w-md">
              Snap a plate or type what you ate. Built for rice bowls, noodles, curry,
              hawker sets, and home cooking — not Western defaults.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/app"
                className="inline-flex items-center justify-center h-13 px-8 rounded-full bg-[#1a1814] text-[#f6f3ee] text-sm font-medium hover:bg-[#2d5a3d] transition-colors h-12"
              >
                Try free
              </Link>
              <Link
                href="/library"
                className="inline-flex items-center justify-center h-12 px-8 rounded-full border border-[#1a1814]/20 text-sm hover:border-[#1a1814]/40 transition-colors"
              >
                Browse library
              </Link>
            </div>
          </div>

          {/* Collage — clearly visible mosaic */}
          <div className="relative">
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {/* Tall left */}
              <div className="col-span-1 row-span-2 relative rounded-2xl overflow-hidden aspect-[3/5] sm:aspect-[3/4] shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={FOOD[0].src} alt={FOOD[0].alt} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              {/* Top middle */}
              <div className="col-span-1 relative rounded-2xl overflow-hidden aspect-square shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={FOOD[1].src} alt={FOOD[1].alt} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              {/* Top right */}
              <div className="col-span-1 relative rounded-2xl overflow-hidden aspect-square shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={FOOD[2].src} alt={FOOD[2].alt} className="absolute inset-0 w-full h-full object-cover" />
              </div>
              {/* Bottom middle-wide */}
              <div className="col-span-2 relative rounded-2xl overflow-hidden aspect-[2/1] shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={FOOD[3].src} alt={FOOD[3].alt} className="absolute inset-0 w-full h-full object-cover" />
              </div>
            </div>
            {/* Overlapping accent card */}
            <div className="absolute -bottom-4 -left-2 sm:-left-6 w-[42%] rounded-2xl overflow-hidden shadow-2xl border-4 border-[#f6f3ee] rotate-[-4deg] aspect-[4/3]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={FOOD[4].src} alt={FOOD[4].alt} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -top-3 -right-2 sm:-right-4 w-[28%] rounded-xl overflow-hidden shadow-xl border-4 border-[#f6f3ee] rotate-[6deg] aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={FOOD[5].src} alt={FOOD[5].alt} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Full-width food band */}
      <section className="mt-8 sm:mt-12">
        <div className="grid grid-cols-2 sm:grid-cols-4 h-40 sm:h-56">
          {FOOD.slice(0, 4).map((f) => (
            <div key={f.alt} className="relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={f.src} alt={f.alt} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      <section id="easy" className="px-6 sm:px-10 py-24 border-t border-[#1a1814]/8">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#1a1814]/40 mb-6">Easy & fun</p>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-[-0.03em] max-w-xl mb-14">
            Snap, type, or re-log — built for how Asia eats.
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              ["Snap", "Photo AI tuned for wok oil, sauces, and shared plates."],
              ["Type", "半碗米饭 + 麻婆豆腐 — any language."],
              ["Library", "1,000+ regional dishes ready to log."],
            ].map(([t, d]) => (
              <div key={t}>
                <h3 className="text-xl font-medium text-[#2d5a3d] mb-2">{t}</h3>
                <p className="text-[15px] text-[#1a1814]/50 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="accuracy" className="px-6 sm:px-10 py-24 bg-[#ebe6dc]/40 border-t border-[#1a1814]/8">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#1a1814]/40 mb-6">Why RiceTrack</p>
          <h2 className="text-3xl sm:text-4xl font-medium tracking-[-0.03em] max-w-2xl mb-12">
            Accuracy for Asian plates — free core loop.
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              "Cuisine-aware AI",
              "Editable macros",
              "Hidden oil / sauce flags",
              "Recents & templates",
              "Manual calorie targets",
              "Soft balance + undo",
            ].map((t) => (
              <div key={t} className="rounded-2xl border border-[#1a1814]/8 bg-[#f6f3ee] px-5 py-4 font-medium text-sm">
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 sm:px-10 py-28 text-center">
        <h2 className="text-3xl sm:text-5xl font-medium tracking-[-0.04em] max-w-xl mx-auto">
          Start with the meal in front of you.
        </h2>
        <Link
          href="/app"
          className="mt-10 inline-flex h-12 px-10 items-center rounded-full bg-[#1a1814] text-[#f6f3ee] text-sm hover:bg-[#2d5a3d] transition-colors"
        >
          Open RiceTrack
        </Link>
      </section>

      <footer className="px-6 sm:px-10 py-8 border-t border-[#1a1814]/8 text-[12px] text-[#1a1814]/40 flex flex-col sm:flex-row justify-between gap-4 max-w-[1400px] mx-auto">
        <span>© {new Date().getFullYear()} RiceTrack · Food photos via Unsplash</span>
        <div className="flex gap-6">
          <Link href="/app">App</Link>
          <Link href="/library">Library</Link>
          <Link href="/login">Sign in</Link>
        </div>
      </footer>
    </div>
  );
}
