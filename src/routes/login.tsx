import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { requestLoginCode, verifyLoginCode } from "@/lib/diagnostic/auth.functions";
import { useAuth } from "@/lib/diagnostic/auth-context";
export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Bula Creation — Secure Sign In" }] }),
  component: Login,
});
function Login() {
  const navigate = useNavigate();
  const { isAuthenticated, refresh, error: sessionError } = useAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (isAuthenticated) void navigate({ to: "/" });
  }, [isAuthenticated, navigate]);
  async function submit(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);
    try {
      if (!sent) {
        await requestLoginCode({ data: { email } });
        setSent(true);
      } else {
        await verifyLoginCode({ data: { email, name, code } });
        await refresh();
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <section className="panel w-full max-w-md p-6 sm:p-8">
        <p className="text-xs tracking-widest text-gold">BULA CREATION</p>
        <h1 className="mt-3 font-display text-2xl font-bold">
          {sent ? "Check your email" : "Welcome to Bula Creation"}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {sent
            ? `Enter the verification code sent to ${email}. Check your spam folder too.`
            : "Sign in or create an account with a one-time email code. No password needed."}
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="block text-sm">
            Your name
            <input
              className="mt-2 w-full rounded-md border border-input bg-background p-3"
              autoComplete="name"
              required
              maxLength={120}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={busy || sent}
            />
          </label>
          <label className="block text-sm">
            Email
            <input
              className="mt-2 w-full rounded-md border border-input bg-background p-3"
              type="email"
              autoComplete="email"
              required
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={busy || sent}
            />
          </label>
          {sent && (
            <label className="block text-sm">
              Verification code
              <input
                className="mt-2 w-full rounded-md border border-input bg-background p-3"
                autoComplete="one-time-code"
                inputMode="numeric"
                pattern="[0-9]{6,10}"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
            </label>
          )}
          {(error || sessionError) && (
            <p role="alert" className="text-sm text-destructive">
              {error || sessionError}
            </p>
          )}
          <button
            disabled={busy}
            className="w-full rounded-md bg-primary p-3 font-semibold text-primary-foreground disabled:opacity-50"
          >
            {busy ? "Please wait…" : sent ? "Verify and sign in" : "Send verification code"}
          </button>
          {sent && (
            <button
              type="button"
              disabled={busy}
              className="w-full text-sm text-gold"
              onClick={() => {
                setSent(false);
                setCode("");
                setError(null);
              }}
            >
              Use another email or request a new code
            </button>
          )}
        </form>
        <p className="mt-5 text-xs text-muted-foreground">
          Private Mode keeps your progress on this device. You choose when to save it to your
          account.
        </p>
      </section>
    </main>
  );
}
