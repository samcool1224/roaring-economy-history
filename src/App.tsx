import { useCallback, useEffect, useState } from 'react';
import PhaserHall from './game/PhaserHall';
import type { DoorSpec } from './game/HallScene';
import TitleScreen, { HowToPlay } from './components/TitleScreen';
import ExhibitScene from './components/ExhibitScene';
import CouncilScene from './components/CouncilScene';
import ReferenceRoom from './components/ReferenceRoom';
import MapOverlay from './components/MapOverlay';
import { useMuseum } from './state/MuseumContext';
import {
  completedCount,
  devModeEnabled,
  fiveComplete,
  hasSavedProgress,
  isExhibitUnlocked,
} from './state/progress';
import { EXHIBITS, exhibitById } from './data/exhibits';
import { sfx } from './audio/sfx';

type View = { kind: 'title' } | { kind: 'hall' } | { kind: 'exhibit'; id: number };

export default function App() {
  const { save, setLocation, resetAll, updatePrefs, devCompleteExhibit, justCompleted, clearJustCompleted } =
    useMuseum();
  const [view, setView] = useState<View>({ kind: 'title' });
  const [prompt, setPrompt] = useState<{ door: DoorSpec; locked: boolean } | null>(null);
  const [showRefs, setShowRefs] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  // Which exhibit door the visitor reappears at when the hall loads.
  const [spawnDoor, setSpawnDoor] = useState<number | null>(null);
  const dev = devModeEnabled();

  const done = completedCount(save);
  const nextDoorId = useCallback(() => {
    for (const ex of EXHIBITS) if (!save.exhibits[ex.id].completed) return ex.id;
    return 6;
  }, [save]);

  /* ---------------------------------------------------- global shortcuts */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (view.kind === 'title') return;
      const typing =
        e.target instanceof HTMLElement &&
        ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName);
      if (typing) return;
      if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        setShowMap((v) => !v);
      } else if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setShowHelp((v) => !v);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view.kind]);

  /* ---------------------------------------------------- unlock toast */
  useEffect(() => {
    if (justCompleted === null) return;
    const finished = [1, 2, 3, 4, 5].filter((i) => save.exhibits[i]?.completed).length;
    setToast(
      fiveComplete(save)
        ? 'All five exhibits complete — every evidence card is ready for the Economic Council (Exhibit 6).'
        : `Exhibit ${justCompleted} complete — evidence card ${finished} of 5 collected.`,
    );
    clearJustCompleted();
    const t = setTimeout(() => setToast(null), 5200);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [justCompleted, clearJustCompleted]);

  /** Opens the hall. Pass the exhibit just left to reappear at its door. */
  const goHall = (fromDoor: number | null = null) => {
    setSpawnDoor(fromDoor);
    setView({ kind: 'hall' });
    setLocation(fromDoor ? { kind: 'hall', door: fromDoor } : { kind: 'hall' });
    setPrompt(null);
  };

  const enterExhibit = (id: number) => {
    if (!isExhibitUnlocked(save, id)) return;
    sfx.play('door');
    setView({ kind: 'exhibit', id });
    setLocation({ kind: 'exhibit', id });
    setShowMap(false);
  };

  const overlayOpen = showRefs || showMap || showHelp;

  /* ---------------------------------------------------- title */
  if (view.kind === 'title') {
    return (
      <>
        <TitleScreen
          hasSave={hasSavedProgress()}
          onBegin={() => goHall(null)}
          onResume={() => {
            // Fall back to the hall if the saved room is not actually unlocked,
            // so a stale or edited save can never leave Resume doing nothing.
            const loc = save.lastLocation;
            if (loc.kind === 'exhibit' && isExhibitUnlocked(save, loc.id)) {
              enterExhibit(loc.id);
            } else {
              goHall(loc.kind === 'hall' ? (loc.door ?? null) : null);
            }
          }}
          onOpenReferences={() => setShowRefs(true)}
        />
        {showRefs && <ReferenceRoom onClose={() => setShowRefs(false)} />}
      </>
    );
  }

  /* ---------------------------------------------------- exhibit rooms */
  if (view.kind === 'exhibit') {
    return (
      <div className="app-root">
        {view.id === 6 ? (
          <CouncilScene
            onBackToHall={() => goHall(6)}
            onGoToExhibit={enterExhibit}
            onRestart={() => {
              resetAll();
              setView({ kind: 'title' });
            }}
          />
        ) : (
          <ExhibitScene
            key={view.id}
            exhibitId={view.id}
            onBackToHall={() => goHall(view.id)}
          />
        )}
        {showRefs && <ReferenceRoom onClose={() => setShowRefs(false)} />}
        {showMap && <MapOverlay onClose={() => setShowMap(false)} onGoTo={enterExhibit} />}
        {showHelp && <HowToPlay onClose={() => setShowHelp(false)} />}
        {toast && <Toast text={toast} />}
      </div>
    );
  }

  /* ---------------------------------------------------- the hall */
  return (
    <div className="app-root hall-root">
      <div className="hall-stage">
        <PhaserHall
          active={!overlayOpen}
          reducedMotion={save.prefs.reducedMotion}
          onEnterDoor={enterExhibit}
          onPrompt={(door, locked) => setPrompt(door ? { door, locked } : null)}
          isUnlocked={(id) => isExhibitUnlocked(save, id)}
          isCompleted={(id) => !!save.exhibits[id]?.completed}
          nextDoorId={nextDoorId}
          spawnDoorId={spawnDoor}
        />
      </div>

      {/* ------------------------------------------------------------ HUD */}
      <div className="hud">
        <div className="hud-left">
          <button className="btn btn-ghost btn-small" onClick={() => setView({ kind: 'title' })}>
            ← Title
          </button>
          <div className="hud-location">
            <span className="hud-room">Central Hall</span>
            <span className="hud-task">
              {done === 6
                ? 'All six galleries complete — revisit anything you like.'
                : `Suggested next: Exhibit ${nextDoorId()} — ${exhibitById(nextDoorId()).title}`}
            </span>
          </div>
        </div>

        <div className="hud-right">
          <div className="hud-progress" aria-label={`Progress: ${done} of 6 exhibits complete`}>
            <span className="hud-progress-num">{done}/6</span>
            <div className="hud-pips">
              {EXHIBITS.map((ex) => (
                <span
                  key={ex.id}
                  className={`pip${save.exhibits[ex.id].completed ? ' is-done' : ''}${
                    isExhibitUnlocked(save, ex.id) ? ' is-open' : ''
                  }`}
                  style={save.exhibits[ex.id].completed ? { background: ex.accent } : undefined}
                  title={ex.doorSign}
                />
              ))}
            </div>
          </div>
          <button className="btn btn-ghost btn-small" onClick={() => setShowMap(true)}>
            Map <kbd>M</kbd>
          </button>
          <button className="btn btn-ghost btn-small" onClick={() => setShowRefs(true)}>
            References
          </button>
          <button className="btn btn-ghost btn-small" onClick={() => setShowHelp(true)}>
            Help <kbd>?</kbd>
          </button>
          <button
            className="btn btn-ghost btn-small"
            onClick={() => updatePrefs({ soundOn: !save.prefs.soundOn })}
            aria-pressed={save.prefs.soundOn}
          >
            {save.prefs.soundOn ? '🔊 Sound on' : '🔇 Sound off'}
          </button>
          <button
            className="btn btn-ghost btn-small"
            onClick={() => updatePrefs({ musicOn: !save.prefs.musicOn })}
            aria-pressed={save.prefs.musicOn}
          >
            {save.prefs.musicOn ? '♫ Music on' : '♫ Music off'}
          </button>
        </div>
      </div>

      {/* ------------------------------------------------ door prompt echo */}
      {prompt && (
        <div className={`door-banner${prompt.locked ? ' is-locked' : ''}`} role="status">
          {prompt.locked ? (
            <>
              <strong>Exhibit {prompt.door.id}</strong> is locked — finish Exhibits 1–5 first.
            </>
          ) : (
            <>
              Press <kbd>E</kbd> to enter{' '}
              <strong>
                Exhibit {prompt.door.id}: {prompt.door.title}
              </strong>
            </>
          )}
        </div>
      )}

      {toast && <Toast text={toast} />}

      {/* ------------------------------------------------ dev-only QA panel */}
      {dev && (
        <div className="dev-panel">
          <strong>QA (dev only)</strong>
          {EXHIBITS.slice(0, 5).map((ex) => (
            <button key={ex.id} className="btn btn-small" onClick={() => devCompleteExhibit(ex.id)}>
              Complete {ex.id}
            </button>
          ))}
          <button className="btn btn-small btn-danger" onClick={resetAll}>
            Reset
          </button>
        </div>
      )}

      {showRefs && <ReferenceRoom onClose={() => setShowRefs(false)} />}
      {showMap && <MapOverlay onClose={() => setShowMap(false)} onGoTo={enterExhibit} />}
      {showHelp && <HowToPlay onClose={() => setShowHelp(false)} />}
    </div>
  );
}

function Toast({ text }: { text: string }) {
  return (
    <div className="toast" role="status">
      <span className="toast-stamp" aria-hidden="true">
        ✓
      </span>
      {text}
    </div>
  );
}
