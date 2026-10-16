import { useState } from 'react';
import { sfx } from '../audio/sfx';

/**
 * Exhibit 4 minigame — Transform the Map.
 * Click a force of change, then click the zone it reshaped most. The map
 * animates. Afterwards the game insists that none of these forces touched only
 * one kind of community.
 */

type Zone = 'urban' | 'suburban' | 'rural';

interface Card {
  id: string;
  name: string;
  icon: string;
  want: Zone;
  right: string;
  elsewhere: string;
}

const CARDS: Card[] = [
  {
    id: 'factory',
    name: 'Factory growth',
    icon: '🏭',
    want: 'urban',
    right: 'Manufacturing concentrated in cities, drawing workers toward them. The 1920 census was the first in which most Americans counted as urban.',
    elsewhere:
      'But factory goods were sold everywhere, and farm machinery came out of those same factories — rural life was reshaped by urban industry it did not host.',
  },
  {
    id: 'autos',
    name: 'Automobiles & commuting',
    icon: '🚗',
    want: 'suburban',
    right: 'Once a household could drive, it could live further from work. That is the central mechanism behind suburban growth in the decade.',
    elsewhere:
      'Cars also changed the farm — trucks carried crops to market and ended some rural isolation — and they clogged city streets built for horses.',
  },
  {
    id: 'roads',
    name: 'Roads & housing',
    icon: '🛣',
    want: 'suburban',
    right: 'Road building and new construction opened land outside the centre for housing, shops and services.',
    elsewhere:
      'Roads were a rural story too, connecting farms to markets — and the new housing was closed to many families by covenants and lending practices, whatever the road reached.',
  },
  {
    id: 'farm',
    name: 'Farm mechanization',
    icon: '🚜',
    want: 'rural',
    right: 'Tractors and trucks let fewer people farm more land. Output rose — which, with prices falling, is exactly what made the decade so hard for farm incomes.',
    elsewhere:
      'The machines were built in city factories and bought with credit arranged in town. And people leaving mechanised farms became part of urban growth.',
  },
];

const ZONE_LABEL: Record<Zone, string> = {
  urban: 'The city',
  suburban: 'The suburb',
  rural: 'The farm',
};

