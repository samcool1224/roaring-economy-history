import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  clearSave,
  freshSave,
  loadSave,
  meetsCompletion,
  persist,
  type Preferences,
  type SaveData,
} from './progress';
import { sfx } from '../audio/sfx';
import { music } from '../audio/music';
import { exhibitById } from '../data/exhibits';

interface MuseumAPI {
  save: SaveData;
  markSectionRead: (exhibitId: number, sectionId: string) => void;
  markMinigameDone: (exhibitId: number) => void;
  markQuestion: (exhibitId: number, questionId: string, correct: boolean) => void;
  /** Wipes that exhibit's quiz answers so the visitor starts again at question 1. */
  resetQuiz: (exhibitId: number) => void;
  markVisited: (exhibitId: number) => void;
  markPlaqueRead: (code: string) => void;
  markFinalGameDone: () => void;
  completeMuseum: () => void;
  setLocation: (loc: SaveData['lastLocation']) => void;
  updatePrefs: (p: Partial<Preferences>) => void;
  resetAll: () => void;
  /** Dev-only QA shortcut. */
  devCompleteExhibit: (exhibitId: number) => void;
  /** Fires when a room has just been finished, so the shell can celebrate. */
  justCompleted: number | null;
  clearJustCompleted: () => void;
}

const Ctx = createContext<MuseumAPI | null>(null);

export function MuseumProvider({ children }: { children: ReactNode }) {
  const [save, setSave] = useState<SaveData>(() => loadSave());
  const [justCompleted, setJustCompleted] = useState<number | null>(null);
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    persist(save);
  }, [save]);

  useEffect(() => {
    sfx.setEnabled(save.prefs.soundOn);
    sfx.setVolume(save.prefs.volume);
  }, [save.prefs.soundOn, save.prefs.volume]);

  useEffect(() => {
    music.setVolume(save.prefs.volume);
    music.setEnabled(save.prefs.musicOn);
  }, [save.prefs.musicOn, save.prefs.volume]);

  useEffect(() => {
    document.documentElement.dataset.reducedMotion = save.prefs.reducedMotion ? 'on' : 'off';
  }, [save.prefs.reducedMotion]);

  /** Applies a change, then re-evaluates completion + unlocking in one place. */
  const mutate = useCallback(
    (exhibitId: number, fn: (draft: SaveData) => void) => {
      setSave((prev) => {
        const next: SaveData = structuredClone(prev);
        if (next.startedAt === null) next.startedAt = Date.now();
        fn(next);
        const ex = next.exhibits[exhibitId];
        if (ex && !ex.completed && meetsCompletion(ex, exhibitId)) {
          ex.completed = true;
          if (!next.evidence.includes(exhibitId)) next.evidence.push(exhibitId);
          next.highestUnlocked = Math.max(next.highestUnlocked, Math.min(exhibitId + 1, 6));
          queueMicrotask(() => {
            setJustCompleted(exhibitId);
            sfx.play('stamp');
          });
        }
        return next;
      });
    },
    [],
  );

  const api = useMemo<MuseumAPI>(
    () => ({
      save,
      markSectionRead: (exhibitId, sectionId) =>
        mutate(exhibitId, (d) => {
          const ex = d.exhibits[exhibitId];
          if (!ex.readSections.includes(sectionId)) ex.readSections.push(sectionId);
        }),
      markMinigameDone: (exhibitId) =>
        mutate(exhibitId, (d) => {
          d.exhibits[exhibitId].miniGameDone = true;
        }),
      markQuestion: (exhibitId, questionId, correct) =>
        mutate(exhibitId, (d) => {
          if (correct) d.exhibits[exhibitId].quizCorrect[questionId] = true;
        }),
      resetQuiz: (exhibitId) =>
        setSave((prev) => {
          const next: SaveData = structuredClone(prev);
          next.exhibits[exhibitId].quizCorrect = {};
          return next;
        }),
      markVisited: (exhibitId) =>
        mutate(exhibitId, (d) => {
          d.exhibits[exhibitId].visited = true;
          d.lastLocation = { kind: 'exhibit', id: exhibitId };
        }),
      markPlaqueRead: (code) =>
        setSave((prev) => {
          if (prev.plaquesRead.includes(code)) return prev;
          return { ...prev, plaquesRead: [...prev.plaquesRead, code] };
        }),
      markFinalGameDone: () => setSave((prev) => ({ ...prev, finalGameDone: true })),
      completeMuseum: () =>
        setSave((prev) => {
          const next: SaveData = structuredClone(prev);
          next.museumComplete = true;
          next.exhibits[6].completed = true;
          next.exhibits[6].miniGameDone = true;
          if (!next.evidence.includes(6)) next.evidence.push(6);
          return next;
        }),
      setLocation: (loc) => setSave((prev) => ({ ...prev, lastLocation: loc })),
      updatePrefs: (p) => setSave((prev) => ({ ...prev, prefs: { ...prev.prefs, ...p } })),
      resetAll: () => {
        clearSave();
        setSave(freshSave());
        setJustCompleted(null);
      },
      devCompleteExhibit: (exhibitId) =>
        setSave((prev) => {
          const next: SaveData = structuredClone(prev);
          const ex = next.exhibits[exhibitId];
          ex.readSections = (exhibitById(exhibitId)?.stations ?? []).map((s) => s.id);
          ex.miniGameDone = true;
          ex.completed = true;
          ex.visited = true;
          if (!next.evidence.includes(exhibitId)) next.evidence.push(exhibitId);
          next.highestUnlocked = Math.max(next.highestUnlocked, Math.min(exhibitId + 1, 6));
          return next;
        }),
      justCompleted,
      clearJustCompleted: () => setJustCompleted(null),
    }),
    [save, mutate, justCompleted],
  );

  return <Ctx.Provider value={api}>{children}</Ctx.Provider>;
}

export function useMuseum(): MuseumAPI {
  const v = useContext(Ctx);
  if (!v) throw new Error('useMuseum must be used inside <MuseumProvider>');
  return v;
}
