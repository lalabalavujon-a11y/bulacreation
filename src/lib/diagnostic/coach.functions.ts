import { consumeAi, requireFeature } from "../security/session.server";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getPersonaSystem } from "./personas";

const InputSchema = z.object({
  persona: z.enum(["brotherhood", "neville", "maltz", "calibration"]),
  messages: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string() }))
    .min(1)
    .max(40),
  context: z.string().min(1).max(8000),
});

export const askCoach = createServerFn({ method: "POST" })
  .validator((data) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    if (data.persona === "calibration") await requireFeature("coachOs");
    await consumeAi();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        ok: false as const,
        error: "AI coach is not configured. Set an OpenAI API key to enable mentoring.",
      };
    }

    const systemMessage = getPersonaSystem(data.persona, data.context);

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "system", content: systemMessage }, ...data.messages],
          temperature: 0.7,
          max_tokens: 400,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        return {
          ok: false as const,
          error: `Coach request failed (${res.status}): ${text.slice(0, 160)}`,
        };
      }

      const json = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = json.choices?.[0]?.message?.content?.trim();
      if (!content) return { ok: false as const, error: "Coach returned an empty response." };
      return { ok: true as const, content };
    } catch (err) {
      return { ok: false as const, error: `Network error: ${(err as Error).message}` };
    }
  });
