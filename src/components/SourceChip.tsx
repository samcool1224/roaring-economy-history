import { SOURCE_TYPE_LABEL, sourceById } from '../data/sources';

/** Small source credit shown on every lesson station and gallery item. */
export default function SourceChip({ id }: { id: string }) {
  const s = sourceById(id);
  if (!s) return null;
  const icon =
    s.sourceType === 'primary' ? '◆' : s.sourceType === 'secondary' ? '◇' : '✎';
  return (
    <a
      className={`source-chip source-chip--${s.sourceType}`}
      href={s.pageURL}
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="source-chip-icon" aria-hidden="true">
        {icon}
      </span>
      <span className="source-chip-text">
        <strong>{SOURCE_TYPE_LABEL[s.sourceType]}</strong>
        <span>
          {s.title} · {s.institution} · {s.date}
        </span>
      </span>
      <span className="source-chip-go" aria-hidden="true">
        ↗
      </span>
      <span className="sr-only">Opens at the source in a new tab</span>
    </a>
  );
}
