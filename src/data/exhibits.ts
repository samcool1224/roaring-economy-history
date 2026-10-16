/**
 * exhibits.ts — the historical core of the museum.
 *
 * Every lesson station below is written to be accurate and traceable to the
 * source named in `sourceIds`. Nothing here is a placeholder.
 */

export interface LessonStation {
  id: string;
  /** Short label painted on the clickable object in the room. */
  label: string;
  title: string;
  date: string;
  /** 75–110 words of instructional content. */
  body: string;
  takeaway: string;
  /** Icon key handed to the illustration component. */
  illustration: string;
  sourceIds: string[];
  /** Human-readable classification shown on the source chip. */
  sourceKind: 'Primary source' | 'Secondary source' | 'Historical interpretation';
  /**
   * Exhibit 1 presents its stations as original animated micro-lessons.
   * An optional real MP4 may be dropped at this path to replace the animation.
   */
  microLessonVideo?: string;
  animationKey?: 'inflation' | 'jobs' | 'recession';
}

export interface ExhibitDef {
  id: number;
  slug: string;
  doorSign: string;
  title: string;
  subtitle: string;
  years: string;
  objective: string;
  /** Script for the exhibit's narrated introduction video. */
  narrationScript: string;
  narrationVideo: string;
  stations: LessonStation[];
  minigameName: string;
  minigameInstructions: string;
  galleryIds: string[];
  evidenceClaim: string;
  evidenceSourceId: string;
  /** Hex accent used for signage and room chrome. */
  accent: string;
}

