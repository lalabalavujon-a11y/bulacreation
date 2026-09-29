import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect, useCallback } from "react";
import { ClientOnly } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useDiagnostic } from "@/lib/diagnostic/context";
import { buildCoachContext, formatContextBlock } from "@/lib/diagnostic/coach-context";
import { PERSONA_META, type PersonaKey } from "@/lib/diagnostic/personas";
import { PHILOSOPHIES } from "@/lib/diagnostic/philosophy";
import { askCoach } from "@/lib/diagnostic/coach.functions";
import { VoiceCoach } from "@/components/diagnostic/voice-coach";
import { PaywallGate } from "@/components/diagnostic/paywall";
import { useSubscription } from "@/lib/diagnostic/subscription-context";
import {
  buildDailyProtocol,
  forecast,
  parseAssignment,
  loadCommitments,
  saveCommitments,
  markDone,
  removeCommitment,
  commitmentsDigest,
  type Commitment,
} from "@/lib/diagnostic/protocol";
import {
  recordIntervention,
  settleInterventions,
  loadInterventions,
  effectivenessDigest,
} from "@/lib/diagnostic/interventions";
import { buildTwin, twinDigest } from "@/lib/diagnostic/twin";
import { cn } from "@/lib/utils";
import {
  Send,
  Sparkles,
  AlertCircle,
  MessageSquare,
  Radio,
  Target,
  CheckCircle2,
  Clock,
  X,
  TrendingUp,
  Flame,
} from "lucide-react";

export const Route = createFileRoute("/coach")({
  head: () => ({
    meta: [
      { title: "AI Coach — 40-Point Creation Algorithm" },
      {
        name: "description",
        content:
          "Context-aware AI mentor with text + realtime WebRTC voice. Personas: Brotherhood Master, Mystical Assumption (Neville), Cybernetics Engineer (Maltz).",
      },
      { property: "og:title", content: "AI Coach — 40-Point Creation Algorithm" },
      {
        property: "og:description",
        content:
          "Context-aware AI mentor with realtime voice. Brotherhood, Neville, and Maltz personas.",
      },
    ],
  }),
  component: CoachComponent,
});

interface Msg {
  role: "user" | "assistant";
  content: string;
}

