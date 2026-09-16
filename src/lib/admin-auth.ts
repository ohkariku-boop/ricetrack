/** Shared admin gate — password from env, session token in cookie/header */

export function getAdminSecret(): string | null {
  return (
    process.env.ADMIN_SECRET ||
    process.env.CRON_SECRET ||
    process.env.LIBRARY_CRON_SECRET ||
    null
  );
}

export function isAdminAuthorized(req: Request): boolean {
  const expected = getAdminSecret();
  if (!expected) return false;

  const header = req.headers.get("authorization") || "";
  const bearer = header.replace(/^Bearer\s+/i, "").trim();
  if (bearer && bearer === expected) return true;

  const url = new URL(req.url);
  const q = url.searchParams.get("secret") || url.searchParams.get("key");
  if (q && q === expected) return true;

  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)rt_admin=([^;]+)/);
  if (match && decodeURIComponent(match[1]) === expected) return true;

  return false;
}
