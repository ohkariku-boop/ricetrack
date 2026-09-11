import Link from "next/link";
import { RiceLogo } from "@/components/RiceLogo";

export const metadata = {
  title: "Disclaimer, RiceTrack",
  description: "Health and accuracy disclaimer for RiceTrack",
};

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-[#f6f3ee] text-[#1a1814]">
      <header className="border-b border-[#1a1814]/8 px-4 sm:px-6 h-14 flex items-center justify-between max-w-3xl mx-auto">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <RiceLogo size={28} />
          RiceTrack
        </Link>
        <Link href="/" className="text-sm text-[#1a1814]/50 hover:text-[#1a1814]">
          Home
        </Link>
      </header>
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">Disclaimer</h1>
        <p className="text-[13px] text-[#1a1814]/50 mb-8">Last updated: September 2026</p>

        <section className="space-y-4 text-[14px] leading-relaxed text-[#1a1814]/80">
          <h2 className="text-base font-semibold text-[#1a1814]">Health information</h2>
          <p>
            RiceTrack provides general wellness and nutrition estimates only. It is not a
            substitute for professional medical advice, diagnosis, or treatment. If you have a
            health condition, food allergy, or special dietary need, consult a clinician or
            registered dietitian.
          </p>

          <h2 className="text-base font-semibold text-[#1a1814] pt-4">Accuracy of estimates</h2>
          <p>
            Calories, macros, portions, and “health scores” are estimates. Asian composite dishes,
            shared plates, oils, and sauces vary widely. AI analysis can misidentify foods. Always
            review and correct logs.
          </p>

          <h2 className="text-base font-semibold text-[#1a1814] pt-4">Sensors & third-party data</h2>
          <p>
            Step counts and motion-based estimates on the web may be incomplete or inaccurate
            compared to dedicated wearables. External databases and APIs, when used, may contain
            errors.
          </p>

          <h2 className="text-base font-semibold text-[#1a1814] pt-4">No guarantees</h2>
          <p>
            We do not guarantee weight loss, health outcomes, or uninterrupted service. Use
            RiceTrack at your own judgment and risk.
          </p>
        </section>
      </main>
      <footer className="px-4 sm:px-6 py-8 border-t border-[#1a1814]/8 text-[11px] text-[#1a1814]/45 mt-8">
        <div className="mx-auto max-w-3xl flex flex-col sm:flex-row justify-between gap-3">
          <span>© {new Date().getFullYear()} RiceTrack</span>
          <div className="flex flex-wrap gap-4">
            <Link href="/terms">Terms</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/disclaimer">Disclaimer</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
