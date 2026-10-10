import { accountStorage } from "@/lib/diagnostic/local-storage";
// Coach OS — multi-client roster for professional coaches (spec §12).
//
// A coach manages N clients. Each client is a named "roster slot" pointing at
// a persisted profile (scores, aim, snapshots, commitments, interventions).
// The coach dashboard aggregates every slot into one view:
//   • per-client Creation Voltage + zone + trend arrow
//   • top recurring constraint across the book
//   • assignments overdue count
//   • clients requiring intervention (retention signals)
//
// Storage model (localStorage):
//   creation-coach-roster        → ClientSlot[] (id, name, email, notes, tag)
//   creation-coach-profiles      → Record<slotId, ClientProfile>
//
// A ClientProfile is a serialised snapshot of the per-client state. Coaches
// can import a client's live state into their own audit/score by switching
// the active slot. For V1 we keep the coach view read-only + aggregation;
// the underlying DiagnosticProvider drives the active client.

import type { Scores } from "./scoring";
import type { Snapshot, ChiefAim } from "./context";
import type { Commitment } from "./protocol";
import type { Intervention } from "./interventions";
import { computeScore, zoneMeta } from "./scoring";
import { retentionSignals } from "./protocol";
import { effectiveness } from "./interventions";

const ROSTER_KEY = "creation-coach-roster-v1";
const PROFILES_KEY = "creation-coach-profiles-v1";

export interface ClientSlot {
  id: string;
  name: string;
  email?: string;
  notes?: string;
  tag?: string; // e.g. "priority", "at-risk"
  createdAt: number;
}

export interface ClientProfile {
  slotId: string;
  scores: Scores;
  chiefAim: ChiefAim;
  snapshots: Snapshot[];
  commitments: Commitment[];
  interventions: Intervention[];
  lastSyncedAt: number;
}

// ── Roster CRUD ────────────────────────────────────────────────────────────

export function loadRoster(): ClientSlot[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = accountStorage.getItem(ROSTER_KEY);
    return raw ? (JSON.parse(raw) as ClientSlot[]) : [];
  } catch {
    return [];
  }
}

export function saveRoster(list: ClientSlot[]): void {
  if (typeof window === "undefined") return;
  try {
    accountStorage.setItem(ROSTER_KEY, JSON.stringify(list));
  } catch {
    /* ignore */
  }
}

