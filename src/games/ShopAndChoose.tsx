import { useState } from 'react';
import { sfx } from '../audio/sfx';

/**
 * Exhibit 3 minigame — Shop & Choose.
 * Half one: buy a radio three ways. Half two: buy a share two ways.
 * Every figure here is an invented teaching example, flagged on screen.
 */

const SIM_FLAG =
  'Illustrative teaching example — not actual 1920s prices, interest terms or investment returns.';

type ShopChoice = 'cash' | 'installment' | 'wait';
type MarketChoice = 'cash' | 'margin';

const SHOP_RESULTS: Record<ShopChoice, { title: string; good: string; cost: string }> = {
  cash: {
    title: 'Paid $40 in cash',
    good: 'The radio is yours outright, with nothing owed and no interest paid. Total cost: $40.',
    cost: 'Your savings are now $40 lighter, so an unexpected expense next month has less to cushion it.',
  },
  installment: {
    title: 'Paid $10 down, then $38 over time',
    good: 'You get the radio today without having saved for it first. This is exactly how many 1920s families reached new goods.',
    cost: 'Total paid: $48 — eight dollars more than cash. And the payments continue whether or not your hours do.',
  },
  wait: {
    title: 'Saved and waited',
    good: 'No interest, no obligation, and the money stays yours until you decide. This was the thrift that 1920s public figures praised.',
    cost: 'You go without the radio for months — and in a decade of fast-changing goods, waiting had a real cost too.',
  },
};

