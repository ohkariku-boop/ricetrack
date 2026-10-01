# P0 setup (AI quota + Supabase stability)

## 1. Server AI quota (required before traffic)

1. Open **Supabase → SQL Editor**
2. Paste and run the contents of `supabase/ai_scan_usage.sql`
3. Confirm table `public.ai_scan_usage` exists
4. In **Vercel → Project → Settings → Environment Variables**, ensure:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (service role — never expose to browser)
   - `OPENROUTER_API_KEY`
   - `NEXT_PUBLIC_APP_URL` = `https://ricetrack.vercel.app`

Without the service role key + table, `/api/analyze` returns **503** (fail closed — no free OpenRouter spend).

Optional: set `AI_QUOTA_DISABLED=1` only for local debugging (never in production).

## 2. Pro billing (honest)

- Checkout is **waitlist only** — no mock “Pro unlocked”
- Stripe not wired yet
- Free plan: **5 AI scans / week**, enforced on the server

## 3. Keep Supabase awake (free tier)

Free projects pause after ~7 days of inactivity.

**Do this once:**

1. Supabase → **Authentication → URL Configuration**
   - Site URL: `https://ricetrack.vercel.app`
   - Redirect URLs:  
     `https://ricetrack.vercel.app/**`  
     `https://ricetrack.vercel.app/auth/callback`
2. **Authentication → Email Templates → Magic Link** — brand as RiceTrack
3. Hit the app weekly, or upgrade to Pro if you need always-on
4. Optional: cron ping `https://ricetrack.vercel.app/api/library` once a day (keeps project active)

## 4. Deploy

```bash
git add -A && git commit -m "P0: server AI quota + honest Pro waitlist" && git push
```

Then re-run the SQL if not done yet, and redeploy Vercel.
