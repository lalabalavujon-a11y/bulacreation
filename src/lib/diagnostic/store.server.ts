import { readProgress } from "../security/progress.server";
import { computeScore } from "./scoring";
import { db } from "../security/database.server";
import { requireAccount } from "../security/session.server";
// Server-only audit + trajectory persistence store.
// Durable storage; every query is scoped to the verified account.
import { z } from "zod";

export const AuditPayloadSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-zA-Z0-9_-]+$/),
  final: z.number().min(0).max(10000),
  raw: z.number().min(0).max(10000),
  zone: z.enum(["friction", "emergence", "operative"]),
  teachabilityPct: z.number().min(0).max(100),
  peak: z.number().min(0).max(10000),
  snapshots: z.number().min(0).max(10000),
  chiefAim: z.string().max(500),
  scores: z.record(z.string(), z.union([z.number(), z.string()])),
  email: z.string().email().optional(),
  ts: z.number(),
});

export type AuditPayload = z.infer<typeof AuditPayloadSchema>;

export const SnapshotPayloadSchema = z.object({
  id: z
    .string()
    .min(1)
    .max(120)
    .regex(/^[a-zA-Z0-9_-]+$/)
    .optional(),
  contactId: z.string().min(1).max(120).optional(),
  totalVoltage: z.number().min(0).max(10000),
  rawPoints: z.number().min(0).max(10000),
  teachabilityMultiplier: z.number().min(0).max(1),
  pillarScores: z.record(z.string(), z.number()),
  zone: z.enum(["friction", "emergence", "operative"]),
  label: z.string().max(120).optional(),
  ts: z.number(),
});

export type SnapshotPayload = z.infer<typeof SnapshotPayloadSchema>;

export interface StoredSnapshot extends SnapshotPayload {
  id: string;
}

export async function saveAudit(p: AuditPayload): Promise<AuditPayload> {
  const account = await requireAccount();
  const data = { ...p, email: account.email };
  await db("bula_audits?on_conflict=user_id,id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates" }, body: JSON.stringify({ user_id: account.id, id: p.id, data, updated_at: new Date().toISOString() }) });
  return data;
}
export async function getAudit(id: string): Promise<AuditPayload | null> {
  const account = await requireAccount();
  const rows = await db<{ data: AuditPayload }[]>(`bula_audits?user_id=eq.${encodeURIComponent(account.id)}&id=eq.${encodeURIComponent(id)}&select=data&limit=1`);
  return rows[0]?.data ?? null;
}
export async function getLatestAudit(): Promise<AuditPayload | null> {
  const saved = await readProgress();
  if (!saved) return null;
  const p = saved.data;
  const result = computeScore(p.scores);
  return { id: "current", scores: p.scores, chiefAim: p.chiefAim.text, final: result.finalRounded,
    raw: Math.round(result.raw), zone: result.zone, teachabilityPct: result.teachabilityFactor * 100,
    peak: p.snapshots.reduce((n, s) => Math.max(n, s.final), 0), snapshots: p.snapshots.length,
    ts: Date.parse(saved.updatedAt) };
}
export async function saveSnapshot(p: SnapshotPayload): Promise<StoredSnapshot> {
  const account = await requireAccount();
  const id = p.id ?? crypto.randomUUID();
  const rec = { ...p, id, contactId: account.id };
  await db("bula_snapshots?on_conflict=user_id,id", { method: "POST", headers: { Prefer: "resolution=merge-duplicates" }, body: JSON.stringify({ user_id: account.id, id, data: rec }) });
  return rec;
}

/**
 * Build a server-side user context block from the latest persisted audit,
 * mirroring the worker's buildUserContext(). Used to inject live score / zone /
 * chief aim into the realtime voice session instructions.
 */
export function buildServerContext(audit: AuditPayload | null): string {
  if (!audit) {
    return [
      "LIVE USER CONTEXT — 40-Point Algorithm:",
      "• Creation Voltage : 0 / 10,000 (no audit saved yet)",
      "• Zone             : FRICTION",
      "• Chief Aim        : not yet defined",
    ].join("\n");
  }
  const friction = Object.values(audit.scores).filter(
    (v) => v === 0 || v === "0" || v === "friction",
  ).length;
  const mastered = Object.values(audit.scores).filter(
    (v) => v === 1 || v === "1" || v === "mastered",
  ).length;
  return [
    "LIVE USER CONTEXT — 40-Point Algorithm:",
    `• Creation Voltage  : ${audit.final} / 10,000`,
    `• Zone              : ${audit.zone.toUpperCase()}`,
    `• Teachability      : ${audit.teachabilityPct}%`,
    `• Peak / Snapshots  : ${audit.peak} / ${audit.snapshots}`,
    `• Points in Friction: ${friction}`,
    `• Points Mastered   : ${mastered}`,
    `• Chief Aim         : ${audit.chiefAim || "not yet defined"}`,
  ].join("\n");
}
