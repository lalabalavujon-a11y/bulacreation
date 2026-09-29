import { useState, useRef, useEffect, useCallback } from "react";
import { useDiagnostic } from "@/lib/diagnostic/context";
import { buildCoachContext, formatContextBlock } from "@/lib/diagnostic/coach-context";
import { PERSONA_META, type PersonaKey } from "@/lib/diagnostic/personas";
import { useRealtimeMentor } from "@/lib/diagnostic/use-realtime-mentor";
import { cn } from "@/lib/utils";
import { Mic, PhoneOff, Radio, AlertCircle, Loader2, Send, Ear, Volume2 } from "lucide-react";

interface Props {
  persona: PersonaKey;
}

export function VoiceCoach({ persona }: Props) {
  const { result, chiefAim } = useDiagnostic();
  const [text, setText] = useState("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const { state, transcript, error, connect, disconnect, sendText } = useRealtimeMentor();

  const draw = useCallback((analyser: AnalyserNode) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const buf = new Uint8Array(analyser.frequencyBinCount);

    const loop = () => {
      analyser.getByteFrequencyData(buf);
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      const bars = 48;
      const step = Math.floor(buf.length / bars) || 1;
      for (let i = 0; i < bars; i++) {
        const v = buf[i * step] / 255;
        const bh = Math.max(2, v * h * 0.92);
        const x = (i / bars) * w;
        ctx.fillStyle = i % 2 === 0 ? "var(--gold-bright)" : "var(--gold-soft)";
        ctx.globalAlpha = 0.25 + v * 0.75;
        ctx.fillRect(x + 1, h - bh, w / bars - 2, bh);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    loop();
  }, []);

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, []);

  const start = useCallback(() => {
    const ctxPayload = buildCoachContext(result, chiefAim);
    void connect(persona, {
      context: formatContextBlock(ctxPayload),
      onAnalyser: draw,
    });
  }, [persona, result, chiefAim, connect, draw]);

  const stop = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    disconnect();
  }, [disconnect]);

  useEffect(() => () => stop(), [stop]);

  const live = state === "connected" || state === "listening" || state === "speaking";
  const connecting = state === "connecting";

  const stateLabel: Record<typeof state, string> = {
    idle: "Realtime Voice Mentor",
    connecting: "Establishing channel…",
    connected: "Live — bidirectional audio",
    listening: "Listening…",
    speaking: "Mentor speaking",
    error: "Channel error",
  };

  const stateIcon = () => {
    if (state === "listening") return <Ear className="size-4 text-gold-bright" />;
    if (state === "speaking") return <Volume2 className="size-4 text-gold-bright" />;
    return <Radio className={cn("size-4", live ? "text-gold-bright" : "text-muted-foreground")} />;
  };

  const submitText = () => {
    const t = text.trim();
    if (!t) return;
    sendText(t);
    setText("");
  };

  return (
    <div className="panel flex h-[60vh] min-h-[420px] flex-col">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <div className="flex items-center gap-2">
          {stateIcon()}
          <span className="text-sm font-medium">{stateLabel[state]}</span>
        </div>
        <span
          className={cn(
            "inline-flex items-center gap-1.5 text-xs",
            live ? "text-gold-bright" : "text-muted-foreground",
          )}
        >
          <span
            className={cn(
              "size-2 rounded-full",
              live
                ? "animate-pulse bg-gold-bright"
                : connecting
                  ? "bg-gold-soft"
                  : "bg-muted-foreground",
            )}
          />
          {PERSONA_META.find((p) => p.id === persona)?.name ?? persona}
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
        <canvas
          ref={canvasRef}
          width={560}
          height={120}
          className="h-[120px] w-full max-w-[560px] rounded-md bg-void/40"
        />

        {/* Live transcript */}
        {transcript.length > 0 ? (
          <div className="flex h-full max-h-[180px] w-full max-w-[560px] flex-col gap-2 overflow-y-auto rounded-md border border-border bg-void/20 p-3">
            {transcript.map((line, i) => (
              <div
                key={i}
                className={cn(
                  "max-w-[85%] rounded-lg px-3 py-1.5 text-xs",
                  line.role === "user"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted text-foreground",
                )}
              >
                {line.text}
              </div>
            ))}
          </div>
        ) : (
          <p className="max-w-sm text-center text-xs text-muted-foreground">
            {live
              ? "Speak naturally — server VAD handles turn-taking. Interrupt anytime by talking."
              : "Connects to gpt-4o-realtime-preview over WebRTC. Your live score, zone, and chief aim are injected as context."}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={live || connecting ? stop : start}
            disabled={connecting}
            className={cn(
              "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50",
              live
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            {live ? (
              <>
                <PhoneOff className="size-4" /> End session
              </>
            ) : connecting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Connecting…
              </>
            ) : (
              <>
                <Mic className="size-4" /> Start voice session
              </>
            )}
          </button>
        </div>

        {/* Text fallback while live */}
        {live && (
          <div className="flex w-full max-w-[560px] items-center gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  submitText();
                }
              }}
              placeholder="Or type a message…"
              className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={submitText}
              disabled={!text.trim()}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="size-4" />
            </button>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
