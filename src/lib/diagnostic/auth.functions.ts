import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requestCode, verifyCode, currentAccount, endSession } from "../security/session.server";
const Email = z.string().trim().email().max(254);
export const requestLoginCode = createServerFn({ method: "POST" })
  .inputValidator(z.object({ email: Email }))
  .handler(({ data }) => requestCode(data.email));
export const verifyLoginCode = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      email: Email,
      code: z.string().regex(/^\d{6,10}$/),
      name: z.string().trim().min(1).max(120),
    }),
  )
  .handler(({ data }) => verifyCode(data.email, data.code, data.name));
export const getSession = createServerFn({ method: "GET" }).handler(() => currentAccount());
export const logoutSession = createServerFn({ method: "POST" }).handler(() => endSession());
