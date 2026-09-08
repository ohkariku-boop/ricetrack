import Link from "next/link";
import {
  Camera,
  Sparkles,
  Database,
  Globe2,
  ChevronRight,
  Zap,
  Shield,
  Utensils,
  ArrowRight,
  Check,
  Star,
} from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#070a08] text-[#f2f7f3] antialiased overflow-x-hidden">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(34,197,94,0.18), transparent), radial-gradient(ellipse 40% 30% at 90% 20%, rgba(16,185,129,0.08), transparent)",
        }}
      />

      {/* Nav */}
      <header className="relative z-30 sticky top-0 border-b border-white/5 bg-[#070a08]/70 backdrop-blur-2xl">
        <div className="mx-auto max-w-6xl px-5 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-[#052e16] font-bold text-sm shadow-[0_0_24px_rgba(34,197,94,0.35)] transition-transform group-hover:scale-105">
              RT
            </div>
            <span className="font-semibold tracking-tight text-[15px]">RiceTrack</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-white/50">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#library" className="hover:text-white transition-colors">
              Library
            </a>
            <a href="#faq" className="hover:text-white transition-colors">
              FAQ
            </a>
            <Link href="/library" className="hover:text-white transition-colors">
              Browse dishes
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden sm:inline text-sm text-white/50 hover:text-white transition-colors px-2"
            >
              Sign in
            </Link>
            <Link
              href="/app"
              className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full bg-white text-[#070a08] text-sm font-semibold hover:bg-emerald-50 transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.15)]"
            >
              Open app
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="relative mx-auto max-w-6xl px-5 pt-20 pb-24 sm:pt-28 sm:pb-32">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            <div className="lg:col-span-7 space-y-8">
              <div
                className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300"
                style={{ animation: "fadeSlideUp 0.6s ease both" }}
              >
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
                </span>
                Asia-first AI nutrition · Live on web
              </div>

              <h1
                className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.25rem] font-bold tracking-[-0.04em] leading-[1.05]"
                style={{ animation: "fadeSlideUp 0.7s ease 0.05s both" }}
              >
                Track calories
                <br />
                <span className="bg-gradient-to-r from-emerald-300 via-emerald-400 to-teal-300 bg-clip-text text-transparent">
                  the way Asia eats
                </span>
              </h1>

              <p
                className="text-lg sm:text-xl text-white/50 max-w-xl leading-relaxed"
                style={{ animation: "fadeSlideUp 0.7s ease 0.1s both" }}
              >
                Cal AI made photo tracking mainstream. RiceTrack makes it accurate for
                rice bowls, stir-fries, noodles, shared plates, and every cuisine
                Western databases still get wrong.
              </p>

              <div
                className="flex flex-col sm:flex-row gap-3"
                style={{ animation: "fadeSlideUp 0.7s ease 0.15s both" }}
              >
                <Link
                  href="/app"
                  className="group inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full bg-emerald-500 text-[#052e16] font-semibold text-[15px] hover:bg-emerald-400 transition-all shadow-[0_0_40px_rgba(16,185,129,0.35)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)]"
                >
                  <Camera className="w-5 h-5" />
                  Snap your first meal
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/library"
                  className="inline-flex items-center justify-center gap-2 h-14 px-8 rounded-full border border-white/10 bg-white/5 font-semibold text-[15px] text-white/80 hover:bg-white/10 hover:border-white/20 transition-all"
                >
                  <Database className="w-5 h-5" />
                  Explore food library
                </Link>
              </div>

              <div
                className="flex flex-wrap items-center gap-6 pt-2 text-sm text-white/40"
                style={{ animation: "fadeSlideUp 0.7s ease 0.2s both" }}
              >
                <div className="flex items-center gap-1.5">
                  <div className="flex -space-x-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border-2 border-[#070a08] bg-gradient-to-br from-emerald-600 to-teal-800"
                      />
                    ))}
                  </div>
                  <span>Built for real Asian plates</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                  <span>Cuisine-aware AI · Editable results</span>
                </div>
              </div>
            </div>

            {/* Phone mock visual */}
            <div
              className="lg:col-span-5 relative flex justify-center lg:justify-end"
              style={{ animation: "fadeSlideUp 0.8s ease 0.15s both" }}
            >
              <div className="relative w-[280px] sm:w-[300px]">
                <div className="absolute -inset-8 bg-emerald-500/20 blur-3xl rounded-full" />
                <div className="relative rounded-[2.5rem] border border-white/10 bg-gradient-to-b from-[#121a14] to-[#0a0f0c] p-3 shadow-2xl shadow-black/50">
                  <div className="rounded-[2rem] overflow-hidden border border-white/5 bg-[#0b120e]">
                    {/* Status bar fake */}
                    <div className="h-10 flex items-center justify-between px-5 text-[10px] text-white/30">
                      <span>9:41</span>
                      <div className="w-20 h-4 rounded-full bg-black/40" />
                      <span>●●●</span>
                    </div>
                    <div className="px-4 pb-6 space-y-4">
                      <div className="text-center space-y-1">
                        <p className="text-xs text-emerald-400/80 font-medium">Today</p>
                        <p className="text-3xl font-bold tracking-tight">1,240</p>
                        <p className="text-[11px] text-white/35">of 2,000 kcal</p>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-emerald-500 to-teal-400" />
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          ["P", "82g"],
                          ["C", "140g"],
                          ["F", "48g"],
                        ].map(([l, v]) => (
                          <div
                            key={l}
                            className="rounded-2xl bg-white/5 border border-white/5 p-3 text-center"
                          >
                            <div className="text-[10px] text-white/35">{l}</div>
                            <div className="text-sm font-semibold mt-0.5">{v}</div>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 flex gap-3 items-center">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-600/40 to-orange-900/40 border border-white/5" />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">Mapo Tofu + rice</div>
                          <div className="text-[11px] text-white/35">520 kcal · Chinese</div>
                        </div>
                      </div>
                      <div className="h-12 rounded-2xl bg-emerald-500 flex items-center justify-center gap-2 text-[#052e16] text-sm font-semibold">
                        <Camera className="w-4 h-4" />
                        Log meal
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Logo / trust strip */}
        <section className="border-y border-white/5 bg-white/[0.02]">
          <div className="mx-auto max-w-6xl px-5 py-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-xs text-white/25 font-medium tracking-wide uppercase">
            <span>Chinese</span>
            <span>Japanese</span>
            <span>Korean</span>
            <span>Thai</span>
            <span>Vietnamese</span>
            <span>Indian</span>
            <span>Malay · Indo · Filipino</span>
          </div>
        </section>

        {/* Features bento */}
        <section id="features" className="mx-auto max-w-6xl px-5 py-24 sm:py-32">
          <div className="max-w-2xl mb-14">
            <p className="text-emerald-400 text-sm font-semibold tracking-wide uppercase mb-3">
              Why RiceTrack
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.03em] leading-[1.1]">
              Not another Western tracker
              <span className="text-white/30"> with an Asian afterthought.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-6 gap-4">
            {/* Large feature */}
            <div className="md:col-span-4 group relative rounded-3xl border border-white/8 bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-8 sm:p-10 overflow-hidden hover:border-emerald-500/20 transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full -translate-y-1/2 translate-x-1/3" />
              <div className="relative space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
                  <Camera className="w-6 h-6 text-emerald-400" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight">Photo AI that knows a wok from a salad bowl</h3>
                <p className="text-white/45 leading-relaxed max-w-lg">
                  Cuisine-aware models detect stir-fries, curries, noodle bowls, and shared plates.
                  We flag hidden oil, coconut milk, and sauce — the calories generic apps silently miss.
                </p>
                <ul className="space-y-2 pt-2">
                  {["Cooking method detection", "Hidden calorie warnings", "One-tap portion adjust"].map(
                    (t) => (
                      <li key={t} className="flex items-center gap-2 text-sm text-white/60">
                        <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                        {t}
                      </li>
                    )
                  )}
                </ul>
              </div>
            </div>

            <div className="md:col-span-2 rounded-3xl border border-white/8 bg-white/[0.03] p-8 flex flex-col justify-between hover:border-white/15 transition-colors">
              <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center">
                <Globe2 className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="mt-8 space-y-2">
                <h3 className="text-lg font-bold">10+ cuisines</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  From Mapo Tofu to Nasi Lemak — designed for the plates you actually eat.
                </p>
              </div>
            </div>

            <div className="md:col-span-2 rounded-3xl border border-white/8 bg-white/[0.03] p-8 flex flex-col justify-between hover:border-white/15 transition-colors">
              <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center">
                <Database className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="mt-8 space-y-2">
                <h3 className="text-lg font-bold">Asian food library</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  80+ reference dishes with macros. Search, filter, log in seconds.
                </p>
              </div>
            </div>

            <div className="md:col-span-2 rounded-3xl border border-white/8 bg-white/[0.03] p-8 flex flex-col justify-between hover:border-white/15 transition-colors">
              <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center">
                <Zap className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="mt-8 space-y-2">
                <h3 className="text-lg font-bold">Seconds, not minutes</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  Snap → review → save. No endless barcode hunting for home cooking.
                </p>
              </div>
            </div>

            <div className="md:col-span-2 rounded-3xl border border-white/8 bg-white/[0.03] p-8 flex flex-col justify-between hover:border-white/15 transition-colors">
              <div className="w-11 h-11 rounded-2xl bg-white/5 flex items-center justify-center">
                <Shield className="w-5 h-5 text-emerald-400" />
              </div>
              <div className="mt-8 space-y-2">
                <h3 className="text-lg font-bold">You stay in control</h3>
                <p className="text-sm text-white/40 leading-relaxed">
                  Every estimate is editable. AI suggests — you confirm.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="border-t border-white/5 bg-white/[0.015]">
          <div className="mx-auto max-w-6xl px-5 py-24 sm:py-28">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em]">
                Built different on purpose
              </h2>
              <p className="mt-4 text-white/40">
                Generic photo trackers optimize for Western plates. We optimize for yours.
              </p>
            </div>
            <div className="overflow-x-auto rounded-3xl border border-white/8">
              <table className="w-full text-sm text-left min-w-[540px]">
                <thead>
                  <tr className="border-b border-white/8 bg-white/[0.03]">
                    <th className="px-6 py-4 font-medium text-white/40">Capability</th>
                    <th className="px-6 py-4 font-semibold text-emerald-400">RiceTrack</th>
                    <th className="px-6 py-4 font-medium text-white/40">Typical photo trackers</th>
                  </tr>
                </thead>
                <tbody className="text-white/60">
                  {[
                    ["Asian cuisine bias", "Native", "Afterthought"],
                    ["Hidden oil / sauce flags", "Yes", "Rarely"],
                    ["Shared-plate mental model", "Yes", "Single Western plate"],
                    ["Editable AI results", "First-class", "Often locked"],
                    ["Asian dish library", "80+ seeded", "Sparse"],
                    ["Onboarding for local goals", "Yes", "Generic 2,000 kcal"],
                  ].map(([cap, us, them]) => (
                    <tr key={cap} className="border-b border-white/5 last:border-0">
                      <td className="px-6 py-4 text-white/80">{cap}</td>
                      <td className="px-6 py-4 text-emerald-300/90 font-medium">{us}</td>
                      <td className="px-6 py-4 text-white/35">{them}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Library teaser */}
        <section id="library" className="mx-auto max-w-6xl px-5 py-24">
          <div className="rounded-[2rem] border border-white/8 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/5 p-8 sm:p-12 md:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.12),transparent_50%)]" />
            <div className="relative grid md:grid-cols-2 gap-10 items-center">
              <div className="space-y-5">
                <div className="inline-flex items-center gap-2 text-emerald-400 text-sm font-semibold">
                  <Utensils className="w-4 h-4" />
                  Food library
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.03em] leading-tight">
                  From pho to rendang — already in the catalog
                </h2>
                <p className="text-white/45 leading-relaxed">
                  Browse reference calories for common Asian dishes, then log from the library
                  or refine with a photo. The catalog grows with every correction.
                </p>
                <Link
                  href="/library"
                  className="inline-flex items-center gap-2 h-12 px-6 rounded-full bg-white text-[#070a08] font-semibold text-sm hover:bg-emerald-50 transition-colors"
                >
                  Browse the library
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Mapo Tofu", "320 kcal"],
                  ["Tonkotsu Ramen", "650 kcal"],
                  ["Nasi Lemak", "600 kcal"],
                  ["Pad Thai", "550 kcal"],
                  ["Bibimbap", "550 kcal"],
                  ["Pho Bo", "450 kcal"],
                ].map(([name, cal]) => (
                  <div
                    key={name}
                    className="rounded-2xl border border-white/8 bg-black/30 backdrop-blur px-4 py-3.5"
                  >
                    <div className="text-sm font-medium">{name}</div>
                    <div className="text-xs text-emerald-400/80 mt-1">{cal}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="border-t border-white/5">
          <div className="mx-auto max-w-3xl px-5 py-24">
            <h2 className="text-3xl font-bold tracking-tight text-center mb-12">
              Questions, answered
            </h2>
            <div className="space-y-3">
              {[
                {
                  q: "How is this different from Cal AI?",
                  a: "Cal AI proved photo tracking can be effortless. RiceTrack is built specifically so Asian meals — oil, sauces, rice bowls, shared dishes — are estimated more honestly, with a native food library and cuisine-aware AI.",
                },
                {
                  q: "Is the AI accurate?",
                  a: "No photo system is perfect. We surface confidence scores, hidden-calorie warnings, and full edit controls so you can correct in seconds. Consistency beats false precision.",
                },
                {
                  q: "Is it free?",
                  a: "Yes for the core web experience: photo analysis, library, diary, and onboarding. We’re focused on product quality first.",
                },
                {
                  q: "Do I need an app store download?",
                  a: "Not yet. RiceTrack runs as a fast web app / PWA — open it on your phone, add to home screen, and track.",
                },
              ].map((item) => (
                <details
                  key={item.q}
                  className="group rounded-2xl border border-white/8 bg-white/[0.02] open:bg-white/[0.04] transition-colors"
                >
                  <summary className="cursor-pointer list-none px-6 py-5 font-medium flex items-center justify-between gap-4">
                    {item.q}
                    <span className="text-white/30 group-open:rotate-45 transition-transform text-xl leading-none">
                      +
                    </span>
                  </summary>
                  <div className="px-6 pb-5 text-sm text-white/45 leading-relaxed">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-white/5">
          <div className="mx-auto max-w-6xl px-5 py-24 sm:py-28 text-center">
            <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.03em] max-w-2xl mx-auto leading-[1.1]">
              Your next meal deserves better than a guess
            </h2>
            <p className="mt-5 text-white/40 max-w-md mx-auto">
              Open RiceTrack, snap what you&apos;re eating, and see nutrition that respects how Asia actually cooks.
            </p>
            <Link
              href="/app"
              className="mt-10 inline-flex items-center gap-2 h-14 px-10 rounded-full bg-emerald-500 text-[#052e16] font-semibold hover:bg-emerald-400 transition-all shadow-[0_0_50px_rgba(16,185,129,0.35)]"
            >
              <Camera className="w-5 h-5" />
              Start free
            </Link>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-10">
        <div className="mx-auto max-w-6xl px-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/30">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 flex items-center justify-center text-[10px] font-bold text-emerald-400">
              RT
            </div>
            <span>RiceTrack · Asia-first nutrition</span>
          </div>
          <div className="flex gap-6">
            <Link href="/app" className="hover:text-white/60 transition-colors">
              App
            </Link>
            <Link href="/library" className="hover:text-white/60 transition-colors">
              Library
            </Link>
            <Link href="/login" className="hover:text-white/60 transition-colors">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
