import { useEffect, useRef, useState } from 'react';
import { sfx } from '../audio/sfx';

/**
 * Exhibit 6 final game — THE TICKER: BOOM TO BUST.
 *
 * A fictional stock, three deterministic rounds, and side-by-side cash vs
 * margin arithmetic. Everything on screen is labelled as illustrative; this is
 * not historical price data and not a trading simulator.
 *
 * The arithmetic, stated once so it can be checked:
 *   cash:   buy 1 share at $100 with $100 of your own.
 *   margin: buy 1 share at $100 with $20 of your own + $80 borrowed.
 *   1928 price $125 → cash equity $125 (+$25). margin equity 125−80 = $45 (+$25 on a $20 stake).
 *   1929 price  $75 → cash equity  $75 (−$25). margin equity  75−80 = −$5 (−$25 on a $20 stake).
 */

const DISCLAIMER =
  'All prices, dates, returns and personal investments in this game are illustrative; this is NOT historical stock data.';

type Choice = 'cash' | 'margin';

interface RoundDef {
  year: string;
  price: number;
  heading: string;
  context: string;
}

const ROUNDS: RoundDef[] = [
  {
    year: '1927',
    price: 100,
    heading: 'Optimism',
    context:
      'Auto production, national advertising and rising optimism encourage speculation. Most Americans owned no stock at all — share ownership was concentrated among wealthier households — but among those who did invest, borrowing to buy more became common.',
  },
  {
    year: '1928',
    price: 125,
    heading: 'Boom',
    context:
      'The share climbs 25%. On borrowed money the same rise looks spectacular, because the gain is measured against a much smaller stake of your own.',
  },
  {
    year: '1929',
    price: 75,
    heading: 'Shock',
    context:
      'The share falls to $75. The loan does not fall with it. A broker can issue a margin call demanding more cash, or sell the position outright to protect the loan.',
  },
];