function CoachComponent() {
  const { result, chiefAim, philosophy, evidenceNotes, snapshots } = useDiagnostic();
  const { entitlements, consumeAiMessage, aiMessagesRemaining } = useSubscription();
  const ask = useServerFn(askCoach);
  const [mode, setMode] = useState<"text" | "voice">("text");
  const [persona, setPersona] = useState<PersonaKey>(
    PHILOSOPHIES[philosophy]?.defaultPersona ?? "maltz",
  );
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const protocol = buildDailyProtocol(result);
  const aiCap = entitlements.limits.aiMessagesPerDay;
  const aiBlocked = aiCap === 0;

  useEffect(() => {
    setCommitments(loadCommitments());
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading]);

  const completeAssignment = useCallback(
    (id: string) => {
      setCommitments((prev) => {
        const next = markDone(id, prev);
        // Settle the intervention tied to this commitment — attribute ΔVoltage.
        settleInterventions(result.finalRounded, [id], { [id]: "done" });
        return next;
      });
    },
    [result.finalRounded],
  );

  const removeCmt = useCallback((id: string) => {
    setCommitments((prev) => removeCommitment(id, prev));
  }, []);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    if (aiBlocked) {
      setError("Your plan doesn't include AI Mentor messages. Upgrade to unlock.");
      return;
    }
    if (!consumeAiMessage()) {
      setError(
        `Daily AI message limit reached (${aiCap}/day). You're on the Free plan — upgrade for unlimited.`,
      );
      return;
    }
    setInput("");
    setError(null);
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setLoading(true);
    try {
      const digest = commitmentsDigest(commitments);
      const effDigest = effectivenessDigest(loadInterventions());
      const twin = buildTwin(
        result,
        chiefAim,
        snapshots,
        commitments,
        loadInterventions(),
        philosophy,
      );
      const tDigest = twinDigest(twin);
      const ctx = buildCoachContext(
        result,
        chiefAim,
        digest,
        philosophy,
        evidenceNotes,
        effDigest,
        tDigest,
      );
      const res = await ask({
        persona,
        messages: next.map((m) => ({ role: m.role, content: m.content })),
        context: formatContextBlock(ctx),
      });
      if (res.ok) {
        setMessages([...next, { role: "assistant", content: res.content }]);
        // Parse a structured ASSIGNMENT: line into a tracked 48-hr commitment.
        const { commitment } = parseAssignment(res.content, persona);
        if (commitment) {
          // Record the intervention so we can learn whether it worked.
          recordIntervention({
            commitmentId: commitment.id,
            label: commitment.text,
            source: persona,
            pointId: commitment.pointId,
            voltageAtPrescription: result.finalRounded,
          });
          setCommitments((prev) => {
            const nextList = [commitment, ...prev];
            saveCommitments(nextList);
            return nextList;
          });
        }
      } else {
        setError(res.error);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  const openCmts = commitments.filter((c) => c.status === "open");

  return (
    <div className="space-y-6">
      <header>
        <span className="text-[11px] uppercase tracking-[0.3em] text-gold-soft">Module 05</span>
        <h1 className="mt-1 font-display text-3xl font-bold tracking-tight md:text-4xl">
          AI Mentor
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Context-aware coaching. Your live score, teachability, top bottlenecks, chief aim, and
          open commitments are injected automatically. The mentor issues 48-hour assignments; the
          app tracks them and feeds completion back into the next session — closing the loop.
        </p>
      </header>

      {/* ── Daily protocol panel ─────────────────────────────────────────── */}
      {protocol && (
        <section className="panel p-5">
          <div className="flex items-center gap-2">
            <Flame className="size-4 text-gold" />
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider">
              Today's High-Leverage Protocol
            </h2>
          </div>
          <p className="mt-3 text-sm text-foreground">{protocol.headline}</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Bottleneck
              </div>
              <div className="mt-1 text-sm font-medium text-foreground">
                #{protocol.bottleneck.id} · {protocol.bottleneck.name}
              </div>
              <div className="text-xs text-muted-foreground">{protocol.bottleneck.pillar}</div>
              <div className="mt-1 text-[11px] tabular-nums text-gold-soft">
                deficit {protocol.bottleneck.deficit} · leverage {protocol.bottleneck.leverage}
              </div>
            </div>
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Action
              </div>
              <div className="mt-1 text-sm text-foreground">{protocol.action}</div>
            </div>
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Checkpoint
              </div>
              <div className="mt-1 text-xs text-foreground">{protocol.checkpoint}</div>
            </div>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">{protocol.rationale}</p>
        </section>
      )}

      {/* ── Commitment tracker ──────────────────────────────────────────── */}
      <section className="panel p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="size-4 text-gold" />
            <h2 className="font-display text-sm font-semibold uppercase tracking-wider">
              48-Hour Assignments
            </h2>
          </div>
          {openCmts.length > 0 && (
            <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-xs font-medium text-gold">
              {openCmts.length} open
            </span>
          )}
        </div>
        {commitments.length === 0 ? (
          <p className="mt-3 text-xs text-muted-foreground">
            No assignments yet. Ask your mentor for one — any reply containing an{" "}
            <code className="rounded bg-muted px-1 text-gold">ASSIGNMENT:</code> line is
            auto-tracked here for 48 hours.
          </p>
        ) : (
          <div className="mt-3 space-y-2">
            {commitments.map((c) => {
              const overdue = c.status === "open" && Date.now() > c.dueTs;
              const hrsLeft = Math.max(0, Math.round((c.dueTs - Date.now()) / 3.6e6));
              return (
                <div
                  key={c.id}
                  className={cn(
                    "flex items-center gap-3 rounded-md border p-3",
                    c.status === "done"
                      ? "border-gold/30 bg-gold/5"
                      : overdue
                        ? "border-destructive/40 bg-destructive/10"
                        : "border-border bg-muted/30",
                  )}
                >
                  <button
                    onClick={() => completeAssignment(c.id)}
                    disabled={c.status === "done"}
                    className={cn(
                      "inline-flex size-7 shrink-0 items-center justify-center rounded-md border transition-colors",
                      c.status === "done"
                        ? "border-gold/40 bg-gold/20 text-gold"
                        : "border-border text-muted-foreground hover:border-gold/40 hover:text-gold",
                    )}
                    aria-label="Mark assignment complete"
                  >
                    <CheckCircle2 className="size-4" />
                  </button>
                  <div className="min-w-0 flex-1">
                    <div
                      className={cn(
                        "truncate text-sm",
                        c.status === "done" && "text-muted-foreground line-through",
                      )}
                    >
                      {c.text}
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="size-3" />
                        {c.status === "done"
                          ? `done ${c.completedTs ? new Date(c.completedTs).toLocaleDateString() : ""}`
                          : overdue
                            ? "overdue"
                            : `${hrsLeft}h left`}
                      </span>
                      <span className="text-gold-soft">· {c.persona}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => removeCmt(c.id)}
                    className="rounded-md p-1 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                    aria-label="Remove assignment"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex rounded-md border border-border p-0.5">
          {(["text", "voice"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors",
                mode === m ? "bg-gold/15 text-gold" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m === "text" ? (
                <MessageSquare className="size-3.5" />
              ) : (
                <Radio className="size-3.5" />
              )}
              {m === "text" ? "Text" : "Voice"}
            </button>
          ))}
        </div>
        <div className="h-5 w-px bg-border" />
        {PERSONA_META.map((p) => (
          <button
            key={p.id}
            onClick={() => setPersona(p.id)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
              persona === p.id
                ? "border-gold/50 bg-gold/10 text-gold"
                : "border-border text-muted-foreground hover:text-foreground",
            )}
          >
            {p.name}
          </button>
        ))}
      </div>

      {mode === "voice" ? (
        <PaywallGate
          feature="voiceCoach"
          title="Voice Coaching"
          description="Realtime bidirectional voice mentoring over WebRTC is part of Creation Performance."
        >
          <ClientOnly fallback={<div className="panel h-[60vh] min-h-[420px]" />}>
            <VoiceCoach persona={persona} />
          </ClientOnly>
        </PaywallGate>
      ) : (
        <div className="panel flex h-[60vh] min-h-[420px] flex-col">
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-5">
            {messages.length === 0 && (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <Sparkles className="size-8 text-gold" />
                <p className="mt-3 max-w-sm text-sm text-muted-foreground">
                  Ask your mentor anything. Current context:{" "}
                  <span className="text-gold">{result.finalRounded.toLocaleString()}</span> pts ·{" "}
                  {result.bottlenecks.length} bottlenecks · aim {chiefAim.text ? "set" : "unset"} ·{" "}
                  {openCmts.length} open assignments. Ask for an{" "}
                  <code className="rounded bg-muted px-1 text-gold">ASSIGNMENT</code> to start a
                  tracked 48-hour commitment.
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-4 py-2.5 text-sm",
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground",
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="rounded-lg bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                  <span className="inline-flex gap-1">
                    <span className="size-1.5 animate-bounce rounded-full bg-gold [animation-delay:-0.3s]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-gold [animation-delay:-0.15s]" />
                    <span className="size-1.5 animate-bounce rounded-full bg-gold" />
                  </span>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 border-t border-border px-4 py-2 text-xs text-destructive">
              <AlertCircle className="size-3.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex items-center gap-2 border-t border-border p-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder={
                aiBlocked
                  ? "AI Mentor locked — upgrade to send messages."
                  : "Message your mentor..."
              }
              className="flex-1 resize-none rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            <button
              onClick={send}
              disabled={loading || !input.trim() || aiBlocked}
              className="inline-flex size-9 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              <Send className="size-4" />
            </button>
          </div>
          {aiCap >= 0 && !aiBlocked && (
            <div className="border-t border-border px-4 py-1.5 text-[10px] text-muted-foreground">
              {aiMessagesRemaining} AI message{aiMessagesRemaining === 1 ? "" : "s"} left today ·{" "}
              <a href="/pricing" className="text-gold hover:underline">
                upgrade for unlimited
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
