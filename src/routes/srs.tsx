import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Plus, Trash2, Sparkles, Layers, Brain, RefreshCw } from "lucide-react";
import { useSrs } from "@/lib/diagnostic/srs-context";
import { useDiagnostic } from "@/lib/diagnostic/context";
import { PaywallGate } from "@/components/diagnostic/paywall";
import {
  REVIEW_BUTTONS,
  dueQueue,
  dueLabel,
  isMature,
  retentionRate,
  type ReviewQuality,
  type CardKind,
} from "@/lib/diagnostic/srs";
import { POINTS } from "@/lib/diagnostic/points";
import {
  loadAssessmentFriction,
  assessmentFrictionSummary,
} from "@/lib/diagnostic/assessment-friction";

export const Route = createFileRoute("/srs")({
  head: () => ({
    meta: [
      { title: "Spaced Repetition — Bula Creation" },
      {
        name: "description",
        content:
          "A spaced-repetition training deck that turns audit friction points, concepts and commitments into a daily review loop so behaviour compounds in Bula Creation.",
      },
      { property: "og:title", content: "Spaced Repetition — Bula Creation" },
      {
        property: "og:description",
        content:
          "Train your 40-point weak spots on an SM-2 schedule. Weak material resurfaces, mastered material fades — behaviour compounds.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SrsComponent,
});

function SrsComponent() {
  return (
    <div className="space-y-6">
      <SrsHeader />
      <PaywallGate
        feature="spacedRepetition"
        title="Spaced Repetition is a Pro feature"
        description="Turn your audit friction points into a daily training deck that compounds. Upgrade to Creation Pro to unlock the SM-2 scheduler in Bula Creation."
      >
        <SrsDeck />
      </PaywallGate>
    </div>
  );
}

function SrsHeader() {
  return (
    <header className="space-y-1">
      <span className="text-[11px] uppercase tracking-[0.3em] text-gold-soft">
        Behavioural Compounding
      </span>
      <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
        Spaced <span className="gold-text">Repetition</span>
      </h1>
      <p className="max-w-2xl text-sm text-muted-foreground">
        Weak audit points resurface often; mastered ones fade. Review daily and your Creation
        Voltage compounds instead of decay.
      </p>
    </header>
  );
}

function SrsDeck() {
  const {
    cards,
    reviewCard,
    deleteCard,
    addCard,
    importFromFriction,
    importFromAssessments,
    resetAll,
  } = useSrs();
  const { result } = useDiagnostic();
  const [queueIndex, setQueueIndex] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const queue = useMemo(() => dueQueue(cards), [cards]);
  const current = queue[queueIndex];
  const remaining = queue.length - queueIndex;
  const mature = cards.filter(isMature).length;
  const rate = retentionRate(cards);

  function review(q: ReviewQuality) {
    if (!current) return;
    reviewCard(current.id, q);
    setReveal(false);
    setQueueIndex((i) => i + 1);
  }

  return (
    <div className="space-y-8">
      <SrsHeader />

      {/* KPI strip */}
      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <Stat
          label="Due now"
          value={remaining > 0 ? String(remaining) : "0"}
          sub="Cards to review"
          accent
        />
        <Stat label="Total cards" value={String(cards.length)} sub="In your deck" />
        <Stat label="Mastered" value={String(mature)} sub="Interval ≥ 21d" />
        <Stat label="Retention" value={`${Math.round(rate * 100)}%`} sub="Recall success" />
      </section>

      {/* Review session */}
      {current ? (
        <section className="panel mx-auto max-w-xl space-y-5 p-8 text-center">
          <div className="flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.25em] text-gold-soft">
            <Sparkles className="size-3.5" /> Review · {remaining} left
          </div>
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {kindLabel(current.kind)}
            {current.pointId ? ` · Point #${current.pointId}` : ""}
          </div>
          <h2 className="font-display text-2xl font-semibold">{current.front}</h2>

          {!reveal ? (
            <button
              onClick={() => setReveal(true)}
              className="rounded-md border border-gold/40 bg-gold/5 px-6 py-2.5 text-sm font-semibold text-gold transition-colors hover:bg-gold/10"
            >
              Reveal answer
            </button>
          ) : (
            <>
              <p className="text-sm leading-relaxed text-foreground/90">{current.back}</p>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {REVIEW_BUTTONS.map((b) => (
                  <button
                    key={b.label}
                    onClick={() => review(b.quality)}
                    title={b.hint}
                    className="flex flex-col gap-1 rounded-md border border-border px-3 py-3 text-xs font-semibold transition-colors hover:border-gold hover:bg-gold/5"
                  >
                    <span className="text-sm">{b.label}</span>
                    <span className="text-[10px] font-normal text-muted-foreground">{b.hint}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </section>
      ) : (
        <section className="panel mx-auto max-w-xl space-y-3 p-8 text-center">
          <Layers className="mx-auto size-8 text-gold" />
          <h2 className="font-display text-xl font-semibold">All caught up</h2>
          <p className="text-sm text-muted-foreground">
            No cards are due. Your next review will reschedule automatically — come back tomorrow or
            add new material to your deck.
          </p>
        </section>
      )}

      {/* Auto-import from friction */}
      <section className="panel space-y-3 p-6">
        <div className="flex items-center gap-2">
          <Brain className="size-4 text-gold" />
          <h2 className="font-display text-lg font-semibold">Train your friction points</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          One click turns every point you scored at Friction or Emerging into a review card.
          Re-reviewing weak points daily is how the audit becomes behaviour.
        </p>
        <button
          onClick={() => {
            const weak = result.bottlenecks
              .filter((b) => b.tier < 0.66)
              .slice(0, 15)
              .map((b) => ({ id: b.point.id, name: b.point.name, focus: b.point.focus }));
            const n = importFromFriction(weak);
            alert(
              n > 0
                ? `Imported ${n} new card${n === 1 ? "" : "s"}.`
                : "All friction points are already in your deck.",
            );
          }}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Sparkles className="size-4" /> Import my friction points
        </button>
      </section>

      {/* Cross-diagnostic import — portfolio assessments */}
      <section className="panel space-y-3 p-6">
        <div className="flex items-center gap-2">
          <Layers className="size-4 text-gold" />
          <h2 className="font-display text-lg font-semibold">Import across diagnostics</h2>
        </div>
        <p className="text-xs text-muted-foreground">
          Pulls friction points from every portfolio assessment you've run — Diver Readiness,
          Financial Readiness, Property Performance, Rugby, Sales &amp; Marketing — into one deck,
          so a single review loop trains every diagnostic at once.
        </p>
        <PortfolioImport onImport={importFromAssessments} />
      </section>

      {/* Add card */}
      <section className="panel space-y-4 p-6">
        <button
          onClick={() => setShowAdd((s) => !s)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-gold transition-colors hover:text-gold-bright"
        >
          <Plus className="size-4" /> Add a custom card
        </button>
        {showAdd && <AddCardForm onAdd={addCard} />}
      </section>

      {/* Deck list */}
      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold">Your deck ({cards.length})</h2>
        {cards.length === 0 ? (
          <p className="panel p-6 text-sm text-muted-foreground">
            Your deck is empty. Import your friction points or add a custom card to begin.
          </p>
        ) : (
          <div className="grid gap-2">
            {cards
              .slice()
              .sort((a, b) => a.due - b.due)
              .map((c) => (
                <div key={c.id} className="panel flex items-center justify-between gap-4 p-4">
                  <div className="min-w-0">
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {kindLabel(c.kind)} · {dueLabel(c)} · reps {c.repetitions}
                    </div>
                    <div className="truncate text-sm font-medium">{c.front}</div>
                    <div className="truncate text-xs text-muted-foreground">{c.back}</div>
                  </div>
                  <button
                    onClick={() => deleteCard(c.id)}
                    className="shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                    title="Delete card"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              ))}
          </div>
        )}
        {cards.length > 0 && (
          <button
            onClick={() => {
              if (confirm("Clear your entire SRS deck and review history?")) resetAll();
            }}
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-destructive"
          >
            <RefreshCw className="size-3.5" /> Reset deck
          </button>
        )}
      </section>
    </div>
  );
}

function AddCardForm({
  onAdd,
}: {
  onAdd: (input: { kind: CardKind; front: string; back: string; pointId?: number }) => void;
}) {
  const [kind, setKind] = useState<CardKind>("concept");
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [pointId, setPointId] = useState<number | "">("");

  return (
    <div className="grid gap-3">
      <div className="flex gap-2">
        {(["concept", "skill", "commitment"] as CardKind[]).map((k) => (
          <button
            key={k}
            onClick={() => setKind(k)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
              kind === k
                ? "bg-gold/15 text-gold"
                : "border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            {k}
          </button>
        ))}
      </div>
      <input
        value={front}
        onChange={(e) => setFront(e.target.value)}
        placeholder="Prompt / question"
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
      <textarea
        value={back}
        onChange={(e) => setBack(e.target.value)}
        placeholder="Answer / definition / the behaviour"
        rows={2}
        className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 text-sm"
      />
      <select
        value={pointId}
        onChange={(e) => setPointId(e.target.value === "" ? "" : Number(e.target.value))}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
      >
        <option value="">Link to audit point (optional)</option>
        {POINTS.map((p) => (
          <option key={p.id} value={p.id}>
            #{p.id} — {p.name}
          </option>
        ))}
      </select>
      <button
        onClick={() => {
          if (!front.trim()) return;
          onAdd({ kind, front, back, pointId: pointId === "" ? undefined : pointId });
          setFront("");
          setBack("");
          setPointId("");
        }}
        className="inline-flex w-fit items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
      >
        <Plus className="size-4" /> Add card
      </button>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: boolean;
}) {
  return (
    <div className="panel p-4">
      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div
        className={`mt-1 font-display text-2xl font-bold ${accent ? "gold-text" : "text-foreground"}`}
      >
        {value}
      </div>
      <div className="text-[11px] text-muted-foreground">{sub}</div>
    </div>
  );
}

function kindLabel(k: CardKind): string {
  return k === "concept" ? "Concept" : k === "skill" ? "Skill" : "Commitment";
}

function PortfolioImport({
  onImport,
}: {
  onImport: (
    points: {
      composite: string;
      assessmentName: string;
      pointName: string;
      focus: string;
    }[],
  ) => number;
}) {
  const [summary, setSummary] = useState<{ key: string; name: string; count: number }[]>([]);

  function refresh() {
    const pts = loadAssessmentFriction(0.66);
    setSummary(assessmentFrictionSummary(pts));
    return pts;
  }

  useEffect(() => {
    refresh();
  }, []);

  const total = summary.reduce((s, x) => s + x.count, 0);

  return (
    <div className="space-y-3">
      {summary.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {summary.map((s) => (
            <span
              key={s.key}
              className="inline-flex items-center gap-1.5 rounded-full border border-gold/30 bg-gold/5 px-2.5 py-1 text-[11px] text-gold-soft"
            >
              {s.name} · {s.count}
            </span>
          ))}
        </div>
      )}
      <button
        onClick={() => {
          const pts = refresh();
          if (pts.length === 0) {
            alert(
              "No portfolio friction found. Run one of the diagnostics first — scores persist locally and surface here automatically.",
            );
            return;
          }
          const n = onImport(
            pts.map((p) => ({
              composite: p.composite,
              assessmentName: p.assessmentName,
              pointName: p.pointName,
              focus: p.focus,
            })),
          );
          alert(
            n > 0
              ? `Imported ${n} new card${n === 1 ? "" : "s"} from ${summary.length} diagnostic${summary.length === 1 ? "" : "s"}.`
              : "All portfolio friction points are already in your deck.",
          );
        }}
        className="inline-flex items-center gap-2 rounded-md border border-gold/40 bg-gold/5 px-4 py-2 text-sm font-medium text-gold transition-colors hover:bg-gold/10"
      >
        <Layers className="size-4" /> Import portfolio friction {total > 0 ? `(${total})` : ""}
      </button>
    </div>
  );
}
