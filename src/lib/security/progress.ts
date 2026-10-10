import { z } from "zod";
const PointId = z.string().regex(/^(?:[1-9]|[1-3][0-9]|40)$/);
export const ProgressSchema = z.object({
  scores: z.record(
    PointId,
    z.union([z.literal(0), z.literal(0.33), z.literal(0.66), z.literal(1)]),
  ),
  evidenceNotes: z.record(PointId, z.string().max(4000)),
  chiefAim: z.object({
    text: z.string().max(500),
    specificity: z.string().max(4000),
    believability: z.number().min(1).max(10),
    disgust: z.string().max(4000),
    handwriting: z.string().max(8000),
  }),
  snapshots: z
    .array(
      z.object({
        id: z.string().max(120),
        ts: z.number(),
        final: z.number().min(0).max(10000),
        raw: z.number().min(0).max(10000),
        zone: z.enum(["friction", "emergence", "operative"]),
        label: z.string().max(120).optional(),
      }),
    )
    .max(10000),
  philosophy: z.enum(["performance", "founder", "stoic", "maltz", "neville", "spiritual"]),
  onboarded: z.boolean(),
  creationPlan: z
    .object({
      ok: z.literal(true),
      chiefAim: z.string().max(1000),
      voltage: z.number(),
      zone: z.string().max(40),
      constraintId: z.number(),
      constraintName: z.string().max(200),
      why: z.string().max(8000),
      intervention72h: z.string().max(8000),
      thisWeek: z.array(z.string().max(4000)).max(10),
      doNotFocusOn: z.array(z.string().max(4000)).max(10),
      nextAudit: z.string().max(100),
      persona: z.string().max(100),
    })
    .nullable(),
});
export type Progress = z.infer<typeof ProgressSchema>;
