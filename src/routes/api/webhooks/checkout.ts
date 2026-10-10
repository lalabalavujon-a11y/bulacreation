import { createFileRoute } from "@tanstack/react-router";
import { checkoutWebhook } from "@/lib/security/billing.server";
export const Route = createFileRoute("/api/webhooks/checkout")({ server: { handlers: { POST: ({ request }) => checkoutWebhook(request) } } });
