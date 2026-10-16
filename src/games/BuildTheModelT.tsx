import { useEffect, useRef, useState } from 'react';
import { sfx } from '../audio/sfx';

/**
 * Exhibit 2 minigame — Build the Model T.
 *
 * Round 1: build a car by hand, one part at a time, walking to each part.
 * Round 2: start the moving line and fit parts as the body comes to you.
 * Then: trace five supplier industries. Three viewed finishes the activity.
 *
 * The "ticks" below are invented game units for comparison only. They are NOT
 * real Ford factory timings and the game says so on screen.
 */

const PARTS = ['Chassis', 'Engine', 'Wheels', 'Body'] as const;
type Part = (typeof PARTS)[number];

const SUPPLIERS = [
  {
    id: 'steel',
    name: 'Steel',
    icon: '▬',
    text: 'Frames, engine blocks and body panels all meant steel. Automobile demand became one of the largest single markets for American steel in the decade.',
  },
  {
    id: 'rubber',
    name: 'Rubber',
    icon: '◎',
    text: 'Every car needed tires, and tires wore out. Rubber manufacturing — and the plantations that supplied it — grew with the car industry.',
  },
  {
    id: 'oil',
    name: 'Oil & gasoline',
    icon: '◆',
    text: 'Cars burn fuel. Rising car ownership drove demand for petroleum, refining, and the roadside filling stations that became ordinary sights.',
  },
  {
    id: 'glass',
    name: 'Plate glass',
    icon: '▢',
    text: 'Windshields and windows required flat glass in quantities that pushed the glass industry to change how it produced.',
  },
  {
    id: 'roads',
    name: 'Roads & construction',
    icon: '═',
    text: 'Cars are only useful on surfaces built for them. Road building drew in public money, concrete, labour — and reshaped where people could live.',
  },
];

type Phase = 'manual' | 'manual-done' | 'line' | 'line-done' | 'suppliers';

