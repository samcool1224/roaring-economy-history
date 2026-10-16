import { useEffect, useState } from 'react';
import { sfx } from '../audio/sfx';

interface Props {
  /**
   * Narration file path without relying on its extension, e.g.
   * "media/narration/exhibit01-postwar.mp4". The extension given here is ignored;
   * the formats below are tried in order.
   */
  src: string;
  exhibitTitle: string;
  onContinue: () => void;
}

/** Tried in this order. The first file that exists is used. */
const FORMATS: Array<{ ext: string; kind: 'audio' | 'video'; mime: string }> = [
  { ext: 'mp3', kind: 'audio', mime: 'audio/mpeg' },
  { ext: 'm4a', kind: 'audio', mime: 'audio/mp4' },
  { ext: 'wav', kind: 'audio', mime: 'audio/wav' },
  { ext: 'mp4', kind: 'video', mime: 'video/mp4' },
];

type Found = { url: string; kind: 'audio' | 'video'; mime: string };

/**
 * Narrated introduction for an exhibit: an audio player for .mp3/.m4a/.wav
 * narration, or a video player for .mp4. The site cannot know at build time
 * which files have been added, so it checks at runtime. If none is there, the
 * exhibit simply opens with its title and an Enter button.
 */
export default function NarrationVideo({ src, exhibitTitle, onContinue }: Props) {
  const [found, setFound] = useState<Found | null | 'probing'>('probing');
  const [playing, setPlaying] = useState(false);
  const base = src.replace(/\.[a-z0-9]+$/i, '');

  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const f of FORMATS) {
        const url = `${base}.${f.ext}`;
        try {
          const r = await fetch(url, { method: 'HEAD' });
          const type = r.headers.get('content-type') ?? '';
          // Hosts that send every unknown path to index.html answer 200 text/html; skip those.
          if (r.ok && !type.includes('text/html')) {
            if (!cancelled) setFound({ url, kind: f.kind, mime: f.mime });
            return;
          }
        } catch {
          /* try the next format */
        }
      }
      if (!cancelled) setFound(null);
    })();
    return () => {
      cancelled = true;
    };
  }, [base]);

  // Quiet the sound effects while narration plays.
  useEffect(() => {
    sfx.duck(playing);
    return () => sfx.duck(false);
  }, [playing]);

  const media = found && found !== 'probing' ? found : null;
  const handlers = {
    onPlay: () => setPlaying(true),
    onPause: () => setPlaying(false),
    onEnded: () => setPlaying(false),
    onError: () => setFound(null),
  };

  return (
    <section className="narration" aria-label={`${exhibitTitle} introduction`}>
      {media?.kind === 'audio' && (
        <div className="narration-audio">
          <span className={`narration-audio-icon${playing ? ' is-playing' : ''}`} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <div className="narration-audio-body">
            <strong>Listen to the introduction</strong>
            <audio controls preload="metadata" {...handlers}>
              <source src={media.url} type={media.mime} />
            </audio>
          </div>
        </div>
      )}

      {media?.kind === 'video' && (
        <div className="narration-frame">
          <video className="narration-video" controls playsInline preload="metadata" {...handlers}>
            <source src={media.url} type={media.mime} />
          </video>
        </div>
      )}

      <div className="narration-actions">
        <button className="btn btn-primary" onClick={onContinue}>
          {media ? 'Continue into the exhibit →' : 'Enter the exhibit →'}
        </button>
      </div>
    </section>
  );
}
