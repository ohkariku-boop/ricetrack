"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Loader2,
  Check,
  X,
  Upload,
  RefreshCw,
  LogOut,
  Shield,
  Pencil,
  Save,
} from "lucide-react";
import { RiceLogo } from "@/components/RiceLogo";

type Suggestion = {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion?: string | null;
  cuisine?: string | null;
  status: string;
  source?: string;
  created_at?: string;
  user_id?: string | null;
};

type Tab = "pending" | "approved" | "rejected" | "published" | "all";

type Draft = {
  name: string;
  cuisine: string;
  portion: string;
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
};

function toDraft(s: Suggestion): Draft {
  return {
    name: s.name || "",
    cuisine: s.cuisine || "",
    portion: s.portion || "",
    calories: String(s.calories ?? 0),
    protein: String(s.protein ?? 0),
    carbs: String(s.carbs ?? 0),
    fat: String(s.fat ?? 0),
  };
}

export default function AdminLibraryPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);
  const [tab, setTab] = useState<Tab>("pending");
  const [items, setItems] = useState<Suggestion[]>([]);
  const [counts, setCounts] = useState({ pending: 0, approved: 0 });
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (status: Tab) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/library-suggestions?status=${status}`, {
        credentials: "include",
      });
      if (res.status === 401) {
        setAuthed(false);
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || data.hint || "Failed to load");
        setItems([]);
      } else {
        setAuthed(true);
        setItems(data.items || []);
        if (data.counts) setCounts(data.counts);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load("pending");
  }, [load]);

  useEffect(() => {
    if (authed) load(tab);
  }, [tab, authed, load]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError(null);
    const res = await fetch("/api/admin/library-suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ action: "login", password }),
    });
    const data = await res.json();
    setLoggingIn(false);
    if (!res.ok) {
      setLoginError(data.error || "Login failed");
      return;
    }
    setPassword("");
    setAuthed(true);
    load("pending");
  };

  const act = async (action: string, extra: Record<string, unknown> = {}) => {
    setMsg(null);
    setError(null);
    if (extra.id) setBusyId(String(extra.id));
    const res = await fetch("/api/admin/library-suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ action, ...extra }),
    });
    const data = await res.json();
    setBusyId(null);
    if (!res.ok) {
      setError(data.error || "Action failed");
      return false;
    }
    if (action === "publish_approved") {
      setMsg(`Published ${data.inserted || 0} of ${data.approved || 0} approved`);
    } else if (action === "approve_all_pending") {
      setMsg(`Approved ${data.approved || 0} pending`);
    } else if (action === "update") {
      setMsg("Macros saved");
      setEditingId(null);
      setDraft(null);
    } else {
      setMsg("Saved");
    }
    await load(tab);
    return true;
  };

  const startEdit = (s: Suggestion) => {
    setEditingId(s.id);
    setDraft(toDraft(s));
    setMsg(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
  };

  const saveEdit = async (id: string) => {
    if (!draft) return;
    const name = draft.name.trim();
    if (!name) {
      setError("Name is required");
      return;
    }
    await act("update", {
      id,
      name,
      cuisine: draft.cuisine.trim() || null,
      portion: draft.portion.trim() || null,
      calories: Number(draft.calories) || 0,
      protein: Number(draft.protein) || 0,
      carbs: Number(draft.carbs) || 0,
      fat: Number(draft.fat) || 0,
    });
  };

  const logout = async () => {
    await fetch("/api/admin/library-suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ action: "logout" }),
    });
    setAuthed(false);
    setItems([]);
  };

  if (!authed) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
        <div className="w-full max-w-sm space-y-5">
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <RiceLogo size={44} />
            </div>
            <h1 className="text-xl font-semibold tracking-tight flex items-center justify-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Library admin
            </h1>
            <p className="text-sm text-muted-foreground">
              Approve and edit user dish suggestions before they go public.
            </p>
          </div>
          <form onSubmit={login} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin password"
              className="input-modern w-full px-4 py-3"
              autoComplete="current-password"
              required
            />
            <button type="submit" disabled={loggingIn} className="btn-primary w-full h-11">
              {loggingIn ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Enter"}
            </button>
          </form>
          {loginError && <p className="text-sm text-red-600 text-center">{loginError}</p>}
          <p className="text-[11px] text-muted-foreground text-center leading-relaxed">
            Set <code className="text-xs">ADMIN_SECRET</code> or{" "}
            <code className="text-xs">CRON_SECRET</code>. Needs{" "}
            <code className="text-xs">SUPABASE_SERVICE_ROLE_KEY</code>. Optional email:{" "}
            <code className="text-xs">RESEND_API_KEY</code>.
          </p>
          <p className="text-center text-xs">
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              ← Site
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "pending", label: `Pending (${counts.pending})` },
    { id: "approved", label: `Approved (${counts.approved})` },
    { id: "published", label: "Published" },
    { id: "rejected", label: "Rejected" },
    { id: "all", label: "All" },
  ];

  const fieldClass =
    "w-full rounded-lg border border-border bg-background px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto max-w-3xl px-4 h-14 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <RiceLogo size={24} />
            <div className="leading-tight min-w-0">
              <div className="font-semibold text-sm truncate">Library admin</div>
              <div className="text-[11px] text-muted-foreground">
                Edit macros · approve · publish
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => load(tab)}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
              aria-label="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <button
              type="button"
              onClick={logout}
              className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
              aria-label="Log out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-5 space-y-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                setTab(t.id);
                cancelEdit();
              }}
              className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${
                tab === t.id
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="btn-secondary h-9 px-3 text-xs"
            onClick={() => act("approve_all_pending")}
            disabled={counts.pending === 0}
          >
            Approve all pending
          </button>
          <button
            type="button"
            className="btn-primary h-9 px-3 text-xs flex items-center gap-1.5"
            onClick={() => act("publish_approved")}
            disabled={counts.approved === 0}
          >
            <Upload className="w-3.5 h-3.5" />
            Publish approved to library
          </button>
        </div>

        {msg && (
          <div className="rounded-xl bg-primary/10 text-primary text-sm px-3 py-2">{msg}</div>
        )}
        {error && (
          <div className="rounded-xl bg-red-500/10 text-red-600 text-sm px-3 py-2">{error}</div>
        )}

        {loading && items.length === 0 ? (
          <div className="flex justify-center py-16 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground py-16">
            No {tab === "all" ? "" : tab} suggestions.
          </p>
        ) : (
          <ul className="space-y-3">
            {items.map((s) => {
              const isEditing = editingId === s.id && draft;
              return (
                <li
                  key={s.id}
                  className="rounded-2xl border border-border bg-card p-4 space-y-3"
                >
                  {isEditing ? (
                    <div className="space-y-2.5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <label className="block space-y-1 sm:col-span-2">
                          <span className="text-[11px] font-medium text-muted-foreground">
                            Name
                          </span>
                          <input
                            className={fieldClass}
                            value={draft.name}
                            onChange={(e) =>
                              setDraft({ ...draft, name: e.target.value })
                            }
                          />
                        </label>
                        <label className="block space-y-1">
                          <span className="text-[11px] font-medium text-muted-foreground">
                            Cuisine
                          </span>
                          <input
                            className={fieldClass}
                            value={draft.cuisine}
                            onChange={(e) =>
                              setDraft({ ...draft, cuisine: e.target.value })
                            }
                            placeholder="e.g. malay"
                          />
                        </label>
                        <label className="block space-y-1">
                          <span className="text-[11px] font-medium text-muted-foreground">
                            Portion
                          </span>
                          <input
                            className={fieldClass}
                            value={draft.portion}
                            onChange={(e) =>
                              setDraft({ ...draft, portion: e.target.value })
                            }
                            placeholder="1 serving"
                          />
                        </label>
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        {(
                          [
                            ["calories", "kcal"],
                            ["protein", "P"],
                            ["carbs", "C"],
                            ["fat", "F"],
                          ] as const
                        ).map(([key, label]) => (
                          <label key={key} className="block space-y-1">
                            <span className="text-[11px] font-medium text-muted-foreground">
                              {label}
                            </span>
                            <input
                              type="number"
                              inputMode="decimal"
                              className={fieldClass}
                              value={draft[key]}
                              onChange={(e) =>
                                setDraft({ ...draft, [key]: e.target.value })
                              }
                            />
                          </label>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        <button
                          type="button"
                          disabled={busyId === s.id}
                          onClick={() => saveEdit(s.id)}
                          className="inline-flex items-center gap-1 h-8 px-3 rounded-full bg-primary text-primary-foreground text-xs font-medium"
                        >
                          <Save className="w-3.5 h-3.5" />
                          Save macros
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className="h-8 px-3 rounded-full border border-border text-xs font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="font-semibold text-[15px] truncate">{s.name}</div>
                          <div className="text-[12px] text-muted-foreground mt-0.5">
                            {s.cuisine || "cuisine?"} · {s.portion || "1 serving"} ·{" "}
                            <span className="uppercase tracking-wide">{s.status}</span>
                          </div>
                        </div>
                        <div className="text-right text-[12px] tabular-nums text-muted-foreground shrink-0">
                          <div>{Math.round(Number(s.calories))} kcal</div>
                          <div>
                            P{Number(s.protein).toFixed(0)} C{Number(s.carbs).toFixed(0)} F
                            {Number(s.fat).toFixed(0)}
                          </div>
                        </div>
                      </div>
                      {s.created_at && (
                        <div className="text-[11px] text-muted-foreground">
                          {new Date(s.created_at).toLocaleString()}
                        </div>
                      )}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {s.status !== "published" && (
                          <button
                            type="button"
                            onClick={() => startEdit(s)}
                            className="inline-flex items-center gap-1 h-8 px-3 rounded-full border border-border text-xs font-medium"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            Edit
                          </button>
                        )}
                        {s.status === "pending" && (
                          <>
                            <button
                              type="button"
                              disabled={busyId === s.id}
                              onClick={() => act("approve", { id: s.id })}
                              className="inline-flex items-center gap-1 h-8 px-3 rounded-full bg-emerald-600 text-white text-xs font-medium"
                            >
                              <Check className="w-3.5 h-3.5" />
                              Approve
                            </button>
                            <button
                              type="button"
                              disabled={busyId === s.id}
                              onClick={() => act("reject", { id: s.id })}
                              className="inline-flex items-center gap-1 h-8 px-3 rounded-full border border-border text-xs font-medium"
                            >
                              <X className="w-3.5 h-3.5" />
                              Reject
                            </button>
                          </>
                        )}
                        {s.status === "approved" && (
                          <button
                            type="button"
                            disabled={busyId === s.id}
                            onClick={() => act("publish_approved")}
                            className="inline-flex items-center gap-1 h-8 px-3 rounded-full bg-primary text-primary-foreground text-xs font-medium"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            Publish batch
                          </button>
                        )}
                        {s.status === "rejected" && (
                          <button
                            type="button"
                            disabled={busyId === s.id}
                            onClick={() => act("approve", { id: s.id })}
                            className="text-xs text-primary font-medium"
                          >
                            Restore to approved
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <p className="text-[11px] text-muted-foreground text-center pt-4 leading-relaxed">
          Edit name and macros before approve. Publish writes to{" "}
          <code className="text-[10px]">food_library</code>. New suggestions can email you if{" "}
          <code className="text-[10px]">RESEND_API_KEY</code> is set.
        </p>
      </main>
    </div>
  );
}
