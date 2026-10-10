import { requireFeature, assertSameOrigin, consumeAi } from "@/lib/security/session.server";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { getLatestAudit, buildServerContext } from "@/lib/diagnostic/store.server";
import { getPersonaSystem, getPersonaVoice } from "@/lib/diagnostic/personas";

const BodySchema = z.object({
  persona: z.enum(["brotherhood", "neville", "maltz"]),
  context: z.string().max(8000).optional(),
  auditId: z.string().min(1).max(120).optional(),
});

export const Route = createFileRoute("/api/realtime/session")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        assertSameOrigin();
        await requireFeature("voiceCoach");
        await consumeAi();
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
          return Response.json(
            {
              ok: false,
              error: "Realtime voice requires an OpenAI API key (OPENAI_API_KEY).",
            },
            { status: 503 },
          );
        }

        let body: unknown;
        try {
          body = await request.json();
        } catch {
          return new Response("Invalid JSON", { status: 400 });
        }
        const parsed = BodySchema.safeParse(body);
        if (!parsed.success) {
          return new Response("Bad request", { status: 400 });
        }

        // Load user context server-side from the latest persisted audit
        // (mirrors the worker's D1 context load). Client-provided context is
        // appended so live, unsaved state still reaches the model.
        const latest = await getLatestAudit();
        const serverContext = buildServerContext(latest);
        const clientContext = parsed.data.context?.trim() ?? "";
        const liveContext = clientContext
          ? `${serverContext}\n\n--- LIVE CLIENT CONTEXT ---\n${clientContext}`
          : serverContext;

        const instructions =
          getPersonaSystem(parsed.data.persona, liveContext) +
          "\n\n" +
          "You are a voice mentor for the 40-Point Creation Algorithm. Speak concisely, " +
          "warmly, with conviction. Reference the user's live score, zone, and bottlenecks. " +
          "Keep spoken responses brief and end with one concrete next step.";

        try {
          const res = await fetch("https://api.openai.com/v1/realtime/sessions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
              model: "gpt-4o-realtime-preview",
              voice: getPersonaVoice(parsed.data.persona),
              instructions,
              input_audio_format: "pcm16",
              output_audio_format: "pcm16",
              input_audio_transcription: { model: "whisper-1" },
              turn_detection: {
                type: "server_vad",
                threshold: 0.5,
                silence_duration_ms: 600,
                create_response: true,
                interrupt_response: true,
              },
            }),
          });

          if (!res.ok) {
            const text = await res.text();
            return Response.json(
              {
                ok: false,
                error: `Realtime session failed (${res.status}): ${text.slice(0, 200)}`,
              },
              { status: 502 },
            );
          }

          const json = (await res.json()) as {
            client_secret?: { value?: string };
            id?: string;
            model?: string;
          };
          const secret = json.client_secret?.value;
          if (!secret) {
            return Response.json(
              { ok: false, error: "OpenAI returned no client secret." },
              { status: 502 },
            );
          }
          return Response.json({
            ok: true,
            clientSecret: secret,
            sessionId: json.id,
            model: json.model ?? "gpt-4o-realtime-preview",
          });
        } catch (err) {
          return Response.json(
            { ok: false, error: `Network error: ${(err as Error).message}` },
            { status: 502 },
          );
        }
      },
    },
  },
});
