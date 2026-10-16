/**
 * RoomBackdrop.tsx — one original pixel-flavoured SVG scene per room.
 * All six are drawn differently so no two rooms feel like the same template.
 */

interface Props {
  exhibit: number;
  animate: boolean;
}

const C = {
  paper: '#ede5d1',
  paperDim: '#ddd4bf',
  ink: '#726248',
  navy: '#4a5d82',
  navyDeep: '#415274',
  brass: '#d9c49a',
  brassDeep: '#c4a66b',
  burgundy: '#b04f64',
  green: '#81a587',
  rust: '#d0917e',
  sky: '#afc7da',
  steel: '#9f9fa9',
};

export default function RoomBackdrop({ exhibit, animate }: Props) {
  const cls = `room-backdrop${animate ? ' is-animated' : ''}`;
  switch (exhibit) {
    case 1:
      return <Newsroom className={cls} />;
    case 2:
      return <Factory className={cls} />;
    case 3:
      return <MarketRoom className={cls} />;
    case 4:
      return <MapRoom className={cls} />;
    case 5:
      return <TwoLivesRoom className={cls} />;
    default:
      return <Council className={cls} />;
  }
}

const svgProps = (className: string) => ({
  viewBox: '0 0 1000 420',
  className,
  preserveAspectRatio: 'xMidYMid slice' as const,
  'aria-hidden': true,
  role: 'img' as const,
});

/* ------------------------------------------------------------- Exhibit 1 */
function Newsroom({ className }: { className: string }) {
  return (
    <svg {...svgProps(className)}>
      <rect width="1000" height="420" fill="#636376" />
      {/* back wall with window */}
      <rect width="1000" height="250" fill="#737388" />
      <rect x="60" y="30" width="180" height="140" fill="#4d6383" />
      <rect x="64" y="34" width="172" height="132" fill="#8192ab" opacity="0.6" />
      <line x1="150" y1="30" x2="150" y2="170" stroke="#636376" strokeWidth="6" />
      <line x1="60" y1="100" x2="240" y2="100" stroke="#636376" strokeWidth="6" />
      {/* hanging lamps */}
      {[380, 620, 860].map((x) => (
        <g key={x}>
          <line x1={x} y1="0" x2={x} y2="40" stroke={C.brassDeep} strokeWidth="3" />
          <path d={`M${x - 26} 64 L${x + 26} 64 L${x + 14} 40 L${x - 14} 40 Z`} fill={C.brassDeep} />
          <ellipse cx={x} cy="64" rx="26" ry="5" fill="#fceabd" opacity="0.5" className="lamp-glow" />
        </g>
      ))}
      {/* printing press */}
      <g>
        <rect x="690" y="120" width="250" height="130" fill="#95775c" />
        <rect x="706" y="136" width="218" height="98" fill="#836a55" />
        <circle cx="760" cy="185" r="34" fill="#9f876b" className="spin-slow" />
        <circle cx="760" cy="185" r="12" fill={C.brass} />
        <circle cx="870" cy="185" r="26" fill="#9f876b" className="spin-slow" />
        <circle cx="870" cy="185" r="9" fill={C.brass} />
        <rect x="700" y="246" width="240" height="10" fill="#726248" />
        {[0, 1, 2].map((i) => (
          <rect key={i} x={716 + i * 14} y="254" width="10" height="26" fill={C.paper} className="press-sheet" />
        ))}
      </g>
      {/* floor */}
      <rect y="250" width="1000" height="170" fill="#95775c" />
      {Array.from({ length: 14 }).map((_, i) => (
        <line key={i} x1={i * 72} y1="250" x2={i * 72 - 40} y2="420" stroke="#836a55" strokeWidth="3" />
      ))}
      {/* desk */}
      <rect x="120" y="258" width="400" height="22" fill="#b3845e" />
      <rect x="120" y="280" width="400" height="12" fill="#9e6f49" />
      <rect x="150" y="292" width="18" height="90" fill="#9e6f49" />
      <rect x="470" y="292" width="18" height="90" fill="#9e6f49" />
      {/* typewriter */}
      <g>
        <rect x="210" y="222" width="90" height="38" rx="4" fill="#726248" />
        <rect x="220" y="206" width="70" height="20" fill="#806d5e" />
        <rect x="226" y="194" width="58" height="16" fill={C.paper} />
        {[0, 1, 2].map((r) =>
          [0, 1, 2, 3, 4, 5].map((c) => (
            <circle key={`${r}-${c}`} cx={222 + c * 13} cy={234 + r * 8} r="3" fill={C.paperDim} />
          )),
        )}
      </g>
      {/* stacked papers + coffee */}
      <rect x="340" y="244" width="70" height="16" fill={C.paper} />
      <rect x="344" y="238" width="70" height="8" fill={C.paperDim} />
      <rect x="430" y="236" width="24" height="24" rx="3" fill={C.paperDim} />
    </svg>
  );
}

