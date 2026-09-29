// Creation Calibration Intensive — the one-time, fully AI-led deep session.
// Unlocked by the `bula-calibration` tag (60-day Coach access). An autonomous
// agent — the Calibration Director — conducts the session: diagnostic →
// synthesis → commitment, then writes the Creation Plan into the app.

import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { useServerFn } from "@tanstack/react-start";
import { useDiagnostic } from "@/lib/diagnostic/context";
import { useSubscription } from "@/lib/diagnostic/subscription-context";
import { useAuth } from "@/lib/diagnostic/auth-context";
import { buildCoachContext, formatContextBlock } from "@/lib/diagnostic/coach-context";
import { askCoach } from "@/lib/diagnostic/coach.functions";
import { generateCreationPlan } from "@/lib/diagnostic/creation-plan.functions";
import { zoneMeta } from "@/lib/diagnostic/scoring";
import {
  parseAssignment,
  saveCommitments,
  loadCommitments,
  type Commitment,
} from "@/lib/diagnostic/protocol";
import { recordIntervention } from "@/lib/diagnostic/interventions";
import { cn } from "@/lib/utils";
import {
  Crosshair,
  Loader2,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Rocket,
  Send,
  ArrowLeft,
} from "lucide-react";

export const Route = createFileRoute("/calibration")({
  head: () => ({
    meta: [
      { title: "Creation Calibration Intensive — Bula Creation" },
      {
        name: "description",
        content:
          "A one-time, fully AI-led deep session. The Calibration Director diagnoses your top constraint, writes your Creation Plan, and launches a 60-day accountability loop.",
      },
      { property: "og:title", content: "Creation Calibration Intensive — Bula Creation" },
      {
        property: "og:description",
        content:
          "Autonomous AI intensive: diagnostic, written Creation Plan, and 60-day accountability loop included.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CalibrationComponent,
});

type Phase = "intro" | "session" | "plan";

function CalibrationComponent() {
  const { result, chiefAim } = useDiagnostic();
  const { entitlements } = useSubscription();
  const { email } = useAuth();
  const navigate = useNavigate();
  const ask = useServerFn(askCoach);
  const generatePlan = useServerFn(generateCreationPlan);

  const [phase, setPhase] = useState<Phase>("intro");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turn, setTurn] = useState(0);
  const [plan, setPlan] = useState<Awaited<ReturnType<typeof generatePlan>> | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const zone = zoneMeta(result.zone);
  const topBottleneck = result.bottlenecks[0];
  const hasAccess =
    entitlements.plan === "coach" ||
    entitlements.plan === "coach_pro" ||
    email?.trim().toLowerCase() === "lalabalavu.jon@gmail.com";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, busy]);

  async function runTurn(userText: string) {
    if (!userText.trim() || busy) return;
    const next = [...messages, { role: "user" as const, content: userText.trim() }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setError(null);

    const ctx = buildCoachContext(result, chiefAim, "none");
    const contextBlock = formatContextBlock(ctx);

    try {
      const res = await ask({
        data: {
          persona: "calibration",
          messages: next.slice(-12),
          context: contextBlock,
        },
      });
      if (!res.ok) {
        setError(res.error);
      } else {
        setMessages([...next, { role: "assistant", content: res.content }]);
        setTurn((t) => t + 1);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function finalizePlan() {
    setBusy(true);
    setError(null);
    if (!topBottleneck) {
      setError("No bottleneck detected — complete your audit first.");
      setBusy(false);
      return;
    }
    const ctx = buildCoachContext(result, chiefAim, "none");
    try {
      const res = await generatePlan({
        data: {
          persona: "calibration",
          philosophy: "performance",
          voltage: result.finalRounded,
          zone: result.zone,
          chiefAim: chiefAim.text || "(not yet defined)",
          believability: chiefAim.believability,
          constraintId: topBottleneck.point.id,
          constraintName: topBottleneck.point.name,
          constraintTier:
            ["Friction", "Emerging", "Aligned", "Mastered"][
              [0, 0.33, 0.66, 1].indexOf(topBottleneck.tier)
            ] || "Friction",
          openCommitments: 0,
          contextBlock: formatContextBlock(ctx),
        },
      });
      setPlan(res);
      setPhase("plan");
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  function beginAccountability() {
    if (!plan) return;
    const existing = loadCommitments();
    const newCmts: Commitment[] = [];
    const now = Date.now();
    const { commitment } = parseAssignment(`ASSIGNMENT: ${plan.intervention72h}`, "calibration");
    if (commitment) {
      newCmts.push(commitment);
      recordIntervention({
        commitmentId: commitment.id,
        label: commitment.text,
        source: "calibration",
        pointId: plan.constraintId,
        voltageAtPrescription: result.finalRounded,
      });
    }
    plan.thisWeek.forEach((action) => {
      const c = parseAssignment(`ASSIGNMENT: ${action}`, "calibration").commitment;
      if (c) {
        c.dueTs = now + 7 * 24 * 60 * 60 * 1000;
        newCmts.push(c);
        recordIntervention({
          commitmentId: c.id,
          label: c.text,
          source: "calibration",
          pointId: plan.constraintId,
          voltageAtPrescription: result.finalRounded,
        });
      }
    });
    saveCommitments([...newCmts, ...existing]);
    navigate({ to: "/trajectory" });
  }

  // ── Access gate ────────────────────────────────────────────────────────────
  if (!hasAccess) {
    return (
      <div className="mx-auto max-w-lg text-center">
        <div className="panel gold-glow p-8">
          <AlertCircle className="mx-auto size-8 text-gold" />
          <h1 className="mt-4 font-display text-xl font-bold">Calibration Intensive</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            The Creation Calibration Intensive is a one-time £299 AI-led deep session. It grants 60
            days of Coach-tier access and launches a 60-day accountability loop.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              to="/checkout/calibration"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-gold px-6 py-2.5 text-sm font-bold text-background transition-colors hover:bg-gold-bright"
            >
              Enter the Intensive <ArrowRight className="size-4" />
            </Link>
            <Link to="/pricing" className="text-xs text-muted-foreground hover:text-gold">
              Or see subscription plans →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Intro ──────────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div className="mx-auto max-w-2xl">
        <div className="panel gold-glow p-8">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
              <Crosshair className="size-6 text-gold" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-gold-soft">
                Fully AI-led · One-time
              </span>
              <h1 className="font-display text-xl font-bold">Creation Calibration Intensive</h1>
            </div>
          </div>

          <p className="mt-5 text-sm text-muted-foreground">
            You're entering a paid deep session conducted entirely by the{" "}
            <span className="text-foreground">Calibration Director</span> — an autonomous AI agent.
            It will diagnose the single constraint capping your Creation Voltage, write your
            Creation Plan, and launch a 60-day accountability loop.
          </p>

          <div className="mt-6 space-y-3">
            <SessionStep
              n={1}
              title="Diagnostic"
              desc="The Director probes the gap between your Chief Aim and current Voltage — one sharp question at a time."
            />
            <SessionStep
              n={2}
              title="Synthesis"
              desc="It names your primary constraint and frames the 60-day loop: weekly re-audit, 48-hour assignments, trajectory tracking."
            />
            <SessionStep
              n={3}
              title="Creation Plan"
              desc="A written plan — 72h intervention, this week's actions, distractions to avoid — committed into the app."
            />
          </div>

          <div className="mt-6 rounded-md border border-border bg-muted/30 p-4 text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Your live context:</span> Voltage{" "}
            <span className="text-gold">{result.finalRounded.toLocaleString()}</span> · {zone.label}
            {topBottleneck && (
              <>
                {" "}
                · top constraint{" "}
                <span className="text-foreground">
                  #{topBottleneck.point.id} {topBottleneck.point.name}
                </span>
              </>
            )}
          </div>

          <button
            onClick={() => {
              setPhase("session");
              // Director opens the session automatically.
              runTurn("I'm ready. Begin my calibration intensive.");
            }}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 gold-glow"
          >
            <Rocket className="size-4" /> Begin the Intensive
          </button>
        </div>
      </div>
    );
  }

  // ── Plan ───────────────────────────────────────────────────────────────────
  if (phase === "plan" && plan) {
    return (
      <div className="mx-auto max-w-2xl space-y-5">
        <div className="flex items-center gap-3">
          <Link
            to="/calibration"
            onClick={(e) => {
              e.preventDefault();
              setPhase("session");
            }}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-gold"
          >
            <ArrowLeft className="size-3.5" /> Back to session
          </Link>
        </div>

        <div className="panel gold-glow p-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-5 text-gold" />
            <h1 className="font-display text-lg font-semibold">Your Creation Plan</h1>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Written by the Calibration Director from your live diagnostic.
          </p>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Chief Aim
              </div>
              <div className="mt-1 text-sm font-medium text-foreground">{plan.chiefAim}</div>
            </div>
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Creation Voltage
              </div>
              <div className="mt-1 font-display text-lg font-bold tabular-nums text-gold">
                {plan.voltage.toLocaleString()}{" "}
                <span className="text-xs font-normal text-muted-foreground">— {zone.label}</span>
              </div>
            </div>
          </div>

          <div className="mt-3 rounded-md border border-gold/30 bg-gold/5 p-4">
            <div className="text-[10px] uppercase tracking-wider text-gold-soft">
              Primary Constraint
            </div>
            <div className="mt-1 text-sm font-semibold text-foreground">
              Point #{plan.constraintId} — {plan.constraintName}
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{plan.why}</p>
          </div>

          <div className="mt-3 rounded-md border border-border bg-card p-4">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              72-Hour Intervention
            </div>
            <p className="mt-1.5 text-sm text-foreground">{plan.intervention72h}</p>
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md border border-border bg-card p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                This Week
              </div>
              <ul className="mt-2 space-y-1.5">
                {plan.thisWeek.map((a, i) => (
                  <li key={i} className="flex gap-2 text-xs text-foreground">
                    <span className="text-gold-soft">{i + 1}.</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-md border border-border bg-card p-4">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Do NOT Focus On
              </div>
              <ul className="mt-2 space-y-1.5">
                {plan.doNotFocusOn.map((a, i) => (
                  <li key={i} className="flex gap-2 text-xs text-muted-foreground">
                    <span>—</span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button
            onClick={beginAccountability}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 gold-glow"
          >
            <Rocket className="size-4" /> Launch 60-Day Accountability Loop
          </button>
        </div>
      </div>
    );
  }

  // ── Session ─────────────────────────────────────────────────────────────────
  // Phase derivation: Diagnostic (turns 0–4) → Synthesis (turn 5+) → Plan.
  const STEPS = ["Diagnostic", "Synthesis", "Plan"] as const;
  const activeStep = phase === "plan" ? 2 : turn < 5 ? 0 : 1;

  return (
    <div className="mx-auto flex max-w-2xl flex-col" style={{ minHeight: "70vh" }}>
      <CalibrationProgress steps={STEPS} active={activeStep} turn={turn} />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-full border border-gold/40 bg-gold/10">
            <Crosshair className="size-5 text-gold" />
          </div>
          <div>
            <h1 className="font-display text-base font-semibold">Calibration Director</h1>
            <p className="text-[10px] uppercase tracking-wider text-gold-soft">
              Intensive in progress · Turn {turn} · {STEPS[activeStep]}
            </p>
          </div>
        </div>
        <button
          onClick={finalizePlan}
          disabled={busy || !topBottleneck}
          className="inline-flex items-center gap-1.5 rounded-md border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-semibold text-gold transition-colors hover:bg-gold/20 disabled:opacity-50"
        >
          <Sparkles className="size-3.5" /> Generate Plan
        </button>
      </div>

      <div
        ref={scrollRef}
        className="mt-4 flex-1 space-y-3 overflow-y-auto rounded-lg border border-border bg-muted/20 p-4"
        style={{ maxHeight: "52vh" }}
      >
        {messages.length === 0 && !busy && (
          <p className="text-sm text-muted-foreground">The Director is preparing your session…</p>
        )}
        {messages.map((m, i) => (
          <div
            key={i}
            className={cn(
              "max-w-[85%] rounded-lg px-3.5 py-2.5 text-sm",
              m.role === "assistant"
                ? "border border-gold/30 bg-gold/5 text-foreground"
                : "ml-auto bg-muted text-foreground/90",
            )}
          >
            <div className="mb-1 text-[9px] uppercase tracking-wider text-muted-foreground">
              {m.role === "assistant" ? "Director" : "You"}
            </div>
            {m.content}
          </div>
        ))}
        {busy && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin text-gold" />
            The Director is working…
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          runTurn(input);
        }}
        className="mt-3 flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Respond to the Director…"
          className="flex-1 rounded-md border border-input bg-background px-3 py-2.5 text-sm focus:outline-none"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          <Send className="size-4" />
        </button>
      </form>
      <p className="mt-2 text-[11px] text-muted-foreground">
        When the diagnostic is complete, tap <span className="text-gold">Generate Plan</span> to
        write your Creation Plan and launch the 60-day loop.
      </p>
    </div>
  );
}

function SessionStep({ n, title, desc }: { n: number; title: string; desc: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-xs font-bold text-gold">
        {n}
      </div>
      <div>
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="mt-0.5 text-xs text-muted-foreground">{desc}</div>
      </div>
    </div>
  );
}

function CalibrationProgress({
  steps,
  active,
  turn,
}: {
  steps: readonly string[];
  active: number;
  turn: number;
}) {
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between">
        {steps.map((label, i) => {
          const done = i < active;
          const isActive = i === active;
          return (
            <div key={label} className="flex flex-1 flex-col items-center">
              <div className="flex w-full items-center">
                {/* connector before */}
                <div
                  className={cn(
                    "h-px flex-1 transition-colors",
                    i === 0 ? "opacity-0" : done ? "bg-gold/60" : "bg-border",
                  )}
                />
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold transition-colors",
                    done && "border border-gold/50 bg-gold/15 text-gold",
                    isActive && "border border-gold bg-gold text-background gold-glow",
                    !done && !isActive && "border border-border bg-muted text-muted-foreground",
                  )}
                >
                  {done ? "✓" : i + 1}
                </div>
                {/* connector after */}
                <div
                  className={cn(
                    "h-px flex-1 transition-colors",
                    i === steps.length - 1 ? "opacity-0" : done ? "bg-gold/60" : "bg-border",
                  )}
                />
              </div>
              <span
                className={cn(
                  "mt-1.5 text-[10px] uppercase tracking-wider transition-colors",
                  isActive
                    ? "text-gold"
                    : done
                      ? "text-muted-foreground"
                      : "text-muted-foreground/60",
                )}
              >
                {label}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-center text-[11px] text-muted-foreground">
        {active >= 2
          ? "Diagnostic complete — your Creation Plan is written."
          : `Diagnostic in progress · turn ${turn} of 5 before synthesis`}
      </p>
    </div>
  );
}
