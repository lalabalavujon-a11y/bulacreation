import { createFileRoute } from "@tanstack/react-router";
export const Route = createFileRoute("/api/audit/save")({ server: { handlers: { POST: () => Response.json({ error: "This save endpoint has been replaced. Refresh the app and use Save progress to account." }, { status: 410 }) } } });
