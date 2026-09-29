// Philosophy Selector — onboarding + settings component.
// Lets the user choose their interpretation layer (Performance, Founder,
// Stoic, Maltz, Neville, Spiritual). The 40-point engine never changes;
// only the display names, zone labels, and default mentor persona swap.

import { useDiagnostic } from "@/lib/diagnostic/context";
import { PHILOSOPHY_LIST, type PhilosophyKey } from "@/lib/diagnostic/philosophy";
import { cn } from "@/lib/utils";
import { Compass, Sparkles } from "lucide-react";

export function PhilosophySelector({ compact = false }: { compact?: boolean }) {
  const { philosophy, setPhilosophy } = useDiagnostic();

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1.5">
        {PHILOSOPHY_LIST.map((p) => (
          <button
            key={p.key}
            onClick={() => setPhilosophy(p.key as PhilosophyKey)}
            className={cn(
              "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
              philosophy === p.key
                ? "border-gold/50 bg-gold/10 text-gold"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {p.name}
          </button>
        ))}
      </div>
    );
  }

  return (
    <section className="panel p-6">
      <div className="flex items-center gap-2">
        <Compass className="size-4 text-gold" />
        <h2 className="font-display text-lg font-semibold">Choose Your Framework</h2>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">
        The 40-point engine stays the same. Your framework changes how the results are interpreted
        and which mentor voice guides you. Switch anytime — your scores never change.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PHILOSOPHY_LIST.map((p) => (
          <button
            key={p.key}
            onClick={() => setPhilosophy(p.key as PhilosophyKey)}
            className={cn(
              "rounded-md border p-4 text-left transition-colors",
              philosophy === p.key
                ? "border-gold/50 bg-gold/10 gold-glow"
                : "border-border bg-card hover:bg-accent",
            )}
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-sm font-semibold">{p.name}</span>
              {philosophy === p.key && <Sparkles className="size-3.5 text-gold" />}
            </div>
            <p className="mt-1 text-[11px] uppercase tracking-wider text-gold-soft">
              {p.framework}
            </p>
            <p className="mt-2 text-xs text-muted-foreground">{p.description}</p>
            {p.metaphysical && (
              <span className="mt-2 inline-block rounded-full border border-gold/30 bg-gold/5 px-2 py-0.5 text-[10px] text-gold-soft">
                Metaphysical terminology
              </span>
            )}
          </button>
        ))}
      </div>
    </section>
  );
}