export default function ShopAndChoose({ onComplete }: { onComplete: () => void }) {
  const [half, setHalf] = useState<'shop' | 'market'>('shop');
  const [shopPick, setShopPick] = useState<ShopChoice | null>(null);
  const [marketPick, setMarketPick] = useState<MarketChoice | null>(null);
  const [reveal, setReveal] = useState<'none' | 'up' | 'down'>('none');
  const [checkIdx, setCheckIdx] = useState(0);
  const [checkWrong, setCheckWrong] = useState(false);
  const [done, setDone] = useState(false);

  const CHECKS = [
    {
      q: 'You put in $20 and borrowed $80. The share falls to $75. What is left of your own money?',
      options: ['Still $20 — the loan absorbs it', 'Nothing, and you owe $5 more', '$75 — you keep the share value'],
      correct: 1,
      why: 'The $80 loan does not shrink when the price does. $75 of value minus $80 owed leaves you $5 in the hole, having started with $20.',
      wrongWhy:
        'Not quite. The debt is fixed at $80 no matter what the share does — the loss lands entirely on your own $20 first.',
    },
    {
      q: 'What can a broker do when your equity falls that far?',
      options: [
        'Demand more cash, or sell the share to cover the loan',
        'Forgive the loan automatically',
        'Nothing at all until you choose to sell',
      ],
      correct: 0,
      why: 'That demand is a margin call. In a falling market, forced selling by many investors at once pushes prices down further.',
      wrongWhy:
        'A broker who has lent you money protects that loan. They can call for more cash or sell the position without waiting for you.',
    },
  ];

  const pickShop = (c: ShopChoice) => {
    setShopPick(c);
    sfx.play('register');
  };

  const answerCheck = (i: number) => {
    if (i === CHECKS[checkIdx].correct) {
      sfx.play('chime');
      setCheckWrong(false);
      if (checkIdx + 1 === CHECKS.length) {
        setDone(true);
        onComplete();
      } else setCheckIdx((x) => x + 1);
    } else {
      setCheckWrong(true);
      sfx.play('wrong');
    }
  };

  const restart = () => {
    setHalf('shop');
    setShopPick(null);
    setMarketPick(null);
    setReveal('none');
    setCheckIdx(0);
    setCheckWrong(false);
  };

  return (
    <div className="game game--market">
      <div className="game-head">
        <h3>Shop &amp; Choose</h3>
        <p>Make the same kind of decision twice — once at a counter, once at a broker's desk.</p>
      </div>
      <p className="sim-flag">{SIM_FLAG}</p>

      <div className="half-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={half === 'shop'}
          className={`half-tab${half === 'shop' ? ' is-active' : ''}`}
          onClick={() => setHalf('shop')}
        >
          1 · The department store
        </button>
        <button
          role="tab"
          aria-selected={half === 'market'}
          className={`half-tab${half === 'market' ? ' is-active' : ''}`}
          onClick={() => setHalf('market')}
          disabled={!shopPick}
        >
          2 · Wall Street {shopPick ? '' : '(finish the store first)'}
        </button>
      </div>

      {half === 'shop' && (
        <section className="round">
          <div className="radio-display">
            <svg viewBox="0 0 160 110" className="radio-svg" aria-hidden="true">
              <rect x="18" y="20" width="124" height="74" rx="6" fill="#5a4226" />
              <rect x="26" y="28" width="108" height="48" rx="4" fill="#3a2a1c" />
              <circle cx="60" cy="52" r="18" fill="#241c14" />
              <circle cx="60" cy="52" r="13" fill="#c8a45c" opacity="0.8" />
              <rect x="88" y="38" width="38" height="28" fill="#2a3448" />
              {[0, 1, 2, 3, 4].map((i) => (
                <rect key={i} x={92 + i * 7} y={42 + (i % 2) * 4} width="3" height="20" fill="#8fb996" />
              ))}
              <circle cx="46" cy="84" r="5" fill="#c8a45c" />
              <circle cx="114" cy="84" r="5" fill="#c8a45c" />
            </svg>
            <div>
              <h4 className="mini-head">A new radio — 40 game dollars</h4>
              <p>How will this household pay for it? There is no wrong answer here; each one trades something away.</p>
            </div>
          </div>

          <div className="choice-row">
            <button className={`big-choice${shopPick === 'cash' ? ' is-picked' : ''}`} onClick={() => pickShop('cash')}>
              <strong>Pay cash</strong>
              <span>$40 now, nothing owed</span>
            </button>
            <button
              className={`big-choice${shopPick === 'installment' ? ' is-picked' : ''}`}
              onClick={() => pickShop('installment')}
            >
              <strong>Buy on installments</strong>
              <span>$10 down, then $38 — total $48</span>
            </button>
            <button className={`big-choice${shopPick === 'wait' ? ' is-picked' : ''}`} onClick={() => pickShop('wait')}>
              <strong>Save and wait</strong>
              <span>No debt, no radio yet</span>
            </button>
          </div>

          {shopPick && (
            <div className="result-card" role="status">
              <strong>{SHOP_RESULTS[shopPick].title}</strong>
              <p>
                <span className="tag tag--good">What you gain</span> {SHOP_RESULTS[shopPick].good}
              </p>
              <p>
                <span className="tag tag--cost">What it costs</span> {SHOP_RESULTS[shopPick].cost}
              </p>
              <p className="muted-note">
                Borrowing to buy a useful thing is an ordinary, reasonable decision. The point of this
                room is not that credit is bad — it is that credit creates an obligation that does not
                adjust when your circumstances do.
              </p>
              <button className="btn btn-primary" onClick={() => setHalf('market')}>
                Now try the same thinking on Wall Street →
              </button>
            </div>
          )}
        </section>
      )}

      {half === 'market' && (
        <section className="round">
          <h4 className="mini-head">One share of a company, priced at $100</h4>
          <div className="choice-row">
            <button
              className={`big-choice${marketPick === 'cash' ? ' is-picked' : ''}`}
              onClick={() => {
                setMarketPick('cash');
                sfx.play('ticker');
              }}
            >
              <strong>Your own $100</strong>
              <span>No loan, no broker</span>
            </button>
            <button
              className={`big-choice${marketPick === 'margin' ? ' is-picked' : ''}`}
              onClick={() => {
                setMarketPick('margin');
                sfx.play('ticker');
              }}
            >
              <strong>$20 of yours + $80 borrowed</strong>
              <span>Buying on margin</span>
            </button>
          </div>

          {marketPick && (
            <>
              <div className="reveal-row">
                <button className="btn btn-small" onClick={() => setReveal('up')}>
                  Price rises 25% → $125
                </button>
                <button className="btn btn-small" onClick={() => setReveal('down')}>
                  Price falls 25% → $75
                </button>
              </div>

              {reveal !== 'none' && (
                <table className="equity-table">
                  <caption>
                    What your own money is worth if you sold right now ({SIM_FLAG.toLowerCase()})
                  </caption>
                  <thead>
                    <tr>
                      <th scope="col" />
                      <th scope="col">Paid cash</th>
                      <th scope="col">Bought on margin</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <th scope="row">Your own money in</th>
                      <td>$100</td>
                      <td>$20</td>
                    </tr>
                    <tr>
                      <th scope="row">Share now worth</th>
                      <td>{reveal === 'up' ? '$125' : '$75'}</td>
                      <td>{reveal === 'up' ? '$125' : '$75'}</td>
                    </tr>
                    <tr>
                      <th scope="row">Loan still owed</th>
                      <td>—</td>
                      <td>$80</td>
                    </tr>
                    <tr className="is-emphasis">
                      <th scope="row">Your equity</th>
                      <td>{reveal === 'up' ? '$125' : '$75'}</td>
                      <td>{reveal === 'up' ? '$45' : '−$5'}</td>
                    </tr>
                    <tr className="is-emphasis">
                      <th scope="row">Gain or loss</th>
                      <td>{reveal === 'up' ? '+$25 (+25%)' : '−$25 (−25%)'}</td>
                      <td>
                        {reveal === 'up' ? '+$25 (+125% on your $20)' : '−$25 (your $20 gone, and $5 still owed)'}
                      </td>
                    </tr>
                  </tbody>
                </table>
              )}

              {reveal !== 'none' && (
                <p className="game-note">
                  Same share, same price move, very different outcome for the investor. This ignores
                  interest and fees, and a real broker would have required more margin than this.
                </p>
              )}

              {reveal !== 'none' && !done && (
                <div className="check-box">
                  <h4 className="mini-head">
                    Quick check {checkIdx + 1} of {CHECKS.length}
                  </h4>
                  <p>{CHECKS[checkIdx].q}</p>
                  <div className="check-options">
                    {CHECKS[checkIdx].options.map((o, i) => (
                      <button key={o} className="btn btn-small" onClick={() => answerCheck(i)}>
                        {o}
                      </button>
                    ))}
                  </div>
                  {checkWrong && (
                    <p className="game-feedback is-wrong" role="status">
                      {CHECKS[checkIdx].wrongWhy}
                    </p>
                  )}
                </div>
              )}

              {done && (
                <p className="game-feedback is-right" role="status">
                  Activity complete. {CHECKS[CHECKS.length - 1].why} The Economic Council at the end
                  of the museum runs this out across three years.
                </p>
              )}
            </>
          )}
        </section>
      )}

      <div className="game-actions">
        <button className="btn btn-ghost btn-small" onClick={restart}>
          Restart activity
        </button>
      </div>
    </div>
  );
}
