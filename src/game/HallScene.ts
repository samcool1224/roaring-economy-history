/**
 * HallScene.ts — the explorable museum.
 *
 * Floor plan (not one big box):
 *
 *                 ┌───────── NORTH GALLERY ─────────┐      doors 3 · 4
 *                 └──────────────┬──────────────────┘
 *                            north corridor
 *   ┌── WEST WING ──┐─ west corr ─┤ ROTUNDA ├─ east corr ─┌── EAST WING ──┐
 *   doors 2 (top) · 1 (bottom)                     doors 5 (top) · 6 (bottom)
 *
 * Read clockwise from the lower-left: 1, 2, 3, 4, 5, 6.
 *                            south corridor
 *                      ┌──── ENTRANCE HALL ────┐
 *
 * Walls and collision are derived from a 40px grid: any cell that is not inside
 * a walkable room is a wall, and the wall cells are merged into horizontal runs
 * to keep the number of physics bodies small. Doorways appear automatically
 * wherever two walkable areas meet, so corridors open into rooms correctly.
 */
import Phaser from 'phaser';
import { createMuseumTextures, PLAYER_FRAME, TILE } from './textures';

export const WORLD = { w: 2200, h: 1720 };
const SPEED = 190;
const INTERACT_DIST = 52;

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Every walkable space in the museum, in world pixels (all multiples of 40). */
const AREAS: Record<string, Rect> = {
  entrance: { x: 840, y: 1400, w: 520, h: 240 },
  southCorridor: { x: 1000, y: 1160, w: 200, h: 240 },
  rotunda: { x: 800, y: 600, w: 600, h: 560 },
  westCorridor: { x: 400, y: 840, w: 400, h: 160 },
  westWing: { x: 160, y: 480, w: 240, h: 800 },
  eastCorridor: { x: 1400, y: 840, w: 400, h: 160 },
  eastWing: { x: 1800, y: 480, w: 240, h: 800 },
  northCorridor: { x: 1000, y: 280, w: 200, h: 320 },
  northGallery: { x: 600, y: 80, w: 1000, h: 200 },
};

export interface DoorSpec {
  id: number;
  sign: string;
  title: string;
  accent: string;
  /** Centre of the door panel, sitting in the wall. */
  x: number;
  y: number;
  side: 'left' | 'right' | 'top';
  wing: string;
}

/**
 * Doors run 1 → 6 clockwise around the rotunda, starting at the lower door of
 * the West Wing: up the west side, across the North Gallery, down the east side.
 */
export const DOORS: DoorSpec[] = [
  { id: 1, sign: 'EXHIBIT 1', title: 'The Newsroom', accent: '#c08a2e', x: 160, y: 1160, side: 'left', wing: 'West Wing' },
  { id: 2, sign: 'EXHIBIT 2', title: "Ford's Factory", accent: '#c2652f', x: 160, y: 600, side: 'left', wing: 'West Wing' },
  { id: 3, sign: 'EXHIBIT 3', title: 'The Credit Craze', accent: '#3f8f78', x: 760, y: 80, side: 'top', wing: 'North Gallery' },
  { id: 4, sign: 'EXHIBIT 4', title: 'Three Americas', accent: '#3f77a8', x: 1440, y: 80, side: 'top', wing: 'North Gallery' },
  { id: 5, sign: 'EXHIBIT 5', title: 'Two American Lives', accent: '#a65f63', x: 2040, y: 600, side: 'right', wing: 'East Wing' },
  { id: 6, sign: 'EXHIBIT 6', title: 'The Economic Verdict', accent: '#9a7b22', x: 2040, y: 1160, side: 'right', wing: 'East Wing' },
];

/** Where the visitor must stand to use a door. */
function standPoint(d: DoorSpec): { x: number; y: number } {
  if (d.side === 'left') return { x: d.x + 58, y: d.y };
  if (d.side === 'right') return { x: d.x - 58, y: d.y };
  return { x: d.x, y: d.y + 68 };
}

