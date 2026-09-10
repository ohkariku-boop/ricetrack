import Link from "next/link";
import { RiceLogo } from "@/components/RiceLogo";

export const metadata = {
  title: "Terms of Service — RiceTrack",
  description: "Terms of Service for RiceTrack",
};

export default function TermsPage() {
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
      <main className="mx-auto max-w-3xl px-4 sm:px-6 py-10 prose prose-sm prose-neutral">
        <h1 className="text-2xl font-semibold tracking-tight mb-2">Terms of Service</h1>
        <p className="text-[13px] text-[#1a1814]/50 mb-8">Last updated: September 2026</p>

        <section className="space-y-4 text-[14px] leading-relaxed text-[#1a1814]/80">
          <p>
            Welcome to RiceTrack. By accessing or using our website, progressive web app, or related
            services (the “Service”), you agree to these Terms of Service.
          </p>

          <h2 className="text-base font-semibold text-[#1a1814] pt-4">1. What RiceTrack is</h2>
          <p>
            RiceTrack is an AI-assisted nutrition and activity logging tool focused on Asian and
            global cuisines. Estimates of calories, macros, and health scores are approximate and
            provided for personal informational use only.
          </p>

          <h2 className="text-base font-semibold text-[#1a1814] pt-4">2. Not medical advice</h2>
          <p>
            RiceTrack is not a medical device and does not provide medical, dietary, or clinical
            advice. Always consult a qualified professional before making health or diet decisions.
            Do not rely solely on the Service for managing medical conditions.
          </p>

          <h2 className="text-base font-semibold text-[#1a1814] pt-4">3. Your account & data</h2>
          <p>
            You may use the Service as a guest or with a local/demo account, or with authentication
            where offered. You are responsible for activity under your session and for the accuracy
            of information you enter. Demo accounts (e.g. Joe / Mel) store data on the device unless
            otherwise stated.
          </p>

          <h2 className="text-base font-semibold text-[#1a1814] pt-4">4. Acceptable use</h2>
          <p>
            You agree not to misuse the Service, attempt to disrupt it, scrape it at scale without
            permission, or use it for unlawful purposes. We may suspend access that harms the
            Service or other users.
          </p>

          <h2 className="text-base font-semibold text-[#1a1814] pt-4">5. AI content</h2>
          <p>
            Food recognition and nutrition values may be generated or assisted by third-party AI
            models. Results can be wrong. You can and should edit logs before relying on them.
          </p>

          <h2 className="text-base font-semibold text-[#1a1814] pt-4">6. Intellectual property</h2>
          <p>
            RiceTrack branding, UI, and original content belong to RiceTrack. Food library data may
            combine open sources and our own curation. You retain rights to photos and content you
            upload, and grant us a limited license to process them to provide the Service.
          </p>

          <h2 className="text-base font-semibold text-[#1a1814] pt-4">7. Disclaimer of warranties</h2>
          <p>
            The Service is provided “as is” without warranties of any kind, including accuracy,
            fitness for a particular purpose, or uninterrupted availability.
          </p>

          <h2 className="text-base font-semibold text-[#1a1814] pt-4">8. Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, RiceTrack and its operators are not liable for
            indirect, incidental, or consequential damages arising from use of the Service.
          </p>

          <h2 className="text-base font-semibold text-[#1a1814] pt-4">9. Changes</h2>
          <p>
            We may update these Terms. Continued use after changes means you accept the updated
            Terms. Material changes may be highlighted in the app or on the site.
          </p>

          <h2 className="text-base font-semibold text-[#1a1814] pt-4">10. Contact</h2>
          <p>
            Questions about these Terms: use the contact path published on the RiceTrack site when
            available, or reach out via the project’s published channels.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}

function SiteFooter() {
  return (
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
  );
}