export const EXHIBITS: ExhibitDef[] = [
  /* ====================================================================== 1 */
  {
    id: 1,
    slug: 'newsroom',
    doorSign: '01 NEWSROOM',
    title: 'The Newsroom: After the War',
    subtitle: 'Why the boom did not begin in 1919',
    years: '1918–1921',
    objective:
      'Objective 1 — Describe the economic problems America faced after World War I.',
    narrationVideo: 'media/narration/exhibit01-postwar.mp4',
    narrationScript:
      'Welcome to the postwar newsroom. World War I has ended, but the American economy is facing inflation, unemployment, and a painful transition from war production to peace. Read the evidence, investigate the causes, and publish your explanation of the recession that came before the Roaring Twenties boom.',
    stations: [
      {
        id: 'e1s1',
        label: 'The price ticker',
        title: 'Inflation and instability',
        date: '1918–1920',
        body:
          'Wartime spending and supply disruptions contributed to rising prices, and many households struggled as everyday goods became more expensive. When the fighting stopped, the shift toward civilian production changed what firms were making and what consumers were buying. Inflation was not the whole story, though. Prices that had climbed steeply then fell rapidly during the downturn of 1920 and 1921. Americans in these years experienced both problems in quick succession: a cost of living that outran wages, followed by a slump in which prices, orders and jobs all dropped together.',
        takeaway:
          'Prices rose sharply after the war, then fell just as sharply in the 1920–21 slump. Both movements were hard on ordinary households.',
        illustration: 'price-curve',
        sourceIds: ['fed-labor-market-1920-21', 'own-diagram-postwar-chain'],
        sourceKind: 'Secondary source',
        microLessonVideo: 'media/lessons/ex1-inflation.mp4',
        animationKey: 'inflation',
      },
      {
        id: 'e1s2',
        label: 'The hiring board',
        title: 'Unemployment and reconversion',
        date: '1919–1921',
        body:
          'As soldiers returned home and government military orders fell away, businesses had to adapt what they produced. The market for some goods weakened, and workers lost jobs or had to look for new ones. The effects were uneven: they differed by industry and by gender, as wartime openings closed and returning servicemen re-entered the workforce. The problem was serious enough that in September 1921 President Harding convened a national Conference on Unemployment in Washington. The photograph of its delegates is a useful primary source: it shows policymakers treating unemployment as a national emergency.',
        takeaway:
          'Reconversion put real people out of work, and by 1921 unemployment was serious enough to summon a national conference.',
        illustration: 'hiring-board',
        sourceIds: ['loc-unemployment-conference-1921'],
        sourceKind: 'Primary source',
        microLessonVideo: 'media/lessons/ex1-jobs.mp4',
        animationKey: 'jobs',
      },
      {
        id: 'e1s3',
        label: 'The bank notice',
        title: 'Recession and tighter money',
        date: '1920–1921',
        body:
          'To counter inflation, the Federal Reserve raised discount rates, making credit more expensive. Tighter credit and falling demand together contributed to a severe recession, including a sharp decline in job openings. The slump was short but harsh, and recovery from it helped set the stage for the prosperity of the middle of the decade. Keep this episode separate in your mind from the 1929 crash and the Great Depression that followed. The 1920–21 recession came first, had different causes, and ended well before the boom years this museum goes on to examine.',
        takeaway:
          'Tighter Federal Reserve credit plus falling demand produced the 1920–21 recession — a different event from the 1929 crash.',
        illustration: 'bank-notice',
        sourceIds: ['fed-labor-market-1920-21'],
        sourceKind: 'Secondary source',
        microLessonVideo: 'media/lessons/ex1-recession.mp4',
        animationKey: 'recession',
      },
    ],
    minigameName: 'Investigative Headline',
    minigameInstructions:
      'Collect three clues from the newsroom, then arrange them into a cause-and-effect story and publish the edition.',
    galleryIds: [
      'loc-liberty-loan-1918',
      'loc-unemployment-conference-1921',
      'own-diagram-postwar-chain',
    ],
    evidenceClaim:
      "WWI's end brought inflation, economic reconversion, tighter credit, and a 1920–1921 recession.",
    evidenceSourceId: 'fed-labor-market-1920-21',
    accent: '#c8a45c',
  },

  /* ====================================================================== 2 */
  {
    id: 2,
    slug: 'factory',
    doorSign: '02 FACTORY',
    title: "Ford's Factory: Building the Boom",
    subtitle: 'How a moving line changed an entire economy',
    years: '1913–1927',
    objective:
      'Objective 2 — Explain the economic growth and prosperity of the 1920s, including how Henry Ford and the automobile industry helped spark the boom.',
    narrationVideo: 'media/narration/exhibit02-ford.mp4',
    narrationScript:
      'Step onto Ford\'s factory floor. The moving automobile assembly line allowed specialized workers to build cars faster and helped lower costs. Make a Model T, compare production methods, and see how the auto industry created demand for steel, rubber, oil, glass, and roads.',
    stations: [
      {
        id: 'e2s1',
        label: 'The moving line',
        title: 'The system before the boom',
        date: '1913',
        body:
          'Ford introduced his moving automobile assembly line in 1913 — before the decade we call the Roaring Twenties. He did not invent assembly-line production outright; the idea of dividing work into repeated steps was already in use elsewhere. What Ford\'s plant did was move the work past the worker, so that each person performed one specialised task again and again without walking anywhere. Productivity rose dramatically. The same system could be repetitive and physically demanding, and the monotony of the line became a standing complaint among the men who worked it.',
        takeaway:
          'The technology arrived in 1913; the 1920s are when its economic effects spread. Higher output came with harder, duller work.',
        illustration: 'conveyor',
        sourceIds: ['thf-assembly-line-set', 'thf-tires-highland-park'],
        sourceKind: 'Primary source',
      },
      {
        id: 'e2s2',
        label: 'The price board',
        title: 'Price, production, wages',
        date: '1908–1927',
        body:
          'Ford produced more than 15 million Model Ts between 1908 and 1927, and the car\'s listed price fell over that span from $850 to as little as $260. A vehicle that had begun as a substantial purchase became something a working family might realistically reach. Ford\'s famous $5 day was announced in 1914, not in the 1920s. It roughly doubled the going daily wage and helped the company hold on to workers who had been quitting the line in large numbers, but it applied to Ford\'s own employees under company conditions and demanded hard, fast work in return.',
        takeaway:
          'Over 15 million Model Ts, 1908–1927, with the price falling from $850 to as little as $260. The $5 day dates from 1914.',
        illustration: 'price-board',
        sourceIds: ['thf-assembly-line-set'],
        sourceKind: 'Primary source',
      },
      {
        id: 'e2s3',
        label: 'The supply map',
        title: 'Ripple effects across the economy',
        date: '1920s',
        body:
          'Building millions of cars raised demand for steel, rubber tires, oil and gasoline, plate glass, and the machine tools that made all of it. Driving them encouraged road construction, service stations, roadside businesses and new patterns of travel, including movement toward areas outside city centres. This is how one industry stimulated many others, and it is the clearest 1920s illustration of technology reshaping an economy. It does not, however, prove that everyone gained equally — the same decade left many farm and low-wage households behind.',
        takeaway:
          'Cars pulled steel, rubber, oil, glass and road building along with them. Broad growth is not the same as equal benefit.',
        illustration: 'supply-map',
        sourceIds: ['thf-assembly-line-set', 'loc-merchandising-advertising'],
        sourceKind: 'Primary source',
      },
    ],
    minigameName: 'Build the Model T',
    minigameInstructions:
      'Build a car by hand, then start the moving line and build another. Compare the two, and trace where the materials came from.',
    galleryIds: [
      'thf-tires-highland-park',
      'thf-assembly-line-set',
      'commons-model-t-film-1924',
      'wws-hacksaw-2014',
    ],
    evidenceClaim:
      'Productivity gains and cheaper automobiles fueled related industries and changed everyday mobility.',
    evidenceSourceId: 'thf-assembly-line-set',
    accent: '#d08b3c',
  },

  /* ====================================================================== 3 */
  {
    id: 3,
    slug: 'market',
    doorSign: '03 MARKET',
    title: 'The Credit Craze',
    subtitle: 'Consumer revolution and bull market',
    years: '1922–1929',
    objective:
      'Objective 3 — Analyze the consumer revolution and the bull market of the 1920s.',
    narrationVideo: 'media/narration/exhibit03-credit.mp4',
    narrationScript:
      'In the 1920s, advertising and consumer credit encouraged families to buy new goods. On Wall Street, share prices climbed and some investors borrowed to buy more stock. Visit the store, examine a real advertisement, then explore the exciting — but risky — world of the bull market.',
    stations: [
      {
        id: 'e3s1',
        label: 'The shop window',
        title: 'The consumer revolution',
        date: '1920s',
        body:
          'Mass-produced goods, national advertising, chain stores and radio changed how Americans shopped and what they expected to own. Electric appliances, radios and automobiles moved from luxuries to things an ordinary household might aspire to, and advertising worked to make that aspiration feel ordinary and urgent. Access was uneven. Buying depended on income, and using an electric appliance depended on having electricity, which many rural homes still lacked. The consumer revolution was real, and it reached some communities years or decades before it reached others.',
        takeaway:
          'Advertising and chain stores built a national consumer market — but income and electricity decided who could join it.',
        illustration: 'shop-window',
        sourceIds: ['loc-merchandising-advertising', 'loc-prosperity-coolidge-era'],
        sourceKind: 'Secondary source',
      },
      {
        id: 'e3s2',
        label: 'The payment desk',
        title: 'Cash, saving, and credit',
        date: '1923–1924',
        body:
          'Installment plans let buyers take goods home and pay over months, which opened the new consumer world to families without savings and created a continuing obligation at the same time. One precision worth keeping: Ford\'s Weekly Purchase Plan, introduced in 1923, had customers deposit about $5 a week toward a car and collect it once the money was there. That is saving, not an installment loan, even though a 1924 Ford advertisement promoted it with the same excitement advertisers used for credit.',
        takeaway:
          "Installment credit means paying after you own it. Ford's 1923 plan was the opposite — saving first, car second.",
        illustration: 'payment-desk',
        sourceIds: ['thf-ford-ad-1924', 'loc-merchandising-advertising'],
        sourceKind: 'Primary source',
      },
      {
        id: 'e3s3',
        label: 'The ticker',
        title: 'Bull market and margin',
        date: '1925–1929',
        body:
          'U.S. share prices rose dramatically through much of the decade, and rising prices drew in more buyers. Some of them bought on margin, borrowing part of the purchase price from a broker. Margin magnifies results in both directions: the same move in the share price produces a much larger gain or loss relative to the investor\'s own money, and a falling price can trigger a margin call demanding more cash or a forced sale. The crash of October 1929 contributed to the economic contraction that followed, but it did not by itself cause the Great Depression.',
        takeaway:
          'Borrowing to buy shares multiplied gains and losses alike. The 1929 crash mattered, but it was not the sole cause of the Depression.',
        illustration: 'ticker',
        sourceIds: ['fedhistory-crash-1929', 'loc-cartoon-hard-hit-1929'],
        sourceKind: 'Secondary source',
      },
    ],
    minigameName: 'Shop & Choose',
    minigameInstructions:
      'Buy a radio three different ways, then try the same decision on Wall Street — with and without a broker\'s loan.',
    galleryIds: [
      'thf-ford-ad-1924',
      'loc-cartoon-hard-hit-1929',
      'loc-merchandising-advertising',
      'commons-hot-lips-1922',
    ],
    evidenceClaim:
      'Advertising and credit expanded consumption while stock speculation and leverage increased vulnerability.',
    evidenceSourceId: 'fedhistory-crash-1929',
    accent: '#8fb996',
  },

  /* ====================================================================== 4 */
  {
    id: 4,
    slug: 'map',
    doorSign: '04 ECONOMIC MAP',
    title: 'Three Americas',
    subtitle: "The boom's uneven geography",
    years: '1920–1929',
    objective:
      'Objective 4 — Compare the different effects of the economic boom on urban, suburban, and rural America.',
    narrationVideo: 'media/narration/exhibit04-three-americas.mp4',
    narrationScript:
      'One decade, three different Americas. Industry helped cities grow, automobiles supported new suburbs, and tractors changed farming. But the economic boom did not benefit every community in the same way. Change this map to discover how technology and geography shaped people\'s opportunities.',
    stations: [
      {
        id: 'e4s1',
        label: 'The city',
        title: 'Urban America',
        date: '1920 census onward',
        body:
          'Manufacturing jobs, department stores, electrification and commercial entertainment drew people toward cities throughout the decade. In the 1920 census, more than half of the United States population was classified as urban for the first time. That growth coexisted with overcrowded housing, poverty, insecure work and open racial discrimination in hiring and housing. The 1921 film Manhatta, made by Charles Sheeler and Paul Strand, shows the scale of the industrial city at the start of the decade: ferries, crowds and construction. It is a silent film.',
        takeaway:
          'The 1920 census was the first in which most Americans were counted as urban — and urban growth included hardship, not only opportunity.',
        illustration: 'city',
        sourceIds: ['commons-manhatta-1921', 'census-1920-photos', 'census-urban-rural-definitions'],
        sourceKind: 'Primary source',
      },
      {
        id: 'e4s2',
        label: 'The suburb',
        title: 'Suburban America',
        date: '1920s',
        body:
          'Wider car ownership and better roads made land farther from the central business district usable for housing, and encouraged construction, shops and services to follow residents outward. The automobile is part of why the suburban decade happened at all. Access was limited, though: new houses had to be affordable, and racially restrictive covenants and discriminatory lending kept Black families and other excluded groups out of many new neighbourhoods regardless of income. A 1925 photograph of a Model T pickup loaded with groceries documents the spread of the automobile — it is a picture of a truck, not a picture of a suburb.',
        takeaway:
          'Cars and roads made suburbs possible; price and racial exclusion decided who could actually move there.',
        illustration: 'suburb',
        sourceIds: ['thf-model-t-pickup-1925', 'loc-prosperity-coolidge-era'],
        sourceKind: 'Primary source',
      },
      {
        id: 'e4s3',
        label: 'The farm',
        title: 'Rural America',
        date: '1920s',
        body:
          'Tractors, cars and farm trucks brought real efficiencies and ended some of the isolation of country life. A Ford tractor demonstration photographed in 1921–22 and a McCormick-Deering Farmall from about 1925 show the machinery arriving. But the farm economy of the 1920s was difficult. Wartime expansion had encouraged farmers to plant more; afterwards, crop surpluses and falling prices met debts taken on in better years. Infrastructure was uneven too — many farms still had no electricity. Rural America experienced the technology of the boom without much of the prosperity.',
        takeaway:
          'New machinery reached the farm; the money did not follow. Surpluses, low prices and debt defined the rural 1920s.',
        illustration: 'farm',
        sourceIds: ['loc-ford-tractor-demo', 'thf-farmall-1925', 'loc-poverty-1920s'],
        sourceKind: 'Primary source',
      },
    ],
    minigameName: 'Transform the Map',
    minigameInstructions:
      'Place four forces of change on the zone each one reshaped most, and watch the map respond.',
    galleryIds: [
      'commons-manhatta-1921',
      'loc-ford-tractor-demo',
      'thf-model-t-pickup-1925',
      'census-1920-photos',
    ],
    evidenceClaim:
      'Urban industry, suburban development, and rural farm hardship reveal an uneven geographic boom.',
    evidenceSourceId: 'census-1920-photos',
    accent: '#7fa8c9',
  },

  /* ====================================================================== 5 */
  {
    id: 5,
    slug: 'two-lives',
    doorSign: '05 TWO LIVES',
    title: 'Two American Lives',
    subtitle: 'The paycheck and the harvest',
    years: '1926',
    objective:
      'Objective 5 — Compare economic life in rural America to that in urban America.',
    narrationVideo: 'media/narration/exhibit05-two-lives.mp4',
    narrationScript:
      'Did the boom reach every household? In the city, wages offered access to new goods but families faced bills and job insecurity. On farms, larger harvests could bring disappointing earnings when crop prices fell. Manage two fictional 1926 budgets and compare the choices and risks of urban and rural life.',
    stations: [
      {
        id: 'e5s1',
        label: 'The city ledger',
        title: 'An urban wage household',
        date: '1920s',
        body:
          'A city household might earn factory wages and use them to buy manufactured goods, which is the version of the 1920s most familiar from advertisements. Rent, food costs, irregular hours, unemployment and low pay could still leave very little to save. Many urban residents, including recent immigrants and Black workers who had moved north during the Great Migration, met discriminatory hiring and were pushed toward the most insecure and worst-paid work available. A wage was steadier than a harvest while it lasted, and it could also stop entirely in a single week.',
        takeaway:
          'Urban wages bought access to the new consumer economy — but not security, and not on equal terms for everyone.',
        illustration: 'city-ledger',
        sourceIds: [
          'thf-model-t-pickup-1925',
          'loc-prosperity-coolidge-era',
          'loc-african-americans-consumerism',
        ],
        sourceKind: 'Primary source',
      },
      {
        id: 'e5s2',
        label: 'The farm ledger',
        title: 'A rural farming household',
        date: '1920s',
        body:
          'Farm earnings depended on two things: how much the family sold, and the price the market paid. Only one of those was in the family\'s control. Wartime demand had encouraged expansion, and when that demand receded the 1920s brought a long stretch of low commodity prices to farmers who had often borrowed to expand. A photograph of the grain harvest at Ford Farms in Michigan around 1925 shows the labour and machinery of a good harvest. It cannot show the price that harvest fetched — and in the 1920s, that was frequently the deciding number.',
        takeaway:
          'Farm income = quantity × price. A good harvest at a poor price could still mean a bad year.',
        illustration: 'farm-ledger',
        sourceIds: ['thf-grain-harvest-1925', 'thf-pullford-catalog'],
        sourceKind: 'Primary source',
      },
      {
        id: 'e5s3',
        label: 'The tractor and the note',
        title: 'Technology plus debt',
        date: 'circa 1925',
        body:
          'A tractor could let a family farm more land with less labour, and trade catalogues such as the Pullford Company\'s "Low Cost Farm Power" marketed exactly that promise. The machine usually had to be financed, so the gamble was that higher output would cover the payments. When prices fell, the larger crop did not produce the larger income the purchase assumed, and the loan payment stayed the same. Not every farm failed and not every city worker prospered; what the decade produced was a wide spread of outcomes rather than one shared experience.',
        takeaway:
          'Financing machinery was a bet that output would beat prices. For many 1920s farmers, that bet did not pay.',
        illustration: 'tractor-note',
        sourceIds: ['thf-pullford-catalog', 'thf-farmall-1925', 'loc-poverty-1920s'],
        sourceKind: 'Primary source',
      },
    ],
    minigameName: 'Two Budgets',
    minigameInstructions:
      'Spend a city household\'s pay, work a farm through a price collapse, then compare the two directly.',
    galleryIds: [
      'thf-grain-harvest-1925',
      'thf-pullford-catalog',
      'thf-farmall-1925',
      'loc-poverty-1920s',
    ],
    evidenceClaim:
      'Different sources of income, prices, debt, and unequal access explain why prosperity was uneven.',
    evidenceSourceId: 'loc-poverty-1920s',
    accent: '#b98a7a',
  },

  /* ====================================================================== 6 */
  {
    id: 6,
    slug: 'council',
    doorSign: '06 ECONOMIC COUNCIL',
    title: 'The Economic Verdict',
    subtitle: 'Essential Questions A2 and C2',
    years: '1919–1929',
    objective:
      'Synthesis — weigh all five exhibits against the two Essential Questions, then judge the boom and its risks.',
    narrationVideo: 'media/narration/exhibit06-verdict.mp4',
    narrationScript:
      "Welcome to the final Economic Council. You've seen war's aftermath, new factories, consumer credit, changing communities, and unequal prosperity. Now examine two essential questions: who gained freedom and opportunity, and how did technology reshape America? Use your evidence in one final stock-market challenge to judge the boom and its risks.",
    stations: [],
    minigameName: 'The Ticker: Boom to Bust',
    minigameInstructions:
      'Invest in a fictional stock three ways across three years, and watch what leverage does on the way up and on the way down.',
    galleryIds: [
      'commons-coolidge-speech-1924',
      'loc-coolidge-administration',
      'fedhistory-crash-1929',
      'fedhistory-great-depression',
    ],
    evidenceClaim:
      'Technology and consumer markets created real growth, but unequal benefits, credit risk and speculation left vulnerabilities.',
    evidenceSourceId: 'fedhistory-great-depression',
    accent: '#c9a227',
  },
];

