import { createFileRoute } from "@tanstack/react-router";
import { getAudit } from "@/lib/diagnostic/store.server";

export const Route = createFileRoute("/api/audit/$id")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const rec = await getAudit(params.id);
        if (!rec) {
          return new Response("Audit not found", { status: 404 });
        }
        return Response.json(rec);
      },
    },
  },
});
