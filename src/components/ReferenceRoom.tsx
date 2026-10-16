import { useMemo, useState } from 'react';
import Modal from './Modal';
import { SOURCES, SOURCE_TYPE_LABEL, type SourceItem } from '../data/sources';
import { EXHIBITS } from '../data/exhibits';
import { FILMS, GALLERY, IMAGES } from '../data/media';

type Filter = 'all' | 'primary' | 'secondary' | 'audio' | 'video' | 'illustrative';

const MATCH: Record<Filter, (s: SourceItem) => boolean> = {
  all: () => true,
  primary: (s) => s.sourceType === 'primary',
  secondary: (s) => s.sourceType === 'secondary',
  audio: (s) => s.mediaKind === 'audio',
  video: (s) => s.mediaKind === 'film',
  illustrative: (s) => s.sourceType === 'illustrative',
};

/** The References & Historical Evidence panel — not a seventh exhibit. */
export default function ReferenceRoom({ onClose }: { onClose: () => void }) {
  const [filter, setFilter] = useState<Filter>('all');
  const [query, setQuery] = useState('');

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    return EXHIBITS.map((ex) => ({
      exhibit: ex,
      items: SOURCES.filter(
        (s) =>
          s.exhibits.includes(ex.id) &&
          MATCH[filter](s) &&
          (q === '' ||
            s.title.toLowerCase().includes(q) ||
            s.creator.toLowerCase().includes(q) ||
            s.institution.toLowerCase().includes(q) ||
            s.whatItShows.toLowerCase().includes(q)),
      ),
    }));
  }, [filter, query]);

  const total = grouped.reduce((n, g) => n + g.items.length, 0);

  // Each photograph once, with every exhibit that shows it.
  const photoCredits = Object.keys(IMAGES).map((id) => ({
    id,
    exhibits: Object.entries(GALLERY)
      .filter(([, ids]) => ids.includes(id))
      .map(([ex]) => ex),
  }));

  return (
    <Modal
      title="References &amp; Historical Evidence"
      subtitle="Every source behind this museum, organised by exhibit"
      onClose={onClose}
      wide
    >
      <div className="ref-controls">
        <div className="ref-filters" role="group" aria-label="Filter sources">
          {(['all', 'primary', 'secondary', 'video', 'audio', 'illustrative'] as Filter[]).map((f) => (
            <button
              key={f}
              className={`chip-btn${filter === f ? ' is-active' : ''}`}
              onClick={() => setFilter(f)}
              aria-pressed={filter === f}
            >
              {f === 'all'
                ? 'All'
                : f === 'illustrative'
                  ? 'Our own illustrations'
                  : f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <label className="ref-search">
          <span className="sr-only">Search sources</span>
          <input
            type="search"
            placeholder="Search title, creator or institution…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      </div>

      <p className="ref-count">
        {total} {total === 1 ? 'item' : 'items'} shown. ◆ primary · ◇ secondary · ✎ our own modern
        illustration.
      </p>

      <div className="ref-legend">
        <p>
          <strong>Primary</strong> means a document, photograph, film, recording or object made at the
          time. <strong>Secondary</strong> means modern analysis written about the period — a
          Federal Reserve study or a Library of Congress essay is scholarship, not an artifact. The
          photographs and films shown in the exhibits are credited in their own section below.
        </p>
      </div>

      {grouped.map(({ exhibit, items }) =>
        items.length === 0 ? null : (
          <section key={exhibit.id} className="ref-group">
            <h3 className="ref-group-head" style={{ borderColor: exhibit.accent }}>
              <span className="ref-group-num" style={{ background: exhibit.accent }}>
                {exhibit.id}
              </span>
              {exhibit.title}
            </h3>
            <ul className="ref-list">
              {items.map((s) => (
                <li key={`${exhibit.id}-${s.id}`} className={`ref-item ref-item--${s.sourceType}`}>
                  <div className="ref-item-head">
                    <span className={`badge badge--${s.sourceType}`}>
                      {SOURCE_TYPE_LABEL[s.sourceType]}
                    </span>
                    <span className="ref-kind">{s.mediaKind}</span>
                  </div>
                  <h4>{s.title}</h4>
                  <p className="ref-credit">
                    {s.creator} · {s.institution} · {s.date}
                  </p>
                  <p className="ref-shows">{s.whatItShows}</p>
                  <p className="ref-rights">
                    <strong>Attribution &amp; rights:</strong> {s.displayAttribution} {s.rightsNote}
                  </p>
                  <a className="btn btn-small" href={s.pageURL} target="_blank" rel="noopener noreferrer">
                    Open at {s.institution} ↗
                  </a>
                </li>
              ))}
            </ul>
          </section>
        ),
      )}

      <section className="ref-group">
        <h3 className="ref-group-head">Exhibit photographs and films</h3>
        <ul className="ref-list">
          {photoCredits.map(({ id, exhibits }) => {
              const img = IMAGES[id];
              return (
                <li key={id} className="ref-item ref-item--image">
                  <div className="ref-item-head">
                    <span className="badge badge--image">
                      Exhibit{exhibits.length > 1 ? 's' : ''} {exhibits.join(', ')} photograph
                    </span>
                  </div>
                  <h4>{img.title}</h4>
                  <p className="ref-credit">{img.sourceSite}</p>
                  {img.sourceUrl && (
                    <a
                      className="btn btn-small"
                      href={img.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Image source ↗
                    </a>
                  )}
                </li>
              );
          })}
          {Object.entries(FILMS).map(([exId, film]) => (
            <li key={`film-${exId}`} className="ref-item ref-item--image">
              <div className="ref-item-head">
                <span className="badge badge--image">Exhibit {exId} archival film</span>
              </div>
              <h4>{film.title}</h4>
              <p className="ref-credit">YouTube</p>
              <a
                className="btn btn-small"
                href={`https://www.youtube.com/watch?v=${film.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Watch on YouTube ↗
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="ref-group">
        <h3 className="ref-group-head">Credits and caveats</h3>
        <ul className="help-list">
          <li>
            <strong>Photographs and drawings.</strong> The exhibit photographs come from the pages
            credited above. The walkable museum, the six room scenes and the sprites are drawn in code
            for this project, and no historical picture here is AI-generated.
          </li>
          <li>
            <strong>All sound is original and modern.</strong> Door, chime, typewriter, conveyor,
            register and ticker effects are synthesised with the Web Audio API — modern illustrative
            sound design, not period recordings. They default to off.
          </li>
          <li>
            <strong>Game numbers are invented.</strong> Assembly ticks, the $40 radio, the $100 share
            and both 1926 household budgets are teaching examples, labelled as such wherever they
            appear. They are not historical prices, wages, yields or returns.
          </li>
          <li>
            <strong>We do not quote what we have not verified.</strong> The 1924 Coolidge recording is
            linked for listening rather than excerpted, because we have not checked a transcript word
            for word.
          </li>
        </ul>
      </section>
    </Modal>
  );
}
