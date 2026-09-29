import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import {
  Users,
  TrendingUp,
  AlertTriangle,
  Activity,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus,
  Trash2,
  UserPlus,
  Target,
  Crown,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  loadRoster,
  addClient,
  removeClient,
  summariseRoster,
  loadProfile,
  syncProfile,
  seedDemoRoster,
  type ClientSlot,
  type RosterSummary,
  type ClientSummary,
} from "@/lib/diagnostic/coach-os";
import { useDiagnostic } from "@/lib/diagnostic/context";
import { computeScore, zoneMeta } from "@/lib/diagnostic/scoring";
import { PaywallGate } from "@/components/diagnostic/paywall";

export const Route = createFileRoute("/coach-os")({
  head: () => ({
    meta: [
      { title: "Coach OS — 40-Point Creation Algorithm" },
      {
        name: "description",
        content:
          "Multi-client dashboard for professional coaches. Track every client's Creation Voltage, zone, top constraint, and overdue assignments in one view.",
      },
      { property: "og:title", content: "Coach OS — 40-Point Creation Algorithm" },
      {
        property: "og:description",
        content:
          "A coach operating system: see every client's voltage, zone, and intervention needs at a glance.",
      },
    ],
  }),
  component: CoachOSComponent,
});

function CoachOSComponent() {
  const diag = useDiagnostic();
  const [roster, setRoster] = useState<ClientSlot[]>([]);
  const [summary, setSummary] = useState<RosterSummary | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [activeSlotId, setActiveSlotId] = useState<string | null>(null);

  const refresh = useCallback(() => {
    setRoster(loadRoster());
    setSummary(summariseRoster());
  }, []);

  useEffect(() => {
    setHydrated(true);
    refresh();
    const stored =
      typeof window !== "undefined" ? window.localStorage.getItem("creation-active-slot") : null;
    setActiveSlotId(stored);
  }, [refresh]);

  const handleAdd = () => {
    if (!newName.trim()) return;
    addClient(newName, newEmail);
    setNewName("");
    setNewEmail("");
    setShowAdd(false);
    refresh();
  };

  const handleRemove = (id: string) => {
    removeClient(id);
    refresh();
  };

  const handleSyncActive = (slotId: string) => {
    // Push the current in-app audit state into this client slot.
    syncProfile(slotId, {
      scores: diag.scores,
      chiefAim: diag.chiefAim,
      snapshots: diag.snapshots,
      commitments: [], // would come from protocol store; kept light for V1
      interventions: [],
    });
    refresh();
  };

  const handleSelectActive = (slotId: string) => {
    setActiveSlotId(slotId);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("creation-active-slot", slotId);
    }
  };

  const selectedSummary = summary?.clients.find((c) => c.slot.id === selectedId) ?? null;
  const selectedProfile = selectedId ? loadProfile(selectedId) : null;

  const filtered = summary?.clients.filter((c) =>
    c.slot.name.toLowerCase().includes(query.toLowerCase()),
  );

  if (!hydrated || !summary) {
    return (
      <div className="space-y-6">
        <header>
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold-soft">Module 09</span>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Coach OS
          </h1>
        </header>
        <div className="panel h-64 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <span className="text-[11px] uppercase tracking-[0.3em] text-gold-soft">Module 09</span>
          <h1 className="mt-1 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Coach OS
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            A dashboard for professional coaches. See every client's Creation Voltage, zone, top
            constraint, and overdue assignments in one view. Sync your own audit into a client slot,
            or track their longitudinal trajectory at a glance.
          </p>
        </div>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <UserPlus className="size-4" />
          Add Client
        </button>
      </header>

      <PaywallGate
        feature="coachOs"
        title="Coach OS"
        description="The multi-client dashboard for professional coaches is part of Creation Coach. Track every client's voltage, zone, and intervention needs in one view."
      >
        {showAdd && (
          <section className="panel flex flex-wrap items-end gap-3 p-4">
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Client name
              </label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Jordan Avery"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div className="flex-1">
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Email (optional)
              </label>
              <input
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="jordan@example.com"
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <button
              onClick={handleAdd}
              disabled={!newName.trim()}
              className="inline-flex items-center gap-2 rounded-md bg-gold px-4 py-2 text-sm font-medium text-background transition-colors disabled:opacity-50"
            >
              <Plus className="size-4" /> Add
            </button>
          </section>
        )}

        {/* ── KPI strip ────────────────────────────────────────────────────── */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <KpiCard icon={Users} label="Clients" value={String(summary.totalClients)} />
          <KpiCard
            icon={Activity}
            label="Avg Voltage"
            value={summary.averageVoltage.toLocaleString()}
          />
          <KpiCard
            icon={Crown}
            label="Operative"
            value={String(summary.activeCount)}
            accent="var(--gold-bright)"
          />
          <KpiCard
            icon={AlertTriangle}
            label="Need Intervention"
            value={String(summary.atRiskCount)}
            accent={summary.atRiskCount > 0 ? "var(--destructive)" : undefined}
          />
        </section>

        {summary.totalClients === 0 ? (
          <section className="panel flex flex-col items-center justify-center gap-4 p-12 text-center">
            <Users className="size-10 text-gold-soft" />
            <div>
              <h2 className="font-display text-lg font-semibold">No clients yet</h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Add your first client to start tracking their Creation Voltage, or load demo data to
                see how the dashboard works.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  seedDemoRoster();
                  refresh();
                }}
                className="rounded-md border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
              >
                Load demo roster
              </button>
              <button
                onClick={() => setShowAdd(true)}
                className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
              >
                <UserPlus className="size-4" /> Add a client
              </button>
            </div>
          </section>
        ) : (
          <>
            {summary.topRecurringConstraint && (
              <section className="panel flex items-center gap-3 p-4">
                <Target className="size-5 shrink-0 text-gold" />
                <p className="text-sm text-foreground">
                  <span className="font-semibold">Top recurring constraint across the book:</span>{" "}
                  <span className="text-gold">{summary.topRecurringConstraint}</span>
                  <span className="ml-2 text-muted-foreground">
                    · {summary.overdueCount} assignment{summary.overdueCount === 1 ? "" : "s"}{" "}
                    overdue
                  </span>
                </p>
              </section>
            )}

            {/* ── Client table ───────────────────────────────────────────── */}
            <section className="panel overflow-hidden">
              <div className="flex items-center gap-2 border-b border-border p-3">
                <Search className="size-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search clients…"
                  className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border text-left text-[10px] uppercase tracking-wider text-muted-foreground">
                      <th className="px-4 py-2.5 font-medium">Client</th>
                      <th className="px-4 py-2.5 font-medium">Voltage</th>
                      <th className="px-4 py-2.5 font-medium">Zone</th>
                      <th className="px-4 py-2.5 font-medium">Trend</th>
                      <th className="px-4 py-2.5 font-medium">Open</th>
                      <th className="px-4 py-2.5 font-medium">Risk</th>
                      <th className="px-4 py-2.5 font-medium"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered?.map((c) => (
                      <ClientRow
                        key={c.slot.id}
                        summary={c}
                        active={c.slot.id === activeSlotId}
                        onSelect={() => setSelectedId(c.slot.id)}
                        onSync={() => handleSyncActive(c.slot.id)}
                        onRemove={() => handleRemove(c.slot.id)}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {/* ── Client detail drawer ────────────────────────────────────────── */}
        {selectedSummary && (
          <ClientDetailOverlay
            summary={selectedSummary}
            profile={selectedProfile}
            onClose={() => setSelectedId(null)}
          />
        )}
      </PaywallGate>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof Users;
  label: string;
  value: string;
  accent?: string;
}) {
  return (
    <div className="panel flex items-center gap-3 p-4">
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-md"
        style={{
          backgroundColor: `color-mix(in oklab, ${accent ?? "var(--gold)"} 15%, transparent)`,
        }}
      >
        <Icon className="size-5" style={{ color: accent ?? "var(--gold)" }} />
      </div>
      <div>
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
        <div className="font-display text-xl font-bold tabular-nums text-foreground">{value}</div>
      </div>
    </div>
  );
}

function ClientRow({
  summary: c,
  active,
  onSelect,
  onSetActive,
  onSync,
  onRemove,
}: {
  summary: ClientSummary;
  active: boolean;
  onSelect: () => void;
  onSetActive: () => void;
  onSync: () => void;
  onRemove: () => void;
}) {
  const z = zoneMeta(c.zone);
  return (
    <tr
      onClick={onSelect}
      className="cursor-pointer border-b border-border/50 transition-colors hover:bg-accent/40"
    >
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          {active && <Crown className="size-3.5 text-gold" />}
          <div>
            <div className="font-medium text-foreground">{c.slot.name}</div>
            {c.slot.email && (
              <div className="text-[11px] text-muted-foreground">{c.slot.email}</div>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 tabular-nums font-semibold text-foreground">
        {c.voltage.toLocaleString()}
      </td>
      <td className="px-4 py-3">
        <span
          className="rounded-full px-2.5 py-0.5 text-[11px] font-medium"
          style={{
            color: z.color,
            backgroundColor: `color-mix(in oklab, ${z.color} 12%, transparent)`,
          }}
        >
          {c.zoneLabel}
        </span>
      </td>
      <td className="px-4 py-3">
        {c.trend === 1 ? (
          <span className="inline-flex items-center gap-1 text-emerald-400">
            <ArrowUp className="size-3.5" />
          </span>
        ) : c.trend === -1 ? (
          <span className="inline-flex items-center gap-1 text-destructive">
            <ArrowDown className="size-3.5" />
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Minus className="size-3.5" />
          </span>
        )}
      </td>
      <td className="px-4 py-3 tabular-nums">
        <span className={c.overdueAssignments > 0 ? "text-destructive" : "text-muted-foreground"}>
          {c.openAssignments}
          {c.overdueAssignments > 0 && (
            <span className="ml-1 text-[11px]">({c.overdueAssignments} overdue)</span>
          )}
        </span>
      </td>
      <td className="px-4 py-3">
        {c.risk === "intervene" ? (
          <span className="rounded-full bg-destructive/15 px-2 py-0.5 text-[11px] font-medium text-destructive">
            Intervene
          </span>
        ) : c.risk === "watch" ? (
          <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-400">
            Watch
          </span>
        ) : (
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400">
            Stable
          </span>
        )}
      </td>
      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={onSync}
            title="Sync my current audit into this client"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
          >
            <TrendingUp className="size-3.5" />
          </button>
          <button
            onClick={onRemove}
            title="Remove client"
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
          >
            <Trash2 className="size-3.5" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function ClientDetailOverlay({
  summary: c,
  profile,
  onClose,
}: {
  summary: ClientSummary;
  profile: ReturnType<typeof loadProfile>;
  onClose: () => void;
}) {
  const z = zoneMeta(c.zone);
  const snapshotCount = profile?.snapshots.length ?? 0;
  const completionPct = Math.round(c.completionRate * 100);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-end bg-black/40 p-0 md:items-center md:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-t-xl border border-border bg-background shadow-xl md:rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="font-display text-lg font-bold text-foreground">{c.slot.name}</h2>
            {c.slot.email && <p className="text-xs text-muted-foreground">{c.slot.email}</p>}
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent"
          >
            ✕
          </button>
        </div>
        <div className="space-y-4 p-5">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Creation Voltage
              </div>
              <div className="font-display text-2xl font-bold tabular-nums text-foreground">
                {c.voltage.toLocaleString()}
              </div>
            </div>
            <div className="rounded-md border border-border bg-muted/30 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Zone</div>
              <div className="mt-1 font-semibold" style={{ color: z.color }}>
                {c.zoneLabel}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-md border border-border bg-muted/30 p-2.5">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Snapshots
              </div>
              <div className="font-display text-base font-semibold">{snapshotCount}</div>
            </div>
            <div className="rounded-md border border-border bg-muted/30 p-2.5">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Peak</div>
              <div className="font-display text-base font-semibold tabular-nums">
                {c.peakVoltage?.toLocaleString() ?? "—"}
              </div>
            </div>
            <div className="rounded-md border border-border bg-muted/30 p-2.5">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Completion
              </div>
              <div className="font-display text-base font-semibold tabular-nums">
                {completionPct}%
              </div>
            </div>
          </div>
          {c.topConstraint && (
            <div className="rounded-md border border-gold/30 bg-gold/5 p-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Primary Constraint
              </div>
              <div className="mt-0.5 text-sm font-medium text-gold">{c.topConstraint}</div>
            </div>
          )}
          {c.needsIntervention && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
              This client needs intervention —{" "}
              {c.overdueAssignments > 0
                ? `${c.overdueAssignments} overdue assignment${c.overdueAssignments === 1 ? "" : "s"}`
                : "voltage below Emergence Zone"}
              .
            </div>
          )}
          {c.slot.notes && <p className="text-sm text-muted-foreground">{c.slot.notes}</p>}
        </div>
      </div>
    </div>
  );
}
