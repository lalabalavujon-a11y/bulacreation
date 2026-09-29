# CREATION — V1 Commercial Specification

> **Status:** Draft for review · **Owner:** Product · **Date:** 2026-09-25
> **Source basis:** Live build audit (Overview, Audit, Analytics, Leverage, Trajectory, AI Mentor, Guide) + external commercial review.
> **Governing principle:** The defensible asset is not the LLM. It is the **40-Point Creation Algorithm™ + longitudinal user state + intervention/outcome history + agentic feedback loop.** Everything in this spec protects and develops that moat.

---

## 0. Executive Summary

Creation is not a manifestation app. It is a **Personal Operating System that converts goals, behaviour, self-assessment and AI coaching into a measurable feedback loop.**

The core loop already exists in the live build:

> **Audit → Diagnose → Prioritise (Leverage) → Act (Reflex Circuit / Commitment) → Measure (Trajectory) → Coach (AI Mentor) → Repeat**

V1's job is to turn that loop into a **commercially defensible product** by:

1. Repositioning the category away from "manifestation" toward **AI Goal Execution System / Personal OS.**
2. Formalising the 40-point methodology with **observable, defensible scoring criteria.**
3. Separating the **neutral core engine** from a **selectable interpretation/philosophy layer.**
4. Making **Chief Aim the centre of the UX.**
5. Upgrading the AI Mentor from chatbot to **agent** (observe → reason → prescribe → remind → verify → learn).
6. Adding **intervention analytics** so the system learns what actually moves each user.
7. Building the **Coach OS** — the strongest revenue engine.
8. Introducing a **tiered paywall** and **retention-first onboarding.**

**Non-goals for V1:** clinical/therapeutic claims, team/enterprise multi-tenant, custom branding white-label. These are V2+.

---

## 1. Positioning & Category

### 1.1 Category
**AI Goal Execution System** (consumer) / **Coach Operating System** (professional).

Not "AI creation tool" (competes with Adobe Express, Gamma, Lovable — unwinnable).
Not "manifestation app" (narrows TAM, invites credibility attacks).

### 1.2 One-line positioning
> *Creation turns your single most important goal into a measurable feedback loop — diagnosing the constraint blocking it, prescribing the next move, and tracking whether you actually moved.*

### 1.3 Terminology repositioning (default = neutral/performance)

The live build uses metaphysical labels as **default** UI language. V1 repositions defaults to neutral/performance and demotes the metaphysical framing to a **selectable philosophy layer** (see §5).

| Current (metaphysical default) | V1 default (neutral/performance) | Retained as philosophy-layer term |
|---|---|---|
| Quantum Field Analytics | **Pillar Analytics** | "Quantum Field" (Neville/Spiritual) |
| Vibrational Physics & Carrier Frequencies | **State & Alignment** | "Carrier Frequency" (Neville/Spiritual) |
| Subconscious Reprogramming & Resistance Clearing | **Mental Models & Resistance** | "Counter-intentions" (Maltz/Neville) |
| Somatic, Energetic & Karmic Ledger | **Integrity & Recovery Ledger** | "Karmic Ledger" (Spiritual) |
| Cybernetic Tracking & Real-World Alignment | **Execution & Alignment** | unchanged (Maltz/Performance) |
| Creation Voltage | **Creation Voltage™** (retained — owned term) | — |
| "Manifestation phase" | **Execution Active** | "Manifestation" (Neville/Spiritual) |
| "the field holds it" | "the system holds it" | philosophy-layer only |

**Rule:** The neutral term is always the default in UI, docs, and marketing. Philosophy-layer terms appear **only** when a user has selected that philosophy, and never in default onboarding or pricing pages.

### 1.4 Creation Voltage™ — owned definition
> **Creation Voltage™** is Creation's composite readiness-and-execution index, calculated from the 40-point audit across six pillars, scaled 0–10,000. It is a **heuristic alignment score**, not a scientifically measured energy level. It indicates how aligned your current state and behaviour are with your stated Chief Aim.

