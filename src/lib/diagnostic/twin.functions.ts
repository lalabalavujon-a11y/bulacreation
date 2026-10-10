import { consumeAi, requireFeature } from "../security/session.server";
// Twin reasoning — the "what causes *this* person to move" AI layer (spec §9).
//
// Thin server-function wrapper. All logic lives in the handler so the
// tss-serverfn-split transform doesn't drop sibling helpers.

import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const InputSchema = z.object({
  twinDigest: z.string().min(1).max(4000),
  question: z.string().min(1).max(2000).default("What should I focus on next?"),
});

export const twinReasoning = createServerFn({ method: "POST" })
  .validator((data) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    await requireFeature("digitalTwin");
    await consumeAi();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return {
        ok: false as const,
        error: "AI reasoning is not configured. Set an OpenAI API key to enable twin reasoning.",
      };
    }

    const systemPrompt = [
      "You are the Digital Twin reasoning engine for the 40-Point Creation Algorithm.",
      "You receive a compact longitudinal digest of one user's accumulated state:",
      "their Creation Voltage, trajectory shape, behaviour pattern, recurring constraints,",
      "and what interventions have historically produced movement for them.",
      "",
      "Your job is to answer the user's question by reasoning over THEIR specific",
      "history — not generic advice. Reference their actual constraints, their actual",
      "completion pattern, and what has actually worked for them before.",
      "",
      "DIGEST:",
      data.twinDigest,
      "",
      "RULES:",
      "1. Be specific to this person's data. Quote their recurring constraint by name.",
      "2. If their behaviour pattern is 'rarely acts', prescribe ONE smaller action.",
      "3. If what-works data is available, reference which intervention type moved them.",
      "4. If trajectory is declining or plateaued, name the re-anchor action.",
      "5. Keep it under 200 words. Direct, no preamble.",
    ].join("\n");

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: data.question },
          ],
          temperature: 0.7,
          max_tokens: 350,
        }),
      });

      if (!res.ok) {
        return {
          ok: false as const,
          error: `Twin reasoning failed (${res.status}).`,
        };
      }

      const json = (await res.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const content = json.choices?.[0]?.message?.content?.trim();
      if (!content) return { ok: false as const, error: "Twin returned an empty response." };
      return { ok: true as const, content };
    } catch (err) {
      return { ok: false as const, error: `Network error: ${(err as Error).message}` };
    }
  });
