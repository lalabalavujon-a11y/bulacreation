import type { AssessmentDef } from "../types";
import { DEFAULT_TIERS, standardZones } from "../types";

export const memoryDevelopment: AssessmentDef = {
  key: "memory-development",
  name: "Memory Development Diagnostic",
  tagline: "Mnemonics · memory palaces · retrieval practice · working memory · spaced recall",
  indexLabel: "Memory & Cognitive Recall Index",
  shortIndex: "Memory Index",
  description:
    "An advanced cognitive diagnostic evaluating mnemonic architecture, spatial memory palace construction, spaced retrieval systems, numerical conversion, and retention stamina.",
  tiers: DEFAULT_TIERS,
  accent: "var(--gold)",
  coachProOnly: true, // Coach Pro exclusive
  gatingPointId: 1, // Mnemonic Foundation & Association Speed is master governor
  gatingFormula: (score: number) => 0.5 + 0.5 * score,
  zones: standardZones("Memory & Cognitive Recall Index"),
  pillars: [
    {
      index: 0,
      roman: "I",
      name: "Mnemonic Encoding & Synaesthetic Association",
      focus: "Vivid multi-sensory imagery · exaggerated emotional hooks · association speed",
    },
    {
      index: 1,
      roman: "II",
      name: "Method of Loci & Memory Palace Architecture",
      focus: "Loci route planning · palace stability · multi-floor navigation · zero ghosting",
    },
    {
      index: 2,
      roman: "III",
      name: "Number, Code & Abstract Data Systems",
      focus: "Major System · 2-digit PAO (Person-Action-Object) · binary & card recall",
    },
    {
      index: 3,
      roman: "IV",
      name: "Spaced Retrieval Cadence & SRS Architecture",
      focus: "Active recall frequency · Leitner intervals · SM-2 algorithmic adherence",
    },
    {
      index: 4,
      roman: "V",
      name: "Working Memory Capacity & Attention Bandwidth",
      focus: "Dual n-back capacity · digit span forward/backward · cognitive chunking",
    },
    {
      index: 5,
      roman: "VI",
      name: "Real-World Application & Knowledge Compounding",
      focus: "Verbatim text recall · name-to-face retention · technical domain syntheses",
    },
  ],
  points: [
    // Pillar I (190 pts)
    {
      id: 1,
      pillar: 0,
      name: "Synaesthetic Association Speed",
      focus: "Instantly converting words into vivid, bizarre, kinetic 3D imagery",
      weight: 50,
      gating: true,
    },
    {
      id: 2,
      pillar: 0,
      name: "Multi-Sensory Encoding",
      focus: "Engaging smell, tactile texture, auditory noise, and taste in memory",
      weight: 35,
    },
    {
      id: 3,
      pillar: 0,
      name: "Emotional Exaggeration Hook",
      focus: "Using humor, absurdity, or intense shock to burn neural pathways",
      weight: 35,
    },
    {
      id: 4,
      pillar: 0,
      name: "Substitute Word Technique",
      focus: "Breaking foreign words into phonetic imagery in under 3 seconds",
      weight: 35,
    },
    {
      id: 5,
      pillar: 0,
      name: "Kinetic Link Method",
      focus: "Chaining 20+ arbitrary objects sequentially without spatial palaces",
      weight: 35,
    },

    // Pillar II (165 pts)
    {
      id: 6,
      pillar: 1,
      name: "Palace Construction & Route Logic",
      focus: "Clean, non-crossing linear paths through familiar architectural spaces",
      weight: 35,
    },
    {
      id: 7,
      pillar: 1,
      name: "Loci Stability & Distinction",
      focus: "Micro-stations (corners, furniture, appliances) clearly differentiated",
      weight: 35,
    },
    {
      id: 8,
      pillar: 1,
      name: "Multi-Palace Cataloguing",
      focus: "Maintaining a master directory of 10+ distinct, clean memory palaces",
      weight: 35,
    },
    {
      id: 9,
      pillar: 1,
      name: "Palace Reset & Ghost Cleaning",
      focus: "Clearing short-term data from palaces to prevent cognitive crosstalk",
      weight: 30,
    },
    {
      id: 10,
      pillar: 1,
      name: "Virtual & Fictional Palaces",
      focus: "Constructing viable palaces from video games, books, or imagined grids",
      weight: 30,
    },

    // Pillar III (165 pts)
    {
      id: 11,
      pillar: 2,
      name: "Major System Fluency",
      focus: "Instinctive 0-9 phonetic consonant translation without conscious hesitation",
      weight: 40,
    },
    {
      id: 12,
      pillar: 2,
      name: "2-Digit PAO Matrix",
      focus: "Complete 00-99 matrix of Person, Action, and Object fully memorized",
      weight: 35,
    },
    {
      id: 13,
      pillar: 2,
      name: "Long Number Encoding",
      focus: "Compressing 20-40 digit strings into 4-7 loci scenes effortlessly",
      weight: 30,
    },
    {
      id: 14,
      pillar: 2,
      name: "Card Deck Translation",
      focus: "52-card encoding system for rapid full-deck sequential memorization",
      weight: 30,
    },
    {
      id: 15,
      pillar: 2,
      name: "Abstract Symbol Decoding",
      focus: "Mapping mathematical symbols, chemical formulas, and code tokens",
      weight: 30,
    },

    // Pillar IV (160 pts)
    {
      id: 16,
      pillar: 3,
      name: "Active Recall Over Passive Review",
      focus: "Strictly forcing mental retrieval before looking at reference answers",
      weight: 40,
    },
    {
      id: 17,
      pillar: 3,
      name: "Algorithmic Review Intervals",
      focus: "Executing reviews at optimal decay points (Day 1, 3, 7, 21, 60, 180)",
      weight: 35,
    },
    {
      id: 18,
      pillar: 3,
      name: "Flashcard Atomicity Principle",
      focus: "Ensuring each recall card tests exactly one discrete atomic concept",
      weight: 30,
    },
    {
      id: 19,
      pillar: 3,
      name: "Deck Hygiene & Leech Purging",
      focus: "Diagnosing and re-encoding cards that consistently fail retrieval",
      weight: 25,
    },
    {
      id: 20,
      pillar: 3,
      name: "Daily Review Consistency",
      focus: "Zero backlog in daily spaced repetition queues",
      weight: 30,
    },

    // Pillar V (160 pts)
    {
      id: 21,
      pillar: 4,
      name: "Working Memory Span",
      focus: "Holding 7+ complex information chunks in conscious workspace",
      weight: 40,
    },
    {
      id: 22,
      pillar: 4,
      name: "Dual N-Back Performance",
      focus: "Sustaining dual auditory and visual tracking at 3-back or higher",
      weight: 30,
    },
    {
      id: 23,
      pillar: 4,
      name: "Mental Concentration Endurance",
      focus: "High-speed mnemonic encoding sustained for 45+ uninterrupted minutes",
      weight: 30,
    },
    {
      id: 24,
      pillar: 4,
      name: "Interference Resistance",
      focus: "Retaining accurate recall despite ambient noise and distractions",
      weight: 30,
    },
    {
      id: 25,
      pillar: 4,
      name: "Neurochemical Priming for Recall",
      focus: "Optimizing acetylcholine, dopamine, and sleep-spindle consolidation",
      weight: 30,
    },

    // Pillar VI (160 pts)
    {
      id: 26,
      pillar: 5,
      name: "Name-to-Face Instant Retention",
      focus: "Locking names of 10+ new acquaintances per event with zero mix-ups",
      weight: 35,
    },
    {
      id: 27,
      pillar: 5,
      name: "Verbatim Speech & Text Recall",
      focus: "Retaining entire poems, scriptures, speeches or scripts word-for-word",
      weight: 35,
    },
    {
      id: 28,
      pillar: 5,
      name: "Domain Knowledge Syntheses",
      focus: "Memorizing comprehensive anatomy, legal frameworks, or market maps",
      weight: 30,
    },
    {
      id: 29,
      pillar: 5,
      name: "Calendar & Date Algorithms",
      focus: "Doomsday algorithm or rapid day-of-week mental calendar calculations",
      weight: 30,
    },
    {
      id: 30,
      pillar: 5,
      name: "Practical Everyday Utility",
      focus: "Eliminating mundane forgetfulness (keys, appointments, pin codes)",
      weight: 30,
    },
  ],
};
