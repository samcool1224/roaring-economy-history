/**
 * media.ts — every photograph and archival film used in the exhibits.
 *
 * Images live in  public/media/images/<file>.<ext>
 * The extension can be .jpg, .jpeg, .png, .webp or .gif: the page tries each in
 * turn, so a downloaded file only needs the right name, not a particular format.
 * If no file is found, a lesson station falls back to its drawn illustration and
 * a gallery card is simply left out.
 */

export interface ExhibitImage {
  /** Base filename, without extension, inside public/media/images/. */
  file: string;
  title: string;
  /** One or two sentences on what the item teaches. */
  caption: string;
  /** Where the image was found, for the References panel. Empty if unknown. */
  sourceUrl: string;
  sourceSite: string;
}

export const IMAGES: Record<string, ExhibitImage> = {
  /* ------------------------------------------------------------ Exhibit 1 */
  'ex1-grocery': {
    file: 'ex1-grocery',
    title: 'At the grocery store',
    caption:
      'Everyday groceries are where postwar inflation showed up first. As prices climbed after the war, the same weekly wage bought less at the store.',
    sourceUrl:
      'https://www.anchoragemuseum.org/media/16802/winter-in-the-grocery-1-1200x627.jpg',
    sourceSite: 'Anchorage Museum',
  },
  'ex1-farm-money': {
    file: 'ex1-farm-money',
    title: 'Farm money and debt',
    caption:
      'Farmers borrowed to expand during the war, when crop prices were high. When prices fell after 1920, those debts stayed the same size.',
    sourceUrl: 'https://livinghistoryfarm.org/wp-content/uploads/money0901.jpg',
    sourceSite: 'Living History Farm',
  },
  'ex1-war-surplus': {
    file: 'ex1-war-surplus',
    title: 'Military surplus',
    caption:
      'When the war ended, factories making military goods lost their biggest customer and leftover supplies were sold off. Firms had to switch to making goods for civilian buyers.',
    sourceUrl: 'https://content.artofmanliness.com/uploads//2016/10/surplus_header.png',
    sourceSite: 'The Art of Manliness',
  },

  /* ------------------------------------------------------------ Exhibit 2 */
  'ex2-assembly-line': {
    file: 'ex2-assembly-line',
    title: 'Model T assembly line',
    caption:
      'Workers stay at one station while the cars move past them, each repeating a single task. This specialization let Ford build cars faster and sell them for less.',
    sourceUrl: '',
    sourceSite: 'Exhibit research materials',
  },
  'ex2-radio': {
    file: 'ex2-radio',
    title: 'Radio',
    caption:
      'Radio was one of the decade’s new industries. Sets went from novelty to household item, and broadcasting gave advertisers a national audience.',
    sourceUrl:
      'https://npr.brightspotcdn.com/dims4/default/5b73ec9/2147483647/strip/true/crop/545x600+0+0/resize/1760x1938!/format/webp/quality/90/?url=http%3A%2F%2Fnpr-brightspot.s3.amazonaws.com%2Flegacy%2Fsites%2Fwshu%2Ffiles%2F201407%2Fphilco70f.jpg',
    sourceSite: 'NPR',
  },
  'ex2-stock-certificate': {
    file: 'ex2-stock-certificate',
    title: 'Stock certificate',
    caption:
      'A certificate showed that its owner held shares in a company. As businesses grew, more Americans bought stock hoping to share in the profits.',
    sourceUrl: 'https://img.mysticseaport.org/images/l038817/l038817-01-r.gif',
    sourceSite: 'Mystic Seaport Museum',
  },
  'ex2-assembly-model': {
    file: 'ex2-assembly-model',
    title: 'Assembly-line model',
    caption:
      'On an assembly line the product moves from station to station and each worker adds one part, so no one has to build the whole thing.',
    sourceUrl:
      'https://sibbotsonhistory12.weebly.com/uploads/3/8/8/7/38876335/7654455_orig.png',
    sourceSite: 'sibbotsonhistory12.weebly.com',
  },

  /* ------------------------------------------------------------ Exhibit 3 */
  'ex3-model-t-family': {
    file: 'ex3-model-t-family',
    title: 'A family and its Model T',
    caption:
      'The Model T put car ownership within reach of ordinary families. A car changed where people could live, work, shop and travel.',
    sourceUrl:
      'https://upload.wikimedia.org/wikipedia/commons/4/42/Family_group_in_Model_T_touring_car%2C_probably_near_Hamilton%2C_ca_1912_%28KINSEY_250%29.jpeg',
    sourceSite: 'Wikimedia Commons',
  },
  'ex3-refrigerator': {
    file: 'ex3-refrigerator',
    title: 'Electric refrigerator',
    caption:
      'Electric refrigerators were among the new appliances of the decade. They were expensive, and stores often sold appliances like this on installment plans.',
    sourceUrl:
      'https://www.reddit.com/media?url=https%3A%2F%2Fexternal-preview.redd.it%2Fthis-refrigerator-was-built-in-the-1920s-and-cost-300-its-v0-dHf0BbeXB1YDFz047YijeRtEbRIdKhgDS8WJkPYDl1s.jpeg%3Fauto%3Dwebp%26s%3Dc20b0852f798400292c1267c63c1017a6bbf2b17',
    sourceSite: 'Reddit',
  },
  'ex3-washing-machine': {
    file: 'ex3-washing-machine',
    title: 'Electric washing machine',
    caption:
      'Electric washers saved hours of household labor, but only homes wired for electricity could use them, and many rural homes were not.',
    sourceUrl:
      'https://evolutionhomeappliances.weebly.com/uploads/1/0/8/3/108313617/1924-easy-brand-washer-cornell-dd-hem-26_1_orig.jpg',
    sourceSite: 'evolutionhomeappliances.weebly.com',
  },
  'ex3-stock-ticker': {
    file: 'ex3-stock-ticker',
    title: 'Stock ticker',
    caption:
      'A ticker printed share prices onto paper tape as trades happened. During the heavy selling of October 1929 the tickers fell hours behind the market.',
    sourceUrl:
      'https://www.stocktickercompany.com/wp-content/uploads/2016/04/universalStockTickerBig.jpg',
    sourceSite: 'The Stock Ticker Company',
  },

  /* ------------------------------------------------------------ Exhibit 4 */
  'ex4-skyscraper': {
    file: 'ex4-skyscraper',
    title: 'Skyscraper design',
    caption:
      'Steel-frame construction made tall office towers possible, and they came to define the skylines of growing American cities.',
    sourceUrl: '',
    sourceSite: 'Exhibit research materials',
  },
  'ex4-suburban-house': {
    file: 'ex4-suburban-house',
    title: 'Suburban house',
    caption:
      'Single-family homes on their own lots spread outward from cities as cars and better roads made longer commutes practical.',
    sourceUrl:
      'https://clickamericana.com/wp-content/uploads/1920s-home-in-the-Dutch-Colonial-style.jpg',
    sourceSite: 'Click Americana',
  },
  'ex4-farm-tractor': {
    file: 'ex4-farm-tractor',
    title: 'Farm tractor',
    caption:
      'Tractors let one family farm more land with fewer workers. The extra output, though, helped push crop prices down.',
    sourceUrl: 'https://livinghistoryfarm.org/wp-content/uploads/machines_0103.jpg',
    sourceSite: 'Living History Farm',
  },

  /* ------------------------------------------------------------ Exhibit 5 */
  'ex5-department-store-ad': {
    file: 'ex5-department-store-ad',
    title: 'Department store advertisement',
    caption:
      'City department stores advertised a wide range of goods to wage-earning shoppers, helping build the consumer culture of the decade.',
    sourceUrl:
      'https://www.reddit.com/media?url=https%3A%2F%2Fpreview.redd.it%2F1920s-minneapolis-department-stores-full-page-christmas-v0-pfviu9armh5c1.jpg%3Fwidth%3D1080%26crop%3Dsmart%26auto%3Dwebp%26s%3D8abc63d047ab4989123750aad0bbb02da4d9b722',
    sourceSite: 'Reddit',
  },
  'ex5-farm-mortgage': {
    file: 'ex5-farm-mortgage',
    title: 'Mortgage document',
    caption:
      'A mortgage pledged land as security for a loan. When crop prices fell the payments stayed the same, and families who could not pay risked losing their land.',
    sourceUrl: '',
    sourceSite: 'Exhibit research materials',
  },
};

