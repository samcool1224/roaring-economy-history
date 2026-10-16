import { useEffect, useRef, useState } from 'react';
import { exhibitById, WWI_EFFECTS } from '../data/exhibits';
import { useMuseum } from '../state/MuseumContext';
import {
  SECTIONS_REQUIRED,
  quizCorrectCount,
  quizTotal,
  sectionsRead,
  taskList,
  fiveComplete,
} from '../state/progress';
import RoomBackdrop from '../art/RoomBackdrop';
import NarrationVideo from './NarrationVideo';
import LessonStationModal from './LessonStation';
import Gallery from './Gallery';
import FilmModal from './FilmModal';
import { FILMS } from '../data/media';
import CFU from './CFU';
import EvidenceCard from './EvidenceCard';
import Modal from './Modal';
import InvestigativeHeadline from '../games/InvestigativeHeadline';
import BuildTheModelT from '../games/BuildTheModelT';
import ShopAndChoose from '../games/ShopAndChoose';
import TransformTheMap from '../games/TransformTheMap';
import TwoBudgets from '../games/TwoBudgets';
import { sfx } from '../audio/sfx';

interface Props {
  exhibitId: number;
  onBackToHall: () => void;
}

/** Hotspot placement per room, so the clickable objects sit on the artwork. */
const HOTSPOTS: Record<number, Array<{ left: string; top: string }>> = {
  1: [
    { left: '12%', top: '46%' },
    { left: '40%', top: '26%' },
    { left: '68%', top: '58%' },
  ],
  2: [
    { left: '14%', top: '52%' },
    { left: '46%', top: '24%' },
    { left: '76%', top: '58%' },
  ],
  3: [
    { left: '15%', top: '30%' },
    { left: '30%', top: '62%' },
    { left: '70%', top: '42%' },
  ],
  4: [
    { left: '16%', top: '54%' },
    { left: '47%', top: '36%' },
    { left: '76%', top: '58%' },
  ],
  5: [
    { left: '16%', top: '40%' },
    { left: '64%', top: '30%' },
    { left: '80%', top: '62%' },
  ],
};

type Stage = 'intro' | 'room';

