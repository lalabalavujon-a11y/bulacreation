import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useDiagnostic } from "@/lib/diagnostic/context";
import { PILLARS, POINTS, pointsByPillar, TIERS, type Tier } from "@/lib/diagnostic/points";
import { tierLabel } from "@/lib/diagnostic/scoring";
import { getMethodology } from "@/lib/diagnostic/methodology";
import { cn } from "@/lib/utils";
import { PenLine, ChevronDown, ChevronUp, FileText } from "lucide-react";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Audit — Creation Algorithm" },
      {
        name: "description",
        content:
          "Score all 40 points across 6 pillars on the observable 4-tier rubric. Add evidence notes and define your chief aim.",
      },
      { property: "og:title", content: "Audit — Creation Algorithm" },
      {
        property: "og:description",
        content: "Score all 40 creation points with observable criteria and evidence notes.",
      },
    ],
  }),
  component: AuditComponent,
});

function TierPicker({ value, onChange }: { value: Tier; onChange: (t: Tier) => void }) {
  return (
    <div className="flex flex-wrap gap-1">
      {TIERS.map((t) => (
        <button
          key={t.value}
          onClick={() => onChange(t.value)}
          className={cn(
            "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
            value === t.value
              ? "bg-gold text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-foreground",
          )}
          title={t.note}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

function AuditComponent() {
  const { scores, setScore, evidenceNotes, setEvidenceNote, chiefAim, setChiefAim } =
    useDiagnostic();
  const [activePillar, setActivePillar] = useState(0);
  const [expandedPoint, setExpandedPoint] = useState<number | null>(null);

  const pillarPoints = pointsByPillar(activePillar);

  return (
    <div className="space-y-8">
      <header>
        <span className="text-[11px] uppercase tracking-[0.3em] text-gold-soft">Module 01</span>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight md:text-4xl">
          The Audit
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Score each of the 40 points on the observable 4-tier rubric. Point #2 (Teachability) gates
          your total output by up to 50%. Add evidence notes to improve self-honesty and seed your
          AI coach's interventions.
        </p>
      </header>

      {/* Chief Aim */}
      <section className="panel p-6">
        <div className="flex items-center gap-2">
          <PenLine className="size-4 text-gold" />
          <h2 className="font-display text-lg font-semibold">Chief Aim Intake</h2>
        </div>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Single Definite Chief Aim
            </label>
            <textarea
              value={chiefAim.text}
              onChange={(e) => setChiefAim({ text: e.target.value })}
              rows={2}
              placeholder="State your primary aim in one precise sentence..."
              className="mt-1.5 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Extreme Specificity (sensory detail)
            </label>
            <textarea
              value={chiefAim.specificity}
              onChange={(e) => setChiefAim({ specificity: e.target.value })}
              rows={3}
              placeholder="What exactly does it look, sound, feel like when fulfilled?"
              className="mt-1.5 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Disgust Factor
            </label>
            <textarea
              value={chiefAim.disgust}
              onChange={(e) => setChiefAim({ disgust: e.target.value })}
              rows={3}
              placeholder="What will you absolutely no longer tolerate?"
              className="mt-1.5 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Believability Sweet Spot:{" "}
              <span className="text-gold">{chiefAim.believability}/10</span>
            </label>
            <input
              type="range"
              min={1}
              max={10}
              value={chiefAim.believability}
              onChange={(e) => setChiefAim({ believability: Number(e.target.value) })}
              className="mt-3 w-full accent-[var(--gold)]"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {chiefAim.believability <= 3
                ? "Too low — cognitive panic. Lower the stakes or build evidence."
                : chiefAim.believability >= 8
                  ? "Too safe — stretch the aim for creative tension."
                  : "Optimal tension zone."}
            </p>
          </div>
          <div>
            <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Handwriting Transcription
            </label>
            <textarea
              value={chiefAim.handwriting}
              onChange={(e) => setChiefAim({ handwriting: e.target.value })}
              rows={3}
              placeholder="Exact pen-to-paper script to write daily..."
              className="mt-1.5 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </section>

      {/* Pillar tabs */}
      <section className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {PILLARS.map((p) => {
            const earned = result_pillar_earned(p.index, scores);
            return (
              <button
                key={p.index}
                onClick={() => setActivePillar(p.index)}
                className={cn(
                  "rounded-md border px-3 py-2 text-left transition-colors",
                  activePillar === p.index
                    ? "border-gold/50 bg-gold/10"
                    : "border-border bg-card hover:bg-accent",
                )}
              >
                <div className="text-xs font-semibold text-gold-soft">{p.roman}</div>
                <div className="text-xs text-foreground">{p.name}</div>
                <div className="mt-1 text-[10px] tabular-nums text-muted-foreground">
                  {Math.round(earned)} / {p.max}
                </div>
              </button>
            );
          })}
        </div>

        <div className="panel divide-y divide-border">
          {pillarPoints.map((pt) => {
            const val = scores[pt.id] ?? 0;
            const method = getMethodology(pt.id);
            const isExpanded = expandedPoint === pt.id;
            const note = evidenceNotes[pt.id] ?? "";
            return (
              <div key={pt.id} className="p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-bold text-gold-soft">
                        {String(pt.id).padStart(2, "0")}
                      </span>
                      <span className="text-sm font-medium">{pt.name}</span>
                      {pt.gating && (
                        <span className="rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-[10px] font-medium text-gold">
                          GOVERNOR
                        </span>
                      )}
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {pt.focus} · max {pt.weight} pts
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="hidden text-xs tabular-nums text-muted-foreground sm:inline">
                      {val > 0 ? `${tierLabel(val)}` : "—"}
                    </span>
                    <TierPicker value={val} onChange={(t) => setScore(pt.id, t)} />
                    <button
                      onClick={() => setExpandedPoint(isExpanded ? null : pt.id)}
                      className="rounded-md p-1 text-muted-foreground hover:text-gold"
                      aria-label="Show criteria"
                    >
                      {isExpanded ? (
                        <ChevronUp className="size-4" />
                      ) : (
                        <ChevronDown className="size-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded methodology + evidence note */}
                {isExpanded && method && (
                  <div className="mt-3 space-y-3 rounded-md border border-border bg-muted/20 p-3">
                    <p className="text-xs text-muted-foreground">{method.definition}</p>
                    <div className="grid gap-1.5 sm:grid-cols-2">
                      {method.criteria.map((c) => (
                        <div
                          key={c.tier}
                          className={cn(
                            "rounded border p-2 text-xs",
                            val === c.tier
                              ? "border-gold/40 bg-gold/10 text-foreground"
                              : "border-border text-muted-foreground",
                          )}
                        >
                          <span className="font-semibold text-gold-soft">{c.label}:</span>{" "}
                          {c.behaviour}
                        </div>
                      ))}
                    </div>
                    <div className="rounded border border-border bg-background p-2">
                      <p className="text-[11px] font-medium text-gold-soft">
                        Evidence prompt:{" "}
                        <span className="text-muted-foreground">{method.evidencePrompt}</span>
                      </p>
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        <FileText className="size-3" /> Why this tier? (evidence note)
                      </label>
                      <textarea
                        value={note}
                        onChange={(e) => setEvidenceNote(pt.id, e.target.value)}
                        rows={2}
                        placeholder="Cite observable evidence for your chosen tier..."
                        className="mt-1.5 w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      <span className="text-gold-soft">Intervention:</span> {method.intervention} ·{" "}
                      <span className="text-gold-soft">Reassess:</span> {method.reassessment}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function result_pillar_earned(pillarIndex: number, scores: Record<number, Tier>): number {
  return POINTS.filter((p) => p.pillar === pillarIndex).reduce(
    (sum, p) => sum + p.weight * (scores[p.id] ?? 0),
    0,
  );
}
