import Link from "next/link";

/**
 * RiceTrack promotional site
 * Art direction: editorial quiet — paper, ink, one matcha accent.
 * Inspired by Siteinspire minimal/typographic work and Awwwards portfolio restraint.
 */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f6f3ee] text-[#1a1814] selection:bg-[#2d5a3d]/20">
      {/* Top bar */}
      <header className="fixed top-0 inset-x-0 z-50 mix-blend-difference">
        <div className="mx-auto max-w-[1400px] px-6 sm:px-10 h-16 flex items-center justify-between text-[#f6f3ee]">
          <Link href="/" className="text-[13px] tracking-[0.2em] uppercase font-medium">
            RiceTrack
          </Link>
          <nav className="hidden sm:flex items-center gap-10 text-[13px] tracking-wide">
            <a href="#idea" className="opacity-70 hover:opacity-100 transition-opacity">
              Idea
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

      {/* Hero — full viewport, typographic */}
      <section className="relative min-h-[100svh] flex flex-col justify-end px-6 sm:px-10 pb-16 sm:pb-20 pt-28">
        <div className="mx-auto max-w-[1400px] w-full">
          <p className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#1a1814]/45 mb-8 sm:mb-12">
            Nutrition · for the way Asia eats
          </p>

          <h1 className="font-medium tracking-[-0.04em] leading-[0.92] text-[clamp(2.75rem,12vw,9.5rem)] max-w-[18ch]">
            Count
            <br />
            what you
            <br />
            <em className="not-italic text-[#2d5a3d]">actually</em>
            <br />
            cook.
          </h1>

          <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-8 max-w-4xl">
            <p className="text-[15px] sm:text-base leading-relaxed text-[#1a1814]/55 max-w-sm">
              Photo tracking that understands rice, oil, sauce, and shared plates —
              not another Western calorie app stretched over Asian meals.
            </p>
            <Link
              href="/app"
              className="group inline-flex items-center gap-3 self-start sm:self-auto"
            >
              <span className="h-14 w-14 rounded-full border border-[#1a1814]/20 flex items-center justify-center group-hover:bg-[#1a1814] group-hover:text-[#f6f3ee] transition-colors duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
              <span className="text-sm tracking-wide">Begin</span>
            </Link>
          </div>
        </div>

        {/* Grain line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#1a1814]/10" />
      </section>

      {/* Idea */}
      <section id="idea" className="px-6 sm:px-10 py-24 sm:py-32 border-b border-[#1a1814]/8">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8">
            <div className="lg:col-span-4">
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#1a1814]/40 sticky top-24">
                01 — The idea
              </p>
            </div>
            <div className="lg:col-span-8 space-y-10">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.03em] leading-[1.15] max-w-2xl">
                Calorie apps were trained on sandwiches and salads.
                <span className="text-[#1a1814]/35"> Your dinner is a different language.</span>
              </h2>
              <div className="grid sm:grid-cols-2 gap-10 pt-4 max-w-2xl">
                <p className="text-[15px] leading-[1.7] text-[#1a1814]/55">
                  Wok oil. Coconut milk. A shared hotpot. Half a bowl of rice.
                  These are not edge cases in Asia — they are the meal. Generic
                  trackers treat them as noise.
                </p>
                <p className="text-[15px] leading-[1.7] text-[#1a1814]/55">
                  RiceTrack starts from cuisine. The model is biased toward
                  Chinese, Japanese, Korean, Thai, Vietnamese, Indian, Malay,
                  Indonesian, and Filipino plates — then invites you to correct
                  what it misses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Method — three quiet columns */}
      <section id="method" className="px-6 sm:px-10 py-24 sm:py-32 border-b border-[#1a1814]/8">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#1a1814]/40 mb-16">
            02 — Method
          </p>
          <div className="grid md:grid-cols-3 gap-12 md:gap-8">
            {[
              {
                n: "01",
                t: "See",
                d: "Photograph the plate. Lighting helps; perfection is optional. The model reads structure, not just labels.",
              },
              {
                n: "02",
                t: "Understand",
                d: "Cuisine-aware estimates. Cooking method, portion language, and risk of hidden fat or sugar — surfaced, not hidden.",
              },
              {
                n: "03",
                t: "Own",
                d: "Edit calories and macros in place. Save to a diary that respects your targets, not a generic 2,000 kcal template.",
              },
            ].map((item) => (
              <div key={item.n} className="space-y-5">
                <span className="text-[11px] tracking-[0.15em] text-[#2d5a3d]">{item.n}</span>
                <h3 className="text-2xl sm:text-3xl font-medium tracking-tight">{item.t}</h3>
                <p className="text-[15px] leading-[1.7] text-[#1a1814]/50 max-w-xs">
                  {item.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Large statement */}
      <section className="px-6 sm:px-10 py-28 sm:py-40 bg-[#1a1814] text-[#f6f3ee]">
        <div className="mx-auto max-w-[1400px]">
          <blockquote className="text-[clamp(1.75rem,5vw,3.5rem)] font-medium tracking-[-0.03em] leading-[1.2] max-w-4xl">
            “Accuracy is not a number on a screen.
            <span className="text-[#f6f3ee]/35">
              {" "}
              It is whether the app admits uncertainty — and lets you fix it.”
            </span>
          </blockquote>
          <p className="mt-10 text-[13px] tracking-wide text-[#f6f3ee]/35">
            Design principle
          </p>
        </div>
      </section>

      {/* Library strip */}
      <section className="px-6 sm:px-10 py-24 sm:py-32 border-b border-[#1a1814]/8">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#1a1814]/40 mb-4">
                03 — Library
              </p>
              <h2 className="text-3xl sm:text-4xl font-medium tracking-[-0.03em]">
                Dishes, already named
              </h2>
            </div>
            <Link
              href="/library"
              className="text-sm tracking-wide text-[#2d5a3d] hover:underline underline-offset-4"
            >
              View full catalog →
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1a1814]/8 border border-[#1a1814]/8">
            {[
              ["Mapo Tofu", "麻婆豆腐", "320"],
              ["Tonkotsu Ramen", "豚骨", "650"],
              ["Nasi Lemak", "—", "600"],
              ["Bibimbap", "비빔밥", "550"],
              ["Pad Thai", "ผัดไทย", "550"],
              ["Pho Bo", "Phở bò", "450"],
              ["Butter Chicken", "—", "490"],
              ["Hainanese Chicken Rice", "海南鸡饭", "550"],
            ].map(([name, orig, cal]) => (
              <div
                key={name}
                className="bg-[#f6f3ee] p-6 sm:p-8 hover:bg-[#ebe6dc] transition-colors duration-300"
              >
                <div className="text-sm font-medium tracking-tight">{name}</div>
                {orig !== "—" && (
                  <div className="text-xs text-[#1a1814]/35 mt-1">{orig}</div>
                )}
                <div className="mt-6 text-[13px] tabular-nums text-[#1a1814]/45">
                  {cal} <span className="text-[11px]">kcal</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cuisines — horizontal type */}
      <section className="py-20 sm:py-24 overflow-hidden border-b border-[#1a1814]/8">
        <div className="flex whitespace-nowrap animate-[marquee_40s_linear_infinite] text-[clamp(2rem,6vw,4rem)] font-medium tracking-[-0.03em] text-[#1a1814]/12">
          <span className="mx-8">Chinese · Japanese · Korean · Thai · Vietnamese · Indian · Malay · Indonesian · Filipino · Singaporean · Taiwanese ·</span>
          <span className="mx-8">Chinese · Japanese · Korean · Thai · Vietnamese · Indian · Malay · Indonesian · Filipino · Singaporean · Taiwanese ·</span>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 sm:px-10 py-28 sm:py-36">
        <div className="mx-auto max-w-[1400px] text-center">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-[-0.04em] leading-[1.05] max-w-3xl mx-auto">
            Your next plate is waiting.
          </h2>
          <p className="mt-6 text-[15px] text-[#1a1814]/45 max-w-md mx-auto leading-relaxed">
            Free on the web. No app store required. Add to your home screen when you are ready.
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

      {/* Footer */}
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
