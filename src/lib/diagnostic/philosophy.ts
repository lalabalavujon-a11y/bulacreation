// Philosophy Layer — the interpretation layer that sits on top of the
// worldview-neutral 40-point engine. Selecting a philosophy swaps pillar
// display names, zone labels, mentor persona, and framing tone — NEVER the
// underlying scores or weights.
//
// Default = Performance (neutral, credibility-maximising).
// Metaphysical philosophies (Neville, Spiritual) surface the original
// metaphysical terminology; all others use the neutral defaults.

import type { PersonaKey } from "./personas";

export type PhilosophyKey = "performance" | "founder" | "stoic" | "maltz" | "neville" | "spiritual";

export interface Philosophy {
  key: PhilosophyKey;
  name: string;
  framework: string;
  description: string;
  /** When true, metaphysical terminology (Quantum Field, Carrier Frequency,
   * Karmic Ledger, Manifestation) is surfaced in the UI. */
  metaphysical: boolean;
  defaultPersona: PersonaKey;
  /** Optional pillar display-name overrides (6 entries). When omitted, the
   * neutral default from points.ts is used. */
  pillarNames?: string[];
  zoneLabels?: {
    friction: string;
    emergence: string;
    operative: string;
  };
}

export const PHILOSOPHIES: Record<PhilosophyKey, Philosophy> = {
  performance: {
    key: "performance",
    name: "Performance",
    framework: "Cybernetics · behavioural science · systems thinking",
    description:
      "Neutral, evidence-oriented framing. Treats the 40 points as a performance management system with measurable feedback loops.",
    metaphysical: false,
    defaultPersona: "maltz",
  },
  founder: {
    key: "founder",
    name: "Founder",
    framework: "Execution · leverage · accountability · metrics",
    description:
      "Entrepreneur-coded framing. Optimised for founders who need ruthless prioritisation and execution discipline.",
    metaphysical: false,
    defaultPersona: "brotherhood",
  },
  stoic: {
    key: "stoic",
    name: "Stoic",
    framework: "Agency · discipline · virtue · resilience",
    description:
      "Classical Stoic framing. Focuses on what is within your control, virtue as the aim, and discipline as the method.",
    metaphysical: false,
    defaultPersona: "maltz",
  },
  maltz: {
    key: "maltz",
    name: "Maltz",
    framework: "Self-image · psycho-cybernetics · servo-mechanism",
    description:
      "Maxwell Maltz's Psycho-Cybernetics. The nervous system as a goal-seeking servo-mechanism requiring accurate target-lock.",
    metaphysical: false,
    defaultPersona: "maltz",
  },
  neville: {
    key: "neville",
    name: "Neville",
    framework: "Assumption · imagination · state (SATS)",
    description:
      "Neville Goddard's teachings. Consciousness as the only reality; assumption hardens into fact. Surfaces metaphysical terminology.",
    metaphysical: true,
    defaultPersona: "neville",
    pillarNames: [
      "Epistemic Foundation",
      "Intent Engineering",
      "Vibrational Physics",
      "Subconscious Reprogramming",
      "Somatic & Karmic Ledger",
      "Cybernetic Tracking",
    ],
    zoneLabels: {
      friction: "Friction Zone",
      emergence: "Emergence Zone",
      operative: "Manifestation Active",
    },
  },
  spiritual: {
    key: "spiritual",
    name: "Spiritual",
    framework: "Purpose · gratitude · alignment · reflection",
    description:
      "Spiritual framing. Purpose-driven, alignment-focused, with gratitude and reflection as core practices. Surfaces metaphysical terminology.",
    metaphysical: true,
    defaultPersona: "neville",
    pillarNames: [
      "Epistemic Foundation",
      "Intent Engineering",
      "Vibrational Physics",
      "Subconscious Reprogramming",
      "Somatic & Karmic Ledger",
      "Cybernetic Tracking",
    ],
    zoneLabels: {
      friction: "Friction Zone",
      emergence: "Emergence Zone",
      operative: "Manifestation Active",
    },
  },
};

export const PHILOSOPHY_LIST: Philosophy[] = Object.values(PHILOSOPHIES);

export const DEFAULT_PHILOSOPHY: PhilosophyKey = "performance";

/** Resolve a philosophy key, falling back to the default. */
export function resolvePhilosophy(key: string | undefined | null): PhilosophyKey {
  if (key && key in PHILOSOPHIES) return key as PhilosophyKey;
  return DEFAULT_PHILOSOPHY;
}

/** Get the display name for a pillar under a given philosophy. */
export function pillarDisplayName(
  philosophy: PhilosophyKey,
  neutralName: string,
  pillarIndex: number,
): string {
  const p = PHILOSOPHIES[philosophy];
  return p.pillarNames?.[pillarIndex] ?? neutralName;
}

/** Get the zone label for a given philosophy + zone. */
export function zoneLabelFor(
  philosophy: PhilosophyKey,
  zone: "friction" | "emergence" | "operative",
): string {
  const p = PHILOSOPHIES[philosophy];
  return p.zoneLabels?.[zone] ?? null ?? defaultZoneLabel(zone);
}

function defaultZoneLabel(zone: "friction" | "emergence" | "operative"): string {
  if (zone === "operative") return "Execution Active";
  if (zone === "emergence") return "Emergence Zone";
  return "Friction Zone";
}
