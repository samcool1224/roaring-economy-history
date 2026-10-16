import { exhibitById } from '../data/exhibits';
import { sourceById } from '../data/sources';

interface Props {
  exhibitId: number;
  compact?: boolean;
  onClick?: () => void;
  selected?: boolean;
}

/** A collectible card: one historical claim plus the source that supports it. */
export default function EvidenceCard({ exhibitId, compact, onClick, selected }: Props) {
  const ex = exhibitById(exhibitId);
  const src = sourceById(ex.evidenceSourceId);
  const Tag = onClick ? 'button' : 'div';

  return (
    <Tag
      className={`evidence-card${compact ? ' is-compact' : ''}${selected ? ' is-selected' : ''}${onClick ? ' is-clickable' : ''}`}
      onClick={onClick}
      style={{ borderColor: ex.accent }}
      {...(onClick ? { type: 'button' as const } : {})}
    >
      <span className="evidence-num" style={{ background: ex.accent }}>
        {exhibitId}
      </span>
      <span className="evidence-room">{ex.title}</span>
      <p className="evidence-claim">“{ex.evidenceClaim}”</p>
      {src && (
        <span className="evidence-source">
          Source: {src.title} — {src.institution}
        </span>
      )}
      {selected && <span className="evidence-check">✓ selected</span>}
    </Tag>
  );
}
