// Realtime voice mentor hook — WebRTC peer connection to OpenAI Realtime.
// Uses the app's own /api/realtime/session route (same-origin, no external
// worker URL needed) to obtain the ephemeral client secret with live user
// context + persona injected server-side.
//
// Exposes: state, transcript, sessionId, connect, disconnect, sendText.
import { useCallback, useRef, useState } from "react";
import type { PersonaKey } from "./personas";

export type MentorState = "idle" | "connecting" | "connected" | "listening" | "speaking" | "error";

export interface TranscriptLine {
  role: "user" | "assistant";
  text: string;
  ts: number;
}

interface SessionResponse {
  ok: boolean;
  clientSecret?: string;
  sessionId?: string;
  model?: string;
  error?: string;
}

export function useRealtimeMentor() {
  const [state, setState] = useState<MentorState>("idle");
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const pcRef = useRef<RTCPeerConnection | null>(null);
  const dcRef = useRef<RTCDataChannel | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const teardown = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    dcRef.current?.close();
    pcRef.current?.close();
    ctxRef.current?.close();
    audioRef.current?.pause();
    pcRef.current = null;
    dcRef.current = null;
    streamRef.current = null;
    audioRef.current = null;
    analyserRef.current = null;
    ctxRef.current = null;
  }, []);

  const disconnect = useCallback(() => {
    teardown();
    setState("idle");
    setSessionId(null);
  }, [teardown]);

  const connect = useCallback(
    async (
      persona: PersonaKey,
      opts?: {
        context?: string;
        onAnalyser?: (analyser: AnalyserNode) => void;
      },
    ) => {
      setError(null);
      setState("connecting");
      try {
        // 1. Ephemeral token from app route (live context + persona injected server-side)
        const res = await fetch("/api/realtime/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ persona, context: opts?.context }),
        });
        const data = (await res.json()) as SessionResponse;
        if (!data.ok || !data.clientSecret) {
          throw new Error(data.error ?? "Realtime session failed");
        }
        setSessionId(data.sessionId ?? null);
        const model = data.model ?? "gpt-4o-realtime-preview";

        // 2. WebRTC peer connection
        const pc = new RTCPeerConnection();
        pcRef.current = pc;

        // Remote audio → <audio> element
        const audio = document.createElement("audio");
        audio.autoplay = true;
        audioRef.current = audio;
        pc.ontrack = (e) => {
          audio.srcObject = e.streams[0];
          audio.play().catch(() => {});
          // Wire remote stream into an analyser for the visualizer
          try {
            const actx = new AudioContext();
            ctxRef.current = actx;
            const analyser = actx.createAnalyser();
            analyser.fftSize = 256;
            analyserRef.current = analyser;
            const src = actx.createMediaStreamSource(e.streams[0]);
            src.connect(analyser);
            opts?.onAnalyser?.(analyser);
          } catch {
            /* ignore */
          }
        };

        // Local mic
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
        });
        streamRef.current = stream;
        stream.getTracks().forEach((t) => pc.addTrack(t, stream));

        // Data channel for Realtime events
        const dc = pc.createDataChannel("oai-events");
        dcRef.current = dc;

        dc.onmessage = (e) => {
          const event = JSON.parse(e.data) as Record<string, unknown>;
          switch (event.type) {
            case "input_audio_buffer.speech_started":
              setState("listening");
              break;
            case "response.audio.delta":
              setState("speaking");
              break;
            case "response.audio_transcript.delta": {
              const delta = event.delta as string;
              setTranscript((prev) => {
                const next = [...prev];
                const last = next[next.length - 1];
                if (last?.role === "assistant") {
                  next[next.length - 1] = { ...last, text: last.text + delta };
                } else {
                  next.push({ role: "assistant", text: delta, ts: Date.now() });
                }
                return next;
              });
              break;
            }
            case "response.done":
              setState("connected");
              break;
            case "conversation.item.input_audio_transcription.completed": {
              const t = event.transcript as string;
              if (t) setTranscript((prev) => [...prev, { role: "user", text: t, ts: Date.now() }]);
              break;
            }
          }
        };

        // 3. SDP handshake directly with OpenAI Realtime (ephemeral token)
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const sdpRes = await fetch(`https://api.openai.com/v1/realtime?model=${model}`, {
          method: "POST",
          body: offer.sdp,
          headers: {
            Authorization: `Bearer ${data.clientSecret}`,
            "Content-Type": "application/sdp",
          },
        });

        if (!sdpRes.ok) {
          const t = await sdpRes.text();
          throw new Error(`WebRTC handshake failed (${sdpRes.status}): ${t.slice(0, 160)}`);
        }
        await pc.setRemoteDescription({ type: "answer", sdp: await sdpRes.text() });

        setState("connected");
      } catch (err) {
        console.error("Realtime connect error:", err);
        setError((err as Error).message);
        setState("error");
        teardown();
      }
    },
    [teardown],
  );

  // Text fallback — send a user message over the data channel
  const sendText = useCallback((text: string) => {
    const dc = dcRef.current;
    if (!dc || dc.readyState !== "open") return;
    dc.send(
      JSON.stringify({
        type: "conversation.item.create",
        item: {
          type: "message",
          role: "user",
          content: [{ type: "input_text", text }],
        },
      }),
    );
    dc.send(JSON.stringify({ type: "response.create" }));
    setTranscript((prev) => [...prev, { role: "user", text, ts: Date.now() }]);
  }, []);

  return {
    state,
    transcript,
    sessionId,
    error,
    analyserRef,
    connect,
    disconnect,
    sendText,
  };
}