This definition is published in-app (Guide + a "What does my score mean?" affordance) to prevent overclaiming.

---

## 2. Ideal Customer Profile (ICP) & Segmentation

### 2.1 Primary consumer ICP
**Goal-driven individuals running a recurring self-improvement loop** — entrepreneurs, founders, ambitious professionals, athletes, serious self-development practitioners. They already track something (habits, metrics, journals) and are frustrated that motivation doesn't persist.

**Disqualifier:** users seeking passive "manifest and receive" with no behaviour change. (They churn; do not optimise for them.)

### 2.2 Primary commercial wedge — Coaches
Professional coaches (performance, executive, business, mindset) managing 10–100 clients who need **assessment + monitoring + accountability infrastructure.** Highest ARPU, strongest retention, natural expansion.

### 2.3 Segment matrix

| Segment | Problem solved | Potential | V1 priority |
|---|---|---:|:---:|
| Entrepreneurs/founders | execution, focus, accountability | High | ✅ Primary |
| Coaches | client assessment + monitoring | **Very high** | ✅ Wedge |
| Self-development market | structured transformation | High | ✅ Secondary |
| Executives | performance/decision discipline | Med–High | Later |
| Manifestation audience | structured practice | High | ✅ via philosophy layer |
| Teams | accountability/performance | — | V2 |
| General consumers | goal achievement | Huge, hard | V2 |
| Therapists/clinical | — | Avoid | ❌ |

---

## 3. The 40-Point Creation Algorithm™ — Formalised Methodology

### 3.1 Design principle
Every point must be **observable** — scorable from behaviour a user (or coach) can witness, not from a feeling alone. V1 formalises each point as:

> **Definition → observable behaviour → 4-tier scoring criteria → evidence prompt → intervention → reassessment interval**

### 3.2 Scoring model (unchanged engine, documented)
- **Raw Points** = Σ (Weightᵢ × Scoreᵢ), 40 points, 4-tier rubric:
  - `0.00` Friction · `0.33` Emerging · `0.66` Aligned · `1.00` Mastered
