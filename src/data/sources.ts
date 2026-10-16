/**
 * sources.ts — The curated archival source library for The Roaring Economy.
 *
 * MEDIA POLICY (see README "Historical source caveats / attributions"):
 *  - Every entry points at the institution's own landing / file-description page.
 *  - We do NOT rehost or hotlink archival images whose reuse terms we have not
 *    verified. Items with permissionStatus 'link-only' are presented with an
 *    ORIGINAL illustrative thumbnail drawn in code plus an "Open at source" button.
 *  - No historical photograph, quotation, statistic, date or source on this site is
 *    invented. Illustrative diagrams and game numbers are labelled as such.
 */

export type SourceType = 'primary' | 'secondary' | 'illustrative';
export type MediaKind = 'document' | 'photograph' | 'poster' | 'film' | 'audio' | 'essay' | 'artifact' | 'cartoon' | 'diagram';
export type PermissionStatus =
  | 'link-only'          // rights not verified for local copying — link out, original thumbnail
  | 'public-domain-link' // described as public domain at source, but still linked rather than rehosted
  | 'original-work';     // created by us for this project

export interface SourceItem {
  id: string;
  title: string;
  creator: string;
  institution: string;
  date: string;
  sourceType: SourceType;
  mediaKind: MediaKind;
  pageURL: string;
  whatItShows: string;
  exhibits: number[];
  permissionStatus: PermissionStatus;
  displayAttribution: string;
  rightsNote: string;
  /** Only ever set when a file has been placed locally by the project owner. */
  localAssetPath?: string;
}

