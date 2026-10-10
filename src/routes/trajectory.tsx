import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useDiagnostic } from "@/lib/diagnostic/context";
import { useAuth } from "@/lib/diagnostic/auth-context";
import { KpiCard } from "@/components/diagnostic/charts";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Camera,
  CloudUpload,
  Loader2,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from "lucide-react";
import {
  forecast,
  trajectoryMetrics,
  loadCommitments,
  type Commitment,
} from "@/lib/diagnostic/protocol";
import {
  loadInterventions,
  effectiveness,
  constraintRecurrence,
  settleOnSnapshot,
} from "@/lib/diagnostic/interventions";
import { POINTS } from "@/lib/diagnostic/points";

export const Route = createFileRoute("/trajectory")({
  head: () => ({
    meta: [
      { title: "Trajectory — Creation Algorithm" },
      {
        name: "description",
        content:
          "Longitudinal Creation Voltage trajectory across audit snapshots. Log milestones, forecast zone crossings, and track intervention effectiveness.",
      },
      { property: "og:title", content: "Trajectory — Creation Algorithm" },
      {
        property: "og:description",
        content: "Longitudinal score trajectory, forecasting, and intervention analytics.",
      },
    ],
  }),
  component: TrajectoryComponent,
});

function TrajectoryComponent() {
  const { result, snapshots, addSnapshot, removeSnapshot, privateMode } = useDiagnostic();
  const { contactId } = useAuth();
  const snaps = snapshots;
  const [cloudBusy, setCloudBusy] = useState(false);
  const [cloudMsg, setCloudMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [commitments, setCommitments] = useState<Commitment[]>([]);
  const [interventions, setInterventions] = useState(() => loadInterventions());

  useEffect(() => {
    setCommitments(loadCommitments());
    setInterventions(loadInterventions());
  }, []);

  const metrics = trajectoryMetrics(snaps, commitments);
  const eff = effectiveness(interventions);
  const recurrence = constraintRecurrence(interventions);

  async function logAndPersist() {
    addSnapshot();
    // Settle pending interventions against the new snapshot voltage (Learn loop).
    const settled = settleOnSnapshot({
      id: `snap_${Date.now()}`,
      ts: Date.now(),
      final: result.finalRounded,
      raw: Math.round(result.raw),
      zone: result.zone,
    });
    setInterventions(settled);
    // Private Mode: keep the snapshot local only, skip cloud persist.
    if (privateMode) {
      setCloudMsg({
        ok: true,
        text: "Snapshot logged locally. Private Mode is ON — cloud persist skipped.",
      });
      return;
    }
    setCloudMsg({ ok: true, text: "Snapshot logged on this device. Use Save progress to account on Overview to include it in your cloud copy." });
  }

  const peak = snaps.reduce((m, s) => Math.max(m, s.final), 0);
  const delta = snaps.length >= 2 ? snaps[snaps.length - 1].final - snaps[0].final : 0;

  // chart geometry
  const W = 760;
  const H = 280;
  const pad = { l: 44, r: 16, t: 20, b: 32 };
  const innerW = W - pad.l - pad.r;
  const innerH = H - pad.t - pad.b;
  const maxY = 10000;
  const x = (i: number) =>
    pad.l + (snaps.length <= 1 ? innerW / 2 : (i / (snaps.length - 1)) * innerW);
  const y = (v: number) => pad.t + innerH - (v / maxY) * innerH;

  const linePath =
    snaps.length > 0
      ? snaps.map((s, i) => `${i === 0 ? "M" : "L"} ${x(i)} ${y(s.final)}`).join(" ")
      : "";
  const areaPath =
    snaps.length > 0
      ? `${linePath} L ${x(snaps.length - 1)} ${pad.t + innerH} L ${x(0)} ${pad.t + innerH} Z`
      : "";

  const gridLines = [0, 2000, 4000, 6000, 8000, 10000];

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold-soft">Module 04</span>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Growth Trajectory
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            Longitudinal voltage across audit snapshots. Log a milestone to capture the current
            state{privateMode ? " (local only — Private Mode ON)" : " and persist to cloud"}.
          </p>
        </div>
        <Button onClick={logAndPersist} disabled={cloudBusy} className="gap-2">
          {cloudBusy ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
          Log Snapshot
        </Button>
      </header>

      {cloudMsg && (
        <div
          className={
            "flex items-start gap-2 rounded-md px-3 py-2 text-xs " +
            (cloudMsg.ok
              ? "border border-gold/30 bg-gold/5 text-gold"
              : "border border-destructive/30 bg-destructive/10 text-destructive")
          }
        >
          {cloudMsg.ok ? (
            <CheckCircle2 className="mt-0.5 size-3.5 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
          )}
          <span>{cloudMsg.text}</span>
        </div>
      )}

      <section className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <KpiCard label="Current Voltage" value={result.finalRounded.toLocaleString()} accent />
        <KpiCard label="Peak Voltage" value={peak ? peak.toLocaleString() : "—"} />
        <KpiCard
          label="Net Δ"
          value={delta ? `${delta > 0 ? "+" : ""}${delta}` : "—"}
          sub="First → last"
        />
        <KpiCard label="Milestones" value={`${snaps.length}`} />
      </section>

      {/* ── Trajectory forecast ─────────────────────────────────────────── */}
      <section className="panel p-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-gold" />
          <h2 className="font-display text-lg font-semibold">Trajectory Forecast</h2>
        </div>
        {(() => {
          const fc = forecast(snaps);
          return (
            <>
              <p className="mt-3 text-sm text-foreground">{fc.message}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-md border border-border bg-muted/30 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Current
                  </div>
                  <div className="mt-1 font-display text-lg font-bold tabular-nums text-gold">
                    {fc.current.toLocaleString()}
                  </div>
                </div>
                <div className="rounded-md border border-border bg-muted/30 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Slope
                  </div>
                  <div className="mt-1 font-display text-lg font-bold tabular-nums">
                    {fc.slope > 0 ? "+" : ""}
                    {Math.round(fc.slope)}
                  </div>
                  <div className="text-[10px] text-muted-foreground">pts/snapshot</div>
                </div>
                <div className="rounded-md border border-border bg-muted/30 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    → Emergence
                  </div>
                  <div className="mt-1 font-display text-lg font-bold tabular-nums">
                    {fc.toEmergence === null ? "—" : `~${fc.toEmergence}d`}
                  </div>
                </div>
                <div className="rounded-md border border-gold/30 bg-gold/5 p-3">
                  <div className="text-[10px] uppercase tracking-wider text-gold-soft">
                    → Operative
                  </div>
                  <div className="mt-1 font-display text-lg font-bold tabular-nums text-gold">
                    {fc.toOperative === null ? "—" : `~${fc.toOperative}d`}
                  </div>
                </div>
              </div>
            </>
          );
        })()}
      </section>

      {/* ── Intervention analytics ────────────────────────────────────────── */}
      <section className="panel p-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-gold" />
          <h2 className="font-display text-lg font-semibold">Intervention Analytics</h2>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Longitudinal signals that show whether your interventions are actually producing movement.
          Over time, these reveal what works for you specifically.
        </p>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <div className="rounded-md border border-border bg-muted/30 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Velocity
            </div>
            <div className="mt-1 font-display text-lg font-bold tabular-nums">
              {metrics.velocity > 0 ? "+" : ""}
              {Math.round(metrics.velocity)}
            </div>
            <div className="text-[10px] text-muted-foreground">pts/snapshot</div>
          </div>
          <div className="rounded-md border border-border bg-muted/30 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Momentum
            </div>
            <div className="mt-1 font-display text-lg font-bold tabular-nums">
              {metrics.momentum > 0 ? "+" : ""}
              {Math.round(metrics.momentum)}
            </div>
            <div className="text-[10px] text-muted-foreground">recent vs older</div>
          </div>
          <div className="rounded-md border border-border bg-muted/30 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Completion
            </div>
            <div className="mt-1 font-display text-lg font-bold tabular-nums text-gold">
              {Math.round(metrics.completionRate * 100)}%
            </div>
            <div className="text-[10px] text-muted-foreground">commitments done</div>
          </div>
          <div className="rounded-md border border-border bg-muted/30 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Open</div>
            <div className="mt-1 font-display text-lg font-bold tabular-nums">
              {metrics.openCount}
            </div>
            <div className="text-[10px] text-muted-foreground">assignments</div>
          </div>
          <div
            className={
              "rounded-md border p-3 " +
              (metrics.overdueCount > 0
                ? "border-destructive/40 bg-destructive/10"
                : "border-border bg-muted/30")
            }
          >
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Overdue
            </div>
            <div
              className={
                "mt-1 font-display text-lg font-bold tabular-nums " +
                (metrics.overdueCount > 0 ? "text-destructive" : "")
              }
            >
              {metrics.overdueCount}
            </div>
            <div className="text-[10px] text-muted-foreground">needs attention</div>
          </div>
          <div className="rounded-md border border-border bg-muted/30 p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Consistency
            </div>
            <div className="mt-1 font-display text-lg font-bold tabular-nums">
              {metrics.consistency}
            </div>
            <div className="text-[10px] text-muted-foreground">snapshots logged</div>
          </div>
        </div>
        {metrics.completionRate < 0.3 && commitments.length > 0 && (
          <div className="mt-3 rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            Commitment completion is below 30% — interventions aren't converting into action.
            Re-anchor on a single, smaller 48-hour assignment.
          </div>
        )}
        {metrics.velocity <= 0 && snaps.length >= 3 && (
          <div className="mt-3 rounded-md border border-gold/30 bg-gold/5 px-3 py-2 text-xs text-gold">
            Velocity is flat or declining over 3+ snapshots. The current intervention type isn't
            producing movement — switch your leverage target.
          </div>
        )}
      </section>

      {/* ── What Works For You — intervention effectiveness (Learn loop) ────── */}
      <section className="panel p-6">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-gold" />
          <h2 className="font-display text-lg font-semibold">What Works For You</h2>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          The system learns from its own track record. Over time this reveals which interventions
          actually produce movement for you — personalised cybernetic intelligence.
        </p>
        {!eff.ready ? (
          <div className="mt-4 rounded-md border border-border bg-muted/30 px-3 py-3 text-xs text-muted-foreground">
            {eff.settled} settled intervention{eff.settled === 1 ? "" : "s"} so far. Need at least 3
            settled (commitment completed + snapshot logged) before effectiveness is meaningful.
            {eff.pending > 0 && ` ${eff.pending} pending.`}
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-md border border-gold/30 bg-gold/5 p-3">
                <div className="text-[10px] uppercase tracking-wider text-gold-soft">
                  Mean ΔV (done)
                </div>
                <div className="mt-1 font-display text-lg font-bold tabular-nums text-gold">
                  {eff.meanDeltaDone > 0 ? "+" : ""}
                  {Math.round(eff.meanDeltaDone)}
                </div>
                <div className="text-[10px] text-muted-foreground">per completed action</div>
              </div>
              <div className="rounded-md border border-border bg-muted/30 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Mean ΔV (missed)
                </div>
                <div className="mt-1 font-display text-lg font-bold tabular-nums">
                  {eff.meanDeltaMissed > 0 ? "+" : ""}
                  {Math.round(eff.meanDeltaMissed)}
                </div>
                <div className="text-[10px] text-muted-foreground">when you didn't act</div>
              </div>
              <div className="rounded-md border border-border bg-muted/30 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Net Movement
                </div>
                <div className="mt-1 font-display text-lg font-bold tabular-nums">
                  {eff.netMovement > 0 ? "+" : ""}
                  {Math.round(eff.netMovement)}
                </div>
                <div className="text-[10px] text-muted-foreground">attributable to action</div>
              </div>
              <div className="rounded-md border border-border bg-muted/30 p-3">
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Settled
                </div>
                <div className="mt-1 font-display text-lg font-bold tabular-nums">
                  {eff.settled}
                </div>
                <div className="text-[10px] text-muted-foreground">
                  {eff.pending > 0 ? `${eff.pending} pending` : "all settled"}
                </div>
              </div>
            </div>

            {/* Per-source ranking */}
            {eff.bySource.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Intervention effectiveness by source
                </div>
                <div className="mt-2 space-y-1.5">
                  {eff.bySource.map((s) => (
                    <div
                      key={s.source}
                      className="flex items-center gap-3 rounded-md border border-border bg-muted/20 px-3 py-2"
                    >
                      <span className="flex-1 text-xs font-medium capitalize text-foreground">
                        {s.source}
                      </span>
                      <span className="text-[10px] tabular-nums text-muted-foreground">
                        {s.count}×
                      </span>
                      <span
                        className={
                          "font-display text-sm font-bold tabular-nums " +
                          (s.meanDelta > 0 ? "text-gold" : "text-muted-foreground")
                        }
                      >
                        {s.meanDelta > 0 ? "+" : ""}
                        {Math.round(s.meanDelta)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Constraint recurrence */}
            {recurrence.length > 0 && (
              <div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                  Recurring constraints — where you keep getting stuck
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {recurrence.slice(0, 6).map((r) => {
                    const pt = POINTS.find((p) => p.id === r.pointId);
                    return (
                      <span
                        key={r.pointId}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/30 px-3 py-1 text-xs"
                      >
                        <span className="font-medium text-foreground">
                          #{r.pointId} {pt?.name ?? ""}
                        </span>
                        <span className="rounded-full bg-gold/15 px-1.5 text-[10px] font-medium text-gold">
                          {r.count}×
                        </span>
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </section>

      <section className="panel p-6">
        <h2 className="font-display text-lg font-semibold">Voltage Trend</h2>
        <div className="mt-4 overflow-x-auto">
          {snaps.length === 0 ? (
            <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
              No snapshots yet. Log one to begin your trajectory.
            </div>
          ) : (
            <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 480 }}>
              {gridLines.map((g) => (
                <g key={g}>
                  <line
                    x1={pad.l}
                    y1={y(g)}
                    x2={W - pad.r}
                    y2={y(g)}
                    stroke={g === 6000 ? "var(--gold)" : "var(--border)"}
                    strokeWidth={g === 6000 ? 1.5 : 1}
                    strokeDasharray={g === 6000 ? "5 4" : undefined}
                    opacity={g === 6000 ? 0.7 : 0.4}
                  />
                  <text
                    x={pad.l - 8}
                    y={y(g) + 4}
                    textAnchor="end"
                    className="fill-muted-foreground"
                    style={{ fontSize: 10 }}
                  >
                    {g.toLocaleString()}
                  </text>
                </g>
              ))}
              {snaps.length > 1 && <path d={areaPath} fill="var(--gold)" fillOpacity={0.1} />}
              {snaps.length > 1 && (
                <path
                  d={linePath}
                  fill="none"
                  stroke="var(--gold-bright)"
                  strokeWidth={2.5}
                  strokeLinejoin="round"
                />
              )}
              {snaps.map((s, i) => (
                <g key={s.id}>
                  <circle
                    cx={x(i)}
                    cy={y(s.final)}
                    r={4}
                    fill="var(--gold-bright)"
                    stroke="var(--background)"
                    strokeWidth={2}
                  />
                  <text
                    x={x(i)}
                    y={H - 10}
                    textAnchor="middle"
                    className="fill-muted-foreground"
                    style={{ fontSize: 9 }}
                  >
                    {new Date(s.ts).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </text>
                </g>
              ))}
            </svg>
          )}
        </div>
      </section>

      <section className="panel p-6">
        <h2 className="font-display text-lg font-semibold">Milestone Log</h2>
        {snaps.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No milestones logged.</p>
        ) : (
          <div className="mt-4 space-y-2">
            {[...snaps].reverse().map((s) => (
              <div
                key={s.id}
                className="flex items-center gap-4 rounded-md border border-border bg-card p-3"
              >
                <div className="font-display text-xl font-bold tabular-nums text-gold">
                  {s.final.toLocaleString()}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">
                    {s.label || `Snapshot · ${new Date(s.ts).toLocaleString()}`}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Raw {s.raw.toLocaleString()} · {s.zone}
                  </div>
                </div>
                <button
                  onClick={() => removeSnapshot(s.id)}
                  className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                  aria-label="Remove snapshot"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
