import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { loginContact } from "@/lib/diagnostic/auth.functions";
import { useAuth } from "@/lib/diagnostic/auth-context";
import { useSubscription } from "@/lib/diagnostic/subscription-context";
import { planFromTag } from "@/lib/diagnostic/checkout";
import { Hexagon, Mail, User, Loader2, ArrowRight, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Bula Creation — Sign In | AI Goal Execution System" },
      {
        name: "description",
        content:
          "Sign in to Bula Creation to access your 40-Point Creation Algorithm, track Creation Voltage, and execute with AI mentors.",
      },
      { property: "og:title", content: "Bula Creation — Sign In | AI Goal Execution System" },
      {
        property: "og:description",
        content:
          "Access your personal 40-Point Creation Algorithm, live Creation Voltage, and strategic AI mentorship.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: LoginComponent,
});

function LoginComponent() {
  const navigate = useNavigate();
  const { login, isAuthenticated, hydrated } = useAuth();
  const { activatePlan } = useSubscription();
  const doLogin = useServerFn(loginContact);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  // Already authenticated → bounce to the app.
  useEffect(() => {
    if (hydrated && isAuthenticated) navigate({ to: "/" });
  }, [hydrated, isAuthenticated, navigate]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setErr("Enter your email to continue.");
      return;
    }
    if (!name.trim()) {
      setErr("Enter your name to continue.");
      return;
    }
    setBusy(true);
    setErr(null);
    try {
      const res = await doLogin({ data: { email: email.trim(), name: name.trim() || undefined } });
      login({
        contactId: res.contactId,
        email: email.trim(),
        name: name.trim(),
        source: res.source,
      });

      // Super admin check or plan-tier tag auto-grant
      const isSuper =
        email.trim().toLowerCase() === "lalabalavu.jon@gmail.com" ||
        (res.tags ?? []).some((t) =>
          ["bula-super-admin", "bula-owner", "bula-coach-pro"].includes(t),
        );

      if (isSuper) {
        activatePlan("coach_pro", false);
      } else if ((res.tags ?? []).includes("bula-calibration")) {
        // One-time intensive: 60-day Coach-tier access (renewable each login
        // while the tag remains on the contact).
        activatePlan("coach", true);
        // Calibration trial window is 60 days, not 14 — override after activation.
        try {
          const raw = window.localStorage.getItem("creation-subscription-v1");
          if (raw) {
            const p = JSON.parse(raw);
            p.trialEndsAt = Date.now() + 60 * 24 * 60 * 60 * 1000;
            window.localStorage.setItem("creation-subscription-v1", JSON.stringify(p));
          }
        } catch {
          /* ignore */
        }
      } else {
        const tier = (res.tags ?? [])
          .map(planFromTag)
          .find((p): p is NonNullable<typeof p> => Boolean(p));
        if (tier) activatePlan(tier, false);
      }
      navigate({ to: "/" });
    } catch (e) {
      setErr((e as Error).message || "Login failed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="flex items-center gap-2.5">
            <img
              src="https://vibe.filesafe.space/1790355857187699269/attachments/afa0cbd8-a353-48b8-8ed0-ecc90a8d6967.png"
              alt="Bula Creation Golden Hexagon Logo"
              className="size-10 rounded-sm object-contain"
            />
            <div className="leading-tight">
              <div className="font-display text-lg font-bold tracking-tight text-foreground">
                BULA CREATION
              </div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-gold-soft">
                40-Point Algorithm
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-2xl">
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground">
            Enter Your Algorithm
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Enter your email to receive access. Your identity links your audits, trajectory, and AI
            coaching to a single profile.
          </p>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Name <span className="text-gold">*</span>
              </label>
              <div className="mt-1.5 flex items-center gap-2 rounded-md border border-input bg-background px-3">
                <User className="size-4 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  required
                  className="w-full bg-transparent py-2.5 text-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Email
              </label>
              <div className="mt-1.5 flex items-center gap-2 rounded-md border border-input bg-background px-3">
                <Mail className="size-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoFocus
                  className="w-full bg-transparent py-2.5 text-sm focus:outline-none"
                />
              </div>
            </div>

            {err && (
              <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                <span>{err}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {busy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ArrowRight className="size-4" />
              )}
              {busy ? "Entering…" : "Enter"}
            </button>
          </form>

          <p className="mt-4 text-center text-[11px] text-muted-foreground">
            No password. Your email is your key. Private by default — cloud sync stays off until you
            enable it.
          </p>
        </div>
      </div>
    </div>
  );
}