/** Hand-authored routes so the guide arrow never points through a wall. */
const ROUTES: Record<number, Array<{ x: number; y: number }>> = {
  1: [{ x: 1100, y: 1300 }, { x: 1100, y: 920 }, { x: 600, y: 920 }, { x: 280, y: 960 }, { x: 218, y: 1160 }],
  2: [{ x: 1100, y: 1300 }, { x: 1100, y: 920 }, { x: 600, y: 920 }, { x: 280, y: 880 }, { x: 218, y: 600 }],
  3: [{ x: 1100, y: 1300 }, { x: 1100, y: 880 }, { x: 1100, y: 420 }, { x: 1040, y: 180 }, { x: 760, y: 148 }],
  4: [{ x: 1100, y: 1300 }, { x: 1100, y: 880 }, { x: 1100, y: 420 }, { x: 1160, y: 180 }, { x: 1440, y: 148 }],
  5: [{ x: 1100, y: 1300 }, { x: 1100, y: 920 }, { x: 1600, y: 920 }, { x: 1920, y: 880 }, { x: 1982, y: 600 }],
  6: [{ x: 1100, y: 1300 }, { x: 1100, y: 920 }, { x: 1600, y: 920 }, { x: 1920, y: 960 }, { x: 1982, y: 1160 }],
};

export interface HallCallbacks {
  onPrompt: (door: DoorSpec | null, locked: boolean) => void;
  onEnter: (doorId: number) => void;
  isUnlocked: (doorId: number) => boolean;
  isCompleted: (doorId: number) => boolean;
  nextDoorId: () => number;
  reducedMotion: () => boolean;
}

interface Plaque {
  container: Phaser.GameObjects.Container;
  bg: Phaser.GameObjects.Rectangle;
  eyebrow: Phaser.GameObjects.Text;
  title: Phaser.GameObjects.Text;
  accent: number;
}

