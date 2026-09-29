import { createFileRoute } from "@tanstack/react-router";
import { AuditPayloadSchema, saveAudit, type AuditPayload } from "@/lib/diagnostic/store.server";
import { upsertContactWithScores, applyZoneTag } from "@/lib/diagnostic/crm.server";

export const Route = createFileRoute("/api/audit/save")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const parsed = AuditPayloadSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { ok: false, error: "Validation failed", issues: parsed.error.flatten() },
            { status: 422 },
          );
        }
        const saved = saveAudit(parsed.data);

        // Auto-sync to CRM (non-blocking, best-effort) when an email is present —
        // mirrors the worker's fire-and-forget syncToGHL after audit save.
        if (parsed.data.email) {
          void syncAuditToCrm(parsed.data).catch(() => {
            /* swallow — CRM sync must never fail the audit save */
          });
        }

        return Response.json({ ok: true, id: saved.id, ts: saved.ts });
      },
    },
  },
});

async function syncAuditToCrm(audit: AuditPayload) {
  const up = await upsertContactWithScores({
    email: audit.email!,
    voltage: audit.final,
    rawScore: audit.raw,
    zone: audit.zone,
    teachabilityPct: audit.teachabilityPct,
    peak: audit.peak,
    snapshots: audit.snapshots,
    chiefAim: audit.chiefAim,
  });
  if (up.ok && up.contactId) {
    await applyZoneTag(up.contactId, audit.zone);
  }
}