export const SOURCES: SourceItem[] = [
  /* ---------------------------------------------------------------- Exhibit 1 */
  {
    id: 'loc-liberty-loan-1918',
    title: '"For victory, buy more bonds. Fourth Liberty Loan"',
    creator: 'J. Scott Williams (artist)',
    institution: 'Library of Congress, Prints & Photographs Division',
    date: '1918',
    sourceType: 'primary',
    mediaKind: 'poster',
    pageURL: 'https://www.loc.gov/item/94514360/',
    whatItShows:
      'A World War I Liberty Loan poster urging Americans to lend money to the government. It documents how the war was financed and how much of the economy was organised around war production — the arrangement that had to be unwound after 1918.',
    exhibits: [1],
    permissionStatus: 'link-only',
    displayAttribution:
      'J. Scott Williams, "For victory, buy more bonds. Fourth Liberty Loan," 1918. Library of Congress, Prints & Photographs Division.',
    rightsNote:
      'A catalogue record at the Library of Congress is not itself a grant of reuse rights. Viewed at the Library of Congress; not copied into this site.',
  },
  {
    id: 'loc-unemployment-conference-1921',
    title: '"Representatives to the Un-employment Conference called by President Harding"',
    creator: 'Schutz Group Photographers',
    institution: 'Library of Congress, Prints & Photographs Division',
    date: 'September 26, 1921',
    sourceType: 'primary',
    mediaKind: 'photograph',
    pageURL: 'https://www.loc.gov/item/2007663829/',
    whatItShows:
      'A photograph of the delegates to President Harding\'s 1921 Conference on Unemployment. It is direct evidence that unemployment was serious enough in 1921 for the federal government to convene a national conference about it.',
    exhibits: [1],
    permissionStatus: 'link-only',
    displayAttribution:
      'Schutz Group Photographers, "Representatives to the Un-employment Conference called by President Harding," September 26, 1921. Library of Congress.',
    rightsNote:
      'Rights and reproduction terms are stated on the Library of Congress item page. Linked, not rehosted.',
  },
  {
    id: 'fed-labor-market-1920-21',
    title:
      '"Labor Market Tightness during WWI and the Postwar Recession of 1920–1921"',
    creator: 'Anderson and Chang',
    institution: 'Board of Governors of the Federal Reserve System (FEDS Notes)',
    date: 'August 2022',
    sourceType: 'secondary',
    mediaKind: 'essay',
    pageURL:
      'https://www.federalreserve.gov/econres/feds/labor-market-tightness-during-WWI-and-the-postwar-recession-of-1920-1921.htm',
    whatItShows:
      'Modern Federal Reserve research on the wartime labour market and the sharp 1920–1921 downturn, including the collapse in job vacancies. We use it as the analytical backing for Exhibit 1, not as a period artifact.',
    exhibits: [1],
    permissionStatus: 'link-only',
    displayAttribution:
      'Anderson and Chang, "Labor Market Tightness during WWI and the Postwar Recession of 1920–1921," Board of Governors of the Federal Reserve System, August 2022.',
    rightsNote: 'Modern scholarship — a secondary source, not a 1920s artifact.',
  },
  {
    id: 'own-diagram-postwar-chain',
    title: 'Modern teaching diagram: war transition → prices → credit → jobs',
    creator: 'Created for this museum',
    institution: 'The Roaring Economy (this website)',
    date: '2026',
    sourceType: 'illustrative',
    mediaKind: 'diagram',
    pageURL:
      'https://www.federalreserve.gov/econres/feds/labor-market-tightness-during-WWI-and-the-postwar-recession-of-1920-1921.htm',
    whatItShows:
      'An original, clearly-labelled modern diagram connecting the 1918–1921 war-to-peace transition, inflation, Federal Reserve tightening, and job losses. It is a teaching aid built by us, NOT a historical document, and its shapes are not an exact data series.',
    exhibits: [1],
    permissionStatus: 'original-work',
    displayAttribution: 'Original diagram created for this museum.',
    rightsNote:
      'Original modern artwork. The relationships it summarises are drawn from the Federal Reserve study linked here.',
  },

  /* ---------------------------------------------------------------- Exhibit 2 */
  {
    id: 'thf-tires-highland-park',
    title:
      '"Workers Installing Tires on Ford Model T Assembly Line at Highland Park Plant"',
    creator: 'Ford Motor Company (photographer unidentified)',
    institution: 'The Henry Ford',
    date: 'circa 1925',
    sourceType: 'primary',
    mediaKind: 'photograph',
    pageURL: 'https://www.thehenryford.org/collections/explore/artifact/428541',
    whatItShows:
      'A period photograph of workers fitting tires as Model T bodies move along the line at Highland Park. It shows specialisation in practice: one crew, one repeated task, with the work moving to them.',
    exhibits: [2],
    permissionStatus: 'link-only',
    displayAttribution:
      'Ford Motor Company, "Workers Installing Tires on Ford Model T Assembly Line at Highland Park Plant," circa 1925. The Henry Ford.',
    rightsNote:
      'The Henry Ford\'s images are not automatically licensed for copying. Linked to the collection page; an original illustration stands in for the thumbnail here.',
  },
  {
    id: 'thf-assembly-line-set',
    title: 'Curated collection: "Henry Ford: Assembly Line"',
    creator: 'The Henry Ford (curators); Ford Motor Company (photographs)',
    institution: 'The Henry Ford',
    date: 'photographs circa 1913–1925',
    sourceType: 'primary',
    mediaKind: 'photograph',
    pageURL:
      'https://www.thehenryford.org/collections/explore/sets/detail/henry-ford-assembly-line',
    whatItShows:
      'A curated set of Ford assembly-line photographs and artifacts, including 1923–25 views of the moving line. It is the main artifact backing for our claims about how the line worked and when it appeared.',
    exhibits: [2],
    permissionStatus: 'link-only',
    displayAttribution:
      'The Henry Ford, "Henry Ford: Assembly Line" collection set (Ford Motor Company photographs).',
    rightsNote: 'Collection landing page; images viewed at the institution, not copied.',
  },
  {
    id: 'commons-model-t-film-1924',
    title: '"Model T assembling circa 1924" (silent film)',
    creator: 'Ford Motor Company',
    institution: 'U.S. National Archives, via Wikimedia Commons',
    date: 'circa 1924',
    sourceType: 'primary',
    mediaKind: 'film',
    pageURL:
      'https://commons.wikimedia.org/wiki/File:Model_T_assembling_circa_1924.webm',
    whatItShows:
      'Original Ford footage of Model T assembly in the mid-1920s — the actual motion of the line that still photographs can only suggest.',
    exhibits: [2],
    permissionStatus: 'public-domain-link',
    displayAttribution:
      'Ford Motor Company, "Model T assembling circa 1924." U.S. National Archives, via Wikimedia Commons.',
    rightsNote:
      'Described as public domain on the Commons file page. We link to that page rather than embedding the large video file; check the page for current licence details.',
  },
  {
    id: 'wws-hacksaw-2014',
    title: 'Recording of a 1920s industrial hacksaw (recorded 2014)',
    creator: 'Work With Sounds — Konrad Gutkowski and Julian Blaschke',
    institution: 'Work With Sounds, via Wikimedia Commons',
    date: 'machine 1920s; recording 2014',
    sourceType: 'secondary',
    mediaKind: 'audio',
    pageURL: 'https://commons.wikimedia.org/wiki/File:WWS_Hacksaw.ogg',
    whatItShows:
      'A 1920s-era machine recorded in a museum in 2014. It is NOT a recording made in a 1920s Ford factory — it is a modern recording of a surviving machine, offered as a sense of the mechanical sound world.',
    exhibits: [2],
    permissionStatus: 'public-domain-link',
    displayAttribution:
      'Work With Sounds / Konrad Gutkowski / Julian Blaschke, "WWS Hacksaw," 2014 recording. CC BY 4.0 — https://creativecommons.org/licenses/by/4.0/',
    rightsNote:
      'CC BY 4.0: reuse requires crediting Work With Sounds / Konrad Gutkowski / Julian Blaschke and noting any changes. We link to the file page rather than bundling or editing the audio.',
  },

  /* ---------------------------------------------------------------- Exhibit 3 */
  {
    id: 'thf-ford-ad-1924',
    title: '"How Did He Ever Get the Money to Buy a Car?" (advertisement)',
    creator: 'Ford Motor Company',
    institution: 'The Henry Ford',
    date: '1924',
    sourceType: 'primary',
    mediaKind: 'artifact',
    pageURL: 'https://www.thehenryford.org/collections/explore/artifact/355541',
    whatItShows:
      'A 1924 Ford advertisement promoting the Ford Weekly Purchase Plan. Important precision: that plan was a SAVING plan — regular deposits toward a car — not an installment loan.',
    exhibits: [3],
    permissionStatus: 'link-only',
    displayAttribution:
      'Ford Motor Company, "How Did He Ever Get the Money to Buy a Car?," 1924. The Henry Ford.',
    rightsNote: 'Linked to The Henry Ford artifact page; image not copied into this site.',
  },
  {
    id: 'loc-cartoon-hard-hit-1929',
    title: '"I, too, know just how it feels to be hard hit!" (political cartoon)',
    creator: 'Cartoonist as credited on the item record',
    institution: 'Library of Congress',
    date: '1929',
    sourceType: 'primary',
    mediaKind: 'cartoon',
    pageURL: 'https://www.loc.gov/item/2016678861/',
    whatItShows:
      'A 1929 cartoon using Wall Street ticker tape to comment on losses in the market — evidence of how quickly the crash entered popular commentary.',
    exhibits: [3],
    permissionStatus: 'link-only',
    displayAttribution:
      '"I, too, know just how it feels to be hard hit!," 1929. Library of Congress.',
    rightsNote:
      'Rights not verified for embedding, so this item is linked only. Check the item page before any reuse.',
  },
  {
    id: 'loc-merchandising-advertising',
    title: '"Merchandising and Advertising"',
    creator: 'Library of Congress (editorial staff)',
    institution: 'Library of Congress — Calvin Coolidge Papers, "Prosperity and Thrift"',
    date: 'modern institutional essay',
    sourceType: 'secondary',
    mediaKind: 'essay',
    pageURL:
      'https://www.loc.gov/collections/calvin-coolidge-papers/articles-and-essays/introduction-to-prosperity-and-thrift/merchandising-and-advertising/',
    whatItShows:
      'An institutional overview of how advertising, chain stores and radio reshaped American selling and buying in the 1920s. Secondary analysis that frames the primary advertisements.',
    exhibits: [3, 2],
    permissionStatus: 'link-only',
    displayAttribution:
      'Library of Congress, "Merchandising and Advertising," Prosperity and Thrift: The Coolidge Era.',
    rightsNote: 'Modern essay by the institution — secondary, not a period artifact.',
  },
  {
    id: 'fedhistory-crash-1929',
    title: '"Stock Market Crash of 1929"',
    creator: 'Federal Reserve History (editorial staff)',
    institution: 'Federal Reserve History',
    date: 'modern essay',
    sourceType: 'secondary',
    mediaKind: 'essay',
    pageURL: 'https://www.federalreservehistory.org/essays/stock-market-crash-of-1929',
    whatItShows:
      'The Federal Reserve\'s own account of the October 1929 crash, margin lending, and what followed. We use it for the careful claim that the crash contributed to the downturn without being its single cause.',
    exhibits: [3, 6],
    permissionStatus: 'link-only',
    displayAttribution: 'Federal Reserve History, "Stock Market Crash of 1929."',
    rightsNote: 'Modern secondary essay.',
  },

  /* ---------------------------------------------------------------- Exhibit 4 */
  {
    id: 'commons-manhatta-1921',
    title: '*Manhatta* (1921), silent film',
    creator: 'Charles Sheeler and Paul Strand',
    institution: 'Wikimedia Commons',
    date: '1921',
    sourceType: 'primary',
    mediaKind: 'film',
    pageURL: 'https://commons.wikimedia.org/wiki/File:Manhatta_(1921).webm',
    whatItShows:
      'A 1921 art film of New York: ferries, crowds, construction and skyline. It is SILENT — any sound you hear while watching it elsewhere was added later. Evidence of the scale and density of the industrial city.',
    exhibits: [4],
    permissionStatus: 'public-domain-link',
    displayAttribution:
      'Charles Sheeler and Paul Strand, *Manhatta*, 1921. Via Wikimedia Commons. Silent film.',
    rightsNote:
      'The restored file is very large, so we link to the Commons file page instead of transcoding or bundling it.',
  },
  {
    id: 'loc-ford-tractor-demo',
    title: 'Ford tractor demonstration',
    creator: 'Photographer as credited on the item record',
    institution: 'Library of Congress',
    date: '1921–1922',
    sourceType: 'primary',
    mediaKind: 'photograph',
    pageURL: 'https://www.loc.gov/item/2016823779/',
    whatItShows:
      'A period record of a Ford tractor being demonstrated — machinery arriving on American farms at the very start of the decade that would prove so difficult for farm incomes.',
    exhibits: [4, 5],
    permissionStatus: 'link-only',
    displayAttribution: 'Ford tractor demonstration, 1921–22. Library of Congress.',
    rightsNote: 'Linked to the Library of Congress item page.',
  },
  {
    id: 'thf-model-t-pickup-1925',
    title: '"1925 Ford Model T Pickup Truck with Groceries"',
    creator: 'Ford Motor Company (photographer unidentified)',
    institution: 'The Henry Ford',
    date: '1925',
    sourceType: 'primary',
    mediaKind: 'photograph',
    pageURL: 'https://www.thehenryford.org/collections/explore/artifact/49792',
    whatItShows:
      'A period photograph of a Model T pickup loaded with groceries. It documents how ordinary commerce and delivery came to depend on the automobile. It is a photograph of a vehicle — not a photograph of a suburb.',
    exhibits: [4, 5],
    permissionStatus: 'link-only',
    displayAttribution:
      'Ford Motor Company, "1925 Ford Model T Pickup Truck with Groceries," 1925. The Henry Ford.',
    rightsNote: 'Linked to The Henry Ford artifact page.',
  },
  {
    id: 'census-1920-photos',
    title: 'The 1920 Census',
    creator: 'U.S. Census Bureau',
    institution: 'U.S. Census Bureau',
    date: 'modern explanatory page about the 1920 census',
    sourceType: 'secondary',
    mediaKind: 'essay',
    pageURL: 'https://www.census.gov/library/photos/1920_census.html',
    whatItShows:
      'The Census Bureau\'s own page on the 1920 census — the count in which, for the first time, more than half of the United States population was classified as urban.',
    exhibits: [4],
    permissionStatus: 'link-only',
    displayAttribution: 'U.S. Census Bureau, "The 1920 Census."',
    rightsNote: 'Modern government explanatory page — secondary.',
  },
  {
    id: 'census-urban-rural-definitions',
    title: 'Urban and Rural Areas — history of the classification',
    creator: 'U.S. Census Bureau',
    institution: 'U.S. Census Bureau',
    date: 'modern reference page',
    sourceType: 'secondary',
    mediaKind: 'essay',
    pageURL:
      'https://www.census.gov/about/history/historical-censuses-and-surveys/census-programs-surveys/geography/urban-and-rural-areas.html',
    whatItShows:
      'How the Census Bureau has defined "urban" and "rural" over time. This matters: the 1920 milestone depends on a specific official definition, not on a feeling about city life.',
    exhibits: [4],
    permissionStatus: 'link-only',
    displayAttribution: 'U.S. Census Bureau, "Urban and Rural Areas."',
    rightsNote: 'Modern government reference page — secondary.',
  },

  /* ---------------------------------------------------------------- Exhibit 5 */
  {
    id: 'thf-grain-harvest-1925',
    title: '"Grain Harvest at Ford Farms, Southeastern Michigan"',
    creator: 'Ford Motor Company (photographer unidentified)',
    institution: 'The Henry Ford',
    date: 'circa 1925',
    sourceType: 'primary',
    mediaKind: 'photograph',
    pageURL: 'https://www.thehenryford.org/collections/explore/artifact/112571',
    whatItShows:
      'A mid-1920s grain harvest in Michigan. The image shows the work and the machinery of harvest — the output side of farming, which was never the same thing as farm income.',
    exhibits: [5],
    permissionStatus: 'link-only',
    displayAttribution:
      'Ford Motor Company, "Grain Harvest at Ford Farms, Southeastern Michigan," circa 1925. The Henry Ford.',
    rightsNote: 'Linked to The Henry Ford artifact page.',
  },
  {
    id: 'thf-pullford-catalog',
    title: 'Pullford Company, "Low Cost Farm Power" (trade catalogue)',
    creator: 'Pullford Company',
    institution: 'The Henry Ford',
    date: 'circa 1925',
    sourceType: 'primary',
    mediaKind: 'document',
    pageURL: 'https://www.thehenryford.org/collections/explore/artifact/364979',
    whatItShows:
      'A sales catalogue selling farm power to farmers. Catalogues like this are evidence of how machinery was marketed — and of the purchases that put farm families into debt.',
    exhibits: [5],
    permissionStatus: 'link-only',
    displayAttribution:
      'Pullford Company, "Low Cost Farm Power," circa 1925. The Henry Ford.',
    rightsNote: 'Linked to The Henry Ford artifact page.',
  },
  {
    id: 'thf-farmall-1925',
    title: 'McCormick-Deering Farmall tractor',
    creator: 'International Harvester Company',
    institution: 'The Henry Ford',
    date: 'circa 1925',
    sourceType: 'primary',
    mediaKind: 'artifact',
    pageURL: 'https://www.thehenryford.org/collections/explore/artifact/230038',
    whatItShows:
      'A surviving 1920s Farmall tractor — the object itself. A row-crop tractor of this kind could replace a great deal of labour, and cost more than many farms could comfortably finance.',
    exhibits: [5],
    permissionStatus: 'link-only',
    displayAttribution:
      'International Harvester, McCormick-Deering Farmall tractor, circa 1925. The Henry Ford.',
    rightsNote: 'Linked to The Henry Ford artifact page.',
  },
  {
    id: 'loc-poverty-1920s',
    title: '"Poverty in the 1920s"',
    creator: 'Library of Congress (editorial staff)',
    institution: 'Library of Congress — Calvin Coolidge Papers, "Prosperity and Thrift"',
    date: 'modern institutional essay',
    sourceType: 'secondary',
    mediaKind: 'essay',
    pageURL:
      'https://www.loc.gov/collections/calvin-coolidge-papers/articles-and-essays/introduction-to-prosperity-and-thrift/poverty-in-the-1920s/',
    whatItShows:
      'An institutional overview of who was poor during the decade of "prosperity," including farm families and low-wage urban workers. The counterweight to the boom story.',
    exhibits: [5, 4, 6],
    permissionStatus: 'link-only',
    displayAttribution:
      'Library of Congress, "Poverty in the 1920s," Prosperity and Thrift: The Coolidge Era.',
    rightsNote: 'Modern essay by the institution — secondary.',
  },

  /* ------------------------------------------------- Context / Exhibit 6 / all */
  {
    id: 'loc-prosperity-coolidge-era',
    title: '"The Prosperity of the Coolidge Era"',
    creator: 'Library of Congress (editorial staff)',
    institution: 'Library of Congress — Calvin Coolidge Papers, "Prosperity and Thrift"',
    date: 'modern institutional essay',
    sourceType: 'secondary',
    mediaKind: 'essay',
    pageURL:
      'https://www.loc.gov/collections/calvin-coolidge-papers/articles-and-essays/introduction-to-prosperity-and-thrift/prosperity-of-the-coolidge-era/',
    whatItShows:
      'An overview of the growth of the mid-1920s economy and the policies and conditions behind it.',
    exhibits: [3, 5, 6],
    permissionStatus: 'link-only',
    displayAttribution:
      'Library of Congress, "The Prosperity of the Coolidge Era," Prosperity and Thrift: The Coolidge Era.',
    rightsNote: 'Modern essay by the institution — secondary.',
  },
  {
    id: 'loc-african-americans-consumerism',
    title: '"African Americans and Consumerism"',
    creator: 'Library of Congress (editorial staff)',
    institution: 'Library of Congress — Calvin Coolidge Papers, "Prosperity and Thrift"',
    date: 'modern institutional essay',
    sourceType: 'secondary',
    mediaKind: 'essay',
    pageURL:
      'https://www.loc.gov/collections/calvin-coolidge-papers/articles-and-essays/introduction-to-prosperity-and-thrift/african-americans-and-consumerism/',
    whatItShows:
      'How Black Americans participated in — and were excluded from — the new consumer economy. Essential for judging Essential Question A2 honestly.',
    exhibits: [5, 6],
    permissionStatus: 'link-only',
    displayAttribution:
      'Library of Congress, "African Americans and Consumerism," Prosperity and Thrift: The Coolidge Era.',
    rightsNote: 'Modern essay by the institution — secondary.',
  },
  {
    id: 'loc-coolidge-administration',
    title: '"The Coolidge Administration"',
    creator: 'Library of Congress (editorial staff)',
    institution: 'Library of Congress — Calvin Coolidge Papers, "Prosperity and Thrift"',
    date: 'modern institutional essay',
    sourceType: 'secondary',
    mediaKind: 'essay',
    pageURL:
      'https://www.loc.gov/collections/calvin-coolidge-papers/articles-and-essays/introduction-to-prosperity-and-thrift/coolidge-administration/',
    whatItShows:
      'The economic policy of the Coolidge administration — taxation, thrift, and a pro-business federal posture — which is the political half of Essential Question A2.',
    exhibits: [6],
    permissionStatus: 'link-only',
    displayAttribution:
      'Library of Congress, "The Coolidge Administration," Prosperity and Thrift: The Coolidge Era.',
    rightsNote: 'Modern essay by the institution — secondary.',
  },
  {
    id: 'fedhistory-great-depression',
    title: '"The Great Depression"',
    creator: 'Federal Reserve History (editorial staff)',
    institution: 'Federal Reserve History',
    date: 'modern essay',
    sourceType: 'secondary',
    mediaKind: 'essay',
    pageURL: 'https://www.federalreservehistory.org/essays/great-depression',
    whatItShows:
      'The longer account of the 1929–1933 collapse, including banking panics and monetary policy. We cite it to keep the crash and the Depression as separate things with separate causes.',
    exhibits: [6],
    permissionStatus: 'link-only',
    displayAttribution: 'Federal Reserve History, "The Great Depression."',
    rightsNote: 'Modern secondary essay.',
  },
  {
    id: 'commons-coolidge-speech-1924',
    title:
      '"Speech on Taxes, Liberty, and the Philosophy of Government," Calvin Coolidge',
    creator: 'Calvin Coolidge',
    institution: 'Wikimedia Commons',
    date: '1924',
    sourceType: 'primary',
    mediaKind: 'audio',
    pageURL:
      'https://commons.wikimedia.org/wiki/File:Speech_on_Taxes,_Liberty,_and_the_Philosophy_of_Government,_by_Calvin_Coolidge.ogg',
    whatItShows:
      'A recording of President Coolidge in 1924 on taxation, liberty and the role of government — the president\'s own voice stating the philosophy behind 1920s federal economic policy.',
    exhibits: [6],
    permissionStatus: 'public-domain-link',
    displayAttribution:
      'Calvin Coolidge, "Speech on Taxes, Liberty, and the Philosophy of Government," 1924. Via Wikimedia Commons.',
    rightsNote:
      'We link to the file page to listen at the source. We do not quote the speech here, because we have not verified a transcript word for word.',
  },
  {
    id: 'commons-hot-lips-1922',
    title: '"Hot Lips"',
    creator: 'Paul Whiteman and His Orchestra',
    institution: 'Wikimedia Commons',
    date: 'recorded 1922',
    sourceType: 'primary',
    mediaKind: 'audio',
    pageURL: 'https://commons.wikimedia.org/wiki/File:Hot_Lips.ogg',
    whatItShows:
      'A 1922 dance-band recording — the commercial popular music of the decade, and itself a product of the new consumer economy of records and radio.',
    exhibits: [3, 1],
    permissionStatus: 'public-domain-link',
    displayAttribution:
      'Paul Whiteman and His Orchestra, "Hot Lips," recorded 1922. Via Wikimedia Commons.',
    rightsNote:
      'Described as public domain in the United States on the Commons file page. Linked rather than bundled; check the page for current details.',
  },
  {
    id: 'loc-jukebox-wild-about-harry',
    title: '"I\'m Just Wild About Harry"',
    creator: 'Paul Whiteman and His Orchestra',
    institution: 'Library of Congress — National Jukebox',
    date: '1922',
    sourceType: 'primary',
    mediaKind: 'audio',
    pageURL: 'https://www.loc.gov/item/jukebox-63199/',
    whatItShows:
      'A 1922 recording streamed by the Library of Congress National Jukebox. Listen at the Library of Congress — we make no assumption of download or embedding rights.',
    exhibits: [3],
    permissionStatus: 'link-only',
    displayAttribution:
      'Paul Whiteman and His Orchestra, "I\'m Just Wild About Harry," 1922. Library of Congress, National Jukebox.',
    rightsNote:
      'Streaming at the Library of Congress. No download or re-embedding rights assumed.',
  },
];

export const sourceById = (id: string): SourceItem | undefined =>
  SOURCES.find((s) => s.id === id);

export const sourcesForExhibit = (n: number): SourceItem[] =>
  SOURCES.filter((s) => s.exhibits.includes(n));

export const SOURCE_TYPE_LABEL: Record<SourceType, string> = {
  primary: 'Primary source',
  secondary: 'Secondary source',
  illustrative: 'Original illustration (modern)',
};
