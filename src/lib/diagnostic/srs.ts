// Spaced Repetition System (SRS) engine — SM-2 algorithm.
//
// Cards represent concepts, skills, or commitments the user must internalise.
// Each review adjusts an ease factor and reschedules the next review at an
// expanding interval, so well-known material fades to the background and
// weak material resurfaces frequently. This is the compounding layer that
// turns a one-off audit into durable behavioural change.

export type CardKind = "concept" | "skill" | "commitment";

export interface SrsCard {
  id: string;
  kind: CardKind;
  front: string; // prompt / question
  back: string; // answer / definition / the behaviour
  /** Optional link to a 40-point audit point (1..40). */
  pointId?: number;
  /** Optional link to a portfolio assessment point (e.g. "diver-readiness:5"). */
  assessmentPoint?: string;

  // ── SM-2 state ────────────────────────────────────────────────────────────
  ease: number; // ease factor, default 2.5, floor 1.3
  interval: number; // days until next review
  repetitions: number; // consecutive successful reviews
  due: number; // timestamp (ms) when the card is next due
  createdAt: number;
  lastReviewed: number | null;
  history: SrsReviewLog[];
}

export interface SrsReviewLog {
  ts: number;
  quality: ReviewQuality;
  intervalAfter: number;
  easeAfter: number;
}

/** Review quality — SM-2 0..5 scale, surfaced as 4 buttons. */
export type ReviewQuality = 0 | 3 | 4 | 5;

export const REVIEW_BUTTONS: { quality: ReviewQuality; label: string; hint: string }[] = [
  { quality: 0, label: "Again", hint: "Forgot — show again today" },
  { quality: 3, label: "Hard", hint: "Recalled with real effort" },
  { quality: 4, label: "Good", hint: "Recalled, some effort" },
  { quality: 5, label: "Easy", hint: "Instant, effortless" },
];

const DAY_MS = 86_400_000;

export function newCard(
  partial: Partial<
    Omit<
      SrsCard,
      "ease" | "interval" | "repetitions" | "due" | "createdAt" | "history" | "lastReviewed"
    >
  >,
): SrsCard {
  const now = Date.now();
  return {
    id: `srs_${now}_${Math.random().toString(36).slice(2, 8)}`,
    kind: partial.kind ?? "concept",
    front: partial.front ?? "",
    back: partial.back ?? "",
    pointId: partial.pointId,
    assessmentPoint: partial.assessmentPoint,
    ease: 2.5,
    interval: 0,
    repetitions: 0,
    due: now, // due immediately
    createdAt: now,
    lastReviewed: null,
    history: [],
  };
}

/**
 * SM-2 scheduling. Given a card and a review quality, returns the updated
 * scheduling fields (ease, interval, repetitions, due). Pure function —
 * does not mutate.
 */
export function schedule(card: SrsCard, quality: ReviewQuality, now = Date.now()): SrsCard {
  let { ease, repetitions } = card;

  if (quality < 3) {
    // Failed recall — reset streak, review again soon.
    repetitions = 0;
    const interval = 1; // 1 day (effectively "today / tomorrow")
    const easeNew = clampEase(ease + deltaEase(quality));
    return {
      ...card,
      ease: easeNew,
      interval,
      repetitions,
      due: now + interval * DAY_MS,
      lastReviewed: now,
      history: [...card.history, { ts: now, quality, intervalAfter: interval, easeAfter: easeNew }],
    };
  }

  // Successful recall — expand interval.
  let interval: number;
  if (repetitions === 0) interval = 1;
  else if (repetitions === 1) interval = 6;
  else interval = Math.round(card.interval * ease);
  repetitions += 1;

  const easeNew = clampEase(ease + deltaEase(quality));

  return {
    ...card,
    ease: easeNew,
    interval,
    repetitions,
    due: now + interval * DAY_MS,
    lastReviewed: now,
    history: [...card.history, { ts: now, quality, intervalAfter: interval, easeAfter: easeNew }],
  };
}

function deltaEase(quality: ReviewQuality): number {
  // SM-2 ease update: EF + (0.1 - (5-q)*(0.08 + (5-q)*0.02))
  const q = quality;
  return 0.1 - (5 - q) * (0.08 + (5 - q) * 0.02);
}

function clampEase(e: number): number {
  return Math.max(1.3, e);
}

/** A card is due if its due timestamp is at or before now. */
export function isDue(card: SrsCard, now = Date.now()): boolean {
  return card.due <= now;
}

/** Cards due now, oldest first. */
export function dueQueue(cards: SrsCard[], now = Date.now()): SrsCard[] {
  return cards.filter((c) => isDue(c, now)).sort((a, b) => a.due - b.due);
}

/** "Mature" = interval >= 21 days (well-internalised). */
export function isMature(card: SrsCard): boolean {
  return card.interval >= 21;
}

/** Retention rate = successful reviews / total reviews across all cards. */
export function retentionRate(cards: SrsCard[]): number {
  let total = 0;
  let success = 0;
  for (const c of cards) {
    for (const h of c.history) {
      total++;
      if (h.quality >= 3) success++;
    }
  }
  return total === 0 ? 0 : success / total;
}

/** Human-readable "next review" label. */
export function dueLabel(card: SrsCard, now = Date.now()): string {
  const diff = card.due - now;
  if (diff <= 0) return "Due now";
  const days = Math.ceil(diff / DAY_MS);
  if (days === 1) return "Tomorrow";
  if (days < 21) return `In ${days}d`;
  const weeks = Math.round(days / 7);
  if (weeks < 9) return `In ${weeks}wk`;
  const months = Math.round(days / 30);
  return `In ${months}mo`;
}