/* ------------------------------------------------------------- Exhibit 2 */
function Factory({ className }: { className: string }) {
  return (
    <svg {...svgProps(className)}>
      <rect width="1000" height="420" fill="#6e7c94" />
      {/* sawtooth roof windows */}
      {Array.from({ length: 6 }).map((_, i) => (
        <g key={i}>
          <polygon
            points={`${i * 170},70 ${i * 170 + 90},10 ${i * 170 + 90},70`}
            fill="#939fb2"
            opacity="0.85"
          />
          <polygon points={`${i * 170 + 90},10 ${i * 170 + 170},70 ${i * 170 + 90},70`} fill="#606f8e" />
        </g>
      ))}
      <rect y="70" width="1000" height="16" fill="#5d6989" />
      {/* big gears */}
      <g className="spin-slow" style={{ transformOrigin: '140px 180px' }}>
        <circle cx="140" cy="180" r="62" fill="none" stroke={C.brassDeep} strokeWidth="14" />
        {Array.from({ length: 10 }).map((_, i) => {
          const a = (i / 10) * Math.PI * 2;
          return (
            <rect
              key={i}
              x={140 + Math.cos(a) * 66 - 7}
              y={180 + Math.sin(a) * 66 - 7}
              width="14"
              height="14"
              fill={C.brassDeep}
            />
          );
        })}
        <circle cx="140" cy="180" r="16" fill={C.brass} />
      </g>
      <g className="spin-reverse" style={{ transformOrigin: '236px 128px' }}>
        <circle cx="236" cy="128" r="36" fill="none" stroke={C.brass} strokeWidth="10" />
        {Array.from({ length: 8 }).map((_, i) => {
          const a = (i / 8) * Math.PI * 2;
          return (
            <rect
              key={i}
              x={236 + Math.cos(a) * 40 - 5}
              y={128 + Math.sin(a) * 40 - 5}
              width="10"
              height="10"
              fill={C.brass}
            />
          );
        })}
      </g>
      {/* scoreboard */}
      <rect x="640" y="36" width="300" height="110" fill="#6b5743" />
      <rect x="652" y="48" width="276" height="86" fill="#3b5268" />
      <text x="790" y="86" fontSize="22" textAnchor="middle" fill={C.brass} fontFamily="Georgia, serif">
        PRODUCTION
      </text>
      <text x="790" y="120" fontSize="26" textAnchor="middle" fill="#b8d1bc" fontFamily="Georgia, serif">
        MODEL T
      </text>
      {/* conveyor */}
      <rect y="250" width="1000" height="46" fill="#838393" />
      <rect y="250" width="1000" height="6" fill="#9595a2" />
      {Array.from({ length: 25 }).map((_, i) => (
        <circle key={i} cx={20 + i * 40} cy="282" r="12" fill={C.brassDeep} />
      ))}
      {/* car bodies on the belt */}
      {[180, 520, 840].map((x, i) => (
        <g key={x} className="belt-item" style={{ animationDelay: `${i * -2.4}s` }}>
          <rect x={x} y="206" width="110" height="34" rx="4" fill={i === 1 ? C.burgundy : '#4f6489'} />
          <polygon
            points={`${x + 22},206 ${x + 34},186 ${x + 78},186 ${x + 90},206`}
            fill={i === 1 ? '#b86c7b' : '#57719e'}
          />
          <circle cx={x + 26} cy="244" r="10" fill="#6b5743" />
          <circle cx={x + 86} cy="244" r="10" fill="#6b5743" />
        </g>
      ))}
      {/* floor */}
      <rect y="296" width="1000" height="124" fill="#717b94" />
      {Array.from({ length: 20 }).map((_, i) => (
        <rect key={i} x={i * 52} y="296" width="26" height="124" fill="#798399" />
      ))}
      {/* workers */}
      {[340, 640].map((x) => (
        <g key={x}>
          <rect x={x} y="300" width="16" height="36" fill="#5b719c" />
          <rect x={x + 2} y="286" width="12" height="14" fill="#e4c7ae" />
          <rect x={x} y="282" width="16" height="6" fill="#806d5e" />
        </g>
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------- Exhibit 3 */
function MarketRoom({ className }: { className: string }) {
  return (
    <svg {...svgProps(className)}>
      <rect width="1000" height="420" fill="#516287" />
      {/* dividing column */}
      <rect x="486" width="28" height="420" fill={C.brassDeep} />
      <rect x="492" width="16" height="420" fill={C.brass} />

      {/* LEFT: department store */}
      <rect width="486" height="420" fill="#5a6d94" />
      <rect x="24" y="30" width="430" height="210" fill="#6879a2" />
      <rect x="36" y="42" width="406" height="186" fill="#7988ab" />
      <text x="239" y="30" fontSize="20" textAnchor="middle" fill={C.brass} fontFamily="Georgia, serif">
        EVERY MODERN COMFORT
      </text>
      {/* goods on shelves */}
      <rect x="36" y="118" width="406" height="8" fill="#5a6d94" />
      <rect x="60" y="62" width="70" height="52" fill="#ac814e" />
      <circle cx="95" cy="88" r="16" fill={C.brass} />
      <rect x="160" y="70" width="56" height="44" fill={C.green} />
      <rect x="172" y="80" width="32" height="24" fill="#b8d1bc" />
      <rect x="248" y="58" width="48" height="56" fill={C.rust} />
      <rect x="330" y="66" width="86" height="48" fill="#b04f64" />
      <rect x="60" y="134" width="90" height="84" fill="#8291b0" />
      <rect x="72" y="146" width="66" height="50" fill="#a1acbf" />
      <rect x="180" y="150" width="60" height="68" fill="#c4a66b" />
      <rect x="270" y="138" width="150" height="80" fill="#6e80a4" />
      <text x="345" y="184" fontSize="15" textAnchor="middle" fill={C.paperDim} fontFamily="Georgia, serif">
        ON EASY TERMS
      </text>
      {/* counter */}
      <rect y="250" width="486" height="20" fill="#b3845e" />
      <rect y="270" width="486" height="150" fill="#aa7645" />
      <rect x="150" y="214" width="78" height="38" rx="3" fill={C.brassDeep} />
      <rect x="162" y="224" width="54" height="18" fill="#3b5268" />
      {/* goods stacked on the counter */}
      <rect x="40" y="284" width="88" height="56" fill="#b9936b" />
      <rect x="46" y="290" width="76" height="44" fill="#be9f7c" />
      <rect x="54" y="300" width="60" height="6" fill={C.paperDim} />
      <rect x="54" y="312" width="42" height="6" fill={C.paperDim} opacity="0.7" />
      <rect x="276" y="292" width="70" height="48" fill="#8291b0" />
      <circle cx="311" cy="316" r="15" fill={C.brass} />
      <circle cx="311" cy="316" r="7" fill="#5a6d94" />
      <rect x="372" y="300" width="56" height="40" fill={C.green} />
      <rect x="384" y="310" width="32" height="20" fill="#b8d1bc" />
      {/* price tags */}
      <rect x="160" y="298" width="46" height="30" fill={C.paper} />
      <text x="183" y="319" fontSize="15" textAnchor="middle" fill={C.burgundy} fontFamily="Georgia, serif">
        $40
      </text>
      <rect x="0" y="352" width="486" height="8" fill="#956f45" />

      {/* RIGHT: broker's desk */}
      <rect x="514" width="486" height="420" fill="#54668d" />
      <rect x="546" y="26" width="420" height="34" fill="#415274" />
      <text x="756" y="50" fontSize="18" textAnchor="middle" fill="#b8d1bc" fontFamily="monospace">
        NMI 112 ▲ · AMC 86 ▲ · GTR 141 ▲
      </text>
      {/* chalk board of prices */}
      <rect x="560" y="76" width="392" height="150" fill="#4a5b7a" />
      {Array.from({ length: 5 }).map((_, i) => (
        <g key={i}>
          <rect x={578} y={96 + i * 28} width={110} height="8" fill={C.paperDim} opacity="0.55" />
          <rect x={720} y={96 + i * 28} width={60} height="8" fill="#b8d1bc" opacity={0.9 - i * 0.12} />
          <rect x={810} y={96 + i * 28} width={40} height="8" fill={C.brass} opacity="0.5" />
        </g>
      ))}
      {/* ticker machine under glass dome */}
      <g>
        <rect x="620" y="246" width="110" height="52" fill="#737385" />
        <path d="M620 246 a55 46 0 0 1 110 0" fill="#c1cfda" opacity="0.35" />
        <circle cx="675" cy="268" r="20" fill="#6b5743" />
        <circle cx="675" cy="268" r="9" fill={C.paper} />
        <path d="M730 280 q50 10 90 -8 t110 4" fill="none" stroke={C.paper} strokeWidth="4" className="tape-wiggle" />
      </g>
      {/* desk */}
      <rect x="514" y="298" width="486" height="18" fill="#ac814e" />
      <rect x="514" y="316" width="486" height="104" fill="#947248" />
    </svg>
  );
}

/* ------------------------------------------------------------- Exhibit 4 */
function MapRoom({ className }: { className: string }) {
  return (
    <svg {...svgProps(className)}>
      <rect width="1000" height="420" fill="#4c5f80" />
      {/* map table */}
      <rect x="30" y="40" width="940" height="340" rx="10" fill="#856c4e" />
      <rect x="46" y="56" width="908" height="308" fill="#ede5d1" />
      <rect x="46" y="56" width="908" height="308" fill="#e3dac3" opacity="0.4" />
      {/* contour-ish lines */}
      {Array.from({ length: 9 }).map((_, i) => (
        <path
          key={i}
          d={`M46 ${86 + i * 34} q 220 ${i % 2 ? -22 : 22} 450 0 t 458 0`}
          fill="none"
          stroke="#d1c7ad"
          strokeWidth="1.4"
          opacity="0.6"
        />
      ))}
      {/* three zones */}
      <rect x="60" y="70" width="290" height="280" fill="#808ea9" opacity="0.5" />
      <rect x="356" y="70" width="290" height="280" fill="#a3b59d" opacity="0.4" />
      <rect x="652" y="70" width="290" height="280" fill="#baba84" opacity="0.4" />
      <text x="205" y="96" fontSize="17" textAnchor="middle" fill={C.ink} fontFamily="Georgia, serif">
        CITY
      </text>
      <text x="501" y="96" fontSize="17" textAnchor="middle" fill={C.ink} fontFamily="Georgia, serif">
        SUBURB
      </text>
      <text x="797" y="96" fontSize="17" textAnchor="middle" fill={C.ink} fontFamily="Georgia, serif">
        FARM
      </text>
      {/* city blocks */}
      {[80, 130, 180, 230, 280].map((x, i) => (
        <rect key={x} x={x} y={200 - i * 14} width="34" height={140 + i * 14} fill="#7384a4" />
      ))}
      {/* suburb houses */}
      {[380, 460, 540].map((x) => (
        <g key={x}>
          <rect x={x} y="250" width="54" height="40" fill="#e3dbc9" />
          <polygon points={`${x - 6},250 ${x + 27},222 ${x + 60},250`} fill={C.burgundy} />
        </g>
      ))}
      <rect x="360" y="300" width="282" height="14" fill="#b5b5b9" />
      {/* farm */}
      <polygon points="690,250 720,218 750,250" fill={C.burgundy} />
      <rect x="696" y="250" width="48" height="40" fill="#bf8273" />
      {Array.from({ length: 10 }).map((_, i) => (
        <g key={i}>
          <rect x={780 + i * 15} y="252" width="4" height="34" fill={C.brass} />
          <circle cx={782 + i * 15} cy="248" r="5" fill="#e8daab" />
        </g>
      ))}
      {/* compass rose */}
      <g>
        <circle cx="900" cy="330" r="30" fill="none" stroke={C.brassDeep} strokeWidth="2" />
        <polygon points="900,302 908,330 900,358 892,330" fill={C.rust} />
        <polygon points="872,330 900,322 928,330 900,338" fill="#838391" />
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------- Exhibit 5 */
function TwoLivesRoom({ className }: { className: string }) {
  return (
    <svg {...svgProps(className)}>
      {/* LEFT: city flat */}
      <rect width="500" height="420" fill="#5c6c90" />
      <rect x="0" y="0" width="500" height="250" fill="#6878a1" />
      {/* window onto smokestacks */}
      <rect x="40" y="40" width="190" height="130" fill="#4a5d82" />
      <rect x="46" y="46" width="178" height="118" fill="#8d99ae" />
      {[70, 110, 150, 190].map((x, i) => (
        <rect key={x} x={x} y={96 - i * 10} width="20" height={68 + i * 10} fill="#717f9f" />
      ))}
      <rect x="86" y="54" width="10" height="44" fill="#818da1" />
      <ellipse cx="91" cy="52" rx="16" ry="7" fill="#abb1ba" opacity="0.5" className="lamp-glow" />
      {/* wall clock + calendar */}
      <circle cx="320" cy="80" r="30" fill={C.paper} />
      <circle cx="320" cy="80" r="26" fill="#f4eddd" />
      <line x1="320" y1="80" x2="320" y2="62" stroke={C.ink} strokeWidth="3" />
      <line x1="320" y1="80" x2="334" y2="86" stroke={C.ink} strokeWidth="3" />
      <rect x="390" y="52" width="68" height="80" fill={C.paper} />
      <rect x="390" y="52" width="68" height="18" fill={C.burgundy} />
      <text x="424" y="104" fontSize="22" textAnchor="middle" fill={C.ink} fontFamily="Georgia, serif">
        1926
      </text>
      {/* table + ledger */}
      <rect y="250" width="500" height="170" fill="#9f794f" />
      <rect x="60" y="250" width="380" height="20" fill="#b3845e" />
      <rect x="130" y="206" width="110" height="48" fill={C.paper} />
      {[214, 224, 234, 244].map((y) => (
        <rect key={y} x="140" y={y} width="86" height="4" fill={C.ink} opacity="0.5" />
      ))}
      <rect x="276" y="216" width="80" height="38" fill="#ac814e" />
      <circle cx="316" cy="235" r="12" fill={C.brass} />
      {/* foreground: pay envelope, coins, rent jar */}
      <rect x="60" y="300" width="110" height="64" fill={C.paper} />
      <polygon points="60,300 115,338 170,300" fill={C.paperDim} />
      <text x="115" y="358" fontSize="15" textAnchor="middle" fill={C.burgundy} fontFamily="Georgia, serif">
        WAGES
      </text>
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={222 + i * 26} cy="344" r="12" fill={C.brass} />
      ))}
      {[0, 1, 2].map((i) => (
        <circle key={`b${i}`} cx={235 + i * 26} cy="326" r="12" fill={C.brassDeep} />
      ))}
      <rect x="360" y="296" width="76" height="70" rx="5" fill="#b8c7d5" opacity="0.45" />
      <rect x="360" y="330" width="76" height="36" rx="3" fill={C.green} opacity="0.75" />
      <rect x="372" y="286" width="52" height="12" fill={C.brassDeep} />

      {/* DIVIDER */}
      <rect x="494" width="12" height="420" fill={C.brassDeep} />

      {/* RIGHT: farm kitchen + fields */}
      <rect x="506" width="494" height="420" fill="#6f7a96" />
      <rect x="506" y="0" width="494" height="190" fill="#929fae" />
      {/* field through window */}
      <rect x="560" y="36" width="380" height="124" fill="#5b6f8e" />
      <rect x="568" y="44" width="364" height="108" fill="#b6be99" />
      <rect x="568" y="120" width="364" height="32" fill="#a4b082" />
      {Array.from({ length: 22 }).map((_, i) => (
        <g key={i}>
          <rect x={574 + i * 16} y="98" width="3" height="26" fill="#d9c49a" />
          <circle cx={575 + i * 16} cy="95" r="4" fill="#e8daab" />
        </g>
      ))}
      <polygon points="880,118 906,92 932,118" fill={C.burgundy} />
      <rect x="886" y="118" width="40" height="34" fill="#bf8273" />
      {/* kitchen table with ledger + seed sack */}
      <rect x="506" y="190" width="494" height="230" fill="#977956" />
      <rect x="560" y="236" width="380" height="20" fill="#b3845e" />
      <rect x="620" y="192" width="110" height="46" fill={C.paper} />
      {[200, 210, 220, 230].map((y) => (
        <rect key={y} x="630" y={y} width="86" height="4" fill={C.ink} opacity="0.5" />
      ))}
      <path d="M786 238 q-14 -40 14 -52 q28 12 14 52 Z" fill="#d1c7ad" />
      <rect x="784" y="236" width="32" height="4" fill="#b7ab90" />
      {/* foreground: grain sack, seed scoop, unpaid note */}
      <path d="M590 366 q-20 -56 22 -72 q42 16 22 72 Z" fill="#d1c7ad" />
      <path d="M590 366 q-20 -56 22 -72 q10 30 -4 72 Z" fill="#dcd2b8" />
      <rect x="586" y="362" width="52" height="8" fill="#b7ab90" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <circle key={i} cx={600 + (i % 3) * 13} cy={382 + Math.floor(i / 3) * 11} r="4" fill="#e3dab5" />
      ))}
      <rect x="690" y="300" width="96" height="66" fill={C.paper} transform="rotate(-5 738 333)" />
      <rect x="702" y="316" width="64" height="5" fill={C.ink} opacity="0.55" transform="rotate(-5 738 333)" />
      <rect x="702" y="328" width="48" height="5" fill={C.ink} opacity="0.4" transform="rotate(-5 738 333)" />
      <text x="722" y="352" fontSize="17" fill={C.rust} fontFamily="Georgia, serif" transform="rotate(-5 738 333)">
        DUE
      </text>
      <rect x="840" y="318" width="90" height="48" rx="4" fill="#b3845e" />
      <rect x="850" y="328" width="70" height="8" fill="#bd997a" />
      <rect x="850" y="344" width="46" height="8" fill="#bd997a" opacity="0.7" />
    </svg>
  );
}

/* ------------------------------------------------------------- Exhibit 6 */
function Council({ className }: { className: string }) {
  return (
    <svg {...svgProps(className)}>
      <rect width="1000" height="420" fill="#445477" />
      {/* deco sunburst wall */}
      <g opacity="0.55">
        {Array.from({ length: 16 }).map((_, i) => {
          const a = (i / 16) * Math.PI - Math.PI / 2;
          return (
            <polygon
              key={i}
              points={`500,300 ${500 + Math.cos(a - 0.03) * 420},${300 + Math.sin(a - 0.03) * 420} ${
                500 + Math.cos(a + 0.03) * 420
              },${300 + Math.sin(a + 0.03) * 420}`}
              fill={i % 2 ? C.brassDeep : '#4f6489'}
            />
          );
        })}
      </g>
      {/* stepped deco cornice */}
      <rect y="0" width="1000" height="26" fill="#4f6489" />
      <rect x="120" y="26" width="760" height="18" fill={C.brassDeep} />
      <rect x="220" y="44" width="560" height="12" fill={C.brass} />
      {/* evidence wall niches */}
      {[120, 300, 480, 660, 840].map((x, i) => (
        <g key={x}>
          <rect x={x} y="86" width="120" height="86" fill="#3a4d6d" />
          <rect x={x + 6} y="92" width="108" height="74" fill="#53678d" />
          <rect x={x + 16} y="104" width="88" height="6" fill={C.brass} opacity="0.7" />
          <rect x={x + 16} y="120" width="66" height="5" fill={C.paperDim} opacity="0.5" />
          <rect x={x + 16} y="132" width="78" height="5" fill={C.paperDim} opacity="0.35" />
          <text x={x + 60} y="160" fontSize="12" textAnchor="middle" fill={C.brass}>
            EVIDENCE {i + 1}
          </text>
        </g>
      ))}
      {/* two plaques */}
      {[
        [196, 'A2'],
        [700, 'C2'],
      ].map(([x, code]) => (
        <g key={code as string}>
          <rect x={x as number} y="198" width="104" height="80" fill={C.brassDeep} />
          <rect x={(x as number) + 6} y="204" width="92" height="68" fill="#726248" />
          <text
            x={(x as number) + 52}
            y="248"
            fontSize="28"
            textAnchor="middle"
            fill={C.brass}
            fontFamily="Georgia, serif"
          >
            {code as string}
          </text>
        </g>
      ))}
      {/* stock ticker under dome, centre */}
      <g>
        <rect x="430" y="214" width="140" height="64" fill="#737385" />
        <path d="M430 214 a70 56 0 0 1 140 0" fill="#c1cfda" opacity="0.3" />
        <circle cx="500" cy="242" r="24" fill="#6b5743" />
        <circle cx="500" cy="242" r="10" fill={C.paper} />
      </g>
      {/* gramophone */}
      <g>
        <rect x="860" y="250" width="70" height="40" fill="#ac814e" />
        <path d="M894 250 q6 -58 54 -72 q10 30 -16 50 q-18 14 -38 22 Z" fill={C.brassDeep} />
        <circle cx="890" cy="246" r="4" fill={C.brass} />
      </g>
      {/* floor + council table */}
      <rect y="300" width="1000" height="120" fill="#4a5d82" />
      <rect y="300" width="1000" height="6" fill={C.brassDeep} />
      <ellipse cx="500" cy="372" rx="300" ry="44" fill="#856c4e" />
      <ellipse cx="500" cy="364" rx="290" ry="40" fill="#aa7645" />
      <ellipse cx="500" cy="362" rx="240" ry="30" fill="#b27f4d" />
    </svg>
  );
}