- **Teachability Governor (Point #2):** `0.50 + 0.50 × Score₂` — caps total output by up to 50%.
- **Final** = Raw × Governor, scaled to 10,000.
- **Zones:** 0–3,999 Friction · 4,000–5,999 Emergence · 6,000–10,000 Execution Active.

### 3.3 Pillar allocation (V1 default neutral names)

| Pillar | V1 default name | Focus | Max pts |
|---|---|---|---:|
| I | Epistemic Foundation & The 4 Basics | Mentorship, Teachability, 90/10 Balance | 2,150 |
| II | Intent Engineering & Linguistic Architecture | Chief Aim, Specificity, Disgust | 1,350 |
| III | State & Alignment | Somatic feeling, Detachment, Gratitude | 1,450 |
| IV | Mental Models & Resistance | Counter-intentions, Envy | 2,050 |
| V | Integrity & Recovery Ledger | Restitution, Cellular Purity, EMF | 1,750 |
| VI | Execution & Alignment | Mastermind, Metrics, Burning Boats | 1,250 |
| | **Total** | | **10,000** |

### 3.4 Exemplar formalised point — "Feedback Integration" (Pillar VI)

| Tier | Observable behaviour |
|---|---|
| **Friction (0.00)** | Receives feedback but routinely rejects/ignores it. |
| **Emerging (0.33)** | Accepts feedback but implementation is inconsistent. |
| **Aligned (0.66)** | Usually translates important feedback into action. |
| **Mastered (1.00)** | Rapidly tests feedback, measures outcomes, institutionalises useful learning. |

- **Evidence prompt:** *"Cite one piece of feedback you acted on this week and the outcome."*
- **Intervention:** AI assigns a 48-hour feedback-test assignment.
- **Reassessment:** weekly.

> **V1 deliverable:** Convert all 40 points to this format in a `methodology.ts` data module (single source of truth consumed by Audit UI, AI context, and the Creation Plan generator). This is the methodology moat made concrete.

### 3.5 Scoring validation & honesty
- Scores are **heuristic**, not psychometric instruments. State this explicitly.
- V1 adds an optional **"Why this tier?" evidence note** per point (free text). This (a) improves self-honesty, (b) seeds intervention analytics, (c) gives coaches qualitative signal.
- Future: peer/coach-verified scoring; calibration against outcome data (V2).

---

## 4. Product Architecture (V1)

### 4.1 Loop architecture (the IP)

```
   ┌─────────────────────────────────────────────────────────────┐
   │                    CHIEF AIM (centre)                        │
   │   "What are you creating?" — single, definite, specific      │
   └──────────────────────────────┬──────────────────────────────┘
                                  │
   Audit ────────────────► Diagnose (Pillar Analytics)
     ▲                            │
     │                     Prioritise (Leverage Engine)
     │                            │
   Measure ◄────────────── Act (Reflex Circuit + Commitment)
   (Trajectory)                   │
     │                     Coach (AI Agent)
     │                            │
     └──────── Repeat ────────────┘
```

Every screen answers one of: **Where are you now? · What's stopping you? · What's the next move? · Did it work?**

### 4.2 Module map (V1 changes vs. live build)

| Module | Live status | V1 change |
|---|---|---|
| Overview | ✅ | Re-centre on Chief Aim; neutral terminology; Creation Plan CTA. |
| 40-Point Audit | ✅ | Add evidence notes; methodology.ts; neutral pillar names. |
| Pillar Analytics | ✅ (was "Quantum Field") | Rename; add efficiency/deficit emphasis. |
| Leverage Engine | ✅ | Strengthen "what to change next" framing; tie to Creation Plan. |
| Reflex Circuit | ✅ | Keep; wire output into Commitment tracker. |
| Trajectory | ✅ | Add Velocity, Momentum, Commitment Completion Rate, Constraint Recurrence. |
| AI Mentor | ✅ | Upgrade to agent loop (§6); add Creation Plan generator. |
| Commitments | ✅ | Keep; surface overdue in Overview + coach alerts. |
| CRM Sync | ✅ | Keep; extend for Coach OS client fields. |
| Private Mode | ✅ | Keep as default ON. |
| **Creation Plan** | ❌ NEW | Post-audit AI-generated execution plan + BEGIN EXECUTION (§7). |
| **Philosophy Selector** | ❌ NEW | Onboarding choice; swaps interpretation layer (§5). |
| **Coach Dashboard** | ❌ NEW (V1.1) | Multi-client view, alerts, assignments (§9). |

---

## 5. Philosophy Layer (methodology ≠ worldview)

### 5.1 Principle
The **40-point engine is worldview-neutral.** The **interpretation layer** (language, metaphors, mentor persona, framing) is selectable. This widens TAM without diluting the core.

### 5.2 V1 philosophies

| Philosophy | Framework | Default mentor persona | Notes |
|---|---|---|---|
| **Performance** | Cybernetics, behavioural science, systems thinking | Cybernetics Engineer (Maltz) | V1 default. |
| **Founder** | Execution, leverage, accountability, metrics | Brotherhood Master | Entrepreneur wedge. |
| **Stoic** | Agency, discipline, virtue, resilience | (new persona) | Broad appeal. |
| **Maltz** | Self-image, psycho-cybernetics, servo-mechanism | Cybernetics Engineer | Existing. |
| **Neville** | Assumption, imagination, state (SATS) | Mystical Assumption | Existing; metaphysical language ON. |
| **Spiritual** | Purpose, gratitude, alignment, reflection | (new persona) | Metaphysical language ON. |

### 5.3 Behaviour
- Selecting a philosophy swaps: pillar display names, zone labels ("Execution Active" ↔ "Manifestation"), mentor persona, and the interpretation tone in the Creation Plan — **never** the underlying scores or weights.
- Philosophy is user-selectable anytime; re-selection does not re-score history.
- Onboarding default = **Performance** (neutral), maximising initial credibility.

---

## 6. AI Mentor → Agent Architecture

### 6.1 Agent loop (upgrade from chatbot)

```
Observe → Reason → Prescribe → Remind → Verify → Learn
```

| Stage | V1 implementation |
|---|---|
| **Observe** | Inject live context: score, zone, teachability, top bottlenecks, Chief Aim, open/overdue commitments, last intervention + outcome. (Already partially live.) |
| **Reason** | Mentor KB + skills (existing) + methodology.ts criteria → identify single highest-leverage constraint. |
| **Prescribe** | Issue ONE specific, measurable, time-boxed assignment (48h default). Parse into Commitment tracker. (Live.) |
| **Remind** | Scheduled nudge (CRM workflow / in-app) when commitment approaches deadline. |
| **Verify** | On next session: "Did you do it?" → mark done/missed → record outcome. (Live.) |
| **Learn** | Log intervention → commitment → outcome → ΔVoltage. Build per-user intervention-effectiveness history (§8). |

### 6.2 The shift in UX voice
Creation should not primarily say "Ask the AI Mentor." It should say:

> **"Here is what you need to do today."** → **DO IT** → **"DID YOU DO IT?"**

This converts the product from chatbot to coach.

### 6.3 Context injection contract (formalised)
The agent always receives a structured context block (server-built, persona-agnostic):

```
LIVE USER CONTEXT — 40-Point Creation Algorithm:
• Creation Voltage : X / 10,000
• Zone             : EXECUTION ACTIVE / EMERGENCE / FRICTION
• Chief Aim        : <aim>
• Believability    : n / 10
• Top constraint   : Point #N — <name> (<tier>)
• Open commitments : k (m overdue)
• Last intervention: <assignment> → <done|missed> → ΔV = ±n
• Philosophy       : <selected>
```

---

## 7. Creation Plan™ (flagship V1 feature)

Generated by the AI agent immediately after an audit. Replaces "here's your score" with "here's your move."

### 7.1 Template

```
YOUR CREATION PLAN

Chief Aim .......... <single definite aim + target date>
Creation Voltage .... X — <Zone>
Primary Constraint .. <Point #N — name> (<tier>)
Why ................ <AI: 1–2 sentence explanation grounded in methodology>
72-Hour Intervention <one specific, measurable action>
This Week .......... 3 actions
Do NOT Focus On .... 3 distractions
Next Audit ......... <scheduled date/time>

[ BEGIN EXECUTION ]
```

### 7.2 "BEGIN EXECUTION"
- Converts the 72-hour intervention + 3 weekly actions into tracked Commitments.
- Schedules the next audit (default: weekly, Sunday).
- Sets a reminder via CRM workflow (if sync enabled) or in-app.
- Surfaces the plan on Overview until the next audit.

### 7.3 Implementation note
Server function: `generateCreationPlan(scores, chiefAim, philosophy, commitments, history)` → returns structured plan. Rendered in a dedicated panel on Overview + a printable/shareable view.

---

## 8. Intervention Analytics & Longitudinal Data Model

### 8.1 Goal
After six months, Creation should know: *"When this user gets stuck, the recurring constraint is X; intervention Y historically produces movement, intervention Z doesn't."* This is **personalised cybernetic intelligence** — the deepest moat.

### 8.2 V1 trajectory metrics (extend current snapshot)

| Metric | Definition |
|---|---|
| Creation Voltage | current composite score |
| **Creation Velocity** | ΔVoltage / week (slope) |
| **Creation Momentum** | rolling 3-week velocity trend |
| **Constraint Recurrence** | frequency each point appears as top bottleneck |
| **Intervention Effectiveness** | mean ΔVoltage after a given intervention type |
| **Commitment Completion Rate** | done / (done+missed) over rolling window |
| **Aim Progress** | user-reported progress toward Chief Aim (0–100%) |
| **Weekly Consistency** | consecutive weeks with a logged audit |

### 8.3 Data model (V1 — durable store)

> Note: the platform edge runtime does not currently expose Cloudflare D1/KV/R2 bindings to the app. V1 persistence strategy: **CRM contact record as the durable cross-device store** (custom fields + tags + notes), with **localStorage as the offline/private default.** A future Cloudflare-binding migration path is documented in §11 but not a V1 blocker.

**Entities:**

```
User / Contact (CRM-backed)
  ├─ chief_aims[]          { aim, specificity, believability, disgust, handwriting, target_date }
  ├─ audit_scores[]        { point_number, tier, evidence_note, updated_at }
  ├─ trajectory_snapshots[]{ ts, voltage, raw, governor, pillar_scores, zone }
  ├─ commitments[]         { id, assignment, due, status, source_intervention, outcome_delta }
  ├─ interventions[]       { id, type, target_point, prescribed_at, commitment_id, outcome_delta }
  ├─ creation_plans[]      { generated_at, constraint, intervention, weekly_actions, next_audit }
  └─ philosophy            { current, history[] }
```

**CRM custom fields (mirror):** `creation_voltage`, `creation_zone`, `chief_aim`, `top_constraint`, `commitment_completion_rate`, `last_audit_at`, `philosophy`.
**CRM tags (zone swap):** `creation-friction`, `creation-emergence`, `creation-execution` (replace current `40pt-*` naming for neutral positioning).

---

## 9. Coach Operating System (V1.1 — strongest revenue engine)

### 9.1 Concept
A coach with 50 clients sees:

```
John   5,420 ↓   top constraint: Feedback Integration   overdue: 2
Sarah  7,110 ↑   —                                          overdue: 0
David  3,870 ⚠   top constraint: Counter-intentions       overdue: 4
Clients requiring intervention: 6
```

### 9.2 Coach dashboard features (V1.1 scope)
- Multi-client Creation Voltage table with trend arrows.
- Recurring-constraint heatmap across client roster.
- Overdue-assignment alerts.
- Per-client Creation Plan view + session summary export.
- Bulk assignment / protocol push.
- Client reports (monthly Creation Report).

### 9.3 Data isolation
Each client = a CRM contact. Coach = sub-account with scoped access to a client roster. No multi-tenant DB needed in V1.1 — leverage CRM location + tags.

---

## 10. Pricing & Paywall

### 10.1 Tier ladder

| Tier | Price | Audience | Includes |
|---|---|---|---|
| **Free** | £0 | Acquisition | 1 baseline audit, Creation Voltage, basic pillar analysis, 1 AI interpretation, ≤3 snapshots, Performance philosophy only. |
| **Creation Pro** | £19/mo · £190/yr | Consumer sweet spot | Unlimited audits, full analytics, Leverage Engine, trajectory/history, AI Mentor, 48h commitments, weekly protocol, all philosophies. |
| **Creation Performance** | £39/mo | Power consumer | + voice coaching, daily interventions, deep memory, multiple Chief Aims, advanced forecasting, monthly Creation Report, intervention analytics. |
| **Creation Coach** | £99–149/mo | Pro coaches | 10–25 clients, coach dashboard, alerts, assignments, trajectory, session summaries, client reports, custom persona. |
| **Creation Coach Pro** | £249–399/mo | Coaching businesses | 50–100 clients, custom branding, custom methodologies, team coaches, automations, CRM, API/webhooks, analytics. |
| **Enterprise** | Custom | Large orgs | Custom. |

### 10.2 Paywall gates (V1)
- Free → Pro: audit count, snapshot count, philosophy selection, Leverage Engine, trajectory history, AI Mentor sessions/week.
- Pro → Performance: voice coaching, daily interventions, multi-aim, forecasting, Creation Report.
- Consumer → Coach: client roster size, coach dashboard, bulk assign.

### 10.3 Illustrative economics
- Consumer: 1k @ £19 = £19k MRR · 5k = £95k MRR · 10k = £190k MRR.
- Coach: 100 @ £149 = £14.9k MRR · 500 = £74.5k MRR · 1k = £149k MRR.
- B2B is higher ARPU, lower CAC, stronger retention.

### 10.4 Do NOT monetise exactly as-is
Complete the commercialisation pass (§12) before opening paid tiers. The critical pre-revenue metric is **8-week retention**, not signups.

---

## 11. Infrastructure & Persistence Strategy

### 11.1 Current state
- App: TanStack Start (React 19) on edge runtime.
- Persistence: localStorage (default, Private Mode ON) + CRM mirror (custom fields/tags) via server routes.
- AI: OpenAI Realtime (voice) + text coach; persona KBs + skills.
- **Gap:** No durable Cloudflare D1/KV/R2 binding accessible to the app — server store is ephemeral.

### 11.2 V1 strategy (no blocker)
- **Durable cross-device store = CRM contact record.** Custom fields hold voltage/zone/aim/constraint; tags hold zone; notes/activities hold snapshots + plans + interventions.
- **Private/offline = localStorage.**
- This is sufficient for V1 consumer + early Coach OS.

### 11.3 Future migration path (V2)
When Cloudflare bindings are available (standalone Worker deployment alongside the app, or platform binding support):
- Migrate `audit_scores`, `trajectory_snapshots`, `commitments`, `interventions`, `creation_plans` to **D1** (relational, queryable).
- **KV** for session state / ephemeral realtime session cache.
- **R2** for exported Creation Reports, audio transcripts, evidence attachments.
- Keep CRM as the **integration/automation** layer (workflows, tags, comms), not the primary data store.

### 11.4 Security & privacy
- Private Mode default ON; user must explicitly enable cloud/CRM sync.
- No PII in public API responses; server routes validate input (Zod).
- CRM sync is opt-in per user; coach access is scoped to declared roster.

---

## 12. Commercialisation Pass — Priority Sequence

1. **Reposition category** — neutral terminology defaults + "AI Goal Execution System" framing. *(§1, §5)*
2. **Formalise 40-point methodology** — `methodology.ts`, observable criteria, evidence prompts. *(§3)*
3. **Separate methodology from worldview** — Philosophy Selector. *(§5)*
4. **Make Chief Aim the centre** — UX re-centre. *(§4, §7)*
5. **Strengthen evidence capture** — per-point "why this tier?" notes. *(§3.5)*
6. **Upgrade AI Mentor into an agent** — full observe→learn loop. *(§6)*
7. **Build intervention analytics** — effectiveness tracking. *(§8)*
8. **Create the Coach product** — Coach Dashboard (V1.1). *(§9)*
9. **Introduce subscription/paywall.** *(§10)*
10. **Run a 50–100 person founding cohort** — measure 8-week retention, not signups.

---

## 13. Onboarding & Retention Loop

### 13.1 Onboarding flow (V1)
1. **"What are you creating?"** — capture Chief Aim (specificity, believability, disgust, target date).
2. **Choose your framework** — Philosophy Selector (default: Performance).
3. **Run your first audit** — 40 points (evidence notes optional but encouraged).
4. **Receive your Creation Plan** — AI-generated, with BEGIN EXECUTION.
5. **Schedule next audit** — default weekly.
6. *(If sync enabled)* — mirror to CRM; trigger welcome workflow.

### 13.2 Retention loop (weekly)
```
Sunday audit → Creation Plan → daily commitments → mid-week nudge
→ "did you do it?" verify → next Sunday audit → ΔVoltage + Creation Report
```

### 13.3 North-star retention metric
> **Weekly Active Auditors at Week 8 (W8 WAU).**
> Target: ≥40% of founding cohort still running their weekly Creation loop at week 8. If hit, product-market signal is real.

### 13.4 Anti-churn signals to instrument
- Missed consecutive audits (≥2).
- Stagnant Velocity (≤0 over 3 weeks).
- Commitment Completion Rate < 30%.
- Philosophy switched >3× (indecision).
→ Each triggers a re-engagement intervention (AI or CRM workflow).

---

## 14. 90-Day Launch Plan

### Phase 1 — Foundation (Days 1–30)
- [ ] Implement neutral terminology defaults across all routes (§1.3).
- [ ] Build `methodology.ts` — all 40 points formalised (§3.4).
- [ ] Add per-point evidence notes to Audit (§3.5).
- [ ] Build Philosophy Selector + onboarding (§5, §13.1).
- [ ] Re-centre Overview on Chief Aim (§4.2).

### Phase 2 — Agentic Core (Days 31–60)
- [ ] Creation Plan generator + BEGIN EXECUTION (§7).
- [ ] Upgrade AI Mentor to full agent loop with intervention logging (§6).
- [ ] Extend Trajectory: Velocity, Momentum, Completion Rate, Constraint Recurrence (§8.2).
- [ ] Intervention Effectiveness analytics (§8.2).
- [ ] CRM field/tag rename to neutral `creation-*` (§8.3).

### Phase 3 — Commercialisation (Days 61–90)
- [ ] Paywall + tier gating (§10).
- [ ] Monthly Creation Report export (Performance tier).
- [ ] Coach Dashboard MVP (V1.1, §9) — pilot with 3–5 coaches.
- [ ] Founding cohort (50–100 users) — instrument W8 WAU.
- [ ] Decision gate: if W8 retention ≥40%, scale acquisition; else iterate on loop friction.

---

## 15. Portfolio Pattern — Reusable Agentic Assessment Engine

The Creation architecture is a **reusable pattern** for diagnostic agentic SaaS across the portfolio:

```
Assessment Schema → Weighted Scoring → Constraint Detection →
Leverage Ranking → AI Intervention → Commitment → Monitoring →
Reassessment → Trajectory → CRM Automation
```

Candidate verticals:

| Product | Index | Diagnostic → intervention |
|---|---|---|
| **Lead Recon** | Business Growth Voltage | growth constraint → AI intervention |
| **Professional Diver** | Diver Readiness Index | competence/knowledge/certs → learning intervention |
| **MoneyHoney** | Financial Readiness Index | cashflow/tax/savings/compliance → AI intervention |
| **Bula Properties** | Property Performance Index | occupancy/pricing/reviews/ops → revenue optimisation |

> **Strategic recommendation:** Extract the engine into a shared `assessment-engine` package once Creation V1 validates the pattern. The Creation Algorithm then becomes an **architectural pattern for diagnostic agentic SaaS**, not just one product.

---

## 16. Open Questions / Decisions Needed

1. **Brand name:** keep "Creation" or rename to something more performance-coded (e.g., "Voltage", "Caliber")? *Recommendation: keep Creation; own Creation Voltage™.*
2. **Default philosophy:** Performance (recommended) vs. a dual-default that surfaces Neville only after onboarding?
3. **Coach OS timing:** ship Coach Dashboard in V1 (faster revenue) or V1.1 (focus on consumer retention first)? *Recommendation: V1.1, pilot with 3–5 coaches in Phase 3.*
4. **Cloudflare binding:** pursue standalone Worker for D1/KV/R2 now, or defer to V2? *Recommendation: defer; CRM-as-store is sufficient for V1.*
5. **Pricing currency:** £ vs $ — confirm primary market before launch.

---

*End of V1 Specification. Next step: review, resolve §16 open questions, then execute Phase 1.*
