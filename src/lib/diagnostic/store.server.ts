// Server-only audit + trajectory persistence store.
// NOTE: This edge template has no D1/KV binding, so these in-memory maps are
// ephemeral (per-isolate). They serve the preview/local path. Durable cloud
// persistence is mirrored to CRM custom fields — see crm.server.ts.
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

const audits = new Map<string, AuditPayload>();
const snapshots = new Map<string, StoredSnapshot>();
let auditOrder: string[] = [];

export function saveAudit(p: AuditPayload): AuditPayload {
  audits.set(p.id, p);
  auditOrder = auditOrder.filter((x) => x !== p.id).concat(p.id);
  return p;
}

export function getAudit(id: string): AuditPayload | null {
  return audits.get(id) ?? null;
}

export function listAuditIds(): string[] {
  return Array.from(audits.keys());
}

export function getLatestAudit(): AuditPayload | null {
  if (auditOrder.length === 0) return null;
  return audits.get(auditOrder[auditOrder.length - 1]) ?? null;
}

export function saveSnapshot(p: SnapshotPayload): StoredSnapshot {
  const id = p.id ?? `snap_${p.ts}`;
  const rec: StoredSnapshot = { ...p, id };
  snapshots.set(id, rec);
  return rec;
}

export function listSnapshots(contactId?: string): StoredSnapshot[] {
  const all = Array.from(snapshots.values()).sort((a, b) => a.ts - b.ts);
  return contactId ? all.filter((s) => s.contactId === contactId) : all;
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
