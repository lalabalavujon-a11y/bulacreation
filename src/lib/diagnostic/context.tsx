import { accountStorage } from "@/lib/diagnostic/local-storage";
import type { CreationPlan } from "./creation-plan.functions";
import { loadProgress, saveProgress } from "./progress.functions";
import { ProgressSchema, type Progress } from "../security/progress";
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
  label?: string | undefined;
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
  creationPlan: CreationPlan | null;
  setCreationPlan: (plan: CreationPlan | null) => void;
  saveCloud: () => Promise<void>;
  restoreCloud: () => Promise<void>;
  exportProgress: () => void;
  importLegacy: () => void;
  hasLegacy: boolean;
  syncMessage: string;
  syncBusy: boolean;
  dirty: boolean;

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
  creationPlan: CreationPlan | null;
  cloudVersion: number;
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
    creationPlan: null,
    cloudVersion: 0,
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
    const raw = accountStorage.getItem(LS_KEY);
    if (!raw) return base;
    const parsed = JSON.parse(raw) as Partial<PersistShape>;
    return {
      creationPlan: parsed.creationPlan ?? null,
      cloudVersion: parsed.cloudVersion ?? 0,
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
  const [creationPlan, setCreationPlan] = useState<CreationPlan | null>(null);
  const [cloudVersion, setCloudVersion] = useState(0);
  const [syncMessage, setSyncMessage] = useState("");
  const [syncBusy, setSyncBusy] = useState(false);
  const [savedData, setSavedData] = useState("");
  const [hasLegacy, setHasLegacy] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const data = load();
    setCreationPlan(data.creationPlan);
    setCloudVersion(data.cloudVersion);
    try {
      setHasLegacy(Boolean(window.localStorage.getItem(LS_KEY)));
    } catch {
      /* browser storage unavailable */
    }
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
      creationPlan,
      cloudVersion,
      scores,
      evidenceNotes,
      chiefAim,
      snapshots,
      philosophy,
      privateMode,
      onboarded,
    };
    try {
      accountStorage.setItem(LS_KEY, JSON.stringify(payload));
    } catch {
      setSyncMessage(
        "This browser could not save your progress. Export it now to avoid losing changes.",
      );
    }
  }, [
    scores,
    evidenceNotes,
    chiefAim,
    snapshots,
    philosophy,
    privateMode,
    onboarded,
    hydrated,
    creationPlan,
    cloudVersion,
  ]);

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
    setCreationPlan(null);
  }, []);

  const result = computeScore(scores);
  const progress = (): Progress =>
    ProgressSchema.parse({
      scores,
      evidenceNotes,
      chiefAim,
      snapshots,
      philosophy,
      onboarded,
      creationPlan,
    });
  const applyProgress = (p: Progress) => {
    setScoresState(p.scores);
    setEvidenceNotesState(p.evidenceNotes);
    setChiefAimState(p.chiefAim);
    setSnapshots(p.snapshots);
    setPhilosophyState(p.philosophy);
    setOnboardedState(p.onboarded);
    setCreationPlan(p.creationPlan);
  };
  const saveCloud = async () => {
    if (privateMode || syncBusy) return;
    setSyncBusy(true);
    setSyncMessage("");
    try {
      const data = progress();
      const saved = await saveProgress({
        data: { progress: data, version: cloudVersion, privateMode },
      });
      setCloudVersion(saved.version);
      setSavedData(JSON.stringify(data));
      setSyncMessage("Progress saved to your account. You can restore it on another device.");
    } catch (e) {
      setSyncMessage((e as Error).message);
    } finally {
      setSyncBusy(false);
    }
  };
  const restoreCloud = async () => {
    if (privateMode || syncBusy) return;
    if (
      !window.confirm(
        "Restore your account's cloud copy on this device? Export this device's progress first if you want to keep it.",
      )
    )
      return;
    setSyncBusy(true);
    setSyncMessage("");
    try {
      const saved = await loadProgress();
      if (!saved) {
        setSyncMessage("No cloud progress exists yet. Save from your original device first.");
        return;
      }
      applyProgress(saved.data);
      setCloudVersion(saved.version);
      setSavedData(JSON.stringify(saved.data));
      setSyncMessage("Cloud progress restored on this device.");
    } catch (e) {
      setSyncMessage((e as Error).message);
    } finally {
      setSyncBusy(false);
    }
  };
  const exportProgress = () => {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify(progress(), null, 2)], { type: "application/json" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "bula-progress.json";
    link.click();
    URL.revokeObjectURL(url);
  };
  const importLegacy = () => {
    if (
      !window.confirm(
        "Only import if the old progress on this browser belongs to you. It will replace this account's local progress. The original copy is preserved.",
      )
    )
      return;
    try {
      const raw = window.localStorage.getItem(LS_KEY);
      if (!raw) return;
      const old = JSON.parse(raw);
      const parsed = ProgressSchema.parse({
        ...old,
        evidenceNotes: old.evidenceNotes ?? {},
        creationPlan: old.creationPlan ?? null,
      });
      applyProgress(parsed);
      setPrivateModeState(true);
      setSyncMessage(
        "Old browser progress imported locally. Private Mode is on; no data was uploaded.",
      );
    } catch {
      setSyncMessage("Could not import old progress. The original remains untouched.");
    }
  };
  const dirty =
    savedData !==
    JSON.stringify({
      scores,
      evidenceNotes,
      chiefAim,
      snapshots,
      philosophy,
      onboarded,
      creationPlan,
    });

  return (
    <DiagnosticContext.Provider
      value={{
        creationPlan,
        setCreationPlan,
        saveCloud,
        restoreCloud,
        exportProgress,
        importLegacy,
        hasLegacy,
        syncMessage,
        syncBusy,
        dirty,
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
