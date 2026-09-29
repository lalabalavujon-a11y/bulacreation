// Context-builder for the AI coach. Pure, browser-safe — no server imports.
import type { ScoreResult } from "./scoring";
import { zoneMeta } from "./scoring";
import type { ChiefAim, EvidenceNotes } from "./context";
import type { PhilosophyKey } from "./philosophy";
import { PHILOSOPHIES } from "./philosophy";
import { getMethodology } from "./methodology";

export interface CoachContextPayload {
  finalScore: number;
  rawScore: number;
  zone: string;
  teachabilityIndex: string;
  topBottlenecks: string[];
  chiefAim: string;
  pillarEfficiencies: { name: string; efficiency: number }[];
  /** Compact digest of open 48-hr commitments the coach should hold the user to. */
  commitmentsDigest: string;
  philosophy: string;
  /** Evidence notes for the top bottleneck points — gives the coach qualitative signal. */
  evidenceNotes: { pointId: number; note: string }[];
  /** The agent's own track record — what interventions have worked for this user. */
  effectivenessDigest: string;
  /** Longitudinal twin digest — who this user is over time, not just now. */
  twinDigest: string;
}

export function buildCoachContext(
  result: ScoreResult,
  aim: ChiefAim,
  commitmentsDigest = "none — no open assignments",
  philosophy: PhilosophyKey = "performance",
  evidenceNotes: EvidenceNotes = {},
  effectivenessDigest = "insufficient data (<3 settled interventions)",
  twinDigest = "twin not yet active — insufficient longitudinal data",
): CoachContextPayload {
  const z = zoneMeta(result.zone);
  const philName = PHILOSOPHIES[philosophy]?.name ?? "Performance";

  // Collect evidence notes for the top 5 bottleneck points.
  const topBottleneckIds = result.bottlenecks.slice(0, 5).map((b) => b.point.id);
  const notes = topBottleneckIds
    .map((id) => ({ pointId: id, note: evidenceNotes[id] }))
    .filter((n) => n.note && n.note.trim().length > 0);

  return {
    finalScore: result.finalRounded,
    rawScore: Math.round(result.raw),
    zone: z.label,
    teachabilityIndex: `${Math.round(result.teachabilityFactor * 100)}% (tier ${result.teachabilityScore})`,
    topBottlenecks: result.bottlenecks.slice(0, 5).map((b) => {
      const m = getMethodology(b.point.id);
      const intervention = m ? ` → intervention: ${m.intervention}` : "";
      return `${b.point.id}. ${b.point.name} (deficit ${Math.round(b.deficit)})${intervention}`;
    }),
    chiefAim: aim.text || "(not yet defined)",
    pillarEfficiencies: result.pillars.map((p) => ({
      name: p.name,
      efficiency: Math.round(p.efficiency * 100),
    })),
    commitmentsDigest,
    philosophy: philName,
    evidenceNotes: notes,
    effectivenessDigest,
    twinDigest,
  };
}

/**
 * Format the live user context as the "LIVE USER CONTEXT" block injected into
 * persona system prompts. Mirrors the server-side buildServerContext() shape so
 * text + voice coaches speak the same context dialect.
 */
export function formatContextBlock(ctx: CoachContextPayload): string {
  const lines = [
    "LIVE USER CONTEXT — 40-Point Creation Algorithm:",
    `• Creation Voltage  : ${ctx.finalScore.toLocaleString()} / 10,000`,
    `• Raw Points        : ${ctx.rawScore.toLocaleString()}`,
    `• Zone              : ${ctx.zone.toUpperCase()}`,
    `• Teachability      : ${ctx.teachabilityIndex}`,
    `• Chief Aim         : ${ctx.chiefAim}`,
    `• Philosophy        : ${ctx.philosophy}`,
    `• Top Bottlenecks   : ${ctx.topBottlenecks.slice(0, 3).join("; ") || "none detected"}`,
    `• Pillar Efficiency : ${ctx.pillarEfficiencies.map((p) => `${p.name} ${p.efficiency}%`).join(", ")}`,
    `• Open Assignments  : ${ctx.commitmentsDigest}`,
  ];
  if (ctx.evidenceNotes.length > 0) {
    lines.push(
      `• Evidence Notes    : ${ctx.evidenceNotes
        .map((n) => `#${n.pointId}: ${n.note.slice(0, 120)}`)
        .join(" | ")}`,
    );
  }
  lines.push(`• What Works For You: ${ctx.effectivenessDigest}`);
  lines.push(`• Digital Twin     : ${ctx.twinDigest}`);
  return lines.join("\n");
}
