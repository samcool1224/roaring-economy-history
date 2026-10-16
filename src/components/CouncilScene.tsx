import { useState } from 'react';
import {
  ESSENTIAL_QUESTIONS,
  EXHIBITS,
  FINAL_JUDGEMENT,
  exhibitById,
} from '../data/exhibits';
import { sourceById } from '../data/sources';
import { useMuseum } from '../state/MuseumContext';
import RoomBackdrop from '../art/RoomBackdrop';
import NarrationVideo from './NarrationVideo';
import EvidenceCard from './EvidenceCard';
import Modal from './Modal';
import TheTicker from '../games/TheTicker';
import Certificate from './Certificate';
import { sfx } from '../audio/sfx';

interface Props {
  onBackToHall: () => void;
  onGoToExhibit: (id: number) => void;
  onRestart: () => void;
}

export default function CouncilScene({
  onBackToHall,
  onGoToExhibit,
  onRestart,
}: Props) {
  const ex = exhibitById(6);
  const { save, markPlaqueRead, markFinalGameDone, completeMuseum, markVisited } = useMuseum();
  const [stage, setStage] = useState<'intro' | 'room'>(
    save.exhibits[6].visited ? 'room' : 'intro',
  );
  const [openPlaque, setOpenPlaque] = useState<'A2' | 'C2' | null>(null);
  const [showGame, setShowGame] = useState(false);
  const [showRadio, setShowRadio] = useState(false);
  const [verdict, setVerdict] = useState<'A' | 'B' | 'C' | null>(null);
  const [chosenCard, setChosenCard] = useState<number | null>(null);
  const [showCertificate, setShowCertificate] = useState(false);

  const bothRead = save.plaquesRead.includes('A2') && save.plaquesRead.includes('C2');
  const verdictRight = verdict === FINAL_JUDGEMENT.correct;
  const canComplete = save.finalGameDone && verdictRight && chosenCard !== null;

  if (stage === 'intro') {
    return (
      <div className="exhibit-intro" style={{ ['--accent' as string]: ex.accent }}>
        <div className="intro-inner">
          <span className="intro-eyebrow">Exhibit 6 · The finale</span>
          <h1>{ex.title}</h1>
          <p className="intro-subtitle">{ex.subtitle}</p>
          <NarrationVideo
            src={ex.narrationVideo}
            exhibitTitle={ex.title}
            onContinue={() => {
              setStage('room');
              markVisited(6);
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
    <div className="exhibit-room council" style={{ ['--accent' as string]: ex.accent }}>
      <header className="room-bar">
        <div className="room-bar-left">
          <button className="btn btn-ghost btn-small" onClick={onBackToHall}>
            ← Back to the hall
          </button>
          <div className="room-title-block">
            <span className="room-eyebrow">Exhibit 6 · Essential Questions</span>
            <h1>{ex.title}</h1>
          </div>
        </div>
        <ul className="task-chips">
          <li className={`task-chip${bothRead ? ' is-done' : ''}`}>
            {bothRead ? '✓' : '○'} Plaques {save.plaquesRead.filter((p) => p === 'A2' || p === 'C2').length}/2
          </li>
          <li className={`task-chip${save.finalGameDone ? ' is-done' : ''}`}>
            {save.finalGameDone ? '✓' : '○'} Final simulation
          </li>
          <li className={`task-chip${verdictRight && chosenCard !== null ? ' is-done' : ''}`}>
            {verdictRight && chosenCard !== null ? '✓' : '○'} Verdict
          </li>
        </ul>
      </header>

      <div className="scene-wrap">
        <RoomBackdrop exhibit={6} animate={!save.prefs.reducedMotion} />
        <div className="hotspot-layer">
          <button
            className={`hotspot hotspot--plaque${save.plaquesRead.includes('A2') ? ' is-read' : ''}`}
            style={{ left: '21%', top: '56%' }}
            onClick={() => {
              setOpenPlaque('A2');
              sfx.play('page');
            }}
          >
            <span className="hotspot-dot" aria-hidden="true">
              A2
            </span>
            <span className="hotspot-label">
              <strong>Essential Question A2</strong>
              <em>{save.plaquesRead.includes('A2') ? 'Read — open again' : 'Click to read'}</em>
            </span>
          </button>

          <button
            className={`hotspot hotspot--plaque${save.plaquesRead.includes('C2') ? ' is-read' : ''}`}
            style={{ left: '72%', top: '56%' }}
            onClick={() => {
              setOpenPlaque('C2');
              sfx.play('page');
            }}
          >
            <span className="hotspot-dot" aria-hidden="true">
              C2
            </span>
            <span className="hotspot-label">
              <strong>Essential Question C2</strong>
              <em>{save.plaquesRead.includes('C2') ? 'Read — open again' : 'Click to read'}</em>
            </span>
          </button>

          <button
            className={`hotspot hotspot--game${save.finalGameDone ? ' is-read' : ''}`}
            style={{ left: '49%', top: '60%' }}
            onClick={() => {
              if (bothRead) setShowGame(true);
            }}
            disabled={!bothRead}
            title={bothRead ? undefined : 'Read both plaques first'}
          >
            <span className="hotspot-dot" aria-hidden="true">
              {save.finalGameDone ? '✓' : bothRead ? '▶' : '🔒'}
            </span>
            <span className="hotspot-label">
              <strong>The Ticker: Boom to Bust</strong>
              <em>{bothRead ? 'Final simulation' : 'Read both plaques to unlock'}</em>
            </span>
          </button>

          <button
            className="hotspot hotspot--gallery"
            style={{ left: '88%', top: '66%' }}
            onClick={() => setShowRadio(true)}
          >
            <span className="hotspot-dot" aria-hidden="true">
              ♪
            </span>
            <span className="hotspot-label">
              <strong>The gramophone</strong>
              <em>Coolidge, 1924 (optional)</em>
            </span>
          </button>

        </div>
      </div>

      {/* ---------------------------------------------------- evidence wall */}
      <section className="evidence-wall">
        <h2 className="mini-head">The evidence wall — what you collected</h2>
        <div className="evidence-strip">
          {EXHIBITS.slice(0, 5).map((e) => (
            <div key={e.id} className={save.evidence.includes(e.id) ? '' : 'is-missing'}>
              {save.evidence.includes(e.id) ? (
                <EvidenceCard exhibitId={e.id} compact />
              ) : (
                <div className="evidence-card is-compact is-empty">
                  <span className="evidence-num">{e.id}</span>
                  <span className="evidence-room">{e.title}</span>
                  <p className="evidence-claim">Not yet collected</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- the verdict */}
      <section className="verdict-section">
        <h2 className="mini-head">The council's verdict</h2>
        {!save.finalGameDone ? (
          <p className="verdict-locked">
            {bothRead
              ? 'Run the final simulation above, then deliver your verdict here.'
              : 'Read both Essential Question plaques, run the simulation, then deliver your verdict here.'}
          </p>
        ) : (
          <>
            <p className="verdict-prompt">{FINAL_JUDGEMENT.prompt}</p>
            <ul className="cfu-choices">
              {FINAL_JUDGEMENT.choices.map((c) => {
                const picked = verdict === c.key;
                const right = c.key === FINAL_JUDGEMENT.correct;
                return (
                  <li key={c.key}>
                    <button
                      className={`cfu-choice${picked && right ? ' is-correct' : ''}${picked && !right ? ' is-wrong' : ''}`}
                      onClick={() => {
                        setVerdict(c.key);
                        sfx.play(right ? 'chime' : 'wrong');
                      }}
                      disabled={verdictRight}
                    >
                      <span className="cfu-key">{c.key}</span>
                      <span>{c.text}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {verdict && (
              <div className={`cfu-feedback${verdictRight ? ' is-correct' : ' is-wrong'}`} role="status">
                <strong>{verdictRight ? 'The council agrees' : 'Reconsider'}</strong>
                <p>{FINAL_JUDGEMENT.choices.find((c) => c.key === verdict)!.feedback}</p>
                {!verdictRight && (
                  <button className="btn btn-small" onClick={() => setVerdict(null)}>
                    Try again
                  </button>
                )}
              </div>
            )}

            {verdictRight && (
              <div className="pick-evidence">
                <h3 className="mini-head">
                  Now cite one piece of evidence that supports that verdict
                </h3>
                <p className="muted-note">
                  A judgement without a source behind it is just an opinion. Click one card.
                </p>
                <div className="evidence-strip is-pickable">
                  {[1, 2, 3, 4, 5].map((id) => (
                      <EvidenceCard
                        key={id}
                        exhibitId={id}
                        compact
                        selected={chosenCard === id}
                        onClick={() => {
                          setChosenCard(id);
                          sfx.play('click');
                        }}
                      />
                    ))}
                </div>
                {chosenCard !== null && (
                  <p className="game-feedback is-right">
                    Cited: <strong>{exhibitById(chosenCard).title}</strong> —{' '}
                    {sourceById(exhibitById(chosenCard).evidenceSourceId)?.institution}. That card
                    supports the verdict because it records one of the specific ways growth and
                    vulnerability existed side by side.
                  </p>
                )}
              </div>
            )}

            <button
              className="btn btn-primary btn-large"
              disabled={!canComplete}
              onClick={() => {
                completeMuseum();
                setShowCertificate(true);
                sfx.play('stamp');
              }}
            >
              {canComplete ? 'Complete Museum' : 'Finish the simulation, verdict and citation first'}
            </button>
          </>
        )}
      </section>

      {/* ---------------------------------------------------- overlays */}
      {openPlaque && (
        <PlaqueModal
          code={openPlaque}
          onClose={() => setOpenPlaque(null)}
          onRead={() => markPlaqueRead(openPlaque)}
          onGoToExhibit={onGoToExhibit}
          alreadyRead={save.plaquesRead.includes(openPlaque)}
        />
      )}

      {showGame && (
        <Modal
          title="THE TICKER: Boom to Bust"
          subtitle="A fictional stock, three rounds, and what leverage does in both directions"
          onClose={() => setShowGame(false)}
          wide
          closeLabel="Back to the chamber"
        >
          <TheTicker onComplete={markFinalGameDone} />
        </Modal>
      )}

      {showRadio && <RadioModal onClose={() => setShowRadio(false)} />}

      {showCertificate && (
        <Certificate
          onClose={() => setShowCertificate(false)}
          onRestart={onRestart}
          onBackToHall={onBackToHall}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ plaque */

function PlaqueModal({
  code,
  onClose,
  onRead,
  onGoToExhibit,
  alreadyRead,
}: {
  code: 'A2' | 'C2';
  onClose: () => void;
  onRead: () => void;
  onGoToExhibit: (id: number) => void;
  alreadyRead: boolean;
}) {
  const eq = ESSENTIAL_QUESTIONS.find((q) => q.code === code)!;
  return (
    <Modal title={`Essential Question ${code}`} onClose={onClose} wide>
      <div className="plaque">
        <blockquote className="plaque-question">{eq.question}</blockquote>
        <div className="plaque-body">
          {eq.paragraph.split('. ').reduce<string[][]>((acc, sentence, i) => {
            // Break the paragraph into two readable blocks without changing a word.
            const idx = i < 4 ? 0 : 1;
            acc[idx] = acc[idx] ?? [];
            acc[idx].push(sentence);
            return acc;
          }, []).map((block, i) => (
            <p key={i}>{block.join('. ') + (i === 0 ? '.' : '')}</p>
          ))}
        </div>
        <div className="plaque-evidence">
          <h3 className="mini-head">Historical evidence for this answer</h3>
          <div className="plaque-links">
            {eq.evidenceExhibits.map((id) => (
              <button key={id} className="btn btn-small" onClick={() => onGoToExhibit(id)}>
                Exhibit {id}: {exhibitById(id).title} →
              </button>
            ))}
          </div>
        </div>
      </div>
      <footer className="modal-foot">
        <button
          className="btn btn-primary"
          onClick={() => {
            onRead();
            onClose();
          }}
        >
          {alreadyRead ? 'Close' : 'Mark as read and close'}
        </button>
        {alreadyRead && <span className="done-tick">✓ Already read</span>}
      </footer>
    </Modal>
  );
}

/* ------------------------------------------------------------------- radio */

function RadioModal({ onClose }: { onClose: () => void }) {
  const coolidge = sourceById('commons-coolidge-speech-1924')!;
  const loc = sourceById('loc-coolidge-administration')!;
  return (
    <Modal title="The gramophone" subtitle="Optional period audio" onClose={onClose}>
      <p>
        The council chamber keeps one recording: President Calvin Coolidge speaking in 1924 on taxes,
        liberty and the philosophy of government. It is the political half of Essential Question A2 in
        the president's own voice.
      </p>
      <p className="muted-note">
        We link out to listen rather than playing an excerpt here, because we have not verified a
        word-for-word transcript and this museum does not put quotation marks around anything it has
        not checked.
      </p>
      <div className="radio-links">
        <a className="btn btn-primary" href={coolidge.pageURL} target="_blank" rel="noopener noreferrer">
          Listen at the source ↗
        </a>
        <a className="btn btn-ghost" href={loc.pageURL} target="_blank" rel="noopener noreferrer">
          Library of Congress on Coolidge economic policy ↗
        </a>
      </div>
      <p className="gallery-credit">{coolidge.displayAttribution}</p>
    </Modal>
  );
}
