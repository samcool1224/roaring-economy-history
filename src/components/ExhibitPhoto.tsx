import { useEffect, useState, type ReactNode } from 'react';
import { IMAGES, imageCandidates } from '../data/media';
import { devModeEnabled } from '../state/progress';

interface Props {
  imageId: string;
  /** Rendered when no file exists for this image. Omit to render nothing. */
  fallback?: ReactNode;
  className?: string;
  /** Told whether the image ended up showing, so a gallery can hide gaps. */
  onResolved?: (found: boolean) => void;
}

/**
 * Shows an exhibit photograph from public/media/images/, trying each supported
 * extension in turn. Missing files never show a broken-image icon.
 */
export default function ExhibitPhoto({ imageId, fallback = null, className, onResolved }: Props) {
  const meta = IMAGES[imageId];
  const candidates = meta ? imageCandidates(meta.file) : [];
  const [index, setIndex] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const exhausted = index >= candidates.length;

  useEffect(() => {
    setIndex(0);
    setLoaded(false);
  }, [imageId]);

  useEffect(() => {
    if (exhausted) onResolved?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exhausted]);

  if (!meta || exhausted) {
    if (devModeEnabled() && meta) {
      return (
        <div className="photo-missing">
          Missing image: <code>public/media/images/{meta.file}.jpg</code>
          <span>(or .png / .webp / .gif)</span>
          {fallback}
        </div>
      );
    }
    return <>{fallback}</>;
  }

  return (
    <img
      key={candidates[index]}
      src={candidates[index]}
      alt={meta.title}
      className={`exhibit-photo${loaded ? ' is-loaded' : ''}${className ? ` ${className}` : ''}`}
      loading="lazy"
      decoding="async"
      onLoad={() => {
        setLoaded(true);
        onResolved?.(true);
      }}
      onError={() => setIndex((i) => i + 1)}
    />
  );
}
