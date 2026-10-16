/**
 * ArtifactThumb.tsx — original illustrated stand-ins for archival items.
 *
 * We deliberately do NOT fetch or rehost the archival images. Each thumbnail is
 * an original drawing that signals the KIND of object (poster, photograph, film
 * reel, trade catalogue, audio disc, essay) without imitating the artifact
 * itself, and every card carries a link to the real item at its institution.
 */
import type { SourceItem } from '../data/sources';

const C = {
  paper: '#e8dcc0',
  paperDim: '#cdbe9b',
  ink: '#2a2318',
  navy: '#1b2436',
  navyDeep: '#141b29',
  brass: '#c8a45c',
  brassDeep: '#8d6f33',
  burgundy: '#5e2733',
  green: '#4a6b4f',
  rust: '#b2563a',
};

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 160 120" className="artifact-thumb" role="img" aria-hidden="true">
      <rect width="160" height="120" fill={C.navyDeep} />
      <rect x="4" y="4" width="152" height="112" fill="none" stroke={C.brassDeep} strokeWidth="2" />
      {children}
    </svg>
  );
}

export default function ArtifactThumb({ item }: { item: SourceItem }) {
  const kind = item.mediaKind;

  if (kind === 'poster')
    return (
      <Frame>
        <rect x="42" y="16" width="76" height="90" fill={C.paper} />
        <rect x="42" y="16" width="76" height="18" fill={C.burgundy} />
        <polygon points="80,44 96,72 64,72" fill={C.rust} />
        <rect x="52" y="80" width="56" height="5" fill={C.ink} opacity="0.7" />
        <rect x="58" y="90" width="44" height="4" fill={C.ink} opacity="0.45" />
      </Frame>
    );

  if (kind === 'photograph')
    return (
      <Frame>
        <rect x="26" y="20" width="108" height="78" fill={C.paper} />
        <rect x="32" y="26" width="96" height="58" fill="#6f7a86" />
        <circle cx="56" cy="44" r="9" fill="#9aa5ad" />
        <polygon points="36,84 70,52 96,84" fill="#515c68" />
        <polygon points="80,84 104,60 124,84" fill="#64707c" />
        <rect x="32" y="88" width="50" height="4" fill={C.ink} opacity="0.35" />
      </Frame>
    );

  if (kind === 'film')
    return (
      <Frame>
        <rect x="24" y="24" width="112" height="66" fill="#2a2a34" />
        <rect x="24" y="24" width="112" height="8" fill="#1d1d26" />
        <rect x="24" y="82" width="112" height="8" fill="#1d1d26" />
        {[28, 46, 64, 82, 100, 118].map((x) => (
          <g key={x}>
            <rect x={x} y="26" width="8" height="4" fill={C.paperDim} />
            <rect x={x} y="84" width="8" height="4" fill={C.paperDim} />
          </g>
        ))}
        <rect x="34" y="38" width="42" height="38" fill="#55606c" />
        <rect x="84" y="38" width="42" height="38" fill="#48525e" />
      </Frame>
    );

  if (kind === 'audio')
    return (
      <Frame>
        <circle cx="80" cy="56" r="38" fill="#241c14" />
        <circle cx="80" cy="56" r="30" fill="none" stroke="#3a3028" strokeWidth="1" />
        <circle cx="80" cy="56" r="22" fill="none" stroke="#3a3028" strokeWidth="1" />
        <circle cx="80" cy="56" r="14" fill={C.burgundy} />
        <circle cx="80" cy="56" r="3" fill={C.paper} />
      </Frame>
    );

  if (kind === 'document' || kind === 'artifact')
    return (
      <Frame>
        <rect x="34" y="14" width="92" height="88" fill={C.paper} />
        <rect x="34" y="14" width="92" height="16" fill={C.green} />
        <rect x="42" y="38" width="52" height="4" fill={C.ink} opacity="0.65" />
        <rect x="42" y="48" width="70" height="4" fill={C.ink} opacity="0.4" />
        <rect x="42" y="58" width="44" height="4" fill={C.ink} opacity="0.4" />
        <rect x="42" y="70" width="34" height="22" fill={C.rust} opacity="0.65" />
        <rect x="84" y="70" width="28" height="22" fill={C.brassDeep} opacity="0.6" />
      </Frame>
    );

  if (kind === 'cartoon')
    return (
      <Frame>
        <rect x="26" y="18" width="108" height="80" fill={C.paper} />
        <path d="M34 78 Q56 44 78 64 T126 40" fill="none" stroke={C.ink} strokeWidth="2.5" />
        <circle cx="54" cy="40" r="9" fill="none" stroke={C.ink} strokeWidth="2" />
        <rect x="34" y="86" width="60" height="4" fill={C.ink} opacity="0.5" />
      </Frame>
    );

  if (kind === 'diagram')
    return (
      <Frame>
        <rect x="20" y="18" width="120" height="78" fill={C.navy} />
        {[
          [44, 38],
          [80, 38],
          [116, 38],
        ].map(([x, y], i) => (
          <g key={i}>
            <rect x={x - 16} y={y - 10} width="32" height="20" fill={C.brassDeep} />
            {i < 2 && <line x1={x + 16} y1={y} x2={x + 20} y2={y} stroke={C.brass} strokeWidth="2" />}
          </g>
        ))}
        <rect x="46" y="64" width="68" height="18" fill={C.rust} opacity="0.7" />
      </Frame>
    );

  // essay / default
  return (
    <Frame>
      <rect x="24" y="16" width="52" height="86" fill={C.paper} />
      <rect x="84" y="16" width="52" height="86" fill={C.paperDim} />
      {[26, 36, 46, 56, 66, 76, 86].map((y) => (
        <g key={y}>
          <rect x="30" y={y} width="40" height="3" fill={C.ink} opacity="0.4" />
          <rect x="90" y={y} width="40" height="3" fill={C.ink} opacity="0.3" />
        </g>
      ))}
    </Frame>
  );
}
