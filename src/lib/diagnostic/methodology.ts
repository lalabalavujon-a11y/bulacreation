// The 40-Point Creation Algorithm™ — Formalised Methodology.
// Single source of truth: Definition → observable behaviour (4 tiers) →
// evidence prompt → intervention → reassessment interval.
// Consumed by the Audit UI (criteria display), AI context (intervention
// prescriptions), and the Creation Plan generator. This is the methodology moat.

import type { Tier } from "./points";

export interface TierCriteria {
  tier: Tier;
  label: string;
  behaviour: string; // observable, witnessable
}

export interface MethodologyPoint {
  id: number;
  name: string;
  definition: string;
  criteria: TierCriteria[];
  evidencePrompt: string;
  intervention: string;
  reassessment: string; // interval
}

// Helper to build the 4-tier criteria block concisely.
function crit(
  friction: string,
  emerging: string,
  aligned: string,
  mastered: string,
): TierCriteria[] {
  return [
    { tier: 0, label: "Friction", behaviour: friction },
    { tier: 0.33, label: "Emerging", behaviour: emerging },
    { tier: 0.66, label: "Aligned", behaviour: aligned },
    { tier: 1, label: "Mastered", behaviour: mastered },
  ];
}

export const METHODOLOGY: MethodologyPoint[] = [
  // ── Pillar I — Epistemic Foundation & The 4 Basics ──────────────────────
  {
    id: 1,
    name: "Mentorship & Guidance Seeking",
    definition:
      "Active relationship with a living mentor or coach who provides external calibration.",
    criteria: crit(
      "No mentor. Decisions made in isolation; no external accountability.",
      "Has identified a mentor but engages irregularly or only when in crisis.",
      "Meets with a mentor on a consistent schedule and implements their guidance.",
      "Deep mentor relationship; proactively seeks challenge and institutionalises feedback.",
    ),
    evidencePrompt:
      "Name your current mentor and the last specific guidance they gave you that you acted on.",
    intervention: "Identify and initiate contact with one mentor candidate within 48 hours.",
    reassessment: "weekly",
  },
  {
    id: 2,
    name: "Teachability Index",
    definition:
      "The master governor — willingness to receive, test, and adopt guidance. Gates total output by up to 50%.",
    criteria: crit(
      "Rejects, deflects, or argues against feedback. 'I already know that.'",
      "Listens to feedback but selectively ignores what is uncomfortable.",
      "Receives feedback openly and attempts to implement most of it.",
      "Actively solicits feedback, tests it rapidly, and adopts what works without ego resistance.",
    ),
    evidencePrompt: "Describe the last time someone corrected you. What did you do with it?",
    intervention:
      "Ask one trusted person for one piece of unfiltered feedback this week — and act on it without defending.",
    reassessment: "weekly",
  },
  {
    id: 3,
    name: "90/10 Balance",
    definition:
      "Ratio of consumption (input) to creation (output). High performers bias toward output.",
    criteria: crit(
      "Overwhelmingly consumes content; near-zero creation or output.",
      "Mostly consumes; occasional creation but no consistent output habit.",
      "Regular creation habit; input and output are roughly balanced.",
      "Output-dominant; consumes strategically and only to fuel immediate creation.",
    ),
    evidencePrompt: "Log your input vs output hours this week. What is the actual ratio?",
    intervention: "Impose a 48-hour content fast — zero passive consumption; only creation.",
    reassessment: "weekly",
  },
  {
    id: 4,
    name: "Epistemic Humility",
    definition: "Willingness to be wrong, update beliefs, and re-derive from first principles.",
    criteria: crit(
      "Defends existing beliefs against all evidence; never admits error.",
      "Acknowledges being wrong occasionally but resists updating core assumptions.",
      "Updates beliefs when presented with sufficient evidence.",
      "Actively tests and falsifies own assumptions; treats being wrong as a win.",
    ),
    evidencePrompt:
      "Name a belief you held 12 months ago that you have since abandoned. What changed it?",
    intervention:
      "Pick one assumption about your Chief Aim and design a test that could prove it wrong.",
    reassessment: "monthly",
  },
  {
    id: 5,
    name: "Coachability Under Pressure",
    definition: "Receptivity to correction when challenged, stressed, or emotionally activated.",
    criteria: crit(
      "Shuts down, attacks, or withdraws when challenged under pressure.",
      "Resists initially but may process feedback after cooling down.",
      "Maintains receptivity through moderate pressure.",
      "Most open and receptive precisely when under maximum pressure — uses challenge as fuel.",
    ),
    evidencePrompt:
      "Recall the last high-stakes correction you received. How did you respond in the moment?",
    intervention:
      "Place yourself in one high-challenge conversation this week and commit to listening without defending.",
    reassessment: "monthly",
  },
  {
    id: 6,
    name: "Feedback Integration Speed",
    definition:
      "Velocity from receiving a signal to translating it into measurable behaviour change.",
    criteria: crit(
      "Receives feedback but routinely rejects or ignores it.",
      "Accepts feedback but implementation is inconsistent or delayed.",
      "Usually translates important feedback into action within days.",
      "Rapidly tests feedback, measures outcomes, and institutionalises useful learning.",
    ),
    evidencePrompt: "Cite one piece of feedback you acted on this week and the outcome.",
    intervention:
      "Take one piece of feedback received in the last 30 days and implement it within 48 hours.",
    reassessment: "weekly",
  },
  {
    id: 7,
    name: "Foundational Knowledge Base",
    definition: "Depth of operative first-principles in the domain of the Chief Aim.",
    criteria: crit(
      "Surface-level knowledge; relies on others' conclusions without understanding.",
      "Working knowledge but gaps in first-principles understanding.",
      "Solid first-principles foundation; can reason independently in the domain.",
      "Deep, tested mastery; can teach the first-principles to others and innovate on them.",
    ),
    evidencePrompt: "Explain the core first-principle of your field as if teaching a beginner.",
    intervention:
      "Identify one foundational concept in your domain and study it to first-principles depth this week.",
    reassessment: "monthly",
  },

  // ── Pillar II — Intent Engineering & Linguistic Architecture ────────────
  {
    id: 8,
    name: "Chief Aim Definition",
    definition: "A single, definite, written primary aim that orients all decisions.",
    criteria: crit(
      "No defined aim; goals shift constantly or remain vague.",
      "Has a general direction but no single, written, definite aim.",
      "Has a written, definite primary aim that guides most decisions.",
      "Single, definite aim is written, reviewed daily, and governs every major decision.",
    ),
    evidencePrompt: "Write your single definite Chief Aim in one sentence. Can you?",
    intervention:
      "Write your Chief Aim in one precise sentence and place it where you will see it daily.",
    reassessment: "monthly",
  },
  {
    id: 9,
    name: "Extreme Specificity",
    definition: "The aim is defined in sensory, measurable detail — not abstraction.",
    criteria: crit(
      "Aim is abstract ('be successful', 'get fit'). No measurable target.",
      "Some specificity but lacks sensory or measurable definition.",
      "Aim is specific and measurable with a clear target.",
      "Aim is fully sensory-defined: exact metrics, deadline, and felt-state of fulfilment.",
    ),
    evidencePrompt:
      "Describe exactly what it looks, sounds, and feels like when your aim is fulfilled.",
    intervention: "Rewrite your aim with one specific metric and one deadline.",
    reassessment: "monthly",
  },
  {
    id: 10,
    name: "Believability Sweet Spot",
    definition:
      "The aim sits in the optimal tension zone — stretching but not triggering cognitive panic.",
    criteria: crit(
      "Aim is either too low (no tension) or so extreme it triggers shutdown.",
      "Aim causes intermittent anxiety or feels slightly out of reach.",
      "Aim creates healthy creative tension — challenging but believable.",
      "Aim is precisely calibrated: maximum stretch with full internal conviction of achievability.",
    ),
    evidencePrompt:
      "On a 1–10 scale, how believable is your aim? What evidence supports that number?",
    intervention: "Adjust your aim's scope until it sits at 5–7 on the believability gauge.",
    reassessment: "monthly",
  },
  {
    id: 11,
    name: "Disgust Factor",
    definition:
      "A visceral, non-negotiable boundary — what you will absolutely no longer tolerate.",
    criteria: crit(
      "No defined boundaries; tolerates conditions that erode the aim.",
      "Has a vague sense of what is unacceptable but no defined line.",
      "Has a clear, written boundary that is mostly enforced.",
      "Visceral, non-negotiable intolerance; the boundary is burned into identity and never crossed.",
    ),
    evidencePrompt: "What will you absolutely no longer tolerate? Say it in one sentence.",
    intervention: "Write your disgust statement and read it aloud daily for one week.",
    reassessment: "monthly",
  },
  {
    id: 12,
    name: "Linguistic Precision",
    definition:
      "Exactness of language used to describe the aim — imprecise language signals imprecise intent.",
    criteria: crit(
      "Language is vague, hedging, or filled with qualifiers ('maybe', 'try', 'hopefully').",
      "Some precision but language drifts under questioning.",
      "Language is clear, direct, and consistent.",
      "Language is surgically precise; every word is deliberate and load-bearing.",
    ),
    evidencePrompt: "Read your aim aloud. Count the hedging words. Remove them.",
    intervention: "Rewrite your aim removing every hedge, qualifier, and abstraction.",
    reassessment: "monthly",
  },
  {
    id: 13,
    name: "Written Transcription",
    definition:
      "Pen-to-paper handwriting of the aim — the physical act of inscription reinforces commitment.",
    criteria: crit(
      "Aim exists only in thought; never written down.",
      "Typed the aim once but no handwriting practice.",
      "Handwrites the aim occasionally.",
      "Handwrites the aim daily as a non-negotiable ritual.",
    ),
    evidencePrompt: "When did you last handwrite your aim? Show the page.",
    intervention: "Handwrite your aim by hand, three times, today.",
    reassessment: "weekly",
  },

  // ── Pillar III — State & Alignment ──────────────────────────────────────
  {
    id: 14,
    name: "Somatic Feeling State",
    definition:
      "Embodied experience of the aim as already fulfilled — felt in the body, not just the mind.",
    criteria: crit(
      "No awareness of the felt-state; operates purely from thought.",
      "Occasionally imagines the outcome but cannot sustain the feeling.",
      "Can access and hold the felt-state of fulfilment for short periods.",
      "Lives predominantly in the felt-state of the aim fulfilled; it is the default baseline.",
    ),
    evidencePrompt:
      "Where in your body do you feel the fulfilment of your aim? Describe the sensation.",
    intervention:
      "Spend 5 minutes dropping into the felt-state of your aim fulfilled. Hold the feeling, not the thought.",
    reassessment: "weekly",
  },
  {
    id: 15,
    name: "Radical Detachment",
    definition: "Freedom from anxious attachment to the outcome or the mechanism of arrival.",
    criteria: crit(
      "Obsessively attached to outcomes; constant anxiety about results.",
      "Intermittent anxiety; attachment to specific outcomes or timelines.",
      "Generally detached from the 'how' but still grips the 'when'.",
      "Fully released attachment to both mechanism and timing; acts from the end state.",
    ),
    evidencePrompt: "If your aim took twice as long as expected, how would you feel? Be honest.",
    intervention: "Write down your attachment to the timeline, then physically destroy the paper.",
    reassessment: "weekly",
  },
  {
    id: 16,
    name: "Gratitude Frequency",
    definition:
      "Sustained appreciative state as a baseline carrier — not reactive gratitude, but habitual.",
    criteria: crit(
      "Predominantly in complaint, resentment, or scarcity framing.",
      "Occasional gratitude but it is reactive, not habitual.",
      "Regular gratitude practice; mostly appreciative baseline.",
      "Gratitude is the default state; scarcity framing is rare and quickly corrected.",
    ),
    evidencePrompt:
      "Name three things you are genuinely grateful for right now — without thinking.",
    intervention: "Write 10 specific gratitudes each morning for one week.",
    reassessment: "weekly",
  },
  {
    id: 17,
    name: "Emotional Coherence",
    definition:
      "Alignment of thought, feeling, word, and action — no internal contradiction between layers.",
    criteria: crit(
      "Says one thing, feels another, does a third. Chronic incoherence.",
      "Occasional alignment but thoughts and feelings often conflict.",
      "Thoughts, words, and feelings are mostly aligned.",
      "Total coherence — thought, feeling, word, and action are unified and reinforce each other.",
    ),
    evidencePrompt: "Where do your words and your feelings contradict each other right now?",
    intervention: "Identify one area of incoherence and align your words to match your felt-state.",
    reassessment: "weekly",
  },
  {
    id: 18,
    name: "State Stability",
    definition:
      "Consistency of internal state across the day — resistance to environmental disruption.",
    criteria: crit(
      "State collapses at the first stressor; highly reactive to environment.",
      "State fluctuates significantly through the day.",
      "State is reasonably stable but dips under sustained pressure.",
      "State is an anchor; external disruption barely moves it and recovery is near-instant.",
    ),
    evidencePrompt: "Track your state at 3 points today. How much did it vary?",
    intervention: "Set 3 state-check alarms. At each, re-anchor your baseline state.",
    reassessment: "weekly",
  },
  {
    id: 19,
    name: "Recovery Velocity",
    definition: "Speed of returning to baseline state after disturbance or disruption.",
    criteria: crit(
      "Takes days or longer to recover from a disruption.",
      "Recovery takes hours; disruption lingers and colours the day.",
      "Recovers within minutes to an hour.",
      "Recovers near-instantly; disruption passes through without sticking.",
    ),
    evidencePrompt: "After your last disruption today, how long did it take to return to baseline?",
    intervention:
      "Practice a 60-second reset protocol (breath + state anchor) after each disruption.",
    reassessment: "weekly",
  },

  // ── Pillar IV — Mental Models & Resistance ──────────────────────────────
  {
    id: 20,
    name: "Counter-Intention Detection",
    definition: "Awareness of opposing inner programs that contradict the stated aim.",
    criteria: crit(
      "No awareness of inner conflict; blind to self-sabotage patterns.",
      "Vague sense of inner resistance but cannot name specific programs.",
      "Can identify counter-intentions when they arise but struggles to interrupt them.",
      "Maps counter-intentions in real-time and intercepts them before they manifest.",
    ),
    evidencePrompt: "What inner voice argues against your aim? Write its exact words.",
    intervention:
      "List 3 counter-intentions you've noticed this week. Name each by its exact phrase.",
    reassessment: "weekly",
  },
  {
    id: 21,
    name: "Mental Reprogramming",
    definition: "Active installation of new mental commands that replace limiting programs.",
    criteria: crit(
      "No active reprogramming; old patterns run unchallenged.",
      "Aware of old patterns but no systematic replacement strategy.",
      "Actively installing new commands through consistent practice.",
      "Has systematically overwritten core limiting programs; new commands run automatically.",
    ),
    evidencePrompt:
      "What new command have you installed to replace an old one? How do you reinforce it?",
    intervention:
      "Write one new empowering command and repeat it 20 times morning and night for a week.",
    reassessment: "monthly",
  },
  {
    id: 22,
    name: "Resistance Clearing",
    definition: "Release of emotional or somatic charge that blocks alignment with the aim.",
    criteria: crit(
      "Chronic emotional/somatic tension; no clearing practice.",
      "Occasional awareness of charge but no release method.",
      "Has a clearing practice and uses it when resistance is high.",
      "Clears resistance as it arises; body is largely free of stored charge.",
    ),
    evidencePrompt:
      "Where in your body do you feel resistance to your aim? What happens when you sit with it?",
    intervention:
      "Spend 10 minutes with the physical sensation of resistance. Breathe into it without resisting.",
    reassessment: "weekly",
  },
  {
    id: 23,
    name: "Envy & Comparison Clearing",
    definition: "Transmutation of comparison energy into signal rather than poison.",
    criteria: crit(
      "Chronic comparison; envy corrodes motivation and self-worth.",
      "Notices envy but it still drains energy and distorts focus.",
      "Can redirect envy into useful signal most of the time.",
      "Envy is instantly transmuted — it reveals desire and becomes fuel, never poison.",
    ),
    evidencePrompt:
      "Whose success triggers envy in you? What does that envy reveal about your own desire?",
    intervention:
      "List 3 people who trigger envy. For each, write what their success reveals about your aim.",
    reassessment: "monthly",
  },
  {
    id: 24,
    name: "Limiting Belief Excavation",
    definition: "Surfacing and dissolving root beliefs that cap performance.",
    criteria: crit(
      "Unaware of limiting beliefs; they run invisibly in the background.",
      "Aware of surface-level doubts but hasn't traced them to roots.",
      "Has identified core limiting beliefs and is actively working to dissolve them.",
      "Has excavated and dissolved root beliefs; regularly audits for new ones.",
    ),
    evidencePrompt:
      "Complete: 'I can't achieve my aim because ___.' Now ask: is that actually true?",
    intervention:
      "Write the sentence 'I can't achieve my aim because ___' and challenge the belief with evidence.",
    reassessment: "monthly",
  },
  {
    id: 25,
    name: "Inner Conflict Resolution",
    definition: "Reconciling competing desires that pull in different directions.",
    criteria: crit(
      "Chronic inner conflict; multiple competing desires create paralysis.",
      "Aware of conflict but it drains energy and splits focus.",
      "Most competing desires are reconciled or deprioritised.",
      "Inner landscape is unified; all desires are subordinated to the Chief Aim.",
    ),
    evidencePrompt: "What competing desire pulls you away from your aim? Can you subordinate it?",
    intervention: "Name one competing desire. Decide: subordinate it, integrate it, or release it.",
    reassessment: "monthly",
  },
  {
    id: 26,
    name: "Shadow Integration",
    definition: "Owning and including disowned parts of self rather than suppressing them.",
    criteria: crit(
      "Projects shadow onto others; denies disowned traits entirely.",
      "Aware of shadow material but avoids engaging with it.",
      "Actively integrating shadow aspects into a fuller self-concept.",
      "Shadow is integrated and accessible; disowned parts are owned and utilised.",
    ),
    evidencePrompt: "What trait do you most dislike in others? Where does it live in you?",
    intervention: "Identify one projected trait. Find where it lives in you and own it in writing.",
    reassessment: "monthly",
  },
  {
    id: 27,
    name: "Identity Congruence",
    definition: "Self-concept matches the identity required to achieve the aim.",
    criteria: crit(
      "Self-concept contradicts the aim; 'I'm not the kind of person who...'",
      "Identity partially aligns but gaps create friction.",
      "Identity mostly matches the aim; behaviour follows naturally.",
      "Identity is fully congruent — 'I am the person who achieves this' is lived, not performed.",
    ),
    evidencePrompt:
      "Complete: 'The kind of person who achieves my aim is ___.' Are you that person?",
    intervention:
      "Write the identity statement 'I am the person who ___' and act from it for 48 hours.",
    reassessment: "monthly",
  },

  // ── Pillar V — Integrity & Recovery Ledger ──────────────────────────────
  {
    id: 28,
    name: "Moral Restitution",
    definition: "Cleaning the relational ledger — addressing unresolved wrongs with others.",
    criteria: crit(
      "Unresolved relational debts; avoidance of people wronged.",
      "Aware of debts but has not initiated restitution.",
      "Has made restitution on key relationships; ledger is mostly clean.",
      "Relational ledger is clean; addresses wrongs immediately as they arise.",
    ),
    evidencePrompt: "Is there someone you owe an apology or amends to? What stops you?",
    intervention: "Identify one relational debt. Initiate the conversation within 48 hours.",
    reassessment: "monthly",
  },
  {
    id: 29,
    name: "Physical Integrity",
    definition:
      "Body as a clear instrument — health, energy, and physical capacity support the aim.",
    criteria: crit(
      "Body is depleted; health actively undermines performance.",
      "Inconsistent health habits; energy fluctuates.",
      "Solid health baseline; body supports daily demands.",
      "Body is optimised; physical capacity is a competitive advantage.",
    ),
    evidencePrompt: "Does your body's current state support or undermine your aim? Be specific.",
    intervention:
      "Commit to one physical keystone habit (sleep, movement, or nutrition) for 7 days.",
    reassessment: "weekly",
  },
  {
    id: 30,
    name: "Energetic Hygiene",
    definition:
      "Management of energy inputs — boundaries, grounding, clearing of draining influences.",
    criteria: crit(
      "No energy boundaries; constantly drained by people and inputs.",
      "Aware of drains but inconsistent in managing them.",
      "Has boundaries and clearing practices; energy is mostly protected.",
      "Energy is actively managed and protected; drains are identified and eliminated immediately.",
    ),
    evidencePrompt: "What or who drains your energy most? What boundary would change that?",
    intervention: "Identify your top energy drain and set one boundary around it this week.",
    reassessment: "weekly",
  },
  {
    id: 31,
    name: "Reciprocity Balance",
    definition:
      "Balance of giving and receiving — right action and fair exchange in relationships.",
    criteria: crit(
      "Chronic imbalance — either over-giving (resentment) or over-taking (debt).",
      "Notices imbalance but hasn't corrected it.",
      "Generally maintains fair exchange in key relationships.",
      "Reciprocity is precise and natural; all exchanges are clean and mutually nourishing.",
    ),
    evidencePrompt:
      "In your key relationships, are you over-giving or over-taking? What needs rebalancing?",
    intervention: "Identify one imbalanced exchange. Correct it with a specific action this week.",
    reassessment: "monthly",
  },
  {
    id: 32,
    name: "Environmental Load",
    definition: "Minimising toxic, electromagnetic, or environmental burden on the system.",
    criteria: crit(
      "High environmental load; no awareness of toxins, EMF, or clutter impact.",
      "Some awareness but no systematic reduction.",
      "Has reduced major environmental stressors.",
      "Environment is optimised — clean, low-load, and actively supports the aim.",
    ),
    evidencePrompt: "What in your physical environment is subtly draining you?",
    intervention:
      "Remove or mitigate one environmental stressor from your primary workspace this week.",
    reassessment: "monthly",
  },
  {
    id: 33,
    name: "Sleep & Recovery",
    definition: "Restorative depth and rhythm of sleep and recovery cycles.",
    criteria: crit(
      "Chronic sleep deprivation; recovery is negligible.",
      "Inconsistent sleep; quality is poor.",
      "Consistent sleep schedule; adequate recovery.",
      "Optimised sleep architecture; recovery is strategic and measured.",
    ),
    evidencePrompt: "How many hours of quality sleep did you get last night? Track it for a week.",
    intervention: "Set a non-negotiable sleep window for 7 consecutive nights.",
    reassessment: "weekly",
  },
  {
    id: 34,
    name: "Nutritional Integrity",
    definition:
      "Fuel quality aligned with the instrument — nutrition that supports cognitive and physical output.",
    criteria: crit(
      "Poor nutrition actively undermines energy and clarity.",
      "Inconsistent eating; some awareness but no discipline.",
      "Generally clean nutrition; supports daily performance.",
      "Nutrition is precision-fuelled; optimised for sustained cognitive and physical output.",
    ),
    evidencePrompt:
      "Does your current nutrition fuel or sabotage your aim? What one change would help most?",
    intervention: "Remove one sabotaging food or drink for 7 days and note the effect.",
    reassessment: "weekly",
  },

  // ── Pillar VI — Execution & Alignment ───────────────────────────────────
  {
    id: 35,
    name: "Mastermind Alignment",
    definition:
      "Participation in a harmonic group of peers aligned toward growth and accountability.",
    criteria: crit(
      "No peer group; operates entirely alone.",
      "Has peers but no structured mastermind or accountability group.",
      "Participates in a regular mastermind or accountability structure.",
      "Active member of a high-calibre mastermind that directly accelerates the aim.",
    ),
    evidencePrompt: "Who in your circle holds you to your standard? Name them.",
    intervention: "Identify 2–3 peers and propose a weekly accountability check-in.",
    reassessment: "monthly",
  },
  {
    id: 36,
    name: "Metrics & Tracking",
    definition: "Measured feedback on progress toward the aim — what gets measured gets managed.",
    criteria: crit(
      "No metrics; operates on feeling alone with no objective signal.",
      "Tracks some metrics but inconsistently or without action.",
      "Tracks key metrics regularly and uses them to adjust.",
      "Comprehensive measurement system; every key variable is tracked and drives decisions.",
    ),
    evidencePrompt: "What is the single most important metric for your aim? What is it right now?",
    intervention: "Define one leading metric for your aim and track it daily for a week.",
    reassessment: "weekly",
  },
  {
    id: 37,
    name: "Burning Boats",
    definition: "Irrevocable commitment — removing the option of retreat to force forward motion.",
    criteria: crit(
      "Always keeps an escape route; commitment is conditional.",
      "Some commitment but retreat options remain available.",
      "Has made significant irreversible commitments toward the aim.",
      "Fully committed; retreat is impossible and all bridges are burned.",
    ),
    evidencePrompt:
      "What escape route are you keeping open? What would burning that boat look like?",
    intervention: "Make one irreversible commitment this week that eliminates a retreat option.",
    reassessment: "monthly",
  },
  {
    id: 38,
    name: "Action Velocity",
    definition:
      "Speed of physical action toward the aim — converting intention into executed movement.",
    criteria: crit(
      "Paralysis; little to no action toward the aim.",
      "Slow, inconsistent action; intention outpaces execution.",
      "Regular, consistent action toward the aim.",
      "High-velocity execution; ships daily and maintains relentless forward motion.",
    ),
    evidencePrompt: "What concrete action toward your aim did you take today?",
    intervention: "Execute one concrete action toward your aim within the next 2 hours.",
    reassessment: "daily",
  },
  {
    id: 39,
    name: "Feedback Loop Closure",
    definition:
      "Completing the loop on every signal — acting, measuring, and adjusting without leaving loops open.",
    criteria: crit(
      "Starts things but rarely closes loops; signals are received and ignored.",
      "Closes some loops but many remain open and accumulate.",
      "Closes most important loops within a reasonable timeframe.",
      "Every significant signal is closed — act, measure, adjust, done. No open loops.",
    ),
    evidencePrompt: "What open loop is draining your energy right now? Close it.",
    intervention: "Identify your oldest open loop and close it within 48 hours.",
    reassessment: "weekly",
  },
  {
    id: 40,
    name: "Cybernetic Self-Correction",
    definition:
      "Automatic course-correction system — the servo-mechanism that detects error and adjusts without willpower.",
    criteria: crit(
      "No self-correction; drifts off course indefinitely.",
      "Corrects course occasionally but requires external pressure.",
      "Self-corrects regularly when off-course is detected.",
      "Automatic, real-time course-correction; the system self-regulates without conscious effort.",
    ),
    evidencePrompt: "When you drift off course, how quickly do you notice and correct?",
    intervention: "Set a daily 5-minute course-check: 'Am I on track? What needs adjusting?'",
    reassessment: "weekly",
  },
];

/** Lookup a methodology point by id. */
export function getMethodology(id: number): MethodologyPoint | undefined {
  return METHODOLOGY.find((m) => m.id === id);
}

/** Get the criteria text for a specific tier of a point. */
export function getTierBehaviour(id: number, tier: Tier): string | undefined {
  const m = getMethodology(id);
  return m?.criteria.find((c) => c.tier === tier)?.behaviour;
}
