import Modal from './Modal';
import EvidenceCard from './EvidenceCard';
import { useMuseum } from '../state/MuseumContext';
import { EXHIBITS } from '../data/exhibits';

interface Props {
  onClose: () => void;
  onRestart: () => void;
  onBackToHall: () => void;
}

/** Restrained finish: a record of what was examined, with no score or leaderboard. */
export default function Certificate({ onClose, onRestart, onBackToHall }: Props) {
  const { save } = useMuseum();

  return (
    <Modal title="Museum complete" onClose={onClose} wide closeLabel="Close">
      <div className="certificate">
        <div className="cert-rule" aria-hidden="true" />
        <span className="cert-eyebrow">The Roaring Economy</span>
        <h2 className="cert-title">Certificate of Completion</h2>
        <p className="cert-line">
          This visitor walked all six galleries of <em>A Walk Through America's Boom, 1919–1929</em>,
          collected five pieces of historical evidence, and delivered a verdict on the decade
          supported by a source.
        </p>
        <div className="cert-rule" aria-hidden="true" />

        <ul className="cert-rooms">
          {EXHIBITS.map((e) => (
            <li key={e.id} className={save.exhibits[e.id]?.completed ? 'is-done' : ''}>
              <span className="cert-num">{e.id}</span>
              {e.title}
              <span className="cert-tick">{save.exhibits[e.id]?.completed ? '✓' : '—'}</span>
            </li>
          ))}
        </ul>

        <h3 className="mini-head">Your evidence</h3>
        <div className="evidence-strip">
          {save.evidence
            .filter((id) => id <= 5)
            .map((id) => (
              <EvidenceCard key={id} exhibitId={id} compact />
            ))}
        </div>

        <p className="cert-closing">
          The conclusion this museum asks you to carry away is not that the 1920s were good or bad.
          It is that growth and vulnerability were produced by the same decisions — and that asking
          <em> who benefited and who carried the cost</em> is part of judging any economy, including
          one you live in.
        </p>

        <div className="cert-actions">
          <button className="btn btn-primary" onClick={onBackToHall}>
            Return to the hall — rooms stay open
          </button>
          <button className="btn btn-ghost" onClick={onRestart}>
            Start a fresh visit
          </button>
        </div>
        <p className="muted-note">
          No score and no leaderboard. Every room stays open so you can revisit anything.
        </p>
      </div>
    </Modal>
  );
}
