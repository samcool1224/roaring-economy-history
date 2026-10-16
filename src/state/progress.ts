/**
 * progress.ts — all persistent visitor state, stored in localStorage.
 * Every write is wrapped: a browser with storage disabled still plays, it just
 * forgets between sessions.
 */

import { QUESTIONS } from '../data/questions';
import { EXHIBITS } from '../data/exhibits';

export const STORAGE_KEY = 'roaring-economy:v1';

export interface ExhibitProgress {
  readSections: string[];
  miniGameDone: boolean;
  /** Question id -> answered correctly. Persisted per question. */
  quizCorrect: Record<string, boolean>;
  completed: boolean;
  visited: boolean;
}

export interface Preferences {
  soundOn: boolean;
  volume: number;
  reducedMotion: boolean;
  captionsOn: boolean;
}

export interface SaveData {
  version: 1;
  highestUnlocked: number;
  exhibits: Record<number, ExhibitProgress>;
  evidence: number[];
  prefs: Preferences;
  /**
   * Where the visitor was, so "Resume" can put them back. In the hall, `door`
   * remembers which exhibit they last left so they reappear at that door.
   */
  lastLocation: { kind: 'hall'; door?: number } | { kind: 'exhibit'; id: number };
  finalGameDone: boolean;
  plaquesRead: string[];
  museumComplete: boolean;
  startedAt: number | null;
}

export const emptyExhibit = (): ExhibitProgress => ({
  readSections: [],
  miniGameDone: false,
  quizCorrect: {},
  completed: false,
  visited: false,
});

export const freshSave = (): SaveData => ({
  version: 1,
  highestUnlocked: 1,
  exhibits: {
    1: emptyExhibit(),
    2: emptyExhibit(),
    3: emptyExhibit(),
    4: emptyExhibit(),
    5: emptyExhibit(),
    6: emptyExhibit(),
  },
  evidence: [],
  prefs: { soundOn: false, volume: 0.5, reducedMotion: false, captionsOn: true },
  lastLocation: { kind: 'hall' },
  finalGameDone: false,
  plaquesRead: [],
  museumComplete: false,
  startedAt: null,
});

export function loadSave(): SaveData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return freshSave();
    const parsed = JSON.parse(raw) as Partial<SaveData>;
    if (!parsed || parsed.version !== 1) return freshSave();
    // Merge defensively so an older/partial save never crashes the museum.
    const base = freshSave();
    const merged: SaveData = {
      ...base,
      ...parsed,
      prefs: { ...base.prefs, ...(parsed.prefs ?? {}) },
      exhibits: { ...base.exhibits },
      evidence: Array.isArray(parsed.evidence) ? parsed.evidence : [],
      plaquesRead: Array.isArray(parsed.plaquesRead) ? parsed.plaquesRead : [],
    };
    for (let i = 1; i <= 6; i++) {
      const incoming = parsed.exhibits?.[i];
      merged.exhibits[i] = { ...emptyExhibit(), ...(incoming ?? {}) };
      if (!Array.isArray(merged.exhibits[i].readSections)) merged.exhibits[i].readSections = [];
      if (typeof merged.exhibits[i].quizCorrect !== 'object' || merged.exhibits[i].quizCorrect === null) {
        merged.exhibits[i].quizCorrect = {};
      }
    }
    return merged;
  } catch {
    return freshSave();
  }
}

export function persist(data: SaveData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    /* storage unavailable — the session still plays, it just will not resume */
  }
}

export function clearSave(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

export function hasSavedProgress(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== null;
  } catch {
    return false;
  }
}

/* ---------------------------------------------------------------- queries */

export const SECTIONS_REQUIRED = 3;

/**
 * Counts only sections that actually belong to this exhibit, so a stale or
 * hand-edited save can never report "4/3 read" or disagree with the room's own
 * checklist. Every readout in the app goes through this one function.
 */
export function sectionsRead(p: ExhibitProgress, exhibitId: number): number {
  const ex = EXHIBITS.find((e) => e.id === exhibitId);
  if (!ex || ex.stations.length === 0) return p.readSections.length;
  const valid = new Set(ex.stations.map((s) => s.id));
  return p.readSections.filter((id) => valid.has(id)).length;
}

export function quizCorrectCount(p: ExhibitProgress, exhibitId: number): number {
  const ids = QUESTIONS.filter((q) => q.exhibit === exhibitId).map((q) => q.id);
  return ids.filter((id) => p.quizCorrect[id]).length;
}

export function quizTotal(exhibitId: number): number {
  return QUESTIONS.filter((q) => q.exhibit === exhibitId).length;
}

/** Exhibits 1–5: three sections + minigame + all four questions. */
export function meetsCompletion(p: ExhibitProgress, exhibitId: number): boolean {
  if (exhibitId === 6) return false; // exhibit 6 has its own rule
  return (
    sectionsRead(p, exhibitId) >= SECTIONS_REQUIRED &&
    p.miniGameDone &&
    quizCorrectCount(p, exhibitId) === quizTotal(exhibitId)
  );
}

export interface TaskStatus {
  label: string;
  done: boolean;
}

export function taskList(p: ExhibitProgress, exhibitId: number): TaskStatus[] {
  if (exhibitId === 6) {
    return [];
  }
  const total = quizTotal(exhibitId);
  const read = sectionsRead(p, exhibitId);
  return [
    {
      label: `Read ${Math.min(read, SECTIONS_REQUIRED)}/${SECTIONS_REQUIRED} sections`,
      done: read >= SECTIONS_REQUIRED,
    },
    { label: p.miniGameDone ? 'Activity complete' : 'Activity not finished', done: p.miniGameDone },
    {
      label: `Questions ${quizCorrectCount(p, exhibitId)}/${total}`,
      done: quizCorrectCount(p, exhibitId) === total,
    },
  ];
}

/** True once Exhibits 1–5 are all finished. */
export function fiveComplete(data: SaveData): boolean {
  return [1, 2, 3, 4, 5].every((i) => data.exhibits[i]?.completed);
}

/**
 * Exhibits 1–5 are open from the start and can be done in any order.
 * Exhibit 6, the Economic Council, opens once all five are finished.
 */
export function isExhibitUnlocked(data: SaveData, id: number): boolean {
  if (id >= 1 && id <= 5) return true;
  if (id === 6) return fiveComplete(data);
  return false;
}

export function completedCount(data: SaveData): number {
  let n = 0;
  for (let i = 1; i <= 6; i++) if (data.exhibits[i]?.completed) n++;
  return n;
}

/** Developer-only QA flag: ?dev=1 in the URL. Never shown to visitors. */
export function devModeEnabled(): boolean {
  try {
    return new URLSearchParams(window.location.search).get('dev') === '1';
  } catch {
    return false;
  }
}
