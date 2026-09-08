import Link from "next/link";

/**
 * RiceTrack — positioning:
 * Easy & fun (match Welling’s frictionless feel)
 * Highest Asian accuracy (cuisine AI + official databases)
 * Most comprehensive regional coverage (not one city, not Western defaults)
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
            <a href="#easy" className="opacity-70 hover:opacity-100 transition-opacity">
              Easy
            </a>
            <a href="#accuracy" className="opacity-70 hover:opacity-100 transition-opacity">
              Accuracy
            </a>
            <Link href="/library" className="opacity-70 hover:opacity-100 transition-opacity">
              Library
            </Link>
          </nav>
          <Link href="/app" className="text-[13px] tracking-wide opacity-90 hover:opacity-100 transition-opacity">
            Open →
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative min-h-[100svh] flex flex-col justify-end px-6 sm:px-10 pb-16 sm:pb-20 pt-28">
        <div className="mx-auto max-w-[1400px] w-full">
          <p className="text-[11px] sm:text-xs tracking-[0.25em] uppercase text-[#1a1814]/45 mb-8 sm:mb-12">
            Snap · adjust · done — Asia’s most careful calorie app
          </p>

          <h1 className="font-medium tracking-[-0.04em] leading-[0.92] text-[clamp(2.6rem,10.5vw,8rem)] max-w-[15ch]">
            Easy to use.
            <br />
            Hard to fool
            <br />
            <em className="not-italic text-[#2d5a3d]">on Asian food.</em>
          </h1>

          <div className="mt-12 sm:mt-16 flex flex-col sm:flex-row sm:items-end justify-between gap-8 max-w-4xl">
            <p className="text-[15px] sm:text-base leading-relaxed text-[#1a1814]/55 max-w-md">
              Chat-style speed without the generic database. Photo AI trained on how
              Asia actually cooks — backed by official nutrient tables for Singapore,
              India, and open regional data. Fun in three taps. Serious about accuracy.
            </p>
            <Link href="/app" className="group inline-flex items-center gap-3 self-start sm:self-auto">
              <span className="h-14 w-14 rounded-full border border-[#1a1814]/20 flex items-center justify-center group-hover:bg-[#1a1814] group-hover:text-[#f6f3ee] transition-colors duration-300">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </span>
              <span className="text-sm tracking-wide">Try free</span>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-px bg-[#1a1814]/10" />
      </section>

      {/* Easy & fun */}
      <section id="easy" className="px-6 sm:px-10 py-24 sm:py-28 border-b border-[#1a1814]/8">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#1a1814]/40 mb-6">
            Easy & fun
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.03em] max-w-2xl leading-[1.1] mb-16">
            Logging should feel like a game, not homework.
          </h2>

          <div className="grid md:grid-cols-3 gap-10 md:gap-8">
            {[
              {
                t: "Snap",
                d: "One photo of the plate. Cuisine hint if you want. No barcode hunt for home cooking.",
              },
              {
                t: "Nudge",
                d: "±20 kcal taps, edit portion in place. Fix rice amount in two seconds — then save.",
              },
              {
                t: "See",
                d: "Rings fill up. Day makes sense. Progress feels visual, not like a spreadsheet.",
              },
            ].map((s) => (
              <div key={s.t} className="space-y-3">
                <h3 className="text-2xl font-medium tracking-tight text-[#2d5a3d]">{s.t}</h3>
                <p className="text-[15px] leading-[1.7] text-[#1a1814]/50 max-w-xs">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Competitive honesty */}
      <section className="px-6 sm:px-10 py-24 sm:py-28 border-b border-[#1a1814]/8">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#1a1814]/40 mb-16">
            Where others stop
          </p>
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Fast photo apps</h3>
              <p className="text-[15px] leading-[1.75] text-[#1a1814]/50">
                Delightful snaps. Accuracy drops on saucy, shared, or oil-heavy Asian
                plates. Little regional nutrient grounding.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Chat coaches</h3>
              <p className="text-[15px] leading-[1.75] text-[#1a1814]/50">
                Fun and flexible. “Global database” claims rarely mean official
                hawker or Indian recipe tables under the hood.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-medium">City restaurant apps</h3>
              <p className="text-[15px] leading-[1.75] text-[#1a1814]/50">
                Strong on partner menus in one market. Weak the moment you cook at
                home or travel.
              </p>
            </div>
          </div>

          <div className="mt-16 pt-12 border-t border-[#1a1814]/8">
            <p className="text-2xl sm:text-3xl font-medium tracking-[-0.02em] max-w-3xl leading-snug">
              RiceTrack aims for both:{" "}
              <span className="text-[#2d5a3d]">frictionless logging</span>
              {" "}and{" "}
              <span className="text-[#2d5a3d]">the densest Asian nutrient backbone</span>
              {" "}we can legally and openly build.
            </p>
          </div>
        </div>
      </section>

      {/* Accuracy */}
      <section id="accuracy" className="px-6 sm:px-10 py-24 sm:py-32 border-b border-[#1a1814]/8 bg-[#ebe6dc]/40">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#1a1814]/40 mb-6">
            Accuracy stack
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium tracking-[-0.03em] max-w-3xl leading-[1.1] mb-6">
            Highest signal for Asian plates — by design
          </h2>
          <p className="text-[15px] text-[#1a1814]/50 max-w-2xl leading-relaxed mb-16">
            Vision alone is not enough. We combine cuisine-aware AI with reference
            data from public and official sources so estimates start closer to truth —
            then stay editable when the plate is unique.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                t: "Cuisine-aware vision",
                d: "Prompts and post-processing biased for wok oil, coconut milk, shared dishes, rice bowls, noodles.",
              },
              {
                t: "SG FoodID (HPB)",
                d: "Singapore Health Promotion Board nutrient profiles for local and hawker-style dishes — macros and more.",
              },
              {
                t: "Anuvaad INDB",
                d: "1,000+ Indian recipes with full nutrient profiles — open data for the subcontinent’s home cooking.",
              },
              {
                t: "Open regional sets",
                d: "Open-Food-Calories and cleaned public tables for cross-referenced Asian and global items.",
              },
              {
                t: "Pan-Asian library",
                d: "Named dishes from Chinese, Japanese, Korean, Thai, Vietnamese, Malay, Indonesian, Filipino, and more.",
              },
              {
                t: "You correct → we learn",
                d: "Every edit is a signal. Confidence scores and hidden-calorie flags keep honesty above marketing.",
              },
            ].map((card) => (
              <div
                key={card.t}
                className="rounded-2xl border border-[#1a1814]/8 bg-[#f6f3ee] p-6 sm:p-7 space-y-3"
              >
                <h3 className="font-medium tracking-tight">{card.t}</h3>
                <p className="text-sm leading-relaxed text-[#1a1814]/50">{card.d}</p>
              </div>
            ))}
          </div>

          <p className="mt-12 text-xs text-[#1a1814]/40 max-w-2xl leading-relaxed">
            Reference sources are public catalogs (e.g. Singapore Food Insights Database,
            Anuvaad Indian Nutrient Database, open JSON food tables). We do not claim
            lab certification of every photo estimate — we claim a stronger starting
            point and full user control.
          </p>
        </div>
      </section>

      {/* Method */}
      <section className="px-6 sm:px-10 py-24 sm:py-28 border-b border-[#1a1814]/8">
        <div className="mx-auto max-w-[1400px]">
          <p className="text-[11px] tracking-[0.2em] uppercase text-[#1a1814]/40 mb-16">
            Flow
          </p>
          <div className="grid md:grid-cols-4 gap-10">
            {[
              ["1", "Photo or library", "Snap the meal or pick a named dish."],
              ["2", "AI + tables", "Vision meets regional nutrient references."],
              ["3", "You tweak", "Portion, oil, rice — fixed in seconds."],
              ["4", "Diary rings", "Day totals that feel rewarding, not clinical."],
            ].map(([n, t, d]) => (
              <div key={n} className="space-y-3">
                <span className="text-[11px] tracking-[0.15em] text-[#2d5a3d]">{n}</span>
                <h3 className="text-xl font-medium tracking-tight">{t}</h3>
                <p className="text-sm leading-relaxed text-[#1a1814]/50">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="px-6 sm:px-10 py-28 bg-[#1a1814] text-[#f6f3ee]">
        <div className="mx-auto max-w-[1400px]">
          <blockquote className="text-[clamp(1.5rem,4vw,3rem)] font-medium tracking-[-0.03em] leading-[1.2] max-w-4xl">
            Fun is how you open the app every day.
            <span className="text-[#f6f3ee]/35">
              {" "}
              Accuracy is why you trust what it says about the laksa.
            </span>
          </blockquote>
        </div>
      </section>

      {/* Library teaser */}
      <section className="px-6 sm:px-10 py-24 sm:py-28 border-b border-[#1a1814]/8">
        <div className="mx-auto max-w-[1400px]">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-14">
            <div>
              <p className="text-[11px] tracking-[0.2em] uppercase text-[#1a1814]/40 mb-4">
                Library
              </p>
              <h2 className="text-3xl sm:text-4xl font-medium tracking-[-0.03em] max-w-lg">
                Comprehensive by region — growing toward official tables
              </h2>
            </div>
            <Link
              href="/library"
              className="text-sm tracking-wide text-[#2d5a3d] hover:underline underline-offset-4 shrink-0"
            >
              Browse now →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#1a1814]/8 border border-[#1a1814]/8">
            {[
              ["Mapo Tofu", "Chinese", "320"],
              ["Nasi Lemak", "Malay / SG", "600"],
              ["Masala Dosa", "Indian", "350"],
              ["Bibimbap", "Korean", "550"],
              ["Pad Thai", "Thai", "550"],
              ["Pho Bo", "Vietnamese", "450"],
              ["Chicken Rice", "Singaporean", "550"],
              ["Tonkotsu Ramen", "Japanese", "650"],
            ].map(([name, region, cal]) => (
              <div key={name} className="bg-[#f6f3ee] p-6 sm:p-8 hover:bg-[#ebe6dc] transition-colors">
                <div className="text-sm font-medium">{name}</div>
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
      <section className="py-16 overflow-hidden border-b border-[#1a1814]/8">
        <div className="flex whitespace-nowrap animate-[marquee_42s_linear_infinite] text-[clamp(1.5rem,5vw,3rem)] font-medium tracking-[-0.03em] text-[#1a1814]/12">
          <span className="mx-8">
            SG FoodID · Anuvaad INDB · Open food tables · Chinese · Japanese · Korean · Thai · Vietnamese · Indian · Malay · Indonesian · Filipino ·
          </span>
          <span className="mx-8">
            SG FoodID · Anuvaad INDB · Open food tables · Chinese · Japanese · Korean · Thai · Vietnamese · Indian · Malay · Indonesian · Filipino ·
          </span>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 sm:px-10 py-28 sm:py-36">
        <div className="mx-auto max-w-[1400px] text-center">
          <h2 className="text-3xl sm:text-5xl font-medium tracking-[-0.04em] leading-[1.05] max-w-2xl mx-auto">
            Playful to open. Precise when it counts.
          </h2>
          <p className="mt-6 text-[15px] text-[#1a1814]/45 max-w-md mx-auto">
            Free on the web. No city lock. Core photo loop unlocked.
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
              className="inline-flex items-center justify-center h-14 px-10 rounded-full border border-[#1a1814]/15 text-sm tracking-wide hover:border-[#1a1814]/40 transition-colors"
            >
              Food library
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
