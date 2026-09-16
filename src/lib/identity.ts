/**
 * Identity layer — Supabase cloud user is primary; local guest/Joe/Mel are fallbacks.
 */

import type { User, SupabaseClient } from "@supabase/supabase-js";
import {
  disableGuest,
  getSessionAccount,
  isLocalSession,
  type LocalAccountId,
} from "@/lib/guest";

export type CloudIdentity = {
  kind: "cloud";
  userId: string;
  email: string | null;
  displayName: string | null;
};

export type LocalIdentity = {
  kind: "local";
  accountId: LocalAccountId;
  name: string;
  paid: boolean;
};

export type Identity = CloudIdentity | LocalIdentity | { kind: "none" };

export function identityFromUser(user: User | null): CloudIdentity | null {
  if (!user) return null;
  const meta = user.user_metadata || {};
  const displayName =
    (typeof meta.display_name === "string" && meta.display_name) ||
    (typeof meta.full_name === "string" && meta.full_name) ||
    (user.email ? user.email.split("@")[0] : null);
  return {
    kind: "cloud",
    userId: user.id,
    email: user.email ?? null,
    displayName,
  };
}

/** Prefer cloud session; else local demo/guest. */
export async function resolveIdentity(
  supabase: SupabaseClient
): Promise<Identity> {
  try {
    const { data } = await supabase.auth.getUser();
    const cloud = identityFromUser(data.user);
    if (cloud) return cloud;
  } catch {
    /* offline / missing env */
  }

  if (isLocalSession()) {
    const acc = getSessionAccount();
    if (acc) {
      return {
        kind: "local",
        accountId: acc.id,
        name: acc.name,
        paid: acc.paid,
      };
    }
  }

  return { kind: "none" };
}

export function identityLabel(id: Identity): string {
  if (id.kind === "cloud") return id.displayName || id.email || "Account";
  if (id.kind === "local") return id.name;
  return "";
}

/** Ensure profiles row exists for a freshly signed-in user. */
export async function ensureCloudProfile(
  supabase: SupabaseClient,
  user: User
): Promise<void> {
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", user.id)
    .maybeSingle();

  if (data?.id) return;

  const display =
    (user.user_metadata?.display_name as string) ||
    (user.email ? user.email.split("@")[0] : "Member");

  await supabase.from("profiles").upsert(
    {
      id: user.id,
      email: user.email,
      display_name: display,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" }
  );
}

/**
 * After successful cloud login: drop local demo session so data scopes don't mix.
 */
export function clearLocalIdentityForCloud(): void {
  try {
    disableGuest();
    localStorage.removeItem("ricetrack_local_session");
  } catch {
    /* ignore */
  }
}

export async function signOutIdentity(supabase: SupabaseClient): Promise<void> {
  try {
    await supabase.auth.signOut();
  } catch {
    /* ignore */
  }
  clearLocalIdentityForCloud();
  try {
    disableGuest();
  } catch {
    /* ignore */
  }
}
