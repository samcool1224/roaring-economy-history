/**
 * Illustration.tsx — small original SVG illustrations for the lesson stations.
 * These are modern drawings made for this project. None of them is, or imitates,
 * a historical photograph.
 */

interface Props {
  kind: string;
  className?: string;
}

const C = {
  paper: '#ede5d1',
  ink: '#726248',
  navy: '#4a5d82',
  brass: '#d9c49a',
  brassDeep: '#c4a66b',
  burgundy: '#b04f64',
  green: '#81a587',
  sky: '#afc7da',
  rust: '#d0917e',
};

export default function Illustration({ kind, className }: Props) {
  const common = {
    viewBox: '0 0 120 90',
    className: `illus ${className ?? ''}`,
    role: 'img' as const,
    'aria-hidden': true,
  };

  switch (kind) {
    case 'price-curve':
      return (
        <svg {...common}>
          <rect width="120" height="90" fill={C.navy} />
          <polyline points="10,70 30,52 50,30 66,22" fill="none" stroke={C.rust} strokeWidth="4" />
          <polyline points="66,22 80,44 96,64 110,70" fill="none" stroke={C.sky} strokeWidth="4" />
          <circle cx="66" cy="22" r="4" fill={C.brass} />
          <line x1="8" y1="78" x2="112" y2="78" stroke={C.brassDeep} strokeWidth="2" />
          <line x1="8" y1="78" x2="8" y2="12" stroke={C.brassDeep} strokeWidth="2" />
          <text x="60" y="88" fontSize="7" fill={C.paper} textAnchor="middle">
            1918 — 1921
          </text>
        </svg>
      );

    case 'hiring-board':
      return (
        <svg {...common}>
          <rect width="120" height="90" fill={C.navy} />
          <rect x="18" y="12" width="84" height="64" fill="#997a53" />
          <rect x="22" y="16" width="76" height="56" fill={C.paper} />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x="28" y={24 + i * 11} width="40" height="5" fill={C.ink} opacity="0.75" />
              <rect x="72" y={24 + i * 11} width="20" height="5" fill={C.rust} opacity={0.3 + i * 0.2} />
            </g>
          ))}
          <rect x="28" y="24" width="64" height="5" fill={C.ink} />
        </svg>
      );

    case 'bank-notice':
      return (
        <svg {...common}>
          <rect width="120" height="90" fill={C.navy} />
          <rect x="24" y="10" width="72" height="70" fill={C.paper} />
          <rect x="24" y="10" width="72" height="12" fill={C.burgundy} />
          <circle cx="60" cy="42" r="14" fill="none" stroke={C.brassDeep} strokeWidth="3" />
          <text x="60" y="47" fontSize="14" textAnchor="middle" fill={C.brassDeep} fontWeight="bold">
            %
          </text>
          <rect x="34" y="62" width="52" height="4" fill={C.ink} opacity="0.6" />
          <rect x="34" y="70" width="36" height="4" fill={C.ink} opacity="0.4" />
          <polygon points="88,58 100,58 94,72" fill={C.rust} />
        </svg>
      );

    case 'conveyor':
      return (
        <svg {...common}>
          <rect width="120" height="90" fill={C.navy} />
          <rect x="0" y="52" width="120" height="14" fill="#737385" />
          {[6, 26, 46, 66, 86, 106].map((x) => (
            <circle key={x} cx={x} cy="59" r="5" fill={C.brassDeep} />
          ))}
          <rect x="22" y="34" width="26" height="16" rx="3" fill={C.burgundy} />
          <rect x="70" y="30" width="30" height="20" rx="3" fill={C.rust} />
          <circle cx="29" cy="52" r="4" fill={C.ink} />
          <circle cx="43" cy="52" r="4" fill={C.ink} />
          <circle cx="78" cy="52" r="4" fill={C.ink} />
          <circle cx="93" cy="52" r="4" fill={C.ink} />
          <circle cx="16" cy="20" r="11" fill="none" stroke={C.brass} strokeWidth="3" />
          <circle cx="36" cy="16" r="7" fill="none" stroke={C.brass} strokeWidth="3" />
        </svg>
      );

    case 'price-board':
      return (
        <svg {...common}>
          <rect width="120" height="90" fill={C.navy} />
          <rect x="14" y="12" width="92" height="66" fill="#6b5743" />
          <rect x="18" y="16" width="84" height="58" fill="#415a7b" />
          <text x="30" y="36" fontSize="13" fill={C.brass} fontFamily="Georgia, serif">
            $850
          </text>
          <text x="30" y="62" fontSize="13" fill={C.green} fontFamily="Georgia, serif">
            $260
          </text>
          <polyline points="78,30 90,46 78,62" fill="none" stroke={C.paper} strokeWidth="3" />
          <line x1="26" y1="44" x2="96" y2="44" stroke={C.brassDeep} strokeWidth="1" />
        </svg>
      );

    case 'supply-map':
      return (
        <svg {...common}>
          <rect width="120" height="90" fill={C.navy} />
          <circle cx="60" cy="45" r="15" fill={C.burgundy} />
          <text x="60" y="49" fontSize="8" textAnchor="middle" fill={C.paper}>
            AUTO
          </text>
          {[
            [20, 18],
            [100, 18],
            [16, 70],
            [104, 70],
            [60, 80],
          ].map(([x, y], i) => (
            <g key={i}>
              <line x1="60" y1="45" x2={x} y2={y} stroke={C.brassDeep} strokeWidth="2" />
              <circle cx={x} cy={y} r="8" fill={C.brass} />
            </g>
          ))}
        </svg>
      );

    case 'shop-window':
      return (
        <svg {...common}>
          <rect width="120" height="90" fill={C.navy} />
          <rect x="10" y="12" width="100" height="62" fill="#5b739e" />
          <rect x="14" y="16" width="92" height="50" fill="#7287ac" />
          <rect x="24" y="30" width="22" height="26" fill={C.burgundy} />
          <circle cx="35" cy="40" r="5" fill={C.brass} />
          <rect x="54" y="36" width="18" height="20" fill={C.green} />
          <rect x="80" y="26" width="18" height="30" fill={C.rust} />
          <rect x="10" y="72" width="100" height="6" fill={C.brassDeep} />
          <text x="60" y="24" fontSize="7" textAnchor="middle" fill={C.brass}>
            NEW THIS SEASON
          </text>
        </svg>
      );

    case 'payment-desk':
      return (
        <svg {...common}>
          <rect width="120" height="90" fill={C.navy} />
          <rect x="16" y="40" width="88" height="34" fill="#ac814e" />
          <rect x="16" y="40" width="88" height="5" fill="#b7966d" />
          <rect x="28" y="20" width="30" height="20" fill={C.paper} />
          <rect x="32" y="25" width="22" height="3" fill={C.ink} />
          <rect x="32" y="31" width="14" height="3" fill={C.ink} opacity="0.6" />
          <circle cx="80" cy="30" r="11" fill={C.brass} />
          <text x="80" y="34" fontSize="11" textAnchor="middle" fill={C.ink} fontWeight="bold">
            $
          </text>
          <rect x="24" y="52" width="16" height="10" fill={C.green} />
          <rect x="46" y="52" width="16" height="10" fill={C.green} opacity="0.7" />
          <rect x="68" y="52" width="16" height="10" fill={C.green} opacity="0.4" />
        </svg>
      );

    case 'ticker':
      return (
        <svg {...common}>
          <rect width="120" height="90" fill={C.navy} />
          <rect x="22" y="44" width="76" height="30" rx="4" fill="#737385" />
          <circle cx="60" cy="30" r="18" fill="#636376" />
          <circle cx="60" cy="30" r="13" fill={C.paper} />
          <path d="M34 62 L50 54 L66 60 L84 40" fill="none" stroke={C.green} strokeWidth="3" />
          <polyline points="78,40 84,40 84,46" fill="none" stroke={C.green} strokeWidth="3" />
          <rect x="30" y="68" width="60" height="4" fill={C.brassDeep} />
        </svg>
      );

    case 'city':
      return (
        <svg {...common}>
          <rect width="120" height="90" fill="#4d699a" />
          {[
            [10, 40, 16, 50],
            [30, 24, 18, 66],
            [52, 34, 14, 56],
            [70, 16, 20, 74],
            [94, 44, 16, 46],
          ].map(([x, y, w, h], i) => (
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} fill={i % 2 ? '#6c7fa3' : '#5e749d'} />
              {[0, 1, 2, 3].map((r) => (
                <rect key={r} x={x + 3} y={y + 6 + r * 12} width={w - 6} height={4} fill={C.brass} opacity="0.7" />
              ))}
            </g>
          ))}
          <rect x="0" y="84" width="120" height="6" fill="#44567c" />
        </svg>
      );

    case 'suburb':
      return (
        <svg {...common}>
          <rect width="120" height="90" fill="#58769b" />
          <rect x="0" y="62" width="120" height="28" fill={C.green} opacity="0.5" />
          {[12, 50, 88].map((x, i) => (
            <g key={i}>
              <rect x={x} y={48} width={24} height={20} fill="#e3dbc9" />
              <polygon points={`${x - 2},48 ${x + 12},36 ${x + 26},48`} fill={C.burgundy} />
              <rect x={x + 9} y={56} width={6} height={12} fill="#ac814e" />
            </g>
          ))}
          <rect x="0" y="72" width="120" height="8" fill="#838391" />
          <rect x="18" y="74" width="10" height="4" fill={C.rust} />
          <rect x="72" y="74" width="10" height="4" fill={C.sky} />
        </svg>
      );

    case 'farm':
      return (
        <svg {...common}>
          <rect width="120" height="90" fill="#6f85a1" />
          <rect x="0" y="54" width="120" height="36" fill="#a4b082" />
          <polygon points="18,54 34,38 50,54" fill={C.burgundy} />
          <rect x="22" y="54" width="24" height="20" fill="#bf8273" />
          <rect x="30" y="62" width="8" height="12" fill="#87674b" />
          {[62, 72, 82, 92, 102].map((x) => (
            <g key={x}>
              <rect x={x} y="60" width="3" height="14" fill="#d9c49a" />
              <circle cx={x + 1.5} cy="58" r="3" fill="#e8daab" />
            </g>
          ))}
          <rect x="0" y="86" width="120" height="4" fill="#8a9b69" />
        </svg>
      );

    case 'city-ledger':
      return (
        <svg {...common}>
          <rect width="120" height="90" fill={C.navy} />
          <rect x="16" y="10" width="88" height="70" fill={C.paper} />
          <rect x="16" y="10" width="88" height="10" fill={C.navy} opacity="0.8" />
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <rect x="22" y={28 + i * 10} width="44" height="4" fill={C.ink} opacity="0.55" />
              <rect x="74" y={28 + i * 10} width="24" height="4" fill={i < 3 ? C.rust : C.green} />
            </g>
          ))}
          <line x1="70" y1="24" x2="70" y2="76" stroke={C.ink} strokeWidth="1" opacity="0.4" />
        </svg>
      );

    case 'farm-ledger':
      return (
        <svg {...common}>
          <rect width="120" height="90" fill={C.navy} />
          <rect x="14" y="12" width="92" height="66" fill={C.paper} />
          <text x="34" y="36" fontSize="11" fill={C.green} fontFamily="Georgia, serif">
            10 × $10
          </text>
          <text x="34" y="58" fontSize="11" fill={C.rust} fontFamily="Georgia, serif">
            15 × $6
          </text>
          <text x="86" y="36" fontSize="11" fill={C.ink} fontFamily="Georgia, serif">
            100
          </text>
          <text x="88" y="58" fontSize="11" fill={C.ink} fontFamily="Georgia, serif">
            90
          </text>
          <line x1="22" y1="44" x2="98" y2="44" stroke={C.ink} strokeWidth="1" opacity="0.4" />
          <polygon points="104,48 110,48 107,58" fill={C.rust} />
        </svg>
      );

    case 'tractor-note':
      return (
        <svg {...common}>
          <rect width="120" height="90" fill={C.navy} />
          <rect x="10" y="40" width="46" height="18" rx="3" fill={C.rust} />
          <rect x="30" y="28" width="18" height="14" fill="#c8755e" />
          <circle cx="20" cy="62" r="12" fill="#726248" />
          <circle cx="20" cy="62" r="5" fill={C.brassDeep} />
          <circle cx="48" cy="64" r="8" fill="#726248" />
          <rect x="66" y="26" width="44" height="48" fill={C.paper} transform="rotate(6 88 50)" />
          <rect x="72" y="36" width="30" height="3" fill={C.ink} opacity="0.6" transform="rotate(6 88 50)" />
          <rect x="72" y="44" width="30" height="3" fill={C.ink} opacity="0.6" transform="rotate(6 88 50)" />
          <text x="78" y="62" fontSize="9" fill={C.rust} fontFamily="Georgia, serif" transform="rotate(6 88 50)">
            DUE
          </text>
        </svg>
      );

    default:
      return (
        <svg {...common}>
          <rect width="120" height="90" fill={C.navy} />
          <rect x="24" y="20" width="72" height="50" fill={C.paper} opacity="0.9" />
          <rect x="34" y="32" width="52" height="4" fill={C.ink} opacity="0.5" />
          <rect x="34" y="42" width="38" height="4" fill={C.ink} opacity="0.35" />
        </svg>
      );
  }
}
