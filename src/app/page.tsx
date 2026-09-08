import Link from "next/link";

/**
 * RiceTrack promotional site
 * Art direction: editorial paper + ink.
 * Positioning: Asia plate literacy — not Western photo apps, not single-city restaurant engines.
 */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f6f3ee] text-[#1a1814] selection:bg-[#2d5a3d]/20">
      <header className="fixed top-0 inset-x-0 z-50 mix-blend-difference">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 h-16 flex items-center justify-between text-[#f6f3ee]">
          <Link href="/" className="text-[13px] tracking-[0.2em] uppercase font-medium">
            RiceTrack
          </Link>
          <nav className="hidden sm:flex items-center gap-10 text-[13px] tracking-wide">
            <a href="#difference" className="opacity-70 hover:opacity-100 transition-opacity">
              Difference
            </a>
            <a href="#method" className="opacity-70 hover:opacity-100 transition-opacity">
              Method
            </a>
            <Link href="/library" className="opacity-70 hover:opacity-100 transition-opacity">
              Library
            </Link>
          </nav>
          <Link
            href="/app"
            className="text-[13px] tracking-wide opacity-90 hover:opacity-100 transition-opacity"
          >
            Open →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[100svh] flex flex-col justify-end px-6 sm:px-10 pb-16 sm:pb-20 pt-28">
        <div className="mx-auto max-w-[1400px] w-full">
          <p className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#1a1814]/45 mb-8 sm:mb-12">
            Asia-first nutrition · Photo AI · Open library
          </p>

          <h1 className="font-medium tracking-[-0.04em] leading-[0.92] text-[clamp(2.75rem,11vw,8.5rem)] max-w-[16ch]">
            Built for
            <br />
            the plate,
            <br />
            <em className="not-italic text-[#2d5a3d]">not the city.</em>
          </h1>

          <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-8 max-w-4xl">
            <p className="text-[15px] sm:text-base leading-relaxed text-[#1a1814]/55 max-w-md">
              Restaurant apps know a few hundred partner menus. Western photo apps
              still think in sandwiches. RiceTrack reads rice, oil, sauce, noodles,
              and shared dishes — across the cuisines you actually cook and order.
            </p>
            <Link href="/app" className="group inline-flex items-center gap-3 self-start sm:self-auto">
              <span className="h-14 w-14 rounded-full border border-[#1a1814]/20 flex items-center justify-center group-hover:bg-[#1a1814] group-hover:text-[#f6f3ee] transition-colors duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
              <span className="text-sm tracking-wide">Begin free</span>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#1a1814]/10" />
      </section>

      {/* Difference — competitive clarity without naming competitors as enemies */}
      <section id="difference" className="px-6 sm:px-10 py-24 sm:py-32 border-b border-[#1a1814]/8">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#1a1814]/40 mb-16">
            Why this exists
          </p>

          <div className="grid lg:grid-cols-3 gap-12 lg:gap-10">
            <div className="space-y-4">
              <h2 className="text-xl font-medium tracking-tight">Photo apps</h2>
              <p className="text-[15px] leading-[1.75] text-[#1a1814]/50">
                Fast and fun. Often trained on Western plating. Weak on wok oil,
                coconut milk, banchan, and “one rice, three dishes.”
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-medium tracking-tight">Restaurant engines</h2>
              <p className="text-[15px] leading-[1.75] text-[#1a1814]/50">
                Excellent when your meal is on a partner menu in one city.
                Thin when you cook at home, travel, or order something off-list.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-medium tracking-tight text-[#2d5a3d]">RiceTrack</h2>
              <p className="text-[15px] leading-[1.75] text-[#1a1814]/70">
                Cuisine-aware vision for the plate itself. A growing pan-Asian dish
                library. Editable estimates — confidence shown, never faked.
              </p>
            </div>
          </div>

          <div className="mt-20 pt-16 border-t border-[#1a1814]/8 max-w-3xl">
            <h3 className="text-2xl sm:text-3xl font-medium tracking-[-0.02em] leading-snug">
              Our edge is not “more partners.”
              <span className="text-[#1a1814]/35">
                {" "}
                It is literacy for how Asia cooks — then the honesty to let you correct the model.
              </span>
            </h3>
          </div>
        </div>
      </section>

      {/* Method */}
      <section id="method" className="px-6 sm:px-10 py-24 sm:py-32 border-b border-[#1a1814]/8">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#1a1814]/40 mb-16">
            Method
          </p>
          <div className="grid md:grid-cols-3 gap-14 md:gap-10">
            {[
              {
                n: "01",
                t: "Snap the plate",
                d: "Home stir-fry, hawker tray, delivery box, shared hotpot. The model is biased toward Asian structure — not salad-bowl defaults.",
              },
              {
                n: "02",
                t: "See the risks",
                d: "Hidden oil, heavy sauce, coconut milk, fried batter. We surface uncertainty instead of inventing false precision.",
              },
              {
                n: "03",
                t: "Correct & keep",
                d: "Adjust portion and macros in one tap. Save to a diary with targets that fit your body — not a generic Western template.",
              },
            ].map((item) => (
              <div key={item.n} className="space-y-5">
                <span className="text-[11px] tracking-[0.15em] text-[#2d5a3d]">{item.n}</span>
                <h3 className="text-2xl font-medium tracking-tight">{item.t}</h3>
                <p className="text-[15px] leading-[1.7] text-[#1a1814]/50 max-w-xs">
                  {item.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="px-6 sm:px-10 py-28 sm:py-36 bg-[#1a1814] text-[#f6f3ee]">
        <div className="mx-auto max-w-[1400px]">
          <blockquote className="text-[clamp(1.6rem,4.5vw,3.25rem)] font-medium tracking-[-0.03em] leading-[1.2] max-w-4xl">
            Knowing the calories at one chain is useful.
            <span className="text-[#f6f3ee]/35">
              {" "}
              Knowing what your wok did to the vegetables is harder — and more often the truth.
            </span>
          </blockquote>
        </div>
      </section>

      {/* Library */}
      <section className="px-6 sm:px-10 py-24 sm:py-32 border-b border-[#1a1814]/8">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#1a1814]/40 mb-4">
                Library
              </p>
              <h2 className="text-3xl sm:text-4xl font-medium tracking-[-0.03em] max-w-lg">
                Named dishes across the region — not only one city’s partners
              </h2>
            </div>
            <Link
              href="/library"
              className="text-sm tracking-wide text-[#2d5a3d] hover:underline underline-offset-4 shrink-0"
            >
              Open catalog →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1a1814]/8 border border-[#1a1814]/8">
            {[
              ["Mapo Tofu", "Chinese", "320"],
              ["Tonkotsu Ramen", "Japanese", "650"],
              ["Nasi Lemak", "Malay", "600"],
              ["Bibimbap", "Korean", "550"],
              ["Pad Thai", "Thai", "550"],
              ["Pho Bo", "Vietnamese", "450"],
              ["Butter Chicken", "Indian", "490"],
              ["Chicken Rice", "Singaporean", "550"],
            ].map(([name, region, cal]) => (
              <div
                key={name}
                className="bg-[#f6f3ee] p-6 sm:p-8 hover:bg-[#ebe6dc] transition-colors duration-300"
              >
                <div className="text-sm font-medium tracking-tight">{name}</div>
                <div className="text-xs text-[#1a1814]/35 mt-1">{region}</div>
                <div className="mt-6 text-[13px] tabular-nums text-[#1a1814]/45">
                  {cal} <span className="text-[11px]">kcal</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Marquee */}
      <section className="py-20 overflow-hidden border-b border-[#1a1814]/8">
        <div className="flex whitespace-nowrap animate-[marquee_42s_linear_infinite] text-[clamp(1.75rem,5.5vw,3.5rem)] font-medium tracking-[-0.03em] text-[#1a1814]/12">
          <span className="mx-8">
            Chinese · Japanese · Korean · Thai · Vietnamese · Indian · Malay · Indonesian · Filipino · Singaporean · Taiwanese · Hong Kong ·
          </span>
          <span className="mx-8">
            Chinese · Japanese · Korean · Thai · Vietnamese · Indian · Malay · Indonesian · Filipino · Singaporean · Taiwanese · Hong Kong ·
          </span>
        </div>
      </section>

      {/* Roadmap honesty — 10x direction */}
      <section className="px-6 sm:px-10 py-24 sm:py-28 border-b border-[#1a1814]/8">
        <div className="mx-auto max-w-[1400px] grid lg:grid-cols-12 gap-12">
          <div className="lg:col-span-4">
            <p className="text-[11px] tracking-[0.2em] uppercase text-[#1a1814]/40 sticky top-24">
              Where we go next
            </p>
          </div>
          <div className="lg:col-span-8 space-y-8 max-w-xl">
            <p className="text-[15px] leading-[1.75] text-[#1a1814]/55">
              Decision engines for dining out are valuable. Recovery tools for messy
              weeks are valuable. We will add both — without abandoning the hard
              problem: <strong className="font-medium text-[#1a1814]">accurate Asian plates</strong> when
              there is no partner menu to lean on.
            </p>
            <ul className="space-y-3 text-[15px] text-[#1a1814]/55">
              <li className="flex gap-3">
                <span className="text-[#2d5a3d]">→</span>
                Deeper library + user-corrected dishes
              </li>
              <li className="flex gap-3">
                <span className="text-[#2d5a3d]">→</span>
                Delivery screenshot & menu photo logging
              </li>
              <li className="flex gap-3">
                <span className="text-[#2d5a3d]">→</span>
                Calm recovery when you go over (no guilt spiral)
              </li>
              <li className="flex gap-3">
                <span className="text-[#2d5a3d]">→</span>
                “What fits the rest of my day?” suggestions
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 sm:px-10 py-28 sm:py-36">
        <div className="mx-auto max-w-[1400px] text-center">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.04em] leading-[1.05] max-w-3xl mx-auto">
            Start with the meal in front of you.
          </h2>
          <p className="mt-6 text-[15px] text-[#1a1814]/45 max-w-md mx-auto leading-relaxed">
            Free on the web. No city lock-in. No paywall on the core photo loop.
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/app"
              className="inline-flex items-center justify-center h-14 px-10 rounded-full bg-[#1a1814] text-[#f6f3ee] text-sm tracking-wide hover:bg-[#2d5a3d] transition-colors duration-300"
            >
              Open RiceTrack
            </Link>
            <Link
              href="/library"
              className="inline-flex items-center justify-center h-14 px-10 rounded-full border border-[#1a1814]/15 text-sm tracking-wide hover:border-[#1a1814]/40 transition-colors duration-300"
            >
              Browse library
            </Link>
          </div>
        </div>
      </section>

      <footer className="px-6 sm:px-10 py-10 border-t border-[#1a1814]/8">
        <div className="mx-auto max-w-[1400px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 text-[12px] tracking-wide text-[#1a1814]/40">
          <span>© {new Date().getFullYear()} RiceTrack</span>
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

      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
