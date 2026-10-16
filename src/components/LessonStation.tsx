import { useState } from 'react';
import Modal from './Modal';
import Illustration from '../art/Illustration';
import MicroLesson from './MicroLesson';
import ExhibitPhoto from './ExhibitPhoto';
import { IMAGES, STATION_IMAGE } from '../data/media';
import type { LessonStation as StationDef } from '../data/exhibits';

interface Props {
  station: StationDef;
  onClose: () => void;
  onRead: () => void;
  alreadyRead: boolean;
  reducedMotion: boolean;
}

export default function LessonStationModal({
  station,
  onClose,
  onRead,
  alreadyRead,
  reducedMotion,
}: Props) {
  const imageId = STATION_IMAGE[station.id];
  const [photoFound, setPhotoFound] = useState(false);

  // The drawn visual is only a stand-in for when the photograph has not been added.
  const drawn = station.animationKey ? (
    <MicroLesson
      animationKey={station.animationKey}
      videoSrc={station.microLessonVideo}
      reducedMotion={reducedMotion}
    />
  ) : (
    <Illustration kind={station.illustration} />
  );

  return (
    <Modal title={station.title} subtitle={station.date} onClose={onClose} wide>
      <div className="station-layout">
        <figure className="station-illus">
          {imageId ? (
            <>
              <ExhibitPhoto
                imageId={imageId}
                fallback={drawn}
                onResolved={(found) => setPhotoFound(found)}
              />
              {photoFound && IMAGES[imageId] && (
                <figcaption className="photo-caption">{IMAGES[imageId].title}</figcaption>
              )}
            </>
          ) : (
            drawn
          )}
        </figure>

        <div className="station-text">
          <p className="station-body">{station.body}</p>

          <div className="takeaway">
            <span className="takeaway-label">Key takeaway</span>
            <p>{station.takeaway}</p>
          </div>
        </div>
      </div>

      <footer className="modal-foot">
        <button
          className="btn btn-primary"
          onClick={() => {
            onRead();
            onClose();
          }}
        >
          {alreadyRead ? 'Close' : 'Mark as read and close'}
        </button>
        {alreadyRead && <span className="done-tick">✓ Already read</span>}
      </footer>
    </Modal>
  );
}
