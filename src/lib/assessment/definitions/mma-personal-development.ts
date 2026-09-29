import type { AssessmentDef } from "../types";
import { DEFAULT_TIERS, standardZones } from "../types";

export const mmaPersonalDevelopment: AssessmentDef = {
  key: "mma-personal-development",
  name: "MMA Personal Development Diagnostic",
  tagline: "Striking · grappling · cage IQ · mental warfare · weight cut · warrior ethos",
  indexLabel: "MMA Combat Readiness Index",
  shortIndex: "MMA Readiness",
  description:
    "A full-spectrum mixed martial arts self-audit decomposing striking mechanics, wrestling/grappling chains, fight IQ, psychological composure under fire, and fight-camp discipline.",
  tiers: DEFAULT_TIERS,
  accent: "var(--gold)",
  coachProOnly: true, // Coach Pro exclusive
  gatingPointId: 1, // Mental Composure Under Fire is master governor
  gatingFormula: (score: number) => 0.5 + 0.5 * score,
  zones: standardZones("MMA Combat Readiness Index"),
  pillars: [
    {
      index: 0,
      roman: "I",
      name: "Psychological Warfare & Cage Composure",
      focus: "Calm inside chaos · adversity inoculation · killer instinct · ring generalship",
    },
    {
      index: 1,
      roman: "II",
      name: "Striking Dynamics & Range Mastery",
      focus: "Stance & footwork · boxing combinations · kicks/knees/elbows · pocket defense",
    },
    {
      index: 2,
      roman: "III",
      name: "Wrestling, Cage Work & Transitions",
      focus: "Takedown offense & defense · fence control · clinch control · level changes",
    },
    {
      index: 3,
      roman: "IV",
      name: "Submission Grappling & Ground Control",
      focus: "Positional hierarchy · submission defense · guard recovery · ground-and-pound",
    },
    {
      index: 4,
      roman: "V",
      name: "Combat Conditioning & Physiological Engine",
      focus: "5-round lactate threshold · anaerobic power bursts · isometric grip stamina",
    },
    {
      index: 5,
      roman: "VI",
      name: "Fight Camp, Weight Cut & Recovery Protocols",
      focus: "Water loading/depletion · hyperbaric/cryo recovery · gameplan execution",
    },
  ],
  points: [
    // Pillar I (190 pts)
    {
      id: 1,
      pillar: 0,
      name: "Composure Under Fire",
      focus: "Zero panic when tagged, rocked, or trapped in bad positions",
      weight: 50,
      gating: true,
    },
    {
      id: 2,
      pillar: 0,
      name: "Cage Awareness & Generalship",
      focus: "Controlling the centre, cutting off angles, avoiding trapped back",
      weight: 35,
    },
    {
      id: 3,
      pillar: 0,
      name: "Adversity Transmutation",
      focus: "Surging with heightened aggression when fatigue or pain spikes",
      weight: 35,
    },
    {
      id: 4,
      pillar: 0,
      name: "Killer Instinct",
      focus: "Immediate, ruthless finish protocol the millisecond opponent is hurt",
      weight: 35,
    },
    {
      id: 5,
      pillar: 0,
      name: "Emotional Non-Attachment",
      focus: "Fighting with cold analytical clarity rather than blind ego or rage",
      weight: 35,
    },

    // Pillar II (165 pts)
    {
      id: 6,
      pillar: 1,
      name: "Footwork & Distance Management",
      focus: "In-and-out angles, ring mobility, staying just outside opponent's range",
      weight: 35,
    },
    {
      id: 7,
      pillar: 1,
      name: "Fluid Boxing Combinations",
      focus: "Multi-punch combinations ending on angle exits and head movement",
      weight: 35,
    },
    {
      id: 8,
      pillar: 1,
      name: "Eight Limbs Arsenal",
      focus: "Leg kicks, knees, elbows, and switch kicks executed seamlessly",
      weight: 35,
    },
    {
      id: 9,
      pillar: 1,
      name: "Pocket Head Movement & Parries",
      focus: "Slips, rolls, catches and checks while staying in the fire",
      weight: 30,
    },
    {
      id: 10,
      pillar: 1,
      name: "Feints & Read Inducement",
      focus: "Drawing reactions and establishing predictive traps with micro-feints",
      weight: 30,
    },

    // Pillar III (165 pts)
    {
      id: 11,
      pillar: 2,
      name: "Reactive & Offensive Takedowns",
      focus: "Double-legs, single-legs, and high crotch timed underneath punches",
      weight: 35,
    },
    {
      id: 12,
      pillar: 2,
      name: "Takedown Defense & Underhooks",
      focus: "Down-blocks, heavy hips, whizzers and wall walks against takedowns",
      weight: 35,
    },
    {
      id: 13,
      pillar: 2,
      name: "Cage Pressing & Control",
      focus: "Head positioning, wrist control and knee strikes against the fence",
      weight: 35,
    },
    {
      id: 14,
      pillar: 2,
      name: "Clinch Manipulation & Trips",
      focus: "Muay Thai plumb, Greco-Roman body locks, inside trips and foot sweeps",
      weight: 30,
    },
    {
      id: 15,
      pillar: 2,
      name: "Level Change Fluidity",
      focus: "Disguising wrestling shots directly behind heavy strike commitments",
      weight: 30,
    },

    // Pillar IV (160 pts)
    {
      id: 16,
      pillar: 3,
      name: "Positional Dominance & Pins",
      focus: "Heavy crossfaces, hip pressure, chest-to-chest control in mount/side",
      weight: 35,
    },
    {
      id: 17,
      pillar: 3,
      name: "Ground-and-Pound Mechanics",
      focus: "Posturing up, framing against escapes, striking without losing base",
      weight: 35,
    },
    {
      id: 18,
      pillar: 3,
      name: "Submission Threats & Chains",
      focus: "Strangles, armlocks and leglocks chained seamlessly off transitions",
      weight: 30,
    },
    {
      id: 19,
      pillar: 3,
      name: "Submission Defense & Escapes",
      focus: "Early hand fighting, posture defense, and systematic bridge/hip escapes",
      weight: 30,
    },
    {
      id: 20,
      pillar: 3,
      name: "Active Guard & Wall-Walk Ups",
      focus: "Using the cage to stand back up without absorbing damage",
      weight: 30,
    },

    // Pillar V (160 pts)
    {
      id: 21,
      pillar: 4,
      name: "Championship Cardio Gas Tank",
      focus: "Maintaining explosive output through the final seconds of round 5",
      weight: 40,
    },
    {
      id: 22,
      pillar: 4,
      name: "Anaerobic Burst Recovery",
      focus: "Heart rate dropping 30+ bpm during the 60-second corner rest",
      weight: 30,
    },
    {
      id: 23,
      pillar: 4,
      name: "Isometric Gripping & Neck Stamina",
      focus: "Resilience against collar ties, guillotine holds, and heavy clinches",
      weight: 30,
    },
    {
      id: 24,
      pillar: 4,
      name: "Rotational Core Power",
      focus: "Hip torque for maximum knockout punch and takedown slam velocity",
      weight: 30,
    },
    {
      id: 25,
      pillar: 4,
      name: "Impact Tolerance & Structural Armor",
      focus: "Neck, shoulder, and core conditioning to absorb clean blows safely",
      weight: 30,
    },

    // Pillar VI (160 pts)
    {
      id: 26,
      pillar: 5,
      name: "Strategic Fight Camp Structure",
      focus: "8-10 week periodized sparring, grappling, and peaking timeline",
      weight: 35,
    },
    {
      id: 27,
      pillar: 5,
      name: "Scientific Weight Cut & Rehydration",
      focus: "Safe water depletion without depleting cerebral fluid or power baseline",
      weight: 35,
    },
    {
      id: 28,
      pillar: 5,
      name: "Corner & Coaching Rapport",
      focus: "Listening to and executing corner adjustments between rounds instantly",
      weight: 30,
    },
    {
      id: 29,
      pillar: 5,
      name: "Tape Study & Gameplan Precision",
      focus: "Deep tactical breakdown of opponent habits, tells, and flaws",
      weight: 30,
    },
    {
      id: 30,
      pillar: 5,
      name: "Post-Fight Restitution & Injury Care",
      focus: "Proactive soft tissue, concussion protocols, and joint rehabilitation",
      weight: 30,
    },
  ],
};
