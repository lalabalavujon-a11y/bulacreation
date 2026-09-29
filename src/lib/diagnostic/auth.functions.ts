// Thin server-function wrapper for email-identity login.
// Upserts a CRM contact by email (+name) and returns a stable contactId plus
// any plan-tier tags so the client can auto-grant entitlement after purchase.
// Helpers live in crm.server.ts (server-only).
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { upsertContactLogin } from "./crm.server";

const Schema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(120).optional(),
});

export const loginContact = createServerFn({ method: "POST" })
  .validator((data) => Schema.parse(data))
  .handler(async ({ data }) => {
    return await upsertContactLogin(data);
  });
