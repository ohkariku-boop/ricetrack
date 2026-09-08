import Link from "next/link";

/**
 * Art direction: editorial paper + ink, with a floating Asian food photo collage.
 * Photos: Unsplash License (free commercial use).
 */

const PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&q=80&auto=format&fit=crop",
    alt: "Japanese ramen bowl",
    className: "top-[8%] left-[4%] w-[38%] sm:w-[28%] rotate-[-6deg] z-[1]",
  },
  {
    src: "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&q=80&auto=format&fit=crop",
    alt: "Vietnamese pho",
    className: "top-[12%] right-[2%] w-[42%] sm:w-[30%] rotate-[5deg] z-[2]",
  },
  {
    src: "https://images.unsplash.com/photo-1559314809-0d155014e69e?w=800&q=80&auto=format&fit=crop",
    alt: "Pad Thai",
    className: "top-[42%] left-[8%] w-[36%] sm:w-[26%] rotate-[3deg] z-[3]",
  },
  {
    src: "https://images.unsplash.com/photo-1496116218417-1a781b1c416f?w=800&q=80&auto=format&fit=crop",
    alt: "Dumplings",
    className: "top-[48%] right-[8%] w-[34%] sm:w-[24%] rotate-[-4deg] z-[2]",
  },
  {
    src: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80&auto=format&fit=crop",
    alt: "Asian rice meal",
    className: "bottom-[6%] left-[28%] w-[40%] sm:w-[28%] rotate-[2deg] z-[4]",
  },
  {
    src: "https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=600&q=80&auto=format&fit=crop",
    alt: "Sushi",
    className: "bottom-[18%] left-[2%] w-[28%] sm:w-[18%] rotate-[-8deg] z-[1] hidden sm:block",
  },
  {
    src: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&q=80&auto=format&fit=crop",
    alt: "Fried rice",
    className: "bottom-[22%] right-[2%] w-[30%] sm:w-[20%] rotate-[7deg] z-[1] hidden sm:block",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f6f3ee] text-[#1a1814] selection:bg-[#2d5a3d]/20">
      {/* Nav — solid on light */}
      <header className="fixed top-0 inset-x-0 z-50 border-b border-[#1a1814]/5 bg-[#f6f3ee]/85 backdrop-blur-xl">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 h-16 flex items-center justify-between">
          <Link href="/" className="text-[13px] tracking-[0.2em] uppercase font-medium">
            RiceTrack
          </Link>
          <nav className="hidden sm:flex items-center gap-10 text-[13px] tracking-wide text-[#1a1814]/55">
            <a href="#easy" className="hover:text-[#1a1814] transition-colors">
              Easy
            </a>
            <a href="#accuracy" className="hover:text-[#1a1814] transition-colors">
              Accuracy
            </a>
            <Link href="/library" className="hover:text-[#1a1814] transition-colors">
              Library
            </Link>
          </nav>
          <Link
            href="/app"
            className="text-[13px] tracking-wide text-[#2d5a3d] font-medium hover:opacity-70 transition-opacity"
          >
            Open →
          </Link>
        </div>
      </header>

      {/* Hero with photo collage */}
      <section className="relative min-h-[100svh] pt-16 overflow-hidden">
        {/* Collage layer */}
        <div className="absolute inset-0 pointer-events-none select-none" aria-hidden>
          {/* Soft wash so type stays readable */}
          <div className="absolute inset-0 bg-[#f6f3ee]/40 z-[5]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#f6f3ee] via-transparent to-[#f6f3ee] z-[5]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#f6f3ee]/90 via-transparent to-[#f6f3ee]/80 z-[5]" />

          {PHOTOS.map((p) => (
            <div
              key={p.src}
              className={`absolute overflow-hidden rounded-sm shadow-[0_20px_50px_-12px_rgba(26,24,20,0.35)] border border-[#1a1814]/10 ${p.className}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.src}
                alt=""
                className="w-full h-full object-cover aspect-[4/5] opacity-90"
                loading="eager"
              />
            </div>
          ))}
        </div>

        {/* Hero copy */}
        <div className="relative z-10 min-h-[calc(100svh-4rem)] flex flex-col justify-end px-6 sm:px-10 pb-16 sm:pb-20">
          <div className="mx-auto max-w-[1400px] w-full">
            <p className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#1a1814]/50 mb-6 sm:mb-8">
              Asia-first nutrition · Photo AI · Open library
            </p>

            <h1 className="font-medium tracking-[-0.04em] leading-[0.92] text-[clamp(2.6rem,10vw,7.5rem)] max-w-[14ch]">
              Easy to use.
              <br />
              Hard to fool
              <br />
              <em className="not-italic text-[#2d5a3d]">on Asian food.</em>
            </h1>

            <div className="mt-10 sm:mt-14 flex flex-col sm:flex-row sm:items-end justify-between gap-8 max-w-3xl">
              <p className="text-[15px] sm:text-base leading-relaxed text-[#1a1814]/60 max-w-md backdrop-blur-[2px]">
                Snap a plate or type what you ate. Cuisine-aware AI plus a 1,000+ dish library —
                rice bowls, noodles, curry, hawker sets, and home cooking across Asia.
              </p>
              <Link href="/app" className="group inline-flex items-center gap-3 self-start sm:self-auto">
                <span className="h-14 w-14 rounded-full border border-[#1a1814]/20 bg-[#f6f3ee]/80 flex items-center justify-center group-hover:bg-[#1a1814] group-hover:text-[#f6f3ee] transition-colors duration-300 shadow-sm">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
                <span className="text-sm tracking-wide">Try free</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Easy */}
      <section id="easy" className="relative z-10 px-6 sm:px-10 py-24 sm:py-28 border-t border-[#1a1814]/8 bg-[#f6f3ee]">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#1a1814]/40 mb-6">Easy & fun</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.03em] max-w-2xl leading-[1.1] mb-16">
            Logging should feel like a game, not homework.
          </h2>
          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {[
              { t: "Snap", d: "One photo of the plate. Cuisine hint optional. Built for wok oil and shared dishes." },
              { t: "Type", d: "半碗米饭 + 麻婆豆腐. Any language. Same accurate macros." },
              { t: "Re-log", d: "Recent meals and templates — chicken rice, pho, nasi lemak in one tap." },
            ].map((s) => (
              <div key={s.t} className="space-y-3">
                <h3 className="text-2xl font-medium tracking-tight text-[#2d5a3d]">{s.t}</h3>
                <p className="text-[15px] leading-[1.7] text-[#1a1814]/50 max-w-xs">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Photo strip — full bleed secondary collage */}
      <section className="relative h-[42vw] min-h-[220px] max-h-[420px] overflow-hidden border-y border-[#1a1814]/8">
        <div className="absolute inset-0 flex">
          {[
            "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=75&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&q=75&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1559314809-0d155014e69e?w=600&q=75&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1496116218417-1a781b1c416f?w=600&q=75&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=600&q=75&auto=format&fit=crop",
          ].map((src) => (
            <div key={src} className="flex-1 relative min-w-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
        <div className="absolute inset-0 bg-[#1a1814]/25" />
        <div className="absolute inset-0 flex items-center justify-center px-6">
          <p className="text-[#f6f3ee] text-center text-xl sm:text-3xl md:text-4xl font-medium tracking-[-0.03em] max-w-2xl drop-shadow-lg">
            From ramen to rendang — counted the way Asia cooks.
          </p>
        </div>
      </section>

      {/* Accuracy */}
      <section id="accuracy" className="px-6 sm:px-10 py-24 sm:py-32 bg-[#ebe6dc]/50">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#1a1814]/40 mb-6">Accuracy stack</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.03em] max-w-3xl leading-[1.1] mb-6">
            Highest signal for Asian plates — by design
          </h2>
          <p className="text-[15px] text-[#1a1814]/50 max-w-2xl leading-relaxed mb-14">
            Cuisine-aware vision, portion language (半碗, 1 碟), oil and sauce flags, plus a growing
            regional library grounded toward official tables.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              ["Cuisine-aware AI", "Wok oil, coconut milk, shared plates — not salad-bowl defaults."],
              ["1,000+ dish library", "China to Sri Lanka, hawker sets to home thalis."],
              ["You correct", "Edit every macro. Confidence shown. Never locked numbers."],
              ["Photo + type", "Snap or describe in any language."],
              ["Recents & templates", "Re-log chicken rice in one tap."],
              ["Soft balance", "Went over? Spread gently — always undoable."],
            ].map(([t, d]) => (
              <div key={t} className="rounded-2xl border border-[#1a1814]/8 bg-[#f6f3ee] p-6 space-y-2">
                <h3 className="font-medium tracking-tight">{t}</h3>
                <p className="text-sm leading-relaxed text-[#1a1814]/50">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 sm:px-10 py-28 sm:py-36">
        <div className="mx-auto max-w-[1400px] text-center">
          <h2 className="text-3xl sm:text-5xl font-medium tracking-[-0.04em] leading-[1.05] max-w-2xl mx-auto">
            Playful to open. Precise when it counts.
          </h2>
          <p className="mt-6 text-[15px] text-[#1a1814]/45 max-w-md mx-auto">
            Free on the web. No city lock. Core photo & text loop unlocked.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/app"
              className="inline-flex items-center justify-center h-14 px-10 rounded-full bg-[#1a1814] text-[#f6f3ee] text-sm tracking-wide hover:bg-[#2d5a3d] transition-colors"
            >
              Open RiceTrack
            </Link>
            <Link
              href="/library"
              className="inline-flex items-center justify-center h-14 px-10 rounded-full border border-[#1a1814]/15 text-sm tracking-wide hover:border-[#1a1814]/40 transition-colors"
            >
              Food library
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-6 sm:px-10 py-10 border-t border-[#1a1814]/8">
        <div className="mx-auto max-w-[1400px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-[12px] tracking-wide text-[#1a1814]/40">
          <span>© {new Date().getFullYear()} RiceTrack · Photos via Unsplash</span>
          <div className="flex gap-8">
            <Link href="/app" className="hover:text-[#1a1814] transition-colors">
              App
            </Link>
            <Link href="/library" className="hover:text-[#1a1814] transition-colors">
              Library
            </Link>
            <Link href="/login" className="hover:text-[#1a1814] transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
