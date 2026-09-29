import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  PlayCircle,
  ArrowRight,
  Check,
  Brain,
  Workflow,
  TrendingUp,
  Sparkles,
  Shield,
  Target,
  Users,
  Star,
  X,
  Lock,
  Repeat,
  ChevronDown,
} from "lucide-react";
import {
  PLANS,
  displayPrice,
  billedAmount,
  annualSavingsPct,
  type BillingCycle,
} from "@/lib/diagnostic/subscription";
import { BillingToggle } from "@/components/diagnostic/billing-toggle";

const OG_IMAGE =
  "https://vibe.filesafe.space/1790355857187699269/assets/775d4b64-c105-4de4-89d5-5535d60b0c4b.png";
const LOGO =
  "https://vibe.filesafe.space/1790355857187699269/attachments/afa0cbd8-a353-48b8-8ed0-ecc90a8d6967.png";

export const Route = createFileRoute("/vsl")({
  head: () => ({
    meta: [
      { title: "Bula Creation — The 40-Point Goal Execution System" },
      {
        name: "description",
        content:
          "Turn your single most important goal into a measurable feedback loop. Audit → Diagnose → Act → Measure → Coach. The 40-Point Creation Algorithm in Bula Creation.",
      },
      { property: "og:title", content: "Bula Creation — The 40-Point Goal Execution System" },
      {
        property: "og:description",
        content:
          "Most self-development apps make you feel good. Creation makes you move. Diagnose the constraint, prescribe the next move, track whether you moved.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: OG_IMAGE },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: OG_IMAGE },
    ],
  }),
  component: VslComponent,
});

const PROOF = [
  {
    name: "Marcus T.",
    role: "Founder, SaaS",
    quote: "It told me Point #14 was my ceiling. I fixed it. Revenue moved within the month.",
    voltage: "7,810",
  },
  {
    name: "Sarah L.",
    role: "Performance Coach",
    quote: "My clients finally have a scorecard that predicts who will actually do the work.",
    voltage: "8,340",
  },
  {
    name: "David R.",
    role: "Operator",
    quote: "The Leverage Engine is the whole product. It tells you the one thing to change.",
    voltage: "6,920",
  },
];

const LOOP = [
  {
    icon: Target,
    title: "Audit",
    text: "Establish your 40-point baseline. One number: Creation Voltage.",
  },
  {
    icon: Workflow,
    title: "Diagnose",
    text: "The Leverage Engine ranks every constraint by yield. You learn the one thing to fix.",
  },
  {
    icon: Sparkles,
    title: "Act",
    text: "Your AI mentor issues a single 48-hour assignment. Specific. Measurable. Non-negotiable.",
  },
  {
    icon: TrendingUp,
    title: "Measure",
    text: "Re-audit. Trajectory logs the delta. Did the intervention move the number?",
  },
];

const MENTORS = [
  {
    icon: Users,
    name: "Brotherhood Master",
    voice: "Accountability. Iron standards. Zero excuses.",
    tone: "Direct",
  },
  {
    icon: Brain,
    name: "Cybernetics Engineer",
    voice: "Servo-mechanism theory. Feedback loops. Target-lock.",
    tone: "Precise",
  },
  {
    icon: Sparkles,
    name: "Mystical Assumption",
    voice: "State akin to sleep. Living from the end.",
    tone: "Luminous",
  },
];

const PROBLEMS = [
  "You read the books. You felt the motivation. You did nothing differently.",
  "You set the goal. Three weeks later, it's gone quiet.",
  "You know what to do. You don't know which thing is actually blocking you.",
  "You buy another course to fix the guilt of the last one you didn't finish.",
];

const FAQ = [
  {
    q: "Is this just another manifestation app?",
    a: "No. Bula Creation is a goal execution system. It measures 40 observable behaviours across 6 pillars, converts them into one number — Creation Voltage — and uses an AI mentor to prescribe the single highest-leverage next move. No crystals. A control loop.",
  },
  {
    q: "Do I need to believe in any of the philosophy?",
    a: "No. The engine is methodology-neutral. Choose Performance (cybernetics, behavioural science) as your coaching framework and the metaphysical language is switched off. The scoring stays identical.",
  },
  {
    q: "How is this different from ChatGPT?",
    a: "ChatGPT has no memory of your goal, your score, or whether you did the last assignment. Your Bula mentor reads your live Creation Voltage, your top bottleneck, and your Chief Aim on every turn — then issues a tracked 48-hour commitment and checks whether you did it.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Private Mode is on by default. Your audit lives in your browser until you choose to sync to the cloud. We never sell or share your data.",
  },
  {
    q: "What if I just want the one intensive, not a subscription?",
    a: "Buy the Creation Calibration Intensive — a one-time £299 deep session run end-to-end by an autonomous AI agent. It writes your Creation Plan and includes 60 days of Coach-tier access. No recurring charge unless you choose to subscribe.",
  },
  {
    q: "Can my coach use this with their clients?",
    a: "Yes. The Coach plans (£149–£399/mo) turn Bula Creation into a Coach Operating System — per-client Creation Voltage, overdue assignment alerts, and a book-wide constraint view.",
  },
];

function VslComponent() {
  const [billing, setBilling] = useState<BillingCycle>("monthly");
  const [videoOpen, setVideoOpen] = useState(false);
  const featuredPlans = [PLANS.free, PLANS.pro, PLANS.performance];

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
          <Link to="/" className="flex items-center gap-2.5">
            <img
              src={LOGO}
              alt="Bula Creation Golden Hexagon Logo"
              className="size-7 rounded-sm object-contain"
            />
            <div className="leading-tight">
              <div className="font-display text-sm font-bold tracking-tight">BULA CREATION</div>
              <div className="text-[9px] uppercase tracking-[0.25em] text-gold-soft">
                40-Point Algorithm
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="#pricing"
              className="hidden rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
            >
              See Plans
            </a>
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Start Free <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero + VSL */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(201,168,76,0.10),transparent_55%)]" />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-gold">
              <Star className="size-3" /> AI Goal Execution System
            </span>
            <h1 className="mt-5 font-display text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl">
              Don't feel motivated.
              <br />
              <span className="gold-text">Move the number.</span>
            </h1>
            <p className="mt-5 max-w-md text-base text-muted-foreground">
              Most self-development apps make you feel good for a day. Creation turns your single
              most important goal into a measurable feedback loop — audit, diagnose, act, measure,
              coach — until the number moves.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => setVideoOpen(true)}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <PlayCircle className="size-4" /> Watch the Method
              </button>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                See Plans
              </a>
            </div>
            <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Shield className="size-3.5 text-gold" /> Private by default
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Check className="size-3.5 text-gold" /> No credit card to start
              </span>
            </div>
          </div>

          {/* VSL video frame */}
          <div className="flex items-center">
            <button
              onClick={() => setVideoOpen(true)}
              className="group relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(201,168,76,0.12),transparent_60%)]" />
              <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                <PlayCircle className="size-16 text-gold/70 transition-transform group-hover:scale-110" />
                <div>
                  <div className="font-display text-lg font-semibold">The Creation Method</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    14-min walkthrough of the 40-Point Algorithm
                  </div>
                </div>
              </div>
            </button>
          </div>
        </div>
      </section>

      {/* The Problem (agitate) */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="text-center font-display text-2xl font-bold tracking-tight md:text-3xl">
            Sound familiar?
          </h2>
          <ul className="mt-8 space-y-3">
            {PROBLEMS.map((p) => (
              <li
                key={p}
                className="flex items-start gap-3 rounded-lg border border-border bg-card p-4"
              >
                <X className="mt-0.5 size-4 shrink-0 text-muted-foreground/60" />
                <span className="text-sm text-muted-foreground">{p}</span>
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center font-display text-lg text-gold">
            That loop is not your fault. It's a missing feedback system.
          </p>
        </div>
      </section>

      {/* The Solution — the loop */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-4xl px-5 text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
            Bula Creation replaces motivation with a control loop
          </h2>
          <p className="mt-3 text-muted-foreground">
            Consume information → feel motivated → do something briefly → forget → buy another book.
            Creation replaces that with:
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {LOOP.map((step, i) => (
              <div
                key={step.title}
                className="relative rounded-lg border border-border bg-card p-5"
              >
                <div className="mb-3 flex items-center gap-2">
                  <step.icon className="size-5 text-gold" />
                  <span className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground">
                    Step {i + 1}
                  </span>
                </div>
                <div className="font-display text-sm font-semibold">{step.title}</div>
                <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">{step.text}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 font-display text-lg text-gold">
            Audit → Diagnose → Act → Measure → Coach → Repeat
          </p>
        </div>
      </section>

      {/* The Number */}
      <section className="border-b border-border bg-muted/20 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 px-5 md:grid-cols-3">
          <div className="md:col-span-1">
            <h2 className="font-display text-2xl font-bold tracking-tight">
              One number: Creation Voltage
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              A composite readiness and execution index from your 40-point audit. 0–10,000.
            </p>
          </div>
          <div className="grid gap-4 md:col-span-2 md:grid-cols-3">
            {[
              {
                range: "0 – 3,999",
                label: "Friction Zone",
                desc: "Random chaos. Re-anchor the basics.",
              },
              {
                range: "4,000 – 5,999",
                label: "Emergence",
                desc: "Transitional momentum building.",
              },
              {
                range: "6,000 – 10,000",
                label: "Execution Active",
                desc: "The loop is sustained. Hold the standard.",
              },
            ].map((z) => (
              <div key={z.label} className="rounded-lg border border-border bg-card p-5">
                <div className="font-display text-sm font-semibold text-gold">{z.label}</div>
                <div className="mt-1 text-xs tabular-nums text-muted-foreground">{z.range}</div>
                <p className="mt-2 text-xs leading-relaxed">{z.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Mentors */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-5xl px-5">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              Three mentors. One nervous system.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Not a chatbot. A coach that knows your live score, your bottlenecks, and whether you
              did the last assignment.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {MENTORS.map((m) => (
              <div key={m.name} className="rounded-lg border border-border bg-card p-6 text-center">
                <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full border border-gold/30 bg-gold/5">
                  <m.icon className="size-6 text-gold" />
                </div>
                <div className="font-display text-sm font-semibold">{m.name}</div>
                <div className="mt-1 text-[10px] uppercase tracking-widest text-gold-soft">
                  {m.tone}
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{m.voice}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-b border-border bg-muted/20 py-16">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center font-display text-2xl font-bold tracking-tight">
            Operators who moved the number
          </h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {PROOF.map((p) => (
              <figure key={p.name} className="rounded-lg border border-border bg-card p-6">
                <blockquote className="text-sm leading-relaxed text-foreground/90">
                  "{p.quote}"
                </blockquote>
                <figcaption className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold">{p.name}</div>
                    <div className="text-[11px] text-muted-foreground">{p.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-display text-sm font-bold text-gold tabular-nums">
                      {p.voltage}
                    </div>
                    <div className="text-[9px] uppercase tracking-widest text-muted-foreground">
                      Voltage
                    </div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-b border-border py-16">
        <div className="mx-auto max-w-5xl px-5">
          <div className="text-center">
            <h2 className="font-display text-2xl font-bold tracking-tight md:text-3xl">
              Start free. Upgrade when you're ready.
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              No credit card to begin. The full loop unlocks on Creation Pro.
            </p>
          </div>
          <div className="mt-8">
            <BillingToggle billing={billing} onChange={setBilling} />
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {featuredPlans.map((plan) => {
              const isFree = plan.priceMonthly === 0;
              const price = displayPrice(plan, billing);
              const billed = billedAmount(plan, billing);
              const savings = annualSavingsPct(plan);
              return (
                <div
                  key={plan.key}
                  className={
                    "relative flex flex-col rounded-xl border bg-card p-6 " +
                    (plan.featured ? "border-gold/50 shadow-lg" : "border-border")
                  }
                >
                  {plan.featured && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-primary-foreground">
                      Most popular
                    </span>
                  )}
                  <div className="font-display text-base font-semibold">{plan.name}</div>
                  <div className="text-xs text-muted-foreground">{plan.tagline}</div>
                  <div className="mt-4 flex items-baseline gap-1">
                    <span className="font-display text-lg font-bold text-gold">£</span>
                    <span className="font-display text-3xl font-bold tabular-nums">
                      {isFree ? "0" : price.toFixed(price % 1 === 0 ? 0 : 2)}
                    </span>
                    <span className="text-xs text-muted-foreground">/mo</span>
                  </div>
                  {!isFree && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      {billing === "yearly" ? `Billed £${billed}/yr` : "Billed monthly"}
                      {billing === "yearly" && savings > 0 && (
                        <span className="ml-1 font-semibold text-gold">· Save {savings}%</span>
                      )}
                    </div>
                  )}
                  <ul className="mt-5 space-y-2.5">
                    {plan.features.slice(0, 6).map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs text-foreground/90">
                        <Check className="mt-0.5 size-3.5 shrink-0 text-gold" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  {isFree ? (
                    <Link
                      to="/login"
                      className={
                        "mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-medium transition-colors " +
                        (plan.featured
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border border-border text-foreground hover:bg-accent")
                      }
                    >
                      Start Free <ArrowRight className="size-4" />
                    </Link>
                  ) : (
                    <Link
                      to="/checkout/$plan"
                      params={{ plan: plan.key }}
                      search={billing === "yearly" ? { billing: "yearly" } : {}}
                      className={
                        "mt-6 inline-flex w-full items-center justify-center gap-1.5 rounded-md px-4 py-2.5 text-sm font-medium transition-colors " +
                        (plan.featured
                          ? "bg-primary text-primary-foreground hover:bg-primary/90"
                          : "border border-border text-foreground hover:bg-accent")
                      }
                    >
                      Choose {plan.name} <ArrowRight className="size-4" />
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Coach plans (£149–£399/mo) available for professional coaches with a client book —{" "}
            <Link to="/pricing" className="text-gold hover:underline">
              see all plans →
            </Link>
          </p>
        </div>
      </section>

      {/* One-time intensive CTA */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-3xl rounded-xl border border-gold/40 bg-gold/5 p-8 text-center gold-glow">
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold-soft">
            One-time · Fully AI-led
          </span>
          <h2 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
            Or skip the plan. Buy the intensive.
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
            The Creation Calibration Intensive is a one-time £299 deep session run end-to-end by an
            autonomous AI agent — the Calibration Director. It diagnoses your top constraint, writes
            your Creation Plan, and launches a 60-day accountability loop. Includes 60 days of
            Coach-tier access. No calendar booking. Starts the moment you enter.
          </p>
          <Link
            to="/checkout/calibration"
            className="mt-6 inline-flex items-center gap-2 rounded-md bg-gold px-7 py-3 text-sm font-bold text-background transition-colors hover:bg-gold-bright"
          >
            Enter the Intensive <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-b border-border py-16">
        <div className="mx-auto max-w-3xl px-5">
          <h2 className="text-center font-display text-2xl font-bold tracking-tight md:text-3xl">
            Questions
          </h2>
          <div className="mt-8 space-y-3">
            {FAQ.map((item) => (
              <FaqItem key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <img
            src={LOGO}
            alt="Bula Creation Golden Hexagon Logo"
            className="mx-auto size-12 rounded-sm object-contain"
          />
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Your algorithm begins with one audit.
          </h2>
          <p className="mt-3 text-muted-foreground">
            Find out your Creation Voltage and the single highest-leverage constraint holding it
            back. Free. Private by default.
          </p>
          <Link
            to="/login"
            className="mt-7 inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Begin Your Free Audit <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-5 text-xs text-muted-foreground md:flex-row">
          <div className="flex items-center gap-2">
            <img
              src={LOGO}
              alt="Bula Creation Golden Hexagon Logo"
              className="size-5 rounded-sm object-contain"
            />
            <span className="font-display font-semibold text-foreground">BULA CREATION</span>
          </div>
          <p>40-Point Creation Algorithm · AI Goal Execution System</p>
          <p>Private by default.</p>
        </div>
      </footer>

      {/* Sticky mobile CTA */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 p-3 backdrop-blur md:hidden">
        <Link
          to="/login"
          className="flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Begin Your Free Audit <ArrowRight className="size-4" />
        </Link>
      </div>

      {/* Video modal */}
      {videoOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 p-4 backdrop-blur"
          onClick={() => setVideoOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setVideoOpen(false)}
              className="absolute right-3 top-3 z-10 rounded-full border border-border bg-background/80 p-1.5 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Close video"
            >
              <X className="size-4" />
            </button>
            <div className="aspect-video w-full bg-background">
              {/* Replace this block with an embed when the video is ready */}
              <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                <PlayCircle className="size-12 text-gold/60" />
                <div>
                  <div className="font-display text-base font-semibold">The Creation Method</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    Video publishing soon — meanwhile, run your free audit to experience the loop.
                  </div>
                </div>
                <Link
                  to="/login"
                  className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Begin Your Free Audit <ArrowRight className="size-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-lg border border-border bg-card">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="font-display text-sm font-semibold text-foreground">{q}</span>
        <ChevronDown
          className={"size-4 shrink-0 text-gold transition-transform " + (open ? "rotate-180" : "")}
        />
      </button>
      {open && <p className="px-5 pb-4 text-xs leading-relaxed text-muted-foreground">{a}</p>}
    </div>
  );
}
