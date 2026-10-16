import { useState } from 'react';
import { sfx } from '../audio/sfx';

/**
 * Exhibit 5 minigame — Two Budgets.
 * (a) allocate a city household's pay, (b) work a farm through a price fall,
 * (c) compare the two directly with flip cards.
 *
 * The households are invented teaching examples. Every number is a game
 * illustration, not an actual 1926 wage, price, yield or index.
 */

const SIM_FLAG =
  'Both households are invented for teaching. Every number here is a game illustration — not an actual 1926 wage, price, crop yield or national index.';

type Step = 'urban' | 'rural' | 'compare';

export default function TwoBudgets({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState<Step>('urban');

  // --- urban allocation ---
  const TOKENS = 10;
  const [essentials, setEssentials] = useState(6);
  const [goods, setGoods] = useState(2);
  const saving = TOKENS - essentials - goods;
  const [urbanSubmitted, setUrbanSubmitted] = useState(false);
  const [urbanError, setUrbanError] = useState<string | null>(null);

  // --- rural sequence ---
  const [ruralStage, setRuralStage] = useState(0); // 0 none,1 harvest,2 price,3 revenue,4 loan
  // --- compare ---
  const [flipped, setFlipped] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  const submitUrban = () => {
    if (essentials < 6) {
      setUrbanError(
        'Rent, food, coal and carfare are not optional. With fewer than 6 tokens on essentials this household cannot cover the month — adjust and try again.',
      );
      sfx.play('wrong');
      return;
    }
    setUrbanError(null);
    setUrbanSubmitted(true);
    sfx.play('chime');
  };

  const flip = (id: string) => {
    if (flipped.includes(id)) return;
    const next = [...flipped, id];
    setFlipped(next);
    sfx.play('page');
    if (next.length === 4 && !done) {
      setDone(true);
      onComplete();
    }
  };

  return (
    <div className="game game--lives">
      <div className="game-head">
        <h3>Two Budgets</h3>
        <p>Run a city household's month, then a farm's season — then put them side by side.</p>
      </div>
      <p className="sim-flag">{SIM_FLAG}</p>

      <div className="half-tabs" role="tablist">
        {(['urban', 'rural', 'compare'] as Step[]).map((s, i) => (
          <button
            key={s}
            role="tab"
            aria-selected={step === s}
            className={`half-tab${step === s ? ' is-active' : ''}`}
            onClick={() => setStep(s)}
            disabled={(s === 'rural' && !urbanSubmitted) || (s === 'compare' && ruralStage < 4)}
          >
            {i + 1} · {s === 'urban' ? 'Detroit wage household' : s === 'rural' ? 'Iowa farm household' : 'Compare'}
          </button>
        ))}
      </div>

      {/* ------------------------------------------------------ urban */}
      {step === 'urban' && (
        <section className="round">
          <h4 className="mini-head">A Detroit wage household — 10 tokens of monthly pay</h4>
          <p className="game-instruction">
            Spread the pay across three uses. Essentials need at least 6 tokens.
          </p>

          <div className="budget-rows">
            <BudgetRow
              label="Essentials (rent, food, coal, carfare)"
              value={essentials}
              onChange={(v) => {
                setEssentials(Math.max(0, Math.min(TOKENS - goods, v)));
                setUrbanSubmitted(false);
              }}
              max={TOKENS - goods}
              tone="need"
            />
            <BudgetRow
              label="A consumer good on installments (radio, vacuum)"
              value={goods}
              onChange={(v) => {
                setGoods(Math.max(0, Math.min(TOKENS - essentials, v)));
                setUrbanSubmitted(false);
              }}
              max={TOKENS - essentials}
              tone="want"
            />
            <div className="budget-row">
              <span className="budget-label">Saving (whatever is left)</span>
              <div className="token-strip">
                {Array.from({ length: TOKENS }).map((_, i) => (
                  <span key={i} className={`token${i < saving ? ' is-save' : ' is-empty'}`} />
                ))}
              </div>
              <span className="budget-value">{saving}</span>
            </div>
          </div>

          {urbanError && (
            <p className="game-feedback is-wrong" role="status">
              {urbanError}
            </p>
          )}

          {!urbanSubmitted ? (
            <button className="btn btn-primary" onClick={submitUrban}>
              Close the month's books
            </button>
          ) : (
            <div className="result-card" role="status">
              <strong>The month closes with {saving} token{saving === 1 ? '' : 's'} saved.</strong>
              <p>
                A wage gave this household genuine buying power — that is the version of the 1920s in
                the advertisements, and it was real.
              </p>
              <p>
                {saving === 0
                  ? 'With nothing set aside, a single week of short hours turns the installment payment into a crisis. Nothing cushions it.'
                  : `With ${saving} saved there is a small cushion — but the installment payment on that consumer good continues whether or not the hours do. Wages can stop all at once; the obligation does not.`}
              </p>
              <button className="btn btn-primary" onClick={() => setStep('rural')}>
                Now take the farm through a season →
              </button>
            </div>
          )}
        </section>
      )}

      {/* ------------------------------------------------------ rural */}
      {step === 'rural' && (
        <section className="round">
          <h4 className="mini-head">An Iowa farm household — two seasons side by side</h4>
          <p className="game-instruction">
            Click each step in turn to see why a bigger harvest did not mean a bigger income.
          </p>

          <div className="farm-steps">
            <button
              className={`farm-step${ruralStage >= 1 ? ' is-done' : ''}`}
              onClick={() => {
                setRuralStage(Math.max(ruralStage, 1));
                sfx.play('click');
              }}
            >
              <span className="step-num">1</span> Bring in the harvest
            </button>
            <button
              className={`farm-step${ruralStage >= 2 ? ' is-done' : ''}`}
              onClick={() => {
                if (ruralStage >= 1) {
                  setRuralStage(Math.max(ruralStage, 2));
                  sfx.play('click');
                }
              }}
              disabled={ruralStage < 1}
            >
              <span className="step-num">2</span> Check the market price
            </button>
            <button
              className={`farm-step${ruralStage >= 3 ? ' is-done' : ''}`}
              onClick={() => {
                if (ruralStage >= 2) {
                  setRuralStage(Math.max(ruralStage, 3));
                  sfx.play('register');
                }
              }}
              disabled={ruralStage < 2}
            >
              <span className="step-num">3</span> Calculate the revenue
            </button>
            <button
              className={`farm-step${ruralStage >= 4 ? ' is-done' : ''}`}
              onClick={() => {
                if (ruralStage >= 3) {
                  setRuralStage(4);
                  sfx.play('wrong');
                }
              }}
              disabled={ruralStage < 3}
            >
              <span className="step-num">4</span> Pay the tractor note
            </button>
          </div>

          <table className="farm-table">
            <caption>Two seasons for the same farm (illustrative game figures)</caption>
            <thead>
              <tr>
                <th scope="col" />
                <th scope="col">Earlier season</th>
                <th scope="col">Later season</th>
              </tr>
            </thead>
            <tbody>
              <tr className={ruralStage >= 1 ? 'is-lit' : ''}>
                <th scope="row">Units harvested</th>
                <td>10</td>
                <td>
                  15 <span className="delta up">+50%</span>
                </td>
              </tr>
              <tr className={ruralStage >= 2 ? 'is-lit' : ''}>
                <th scope="row">Price per unit</th>
                <td>{ruralStage >= 2 ? '$10' : '—'}</td>
                <td>{ruralStage >= 2 ? <>$6 <span className="delta down">−40%</span></> : '—'}</td>
              </tr>
              <tr className={`is-emphasis ${ruralStage >= 3 ? 'is-lit' : ''}`}>
                <th scope="row">Revenue</th>
                <td>{ruralStage >= 3 ? '$100' : '—'}</td>
                <td>{ruralStage >= 3 ? <>$90 <span className="delta down">−$10</span></> : '—'}</td>
              </tr>
              <tr className={ruralStage >= 4 ? 'is-lit' : ''}>
                <th scope="row">Tractor loan payment</th>
                <td>{ruralStage >= 4 ? '−$25' : '—'}</td>
                <td>{ruralStage >= 4 ? '−$25' : '—'}</td>
              </tr>
              <tr className={`is-emphasis ${ruralStage >= 4 ? 'is-lit' : ''}`}>
                <th scope="row">Left over</th>
                <td>{ruralStage >= 4 ? '$75' : '—'}</td>
                <td>{ruralStage >= 4 ? '$65' : '—'}</td>
              </tr>
            </tbody>
          </table>

          {ruralStage >= 3 && (
            <p className="game-feedback is-wrong" role="status">
              <strong>Half again as much grain, and less money for it.</strong> Revenue is quantity
              multiplied by price, and the farm only controls the first number. Working harder was not
              a way out of this.
            </p>
          )}
          {ruralStage >= 4 && (
            <>
              <p className="game-note">
                The loan payment is the part that does not move. It was agreed when prices were
                better, and it stays the same size while the income shrinks underneath it. Multiply
                that across a region and you have the rural 1920s — and the farm foreclosures that
                came with it.
              </p>
              <button className="btn btn-primary" onClick={() => setStep('compare')}>
                Compare the two households →
              </button>
            </>
          )}
        </section>
      )}

      {/* ------------------------------------------------------ compare */}
      {step === 'compare' && (
        <section className="round">
          <h4 className="mini-head">
            Turn over all four cards to finish ({flipped.length}/4)
          </h4>
          <p className="game-instruction">
            One opportunity and one problem for each household. Say the difference out loud before
            you flip.
          </p>
          <div className="flip-grid">
            {[
              {
                id: 'u-opp',
                side: 'Detroit wage household',
                face: 'Opportunity',
                tone: 'good',
                text: 'Regular wages arriving on a known day, which made installment buying possible and put new manufactured goods within reach.',
              },
              {
                id: 'u-prob',
                side: 'Detroit wage household',
                face: 'Problem',
                tone: 'bad',
                text: 'The whole income can stop at once — cut hours, a layoff, or discriminatory hiring — while the rent and the payments carry on.',
              },
              {
                id: 'r-opp',
                side: 'Iowa farm household',
                face: 'Opportunity',
                tone: 'good',
                text: 'Land, machinery and food the family produces itself. A good year with a decent price could pay down debt and buy real security.',
              },
              {
                id: 'r-prob',
                side: 'Iowa farm household',
                face: 'Problem',
                tone: 'bad',
                text: 'Income depends on a price set far away. A larger harvest can earn less money, and the loan payment never falls with the price.',
              },
            ].map((c) => (
              <button
                key={c.id}
                className={`flip-card${flipped.includes(c.id) ? ' is-flipped' : ''} flip-card--${c.tone}`}
                onClick={() => flip(c.id)}
              >
                <span className="flip-side">{c.side}</span>
                <strong className="flip-face">{c.face}</strong>
                <span className="flip-text">
                  {flipped.includes(c.id) ? c.text : 'Click to turn over'}
                </span>
              </button>
            ))}
          </div>

          {done && (
            <p className="game-feedback is-right" role="status">
              <strong>Activity complete.</strong> The city household's money came from a wage and
              could vanish in a week. The farm household's money came from quantity multiplied by a
              price it did not set. Neither group was uniformly rich or poor — what differed was where
              the income came from and what could go wrong with it.
            </p>
          )}
        </section>
      )}

      <div className="game-actions">
        <button
          className="btn btn-ghost btn-small"
          onClick={() => {
            setStep('urban');
            setEssentials(6);
            setGoods(2);
            setUrbanSubmitted(false);
            setUrbanError(null);
            setRuralStage(0);
            setFlipped([]);
          }}
        >
          Restart activity
        </button>
      </div>
    </div>
  );
}

function BudgetRow({
  label,
  value,
  onChange,
  max,
  tone,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max: number;
  tone: 'need' | 'want';
}) {
  return (
    <div className="budget-row">
      <span className="budget-label">{label}</span>
      <div className="token-strip">
        <button className="token-btn" onClick={() => onChange(value - 1)} aria-label={`Fewer tokens on ${label}`}>
          −
        </button>
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className={`token${i < value ? ` is-${tone}` : ' is-empty'}`} />
        ))}
        <button
          className="token-btn"
          onClick={() => onChange(value + 1)}
          disabled={value >= max}
          aria-label={`More tokens on ${label}`}
        >
          +
        </button>
      </div>
      <span className="budget-value">{value}</span>
    </div>
  );
}
