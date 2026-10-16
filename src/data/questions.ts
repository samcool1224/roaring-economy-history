/**
 * questions.ts — the complete Check-for-Understanding bank.
 * Exactly 20 questions: four for each of Exhibits 1–5, four choices each.
 * Exhibit 6 uses a single interpretive judgement defined in exhibits.ts instead.
 *
 * Correct answers are spread evenly across A, B, C and D (five each), so that a
 * visitor cannot pattern-match their way through — which matters because a wrong
 * answer restarts the quiz.
 *
 * `whyWrong` is retained for every distractor. The quiz does not display it under
 * the current restart rule, but it documents why each distractor is wrong and can
 * be switched back on in CFU.tsx for explain-and-retry instead.
 */

export type ChoiceKey = 'A' | 'B' | 'C' | 'D';

export interface Choice {
  key: ChoiceKey;
  text: string;
}

export interface CFUQuestion {
  id: string;
  exhibit: number;
  prompt: string;
  choices: Choice[];
  correct: ChoiceKey;
  /** Shown when the visitor answers correctly. */
  whyCorrect: string;
  /** Keyed by each wrong choice. */
  whyWrong: Partial<Record<ChoiceKey, string>>;
  hint: string;
}

export const QUESTIONS: CFUQuestion[] = [
  /* ============================== Exhibit 1 ============================== */
  {
    id: 'e1q1',
    exhibit: 1,
    prompt: 'What economic change challenged businesses after World War I?',
    choices: [
      { key: 'A', text: 'Military purchasing kept rising endlessly.' },
      { key: 'B', text: 'The Great Depression had already begun in 1919.' },
      { key: 'C', text: 'Factories were ordered to keep producing war goods through the 1920s.' },
      { key: 'D', text: 'Wartime demand ended and firms adjusted toward civilian markets.' },
    ],
    correct: 'D',
    whyCorrect:
      'Correct. When the fighting stopped, government war orders fell away and manufacturers had to find out what peacetime customers wanted instead. That changeover — reconversion — was disruptive even though it was good news.',
    whyWrong: {
      A: 'Military purchasing fell sharply once the war ended; that drop is exactly what firms had to adjust to.',
      B: 'The Great Depression began after the 1929 crash — a full decade later. The trouble in 1919–21 was a separate, shorter downturn.',
      C: 'War production was wound down, not extended. Plants had to find peacetime customers, which is precisely the adjustment that proved difficult.',
    },
    hint: 'Think about who had been buying enormous quantities of goods during the war, and what happened to those orders in 1918.',
  },
  {
    id: 'e1q2',
    exhibit: 1,
    prompt: 'Which problem hurt many households in the immediate postwar years?',
    choices: [
      { key: 'A', text: 'Rising prices — inflation.' },
      { key: 'B', text: 'The invention of the Model A.' },
      { key: 'C', text: 'Wages rose faster than prices for nearly every worker.' },
      { key: 'D', text: 'A nationwide ban on bank accounts.' },
    ],
    correct: 'A',
    whyCorrect:
      'Correct. Prices climbed in 1918–1920, so a family\'s wages bought less than before. That squeeze on purchasing power was felt at the grocery counter long before anyone used the word "boom."',
    whyWrong: {
      B: 'The Model A arrived in 1927, as the Model T\'s replacement — and a new car model is not an economic hardship.',
      C: 'The squeeze ran the other way. Prices climbed faster than many households\' wages, so a week\'s pay bought less than it had before.',
      D: 'No such ban existed. Invented policies like this are a good signal that an answer is wrong.',
    },
    hint: 'What happens to a weekly wage when the cost of food, rent and clothing all go up at once?',
  },
  {
    id: 'e1q3',
    exhibit: 1,
    prompt: 'What contributed to the 1920–1921 recession?',
    choices: [
      { key: 'A', text: 'Only the 1929 stock market crash.' },
      { key: 'B', text: 'Federal Reserve credit tightening alongside postwar adjustments.' },
      { key: 'C', text: 'The New Deal programs of the 1930s.' },
      { key: 'D', text: 'A sudden shortage of workers caused by wartime casualties.' },
    ],
    correct: 'B',
    whyCorrect:
      'Correct — and note that it is plural. The Federal Reserve raised discount rates to fight inflation, which made borrowing harder, and that tightening landed on an economy already adjusting away from war production.',
    whyWrong: {
      A: 'The timing is impossible: the 1929 crash happened eight years after this recession ended. A later event cannot cause an earlier one.',
      C: 'The New Deal began in the 1930s, after the Great Depression started. It came more than a decade after this recession.',
      D: 'The problem in 1920–21 was too few jobs, not too few workers. Returning servicemen added to the labour force just as orders were falling away.',
    },
    hint: 'Two things were happening at once — one at the Federal Reserve, one in the factories.',
  },
  {
    id: 'e1q4',
    exhibit: 1,
    prompt: 'Which statement places the recession correctly in time?',
    choices: [
      { key: 'A', text: 'It occurred after World War II.' },
      { key: 'B', text: 'It began on Black Tuesday in 1929.' },
      { key: 'C', text: 'It came before much of the mid-1920s boom.' },
      { key: 'D', text: 'It lasted the whole decade, right up to 1929.' },
    ],
    correct: 'C',
    whyCorrect:
      'Correct. The order matters for the whole museum: slump in 1920–21, then recovery and the boom years, then the crash in 1929. The Roaring Twenties did not begin with roaring.',
    whyWrong: {
      A: 'World War II ended in 1945 — more than twenty years later.',
      B: 'Black Tuesday was October 1929, at the far end of the decade. This recession was over before the boom even got going.',
      D: 'It was short and sharp. Recovery came during 1921–22, and the strongest growth years of the decade followed it.',
    },
    hint: 'Put three events in order: the postwar slump, the boom, the crash.',
  },

  /* ============================== Exhibit 2 ============================== */
  {
    id: 'e2q1',
    exhibit: 2,
    prompt: 'When did Ford introduce a moving automobile assembly line?',
    choices: [
      { key: 'A', text: '1913.' },
      { key: 'B', text: '1925, at the height of the Roaring Twenties.' },
      { key: 'C', text: '1929.' },
      { key: 'D', text: '1939.' },
    ],
    correct: 'A',
    whyCorrect:
      'Correct — 1913, before the decade we are studying. This is the key to Essential Question C2: the technology was already in place, and the 1920s are when its effects spread through the whole economy.',
    whyWrong: {
      B: 'Close to the decade we are studying, but too late. The line was already running in 1913 — the 1920s are when its effects spread.',
      C: '1929 is the year of the crash, at the end of the boom. By then the moving line had been running for roughly sixteen years.',
      D: '1939 is on the edge of the Second World War. The line was far older than that.',
    },
    hint: 'The technology came first and the boom came second. Which year is before the 1920s?',
  },
  {
    id: 'e2q2',
    exhibit: 2,
    prompt: 'Why did specialization on the assembly line matter?',
    choices: [
      { key: 'A', text: 'It made each car entirely custom.' },
      { key: 'B', text: 'It ended demand for raw materials.' },
      { key: 'C', text: 'It increased productivity and could reduce costs.' },
      { key: 'D', text: 'It let each worker build a complete car on their own.' },
    ],
    correct: 'C',
    whyCorrect:
      'Correct. A worker repeating one task, with the parts brought to them, could finish far more in a day. More cars per hour of labour meant a lower cost per car — which is how a Model T reached ordinary buyers.',
    whyWrong: {
      A: 'The opposite. Standardisation — every car the same — was what made the speed possible. Custom work is slow work.',
      B: 'Building more cars needed far MORE steel, rubber, glass and oil, not less. That ripple is the point of the next station.',
      D: 'That is the method the moving line replaced. Specialisation meant each worker repeated one task rather than building a whole vehicle.',
    },
    hint: 'Count the cars finished per worker per day, then divide the cost across them.',
  },
  {
    id: 'e2q3',
    exhibit: 2,
    prompt: 'Which industry directly benefited from more automobiles?',
    choices: [
      { key: 'A', text: 'Medieval shipbuilding.' },
      { key: 'B', text: 'Horse-drawn carriage building.' },
      { key: 'C', text: 'Telegraph horseshoes.' },
      { key: 'D', text: 'Rubber tire manufacturing.' },
    ],
    correct: 'D',
    whyCorrect:
      'Correct. Every car needed tires, and that demand travelled to rubber. The same was true of steel, glass, petroleum and road construction — one industry pulling several others along with it.',
    whyWrong: {
      A: 'Medieval shipbuilding belongs to a different continent and several centuries earlier.',
      B: 'Carriage makers were among the losers of the automobile age. Demand moved toward the industries that supplied cars.',
      C: '"Telegraph horseshoes" is not a real industry — it is two unrelated things stuck together.',
    },
    hint: 'Look at what a Model T is physically made of, and what it rolls on.',
  },
  {
    id: 'e2q4',
    exhibit: 2,
    prompt: "Which statement about Ford's $5 day is accurate?",
    choices: [
      { key: 'A', text: 'It was first paid during the New Deal in the 1930s.' },
      { key: 'B', text: 'It was announced in 1914, partly to keep workers from quitting.' },
      { key: 'C', text: 'It was given to every American worker, without conditions.' },
      { key: 'D', text: 'It was a federal minimum wage set by Congress.' },
    ],
    correct: 'B',
    whyCorrect:
      'Correct on all three counts — the year, the motive, and the limits. Turnover on the line was punishing, and higher pay helped Ford hold on to workers. It was not offered to everyone and it came with conditions.',
    whyWrong: {
      A: 'The announcement came in 1914, about twenty years before the New Deal, and it was a company decision rather than a government program.',
      C: 'It applied to Ford\'s own workers who met the company\'s requirements — not to American workers generally.',
      D: 'It was one company\'s decision, not a law. No federal minimum wage existed in 1914.',
    },
    hint: 'One company, one year in the 1910s, and a policy with strings attached.',
  },

  /* ============================== Exhibit 3 ============================== */
  {
    id: 'e3q1',
    exhibit: 3,
    prompt: 'What helped create the 1920s consumer revolution?',
    choices: [
      { key: 'A', text: 'The permanent disappearance of stores.' },
      { key: 'B', text: 'Mass production, advertising and broader use of credit.' },
      { key: 'C', text: 'A ban on household appliances.' },
      { key: 'D', text: 'A government program that gave families free appliances.' },
    ],
    correct: 'B',
    whyCorrect:
      'Correct, and all three had to work together: factories made the goods, advertising created the want, and credit supplied the money to act on it before payday.',
    whyWrong: {
      A: 'Stores multiplied in this decade — chain stores especially. The selling was the whole phenomenon.',
      C: 'Appliances were among the most heavily marketed new goods of the decade.',
      D: 'No such program existed. What spread the new goods was advertising and installment credit, not public distribution.',
    },
    hint: 'Three things: making the goods, wanting the goods, and paying for the goods.',
  },
  {
    id: 'e3q2',
    exhibit: 3,
    prompt: 'What is a consequence of buying with installment credit?',
    choices: [
      { key: 'A', text: 'There are no future obligations.' },
      { key: 'B', text: 'Everything becomes automatically cheaper.' },
      { key: 'C', text: 'The seller keeps the item until the final payment.' },
      { key: 'D', text: 'Payments can continue long after the purchase.' },
    ],
    correct: 'D',
    whyCorrect:
      'Correct. The good arrives today and the obligation stays. That is genuinely useful — it is how many families got a radio or a car — and it is also why a drop in hours or wages could turn a purchase into a problem.',
    whyWrong: {
      A: 'An installment plan is a promise to keep paying. The obligation is the defining feature.',
      B: 'Credit usually makes the total cost higher, not lower, because of interest and carrying charges.',
      C: 'The appeal was the opposite — the buyer took the goods home immediately and paid afterwards. That is what made the obligation easy to underestimate.',
    },
    hint: 'Think about what is still true next month, after the item is already in the house.',
  },
  {
    id: 'e3q3',
    exhibit: 3,
    prompt: "Which accurately describes Ford's Weekly Purchase Plan?",
    choices: [
      { key: 'A', text: 'Save regular amounts toward a car.' },
      { key: 'B', text: "Borrow 100% of the car's price at once." },
      { key: 'C', text: 'Buy shares of Ford stock only.' },
      { key: 'D', text: 'Rent a car weekly and return it.' },
    ],
    correct: 'A',
    whyCorrect:
      'Correct, and this is a distinction worth holding on to. The 1923 plan had buyers deposit money weekly until they had enough for the car. You drove away owing nothing — the reverse of an installment loan.',
    whyWrong: {
      B: 'That describes an installment purchase. The Ford plan worked the other way around: pay first, collect the car afterwards.',
      C: 'The plan was about buying a car, not about investing in the company.',
      D: 'It was not a rental. Customers deposited money each week until they had enough to buy the car outright and keep it.',
    },
    hint: 'With this plan, did the car or the money come first?',
  },
  {
    id: 'e3q4',
    exhibit: 3,
    prompt: 'Why was buying stocks on margin risky?',
    choices: [
      { key: 'A', text: 'Share prices could never fall.' },
      { key: 'B', text: 'It eliminated debt.' },
      { key: 'C', text: 'The loan could multiply losses and lead to demands for more money.' },
      { key: 'D', text: 'The broker absorbed any losses on your behalf.' },
    ],
    correct: 'C',
    whyCorrect:
      "Correct. Borrowing magnifies the move in both directions. The debt stays fixed while the share price moves, so a modest fall can wipe out the investor's own small stake — and the broker can demand more cash.",
    whyWrong: {
      A: 'Prices can always fall, and in 1929 they fell hard. Any answer claiming an investment cannot lose is wrong.',
      B: 'Margin buying creates debt — that is precisely what makes it risky.',
      D: 'The broker protected the loan, not the investor. Losses fell on the buyer\'s own stake first, and the broker could demand more cash.',
    },
    hint: 'If you put in $20 and borrowed $80, what happens to your $20 when the price slips by a tenth?',
  },

  /* ============================== Exhibit 4 ============================== */
  {
    id: 'e4q1',
    exhibit: 4,
    prompt: 'What did the 1920 U.S. Census show?',
    choices: [
      { key: 'A', text: 'Every American lived on a farm.' },
      { key: 'B', text: 'The population was below one million.' },
      { key: 'C', text: 'A majority of the population was classified as urban.' },
      { key: 'D', text: 'That the population had fallen since 1910.' },
    ],
    correct: 'C',
    whyCorrect:
      'Correct — the first census in which more than half the country counted as urban. It is a milestone about a definition and a direction of travel, not a sudden change in how people lived.',
    whyWrong: {
      A: 'Farm families were a large and important part of the country, but never all of it — and by 1920 they were no longer the majority.',
      B: 'The United States population in 1920 was over one hundred million.',
      D: 'The population grew. What changed was the balance — for the first time, more than half of it was classified as urban.',
    },
    hint: 'The milestone is about a line being crossed for the first time — just over half.',
  },
  {
    id: 'e4q2',
    exhibit: 4,
    prompt: 'How did cars help shape suburbs?',
    choices: [
      { key: 'A', text: 'They made commuting across longer distances easier for some households.' },
      { key: 'B', text: 'They completely eliminated cities.' },
      { key: 'C', text: 'They made all homes equally affordable.' },
      { key: 'D', text: 'They forced families to live closer to factories.' },
    ],
    correct: 'A',
    whyCorrect:
      'Correct, and "some" is doing real work in that sentence. Once a family could drive to work, they could live farther from it — if they could afford a car and a house, and if they were allowed to buy there.',
    whyWrong: {
      B: 'Cities kept growing right through the decade. Suburbs grew alongside them, not instead of them.',
      C: 'Price was only one barrier. Racial covenants and discriminatory lending kept many families out of new neighbourhoods regardless of what they could pay.',
      D: 'The effect ran the other way. A car let a household live further from work, not nearer to it.',
    },
    hint: 'A car changes the distance between home and work. It does not change who is permitted to buy a house.',
  },
  {
    id: 'e4q3',
    exhibit: 4,
    prompt: 'Why did many rural communities struggle despite new machinery?',
    choices: [
      { key: 'A', text: 'Farmers had no technology at all.' },
      { key: 'B', text: 'Agricultural prices and debts could offset productivity gains.' },
      { key: 'C', text: 'Farmers could never sell their crops.' },
      { key: 'D', text: 'Machinery was banned on most American farms.' },
    ],
    correct: 'B',
    whyCorrect:
      'Correct, and it is the central irony of the decade for farmers: the machinery worked. It produced more. Abundant harvests pushed prices down, and the loan payment on the tractor did not fall with them.',
    whyWrong: {
      A: 'Tractors, trucks and new implements spread across American farms in these years — the machinery is not what was missing.',
      C: 'Crops were sold in large quantities. The trouble was the price they fetched, not the ability to sell.',
      D: 'Nothing prevented farmers from buying machinery, and plenty did — often on credit. The difficulty was what their larger harvests earned.',
    },
    hint: 'Separate two things: how much a farm produced, and how much money that production brought in.',
  },
  {
    id: 'e4q4',
    exhibit: 4,
    prompt: 'Which description of the boom is most accurate?',
    choices: [
      { key: 'A', text: 'All places benefited equally.' },
      { key: 'B', text: 'Economic activity occurred only in suburbs.' },
      { key: 'C', text: 'Only rural areas saw any real gains.' },
      { key: 'D', text: 'Benefits varied by city, suburb, and rural setting.' },
    ],
    correct: 'D',
    whyCorrect:
      '"It depends where you stood" is the honest summary of the 1920s economy — and it is the finding Essential Question A2 asks you to weigh.',
    whyWrong: {
      A: 'Farm incomes and city incomes moved in different directions for much of the decade. Equal benefit is exactly what the evidence does not show.',
      B: 'Cities held the factories, the department stores and most of the new jobs.',
      C: 'Rural America had the hardest decade of the three. Cities held most of the new jobs and most of the new consumer spending.',
    },
    hint: 'Compare the three zones you just transformed on the map.',
  },

  /* ============================== Exhibit 5 ============================== */
  {
    id: 'e5q1',
    exhibit: 5,
    prompt: 'How did many urban households earn money?',
    choices: [
      { key: 'A', text: 'Only from crop sales.' },
      { key: 'B', text: 'Only from stock dividends.' },
      { key: 'C', text: 'Mainly from government relief payments.' },
      { key: 'D', text: 'Regular wages from jobs such as factory work.' },
    ],
    correct: 'D',
    whyCorrect:
      'Correct. A wage is predictable while the job lasts — which is its advantage over farm income, and also its weakness, because the whole of it can stop at once when hours are cut.',
    whyWrong: {
      A: 'Crop sales are farm income. That is the other household in this room.',
      B: 'Only a small minority of Americans owned stock in the 1920s. It was not how ordinary households paid the rent.',
      C: 'Federal relief on that scale did not exist until the 1930s. City households lived on wages.',
    },
    hint: 'What arrives in a city household on a regular payday?',
  },
  {
    id: 'e5q2',
    exhibit: 5,
    prompt: 'Why could farm income decline even when production increased?',
    choices: [
      { key: 'A', text: 'More crops always guaranteed greater profit.' },
      { key: 'B', text: 'The selling price could drop enough to reduce total revenue.' },
      { key: 'C', text: 'Farm loans automatically disappeared.' },
      { key: 'D', text: 'Farmers were legally limited in how much they could sell.' },
    ],
    correct: 'B',
    whyCorrect:
      'Correct. Revenue is quantity multiplied by price, so a bigger harvest sold at a much lower price can bring in less money than a smaller one. Working harder was not a solution to this problem.',
    whyWrong: {
      A: 'This is the assumption the exhibit is designed to break. Profit depends on price as much as on quantity.',
      C: 'Debts stayed exactly as large when prices fell — which is what made falling prices so dangerous for farm families.',
      D: 'There was no such limit in the 1920s. Farmers could sell everything they grew; the trouble was the price it fetched.',
    },
    hint: 'Revenue = quantity × price. What happens if quantity rises by half but price falls by more?',
  },
  {
    id: 'e5q3',
    exhibit: 5,
    prompt: 'Which problem especially pressured many farmers during the 1920s?',
    choices: [
      { key: 'A', text: 'Universal free electricity.' },
      { key: 'B', text: 'Guaranteed high prices.' },
      { key: 'C', text: 'Crop-price declines combined with debt.' },
      { key: 'D', text: 'A shortage of land to farm.' },
    ],
    correct: 'C',
    whyCorrect:
      'Correct — the combination is what hurt. Either one alone is survivable. Low prices while a fixed loan payment comes due every season is what pushed families off their land.',
    whyWrong: {
      A: 'Many rural areas had no electricity at all in the 1920s; widespread rural electrification came later.',
      B: 'There was no such guarantee. Farmers took whatever the market offered.',
      D: 'Land was not the constraint — many farms had expanded during the war. What squeezed them was low prices against fixed debts.',
    },
    hint: 'Two pressures at once: what the crop earned, and what was already owed.',
  },
  {
    id: 'e5q4',
    exhibit: 5,
    prompt: 'Which comparison is historically responsible?',
    choices: [
      {
        key: 'A',
        text: 'Urban and rural Americans had different income sources, risks, and unequal experiences.',
      },
      { key: 'B', text: 'All urban residents were wealthy and all farmers were poor.' },
      { key: 'C', text: 'Urban and rural residents faced identical economic conditions.' },
      { key: 'D', text: 'Rural families were comfortable while every city worker was poor.' },
    ],
    correct: 'A',
    whyCorrect:
      'Correct. There were struggling families in the cities and prosperous farms in the countryside. What differed systematically was where the money came from and what could go wrong with it.',
    whyWrong: {
      B: 'Cities held severe poverty, insecure work and open discrimination. A sweeping claim like this flattens real people into a slogan.',
      C: 'A wage-earner and a grain farmer faced genuinely different risks. Treating them as identical hides the whole comparison.',
      D: 'This is the second option turned around, and it is wrong in the same way. Both groups contained prosperity and hardship.',
    },
    hint: 'The careful answer avoids the words "all", "every" and "identical".',
  },
];

export const questionsForExhibit = (n: number): CFUQuestion[] =>
  QUESTIONS.filter((q) => q.exhibit === n);

/** Sanity constant used by the dev QA panel. */
export const TOTAL_CFU_QUESTIONS = QUESTIONS.length; // 20