export default function ExhibitScene({ exhibitId, onBackToHall }: Props) {
  const ex = exhibitById(exhibitId);
  const { save, markSectionRead, markMinigameDone, markQuestion, resetQuiz, markVisited } =
    useMuseum();
  const progress = save.exhibits[exhibitId];
  const reduced = save.prefs.reducedMotion;

  const [stage, setStage] = useState<Stage>(progress.visited ? 'room' : 'intro');
  const [openStation, setOpenStation] = useState<string | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [showFilm, setShowFilm] = useState(false);
  const film = FILMS[exhibitId];
  const [showGame, setShowGame] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showEvidence, setShowEvidence] = useState(false);
  // Sticky: once the quiz is open it stays open, so a failed attempt (which
  // clears the saved answers) cannot collapse it back to the start prompt.
  const [showQuiz, setShowQuiz] = useState(
    () => quizCorrectCount(save.exhibits[exhibitId], exhibitId) > 0,
  );
  const quizRef = useRef<HTMLDivElement | null>(null);
  const announcedComplete = useRef(progress.completed);

  useEffect(() => {
    markVisited(exhibitId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exhibitId]);

  // Celebrate the moment the room is finished.
  useEffect(() => {
    if (progress.completed && !announcedComplete.current) {
      announcedComplete.current = true;
      setShowEvidence(true);
    }
  }, [progress.completed]);

  const tasks = taskList(progress, exhibitId);
  const readCount = sectionsRead(progress, exhibitId);
  const quizDone = quizCorrectCount(progress, exhibitId);

  const gameFor = (onComplete: () => void) => {
    switch (exhibitId) {
      case 1:
        return <InvestigativeHeadline onComplete={onComplete} />;
      case 2:
        return <BuildTheModelT onComplete={onComplete} />;
      case 3:
        return <ShopAndChoose onComplete={onComplete} />;
      case 4:
        return <TransformTheMap onComplete={onComplete} />;
      default:
        return <TwoBudgets onComplete={onComplete} />;
    }
  };

  if (stage === 'intro') {
    return (
      <div className="exhibit-intro" style={{ ['--accent' as string]: ex.accent }}>
        <div className="intro-inner">
          <span className="intro-eyebrow">
            Exhibit {ex.id} · {ex.years}
          </span>
          <h1>{ex.title}</h1>
          <p className="intro-subtitle">{ex.subtitle}</p>
          <p className="intro-objective">{ex.objective}</p>
          <NarrationVideo
            src={ex.narrationVideo}
            exhibitTitle={ex.title}
            onContinue={() => {
              setStage('room');
              sfx.play('door');
            }}
          />
          <button className="btn btn-ghost btn-small" onClick={onBackToHall}>
            ← Back to the hall
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="exhibit-room" style={{ ['--accent' as string]: ex.accent }}>
      {/* ---------------------------------------------------- room header */}
      <header className="room-bar">
        <div className="room-bar-left">
          <button className="btn btn-ghost btn-small" onClick={onBackToHall}>
            ← Back to the hall
          </button>
          <div className="room-title-block">
            <span className="room-eyebrow">
              Exhibit {ex.id} · {ex.years}
            </span>
            <h1>{ex.title}</h1>
          </div>
        </div>
        <div className="room-bar-right">
          <ul className="task-chips" aria-label="What is left in this room">
            {tasks.map((t) => (
              <li key={t.label} className={`task-chip${t.done ? ' is-done' : ''}`}>
                {t.done ? '✓' : '○'} {t.label}
              </li>
            ))}
          </ul>
          <button className="btn btn-ghost btn-small" onClick={() => setStage('intro')}>
            ▶ Introduction
          </button>
          <button className="btn btn-ghost btn-small" onClick={() => setShowHelp(true)}>
            ? Help
          </button>
        </div>
      </header>

      {/* ---------------------------------------------------- WWI effect */}
      {WWI_EFFECTS[exhibitId] && (
        <aside className="wwi-effect" aria-label="Effect of World War I">
          <span className="wwi-effect-tag">WWI Effect</span>
          <p>{WWI_EFFECTS[exhibitId]}</p>
        </aside>
      )}

      {/* ---------------------------------------------------- the scene */}
      <div className="scene-wrap">
        <RoomBackdrop exhibit={exhibitId} animate={!reduced} />

        <div className="hotspot-layer">
          {ex.stations.map((s, i) => {
            const read = progress.readSections.includes(s.id);
            const pos = HOTSPOTS[exhibitId]?.[i] ?? { left: `${20 + i * 30}%`, top: '50%' };
            return (
              <button
                key={s.id}
                className={`hotspot${read ? ' is-read' : ''}`}
                style={pos}
                onClick={() => {
                  setOpenStation(s.id);
                  sfx.play('page');
                }}
              >
                <span className="hotspot-dot" aria-hidden="true">
                  {read ? '✓' : i + 1}
                </span>
                <span className="hotspot-label">
                  <strong>{s.label}</strong>
                  <em>{read ? 'Read — open again' : 'Click to read'}</em>
                </span>
              </button>
            );
          })}

          <button
            className={`hotspot hotspot--game${progress.miniGameDone ? ' is-read' : ''}`}
            style={{ left: '50%', top: '80%' }}
            onClick={() => setShowGame(true)}
          >
            <span className="hotspot-dot" aria-hidden="true">
              {progress.miniGameDone ? '✓' : '▶'}
            </span>
            <span className="hotspot-label">
              <strong>{ex.minigameName}</strong>
              <em>{progress.miniGameDone ? 'Completed — play again' : 'Interactive activity'}</em>
            </span>
          </button>

          <button
            className="hotspot hotspot--gallery"
            style={{ left: '88%', top: '16%' }}
            onClick={() => setShowGallery(true)}
          >
            <span className="hotspot-dot" aria-hidden="true">
              ⊞
            </span>
            <span className="hotspot-label">
              <strong>Museum gallery</strong>
              <em>Photographs</em>
            </span>
          </button>

          {film && (
            <button
              className="hotspot hotspot--film"
              style={{ left: '12%', top: '15%' }}
              onClick={() => {
                setShowFilm(true);
                sfx.play('click');
              }}
            >
              <span className="hotspot-dot" aria-hidden="true">
                ►
              </span>
              <span className="hotspot-label">
                <strong>Archival film</strong>
                <em>{film.title}</em>
              </span>
            </button>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------- progress + quiz */}
      <section className="room-footer">
        <div className="progress-summary">
          <h2 className="mini-head">This room</h2>
          <ol className="progress-steps">
            <li className={readCount >= SECTIONS_REQUIRED ? 'is-done' : ''}>
              Read the three learning stations
              <span>
                {readCount}/{SECTIONS_REQUIRED}
              </span>
            </li>
            <li className={progress.miniGameDone ? 'is-done' : ''}>
              Complete “{ex.minigameName}”
              <span>{progress.miniGameDone ? 'done' : 'not yet'}</span>
            </li>
            <li className={quizDone === quizTotal(exhibitId) ? 'is-done' : ''}>
              Answer four questions correctly
              <span>
                {quizDone}/{quizTotal(exhibitId)}
              </span>
            </li>
          </ol>
          {progress.completed && (
            <p className="room-complete-note">
              ✓ Exhibit complete
              {fiveComplete(save)
                ? ' — all five exhibits are done, so every evidence card is ready for the Economic Council.'
                : ' — evidence card collected.'}{' '}
              <button className="link-btn" onClick={() => setShowEvidence(true)}>
                View your evidence card
              </button>
            </p>
          )}
        </div>

        <div className="quiz-launch" ref={quizRef}>
          {showQuiz ? (
            <CFU
              exhibitId={exhibitId}
              answered={progress.quizCorrect}
              onAnswer={(qid, correct) => markQuestion(exhibitId, qid, correct)}
              onResetQuiz={() => resetQuiz(exhibitId)}
              onReviewLesson={() => setOpenStation(ex.stations[0].id)}
            />
          ) : (
            <div className="quiz-prompt">
              <h2 className="mini-head">Check for Understanding</h2>
              <p>
                Four questions, one at a time, with four choices each. Get one wrong and the quiz
                restarts from question 1 — so read the options carefully. Nothing is timed, nothing
                is scored, and you may attempt it as many times as you like.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setShowQuiz(true);
                  sfx.play('click');
                }}
              >
                Start the questions
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ---------------------------------------------------- overlays */}
      {openStation && (
        <LessonStationModal
          station={ex.stations.find((s) => s.id === openStation)!}
          onClose={() => setOpenStation(null)}
          onRead={() => markSectionRead(exhibitId, openStation)}
          alreadyRead={progress.readSections.includes(openStation)}
          reducedMotion={reduced}
        />
      )}

      {showGallery && (
        <Gallery
          exhibitId={exhibitId}
          exhibitTitle={ex.title}
          onClose={() => setShowGallery(false)}
        />
      )}

      {showFilm && film && <FilmModal film={film} onClose={() => setShowFilm(false)} />}

      {showGame && (
        <Modal
          title={ex.minigameName}
          subtitle={ex.minigameInstructions}
          onClose={() => setShowGame(false)}
          wide
          closeLabel="Back to the room"
        >
          {gameFor(() => markMinigameDone(exhibitId))}
        </Modal>
      )}

      {showHelp && (
        <Modal title={`Help — ${ex.title}`} onClose={() => setShowHelp(false)}>
          <h3 className="mini-head">What to do in this room</h3>
          <ol className="help-list">
            <li>
              Click the three numbered objects in the scene. Each opens a short lesson with a photograph.
              {readCount < SECTIONS_REQUIRED && (
                <strong> You have {SECTIONS_REQUIRED - readCount} left.</strong>
              )}
            </li>
            <li>
              Open “{ex.minigameName}” at the bottom of the scene. {ex.minigameInstructions}
              {!progress.miniGameDone && <strong> Not finished yet.</strong>}
            </li>
            <li>
              Answer the four questions below the scene. One wrong answer sends you back to question
              1, but your reading and activity stay done and there is no limit on attempts.
              {quizDone < quizTotal(exhibitId) && (
                <strong> {quizTotal(exhibitId) - quizDone} still to get right.</strong>
              )}
            </li>
          </ol>
          <h3 className="mini-head">If something will not work</h3>
          <ul className="help-list">
            <li>
              The gallery, the archival film and the introduction video are optional extras; none of
              them is needed to finish the room.
            </li>
            <li>The archival film needs an internet connection. If it will not play, use “Watch on YouTube”.</li>
            <li>Press Esc to close any window. Tab and Enter work everywhere the mouse does.</li>
            <li>Your progress saves automatically, so you can close the tab and come back.</li>
          </ul>
        </Modal>
      )}

      {showEvidence && (
        <Modal
          title="Evidence card earned"
          subtitle="Collect all five for the Economic Council"
          onClose={() => setShowEvidence(false)}
        >
          <div className="evidence-reveal">
            <EvidenceCard exhibitId={exhibitId} />
            <p>
              This card goes to the evidence wall in Exhibit 6, where you will use all five to judge
              the two Essential Questions.
            </p>
            <button className="btn btn-primary" onClick={onBackToHall}>
              Return to the hall →
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
