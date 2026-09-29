import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import type { Scores, ScoreResult } from "./scoring";
import { computeScore } from "./scoring";
import type { Tier } from "./points";
import { type PhilosophyKey, resolvePhilosophy, DEFAULT_PHILOSOPHY } from "./philosophy";

export interface Snapshot {
  id: string;
  ts: number;
  final: number;
  raw: number;
  zone: ScoreResult["zone"];
  label?: string;
}

export interface ChiefAim {
  text: string;
  specificity: string;
  believability: number; // 1..10
  disgust: string;
  handwriting: string;
}

/** Per-point evidence note ("why this tier?") — improves self-honesty and
 * seeds intervention analytics. */
export type EvidenceNotes = Record<number, string>;

interface DiagnosticState {
  scores: Scores;
  evidenceNotes: EvidenceNotes;
  chiefAim: ChiefAim;
  snapshots: Snapshot[];
  philosophy: PhilosophyKey;
  /** Private Mode (default ON) — when true, all cloud sync & CRM pushes are disabled. */
  privateMode: boolean;
  /** Whether the user has completed the first-run onboarding flow. */
  onboarded: boolean;
  setScore: (id: number, tier: Tier) => void;
  setScores: (s: Scores) => void;
  setEvidenceNote: (id: number, note: string) => void;
  setChiefAim: (a: Partial<ChiefAim>) => void;
  setPhilosophy: (p: PhilosophyKey) => void;
  addSnapshot: (label?: string) => void;
  removeSnapshot: (id: string) => void;
  setPrivateMode: (v: boolean) => void;
  setOnboarded: (v: boolean) => void;
  resetAll: () => void;
  result: ScoreResult;
}

const DEFAULT_AIM: ChiefAim = {
  text: "",
  specificity: "",
  believability: 6,
  disgust: "",
  handwriting: "",
};

const DiagnosticContext = createContext<DiagnosticState | null>(null);

const LS_KEY = "creation-algorithm-state-v1";

interface PersistShape {
  scores: Scores;
  evidenceNotes: EvidenceNotes;
  chiefAim: ChiefAim;
  snapshots: Snapshot[];
  philosophy: PhilosophyKey;
  privateMode: boolean;
  onboarded: boolean;
}

function load(): PersistShape {
  const base: PersistShape = {
    scores: {},
    evidenceNotes: {},
    chiefAim: DEFAULT_AIM,
    snapshots: [],
    philosophy: DEFAULT_PHILOSOPHY,
    privateMode: true,
    onboarded: false,
  };
  if (typeof window === "undefined") return base;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<PersistShape>;
    return {
      scores: parsed.scores ?? {},
      evidenceNotes: parsed.evidenceNotes ?? {},
      chiefAim: { ...DEFAULT_AIM, ...parsed.chiefAim },
      snapshots: parsed.snapshots ?? [],
      philosophy: resolvePhilosophy(parsed.philosophy),
      privateMode: parsed.privateMode ?? true,
      onboarded: parsed.onboarded ?? false,
    };
  } catch {
    return base;
  }
}

export function DiagnosticProvider({ children }: { children: ReactNode }) {
  const [scores, setScoresState] = useState<Scores>({});
  const [evidenceNotes, setEvidenceNotesState] = useState<EvidenceNotes>({});
  const [chiefAim, setChiefAimState] = useState<ChiefAim>(DEFAULT_AIM);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [philosophy, setPhilosophyState] = useState<PhilosophyKey>(DEFAULT_PHILOSOPHY);
  const [privateMode, setPrivateModeState] = useState(true);
  const [onboarded, setOnboardedState] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const data = load();
    setScoresState(data.scores);
    setEvidenceNotesState(data.evidenceNotes);
    setChiefAimState(data.chiefAim);
    setSnapshots(data.snapshots);
    setPhilosophyState(data.philosophy);
    setPrivateModeState(data.privateMode);
    setOnboardedState(data.onboarded);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload: PersistShape = {
      scores,
      evidenceNotes,
      chiefAim,
      snapshots,
      philosophy,
      privateMode,
      onboarded,
    };
    try {
      window.localStorage.setItem(LS_KEY, JSON.stringify(payload));
    } catch {
      /* ignore quota */
    }
  }, [scores, evidenceNotes, chiefAim, snapshots, philosophy, privateMode, onboarded, hydrated]);

  const setScore = useCallback((id: number, tier: Tier) => {
    setScoresState((prev) => ({ ...prev, [id]: tier }));
  }, []);

  const setScores = useCallback((s: Scores) => setScoresState(s), []);

  const setEvidenceNote = useCallback((id: number, note: string) => {
    setEvidenceNotesState((prev) => ({ ...prev, [id]: note }));
  }, []);

  const setChiefAim = useCallback((a: Partial<ChiefAim>) => {
    setChiefAimState((prev) => ({ ...prev, ...a }));
  }, []);

  const addSnapshot = useCallback(
    (label?: string) => {
      const res = computeScore(scores);
      const snap: Snapshot = {
        id: `snap_${Date.now()}`,
        ts: Date.now(),
        final: res.finalRounded,
        raw: Math.round(res.raw),
        zone: res.zone,
        label,
      };
      setSnapshots((prev) => [...prev, snap]);
    },
    [scores],
  );

  const removeSnapshot = useCallback((id: string) => {
    setSnapshots((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const setPrivateMode = useCallback((v: boolean) => setPrivateModeState(v), []);
  const setOnboarded = useCallback((v: boolean) => setOnboardedState(v), []);

  const setPhilosophy = useCallback((p: PhilosophyKey) => setPhilosophyState(p), []);

  const resetAll = useCallback(() => {
    setScoresState({});
    setEvidenceNotesState({});
    setChiefAimState(DEFAULT_AIM);
    setSnapshots([]);
  }, []);

  const result = computeScore(scores);

  return (
    <DiagnosticContext.Provider
      value={{
        scores,
        evidenceNotes,
        chiefAim,
        snapshots,
        philosophy,
        privateMode,
        onboarded,
        setScore,
        setScores,
        setEvidenceNote,
        setChiefAim,
        setPhilosophy,
        addSnapshot,
        removeSnapshot,
        setPrivateMode,
        setOnboarded,
        resetAll,
        result,
      }}
    >
      {children}
    </DiagnosticContext.Provider>
  );
}

export function useDiagnostic() {
  const ctx = useContext(DiagnosticContext);
  if (!ctx) throw new Error("useDiagnostic must be used within DiagnosticProvider");
  return ctx;
}
