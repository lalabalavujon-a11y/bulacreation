import type { AssessmentDef } from "../types";
import { DEFAULT_TIERS, standardZones } from "../types";

export const polymathDevelopment: AssessmentDef = {
  key: "polymath-development",
  name: "Polymath Development Diagnostic",
  tagline: "Cross-domain mastery · mental models · combinatorial creativity · rapid acquisition",
  indexLabel: "Polymathic Mastery Index",
  shortIndex: "Polymath Index",
  description:
    "A multidimensional diagnostic evaluating cross-disciplinary synthesis, lattice of mental models, ultralearning velocity, analogical reasoning, and combinatorial innovation.",
  tiers: DEFAULT_TIERS,
  accent: "var(--gold)",
  coachProOnly: true, // Coach Pro exclusive
  gatingPointId: 1, // Lattice of Mental Models is master governor
  gatingFormula: (score: number) => 0.5 + 0.5 * score,
  zones: standardZones("Polymathic Mastery Index"),
  pillars: [
    {
      index: 0,
      roman: "I",
      name: "Lattice of Mental Models & First Principles",
      focus: "Munger lattice · physics/biology/economics models · core epistemics",
    },
    {
      index: 1,
      roman: "II",
      name: "Ultralearning & Rapid Skill Deconstruction",
      focus: "Metalearning · 80/20 leverage sub-skills · direct immersion practice",
    },
    {
      index: 2,
      roman: "III",
      name: "Combinatorial Innovation & Cross-Pollination",
      focus: "Bridging disparate fields · analogical problem solving · hybrid breakthroughs",
    },
    {
      index: 3,
      roman: "IV",
      name: "T-Shaped Depth & Breadth Architecture",
      focus: "Deep primary domain mastery + 3-5 complementary supporting domains",
    },
    {
      index: 4,
      roman: "V",
      name: "Systems Thinking & Second-Order Dynamics",
      focus: "Feedback loops · non-linear causality · emergent properties · unintended effects",
    },
    {
      index: 5,
      roman: "VI",
      name: "Intellectual Output & Generative Synthesis",
      focus: "Original frameworks · publishing essays · building novel tools & prototypes",
    },
  ],
  points: [
    // Pillar I (190 pts)
    {
      id: 1,
      pillar: 0,
      name: "Mental Model Lattice Fluency",
      focus: "Effortlessly diagnosing problems through 20+ foundational disciplinary models",
      weight: 50,
      gating: true,
    },
    {
      id: 2,
      pillar: 0,
      name: "First Principles Reasoning",
      focus: "Stripping assumptions down to fundamental truths vs reasoning by analogy",
      weight: 35,
    },
    {
      id: 3,
      pillar: 0,
      name: "Cognitive Bias Inoculation",
      focus: "Catching confirmation bias, availability heuristics, and sunk cost traps",
      weight: 35,
    },
    {
      id: 4,
      pillar: 0,
      name: "Probabilistic Thinking",
      focus: "Calibrating Bayesian updating and thinking in expected value distributions",
      weight: 35,
    },
    {
      id: 5,
      pillar: 0,
      name: "Epistemic Humility",
      focus: "Knowing the boundary of one's circle of competence and updating rapidly",
      weight: 35,
    },

    // Pillar II (165 pts)
    {
      id: 6,
      pillar: 1,
      name: "Metalearning Blueprinting",
      focus:
        "Mapping the curriculum, terminology, and leverage points before diving into a new field",
      weight: 35,
    },
    {
      id: 7,
      pillar: 1,
      name: "Directness in Practice",
      focus: "Practicing the actual target skill in context rather than passive theory",
      weight: 35,
    },
    {
      id: 8,
      pillar: 1,
      name: "Drill Isolation Mechanics",
      focus: "Isolating weak sub-mechanisms and looping them until perfected",
      weight: 35,
    },
    {
      id: 9,
      pillar: 1,
      name: "Feynman Technique Articulation",
      focus: "Explaining complex technical concepts in plain words to test comprehension",
      weight: 30,
    },
    {
      id: 10,
      pillar: 1,
      name: "Skill Acquisition Velocity",
      focus: "Reaching top 20% competency in a novel domain within 90 days",
      weight: 30,
    },

    // Pillar III (165 pts)
    {
      id: 11,
      pillar: 2,
      name: "Cross-Disciplinary Analogy",
      focus: "Applying biological concepts to economics, or architecture to software",
      weight: 40,
    },
    {
      id: 12,
      pillar: 2,
      name: "Idea Sex & Mashup Ideation",
      focus: "Systematically combining two unrelated industries to create a new category",
      weight: 35,
    },
    {
      id: 13,
      pillar: 2,
      name: "Bricolage Problem Solving",
      focus: "Constructing elegant solutions using whatever materials are already at hand",
      weight: 30,
    },
    {
      id: 14,
      pillar: 2,
      name: "Curiosity Across Opposites",
      focus: "Equal enthusiasm for high arts, hard sciences, commerce, and philosophy",
      weight: 30,
    },
    {
      id: 15,
      pillar: 2,
      name: "Paradox Integration",
      focus: "Holding two opposing perspectives simultaneously without cognitive collapse",
      weight: 30,
    },

    // Pillar IV (160 pts)
    {
      id: 16,
      pillar: 3,
      name: "World-Class Anchor Domain",
      focus: "True elite depth in one core field anchoring all peripheral explorations",
      weight: 40,
    },
    {
      id: 17,
      pillar: 3,
      name: "Adjacent Domain Proficiency",
      focus: "Demonstrated competence in 3+ fields supporting the core anchor",
      weight: 35,
    },
    {
      id: 18,
      pillar: 3,
      name: "Skill Stack Synergy",
      focus: "Stack of rare overlapping skills creating a unique personal monopoly",
      weight: 30,
    },
    {
      id: 19,
      pillar: 3,
      name: "Language & Code Literacy",
      focus: "Fluency in spoken languages, programming languages, and mathematical notations",
      weight: 30,
    },
    {
      id: 20,
      pillar: 3,
      name: "Craftsmanship Balance",
      focus: "Pairing intellectual theory with hands-on physical or mechanical mastery",
      weight: 25,
    },

    // Pillar V (160 pts)
    {
      id: 21,
      pillar: 4,
      name: "Stock-and-Flow Dynamics",
      focus: "Seeing systems as accumulators, rate limiters, delays, and drain valves",
      weight: 40,
    },
    {
      id: 22,
      pillar: 4,
      name: "Second & Third Order Thinking",
      focus: "Asking 'and then what?' past immediate consequences to systemic ripples",
      weight: 35,
    },
    {
      id: 23,
      pillar: 4,
      name: "Emergence & Chaos Modeling",
      focus: "Understanding how macro behavior arises from simple micro interactions",
      weight: 30,
    },
    {
      id: 24,
      pillar: 4,
      name: "Constraint & Bottleneck Isolation",
      focus: "Locating the single point of maximum system leverage (Theory of Constraints)",
      weight: 30,
    },
    {
      id: 25,
      pillar: 4,
      name: "Inversion Problem Solving",
      focus: "Working backwards from catastrophic failure to design anti-fragility",
      weight: 25,
    },

    // Pillar VI (160 pts)
    {
      id: 26,
      pillar: 5,
      name: "Generative Intellectual Publishing",
      focus: "Regularly shipping essays, books, or papers articulating original syntheses",
      weight: 40,
    },
    {
      id: 27,
      pillar: 5,
      name: "Working Prototypes & Inventions",
      focus: "Translating theoretical ideas into tangible working code, hardware, or businesses",
      weight: 35,
    },
    {
      id: 28,
      pillar: 5,
      name: "Personal Knowledge Management (PKM)",
      focus: "Maintaining an interconnected slip-box or networked graph of insights",
      weight: 30,
    },
    {
      id: 29,
      pillar: 5,
      name: "Teaching & Socratic Mentorship",
      focus: "Elevating apprentices by guiding them through first-principles discovery",
      weight: 30,
    },
    {
      id: 30,
      pillar: 5,
      name: "Generational Vision Alignment",
      focus: "Focusing creative output on problems with multi-decade relevance",
      weight: 25,
    },
  ],
};
