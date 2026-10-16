import { useState } from 'react';
import { useMuseum } from '../state/MuseumContext';
import { completedCount } from '../state/progress';
import Modal from './Modal';
import { sfx } from '../audio/sfx';

interface Props {
  hasSave: boolean;
  onBegin: () => void;
  onResume: () => void;
  onOpenReferences: () => void;
}

export default function TitleScreen({ hasSave, onBegin, onResume, onOpenReferences }: Props) {
  const { save, resetAll, updatePrefs } = useMuseum();
  const [showHow, setShowHow] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);
  const done = completedCount(save);

  return (
    <div className="title-screen">
      <div className="title-rays" aria-hidden="true" />
      <div className="title-inner">
        <div className="title-team" aria-label="Class 11-1, Team A">
          <span className="title-team-chip">Class 11-1</span>
          <span className="title-team-chip">Team A</span>
        </div>
        <span className="title-kicker">An interactive self-teaching museum</span>
        <h1 className="title-main">
          THE ROARING
          <br />
          ECONOMY
        </h1>
        <div className="title-rule" aria-hidden="true" />
        <p className="title-sub">A Walk Through America's Boom, 1919–1929</p>

        <p className="title-setup">
          From postwar recession to mass production, credit, uneven prosperity, and the stock-market
          crash: follow the evidence to decide who truly prospered.
        </p>

        <div className="title-buttons">
          {hasSave && save.startedAt !== null ? (
            <>
              <button
                className="btn btn-primary btn-large"
                onClick={() => {
                  sfx.setEnabled(save.prefs.soundOn);
                  onResume();
                }}
              >
                Resume Museum <span className="btn-note">{done}/6 complete</span>
              </button>
              <button className="btn btn-ghost" onClick={onBegin}>
                Enter the hall
              </button>
            </>
          ) : (
            <button
              className="btn btn-primary btn-large"
              onClick={() => {
                sfx.setEnabled(save.prefs.soundOn);
                onBegin();
              }}
            >
              Begin Museum
            </button>
          )}
          <button className="btn btn-ghost" onClick={() => setShowHow(true)}>
            How to Play
          </button>
          <button className="btn btn-ghost" onClick={onOpenReferences}>
            References &amp; Credits
          </button>
          {hasSave && (
            <button className="btn btn-ghost btn-danger" onClick={() => setConfirmReset(true)}>
              Reset Progress
            </button>
          )}
        </div>

        <div className="title-prefs">
          <label className="pref">
            <input
              type="checkbox"
              checked={save.prefs.soundOn}
              onChange={(e) => {
                updatePrefs({ soundOn: e.target.checked });
                if (e.target.checked) sfx.play('chime');
              }}
            />
            Sound effects {save.prefs.soundOn ? 'on' : 'off'}
          </label>
          <label className="pref">
            <input
              type="checkbox"
              checked={save.prefs.musicOn}
              onChange={(e) => updatePrefs({ musicOn: e.target.checked })}
            />
            Background music {save.prefs.musicOn ? 'on' : 'off'}
          </label>
          <label className="pref">
            <input
              type="checkbox"
              checked={save.prefs.reducedMotion}
              onChange={(e) => updatePrefs({ reducedMotion: e.target.checked })}
            />
            Reduce motion
          </label>
        </div>

      </div>

      {showHow && <HowToPlay onClose={() => setShowHow(false)} />}

      {confirmReset && (
        <Modal title="Reset all progress?" onClose={() => setConfirmReset(false)}>
          <p>
            This erases every unlocked exhibit, every answered question and all five evidence cards
            from this browser. It cannot be undone.
          </p>
          <div className="cert-actions">
            <button
              className="btn btn-danger"
              onClick={() => {
                resetAll();
                setConfirmReset(false);
              }}
            >
              Yes, erase my progress
            </button>
            <button className="btn btn-ghost" onClick={() => setConfirmReset(false)}>
              Keep my progress
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

export function HowToPlay({ onClose }: { onClose: () => void }) {
  return (
    <Modal title="How to Play" subtitle="About ten minutes for a focused first visit" onClose={onClose} wide>
      <div className="how-grid">
        <section>
          <h3 className="mini-head">In the hall</h3>
          <ul className="key-list">
            <li>
              <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd> or the <kbd>arrow keys</kbd> — walk
            </li>
            <li>
              <kbd>E</kbd> — enter the door you are standing next to
            </li>
            <li>
              <kbd>M</kbd> — open the museum map
            </li>
            <li>
              <kbd>?</kbd> — open this help at any time
            </li>
          </ul>
        </section>
        <section>
          <h3 className="mini-head">Inside an exhibit</h3>
          <ul className="key-list">
            <li>Point and click — walking keys are not needed in a room</li>
            <li>
              <kbd>Tab</kbd> and <kbd>Enter</kbd> work everywhere the mouse does
            </li>
            <li>
              <kbd>Esc</kbd> — close any window
            </li>
          </ul>
        </section>
      </div>

      <h3 className="mini-head">What finishes a room</h3>
      <ol className="help-list">
        <li>Open the three learning stations in the scene.</li>
        <li>Complete that room's interactive activity.</li>
        <li>
          Answer four questions correctly, each with four choices. A wrong answer restarts that
          quiz from question 1 — your reading and your activity stay done. Nothing is timed, nothing
          is scored, and there is no limit on attempts.
        </li>
      </ol>
      <p>
        All six exhibits are open from the start and can be visited in any order, though the
        numbers follow the story of the decade. Finishing one of Exhibits 1–5 earns an evidence
        card, and in Exhibit 6 the five cards answer the two Essential Questions. Galleries, films,
        music and sound are optional and never block your progress.
      </p>

      <h3 className="mini-head">If something goes wrong</h3>
      <ul className="help-list">
        <li>
          Progress saves to this browser automatically. Closing the tab is safe; use Resume to come
          back.
        </li>
        <li>
          The museum runs without an internet connection. Only the outward links to archives need
          one.
        </li>
        <li>Nothing plays sound or music until you turn it on, and narration never autoplays.</li>
        <li>
          If the keyboard stops moving your character, click once on the hall and try again — closing
          a window returns control automatically.
        </li>
      </ul>
    </Modal>
  );
}
