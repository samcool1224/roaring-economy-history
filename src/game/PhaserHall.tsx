import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { HallScene, type DoorSpec, type HallCallbacks } from './HallScene';
import { devModeEnabled } from '../state/progress';

interface Props {
  onEnterDoor: (id: number) => void;
  onPrompt: (door: DoorSpec | null, locked: boolean) => void;
  isUnlocked: (id: number) => boolean;
  isCompleted: (id: number) => boolean;
  nextDoorId: () => number;
  reducedMotion: boolean;
  /** Toggled by React: false while an overlay owns the keyboard. */
  active: boolean;
  /** Exhibit door to reappear at; null starts in the entrance hall. */
  spawnDoorId: number | null;
}

export default function PhaserHall(props: Props) {
  const holder = useRef<HTMLDivElement | null>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const sceneRef = useRef<HallScene | null>(null);
  // Keep the latest callbacks reachable without rebuilding the game.
  const live = useRef(props);
  live.current = props;

  useEffect(() => {
    if (!holder.current || gameRef.current) return;

    const callbacks: HallCallbacks = {
      onPrompt: (d, locked) => live.current.onPrompt(d, locked),
      onEnter: (id) => live.current.onEnterDoor(id),
      isUnlocked: (id) => live.current.isUnlocked(id),
      isCompleted: (id) => live.current.isCompleted(id),
      nextDoorId: () => live.current.nextDoorId(),
      reducedMotion: () => live.current.reducedMotion,
    };

    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: holder.current,
      backgroundColor: '#cfc6b0',
      pixelArt: true,
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1280,
        height: 720,
      },
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { x: 0, y: 0 },
          debug: false,
          // Integrate against real elapsed time rather than a fixed 1/60 step,
          // so walking speed stays the same on a slow laptop as on a fast one.
          fixedStep: false,
        },
      },
      // Registered below instead of here, so the scene never auto-starts
      // without its callbacks.
      scene: [],
    });
    gameRef.current = game;

    game.scene.add('hall', HallScene, true, { callbacks, spawnDoorId: live.current.spawnDoorId });
    // The scene instance only exists once the boot cycle has run.
    const grab = () => {
      const s = game.scene.getScene('hall') as HallScene | null;
      if (s) {
        sceneRef.current = s;
        // Developer-only inspection handle for QA (?dev=1). Never present
        // for visitors, and nothing in the museum reads from it.
        if (devModeEnabled()) {
          (window as unknown as Record<string, unknown>).__roaringHall = s;
        }
      } else setTimeout(grab, 40);
    };
    grab();

    return () => {
      game.destroy(true);
      gameRef.current = null;
      sceneRef.current = null;
    };
  }, []);

  // Hand keyboard control back and forth as overlays open and close.
  useEffect(() => {
    const s = sceneRef.current;
    if (!s) return;
    if (props.active) s.resumeControl();
    else s.pauseControl();
  }, [props.active]);

  // Repaint padlocks whenever unlocking changes.
  useEffect(() => {
    sceneRef.current?.refreshDoors();
  });

  return (
    <div
      ref={holder}
      className="phaser-holder"
      aria-label="Museum hall — use W A S D or the arrow keys to walk, and E to enter a door"
      role="application"
      style={{ aspectRatio: '16 / 9' }}
    />
  );
}