export const exhibitById = (id: number): ExhibitDef =>
  EXHIBITS.find((e) => e.id === id) as ExhibitDef;

/* ------------------------------------------------------------------ */
/* Essential Questions — exact wording.                                 */
/* ------------------------------------------------------------------ */

export interface EssentialQuestion {
  code: 'A2' | 'C2';
  question: string;
  paragraph: string;
  /** Rooms a reader can jump back to from the plaque. */
  evidenceExhibits: number[];
}

export const ESSENTIAL_QUESTIONS: EssentialQuestion[] = [
  {
    code: 'A2',
    question:
      'How have economic, political and cultural decisions promoted or prevented the growth of personal freedom, individual responsibility, equality and respect for human dignity?',
    paragraph:
      "Economic, political, and cultural decisions during the 1920s expanded some Americans' choices while restricting others. Mass production and higher output made automobiles and consumer goods more affordable, while expanding jobs and consumer credit gave some families greater access to goods and mobility. At the same time, installment payments created obligations, speculation exposed investors to losses, and many farmers suffered under debt and low crop prices. Economic opportunity also depended on race, gender, class, and location: discriminatory hiring, housing barriers, and immigration restrictions prevented equal participation. Pro-business federal policy encouraged investment, but did not guarantee protections or dignity for every worker or consumer. The lesson is that prosperity and freedom were related but not identical. The decisions of businesses, governments, and households could increase opportunity while also producing inequality and serious risks. Evaluating who benefited and who carried the costs is essential when judging the fairness of economic growth.",
    evidenceExhibits: [1, 3, 4, 5],
  },
  {
    code: 'C2',
    question:
      'How have the scientific and technological developments over the course of history changed the way people live and economies and governments function?',
    paragraph:
      "Technological development transformed American life and the economy during and before the 1920s. Ford's moving assembly line, introduced in 1913, enabled factories to make standardized automobiles faster and helped reduce their cost during the 1920s. Cars stimulated steel, rubber, petroleum, glass, construction, and road-related activity, while changing where people could live and shop. Radios and widespread advertising helped build shared consumer markets, and improved machinery allowed some farms to produce more with less labor. Yet technology did not guarantee equal prosperity: purchasing new machines could increase debt, and greater farm output could coexist with low prices. Government also responded to technological and industrial expansion through road building, economic statistics, commerce policy, and debates over credit and regulation. The broader lesson is that technology reshapes production, mobility, communication, and public decision-making, but its outcomes depend on the choices people and institutions make about its use.",
    evidenceExhibits: [2, 3, 4, 5],
  },
];

