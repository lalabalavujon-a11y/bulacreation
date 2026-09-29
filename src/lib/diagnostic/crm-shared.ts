// Browser-safe CRM shared constants. Imported by both client components
// (cloud-sync-panel) and server-only CRM helpers (crm.server).
// Keep this free of server-only imports (no process.env, no fetch).
//
// All IDs below are LIVE in the BULA Creation sub-account. Fields, tags,
// pipeline stages and Conversation-AI agents were provisioned there.

/** BULA Creation sub-account location. All field/tag/pipeline IDs below
 *  belong to this location, so syncs must target it explicitly. */
export const BULA_LOCATION = "AbTTmsIWJArIsycwr0eI";

/** Live custom-field IDs (BULA Creation). The CRM upsert writes by field id. */
export const CRM_FIELD_IDS = {
  voltage: "u3bHJ5lAxcjag2tNgEey", // BULA Voltage        (final after governor)
  zone: "BRKSuBHwtbYS3lfWgzXg", // BULA Zone           (Friction/Emergence/Operative)
  chiefAim: "AYVUdmfSIi0VFupCrsLN", // BULA Chief Aim      (LARGE_TEXT)
  topBottleneck: "G39qsA0MMSwqmVj02sD4", // BULA Top Bottleneck (TEXT)
  rawScore: "2lKdWJwWZyVCOPQu9wMN", // BULA Raw Score      (before governor)
  teachability: "aO5lTvn8tc3uvAYXitcr", // BULA Teachability   (% as number)
  peakVoltage: "kZQE8k58btCSb6Mg8Oro", // BULA Peak Voltage   (historical high)
} as const;

/** Zone tag map. The current zone's tag is applied; all others are removed
 *  on every sync so a contact carries exactly one active zone tag — the
 *  signal for CRM workflow zone-crossing triggers. */
export const ZONE_TAGS: Record<string, string> = {
  friction: "40pt-friction-zone",
  emergence: "40pt-emergence-zone",
  operative: "40pt-operative-active",
};

export function zoneTag(zone: string): string {
  return ZONE_TAGS[zone] ?? `40pt-${zone}-zone`;
}

/** Capitalised zone label for the BULA Zone single-option field. */
export function zoneLabel(zone: string): string {
  const z = zone as keyof typeof ZONE_TAGS;
  if (z === "operative") return "Operative";
  if (z === "emergence") return "Emergence";
  return "Friction";
}

/** BULA Creation sales pipeline + stage IDs. Applied on first login so every
 *  new user enters the pipeline at "New Lead". */
export const PIPELINE = {
  id: "Rfzg3UzFpsPDFGKDcdN0",
  stages: {
    newLead: "42c4418b-a78f-46ef-9163-b37fd1cd9746",
    discoveryCall: "f3befbbc-c1e6-4281-a4f6-2650e5b2b811",
    trialAccess: "68ddfc58-c59f-44f8-85ef-cc413bd259af",
    coachConverted: "5dd10dd0-6856-4840-bfb4-c40ed959239e",
    churned: "f441877a-82aa-42d7-bd24-3e756e24bd29",
  },
} as const;

/** Conversation-AI mentor agent IDs (text coaching fallback from GPT Live).
 *  Server-side only in practice; kept here for single-source-of-truth. */
export const MENTOR_AGENTS = {
  brotherhood: "FJEpxClR9KckxTP1izKB", // Brotherhood Master
  neville: "yJg8NebM1D9PEIAt9LzH", // Mystical Assumption
  maltz: "R3CijmltrGY2j07vb0GF", // Cybernetics Engineer
} as const;
