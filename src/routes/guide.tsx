import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { PILLARS } from "@/lib/diagnostic/points";
import { FEATURES, FEATURE_GROUPS, TIER_META, type FeatureEntry } from "@/lib/diagnostic/features";
import { BUILD_SKILLS, BUILD_SKILL_CATEGORIES } from "@/lib/build-skills";
import { useAuth } from "@/lib/diagnostic/auth-context";
import { useSubscription } from "@/lib/diagnostic/subscription-context";

import { ArrowRight, Lock, Target, Sparkles, Wrench, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/guide")({
  head: () => ({
    meta: [
      { title: "Success Playbook — Creation Algorithm" },
      {
        name: "description",
        content:
          "Step-by-step playbook for using the 40-Point Creation Algorithm as a personal operating system for goal execution — weekly audit, leverage, Creation Plan, trajectory, and intervention analytics.",
      },
      { property: "og:title", content: "Success Playbook — Creation Algorithm" },
      {
        property: "og:description",
        content:
          "How to use the 40-point AI goal execution system for personal and business success.",
      },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: GuideComponent,
});

/** Weekly protocol steps (the ordered ritual) — kept as bespoke content. */
const WEEKLY = [
  {
    title: "1 · Run the Audit (Sunday)",
    body: "Open the Audit module and score all 40 points honestly on the 4-tier rubric (Friction → Emerging → Aligned → Mastered). Start with Pillar I — the Teachability governor (Point #2) caps your entire output by up to 50%, so it must be scored first and accurately.",
    to: "/audit",
    cta: "Go to Audit",
  },
  {
    title: "2 · Sharpen the Chief Aim",
    body: "In the same module, write your single definite aim, add sensory specificity, set the Believability gauge to the 4–7 tension zone, declare your Disgust factor (what you will no longer tolerate), and write the daily handwriting script. Vague aims produce vague voltage.",
    to: "/audit",
    cta: "Define Aim",
  },
  {
    title: "3 · Find Your Leverage (Monday)",
    body: "Open Leverage. The Bottleneck Sorter ranks all 40 points by immediate point yield (deficit × weight). Attack only the top 3 — these are your highest-leverage constraints. Run the 4-Step Reflex Circuit on each before doing anything else.",
    to: "/leverage",
    cta: "Find Leverage",
  },
  {
    title: "4 · Log the Snapshot (Friday)",
    body: "After a week of focused work, open Trajectory and Log a Snapshot. This captures your voltage, zone, and pillar balance as a permanent data point. The trend line reveals whether your servo-mechanism is correcting toward the target or drifting.",
    to: "/trajectory",
    cta: "Log Snapshot",
  },
  {
    title: "5 · Consult the Coach (As needed)",
    body: "When stuck on a bottleneck, open AI Coach and pick the persona that matches the work: Brotherhood for accountability & action, Neville for state & assumption work, Maltz for servo-mechanism calibration. Your live score, chief aim, and open commitments are injected automatically.",
    to: "/coach",
    cta: "Open Coach",
  },
  {
    title: "6 · Repeat Weekly",
    body: "The algorithm is cybernetic — it only works as a closed loop. Audit → Leverage → Creation Plan → Execute → Log → Repeat. Over 12 weeks the trajectory curve bends toward Execution Active (6,000+). Consistency, not intensity, drives the voltage.",
    to: "/trajectory",
    cta: "View Trend",
  },
];

function GuideComponent() {
  const { isAdmin: serverAdmin } = useAuth();
  const { simulatedTier } = useSubscription();
  // Only expose Super Admin internals when the user is the real super admin AND not currently simulating a lower user tier (e.g. Free, Pro)
  const isAdmin = serverAdmin && simulatedTier === null;

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <span className="text-[11px] uppercase tracking-[0.3em] text-gold-soft">
          Operating Manual
        </span>
        <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">
          The User <span className="gold-text">Operating System</span>
        </h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          How to operate the 40-Point Creation Algorithm as your personal execution system. Follow
          the weekly rhythm below to audit your baseline, isolate high-leverage bottlenecks, take
          targeted action, and track your voltage over time.
        </p>
      </header>

      {/* Privacy callout */}
      <section className="panel flex flex-col gap-3 p-6 md:flex-row md:items-start">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-gold/10">
          <Lock className="size-5 text-gold" />
        </div>
        <div className="flex-1">
          <h2 className="font-display text-lg font-semibold">Your Data Is Private</h2>
          <p className="mt-1.5 text-sm text-muted-foreground">
            <strong>Private by design.</strong> Your audit scores, Chief Aim, commitments, and
            trajectory stay entirely private to your account. Nothing is shared publicly. Focus on
            100% honesty in your audit scoring — the algorithm only creates leverage when your
            inputs reflect reality.
          </p>
        </div>
      </section>

      {/* Weekly protocol */}
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl font-semibold">The Weekly Protocol</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Six steps, one per session. The whole loop takes under 30 minutes.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {WEEKLY.map((step) => (
            <div key={step.title} className="panel flex flex-col gap-3 p-5">
              <h3 className="font-display text-base font-semibold">{step.title}</h3>
              <p className="flex-1 text-sm text-muted-foreground">{step.body}</p>
              <Link
                to={step.to}
                className="inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:text-gold-bright"
              >
                {step.cta} <ArrowRight className="size-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Auto-rendered feature catalogue (single source of truth) */}
      {FEATURE_GROUPS.map((group) => {
        const items = FEATURES.filter((f) => f.group === group.group);
        if (items.length === 0) return null;
        return (
          <section key={group.key} className="space-y-4">
            <div>
              <h2 className="font-display text-xl font-semibold">{group.title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{group.blurb}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {items.map((feat) => (
                <FeatureCard key={feat.to} feat={feat} />
              ))}
            </div>
          </section>
        );
      })}

      {/* Creation Plan callout (bespoke — it's an action, not a route) */}
      <section className="panel flex flex-col gap-3 p-5">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-md bg-gold/10">
            <Target className="size-4 text-gold" />
          </div>
          <h3 className="font-display text-base font-semibold">The Creation Plan</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          After an audit, the AI generates a structured execution plan: your Chief Aim, current
          Voltage, the single Primary Constraint blocking it, a 72-hour intervention, 3 actions for
          the week, 3 distractions to avoid, and your next audit date. Hit{" "}
          <strong>BEGIN EXECUTION</strong> to convert the plan into tracked commitments instantly.
          This is Creation's core shift: from "here's your score" to "here's your move."
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:text-gold-bright"
        >
          Generate a plan <ArrowRight className="size-3.5" />
        </Link>
      </section>

      {/* Intervention analytics */}
      <section className="panel p-6">
        <h2 className="font-display text-lg font-semibold">Intervention Analytics</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The Trajectory module tracks whether your interventions are actually producing movement —
          not just whether your score changed. Over time, these signals reveal what works for you
          specifically.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-md border border-border bg-muted/30 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Creation Velocity
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              ΔVoltage per snapshot — your rate of change. Positive and rising means the loop is
              working.
            </p>
          </div>
          <div className="rounded-md border border-border bg-muted/30 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Commitment Completion
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              The percentage of 48-hour assignments you actually complete. Below 30% triggers a
              re-engagement signal.
            </p>
          </div>
          <div className="rounded-md border border-border bg-muted/30 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Constraint Recurrence
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              When the same bottleneck keeps appearing as your top constraint, the current
              intervention type isn't working — switch leverage targets.
            </p>
          </div>
        </div>
      </section>

      {/* Zone strategy */}
      <section className="panel p-6">
        <h2 className="font-display text-lg font-semibold">Zone Strategy</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Your zone dictates the correct focus. Do not skip ahead — each zone has its own work.
        </p>
        <div className="mt-4 space-y-3">
          {[
            {
              range: "0 – 3,999",
              name: "Friction Zone",
              body: "Random chaos. Do not chase tactics. Re-anchor Pillar I: mentorship, teachability, the 90/10 balance, and epistemic humility. Without the governor stable, nothing else compounds.",
            },
            {
              range: "4,000 – 5,999",
              name: "Emergence Zone",
              body: "Transitional momentum. The servo is correcting. Focus on Pillar IV — detect and clear counter-intentions, resistance, and envy. These are the invisible brakes holding you under 6,000.",
            },
            {
              range: "6,000 – 10,000",
              name: "Execution Active",
              body: "Execution loop sustained. Hold State & Alignment (Pillar III) and lock in Execution & Alignment (Pillar VI): metrics, mastermind, and burning boats. Protect the state — relapse costs voltage.",
            },
          ].map((z) => (
            <div
              key={z.name}
              className="flex gap-4 rounded-md border border-border bg-muted/30 p-4"
            >
              <div className="w-28 shrink-0">
                <div className="font-display text-sm font-bold text-gold">{z.name}</div>
                <div className="text-xs tabular-nums text-muted-foreground">{z.range} pts</div>
              </div>
              <p className="flex-1 text-sm text-muted-foreground">{z.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pillar application */}
      <section className="space-y-4">
        <div>
          <h2 className="font-display text-xl font-semibold">Applying Each Pillar</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Personal and business application of the six foundational pillars.
          </p>
        </div>
        <div className="space-y-3">
          {PILLARS.map((p) => (
            <div key={p.index} className="panel p-5">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="font-display text-sm font-bold text-gold-soft">{p.roman}.</span>
                <h3 className="font-display text-base font-semibold">{p.name}</h3>
                <span className="text-xs text-muted-foreground">· {p.focus}</span>
                <span className="ml-auto text-xs tabular-nums text-muted-foreground">
                  max {p.max.toLocaleString()} pts
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{pillarApplication(p.index)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Business vs personal */}
      <section className="grid gap-4 md:grid-cols-2">
        <div className="panel p-6">
          <h2 className="font-display text-lg font-semibold">Personal Use</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              • Treat your life as the aim — define the person you are becoming, not just goals.
            </li>
            <li>• Use Neville for inner-state work; Brotherhood for discipline & standards.</li>
            <li>• Log a snapshot every Sunday to watch your personal voltage climb over months.</li>
            <li>
              • Watch the Teachability governor — closed-mindedness silently halves your output.
            </li>
          </ul>
        </div>
        <div className="panel p-6">
          <h2 className="font-display text-lg font-semibold">Business Use</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>• Make the company chief aim specific: revenue, impact, and by-when.</li>
            <li>• Run the audit for the business as an entity — where is its friction?</li>
            <li>• Use Leverage to find the one constraint that unlocks the next tier.</li>
            <li>• Use Maltz persona for feedback-loop calibration and metrics design.</li>
            <li>• Track your weekly voltage snapshots to maintain compounding execution.</li>
          </ul>
        </div>
      </section>

      {/* Super-Admin Only: Build Skills registry (reusable playbook for portfolio builds) */}
      {isAdmin && (
        <section className="space-y-4 rounded-lg border border-gold/30 bg-gold/5 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-semibold flex items-center gap-2 text-gold">
                <Wrench className="size-5 text-gold" /> The Build Skills Registry
              </h2>
              <p className="mt-1 max-w-2xl text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 font-semibold text-gold">
                  <ShieldCheck className="size-3.5" /> SUPER ADMIN ONLY
                </span>{" "}
                — Every capability used to construct this app, captured as a transferable playbook
                for future portfolio builds (Diver, Finance, Property, Lead Recon, Rugby). Hidden
                from regular users.
              </p>
            </div>
          </div>
          {BUILD_SKILL_CATEGORIES.map((cat) => {
            const skills = BUILD_SKILLS.filter((s) => s.category === cat.key);
            if (skills.length === 0) return null;
            return (
              <div key={cat.key} className="space-y-2">
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-gold-soft">
                  {cat.label}
                </h3>
                <p className="text-xs text-muted-foreground">{cat.blurb}</p>
                <div className="grid gap-3 md:grid-cols-2">
                  {skills.map((skill) => (
                    <div key={skill.id} className="panel flex flex-col gap-2 p-4">
                      <h4 className="font-display text-sm font-semibold">{skill.name}</h4>
                      <p className="text-xs text-muted-foreground">{skill.summary}</p>
                      <p className="text-xs text-muted-foreground/80">
                        <span className="text-gold-soft">Applied:</span> {skill.appliedIn}
                      </p>
                      <p className="text-[10px] text-muted-foreground/60">
                        {skill.artifacts.join(" · ")}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      )}

      <section className="panel flex flex-col items-start gap-3 p-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold">Begin the Loop</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Start with the audit. Everything else flows from an honest baseline.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/audit"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Run the Audit <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ feat }: { feat: FeatureEntry }) {
  const tier = TIER_META[feat.tier];
  return (
    <div className="panel flex flex-col gap-2 p-5">
      <div className="flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-md bg-gold/10">
          <feat.icon className="size-4 text-gold" />
        </div>
        <h3 className="font-display text-base font-semibold">{feat.label}</h3>
        <span
          className="ml-auto rounded bg-muted px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider"
          style={{ color: tier.token }}
        >
          {tier.label}
        </span>
      </div>
      <p className="text-xs uppercase tracking-wider text-gold-soft">{feat.tagline}</p>
      <p className="flex-1 text-sm text-muted-foreground">{feat.description}</p>
      <Link
        to={feat.to}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gold hover:text-gold-bright"
      >
        Open <ArrowRight className="size-3.5" />
      </Link>
    </div>
  );
}

function pillarApplication(index: number): string {
  const map: Record<number, string> = {
    0: "Personal: who is your mentor, and how coachable are you really under pressure? Business: is your team's input-to-output ratio healthy, or are you over-consuming and under-shipping? This pillar is the foundation — everything above it depends on a stable governor.",
    1: "Personal: write the exact life you are building in one sentence with sensory detail. Business: define the single definitive company aim — revenue, market, and deadline — and the line you will no longer cross (the Disgust factor).",
    2: "Personal: can you hold the feeling of the wish fulfilled without anxious grasping? Business: does the team operate from calm confidence or anxious reactivity? Detachment and gratitude are the carrier signal that sustains output.",
    3: 'Personal: what hidden counter-intentions sabotage your aim? Business: what unspoken beliefs limit the company ("we can\'t charge that", "that market is saturated")? Clearing these unlocks the biggest hidden voltage.',
    4: "Personal: clean your relational ledger — relationships, sleep, nutrition, environment. Business: integrity with customers, partners, and staff is literal capital; unresolved debt drains the system.",
    5: "Personal: who is your mastermind, and have you burned the boats on retreat? Business: metrics, accountability cadence, and irrevocable commitments. This pillar turns state into measurable, real-world results.",
  };
  return map[index] ?? "";
}