/** Photographs shown in each exhibit's gallery, in display order. */
export const GALLERY: Record<number, string[]> = {
  1: ['ex1-grocery', 'ex1-farm-money', 'ex1-war-surplus'],
  2: ['ex2-assembly-line', 'ex2-radio', 'ex2-stock-certificate', 'ex2-assembly-model'],
  3: ['ex3-model-t-family', 'ex3-refrigerator', 'ex3-washing-machine', 'ex3-stock-ticker'],
  4: ['ex3-model-t-family', 'ex4-skyscraper', 'ex4-suburban-house', 'ex4-farm-tractor'],
  5: ['ex3-model-t-family', 'ex5-department-store-ad', 'ex5-farm-mortgage'],
};

/** The photograph shown with each lesson station. */
export const STATION_IMAGE: Record<string, string> = {
  e1s1: 'ex1-grocery',
  e1s2: 'ex1-war-surplus',
  e1s3: 'ex1-farm-money',
  e2s1: 'ex2-assembly-line',
  e2s2: 'ex2-assembly-model',
  e2s3: 'ex2-radio',
  e3s1: 'ex3-refrigerator',
  e3s2: 'ex3-model-t-family',
  e3s3: 'ex3-stock-ticker',
  e4s1: 'ex4-skyscraper',
  e4s2: 'ex4-suburban-house',
  e4s3: 'ex4-farm-tractor',
  e5s1: 'ex5-department-store-ad',
  e5s2: 'ex1-farm-money',
  e5s3: 'ex5-farm-mortgage',
};

/* ------------------------------------------------------------------ films */

export interface ArchivalFilm {
  youtubeId: string;
  title: string;
  caption: string;
}

/** Archival footage, one film per exhibit where it fits. Change the exhibit key to move one. */
export const FILMS: Record<number, ArchivalFilm> = {
  2: {
    youtubeId: '-IYx6KMVpSg',
    title: 'Model T assembly line',
    caption: 'Archival footage of the moving assembly line that built the Model T.',
  },
  3: {
    youtubeId: 'hCS9H07w86g',
    title: 'The stock exchange',
    caption: 'Archival footage of trading on the stock exchange.',
  },
  4: {
    youtubeId: 'haVVWapm7Yw',
    title: 'The agricultural depression',
    caption: 'Archival footage on the hard times that hit American farms.',
  },
};

export const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'] as const;
export const imageCandidates = (file: string): string[] =>
  IMAGE_EXTENSIONS.map((ext) => `media/images/${file}.${ext}`);
