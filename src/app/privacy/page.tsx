import Link from "next/link";
import { RiceLogo } from "@/components/RiceLogo";

export const metadata = {
  title: "Privacy Policy — RiceTrack",
  description: "Privacy Policy for RiceTrack",
};

export default function PrivacyPage() {
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
        <h1 className="text-2xl font-semibold tracking-tight mb-2">Privacy Policy</h1>
        <p className="text-[13px] text-[#1a1814]/50 mb-8">Last updated: September 2026</p>

        <section className="space-y-4 text-[14px] leading-relaxed text-[#1a1814]/80">
          <p>
            This Privacy Policy describes how RiceTrack handles information when you use our
            website and app.
          </p>

          <h2 className="text-base font-semibold text-[#1a1814] pt-4">1. Information we process</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              <strong>Account & profile:</strong> email (if you sign in), name, optional height,
              weight, activity level, and goals.
            </li>
            <li>
              <strong>Meal logs:</strong> photos you upload, text descriptions, macros you save or
              edit, and related timestamps.
            </li>
            <li>
              <strong>Activity & wellness:</strong> steps, movement, water, sleep, and energy you
              choose to log (often stored on-device for guest/demo users).
            </li>
            <li>
              <strong>Technical data:</strong> device type, browser, approximate region, and basic
              diagnostics needed to run the Service (e.g. via hosting providers).
            </li>
          </ul>

          <h2 className="text-base font-semibold text-[#1a1814] pt-4">2. How we use it</h2>
          <p>
            To provide calorie and macro estimates, save your diary, improve recognition (including
            optional feedback such as thumbs up/down), personalize targets, and keep the Service
            secure and reliable.
          </p>

          <h2 className="text-base font-semibold text-[#1a1814] pt-4">3. Local / guest data</h2>
          <p>
            Guest and demo profiles (e.g. Joe, Mel) may store data primarily in your browser’s
            local storage. Clearing site data or switching devices can remove that information. It
            is not a full cloud backup unless you use a signed-in account with server storage.
          </p>

          <h2 className="text-base font-semibold text-[#1a1814] pt-4">4. AI and third parties</h2>
          <p>
            Meal photos and text may be sent to AI providers (for example via OpenRouter) to
            analyze food. Hosting may use providers such as Vercel and Supabase. Those providers
            process data under their own terms and security practices. Avoid uploading sensitive
            images of other people without permission.
          </p>

          <h2 className="text-base font-semibold text-[#1a1814] pt-4">5. Cookies & similar tech</h2>
          <p>
            We use essential storage for session, theme preference, and app functionality. Analytics
            cookies, if introduced later, will be described here and constrained where required by
            law.
          </p>

          <h2 className="text-base font-semibold text-[#1a1814] pt-4">6. Retention</h2>
          <p>
            We keep account and log data as long as needed to provide the Service or as required by
            law. You may request deletion of account data where server-side accounts are supported.
          </p>

          <h2 className="text-base font-semibold text-[#1a1814] pt-4">7. Your choices</h2>
          <p>
            You can edit or delete meal entries in the app, clear browser data for local sessions,
            and stop using the Service at any time. Contact us for account-related deletion
            requests when cloud accounts are enabled.
          </p>

          <h2 className="text-base font-semibold text-[#1a1814] pt-4">8. Children</h2>
          <p>
            The Service is not directed at children under 13 (or the minimum age in your
            jurisdiction). Do not use RiceTrack if you are under that age.
          </p>

          <h2 className="text-base font-semibold text-[#1a1814] pt-4">9. International users</h2>
          <p>
            Data may be processed in countries where our providers operate. By using the Service
            you understand that transfers may occur subject to applicable safeguards.
          </p>

          <h2 className="text-base font-semibold text-[#1a1814] pt-4">10. Changes & contact</h2>
          <p>
            We may update this Policy. The “Last updated” date will change when we do. Contact us
            through channels listed on the RiceTrack site for privacy questions.
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
