import { accountStorage } from "@/lib/diagnostic/local-storage";
// SRS context — persists the card deck to localStorage and exposes review +
// management actions. Mirrors the DiagnosticProvider pattern.
import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react";
import {
  type SrsCard,
  type ReviewQuality,
  type CardKind,
  newCard,
  schedule,
  dueQueue,
} from "./srs";

interface SrsState {
  cards: SrsCard[];
  addCard: (input: {
    kind: CardKind;
    front: string;
    back: string;
    pointId?: number;
    assessmentPoint?: string;
  }) => void;
  reviewCard: (id: string, quality: ReviewQuality) => void;
  deleteCard: (id: string) => void;
  /** Bulk-create cards from audit friction points (skips duplicates by pointId). */
  importFromFriction: (frictionPoints: { id: number; name: string; focus: string }[]) => number;
  /** Bulk-create cards from portfolio-assessment friction points.
   *  Each point is keyed by a composite string (e.g. "diver-readiness:5")
   *  so it never collides with a 40-point audit card. */
  importFromAssessments: (
    points: {
      composite: string;
      assessmentName: string;
      pointName: string;
      focus: string;
    }[],
  ) => number;
  resetAll: () => void;
}

const SrsContext = createContext<SrsState | null>(null);
const LS_KEY = "creation-srs-state-v1";

function load(): SrsCard[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = accountStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as SrsCard[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function SrsProvider({ children }: { children: ReactNode }) {
  const [cards, setCards] = useState<SrsCard[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCards(load());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      accountStorage.setItem(LS_KEY, JSON.stringify(cards));
    } catch {
      /* ignore quota */
    }
  }, [cards, hydrated]);

  const addCard = useCallback<SrsState["addCard"]>((input) => {
    if (!input.front.trim()) return;
    setCards((prev) => [...prev, newCard(input)]);
  }, []);

  const reviewCard = useCallback<SrsState["reviewCard"]>((id, quality) => {
    setCards((prev) => prev.map((c) => (c.id === id ? schedule(c, quality) : c)));
  }, []);

  const deleteCard = useCallback<SrsState["deleteCard"]>((id) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const importFromFriction = useCallback<SrsState["importFromFriction"]>((frictionPoints) => {
    let added = 0;
    setCards((prev) => {
      const existingPointIds = new Set(prev.filter((c) => c.pointId).map((c) => c.pointId));
      const fresh = frictionPoints.filter((p) => !existingPointIds.has(p.id));
      added = fresh.length;
      const newCards = fresh.map((p) =>
        newCard({
          kind: "skill",
          front: `Point #${p.id}: ${p.name}`,
          back: p.focus,
          pointId: p.id,
        }),
      );
      return [...prev, ...newCards];
    });
    return added;
  }, []);

  const importFromAssessments = useCallback<SrsState["importFromAssessments"]>((points) => {
    let added = 0;
    setCards((prev) => {
      const existing = new Set(prev.filter((c) => c.assessmentPoint).map((c) => c.assessmentPoint));
      const fresh = points.filter((p) => !existing.has(p.composite));
      added = fresh.length;
      const newCards = fresh.map((p) =>
        newCard({
          kind: "skill",
          front: `${p.assessmentName} · ${p.pointName}`,
          back: p.focus,
          assessmentPoint: p.composite,
        }),
      );
      return [...prev, ...newCards];
    });
    return added;
  }, []);

  const resetAll = useCallback(() => setCards([]), []);

  return (
    <SrsContext.Provider
      value={{
        cards,
        addCard,
        reviewCard,
        deleteCard,
        importFromFriction,
        importFromAssessments,
        resetAll,
      }}
    >
      {children}
    </SrsContext.Provider>
  );
}

export function useSrs() {
  const ctx = useContext(SrsContext);
  if (!ctx) throw new Error("useSrs must be used within SrsProvider");
  return ctx;
}

/** Re-export for convenience so routes can import from one place. */
export { dueQueue };
