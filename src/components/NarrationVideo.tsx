import { useEffect, useRef, useState } from 'react';
import { sfx } from '../audio/sfx';

interface Props {
  /** e.g. "media/narration/exhibit01-postwar.mp4" (relative to the site root) */
  src: string;
  exhibitTitle: string;
  onContinue: () => void;
}

/**
 * Narrated introduction for an exhibit.
 *
 * The site cannot know at build time which narration files have been added, so it
 * checks at runtime. If the file is there, a video player appears; if not, the
 * exhibit simply opens with its title and a Continue button.
 */
export default function NarrationVideo({ src, exhibitTitle, onContinue }: Props) {
  const [state, setState] = useState<'probing' | 'video' | 'none'>('probing');
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(src, { method: 'HEAD' })
      .then((r) => {
        if (cancelled) return;
        const type = r.headers.get('content-type') ?? '';
        // Some dev servers answer a missing path with index.html; treat that as absent.
        setState(r.ok && !type.includes('text/html') ? 'video' : 'none');
      })
      .catch(() => {
        if (!cancelled) setState('none');
      });
    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    sfx.duck(playing);
    return () => sfx.duck(false);
  }, [playing]);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => setState('none'));
    else v.pause();
  };

  return (
    <section className="narration" aria-label={`${exhibitTitle} introduction`}>
      {state === 'video' && (
        <div className="narration-frame">
          <video
            ref={videoRef}
            className="narration-video"
            controls
            playsInline
            preload="metadata"
            muted={muted}
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={() => setPlaying(false)}
            onError={() => setState('none')}
          >
            <source src={src} type="video/mp4" />
          </video>
          <div className="narration-controls">
            <button className="btn btn-small" onClick={togglePlay}>
              {playing ? 'Pause' : 'Play'}
            </button>
            <button className="btn btn-small" onClick={() => setMuted((m) => !m)}>
              {muted ? 'Unmute' : 'Mute'}
            </button>
          </div>
        </div>
      )}

      <div className="narration-actions">
        <button className="btn btn-primary" onClick={onContinue}>
          {state === 'video' ? 'Continue into the exhibit →' : 'Enter the exhibit →'}
        </button>
      </div>
    </section>
  );
}