export default function TransformTheMap({ onComplete }: { onComplete: () => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [placed, setPlaced] = useState<Record<string, Zone>>({});
  const [feedback, setFeedback] = useState<{ card: Card; ok: boolean } | null>(null);
  const [showOverlay, setShowOverlay] = useState(false);
  const [badge, setBadge] = useState(false);
  const [done, setDone] = useState(false);

  const levels = {
    urban: Object.entries(placed).filter(([, z]) => z === 'urban').length,
    suburban: Object.entries(placed).filter(([, z]) => z === 'suburban').length,
    rural: Object.entries(placed).filter(([, z]) => z === 'rural').length,
  };

  const drop = (zone: Zone) => {
    if (!selected) return;
    const card = CARDS.find((c) => c.id === selected)!;
    const ok = card.want === zone;
    if (ok) {
      sfx.play('chime');
      const next = { ...placed, [card.id]: zone };
      setPlaced(next);
      setSelected(null);
      setFeedback({ card, ok: true });
      if (Object.keys(next).length === CARDS.length) {
        setTimeout(() => setShowOverlay(true), 650);
      }
    } else {
      sfx.play('wrong');
      setFeedback({ card, ok: false });
    }
  };

  const finish = () => {
    setShowOverlay(false);
    if (!done) {
      setDone(true);
      onComplete();
    }
  };

  const restart = () => {
    setPlaced({});
    setSelected(null);
    setFeedback(null);
    setShowOverlay(false);
  };

  return (
    <div className="game game--map">
      <div className="game-head">
        <h3>Transform the Map</h3>
        <p>
          Choose a force of change, then choose the zone it reshaped most. Click works with the mouse
          or the keyboard — no dragging needed.
        </p>
      </div>

      <div className="force-row">
        {CARDS.map((c) => {
          const used = !!placed[c.id];
          return (
            <button
              key={c.id}
              className={`force-card${selected === c.id ? ' is-selected' : ''}${used ? ' is-used' : ''}`}
              onClick={() => !used && setSelected(selected === c.id ? null : c.id)}
              disabled={used}
              aria-pressed={selected === c.id}
            >
              <span className="force-icon" aria-hidden="true">
                {c.icon}
              </span>
              <strong>{c.name}</strong>
              <span className="force-state">{used ? `→ ${ZONE_LABEL[placed[c.id]]}` : 'Select'}</span>
            </button>
          );
        })}
      </div>

      <p className="game-instruction">
        {selected
          ? `“${CARDS.find((c) => c.id === selected)!.name}” selected — now click a zone below.`
          : `Select a force of change above. ${Object.keys(placed).length}/4 placed.`}
      </p>

      <div className="map-board">
        {(['urban', 'suburban', 'rural'] as Zone[]).map((z) => (
          <button
            key={z}
            className={`map-zone map-zone--${z}${selected ? ' is-droppable' : ''}`}
            onClick={() => drop(z)}
            disabled={!selected}
          >
            <span className="zone-title">{ZONE_LABEL[z]}</span>
            <ZoneArt zone={z} level={levels[z]} />
            <span className="zone-count">{levels[z] > 0 ? `${levels[z]} change${levels[z] > 1 ? 's' : ''} applied` : ''}</span>
          </button>
        ))}
      </div>

      {feedback && (
        <div className={`game-feedback ${feedback.ok ? 'is-right' : 'is-wrong'}`} role="status">
          {feedback.ok ? (
            <>
              <strong>{feedback.card.name} → {ZONE_LABEL[feedback.card.want]}.</strong> {feedback.card.right}
            </>
          ) : (
            <>
              <strong>Try another zone.</strong> {feedback.card.name} certainly touched that area, but
              it reshaped a different one most directly. Think about where the change actually built
              something new.
            </>
          )}
        </div>
      )}

      {!badge && levels.urban > 0 && (
        <button
          className="badge-btn"
          onClick={() => {
            setBadge(true);
            sfx.play('stamp');
          }}
        >
          ★ Optional: claim the “1920 — majority urban” milestone badge
        </button>
      )}
      {badge && (
        <p className="badge-earned">
          ★ <strong>Milestone badge earned.</strong> In the 1920 census, more than half the United
          States population was classified as urban for the first time. It is a milestone about an
          official definition and a long trend — not a sudden change in how people lived.
        </p>
      )}

      {showOverlay && (
        <div className="map-overlay" role="status">
          <h4>All four placed — now the complication</h4>
          <p>
            None of these technologies affected only one kind of community. The honest version of this
            map is messier than four cards in three boxes:
          </p>
          <ul className="overlay-list">
            {CARDS.map((c) => (
              <li key={c.id}>
                <strong>{c.name}:</strong> {c.elsewhere}
              </li>
            ))}
          </ul>
          <p className="overlay-closer">
            So the finding is not “cities won and farms lost.” Suburbs grew for households that could
            afford and were permitted to buy there. Farms gained real machinery and still faced falling
            prices and debt. The benefits <em>varied</em> — that variation is the historical point.
          </p>
          <button className="btn btn-primary" onClick={finish}>
            Understood — finish the activity
          </button>
        </div>
      )}

      <div className="game-actions">
        <button className="btn btn-ghost btn-small" onClick={restart}>
          Restart activity
        </button>
      </div>
    </div>
  );
}

function ZoneArt({ zone, level }: { zone: Zone; level: number }) {
  const grow = Math.min(level, 2);
  if (zone === 'urban')
    return (
      <svg viewBox="0 0 120 80" className="zone-art" aria-hidden="true">
        <rect width="120" height="80" fill="#223049" />
        {[8, 26, 44, 62, 80, 98].map((x, i) => {
          const h = 22 + (i % 3) * 10 + grow * 12;
          return (
            <g key={x}>
              <rect x={x} y={74 - h} width="14" height={h} fill={i % 2 ? '#39465f' : '#2f3b52'} />
              {Array.from({ length: Math.floor(h / 10) }).map((_, r) => (
                <rect key={r} x={x + 3} y={78 - h + r * 10} width="8" height="3" fill="#c8a45c" opacity="0.7" />
              ))}
            </g>
          );
        })}
        <rect y="74" width="120" height="6" fill="#171f30" />
      </svg>
    );
  if (zone === 'suburban')
    return (
      <svg viewBox="0 0 120 80" className="zone-art" aria-hidden="true">
        <rect width="120" height="80" fill="#2a3a4e" />
        <rect y="52" width="120" height="28" fill="#4a6b4f" opacity="0.6" />
        {Array.from({ length: 1 + grow * 2 }).map((_, i) => {
          const x = 8 + i * 24;
          return (
            <g key={i}>
              <rect x={x} y="44" width="18" height="14" fill="#d8cbae" />
              <polygon points={`${x - 2},44 ${x + 9},34 ${x + 20},44`} fill="#5e2733" />
            </g>
          );
        })}
        <rect y="64" width="120" height="7" fill="#4a4a54" />
        {grow > 0 && <rect x="14" y="66" width="9" height="3" fill="#b2563a" />}
        {grow > 1 && <rect x="70" y="66" width="9" height="3" fill="#7fa8c9" />}
      </svg>
    );
  return (
    <svg viewBox="0 0 120 80" className="zone-art" aria-hidden="true">
      <rect width="120" height="80" fill="#3b4a5e" />
      <rect y="44" width="120" height="36" fill="#6d7a4a" />
      <polygon points="12,44 26,30 40,44" fill="#5e2733" />
      <rect x="16" y="44" width="20" height="18" fill="#8a4a3a" />
      {Array.from({ length: 4 + grow * 4 }).map((_, i) => (
        <g key={i}>
          <rect x={48 + i * 8} y="50" width="2" height="12" fill="#c8a45c" />
          <circle cx={49 + i * 8} cy="48" r="2.5" fill="#e0c87a" />
        </g>
      ))}
      {grow > 0 && (
        <g>
          <rect x="60" y="64" width="22" height="8" rx="2" fill="#b2563a" />
          <circle cx="66" cy="73" r="4" fill="#241c14" />
          <circle cx="79" cy="73" r="3" fill="#241c14" />
        </g>
      )}
    </svg>
  );
}
