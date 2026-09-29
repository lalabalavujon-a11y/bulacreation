import type { AssessmentDef } from "../types";
import { DEFAULT_TIERS, standardZones } from "../types";

export const spiritualDevelopment: AssessmentDef = {
  key: "spiritual-development",
  name: "Spiritual Development Diagnostic",
  tagline: "Presence · surrendered action · alignment · stillness · purpose · transcendence",
  indexLabel: "Spiritual Development Index",
  shortIndex: "Spiritual Index",
  description:
    "A deep inner alignment diagnostic evaluating conscious awareness, surrender, contemplative stillness, moral coherence, and lived connection to transcendent purpose.",
  tiers: DEFAULT_TIERS,
  accent: "var(--gold)",
  coachProOnly: false, // Free bonus for all users
  gatingPointId: 1, // Presence / Conscious Awareness is the master governor
  gatingFormula: (score: number) => 0.5 + 0.5 * score,
  zones: standardZones("Spiritual Development Index"),
  pillars: [
    {
      index: 0,
      roman: "I",
      name: "Conscious Presence & The Observer",
      focus: "Witness consciousness · presence in the now · unhooking from ego reactivity",
    },
    {
      index: 1,
      roman: "II",
      name: "Contemplative Stillness & Silence",
      focus: "Meditation cadence · silent retreats · space between thoughts",
    },
    {
      index: 2,
      roman: "III",
      name: "Radical Surrender & Detachment",
      focus: "Releasing outcome clinging · trusting the unfolding · living without anxiety",
    },
    {
      index: 3,
      roman: "IV",
      name: "Vibrational Gratitude & Reverence",
      focus: "Unconditional appreciation · heart coherence · awe & sacred perception",
    },
    {
      index: 4,
      roman: "V",
      name: "Moral Coherence & Karmic Restitution",
      focus: "Clean conscience · amends made · harmlessness & truthfulness",
    },
    {
      index: 5,
      roman: "VI",
      name: "Transcendent Purpose & Devotional Service",
      focus: "Self-transcending mission · serving the whole · humility in mastery",
    },
  ],
  points: [
    // Pillar I (190 pts)
    {
      id: 1,
      pillar: 0,
      name: "Witness Consciousness",
      focus: "Observing thoughts and emotions without becoming identified with them",
      weight: 50,
      gating: true,
    },
    {
      id: 2,
      pillar: 0,
      name: "Present Moment Anchoring",
      focus: "Catching mind wanderings and returning effortlessly to the now",
      weight: 35,
    },
    {
      id: 3,
      pillar: 0,
      name: "Ego Reactivity Dissolution",
      focus: "Space between stimulus and personal defence or offence",
      weight: 35,
    },
    {
      id: 4,
      pillar: 0,
      name: "Inner Body Awareness",
      focus: "Feeling the subtle energy body throughout daily interactions",
      weight: 35,
    },
    {
      id: 5,
      pillar: 0,
      name: "Non-Judgmental Stance",
      focus: "Seeing events and beings without automatic mental labelling",
      weight: 35,
    },

    // Pillar II (160 pts)
    {
      id: 6,
      pillar: 1,
      name: "Daily Meditation Discipline",
      focus: "Unbroken daily sitting practice (20-60 minutes)",
      weight: 40,
    },
    {
      id: 7,
      pillar: 1,
      name: "Noble Silence Practice",
      focus: "Intentional periods of speechlessness and digital blackout",
      weight: 30,
    },
    {
      id: 8,
      pillar: 1,
      name: "Depth of Stillness",
      focus: "Reaching the baseline silence underneath internal chatter",
      weight: 30,
    },
    {
      id: 9,
      pillar: 1,
      name: "Sacred Space Sanctuary",
      focus: "Physical environment tuned strictly for contemplation and elevation",
      weight: 30,
    },
    {
      id: 10,
      pillar: 1,
      name: "Contemplative Reading",
      focus: "Immersing in perennial wisdom, scripture, and sacred texts",
      weight: 30,
    },

    // Pillar III (170 pts)
    {
      id: 11,
      pillar: 2,
      name: "Radical Detachment",
      focus: "Complete internal release of grasping after future outcomes",
      weight: 40,
    },
    {
      id: 12,
      pillar: 2,
      name: "Surrendered Action",
      focus: "Acting with complete intensity while abandoning fear of failure",
      weight: 35,
    },
    {
      id: 13,
      pillar: 2,
      name: "Acceptance of What Is",
      focus: "Zero energetic resistance to unavoidable life events",
      weight: 35,
    },
    {
      id: 14,
      pillar: 2,
      name: "Trust in Universal Intelligence",
      focus: "Deep somatic knowing that reality unfolds for evolution",
      weight: 30,
    },
    {
      id: 15,
      pillar: 2,
      name: "Loss & Change Equanimity",
      focus: "Meeting endings, grief and transition with inner poise",
      weight: 30,
    },

    // Pillar IV (160 pts)
    {
      id: 16,
      pillar: 3,
      name: "Unconditional Gratitude",
      focus: "Thankfulness independent of pleasant or unpleasant circumstances",
      weight: 35,
    },
    {
      id: 17,
      pillar: 3,
      name: "Heart Centre Coherence",
      focus: "Cultivating somatic warmth, compassion, and loving-kindness",
      weight: 35,
    },
    {
      id: 18,
      pillar: 3,
      name: "Reverence for Creation",
      focus: "Sense of wonder and awe when connecting with nature and life",
      weight: 30,
    },
    {
      id: 19,
      pillar: 3,
      name: "Forgiveness & Cleansing",
      focus: "Zero retained resentment; releasing grudges instantly",
      weight: 30,
    },
    {
      id: 20,
      pillar: 3,
      name: "Joy of Being",
      focus: "Inherent causeless joy radiating without external triggers",
      weight: 30,
    },

    // Pillar V (160 pts)
    {
      id: 21,
      pillar: 4,
      name: "Clean Conscience",
      focus: "Living in complete harmony with highest moral and ethical standard",
      weight: 35,
    },
    {
      id: 22,
      pillar: 4,
      name: "Moral Restitution",
      focus: "Immediate righting of wrongs, debts cleared, and sincere amends",
      weight: 35,
    },
    {
      id: 23,
      pillar: 4,
      name: "Ahimsa / Non-Harm",
      focus: "Active commitment to not harming others in speech, deed or thought",
      weight: 30,
    },
    {
      id: 24,
      pillar: 4,
      name: "Truthfulness / Satya",
      focus: "Absolute fidelity to truth without manipulation or deception",
      weight: 30,
    },
    {
      id: 25,
      pillar: 4,
      name: "Generosity of Spirit",
      focus: "Tithing time, wisdom, and wealth without desire for recognition",
      weight: 30,
    },

    // Pillar VI (160 pts)
    {
      id: 26,
      pillar: 5,
      name: "Transpersonal Calling",
      focus: "Living for a mission far greater than personal security or prestige",
      weight: 35,
    },
    {
      id: 27,
      pillar: 5,
      name: "Devotional Alignment",
      focus: "Consecrating work and craft as an act of service to the divine",
      weight: 35,
    },
    {
      id: 28,
      pillar: 5,
      name: "Humility in Attainment",
      focus: "Deflecting praise; recognising oneself as a vessel for grace",
      weight: 30,
    },
    {
      id: 29,
      pillar: 5,
      name: "Universal Interconnectedness",
      focus: "Direct experiential sense of oneness with all living beings",
      weight: 30,
    },
    {
      id: 30,
      pillar: 5,
      name: "Courage in the Sacred",
      focus: "Unshakable courage rooted in knowing one's immortal nature",
      weight: 30,
    },
  ],
};
