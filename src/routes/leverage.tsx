import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useDiagnostic } from "@/lib/diagnostic/context";
import { tierLabel } from "@/lib/diagnostic/scoring";
import { PaywallGate } from "@/components/diagnostic/paywall";
import { cn } from "@/lib/utils";
import { Zap, Target, Heart, Unplug, Play, Pause, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/leverage")({
  head: () => ({
    meta: [
      { title: "Leverage — 40-Point Creation Algorithm" },
      {
        name: "description",
        content:
          "Bottleneck sorter ranks the 40 points by immediate point yield, plus the 4-step reflex circuit protocol.",
      },
      { property: "og:title", content: "Leverage — 40-Point Creation Algorithm" },
      {
        property: "og:description",
        content: "Bottleneck sorter and the 4-step reflex circuit protocol runner.",
      },
    ],
  }),
  component: LeverageComponent,
});

const CIRCUIT = [
  {
    icon: Target,
    step: "01",
    title: "Visceral Intolerance",
    body: "Name what you will no longer tolerate. Feel the disgust in the body — not as anger, but as fuel.",
    duration: 90,
  },
  {
    icon: Zap,
    step: "02",
    title: "Specific Definition",
    body: "Define the exact outcome in sensory detail. No abstraction — only precise, measurable image.",
    duration: 120,
  },
  {
    icon: Heart,
    step: "03",
    title: "Somatic Feeling",
    body: "Drop the image into the body. Feel the wish fulfilled now. Hold the state, not the thought.",
    duration: 180,
  },
  {
    icon: Unplug,
    step: "04",
    title: "Radical Detachment",
    body: "Release all anxious attachment to how or when. Let the outcome go. The system holds it now.",
    duration: 120,
  },
];

function LeverageComponent() {
  const { result } = useDiagnostic();
  const top = result.bottlenecks.slice(0, 8);

  // 4-step circuit timer
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);

  function startStep(i: number) {
    setActiveStep(i);
    setRemaining(CIRCUIT[i].duration);
    setRunning(true);
  }

  useEffect(() => {
    if (!running || remaining <= 0) return;
    const t = setTimeout(() => setRemaining((r) => Math.max(0, r - 1)), 1000);
    return () => clearTimeout(t);
  }, [running, remaining]);

  useEffect(() => {
    if (running && remaining === 0 && activeStep !== null) {
      if (activeStep < CIRCUIT.length - 1) {
        startStep(activeStep + 1);
      } else {
        setRunning(false);
      }
    }
  }, [running, remaining, activeStep]);

  return (
    <div className="space-y-8">
      <header>
        <span className="text-[11px] uppercase tracking-[0.3em] text-gold-soft">Module 03</span>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight md:text-4xl">
          Leverage Engine
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          What should you change next? The bottleneck sorter ranks every point by immediate point
          yield (deficit × weight). Attack the top 3 first — they unlock the most voltage per unit
          of effort.
        </p>
      </header>

      <PaywallGate
        feature="leverageEngine"
        title="Leverage Engine"
        description="The bottleneck sorter and 4-step reflex circuit are part of Creation Pro. Upgrade to rank every point by immediate yield and run the protocol."
      >
        <section className="panel p-6">
          <h2 className="font-display text-lg font-semibold">Bottleneck Sorter</h2>
          <div className="mt-4 space-y-2">
            {top.length === 0 && (
              <p className="py-6 text-center text-sm text-muted-foreground">
                No deficits — every answered point is at Mastered. Outstanding.
              </p>
            )}
            {top.map((b, i) => (
              <div
                key={b.point.id}
                className={cn(
                  "flex items-center gap-4 rounded-md border p-3",
                  i < 3 ? "border-gold/40 bg-gold/5" : "border-border bg-card",
                )}
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full font-display text-sm font-bold",
                    i < 3 ? "bg-gold text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{b.point.name}</span>
                    {i < 3 && (
                      <span className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-medium text-gold">
                        TOP LEVERAGE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Point #{b.point.id} · current: {tierLabel(b.tier)} · {b.point.focus}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-display text-lg font-bold tabular-nums text-gold">
                    +{Math.round(b.deficit)}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    pts available
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="panel p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">4-Step Reflex Circuit</h2>
              <p className="text-xs text-muted-foreground">
                Visceral Intolerance → Specific Definition → Somatic Feeling → Radical Detachment
              </p>
            </div>
            <button
              onClick={() => {
                setRunning(false);
                setActiveStep(null);
                setRemaining(0);
              }}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="size-3.5" /> Reset
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {CIRCUIT.map((c, i) => {
              const isActive = activeStep === i;
              return (
                <div
                  key={c.step}
                  className={cn(
                    "rounded-md border p-4 transition-colors",
                    isActive ? "border-gold/60 bg-gold/10 gold-glow" : "border-border bg-card",
                  )}
                >
                  <div className="flex items-center justify-between">
                    <c.icon
                      className={cn(
                        "size-5",
                        isActive ? "text-gold-bright" : "text-muted-foreground",
                      )}
                    />
                    <span className="font-display text-xs font-bold text-gold-soft">{c.step}</span>
                  </div>
                  <h3 className="mt-3 font-display text-sm font-semibold">{c.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{c.body}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs tabular-nums text-muted-foreground">
                      {isActive
                        ? `${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`
                        : `${c.duration}s`}
                    </span>
                    <button
                      onClick={() => startStep(i)}
                      className="inline-flex items-center gap-1 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
                    >
                      {isActive && running ? (
                        <Pause className="size-3" />
                      ) : (
                        <Play className="size-3" />
                      )}
                      {isActive && running ? "Running" : "Start"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </PaywallGate>
    </div>
  );
}
