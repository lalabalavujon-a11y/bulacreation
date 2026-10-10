import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";
import { db } from "./database.server";
const EventSchema = z.object({
  eventId: z.string().min(1).max(150),
  email: z
    .string()
    .email()
    .max(254)
    .transform((s) => s.trim().toLowerCase()),
  plan: z.enum(["free", "pro", "performance", "coach", "coach_pro"]),
  status: z.enum(["active", "trialing", "cancelled", "expired"]),
  expiresAt: z.string().datetime(),
  occurredAt: z.string().datetime(),
});
export async function checkoutWebhook(request: Request): Promise<Response> {
  const secret = process.env["GHL_WEBHOOK_SECRET"];
  if (!secret || secret.length < 32)
    return Response.json({ error: "Billing verification is not configured" }, { status: 503 });
  const timestamp = request.headers.get("X-Bula-Timestamp") ?? "";
  const signature = request.headers.get("X-Bula-Signature") ?? "";
  if (
    !/^\d{10}$/.test(timestamp) ||
    Math.abs(Date.now() / 1000 - Number(timestamp)) > 300 ||
    !/^[a-f0-9]{64}$/.test(signature)
  )
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  // Bound the body before parsing or hashing; Content-Length alone is not trusted.
  const reader = request.body?.getReader();
  if (!reader) return Response.json({ error: "Missing body" }, { status: 400 });
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 16384) {
      await reader.cancel();
      return Response.json({ error: "Payload too large" }, { status: 413 });
    }
    chunks.push(value);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  const expected = createHmac("sha256", secret).update(`${timestamp}.${raw}`).digest("hex");
  if (!timingSafeEqual(Buffer.from(signature), Buffer.from(expected)))
    return Response.json({ error: "Invalid signature" }, { status: 401 });
  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const event = EventSchema.safeParse(body);
  if (!event.success || Date.parse(event.data.occurredAt) > Date.now() + 60000)
    return Response.json({ error: "Invalid billing event" }, { status: 422 });
  const e = event.data;
  // Do not acknowledge activation until the transaction is durably committed.
  const applied = await db<boolean>("rpc/bula_apply_billing", {
    method: "POST",
    body: JSON.stringify({
      p_id: e.eventId,
      p_email: e.email,
      p_plan: e.plan,
      p_status: e.status,
      p_expires: e.expiresAt,
      p_time: e.occurredAt,
    }),
  });
  return Response.json({ ok: true, applied }, { headers: { "Cache-Control": "no-store" } });
}
