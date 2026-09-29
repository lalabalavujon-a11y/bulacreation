import { createFileRoute, Link, useParams, Navigate } from "@tanstack/react-router";
import { ArrowRight, Building2, Lock, Users, Plus, LayoutGrid, ShieldCheck } from "lucide-react";
import { ASSESSMENTS, PUBLIC_ASSESSMENTS, COACH_PRO_ASSESSMENTS } from "@/lib/assessment/registry";
import { useSubscription } from "@/lib/diagnostic/subscription-context";
import { hasFeature, planRank } from "@/lib/diagnostic/subscription";

export const Route = createFileRoute("/assessments/")({
  head: () => ({
    meta: [
      { title: "Diagnostic Studio — Creation" },
      {
        name: "description",
        content:
          "The 40-Point engine as a reusable diagnostic pattern. Run the free Business Growth Diagnostic, or — for Coach Pro users — the full portfolio diagnostic library.",
      },
      { property: "og:title", content: "Diagnostic Studio — Creation" },
      {
        property: "og:description",
        content:
          "The 40-point Creation Algorithm generalised into a reusable diagnostic pattern. Free bonus diagnostic plus the Coach Pro portfolio library.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AssessmentsIndex,
});

function AssessmentsIndex() {
  const { entitlements } = useSubscription();
  const isCoach = hasFeature(entitlements, "coachOs");
  const isCoachPro = planRank(entitlements.plan) >= 4;

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <span className="text-[11px] uppercase tracking-[0.3em] text-gold-soft">
          Diagnostic Studio
        </span>
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          The <span className="gold-text">Engine</span>, Tuned to You
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          The 40-Point Creation Algorithm is one instance of a reusable pattern: a weighted
          multi-pillar diagnostic with a gating governor, bottleneck ranking, and AI intervention
          path. Run the free bonus diagnostic below — or, on a Coach Pro plan, unlock the full
          portfolio diagnostic library.
        </p>
      </header>

      {/* Engine explainer */}
      <section className="panel flex items-start gap-4 p-6">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-gold/10">
          <LayoutGrid className="size-5 text-gold" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold">How the engine works</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Each assessment defines its own pillars, points, weights, tiers, and zones. The scoring
            engine is identical: raw points × gating governor = final index. The bottleneck sorter
            ranks every point by immediate yield (deficit × weight) so you always know the single
            highest-leverage constraint to fix next.
          </p>
        </div>
      </section>

      {/* Free bonus diagnostics */}
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl font-semibold">Bonus Diagnostics</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Free for all users — complementary lenses on the same cybernetic engine.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {PUBLIC_ASSESSMENTS.map((a) => (
            <AssessmentCard key={a.key} a={a} locked={false} />
          ))}
        </div>
      </section>

      {/* Coach Pro library */}
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-semibold">Coach Pro Diagnostic Library</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Portfolio diagnostics — unlocked on Creation Coach Pro. Reusable across coaching
              practices and brand verticals.
            </p>
          </div>
          {isCoachPro && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/10 px-3 py-1 text-xs font-medium text-gold">
              <ShieldCheck className="size-3.5" /> Unlocked
            </span>
          )}
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {COACH_PRO_ASSESSMENTS.map((a) => (
            <AssessmentCard key={a.key} a={a} locked={!isCoachPro} />
          ))}
        </div>
        {!isCoachPro && (
          <div className="panel flex flex-col items-start gap-3 p-6 sm:flex-row sm:items-center">
            <Lock className="size-5 shrink-0 text-gold-soft" />
            <p className="flex-1 text-sm text-muted-foreground">
              The full 10-diagnostic portfolio library — Diver Readiness, Financial Readiness,
              Property Performance, Rugby Personal Development, Sales &amp; Marketing, MMA, Memory
              Development, Polymathic Mastery, Agentic AI OS, and Master Sales — is available on
              Creation Coach Pro.
            </p>
            <Link
              to="/pricing"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Upgrade to Coach Pro <ArrowRight className="size-3.5" />
            </Link>
          </div>
        )}
      </section>

      {/* Coach OS Diagnostic Studio — gated */}
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl font-semibold">Coach OS — Diagnostic Studio</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Define your own pillars, points, tiers, and zones. Your clients audit against your
            framework — the engine handles scoring, bottleneck ranking, and AI intervention.
          </p>
        </div>

        {isCoach ? (
          <div className="panel p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-md bg-gold/10">
                <Users className="size-5 text-gold" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold">Your Diagnostics</h3>
                <p className="text-xs text-muted-foreground">
                  Coach-built frameworks for your client book.
                </p>
              </div>
            </div>

            {/* Empty state for coach-built diagnostics (V1) */}
            <div className="mt-5 rounded-lg border border-dashed border-border p-8 text-center">
              <p className="text-sm text-muted-foreground">You haven't built a diagnostic yet.</p>
              <button
                type="button"
                disabled
                className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground opacity-50"
                title="Diagnostic builder lands in a later milestone"
              >
                <Plus className="size-4" /> Build Your First Diagnostic
              </button>
              <p className="mt-3 text-[11px] text-muted-foreground">
                The visual builder is on the roadmap. Your clients already score against the
                40-Point framework in the meantime.
              </p>
            </div>

            <div className="mt-6 flex items-start gap-3 rounded-md bg-muted/30 p-4">
              <Building2 className="mt-0.5 size-4 shrink-0 text-gold-soft" />
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">BULA Engine.</span> Your clients score
                against your framework. The engine handles the rest — scoring, governor, bottleneck
                ranking, trajectory, and CRM sync.
              </p>
            </div>
          </div>
        ) : (
          <div className="panel p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-md bg-muted">
                <Lock className="size-5 text-muted-foreground" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold">Build Your Own Diagnostic</h3>
                <p className="text-xs text-muted-foreground">Available on Creation Coach plans.</p>
              </div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Define your own pillars, points, and tiers. Your clients audit against your
              methodology — the engine handles scoring, bottleneck ranking, and AI intervention. The
              single highest-leverage constraint is surfaced per client, automatically.
            </p>
            <Link
              to="/pricing"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:text-gold-bright"
            >
              Upgrade to Coach <ArrowRight className="size-3.5" />
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

function AssessmentCard({ a, locked }: { a: (typeof ASSESSMENTS)[number]; locked: boolean }) {
  const maxScore = a.points.reduce((s, p) => s + p.weight, 0);
  const inner = (
    <div
      className={
        "panel group flex flex-col gap-3 p-6 transition-colors " +
        (locked ? "opacity-60" : "hover:border-gold/40")
      }
    >
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-md bg-gold/10">
          {locked ? (
            <Lock className="size-5 text-gold-soft" />
          ) : (
            <Building2 className="size-5 text-gold" />
          )}
        </div>
        <div>
          <h3 className="font-display text-base font-semibold">{a.name}</h3>
          <p className="text-xs text-gold-soft">{a.tagline}</p>
        </div>
      </div>
      <p className="flex-1 text-sm text-muted-foreground">{a.description}</p>
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span>{a.pillars.length} pillars</span>
        <span>{a.points.length} points</span>
        <span>max {maxScore.toLocaleString()}</span>
        <span className="text-gold">{a.indexLabel}</span>
      </div>
      <div className="inline-flex items-center gap-1.5 text-sm font-medium text-gold group-hover:text-gold-bright">
        {locked ? (
          <>
            <Lock className="size-3.5" /> Coach Pro only
          </>
        ) : (
          <>
            Run diagnostic <ArrowRight className="size-3.5" />
          </>
        )}
      </div>
    </div>
  );

  if (locked) {
    return <Link to="/pricing">{inner}</Link>;
  }
  return (
    <Link to="/assessments/$key" params={{ key: a.key }}>
      {inner}
    </Link>
  );
}
