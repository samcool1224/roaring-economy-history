import { useState } from 'react';
import { sfx } from '../audio/sfx';

/**
 * Exhibit 1 minigame — Investigative Headline.
 * Collect three clues, then order them into a cause-and-effect story and print.
 */

interface Clue {
  id: string;
  object: string;
  headline: string;
  text: string;
}

const CLUES: Clue[] = [
  {
    id: 'bonds',
    object: 'Liberty Loan poster on the wall',
    headline: 'War orders wind down',
    text: 'The government had borrowed heavily and bought enormously during the war. With the fighting over, those orders stopped coming.',
  },
  {
    id: 'jobs',
    object: 'Help-wanted board by the door',
    headline: 'Returning workers, changing jobs',
    text: 'Servicemen came home looking for work just as factories were switching from war goods to civilian ones. Some industries hired; others let people go.',
  },
  {
    id: 'rates',
    object: 'Bank notice on the editor’s desk',
    headline: 'The discount rate rises',
    text: 'To fight the postwar rise in prices, the Federal Reserve raised discount rates. Borrowing got more expensive just as demand was already softening.',
  },
];

const SLOTS = [
  { id: 'slot1', label: 'First', want: 'bonds', caption: 'The war economy winds down' },
  { id: 'slot2', label: 'Then', want: 'jobs', caption: 'Businesses adjust; demand and jobs change' },
  { id: 'slot3', label: 'And so', want: 'rates', caption: 'Tighter credit and recession' },
];

export default function InvestigativeHeadline({ onComplete }: { onComplete: () => void }) {
  const [found, setFound] = useState<string[]>([]);
  const [reading, setReading] = useState<Clue | null>(null);
  const [placed, setPlaced] = useState<Record<string, string | null>>({
    slot1: null,
    slot2: null,
    slot3: null,
  });
  const [selected, setSelected] = useState<string | null>(null);
  const [checked, setChecked] = useState<null | 'right' | 'wrong'>(null);
  const [published, setPublished] = useState(false);

  const allFound = found.length === CLUES.length;
  const allPlaced = SLOTS.every((s) => placed[s.id]);

  const collect = (c: Clue) => {
    if (!found.includes(c.id)) {
      setFound((f) => [...f, c.id]);
      sfx.play('typewriter');
    }
    setReading(c);
  };

  const place = (slotId: string) => {
    if (!selected) return;
    setPlaced((p) => {
      const next = { ...p };
      // a card can only be in one slot
      for (const k of Object.keys(next)) if (next[k] === selected) next[k] = null;
      next[slotId] = selected;
      return next;
    });
    setSelected(null);
    setChecked(null);
    sfx.play('click');
  };

  const check = () => {
    const right = SLOTS.every((s) => placed[s.id] === s.want);
    setChecked(right ? 'right' : 'wrong');
    sfx.play(right ? 'chime' : 'wrong');
    if (right) {
      setTimeout(() => {
        setPublished(true);
        sfx.play('stamp');
        onComplete();
      }, 700);
    }
  };

  const reset = () => {
    setPlaced({ slot1: null, slot2: null, slot3: null });
    setSelected(null);
    setChecked(null);
    setPublished(false);
  };

  const usedCards = Object.values(placed).filter(Boolean) as string[];

  return (
    <div className="game game--newsroom">
      <div className="game-head">
        <h3>Investigative Headline</h3>
        <p>
          Step 1 — click all three clues in the newsroom. Step 2 — put them in a cause-and-effect
          order and print the edition.
        </p>
      </div>

      {/* --- step 1: collect --- */}
      <div className="clue-row">
        {CLUES.map((c) => (
          <button
            key={c.id}
            className={`clue-card${found.includes(c.id) ? ' is-found' : ''}`}
            onClick={() => collect(c)}
          >
            <span className="clue-icon" aria-hidden="true">
              {found.includes(c.id) ? '✓' : '?'}
            </span>
            <strong>{c.object}</strong>
            <span className="clue-sub">{found.includes(c.id) ? c.headline : 'Click to investigate'}</span>
          </button>
        ))}
      </div>

      {reading && (
        <div className="clue-readout" role="status">
          <strong>{reading.headline}</strong>
          <p>{reading.text}</p>
        </div>
      )}

      {/* --- step 2: order --- */}
      <div className={`sequence-area${allFound ? '' : ' is-disabled'}`}>
        <h4 className="mini-head">
          {allFound
            ? 'Now build the story: choose a clue, then click a slot.'
            : `Find all three clues first (${found.length}/3).`}
        </h4>

        <div className="card-tray">
          {CLUES.filter((c) => found.includes(c.id) && !usedCards.includes(c.id)).map((c) => (
            <button
              key={c.id}
              className={`seq-card${selected === c.id ? ' is-selected' : ''}`}
              onClick={() => setSelected(selected === c.id ? null : c.id)}
              disabled={!allFound}
            >
              {c.headline}
            </button>
          ))}
          {allFound && usedCards.length === CLUES.length && (
            <span className="muted-note">All three placed — check your story below.</span>
          )}
        </div>

        <div className="slot-row">
          {SLOTS.map((s) => {
            const card = CLUES.find((c) => c.id === placed[s.id]);
            return (
              <div key={s.id} className="slot-wrap">
                <span className="slot-label">{s.label}</span>
                <button
                  className={`seq-slot${card ? ' is-filled' : ''}${
                    checked === 'wrong' && placed[s.id] !== s.want ? ' is-wrong' : ''
                  }${checked === 'right' ? ' is-right' : ''}`}
                  onClick={() => (card ? setPlaced((p) => ({ ...p, [s.id]: null })) : place(s.id))}
                  disabled={!allFound || (!card && !selected)}
                >
                  {card ? card.headline : selected ? 'Place here' : 'Empty'}
                </button>
              </div>
            );
          })}
        </div>

        <div className="game-actions">
          <button className="btn btn-primary" onClick={check} disabled={!allPlaced || published}>
            Check the story
          </button>
          <button className="btn btn-ghost btn-small" onClick={reset}>
            Restart activity
          </button>
        </div>

        {checked === 'wrong' && (
          <p className="game-feedback is-wrong" role="status">
            Not in that order. Start with what changed first — the end of the war itself — and finish
            with the squeeze on credit that came as the Federal Reserve responded.
          </p>
        )}
      </div>

      {published && (
        <div className="newspaper-out" role="status">
          <div className="newspaper">
            <span className="newspaper-masthead">THE DAILY LEDGER</span>
            <span className="newspaper-date">1921</span>
            <h4 className="newspaper-headline">
              Postwar Adjustments and Tight Credit Contribute to Recession
            </h4>
            <div className="newspaper-cols">
              <p>
                War orders ended, factories changed what they made, workers moved between industries,
                and the Federal Reserve raised rates against rising prices. Together these pressures
                produced a sharp downturn in 1920 and 1921.
              </p>
              <p>
                Recovery from that slump came before the prosperity of the middle of the decade — a
                boom that was still years away when this edition went to press.
              </p>
            </div>
          </div>
          <p className="game-note">
            <strong>A historian's caution:</strong> these causes overlapped rather than happening in
            a strict chain. The order you just built is a way of <em>organising</em> the story, not a
            rigid chronology — and not every returning soldier was unemployed.
          </p>
        </div>
      )}
    </div>
  );
}
