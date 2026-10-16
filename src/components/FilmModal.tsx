import { useEffect } from 'react';
import Modal from './Modal';
import { music } from '../audio/music';
import type { ArchivalFilm } from '../data/media';

interface Props {
  film: ArchivalFilm;
  onClose: () => void;
}

/**
 * Archival footage from YouTube. Uses the privacy-enhanced embed host and never
 * autoplays. The direct link underneath covers videos whose owners have turned
 * off embedding.
 */
export default function FilmModal({ film, onClose }: Props) {
  // The film has its own soundtrack, so background music pauses while it is open.
  useEffect(() => {
    music.pause(true);
    return () => music.pause(false);
  }, []);

  const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(film.youtubeId)}`;
  const embedUrl = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(film.youtubeId)}?rel=0`;

  return (
    <Modal title={film.title} subtitle="Archival film" onClose={onClose} wide>
      <div className="film-frame">
        <iframe
          src={embedUrl}
          title={film.title}
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
      <p className="film-caption">{film.caption}</p>
      <a className="btn btn-small" href={watchUrl} target="_blank" rel="noopener noreferrer">
        Watch on YouTube ↗
      </a>
    </Modal>
  );
}
