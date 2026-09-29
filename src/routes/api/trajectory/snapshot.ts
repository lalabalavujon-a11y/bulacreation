import { createFileRoute } from "@tanstack/react-router";
import { SnapshotPayloadSchema, saveSnapshot } from "@/lib/diagnostic/store.server";

export const Route = createFileRoute("/api/trajectory/snapshot")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const parsed = SnapshotPayloadSchema.safeParse(body);
        if (!parsed.success) {
          return Response.json(
            { ok: false, error: "Validation failed", issues: parsed.error.flatten() },
            { status: 422 },
          );
        }
        const rec = saveSnapshot(parsed.data);
        return Response.json({ ok: true, id: rec.id, ts: rec.ts });
      },
    },
  },
});
