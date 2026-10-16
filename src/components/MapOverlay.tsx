import Modal from './Modal';
import { EXHIBITS } from '../data/exhibits';
import { useMuseum } from '../state/MuseumContext';
import {
  isExhibitUnlocked,
  quizCorrectCount,
  quizTotal,
  sectionsRead,
  SECTIONS_REQUIRED,
} from '../state/progress';

interface Props {
  onClose: () => void;
  onGoTo: (id: number) => void;
}

export default function MapOverlay({ onClose, onGoTo }: Props) {
  const { save } = useMuseum();
  return (
    <Modal title="Museum map" subtitle="Exhibits 1–5 in any order, then the Economic Council" onClose={onClose} wide>
      <ul className="map-list">
        {EXHIBITS.map((ex) => {
          const p = save.exhibits[ex.id];
          const unlocked = isExhibitUnlocked(save, ex.id);
          const read = sectionsRead(p, ex.id);
          return (
            <li key={ex.id} className={`map-item${unlocked ? '' : ' is-locked'}${p.completed ? ' is-done' : ''}`}>
              <span className="map-num" style={{ background: unlocked ? ex.accent : '#4a4a54' }}>
                {p.completed ? '✓' : ex.id}
              </span>
              <div className="map-meta">
                <h3>{ex.doorSign}</h3>
                <p>
                  {ex.title} — {ex.subtitle}
                </p>
                {unlocked ? (
                  ex.id === 6 ? (
                    <span className="map-status">
                      {save.museumComplete
                        ? 'Complete'
                        : `Plaques ${save.plaquesRead.length}/2 · simulation ${save.finalGameDone ? 'done' : 'not run'}`}
                    </span>
                  ) : (
                    <span className="map-status">
                      Sections {read}/{SECTIONS_REQUIRED} · activity {p.miniGameDone ? 'done' : 'not done'} ·
                      questions {quizCorrectCount(p, ex.id)}/{quizTotal(ex.id)}
                    </span>
                  )
                ) : (
                  <span className="map-status is-locked">
                    Locked — finish Exhibits 1–5 to unlock
                  </span>
                )}
              </div>
              <button className="btn btn-small" disabled={!unlocked} onClick={() => onGoTo(ex.id)}>
                {unlocked ? (p.visited ? 'Revisit' : 'Enter') : 'Locked'}
              </button>
            </li>
          );
        })}
      </ul>
    </Modal>
  );
}
