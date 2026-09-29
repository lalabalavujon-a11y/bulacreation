// Guided first-run onboarding flow (spec §13.1).
// Step 1: "What are you creating?" — capture Chief Aim.
// Step 2: "Choose your framework" — Philosophy Selector.
// Step 3: "Run your first audit" — link to /audit.
// Step 4: "Receive your Creation Plan" — link to Overview.
// Renders as a full-screen modal overlay until the user completes it.

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useDiagnostic } from "@/lib/diagnostic/context";
import { PHILOSOPHY_LIST, type PhilosophyKey } from "@/lib/diagnostic/philosophy";
import { cn } from "@/lib/utils";
import { Target, Compass, ClipboardCheck, Rocket, ArrowRight, Check, X } from "lucide-react";

export function Onboarding() {
  const { chiefAim, setChiefAim, philosophy, setPhilosophy, setOnboarded, result } =
    useDiagnostic();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const steps = [
    { icon: Target, label: "Chief Aim" },
    { icon: Compass, label: "Framework" },
    { icon: ClipboardCheck, label: "First Audit" },
    { icon: Rocket, label: "Creation Plan" },
  ];

  function finish() {
    setOnboarded(true);
    navigate({ to: "/" });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-4 backdrop-blur">
      <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl">
        {/* Progress header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-bold tracking-tight">BULA CREATION</span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-gold-soft">Setup</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              {steps.map((s, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-1",
                    i <= step ? "text-gold" : "text-muted-foreground/40",
                  )}
                >
                  {i < step ? <Check className="size-3.5" /> : <s.icon className="size-3.5" />}
                  {i < steps.length - 1 && (
                    <div
                      className={cn("h-px w-4", i < step ? "bg-gold/50" : "bg-muted-foreground/20")}
                    />
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={() => setOnboarded(true)}
              className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              title="Close and continue to app"
              aria-label="Close setup modal"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Step 0 — Chief Aim */}
          {step === 0 && (
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-xl font-bold">What are you creating?</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Define your single, definite Chief Aim. This centres the entire system — every
                  audit, intervention, and metric answers one question: does this move the aim?
                </p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Your Chief Aim (one precise sentence)
                </label>
                <textarea
                  value={chiefAim.text}
                  onChange={(e) => setChiefAim({ text: e.target.value })}
                  rows={3}
                  autoFocus
                  placeholder="e.g. Build a £1M ARR SaaS business by December 2026..."
                  className="mt-1.5 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Believability: <span className="text-gold">{chiefAim.believability}/10</span>
                </label>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={chiefAim.believability}
                  onChange={(e) => setChiefAim({ believability: Number(e.target.value) })}
                  className="mt-2 w-full accent-[var(--gold)]"
                />
                <p className="mt-1 text-xs text-muted-foreground">
                  {chiefAim.believability <= 3
                    ? "Too low — cognitive panic. Lower the stakes or build evidence."
                    : chiefAim.believability >= 8
                      ? "Too safe — stretch the aim for creative tension."
                      : "Optimal tension zone."}
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                disabled={!chiefAim.text.trim()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                Continue <ArrowRight className="size-4" />
              </button>
            </div>
          )}

          {/* Step 1 — Philosophy */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-xl font-bold">Choose your framework</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  The 40-point engine stays the same. This only changes the language, metaphors, and
                  mentor persona used to interpret your results. You can switch anytime.
                </p>
              </div>
              <div className="grid max-h-64 gap-2 overflow-y-auto">
                {PHILOSOPHY_LIST.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPhilosophy(p.key as PhilosophyKey)}
                    className={cn(
                      "rounded-md border p-3 text-left transition-colors",
                      philosophy === p.key
                        ? "border-gold/50 bg-gold/10"
                        : "border-border bg-card hover:bg-accent",
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-display text-sm font-semibold">{p.name}</span>
                      {philosophy === p.key && <Check className="size-4 text-gold" />}
                    </div>
                    <p className="mt-0.5 text-[11px] text-gold-soft">{p.framework}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{p.description}</p>
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep(0)}
                  className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Continue <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          )}

          {/* Step 2 — First Audit */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-xl font-bold">Run your first audit</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Score all 40 points across 6 pillars on the observable 4-tier rubric. This
                  establishes your baseline Creation Voltage. You can refine it anytime — the
                  numbers get more honest with each pass.
                </p>
              </div>
              <div className="rounded-md border border-gold/30 bg-gold/5 p-4">
                <p className="text-xs text-gold-soft">Your aim is set:</p>
                <p className="mt-1 text-sm font-medium text-foreground">
                  {chiefAim.text || "(not set)"}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  Framework: {PHILOSOPHY_LIST.find((p) => p.key === philosophy)?.name}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setStep(1)}
                  className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Back
                </button>
                <button
                  onClick={() => {
                    setOnboarded(true);
                    navigate({ to: "/audit" });
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  <ClipboardCheck className="size-4" /> Go to Audit
                </button>
              </div>
            </div>
          )}

          {/* Step 3 — Creation Plan */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="font-display text-xl font-bold">Receive your Creation Plan</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  After your audit, the AI generates a personalised execution plan: your primary
                  constraint, a 72-hour intervention, this week's actions, and what to ignore. Hit
                  BEGIN EXECUTION and the plan becomes tracked commitments.
                </p>
              </div>
              {result.answered > 0 && (
                <div className="rounded-md border border-border bg-muted/30 p-4">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Current baseline
                  </div>
                  <div className="mt-1 font-display text-2xl font-bold tabular-nums text-gold">
                    {result.finalRounded.toLocaleString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {result.answered}/40 points answered
                  </div>
                </div>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setStep(2)}
                  className="inline-flex items-center justify-center rounded-md border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  Back
                </button>
                <button
                  onClick={finish}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground transition-colors hover:bg-primary/90 gold-glow"
                >
                  <Rocket className="size-4" /> Enter Creation
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
