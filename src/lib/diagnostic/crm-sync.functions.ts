// Thin server-function wrapper for CRM sync. Helpers live in crm.server.ts.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { upsertContactWithScores, applyZoneTag } from "./crm.server";

const Schema = z.object({
  email: z.string().email(),
  firstName: z.string().max(80).optional(),
  lastName: z.string().max(80).optional(),
  phone: z.string().max(40).optional(),
  voltage: z.number().min(0).max(10000),
  rawScore: z.number().min(0).max(10000),
  zone: z.enum(["friction", "emergence", "operative"]),
  teachabilityPct: z.number().min(0).max(100),
  peak: z.number().min(0).max(10000),
  snapshots: z.number().min(0).max(10000),
  chiefAim: z.string().max(500),
  topBottleneck: z.string().max(200).optional(),
});

export const syncToCrm = createServerFn({ method: "POST" })
  .validator((data) => Schema.parse(data))
  .handler(async ({ data }) => {
    const up = await upsertContactWithScores(data);
    if (!up.ok) return up;
    if (up.contactId) {
      const tagged = await applyZoneTag(up.contactId, data.zone);
      if (!tagged.ok) {
        return { ok: true as const, contactId: up.contactId, tagWarning: tagged.error };
      }
      return { ok: true as const, contactId: up.contactId, tag: tagged.tag };
    }
    return { ok: true as const, contactId: null };
  });
