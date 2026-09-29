// Creation Plan™ generator — the flagship V1 feature.
// Converts an audit result into a structured execution plan:
// Chief Aim → Voltage → Primary Constraint → Why → 72h Intervention →
// This Week (3 actions) → Do NOT Focus On (3 distractions) → Next Audit.
//
// Server function: calls OpenAI to generate the "Why" + actions, grounded in
// the formalised methodology (methodology.ts) + live user context.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getPersonaSystem } from "./personas";
import { getMethodology } from "./methodology";
import type { PhilosophyKey } from "./philosophy";

const InputSchema = z.object({
  persona: z.enum(["brotherhood", "neville", "maltz", "calibration"]),
  philosophy: z.enum(["performance", "founder", "stoic", "maltz", "neville", "spiritual"]),
  voltage: z.number().min(0).max(10000),
  zone: z.enum(["friction", "emergence", "operative"]),
  chiefAim: z.string().max(500),
  believability: z.number().min(1).max(10),
  constraintId: z.number().min(1).max(40),
  constraintName: z.string().max(200),
  constraintTier: z.string(),
  openCommitments: z.number().min(0),
  contextBlock: z.string().min(1).max(8000),
});

export interface CreationPlan {
  ok: true;
  chiefAim: string;
  voltage: number;
  zone: string;
  constraintId: number;
  constraintName: string;
  why: string;
  intervention72h: string;
  thisWeek: string[];
  doNotFocusOn: string[];
  nextAudit: string;
  persona: string;
}

export const generateCreationPlan = createServerFn({ method: "POST" })
  .validator((data) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.OPENAI_API_KEY;
    const methodology = getMethodology(data.constraintId);

    // Build the plan prompt — grounded in the formalised methodology.
    const interventionBase =
      methodology?.intervention ??
      `Close the gap on ${data.constraintName} with one specific, measurable action.`;

    const systemPrompt = [
      getPersonaSystem(data.persona, data.contextBlock),
      "",
      "CREATION PLAN GENERATION MODE",
      "You are generating a structured Creation Plan for the user. Output ONLY",
      "a JSON object — no preamble, no markdown fences, no commentary.",
      "The plan must be grounded in the live user context and the methodology.",
      "",
      `Primary constraint: Point #${data.constraintId} — ${data.constraintName} (tier: ${data.constraintTier}).`,
      `Methodology intervention for this point: ${interventionBase}`,
      methodology ? `Evidence prompt: ${methodology.evidencePrompt}` : "",
      "",
      "JSON schema (output exactly this shape):",
      JSON.stringify(
        {
          why: "1-2 sentence explanation of why this constraint is blocking the aim, grounded in the methodology",
          intervention72h: "one specific, measurable 72-hour action",
          thisWeek: ["3 concrete actions for this week"],
          doNotFocusOn: ["3 distractions to explicitly avoid"],
        },
        null,
        0,
      ),
    ].join("\n");

    if (!apiKey) {
      // Graceful fallback — generate a deterministic plan from methodology alone.
      return fallbackPlan(data, interventionBase);
    }

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: systemPrompt }],
          temperature: 0.6,
          max_tokens: 500,
          response_format: { type: "json_object" },
        }),
      });

      if (!res.ok) return fallbackPlan(data, interventionBase);

      const json = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const raw = json.choices?.[0]?.message?.content?.trim();
      if (!raw) return fallbackPlan(data, interventionBase);

      const parsed = JSON.parse(raw) as {
        why?: string;
        intervention72h?: string;
        thisWeek?: string[];
        doNotFocusOn?: string[];
      };

      const nextAuditDate = nextSunday();

      return {
        ok: true as const,
        chiefAim: data.chiefAim || "(not yet defined)",
        voltage: data.voltage,
        zone: data.zone,
        constraintId: data.constraintId,
        constraintName: data.constraintName,
        why:
          parsed.why ||
          `${data.constraintName} is the highest-leverage constraint blocking your aim right now.`,
        intervention72h: parsed.intervention72h || interventionBase,
        thisWeek: Array.isArray(parsed.thisWeek) ? parsed.thisWeek.slice(0, 3) : [interventionBase],
        doNotFocusOn: Array.isArray(parsed.doNotFocusOn)
          ? parsed.doNotFocusOn.slice(0, 3)
          : defaultDistractions(data.philosophy),
        nextAudit: nextAuditDate,
        persona: data.persona,
      };
    } catch {
      return fallbackPlan(data, interventionBase);
    }
  });

function fallbackPlan(data: z.infer<typeof InputSchema>, interventionBase: string): CreationPlan {
  return {
    ok: true,
    chiefAim: data.chiefAim || "(not yet defined)",
    voltage: data.voltage,
    zone: data.zone,
    constraintId: data.constraintId,
    constraintName: data.constraintName,
    why: `${data.constraintName} (Point #${data.constraintId}) is your single highest-leverage constraint — closing this gap unlocks the most voltage per unit of effort.`,
    intervention72h: interventionBase,
    thisWeek: [
      interventionBase,
      `Re-score Point #${data.constraintId} in 72 hours to verify movement`,
      `Spend 20 minutes daily on ${data.constraintName} before any reactive input`,
    ],
    doNotFocusOn: defaultDistractions(data.philosophy),
    nextAudit: nextSunday(),
    persona: data.persona,
  };
}

function defaultDistractions(philosophy: PhilosophyKey): string[] {
  if (philosophy === "neville" || philosophy === "spiritual") {
    return [
      "Consuming more content about manifestation without practising",
      "Tracking outcomes obsessively before the state is established",
      "Discussing the aim with people who drain your conviction",
    ];
  }
  return [
    "Consuming content instead of creating output",
    "Working on low-leverage tasks that feel productive",
    "Seeking validation instead of evidence of movement",
  ];
}

function nextSunday(): string {
  const d = new Date();
  const day = d.getDay();
  const daysUntilSunday = day === 0 ? 7 : 7 - day;
  d.setDate(d.getDate() + daysUntilSunday);
  d.setHours(18, 0, 0, 0);
  return d.toLocaleString(undefined, {
    weekday: "long",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
