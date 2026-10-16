import { useState } from 'react';
import Modal from './Modal';
import ExhibitPhoto from './ExhibitPhoto';
import { GALLERY, IMAGES } from '../data/media';
import { devModeEnabled } from '../state/progress';

interface Props {
  exhibitId: number;
  exhibitTitle: string;
  onClose: () => void;
}

export default function Gallery({ exhibitId, exhibitTitle, onClose }: Props) {
  const ids = GALLERY[exhibitId] ?? [];
  const [missing, setMissing] = useState<string[]>([]);
  const dev = devModeEnabled();
  const allMissing = ids.length > 0 && missing.length === ids.length;

  return (
    <Modal title="Museum Gallery" subtitle={exhibitTitle} onClose={onClose} wide>
      {allMissing && !dev ? (
        <p className="gallery-empty">The photographs for this gallery are being installed.</p>
      ) : (
        <ul className="gallery-grid">
          {ids.map((id) => {
            const img = IMAGES[id];
            if (!img) return null;
            if (missing.includes(id) && !dev) return null;
            return (
              <li key={id} className="gallery-card">
                <div className="gallery-thumb">
                  <ExhibitPhoto
                    imageId={id}
                    onResolved={(found) => {
                      if (!found) setMissing((m) => (m.includes(id) ? m : [...m, id]));
                    }}
                  />
                </div>
                <div className="gallery-meta">
                  <h3>{img.title}</h3>
                  <p className="gallery-teaches">{img.caption}</p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Modal>
  );
}