export function addClient(name: string, email?: string): ClientSlot {
  const list = loadRoster();
  const slot: ClientSlot = {
    id: `client_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    name: name.trim(),
    email: email?.trim() || undefined,
    createdAt: Date.now(),
  };
  saveRoster([slot, ...list]);
  return slot;
}

export function updateClient(
  id: string,
  patch: Partial<Omit<ClientSlot, "id" | "createdAt">>,
): ClientSlot[] {
  const list = loadRoster().map((s) => (s.id === id ? { ...s, ...patch } : s));
  saveRoster(list);
  return list;
}

export function removeClient(id: string): ClientSlot[] {
  const list = loadRoster().filter((s) => s.id !== id);
  saveRoster(list);
  // also drop the profile
  const profiles = loadAllProfiles();
  delete profiles[id];
  saveAllProfiles(profiles);
  return list;
}

// ── Profiles ───────────────────────────────────────────────────────────────

export function loadAllProfiles(): Record<string, ClientProfile> {
  if (typeof window === "undefined") return {};
  try {
    const raw = accountStorage.getItem(PROFILES_KEY);
    return raw ? (JSON.parse(raw) as Record<string, ClientProfile>) : {};
  } catch {
    return {};
  }
}

export function saveAllProfiles(map: Record<string, ClientProfile>): void {
  if (typeof window === "undefined") return;
  try {
    accountStorage.setItem(PROFILES_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

/** Persist the current in-app state into a given client slot. */
export function syncProfile(
  slotId: string,
  profile: Omit<ClientProfile, "slotId" | "lastSyncedAt">,
): void {
  const all = loadAllProfiles();
  all[slotId] = { ...profile, slotId, lastSyncedAt: Date.now() };
  saveAllProfiles(all);
}

export function loadProfile(slotId: string): ClientProfile | null {
  return loadAllProfiles()[slotId] ?? null;
}

// ── Aggregation — the coach dashboard view ─────────────────────────────────

export interface ClientSummary {
  slot: ClientSlot;
  voltage: number;
  zone: string;
  zoneLabel: string;
  /** trend arrow: +1 up, 0 flat, -1 down */
  trend: 1 | 0 | -1;
  openAssignments: number;
  overdueAssignments: number;
  completionRate: number;
  risk: "none" | "watch" | "intervene";
  topConstraint: string | null;
  lastVoltage: number | null;
  peakVoltage: number | null;
  needsIntervention: boolean;
}

export interface RosterSummary {
  clients: ClientSummary[];
  totalClients: number;
  averageVoltage: number;
  activeCount: number; // clients in operative zone
  atRiskCount: number; // clients requiring intervention
  overdueCount: number; // total overdue assignments across book
  topRecurringConstraint: string | null;
}

export function summariseRoster(): RosterSummary {
  const roster = loadRoster();
  const profiles = loadAllProfiles();

  const clients: ClientSummary[] = roster.map((slot) => {
    const p = profiles[slot.id];
    if (!p) {
      return {
        slot,
        voltage: 0,
        zone: "friction",
        zoneLabel: "No data",
        trend: 0,
        openAssignments: 0,
        overdueAssignments: 0,
        completionRate: 0,
        risk: "none" as const,
        topConstraint: null,
        lastVoltage: null,
        peakVoltage: null,
        needsIntervention: false,
      };
    }

    const result = computeScore(p.scores);
    const ret = retentionSignals(p.snapshots, p.commitments);
    const eff = effectiveness(p.interventions);

    // trend: compare last two snapshots
    let trend: 1 | 0 | -1 = 0;
    if (p.snapshots.length >= 2) {
      const a = p.snapshots[p.snapshots.length - 2].final;
      const b = p.snapshots[p.snapshots.length - 1].final;
      trend = b > a ? 1 : b < a ? -1 : 0;
    }

    const open = p.commitments.filter((c) => c.status === "open");
    const overdue = open.filter((c) => Date.now() > c.dueTs);
    const done = p.commitments.filter((c) => c.status === "done");
    const completionRate = p.commitments.length > 0 ? done.length / p.commitments.length : 0;

    const peak = p.snapshots.reduce((m, s) => Math.max(m, s.final), 0);

    // top constraint from the latest score bottlenecks
    const topConstraint = result.bottlenecks[0]?.point.name ?? null;

    return {
      slot,
      voltage: result.finalRounded,
      zone: result.zone,
      zoneLabel: zoneMeta(result.zone).label,
      trend,
      openAssignments: open.length,
      overdueAssignments: overdue.length,
      completionRate,
      risk: ret.risk,
      topConstraint,
      lastVoltage: p.snapshots.length ? p.snapshots[p.snapshots.length - 1].final : null,
      peakVoltage: peak || null,
      needsIntervention:
        ret.risk === "intervene" || overdue.length > 0 || result.finalRounded < 4000,
    };
  });

  // Aggregate top recurring constraint across the book
  const constraintCounts = new Map<string, number>();
  for (const c of clients) {
    if (c.topConstraint) {
      constraintCounts.set(c.topConstraint, (constraintCounts.get(c.topConstraint) ?? 0) + 1);
    }
  }
  const topRecurring =
    Array.from(constraintCounts.entries()).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const totalClients = clients.length;
  const averageVoltage =
    totalClients > 0 ? Math.round(clients.reduce((s, c) => s + c.voltage, 0) / totalClients) : 0;
  const activeCount = clients.filter((c) => c.zone === "operative").length;
  const atRiskCount = clients.filter((c) => c.needsIntervention).length;
  const overdueCount = clients.reduce((s, c) => s + c.overdueAssignments, 0);

  return {
    clients,
    totalClients,
    averageVoltage,
    activeCount,
    atRiskCount,
    overdueCount,
    topRecurringConstraint: topRecurring,
  };
}

// ── Seed demo data for the empty state (so the dashboard isn't blank) ──────

export function seedDemoRoster(): void {
  if (typeof window === "undefined") return;
  if (loadRoster().length > 0) return;
  const demo = [
    { name: "Jordan Avery", tag: "priority" },
    { name: "Sam Reyes", tag: "at-risk" },
    { name: "Case Morgan", tag: "" },
  ];
  const slots: ClientSlot[] = demo.map((d) => ({
    id: `client_demo_${d.name.replace(/\s/g, "").toLowerCase()}`,
    name: d.name,
    tag: d.tag,
    createdAt: Date.now(),
  }));
  saveRoster(slots);

  // Give each demo client a plausible profile
  const profiles: Record<string, ClientProfile> = {};
  const voltages = [7110, 3870, 5420];
  for (let i = 0; i < slots.length; i++) {
    const s = slots[i];
    const v = voltages[i];
    const zone = v >= 6000 ? "operative" : v >= 4000 ? "emergence" : "friction";
    profiles[s.id] = {
      slotId: s.id,
      scores: {},
      chiefAim: {
        text: `Q4 target ${i + 1}`,
        specificity: "",
        believability: 7,
        disgust: "",
        handwriting: "",
      },
      snapshots: [
        { id: "s1", ts: Date.now() - 21 * 864e5, final: v - 800, raw: 0, zone },
        { id: "s2", ts: Date.now() - 14 * 864e5, final: v - 400, raw: 0, zone },
        { id: "s3", ts: Date.now() - 7 * 864e5, final: v, raw: 0, zone },
      ],
      commitments: [],
      interventions: [],
      lastSyncedAt: Date.now(),
    };
  }
  saveAllProfiles(profiles);
}