export default function BuildTheModelT({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>('manual');
  const [manualIdx, setManualIdx] = useState(0);
  const [manualTicks, setManualTicks] = useState(0);
  const [lineTicks, setLineTicks] = useState(0);
  const [lineIdx, setLineIdx] = useState(0);
  const [carX, setCarX] = useState(0);
  const [viewed, setViewed] = useState<string[]>([]);
  const [openSupplier, setOpenSupplier] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const timer = useRef<number | null>(null);

  // Manual round: each part costs ticks because the worker fetches it.
  useEffect(() => {
    if (phase !== 'manual') return;
    timer.current = window.setInterval(() => setManualTicks((t) => t + 1), 110);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [phase]);

  // Line round: the body advances and the worker stays put.
  useEffect(() => {
    if (phase !== 'line') return;
    timer.current = window.setInterval(() => {
      setLineTicks((t) => t + 1);
      setCarX((x) => Math.min(100, x + 1.6));
    }, 110);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [phase]);

  const fitManual = (p: Part) => {
    if (p !== PARTS[manualIdx]) {
      sfx.play('wrong');
      return;
    }
    sfx.play('click');
    // Walking to fetch the next part costs extra time in this method.
    setManualTicks((t) => t + 6);
    if (manualIdx + 1 === PARTS.length) {
      setPhase('manual-done');
      sfx.play('chime');
    } else setManualIdx((i) => i + 1);
  };

  const fitLine = (p: Part) => {
    if (p !== PARTS[lineIdx]) {
      sfx.play('wrong');
      return;
    }
    sfx.play('conveyor');
    if (lineIdx + 1 === PARTS.length) {
      setPhase('line-done');
      sfx.play('chime');
    } else setLineIdx((i) => i + 1);
  };

  const openSup = (id: string) => {
    setOpenSupplier(id);
    if (!viewed.includes(id)) {
      const next = [...viewed, id];
      setViewed(next);
      sfx.play('click');
      if (next.length >= 3 && !done) {
        setDone(true);
        onComplete();
      }
    }
  };

  const restart = () => {
    setPhase('manual');
    setManualIdx(0);
    setManualTicks(0);
    setLineTicks(0);
    setLineIdx(0);
    setCarX(0);
  };

  return (
    <div className="game game--factory">
      <div className="game-head">
        <h3>Build the Model T</h3>
        <p>
          Build one car the old way, then start the moving line and build another. Compare them.
        </p>
      </div>

      <p className="sim-flag">
        The “ticks” below are invented units for comparing the two methods inside this game. They are
        not real Ford factory timings.
      </p>

      {/* ------------------------------------------------ round 1: by hand */}
      {(phase === 'manual' || phase === 'manual-done') && (
        <section className="round">
          <h4 className="mini-head">Round 1 — one worker, one whole car</h4>
          <div className="assembly-stage">
            <CarDiagram built={manualIdx} />
            <div className="tick-readout">
              <span className="tick-num">{manualTicks}</span>
              <span className="tick-label">ticks</span>
            </div>
          </div>
          {phase === 'manual' ? (
            <>
              <p className="game-instruction">
                Fit the parts in order. Next up: <strong>{PARTS[manualIdx]}</strong> — and the worker
                has to walk and fetch it.
              </p>
              <div className="part-row">
                {PARTS.map((p) => (
                  <button
                    key={p}
                    className={`part-btn${PARTS.indexOf(p) < manualIdx ? ' is-done' : ''}`}
                    onClick={() => fitManual(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="round-result">
              <p>
                Car finished by hand in <strong>{manualTicks} ticks</strong>. Most of that time went
                on fetching and changing tasks, not on fitting parts.
              </p>
              <button
                className="btn btn-primary btn-lever"
                onClick={() => {
                  setPhase('line');
                  sfx.play('conveyor');
                }}
              >
                ⇩ START MOVING ASSEMBLY LINE ⇩
              </button>
            </div>
          )}
        </section>
      )}

      {/* ------------------------------------------------ round 2: the line */}
      {(phase === 'line' || phase === 'line-done') && (
        <section className="round">
          <h4 className="mini-head">Round 2 — the moving line</h4>
          <div className="line-stage">
            <div className="conveyor-belt" aria-hidden="true">
              <div className="belt-teeth" />
            </div>
            <div className="line-car" style={{ left: `${Math.min(carX, 78)}%` }}>
              <CarDiagram built={lineIdx} small />
            </div>
            {['Station A', 'Station B', 'Station C', 'Station D'].map((s, i) => (
              <span key={s} className={`line-station${i === lineIdx ? ' is-active' : ''}`} style={{ left: `${8 + i * 23}%` }}>
                {s}
              </span>
            ))}
            <div className="tick-readout">
              <span className="tick-num">{lineTicks}</span>
              <span className="tick-label">ticks</span>
            </div>
          </div>
          {phase === 'line' ? (
            <>
              <p className="game-instruction">
                The body comes to you. Fit <strong>{PARTS[lineIdx]}</strong> — you never leave your
                station.
              </p>
              <div className="part-row">
                {PARTS.map((p) => (
                  <button
                    key={p}
                    className={`part-btn${PARTS.indexOf(p) < lineIdx ? ' is-done' : ''}`}
                    onClick={() => fitLine(p)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="round-result is-good">
              <p>
                Car finished on the line in <strong>{lineTicks} ticks</strong>, against{' '}
                <strong>{manualTicks}</strong> by hand.
              </p>
              <p>
                That is the whole idea of specialisation: the worker stops walking and stops switching
                tasks, so more cars come off the line per hour of labour — and the cost spread across
                each car falls. It also meant doing the same motion all day, which is why the line was
                exhausting work.
              </p>
              <button className="btn btn-primary" onClick={() => setPhase('suppliers')}>
                Now follow the materials →
              </button>
            </div>
          )}
        </section>
      )}

      {/* ------------------------------------------------ suppliers */}
      {phase === 'suppliers' && (
        <section className="round">
          <h4 className="mini-head">
            Where did it all come from? Open at least three ({viewed.length}/5 opened)
          </h4>
          <div className="supplier-grid">
            {SUPPLIERS.map((s) => (
              <button
                key={s.id}
                className={`supplier-btn${viewed.includes(s.id) ? ' is-viewed' : ''}${openSupplier === s.id ? ' is-open' : ''}`}
                onClick={() => openSup(s.id)}
              >
                <span className="supplier-icon" aria-hidden="true">
                  {s.icon}
                </span>
                {s.name}
              </button>
            ))}
          </div>
          {openSupplier && (
            <div className="supplier-readout" role="status">
              <strong>{SUPPLIERS.find((s) => s.id === openSupplier)!.name}</strong>
              <p>{SUPPLIERS.find((s) => s.id === openSupplier)!.text}</p>
            </div>
          )}
          {done && (
            <p className="game-feedback is-right" role="status">
              Activity complete. One industry pulled several others along with it — that chain is the
              clearest 1920s example of a technology reshaping a whole economy. It is not, on its
              own, evidence that everyone gained equally.
            </p>
          )}
        </section>
      )}

      <div className="game-actions">
        <button className="btn btn-ghost btn-small" onClick={restart}>
          Restart activity
        </button>
        {phase !== 'suppliers' && (
          <button className="btn btn-ghost btn-small" onClick={() => setPhase('suppliers')}>
            Skip to the supply chain
          </button>
        )}
      </div>
    </div>
  );
}

function CarDiagram({ built, small }: { built: number; small?: boolean }) {
  // built: 0 none, 1 chassis, 2 +engine, 3 +wheels, 4 +body
  return (
    <svg viewBox="0 0 160 80" className={`car-diagram${small ? ' is-small' : ''}`} aria-hidden="true">
      {built >= 1 && <rect x="20" y="44" width="120" height="8" fill="#6b6b78" />}
      {built >= 2 && <rect x="40" y="30" width="34" height="16" rx="2" fill="#8d6f33" />}
      {built >= 3 && (
        <>
          <circle cx="44" cy="58" r="11" fill="#241c14" />
          <circle cx="44" cy="58" r="4" fill="#c8a45c" />
          <circle cx="120" cy="58" r="11" fill="#241c14" />
          <circle cx="120" cy="58" r="4" fill="#c8a45c" />
        </>
      )}
      {built >= 4 && (
        <>
          <path d="M28 44 L28 32 L62 32 L74 18 L108 18 L116 32 L140 32 L140 44 Z" fill="#1f2a3d" />
          <rect x="78" y="22" width="26" height="12" fill="#7fa8c9" opacity="0.8" />
          <rect x="24" y="36" width="10" height="5" fill="#c8a45c" />
        </>
      )}
      {built === 0 && (
        <text x="80" y="46" fontSize="11" textAnchor="middle" fill="#9c907a">
          empty line
        </text>
      )}
    </svg>
  );
}
