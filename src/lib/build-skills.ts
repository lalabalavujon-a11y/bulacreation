// Build Skills registry — the reusable engineering & product playbook used
// to construct the BULA Creation 40-Point Algorithm app.
//
// Every skill captured here is a transferable capability that can be
// applied to future portfolio builds (Diver Readiness, Financial Readiness,
// Property Performance, Lead Recon, etc.) without re-deriving the approach.
// Think of it as the "how we build agentic assessment SaaS" knowledge base.
//
// Grouped by discipline so it can be surfaced as a "Build Skills" page,
// exported as a prompt template, or fed to an AI mentor as project context.

export interface BuildSkill {
  id: string;
  name: string;
  category: BuildSkillCategory;
  /** What the skill does. */
  summary: string;
  /** How it was applied in this build. */
  appliedIn: string;
  /** Key files / patterns it lives in. */
  artifacts: string[];
}

export type BuildSkillCategory =
  "architecture" | "scoring" | "ai" | "data" | "commerce" | "design" | "ops";

export const BUILD_SKILLS: BuildSkill[] = [
  // ── Architecture ────────────────────────────────────────────────────────
  {
    id: "reusable-engine",
    name: "Reusable Assessment Engine",
    category: "architecture",
    summary:
      "Decompose any domain into pillars + points, score on a 4-tier rubric, gate by a governor point, rank by leverage — one engine, many definitions.",
    appliedIn:
      "Extracted the 40-point engine into src/engine/diagnosticEngine.ts and src/lib/assessment so six diagnostics share identical scoring logic.",
    artifacts: [
      "src/engine/diagnosticEngine.ts",
      "src/lib/assessment/types.ts",
      "src/lib/assessment/engine.ts",
    ],
  },
  {
    id: "auth-context",
    name: "Email-Identity Auth",
    category: "architecture",
    summary:
      "Passwordless magic-link-style login keyed to a stable contactId, with CRM upsert on first login and plan-tier tag auto-grant.",
    appliedIn:
      "AuthContext + loginContact server function create the identity and resolve entitlements from CRM tags.",
    artifacts: ["src/lib/diagnostic/auth-context.tsx", "src/lib/diagnostic/auth.functions.ts"],
  },
  {
    id: "entitlement-layer",
    name: "Local Entitlement & Paywall Layer",
    category: "architecture",
    summary:
      "A plan ladder + entitlements object consumed by every gated route. Structured so a real billing provider later writes the same PlanKey into persisted state without changing gate logic.",
    appliedIn: "subscription.ts + subscription-context.tsx + PaywallGate gate features per plan.",
    artifacts: [
      "src/lib/diagnostic/subscription.ts",
      "src/lib/diagnostic/subscription-context.tsx",
    ],
  },
  {
    id: "server-fn-split",
    name: "Server-Function Splitting",
    category: "architecture",
    summary:
      "Keep createServerFn wrappers thin; move runtime helpers/config to *.server.ts modules so RPC splitting never drops a sibling ReferenceError.",
    appliedIn:
      "crm.server.ts / store.server.ts hold secrets & API calls; *.functions.ts are thin RPC wrappers.",
    artifacts: ["src/lib/diagnostic/crm.server.ts", "src/lib/diagnostic/crm-sync.functions.ts"],
  },

  // ── Scoring ──────────────────────────────────────────────────────────────
  {
    id: "teachability-governor",
    name: "Gating Governor Multiplier",
    category: "scoring",
    summary:
      "A single critical point multiplies the whole output (×0.25…×1.0), modelling a real-world constraint that caps everything else until resolved.",
    appliedIn:
      "Point #2 (Teachability Index) is the governor in the 40-point algorithm; each assessment has its own gatingPointId.",
    artifacts: ["src/lib/diagnostic/scoring.ts", "src/lib/assessment/engine.ts"],
  },
  {
    id: "leverage-sort",
    name: "Bottleneck Leverage Sort",
    category: "scoring",
    summary:
      "Rank points by immediate yield (deficit × weight) to surface the top 3 highest-leverage constraints — 'what should I change next', not 'what's my score'.",
    appliedIn: "Leverage module and Creation Plan use the sort to prescribe the next move.",
    artifacts: ["src/routes/leverage.tsx", "src/lib/assessment/engine.ts"],
  },
  {
    id: "intervention-effectiveness",
    name: "Intervention Effectiveness Tracking",
    category: "scoring",
    summary:
      "Track whether recommended interventions actually produced voltage movement, so the system learns what works for this specific person over time.",
    appliedIn:
      "Trajectory module logs intervention → outcome pairs and flags constraint recurrence.",
    artifacts: ["src/lib/diagnostic/interventions.ts", "src/routes/trajectory.tsx"],
  },

  // ── AI ────────────────────────────────────────────────────────────────────
  {
    id: "persona-kb-skills",
    name: "Trained Persona KBs + Skills",
    category: "ai",
    summary:
      "Each AI mentor carries a curated knowledge base AND structured skills it emits (ASSIGNMENT, SATS, FORECAST, DRILL, CHECKPOINT) — not just a system prompt.",
    appliedIn:
      "personas-kb.ts + protocol.ts give Brotherhood/Neville/Maltz distinct training and parseable outputs.",
    artifacts: [
      "src/lib/diagnostic/personas-kb.ts",
      "src/lib/diagnostic/protocol.ts",
      "src/lib/diagnostic/personas.ts",
    ],
  },
  {
    id: "context-injection",
    name: "Live-Context Injection",
    category: "ai",
    summary:
      "Inject the user's live score, teachability, top bottlenecks, chief aim, and open commitments into every AI session so coaching is grounded, not generic.",
    appliedIn:
      "coach-context.ts builds the context block; realtime session route forwards it to the model instructions.",
    artifacts: ["src/lib/diagnostic/coach-context.ts", "src/routes/api/realtime/session.ts"],
  },
  {
    id: "commitment-parsing",
    name: "48-Hour Commitment Auto-Parsing",
    category: "ai",
    summary:
      "Parse ASSIGNMENT: lines from mentor replies into tracked commitments with countdowns; open assignments reinject into the next session to close the loop.",
    appliedIn: "protocol.ts parses commitments; Coach route renders the tracker.",
    artifacts: ["src/lib/diagnostic/protocol.ts", "src/routes/coach.tsx"],
  },
  {
    id: "realtime-webrtc",
    name: "Realtime Voice Mentor (WebRTC)",
    category: "ai",
    summary:
      "Ephemeral token from the server → WebRTC SDP handshake → bidirectional audio + transcript over a data channel, with interrupt support.",
    appliedIn: "useRealtimeMentor hook + /api/realtime/session route power the voice coach.",
    artifacts: ["src/lib/diagnostic/use-realtime-mentor.ts", "src/routes/api/realtime/session.ts"],
  },

  // ── Data ──────────────────────────────────────────────────────────────────
  {
    id: "private-mode",
    name: "Private-by-Default Storage",
    category: "data",
    summary:
      "All state lives in localStorage until the user explicitly disables Private Mode; cloud sync and CRM pushes are fully gated behind that toggle.",
    appliedIn: "DiagnosticProvider + CloudSyncPanel enforce the privacy gate.",
    artifacts: ["src/lib/diagnostic/context.tsx", "src/components/diagnostic/cloud-sync-panel.tsx"],
  },
  {
    id: "sm2-srs",
    name: "SM-2 Spaced Repetition",
    category: "data",
    summary:
      "A pure SM-2 scheduler (ease factor, expanding intervals, maturity) turns audit friction points into daily review cards so learning compounds.",
    appliedIn: "srs.ts + srs-context.tsx power the /srs deck with friction import.",
    artifacts: ["src/lib/diagnostic/srs.ts", "src/lib/diagnostic/srs-context.tsx"],
  },
  {
    id: "digital-twin",
    name: "Personal Digital Twin Model",
    category: "data",
    summary:
      "Aggregate aims, state, behaviour, constraints, trajectory, and intervention outcomes into one longitudinal model that learns what moves a specific person.",
    appliedIn: "twin.ts + /twin route build the persistent profile.",
    artifacts: ["src/lib/diagnostic/twin.ts", "src/routes/twin.tsx"],
  },
  {
    id: "crm-sync",
    name: "CRM Field + Tag + Pipeline Sync",
    category: "data",
    summary:
      "Mirror voltage/zone/chief-aim/bottleneck to CRM custom fields, swap zone tags, and route contacts through a sales pipeline — non-blocking on audit save.",
    appliedIn: "crm.server.ts syncs to the live CRM IDs; webhook re-entitles on checkout.",
    artifacts: ["src/lib/diagnostic/crm.server.ts", "src/routes/api/webhooks/checkout.ts"],
  },

  // ── Commerce ──────────────────────────────────────────────────────────────
  {
    id: "plan-ladder",
    name: "Five-Tier Plan Ladder",
    category: "commerce",
    summary:
      "Free → Pro → Performance → Coach → Coach Pro, each with explicit entitlements and a monthly/annual billing toggle with savings display.",
    appliedIn: "subscription.ts defines the ladder; billing-toggle.tsx + pricing/vsl render it.",
    artifacts: [
      "src/lib/diagnostic/subscription.ts",
      "src/components/diagnostic/billing-toggle.tsx",
    ],
  },
  {
    id: "checkout-webhook",
    name: "Order-Form Checkout + Webhook Re-Entitlement",
    category: "commerce",
    summary:
      "CTAs route to connected order forms; a signed webhook re-entitles the app on payment and re-syncs the contact tier on every login.",
    appliedIn:
      "checkout.$plan route redirects; /api/webhooks/checkout verifies HMAC + Zod and activates the plan.",
    artifacts: ["src/routes/checkout.$plan.tsx", "src/routes/api/webhooks/checkout.ts"],
  },

  // ── Design ────────────────────────────────────────────────────────────────
  {
    id: "noir-gold-system",
    name: "Noir-Gold Design System",
    category: "design",
    summary:
      "A committed dark theme (near-black bg, gold accents) defined in semantic oklch tokens so components never use raw colours.",
    appliedIn:
      "styles.css defines tokens; all components use gold/gold-soft/gold-bright/muted-foreground.",
    artifacts: ["src/styles.css"],
  },
  {
    id: "auto-guide",
    name: "Auto-Updating Guide from Feature Catalogue",
    category: "design",
    summary:
      "A single FEATURES registry is the source of truth; the Guide renders from it so the playbook never drifts from the live app.",
    appliedIn: "features.ts + guide.tsx render the catalogue dynamically.",
    artifacts: ["src/lib/diagnostic/features.ts", "src/routes/guide.tsx"],
  },

  // ── Ops ───────────────────────────────────────────────────────────────────
  {
    id: "edge-deploy",
    name: "Edge Deployment (Cloudflare Pages + D1)",
    category: "ops",
    summary:
      "Static SPA on Pages with a Worker backend, D1 persistence, and KV cache — all secrets read inside server handlers.",
    appliedIn: "DEPLOYMENT.md documents the Pages + Worker + D1 + KV topology.",
    artifacts: ["DEPLOYMENT.md"],
  },
  {
    id: "qa-guardian",
    name: "QA Guardian Agent",
    category: "ops",
    summary:
      "A suggestive-mode CRM agent that monitors payment failures, sync errors, and entitlement mismatches and alerts before issues reach users.",
    appliedIn: "Guardian agent configured in the CRM sub-account alongside the mentor agents.",
    artifacts: ["DEPLOYMENT.md"],
  },
];

export const BUILD_SKILL_CATEGORIES: {
  key: BuildSkillCategory;
  label: string;
  blurb: string;
}[] = [
  {
    key: "architecture",
    label: "Architecture",
    blurb: "Reusable patterns that make every portfolio build faster.",
  },
  {
    key: "scoring",
    label: "Scoring & Diagnostics",
    blurb: "The math and ranking that turns self-assessment into a control loop.",
  },
  { key: "ai", label: "AI & Coaching", blurb: "Trained mentors, context injection, and voice." },
  {
    key: "data",
    label: "Data & Persistence",
    blurb: "Privacy-first storage, spaced repetition, and CRM sync.",
  },
  { key: "commerce", label: "Commerce", blurb: "Plans, checkout, and re-entitlement." },
  { key: "design", label: "Design System", blurb: "Theme tokens and self-maintaining docs." },
  { key: "ops", label: "Operations", blurb: "Deployment, secrets, and quality assurance." },
];
