import Link from "next/link";

/** Hero mosaic — distinct set */
const HERO = [
  { src: "/food/ramen.jpg", alt: "Ramen" },
  { src: "/food/pho.jpg", alt: "Pho" },
  { src: "/food/noodles2.jpg", alt: "Noodles" },
  { src: "/food/indian-curry.jpg", alt: "Indian curry" },
  { src: "/food/rice.jpg", alt: "Rice meal" },
  { src: "/food/friedrice.jpg", alt: "Fried rice" },
];

/** Marquee strip — different assets, labelled by cuisine */
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
  // Duplicate for seamless loop
  const items = [...MARQUEE, ...MARQUEE];
  return (
    <section
      className="relative border-y border-[#1a1814]/8 bg-[#1a1814]/[0.03] overflow-hidden"
      aria-label="Cuisines across Asia"
    >
      <div className="marquee-track flex w-max gap-3 py-3 sm:py-3.5 pl-3">
        {items.map((item, i) => (
          <div
            key={`${item.cuisine}-${i}`}
            className="relative shrink-0 w-[140px] sm:w-[168px] h-[88px] sm:h-[100px] rounded-xl overflow-hidden shadow-sm ring-1 ring-[#1a1814]/10"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.src}
              alt={item.cuisine}
              className="absolute inset-0 w-full h-full object-cover opacity-90"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1814]/75 via-[#1a1814]/15 to-transparent" />
            <span className="absolute bottom-2 left-2.5 text-[11px] sm:text-[12px] font-medium tracking-wide text-[#f6f3ee]/95">
              {item.cuisine}
            </span>
          </div>
        ))}
      </div>
      {/* Soft edge fades */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-16 bg-gradient-to-r from-[#f6f3ee] to-transparent z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-10 sm:w-16 bg-gradient-to-l from-[#f6f3ee] to-transparent z-10" />
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#f6f3ee] text-[#1a1814]">
      <style>{`
        @keyframes ricetrack-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-track {
          animation: ricetrack-marquee 48s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .marquee-track { animation: none; }
        }
      `}</style>

      <header className="sticky top-0 z-50 border-b border-[#1a1814]/8 bg-[#f6f3ee]/95 backdrop-blur-xl">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 h-12 flex items-center justify-between">
          <Link href="/" className="text-[12px] tracking-[0.18em] uppercase font-medium">
            RiceTrack
          </Link>
          <nav className="hidden sm:flex items-center gap-6 text-[12px] text-[#1a1814]/55">
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
          <Link href="/app" className="text-[12px] font-medium text-[#2d5a3d]">
            Open →
          </Link>
        </div>
      </header>

      <section className="px-4 sm:px-6 pt-8 sm:pt-10 pb-6">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          <div className="space-y-4 order-2 lg:order-1">
            <p className="text-[10px] tracking-[0.2em] uppercase text-[#1a1814]/45">
              Asia-first · Photo AI · 1000+ dishes
            </p>
            <h1 className="font-medium tracking-[-0.04em] leading-[0.95] text-[clamp(2rem,5.5vw,3.5rem)]">
              Easy to use.
              <br />
              Hard to fool
              <br />
              <span className="text-[#2d5a3d]">on Asian food.</span>
            </h1>
            <p className="text-[14px] leading-snug text-[#1a1814]/55 max-w-sm">
              Snap or type. Rice bowls, noodles, curry, hawker sets — not Western defaults.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link
                href="/app"
                className="inline-flex h-10 px-6 items-center rounded-full bg-[#1a1814] text-[#f6f3ee] text-[13px] font-medium hover:bg-[#2d5a3d] transition-colors"
              >
                Try free
              </Link>
              <Link
                href="/library"
                className="inline-flex h-10 px-6 items-center rounded-full border border-[#1a1814]/15 text-[13px] hover:border-[#1a1814]/35 transition-colors"
              >
                Library
              </Link>
            </div>
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
              <div className="col-span-1 row-span-2 rounded-xl overflow-hidden shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={HERO[0].src}
                  alt={HERO[0].alt}
                  className="w-full h-full object-cover aspect-[3/5]"
                  width={360}
                  height={600}
                />
              </div>
              <div className="rounded-xl overflow-hidden shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={HERO[1].src}
                  alt={HERO[1].alt}
                  className="w-full object-cover aspect-square"
                  width={280}
                  height={280}
                />
              </div>
              <div className="rounded-xl overflow-hidden shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={HERO[2].src}
                  alt={HERO[2].alt}
                  className="w-full object-cover aspect-square"
                  width={280}
                  height={280}
                />
              </div>
              <div className="col-span-2 rounded-xl overflow-hidden shadow-md">
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
            <div className="absolute -bottom-2 left-0 w-[40%] rounded-xl overflow-hidden shadow-xl border-[3px] border-[#f6f3ee] -rotate-3 z-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HERO[4].src}
                alt={HERO[4].alt}
                className="w-full aspect-[4/3] object-cover"
                width={280}
                height={210}
              />
            </div>
            <div className="absolute -top-1.5 right-0 w-[26%] rounded-lg overflow-hidden shadow-lg border-[3px] border-[#f6f3ee] rotate-6 z-10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HERO[5].src}
                alt={HERO[5].alt}
                className="w-full aspect-square object-cover"
                width={160}
                height={160}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Cuisine marquee — different photos + labels */}
      <MarqueeStrip />

      <section id="easy" className="px-4 sm:px-6 py-12 sm:py-14 border-t border-[#1a1814]/8">
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] tracking-[0.18em] uppercase text-[#1a1814]/40 mb-3">Easy & fun</p>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] max-w-lg mb-8">
            Snap, type, or re-log — built for how Asia eats.
          </h2>
          <div className="grid sm:grid-cols-3 gap-6 sm:gap-8">
            {[
              ["Snap", "Photo AI tuned for wok oil, sauces, shared plates."],
              ["Type", "半碗米饭 + 麻婆豆腐 — any language."],
              ["Library", "1,000+ dishes · 10 per page · fast search."],
            ].map(([t, d]) => (
              <div key={t} className="space-y-1">
                <h3 className="text-lg font-medium text-[#2d5a3d]">{t}</h3>
                <p className="text-[13px] text-[#1a1814]/50 leading-snug">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="accuracy" className="px-4 sm:px-6 py-12 sm:py-14 bg-[#ebe6dc]/50 border-t border-[#1a1814]/8">
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] tracking-[0.18em] uppercase text-[#1a1814]/40 mb-3">Why RiceTrack</p>
          <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] max-w-xl mb-6">
            Accuracy for Asian plates — free core loop.
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              "Cuisine-aware AI",
              "Editable macros",
              "Oil / sauce flags",
              "Recents & templates",
              "Manual targets",
              "Balance + undo",
            ].map((t) => (
              <div
                key={t}
                className="rounded-xl border border-[#1a1814]/8 bg-[#f6f3ee] px-3.5 py-3 text-[13px] font-medium"
              >
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 sm:px-6 py-14 sm:py-16 text-center border-t border-[#1a1814]/8">
        <h2 className="text-2xl sm:text-3xl font-medium tracking-[-0.03em] max-w-md mx-auto">
          Start with the meal in front of you.
        </h2>
        <Link
          href="/app"
          className="mt-6 inline-flex h-10 px-8 items-center rounded-full bg-[#1a1814] text-[#f6f3ee] text-[13px] hover:bg-[#2d5a3d] transition-colors"
        >
          Open RiceTrack
        </Link>
      </section>

      <footer className="px-4 sm:px-6 py-6 border-t border-[#1a1814]/8 text-[11px] text-[#1a1814]/40">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row justify-between gap-3">
          <span>© {new Date().getFullYear()} RiceTrack</span>
          <div className="flex gap-5">
            <Link href="/app">App</Link>
            <Link href="/library">Library</Link>
            <Link href="/login">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