/* ------------------------------------------------------------------ */
/* Final interpretive judgement (Exhibit 6)                            */
/* ------------------------------------------------------------------ */

export const FINAL_JUDGEMENT = {
  prompt: 'Which claim best fits all five evidence cards?',
  choices: [
    {
      key: 'A' as const,
      text: 'Every American became richer, so the economy had no weaknesses.',
      feedback:
        'Your own evidence contradicts this. Card 5 records farm debt and low crop prices; card 4 records an uneven geography. And "no weaknesses" cannot survive card 3, where margin lending was building real fragility.',
    },
    {
      key: 'B' as const,
      text: 'Technology and consumer markets created real growth, but unequal benefits, credit risk and speculation left vulnerabilities.',
      feedback:
        'Correct — and notice that it holds both halves at once. The growth was real: cheaper cars, new industries, new goods. So were the weaknesses: farm debt, exclusion, and borrowing stacked on rising share prices. A good historical judgement does not have to pick a side.',
    },
    {
      key: 'C' as const,
      text: 'The 1920s had no economic growth.',
      feedback:
        'Cards 1 and 2 rule this out. Output, productivity and consumption all rose substantially after the 1920–21 recession. Denying the growth is as inaccurate as ignoring who missed out on it.',
    },
  ],
  correct: 'B' as const,
};