export default function TheTicker({ onComplete }: { onComplete: () => void }) {
  const [round, setRound] = useState(0);
  const [choice, setChoice] = useState<Choice | null>(null);
  const [animPrice, setAnimPrice] = useState(100);
  const [done, setDone] = useState(false);
  const raf = useRef<number | null>(null);

  const target = ROUNDS[round].price;

  useEffect(() => {
    const animate = () => {
      setAnimPrice((p) => {
        const diff = target - p;
        if (Math.abs(diff) < 0.4) return target;
        if (Math.random() < 0.25) sfx.play('ticker');
        return p + diff * 0.09;
      });
      raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [target]);

  const price = Math.round(animPrice);
  const cashEquity = target;
  const marginEquity = target - 80;
  const direction = round === 0 ? 'flat' : round === 1 ? 'up' : 'down';

  const advance = () => {
    if (round < ROUNDS.length - 1) {
      setRound((r) => r + 1);
      sfx.play('ticker');
    } else if (!done) {
      setDone(true);
      onComplete();
    }
  };

  return (
    <div className="game game--ticker">
      <div className="ticker-masthead">
        <div>
          <span className="ticker-symbol">NMI</span>
          <h3>National Motor Industries <em>(fictional)</em></h3>
        </div>
        <div className={`ticker-price is-${direction}`}>
          <span className="price-num">${price}</span>
          <span className="price-arrow" aria-hidden="true">
            {direction === 'up' ? '▲' : direction === 'down' ? '▼' : '—'}
          </span>
        </div>
      </div>
      <p className="sim-flag sim-flag--strong">{DISCLAIMER}</p>

      <div className="ticker-tape" aria-hidden="true">
        <div className="tape-run">
          {Array.from({ length: 3 }).map((_, k) => (
            <span key={k}>
              NMI {target} · FICTIONAL · NMI {target} · TEACHING EXAMPLE · NMI {target} · NOT REAL
              MARKET DATA ·{' '}
            </span>
          ))}
        </div>
      </div>

      <div className="round-banner">
        <span className="round-year">{ROUNDS[round].year}</span>
        <h4>{ROUNDS[round].heading}</h4>
      </div>
      <p className="round-context">{ROUNDS[round].context}</p>

      {/* ------------------------------------------------ round 1: choose */}
      {round === 0 && (
        <div className="choice-row">
          <button
            className={`big-choice${choice === 'cash' ? ' is-picked' : ''}`}
            onClick={() => {
              setChoice('cash');
              sfx.play('click');
            }}
          >
            <strong>Buy with cash</strong>
            <span>Your own $100 for one share</span>
            <span className="choice-note">No debt. No broker. No margin call possible.</span>
          </button>
          <button
            className={`big-choice${choice === 'margin' ? ' is-picked' : ''}`}
            onClick={() => {
              setChoice('margin');
              sfx.play('click');
            }}
          >
            <strong>Buy on margin</strong>
            <span>$20 of yours + $80 borrowed</span>
            <span className="choice-note">Same share, one fifth of your money at stake — and a debt.</span>
          </button>
        </div>
      )}

      {round === 0 && choice && (
        <p className="game-feedback is-right" role="status">
          {choice === 'cash'
            ? 'Cash it is. Your exposure is simple: you own the share, and whatever it is worth is what you have.'
            : 'On margin. You control a $100 share with $20 of your own money — which means the share price now moves your position five times as fast in both directions.'}
        </p>
      )}

      {/* ------------------------------------------------ rounds 2 & 3 */}
      {round > 0 && (
        <table className="equity-table equity-table--final">
          <caption>
            Liquidation equity — what your own money is worth if you sold right now. Excludes
            interest and fees.
          </caption>
          <thead>
            <tr>
              <th scope="col" />
              <th scope="col" className={choice === 'cash' ? 'is-yours' : ''}>
                Paid cash {choice === 'cash' && <span className="yours-tag">your choice</span>}
              </th>
              <th scope="col" className={choice === 'margin' ? 'is-yours' : ''}>
                On margin {choice === 'margin' && <span className="yours-tag">your choice</span>}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Your own money in (1927)</th>
              <td>$100</td>
              <td>$20</td>
            </tr>
            <tr>
              <th scope="row">Share price now</th>
              <td>${target}</td>
              <td>${target}</td>
            </tr>
            <tr>
              <th scope="row">Broker loan owed</th>
              <td>—</td>
              <td>$80</td>
            </tr>
            <tr className="is-emphasis">
              <th scope="row">Net equity</th>
              <td>${cashEquity}</td>
              <td className={marginEquity < 0 ? 'is-negative' : ''}>
                {marginEquity < 0 ? `−$${Math.abs(marginEquity)}` : `$${marginEquity}`}
              </td>
            </tr>
            <tr className="is-emphasis">
              <th scope="row">Profit or loss</th>
              <td className={round === 1 ? 'is-positive' : 'is-negative'}>
                {round === 1 ? '+$25 (+25% on $100)' : '−$25 (−25% on $100)'}
              </td>
              <td className={round === 1 ? 'is-positive' : 'is-negative'}>
                {round === 1 ? '+$25 (+125% on $20)' : '−$25 (your $20 gone, $5 still owed)'}
              </td>
            </tr>
          </tbody>
        </table>
      )}

      {round === 1 && (
        <p className="game-note">
          Identical dollar gain — $25 either way. What differs is the return on the money you
          actually risked: 25% on cash, 125% on margin. That asymmetry is exactly why borrowing to buy
          shares became attractive while prices were rising. No dividend or interest is credited here.
        </p>
      )}

      {round === 2 && (
        <>
          <p className="game-note is-warning">
            The fall costs both investors $25. The cash investor still owns a $75 share. The margin
            investor has lost their entire $20 stake <em>and</em> owes $5 beyond it — and would likely
            have faced a margin call before reaching this point, forcing a sale at the worst moment.
            {choice === 'cash' && ' You chose cash, but the comparison is shown anyway, because leverage is the lesson.'}
          </p>
          <div className="history-note">
            <h4 className="mini-head">What actually happened, carefully stated</h4>
            <p>
              Share prices fell sharply in October 1929, with the heaviest selling on the 24th and
              29th. This game's price path is invented; real stocks did not all move this way, and the
              numbers above are teaching figures.
            </p>
            <p>
              The crash contributed to the contraction that followed, but it was not the sole cause of
              the Great Depression. Banking panics, a shrinking money supply, falling demand, trade
              policy and weakness already present in farming and industry all played a part over the
              years after 1929.
            </p>
          </div>
        </>
      )}

      <div className="game-actions">
        {round === 0 && (
          <button className="btn btn-primary" onClick={advance} disabled={!choice}>
            {choice ? 'Advance to 1928 →' : 'Choose how to invest first'}
          </button>
        )}
        {round === 1 && (
          <button className="btn btn-primary" onClick={advance}>
            Advance to 1929 →
          </button>
        )}
        {round === 2 && !done && (
          <button className="btn btn-primary" onClick={advance}>
            Finish the simulation →
          </button>
        )}
        {round > 0 && (
          <button
            className="btn btn-ghost btn-small"
            onClick={() => {
              setRound(0);
              setChoice(null);
              setAnimPrice(100);
            }}
          >
            Restart activity
          </button>
        )}
      </div>

      {done && (
        <p className="game-feedback is-right" role="status">
          Simulation complete. Now use what you have seen — and the five evidence cards on the wall —
          to deliver the council's verdict below.
        </p>
      )}
    </div>
  );
}