export class HallScene extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: Record<string, Phaser.Input.Keyboard.Key>;
  private walls!: Phaser.Physics.Arcade.StaticGroup;
  private doorSprites = new Map<number, Phaser.GameObjects.Image>();
  private padlocks = new Map<number, Phaser.GameObjects.Image>();
  private signs = new Map<number, Plaque>();
  private lockLabels = new Map<number, Phaser.GameObjects.Text>();
  private promptText!: Phaser.GameObjects.Text;
  private promptBg!: Phaser.GameObjects.Rectangle;
  private pathGfx!: Phaser.GameObjects.Graphics;
  private cb!: HallCallbacks;
  private activeDoor: DoorSpec | null = null;
  private lastFacing: 'down' | 'up' | 'side' = 'up';
  private inputLocked = false;
  private pulse = 0;
  private walkable: boolean[][] = [];

  constructor() {
    super('hall');
  }

  /** Door the visitor should reappear at, e.g. the exhibit they just left. */
  private spawnDoorId: number | null = null;

  init(data?: { callbacks?: HallCallbacks; spawnDoorId?: number | null }) {
    if (data?.callbacks) this.cb = data.callbacks;
    this.spawnDoorId = data?.spawnDoorId ?? null;
  }

  create() {
    if (!this.cb) return;
    createMuseumTextures(this, DOORS.map((d) => d.accent));

    this.cameras.main.setBounds(0, 0, WORLD.w, WORLD.h);
    this.cameras.main.setBackgroundColor('#cfc6b0');
    this.physics.world.setBounds(0, 0, WORLD.w, WORLD.h);

    this.buildGrid();
    this.buildFloors();
    this.buildWalls();
    this.buildDoors();
    this.buildDecor();
    this.buildPlayer();
    this.buildPrompt();

    this.pathGfx = this.add.graphics().setDepth(2);

    this.cursors = this.input.keyboard!.createCursorKeys();
    this.keys = this.input.keyboard!.addKeys('W,A,S,D,E') as Record<
      string,
      Phaser.Input.Keyboard.Key
    >;
    this.input.keyboard!.addCapture(['UP', 'DOWN', 'LEFT', 'RIGHT', 'SPACE', 'E']);
    this.keys.E.on('down', () => this.tryEnter());

    this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    this.cameras.main.fadeIn(this.cb.reducedMotion() ? 0 : 420, 244, 240, 230);
  }

  /* ------------------------------------------------------------- grid/walls */

  private get cols() {
    return Math.ceil(WORLD.w / TILE);
  }
  private get rows() {
    return Math.ceil(WORLD.h / TILE);
  }

  private buildGrid() {
    this.walkable = Array.from({ length: this.rows }, () => Array(this.cols).fill(false));
    for (const [name, area] of Object.entries(AREAS)) {
      // Snap to the grid rather than assuming alignment: an area defined a few
      // pixels off would otherwise silently fail to become walkable at all.
      const c0 = Math.round(area.x / TILE);
      const r0 = Math.round(area.y / TILE);
      const cN = Math.round(area.w / TILE);
      const rN = Math.round(area.h / TILE);
      if (import.meta.env.DEV && (area.x % TILE || area.y % TILE || area.w % TILE || area.h % TILE)) {
        console.warn(`[hall] area "${name}" is not aligned to the ${TILE}px grid; it was snapped.`);
      }
      for (let r = r0; r < r0 + rN; r++) {
        for (let c = c0; c < c0 + cN; c++) {
          if (r >= 0 && r < this.rows && c >= 0 && c < this.cols) this.walkable[r][c] = true;
        }
      }
    }
  }

  private isWalkable(c: number, r: number) {
    return r >= 0 && r < this.rows && c >= 0 && c < this.cols && this.walkable[r][c];
  }

  /** A wall cell is a non-walkable cell touching a walkable one. */
  private isWallCell(c: number, r: number) {
    if (this.isWalkable(c, r)) return false;
    return (
      this.isWalkable(c - 1, r) ||
      this.isWalkable(c + 1, r) ||
      this.isWalkable(c, r - 1) ||
      this.isWalkable(c, r + 1) ||
      this.isWalkable(c - 1, r - 1) ||
      this.isWalkable(c + 1, r - 1) ||
      this.isWalkable(c - 1, r + 1) ||
      this.isWalkable(c + 1, r + 1)
    );
  }

  private buildFloors() {
    const floorOf = (name: string) =>
      name === 'rotunda'
        ? 'floorRotunda'
        : name.endsWith('Corridor')
          ? 'runner'
          : 'floor';

    for (const [name, a] of Object.entries(AREAS)) {
      this.add.tileSprite(a.x, a.y, a.w, a.h, floorOf(name)).setOrigin(0, 0).setDepth(0);
    }

    // Rotunda medallion: a great brass coin set into the floor.
    const cx = AREAS.rotunda.x + AREAS.rotunda.w / 2;
    const cy = AREAS.rotunda.y + AREAS.rotunda.h / 2;
    const g = this.add.graphics().setDepth(0.1);
    g.fillStyle(0xb8923f, 0.28);
    g.fillCircle(cx, cy, 208);
    g.fillStyle(0xf7f3e9, 1);
    g.fillCircle(cx, cy, 196);
    g.lineStyle(6, 0xb8923f, 0.55);
    g.strokeCircle(cx, cy, 170);
    g.lineStyle(3, 0xb8923f, 0.4);
    g.strokeCircle(cx, cy, 120);
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      g.lineStyle(3, 0xb8923f, 0.3);
      g.lineBetween(
        cx + Math.cos(a) * 120,
        cy + Math.sin(a) * 120,
        cx + Math.cos(a) * 170,
        cy + Math.sin(a) * 170,
      );
    }
    this.add
      .text(cx, cy - 26, 'THE ROARING\nECONOMY', {
        fontFamily: 'Georgia, "Times New Roman", serif',
        fontSize: '30px',
        color: '#8a6b2c',
        align: 'center',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(0.2);
    this.add
      .text(cx, cy + 30, '1919 — 1929', {
        fontFamily: 'Georgia, serif',
        fontSize: '17px',
        color: '#b8923f',
      })
      .setOrigin(0.5)
      .setDepth(0.2);
    this.add
      .text(cx, cy + 64, 'THE ROTUNDA', {
        fontFamily: 'Georgia, serif',
        fontSize: '13px',
        color: '#a89b80',
      })
      .setOrigin(0.5)
      .setDepth(0.2);
  }

  private buildWalls() {
    this.walls = this.physics.add.staticGroup();
    const wallLayer = this.add.container(0, 0).setDepth(6);

    for (let r = 0; r < this.rows; r++) {
      let runStart = -1;
      for (let c = 0; c <= this.cols; c++) {
        const isWall = c < this.cols && this.isWallCell(c, r);
        if (isWall && runStart === -1) runStart = c;
        if (!isWall && runStart !== -1) {
          const x = runStart * TILE;
          const w = (c - runStart) * TILE;
          const y = r * TILE;
          wallLayer.add(
            this.add.tileSprite(x, y, w, TILE, 'wall').setOrigin(0, 0),
          );
          const body = this.add.rectangle(x + w / 2, y + TILE / 2, w, TILE);
          this.walls.add(body);
          (body.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject();
          body.setVisible(false);
          runStart = -1;
        }
      }
    }
  }

  /* ------------------------------------------------------------------ doors */

  /**
   * Each door gets a large two-line plaque: "EXHIBIT N" over the exhibit's name.
   * Side-wall plaques sit toward the middle of the wing, where visitors arrive
   * from the corridor, so both doors in a wing can be read at a glance.
   */
  private buildDoors() {
    for (const d of DOORS) {
      let angle = 0;
      let dx = d.x;
      let dy = d.y;
      if (d.side === 'left') {
        angle = 90;
        dx = d.x - 20;
      } else if (d.side === 'right') {
        angle = -90;
        dx = d.x + 20;
      } else {
        dy = d.y - 22;
      }

      const img = this.add.image(dx, dy, `door${d.id}`).setAngle(angle).setDepth(7);
      this.doorSprites.set(d.id, img);

      const sp = standPoint(d);

      // Carpet approach in front of each doorway, tinted the exhibit's colour.
      const carpet = this.add.graphics().setDepth(0.3);
      carpet.fillStyle(Phaser.Display.Color.HexStringToColor(d.accent).color, 0.22);
      if (d.side === 'top') carpet.fillRect(d.x - 44, d.y, 88, 120);
      if (d.side === 'left') carpet.fillRect(d.x, d.y - 44, 120, 88);
      if (d.side === 'right') carpet.fillRect(d.x - 120, d.y - 44, 120, 88);

      // Plaque position: toward the wing's middle for side doors, below for top doors.
      let px: number;
      let py: number;
      if (d.side === 'top') {
        px = sp.x;
        py = sp.y + 72;
      } else {
        const wing = d.side === 'left' ? AREAS.westWing : AREAS.eastWing;
        px = wing.x + wing.w / 2;
        const isUpper = d.y < wing.y + wing.h / 2;
        py = isUpper ? d.y + 78 : d.y - 78;
      }
      this.signs.set(d.id, this.makePlaque(d, px, py));

      const lock = this.add.image(sp.x, sp.y - 8, 'padlock').setDepth(9).setScale(1.6);
      this.padlocks.set(d.id, lock);

      const lockLabel = this.add
        .text(sp.x, sp.y + 32, 'Finish Exhibits 1–5 to unlock', {
          fontFamily: 'Georgia, serif',
          fontSize: '15px',
          color: '#5a5244',
          backgroundColor: 'rgba(251,248,240,0.96)',
          padding: { x: 9, y: 5 },
        })
        .setOrigin(0.5)
        .setDepth(9);
      this.lockLabels.set(d.id, lockLabel);
    }
    this.refreshDoors();
  }

  private makePlaque(d: DoorSpec, x: number, y: number): Plaque {
    const accent = Phaser.Display.Color.HexStringToColor(d.accent).color;
    const container = this.add.container(x, y).setDepth(8);
    const eyebrow = this.add
      .text(0, -15, d.sign, {
        fontFamily: 'Georgia, serif',
        fontSize: '14px',
        color: d.accent,
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    eyebrow.setLetterSpacing(2);
    const title = this.add
      .text(0, 10, d.title, {
        fontFamily: 'Georgia, serif',
        fontSize: '20px',
        color: '#27303d',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
    // Size for the widest status line the plaque will ever show, then reset.
    eyebrow.setText(`${d.sign} · LOCKED`);
    const widest = eyebrow.width;
    eyebrow.setText(d.sign);
    const w = Math.max(widest, title.width) + 30;
    const bg = this.add.rectangle(0, 0, w, 62, 0xfbf8f0, 0.98).setStrokeStyle(3, accent);
    const band = this.add.rectangle(0, -31 + 3, w - 3, 6, accent, 1);
    container.add([bg, band, eyebrow, title]);
    return { container, bg, eyebrow, title, accent };
  }

  refreshDoors() {
    for (const d of DOORS) {
      const unlocked = this.cb.isUnlocked(d.id);
      const done = this.cb.isCompleted(d.id);
      this.doorSprites.get(d.id)?.setTexture(unlocked ? `door${d.id}` : `door${d.id}-locked`);
      this.padlocks.get(d.id)?.setVisible(!unlocked);
      this.lockLabels.get(d.id)?.setVisible(!unlocked);
      const p = this.signs.get(d.id);
      if (!p) continue;
      if (!unlocked) {
        p.bg.setFillStyle(0xefeadd, 0.98).setStrokeStyle(3, 0xb3a98f);
        p.title.setColor('#8d8470');
        p.eyebrow.setText(`${d.sign} · LOCKED`).setColor('#8d8470');
      } else if (done) {
        p.bg.setFillStyle(0xeaf4ec, 0.98).setStrokeStyle(3, 0x44814d);
        p.title.setColor('#2f6b45');
        p.eyebrow.setText(`${d.sign} · ✓ DONE`).setColor('#44814d');
      } else {
        p.bg.setFillStyle(0xfbf8f0, 0.98).setStrokeStyle(3, p.accent);
        p.title.setColor('#27303d');
        p.eyebrow.setText(d.sign).setColor(d.accent);
      }
    }
  }

  /* ------------------------------------------------------------------ decor */

  private prop(x: number, y: number, key: string, solid = true, scale = 1) {
    const img = this.add.image(x, y, key).setDepth(3 + y / 2000).setScale(scale);
    if (solid) {
      const b = this.add.rectangle(
        x,
        y + (img.displayHeight / 2) * 0.55,
        img.displayWidth * 0.8,
        img.displayHeight * 0.4,
      );
      this.walls.add(b);
      (b.body as Phaser.Physics.Arcade.StaticBody).updateFromGameObject();
      b.setVisible(false);
    }
    return img;
  }

  private roomLabel(x: number, y: number, text: string, size = 20) {
    return this.add
      .text(x, y, text, {
        fontFamily: 'Georgia, serif',
        fontSize: `${size}px`,
        color: '#7a6d52',
        align: 'center',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(0.4);
  }

  private wayfinder(x: number, y: number, lines: string) {
    this.prop(x, y, 'signpost', true);
    this.add
      .text(x, y - 50, lines, {
        fontFamily: 'Georgia, serif',
        fontSize: '16px',
        color: '#27303d',
        backgroundColor: '#fbf8f0',
        padding: { x: 10, y: 6 },
        fontStyle: 'bold',
        align: 'center',
        lineSpacing: 2,
      })
      .setOrigin(0.5)
      .setDepth(9);
  }

  /**
   * Decoration respects two rules so the museum never blocks itself:
   *  - nothing solid within ~140px of a door's stand point;
   *  - nothing solid in a corridor mouth (corridor lamps are scenery only).
   */
  private buildDecor() {
    const E = AREAS.entrance;
    const R = AREAS.rotunda;
    const WW = AREAS.westWing;
    const EW = AREAS.eastWing;
    const NG = AREAS.northGallery;

    /* -- entrance hall: the way you came in -- */
    this.add.image(E.x + E.w / 2, E.y + E.h - 30, 'arch').setDepth(5);
    this.roomLabel(E.x + E.w / 2, E.y + 30, 'ENTRANCE HALL', 15);
    this.prop(E.x + 44, E.y + 50, 'tickerBoard', false);
    this.prop(E.x + E.w - 44, E.y + 50, 'chartPanel', false);
    this.prop(E.x + 46, E.y + 170, 'plant');
    this.prop(E.x + E.w - 46, E.y + 170, 'plant');
    this.add.image(E.x + 160, E.y + 196, 'stanchion').setDepth(4);
    this.add.image(E.x + 360, E.y + 196, 'stanchion').setDepth(4);

    /* -- south corridor -- */
    this.wayfinder(AREAS.southCorridor.x + 28, AREAS.southCorridor.y + 96, 'ROTUNDA\nahead ↑');

    /* -- rotunda: the coin medallion, with props kept to the corners -- */
    this.prop(R.x + 70, R.y + 90, 'coinCase');
    this.prop(R.x + R.w - 70, R.y + 90, 'coinCase');
    this.prop(R.x + 70, R.y + R.h - 70, 'plant');
    this.prop(R.x + R.w - 70, R.y + R.h - 70, 'plant');
    this.prop(R.x + 160, R.y + R.h - 40, 'lamp');
    this.prop(R.x + R.w - 160, R.y + R.h - 40, 'lamp');
    this.add.image(R.x + 100, R.y + 380, 'stanchion').setDepth(4);
    this.add.image(R.x + R.w - 100, R.y + 380, 'stanchion').setDepth(4);
    this.wayfinder(R.x + 48, R.y + 440, '← WEST WING\nExhibits 1 · 2');
    this.wayfinder(R.x + R.w - 48, R.y + 440, 'EAST WING →\nExhibits 5 · 6');
    this.wayfinder(R.x + 150, R.y + 60, '↑ NORTH GALLERY\nExhibits 3 · 4');

    /* -- west wing: industry and the press (doors on the west wall) -- */
    this.roomLabel(WW.x + WW.w / 2, WW.y + 38, 'WEST WING\nIndustry & the Press', 17);
    this.prop(WW.x + 200, WW.y + 80, 'plant');
    this.prop(WW.x + 200, WW.y + 300, 'chartPanel', false);
    this.prop(WW.x + 52, WW.y + 280, 'lamp', false);
    this.prop(WW.x + 124, WW.y + 520, 'bench');
    this.prop(WW.x + 52, WW.y + 500, 'lamp', false);
    this.prop(WW.x + 200, WW.y + 700, 'coinCase');

    /* -- east wing: money and markets (doors on the east wall) -- */
    this.roomLabel(EW.x + EW.w / 2, EW.y + 38, 'EAST WING\nLives & the Verdict', 17);
    this.prop(EW.x + 40, EW.y + 80, 'plant');
    this.prop(EW.x + 40, EW.y + 300, 'chartPanel', false);
    this.prop(EW.x + 188, EW.y + 280, 'lamp', false);
    this.prop(EW.x + 116, EW.y + 520, 'vault');
    this.prop(EW.x + 188, EW.y + 500, 'lamp', false);
    this.prop(EW.x + 40, EW.y + 700, 'coinCase');

    /* -- north gallery: the nation and the verdict (doors on the north wall) -- */
    this.roomLabel(NG.x + NG.w / 2, NG.y + NG.h - 26, 'NORTH GALLERY — Markets & the Map', 17);
    this.prop(NG.x + NG.w / 2, NG.y + 50, 'tickerBoard', false);
    this.prop(NG.x + 380, NG.y + 92, 'coinCase');
    this.prop(NG.x + NG.w - 380, NG.y + 92, 'coinCase');
    this.prop(NG.x + 24, NG.y + 160, 'plant');
    this.prop(NG.x + NG.w - 24, NG.y + 160, 'plant');

    /* -- corridor lamps: scenery only, never solid -- */
    const WC = AREAS.westCorridor;
    const EC = AREAS.eastCorridor;
    const NC = AREAS.northCorridor;
    this.prop(WC.x + 110, WC.y + 26, 'lamp', false);
    this.prop(WC.x + 280, WC.y + 26, 'lamp', false);
    this.prop(EC.x + 110, EC.y + 26, 'lamp', false);
    this.prop(EC.x + 280, EC.y + 26, 'lamp', false);
    this.prop(NC.x + 32, NC.y + 90, 'lamp', false);
    this.prop(NC.x + NC.w - 32, NC.y + 90, 'lamp', false);
    this.prop(NC.x + 32, NC.y + 230, 'lamp', false);
    this.prop(NC.x + NC.w - 32, NC.y + 230, 'lamp', false);
  }

  /* ----------------------------------------------------------------- player */

  private buildPlayer() {
    // Back from an exhibit: stand at its door, facing out into the hall.
    // Otherwise start in the entrance hall.
    const door = DOORS.find((d) => d.id === this.spawnDoorId);
    let start = { x: AREAS.entrance.x + AREAS.entrance.w / 2, y: AREAS.entrance.y + 170 };
    let frame = 'up-0';
    let flip = false;
    if (door) {
      start = standPoint(door);
      if (door.side === 'top') {
        frame = 'down-0';
        this.lastFacing = 'down';
      } else {
        frame = 'side-0';
        this.lastFacing = 'side';
        flip = door.side === 'right';
      }
    }
    this.player = this.physics.add.sprite(start.x, start.y, 'player', frame).setDepth(50);
    this.player.setFlipX(flip);
    this.player.setCollideWorldBounds(true);
    this.player.setSize(PLAYER_FRAME.w - 4, 10).setOffset(2, PLAYER_FRAME.h - 12);
    this.player.setScale(2);

    const mk = (key: string, row: string) => {
      if (this.anims.exists(key)) return;
      this.anims.create({
        key,
        frames: [0, 1, 2, 3].map((f) => ({ key: 'player', frame: `${row}-${f}` })),
        frameRate: 8,
        repeat: -1,
      });
    };
    mk('walk-down', 'down');
    mk('walk-up', 'up');
    mk('walk-side', 'side');

    this.physics.add.collider(this.player, this.walls);
  }

  private buildPrompt() {
    this.promptBg = this.add
      .rectangle(0, 0, 280, 40, 0xfbf8f0, 0.97)
      .setStrokeStyle(2, 0xb8923f)
      .setDepth(60)
      .setVisible(false);
    this.promptText = this.add
      .text(0, 0, '', {
        fontFamily: 'Georgia, serif',
        fontSize: '18px',
        color: '#33405a',
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(61)
      .setVisible(false);
  }

  /* ----------------------------------------------------------------- update */

  update(_t: number, delta: number) {
    if (!this.player || !this.cb) return;
    this.pulse += delta / 1000;

    if (this.inputLocked) {
      this.player.setVelocity(0, 0);
      return;
    }

    const left = this.cursors.left.isDown || this.keys.A.isDown;
    const right = this.cursors.right.isDown || this.keys.D.isDown;
    const up = this.cursors.up.isDown || this.keys.W.isDown;
    const down = this.cursors.down.isDown || this.keys.S.isDown;

    let vx = 0;
    let vy = 0;
    if (left) vx -= 1;
    if (right) vx += 1;
    if (up) vy -= 1;
    if (down) vy += 1;

    if (vx !== 0 || vy !== 0) {
      const len = Math.hypot(vx, vy);
      this.player.setVelocity((vx / len) * SPEED, (vy / len) * SPEED);
      if (vx !== 0) {
        this.lastFacing = 'side';
        this.player.setFlipX(vx < 0);
        this.player.anims.play('walk-side', true);
      } else if (vy < 0) {
        this.lastFacing = 'up';
        this.player.anims.play('walk-up', true);
      } else {
        this.lastFacing = 'down';
        this.player.anims.play('walk-down', true);
      }
    } else {
      this.player.setVelocity(0, 0);
      this.player.anims.stop();
      this.player.setFrame(`${this.lastFacing}-0`);
    }

    this.updateNearestDoor();
    this.updateGuidePath();
  }

  private updateNearestDoor() {
    let found: DoorSpec | null = null;
    let best = Infinity;
    for (const d of DOORS) {
      const sp = standPoint(d);
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, sp.x, sp.y);
      if (dist < INTERACT_DIST && dist < best) {
        best = dist;
        found = d;
      }
    }

    if (found !== this.activeDoor) {
      this.activeDoor = found;
      this.cb.onPrompt(found, found ? !this.cb.isUnlocked(found.id) : false);
    }

    if (found) {
      const unlocked = this.cb.isUnlocked(found.id);
      this.promptText.setText(
        unlocked
          ? `Press E — Exhibit ${found.id}: ${found.title}`
          : 'Locked — finish Exhibits 1–5 first',
      );
      const w = Math.max(240, this.promptText.width + 34);
      // Above the visitor, except at north-wall doors where that would cover the door.
      const py = found.side === 'top' ? this.player.y + 58 : this.player.y - 60;
      this.promptBg
        .setSize(w, 40)
        .setPosition(this.player.x, py)
        .setStrokeStyle(2, unlocked ? 0xb8923f : 0xa89b80)
        .setVisible(true);
      this.promptText.setPosition(this.player.x, py).setVisible(true);
    } else {
      this.promptBg.setVisible(false);
      this.promptText.setVisible(false);
    }
  }

  /** Points at the next waypoint on the authored route, never through a wall. */
  private updateGuidePath() {
    this.pathGfx.clear();
    const target = DOORS.find((d) => d.id === this.cb.nextDoorId());
    if (!target) return;

    const route = [...(ROUTES[target.id] ?? []), standPoint(target)];
    let bestIdx = 0;
    let bestDist = Infinity;
    route.forEach((p, i) => {
      const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, p.x, p.y);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    });
    // Aim at the next waypoint along, unless we are already past the end.
    const aim = route[Math.min(bestIdx + (bestDist < 90 ? 1 : 0), route.length - 1)];
    const dist = Phaser.Math.Distance.Between(this.player.x, this.player.y, aim.x, aim.y);
    if (dist < 70) return;

    const reduced = this.cb.reducedMotion();
    const alpha = reduced ? 0.4 : 0.3 + Math.sin(this.pulse * 2.4) * 0.14;
    const ang = Math.atan2(aim.y - this.player.y, aim.x - this.player.x);

    this.pathGfx.fillStyle(0xb8923f, alpha);
    for (let i = 1; i <= 5; i++) {
      const t = i * 32;
      if (t > dist - 44) break;
      this.pathGfx.fillCircle(
        this.player.x + Math.cos(ang) * t,
        this.player.y + Math.sin(ang) * t,
        5 - i * 0.5,
      );
    }
    const ax = this.player.x + Math.cos(ang) * Math.min(dist - 30, 190);
    const ay = this.player.y + Math.sin(ang) * Math.min(dist - 30, 190);
    this.pathGfx.fillStyle(0x8a6b2c, reduced ? 0.55 : 0.42 + Math.sin(this.pulse * 2.4) * 0.16);
    this.pathGfx.fillTriangle(
      ax + Math.cos(ang) * 13,
      ay + Math.sin(ang) * 13,
      ax + Math.cos(ang + 2.5) * 12,
      ay + Math.sin(ang + 2.5) * 12,
      ax + Math.cos(ang - 2.5) * 12,
      ay + Math.sin(ang - 2.5) * 12,
    );
  }

  private tryEnter() {
    if (this.inputLocked || !this.activeDoor) return;
    const d = this.activeDoor;
    if (!this.cb.isUnlocked(d.id)) return;
    this.pauseControl();
    if (this.cb.reducedMotion()) {
      this.cb.onEnter(d.id);
      return;
    }
    this.cameras.main.fadeOut(320, 244, 240, 230);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () =>
      this.cb.onEnter(d.id),
    );
  }

  /* ------------------------------------------------------------------- api */

  resumeControl() {
    this.inputLocked = false;
    if (this.input.keyboard) this.input.keyboard.enabled = true;
    this.player?.setVelocity(0, 0);
  }

  pauseControl() {
    this.inputLocked = true;
    this.player?.setVelocity(0, 0);
    this.player?.anims.stop();
  }

  returnToHall() {
    this.cameras.main.fadeIn(this.cb.reducedMotion() ? 0 : 320, 244, 240, 230);
    this.refreshDoors();
    this.resumeControl();
  }

  /** Developer-only readout used by the QA harness. */
  debugState() {
    return {
      player: { x: Math.round(this.player.x), y: Math.round(this.player.y) },
      activeDoor: this.activeDoor?.id ?? null,
      doors: DOORS.map((d) => ({
        id: d.id,
        stand: standPoint(d),
        unlocked: this.cb.isUnlocked(d.id),
        wing: d.wing,
      })),
      areas: AREAS,
    };
  }

  /**
   * Developer-only: flood-fills the museum from the visitor's starting point
   * against the real physics bodies (walls AND solid props) and reports which
   * door stand points can actually be walked to. Guards against a decorative
   * prop being dropped into a doorway or corridor mouth.
   */
  debugReachability() {
    const STEP = 20;
    const cols = Math.ceil(WORLD.w / STEP);
    const rows = Math.ceil(WORLD.h / STEP);
    const blocked = Array.from({ length: rows }, () => new Uint8Array(cols));
    // The visitor's collision box is about 24x20 at scale 2; pad bodies by that
    // so a gap too narrow to squeeze through counts as blocked.
    const PAD = 14;

    for (const body of this.walls.getChildren()) {
      const b = (body as Phaser.GameObjects.Rectangle)
        .body as Phaser.Physics.Arcade.StaticBody | null;
      if (!b) continue;
      const c0 = Math.max(0, Math.floor((b.x - PAD) / STEP));
      const c1 = Math.min(cols - 1, Math.floor((b.x + b.width + PAD) / STEP));
      const r0 = Math.max(0, Math.floor((b.y - PAD) / STEP));
      const r1 = Math.min(rows - 1, Math.floor((b.y + b.height + PAD) / STEP));
      for (let r = r0; r <= r1; r++) for (let c = c0; c <= c1; c++) blocked[r][c] = 1;
    }

    const seen = Array.from({ length: rows }, () => new Uint8Array(cols));
    const start = {
      c: Math.floor(this.player.x / STEP),
      r: Math.floor(this.player.y / STEP),
    };
    const queue: Array<[number, number]> = [[start.c, start.r]];
    seen[start.r][start.c] = 1;
    while (queue.length) {
      const [c, r] = queue.pop() as [number, number];
      for (const [dc, dr] of [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ]) {
        const nc = c + dc;
        const nr = r + dr;
        if (nc < 0 || nr < 0 || nc >= cols || nr >= rows) continue;
        if (seen[nr][nc] || blocked[nr][nc]) continue;
        seen[nr][nc] = 1;
        queue.push([nc, nr]);
      }
    }

    return {
      startBlocked: blocked[start.r][start.c] === 1,
      doors: DOORS.map((d) => {
        const sp = standPoint(d);
        const c = Math.floor(sp.x / STEP);
        const r = Math.floor(sp.y / STEP);
        return { id: d.id, sign: d.sign, reachable: seen[r]?.[c] === 1 };
      }),
      areas: Object.entries(AREAS).map(([name, a]) => {
        const c = Math.floor((a.x + a.w / 2) / STEP);
        const r = Math.floor((a.y + a.h / 2) / STEP);
        return { name, reachable: seen[r]?.[c] === 1 };
      }),
    };
  }

  teleportToDoor(doorId: number) {
    const d = DOORS.find((x) => x.id === doorId);
    if (!d) return;
    const sp = standPoint(d);
    this.player.setPosition(sp.x, sp.y);
  }

  /** Dev helper: drop the visitor at a named room. */
  teleportToArea(name: string) {
    const a = AREAS[name];
    if (!a) return;
    this.player.setPosition(a.x + a.w / 2, a.y + a.h / 2);
  }
}
