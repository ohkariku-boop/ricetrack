import Link from "next/link";
import { Camera, Sparkles, Database, Globe2, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto max-w-5xl px-5 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm shadow-sm">
              RT
            </div>
            <span className="font-semibold tracking-tight">RiceTrack</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden sm:inline-flex px-3.5 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Sign in
            </Link>
            <Link
              href="/app"
              className="btn-primary h-10 px-5 text-sm flex items-center gap-1.5"
            >
              Open app
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--primary-soft),_transparent_60%)] pointer-events-none" />
          <div className="relative mx-auto max-w-5xl px-5 pt-16 pb-20 sm:pt-24 sm:pb-28 text-center page-enter">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground mb-6">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              Built for Asian food accuracy
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] max-w-3xl mx-auto">
              Calorie tracking that{" "}
              <span className="text-primary">understands</span> your plate
            </h1>
            <p className="mt-5 text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Snap a photo of rice bowls, stir-fries, noodles, or shared plates.
              RiceTrack estimates calories and macros with cuisine-aware AI —
              not a Western database forced onto Asian meals.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/app"
                className="btn-primary h-13 px-8 text-[16px] flex items-center gap-2 w-full sm:w-auto justify-center"
                style={{ height: "3.25rem" }}
              >
                <Camera className="w-5 h-5" />
                Start tracking free
              </Link>
              <Link
                href="/library"
                className="h-13 px-8 rounded-full border border-border bg-card font-semibold text-[16px] flex items-center gap-2 w-full sm:w-auto justify-center hover:bg-muted transition-colors"
                style={{ height: "3.25rem" }}
              >
                <Database className="w-5 h-5" />
                Browse food library
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              No credit card · Magic link sign-in · Works on any phone
            </p>
          </div>
        </section>

        {/* Features */}
        <section className="border-t border-border bg-card/40">
          <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20">
            <div className="text-center mb-12">
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Why RiceTrack exists
              </h2>
              <p className="mt-3 text-muted-foreground max-w-lg mx-auto">
                Generic trackers miss oil in the wok, coconut milk in the curry,
                and how you actually share a table.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {[
                {
                  icon: Camera,
                  title: "Photo → macros in seconds",
                  body: "Cuisine-aware AI reads your plate, flags hidden oil and sauce, and lets you edit in one tap.",
                },
                {
                  icon: Globe2,
                  title: "Asia-first, not Asia-also",
                  body: "Chinese, Japanese, Korean, Thai, Vietnamese, Indian, Malay, Indonesian, Filipino — by design.",
                },
                {
                  icon: Database,
                  title: "Growing Asian food library",
                  body: "Search common dishes with reference calories, or log from a photo. Corrections make it smarter.",
                },
              ].map((f) => (
                <div key={f.title} className="card-elevated p-6 space-y-3">
                  <div className="w-11 h-11 rounded-2xl bg-primary-soft flex items-center justify-center">
                    <f.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Cuisines */}
        <section className="border-t border-border">
          <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Built around the food you actually eat
            </h2>
            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {[
                "Chinese",
                "Japanese",
                "Korean",
                "Thai",
                "Vietnamese",
                "Indian",
                "Malay",
                "Indonesian",
                "Filipino",
                "Taiwanese",
                "Hong Kong",
                "Singaporean",
              ].map((c) => (
                <span
                  key={c}
                  className="px-4 py-2 rounded-full bg-card border border-border text-sm font-medium"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border bg-primary-soft/50">
          <div className="mx-auto max-w-5xl px-5 py-16 sm:py-20 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Ready to track without the guesswork?
            </h2>
            <p className="mt-3 text-muted-foreground">
              Open the app, snap your next meal, and see the difference.
            </p>
            <Link
              href="/app"
              className="btn-primary inline-flex h-13 px-8 mt-8 text-[16px] items-center gap-2"
              style={{ height: "3.25rem" }}
            >
              <Camera className="w-5 h-5" />
              Open RiceTrack
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        <div className="mx-auto max-w-5xl px-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} RiceTrack · Asia-first nutrition</span>
          <div className="flex gap-4">
            <Link href="/app" className="hover:text-foreground">
              App
            </Link>
            <Link href="/library" className="hover:text-foreground">
              Library
            </Link>
            <Link href="/login" className="hover:text-foreground">
              Sign in
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
