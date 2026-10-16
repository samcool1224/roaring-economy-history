/**
 * textures.ts — all museum artwork is drawn procedurally in code at runtime.
 * Nothing is hotlinked, so the museum renders identically offline.
 *
 * Light gallery palette: pale marble, warm stone, brass and colour-coded wings.
 */
import Phaser from 'phaser';

export const PALETTE = {
  marbleA: '#f4f0e6',
  marbleB: '#eae4d5',
  marbleLine: '#ddd4bf',
  marbleVein: '#e0d8c6',
  rotundaA: '#f7f3e9',
  rotundaB: '#e6dcc6',
  wall: '#e4dcc9',
  wallShade: '#d2c7ae',
  wallTop: '#bcb096',
  wallCap: '#f6f2e8',
  brass: '#b8923f',
  brassLight: '#dcc07c',
  brassDeep: '#8a6b2c',
  burgundy: '#8c3f4d',
  burgundyLight: '#a85c68',
  teal: '#3f7f84',
  green: '#5d8a60',
  greenLight: '#83ad85',
  ink: '#33405a',
  inkSoft: '#5a6781',
  wood: '#9a7246',
  woodDark: '#7a5634',
  glass: '#bcd4de',
  skin: '#d9a97e',
  coat: '#3b4a69',
  coatDark: '#2c3850',
  shadow: 'rgba(60,50,30,0.16)',
} as const;

type Ctx = CanvasRenderingContext2D;

function canvasTexture(
  scene: Phaser.Scene,
  key: string,
  w: number,
  h: number,
  draw: (ctx: Ctx) => void,
): void {
  if (scene.textures.exists(key)) return;
  const tex = scene.textures.createCanvas(key, w, h);
  if (!tex) return;
  const ctx = tex.getContext();
  ctx.imageSmoothingEnabled = false;
  draw(ctx);
  tex.refresh();
}

const px = (ctx: Ctx, x: number, y: number, w: number, h: number, color: string) => {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
};

/* ------------------------------------------------------------------ floors */

function drawFloorTile(ctx: Ctx) {
  px(ctx, 0, 0, 40, 40, PALETTE.marbleA);
  px(ctx, 0, 0, 20, 20, PALETTE.marbleB);
  px(ctx, 20, 20, 20, 20, PALETTE.marbleB);
  px(ctx, 0, 0, 40, 1, PALETTE.marbleLine);
  px(ctx, 0, 0, 1, 40, PALETTE.marbleLine);
  // faint veining so large floors do not read as flat checker
  px(ctx, 5, 12, 9, 1, PALETTE.marbleVein);
  px(ctx, 26, 30, 7, 1, PALETTE.marbleVein);
  px(ctx, 31, 6, 1, 6, PALETTE.marbleVein);
}

function drawRotundaTile(ctx: Ctx) {
  px(ctx, 0, 0, 40, 40, PALETTE.rotundaA);
  px(ctx, 0, 0, 40, 2, PALETTE.rotundaB);
  px(ctx, 0, 0, 2, 40, PALETTE.rotundaB);
  px(ctx, 18, 18, 4, 4, PALETTE.brassLight);
  px(ctx, 19, 19, 2, 2, PALETTE.brass);
}

function drawRunnerTile(ctx: Ctx) {
  // Burgundy carpet runner laid down the corridors.
  px(ctx, 0, 0, 40, 40, PALETTE.burgundy);
  px(ctx, 0, 0, 40, 3, PALETTE.burgundyLight);
  px(ctx, 0, 37, 40, 3, '#73323e');
  px(ctx, 8, 14, 24, 12, PALETTE.burgundyLight);
  px(ctx, 11, 17, 18, 6, PALETTE.burgundy);
}

/* ------------------------------------------------------------------- walls */

function drawWallTile(ctx: Ctx) {
  // 40x40 light stone block, viewed top-down with a lit cap edge.
  px(ctx, 0, 0, 40, 40, PALETTE.wall);
  px(ctx, 0, 0, 40, 6, PALETTE.wallTop);
  px(ctx, 0, 6, 40, 3, PALETTE.wallShade);
  px(ctx, 0, 34, 40, 6, PALETTE.wallCap);
  px(ctx, 0, 32, 40, 2, PALETTE.wallShade);
  // panel seam
  px(ctx, 19, 10, 2, 22, PALETTE.wallShade);
  px(ctx, 4, 12, 12, 2, '#d9cfb8');
  px(ctx, 24, 24, 12, 2, '#d9cfb8');
}

/* ------------------------------------------------------------------- doors */

function drawDoor(ctx: Ctx, accent: string, locked: boolean) {
  const W = 104;
  const H = 116;
  px(ctx, 0, 0, W, H, 'rgba(0,0,0,0)');
  // stepped Art Deco surround in pale stone
  px(ctx, 16, 0, W - 32, 8, PALETTE.wallCap);
  px(ctx, 8, 6, W - 16, 10, PALETTE.wallCap);
  px(ctx, 4, 14, W - 8, H - 18, PALETTE.wall);
  px(ctx, 4, 14, W - 8, 4, PALETTE.wallTop);
  // accent band identifying the wing
  px(ctx, 10, 20, W - 20, 6, accent);
  // sign plate
  px(ctx, 14, 30, W - 28, 18, '#fbf8f0');
  px(ctx, 14, 30, W - 28, 2, PALETTE.brassLight);
  px(ctx, 16, 44, W - 32, 2, '#e3dccb');
  // doorway
  const top = 52;
  px(ctx, 14, top, W - 28, H - top - 8, locked ? '#b9ae97' : '#6d4a52');
  px(ctx, 17, top + 3, 33, H - top - 16, locked ? '#cabfa8' : PALETTE.burgundy);
  px(ctx, 54, top + 3, 33, H - top - 16, locked ? '#cabfa8' : PALETTE.burgundy);
  px(ctx, 51, top, 2, H - top - 8, PALETTE.brass);
  if (!locked) {
    // warm light spilling from the gallery beyond
    px(ctx, 20, top + 6, 27, 10, PALETTE.burgundyLight);
    px(ctx, 57, top + 6, 27, 10, PALETTE.burgundyLight);
  }
  // handles
  px(ctx, 45, top + 32, 4, 10, PALETTE.brassLight);
  px(ctx, 55, top + 32, 4, 10, PALETTE.brassLight);
  // threshold
  px(ctx, 14, H - 8, W - 28, 4, locked ? PALETTE.wallShade : accent);
}

function drawPadlock(ctx: Ctx) {
  px(ctx, 0, 0, 26, 28, 'rgba(0,0,0,0)');
  px(ctx, 8, 2, 10, 3, '#8d8470');
  px(ctx, 5, 4, 3, 8, '#8d8470');
  px(ctx, 18, 4, 3, 8, '#8d8470');
  px(ctx, 3, 11, 20, 15, '#9a9179');
  px(ctx, 4, 12, 18, 13, '#c3b99e');
  px(ctx, 4, 12, 18, 2, '#ddd3b7');
  px(ctx, 12, 16, 3, 3, '#5a5244');
  px(ctx, 13, 19, 1, 4, '#5a5244');
}

/* ------------------------------------------------------- economy fittings */

/** Glass display case holding a giant commemorative coin. */
function drawCoinCase(ctx: Ctx) {
  px(ctx, 0, 0, 56, 64, 'rgba(0,0,0,0)');
  px(ctx, 4, 48, 48, 14, PALETTE.woodDark);
  px(ctx, 4, 46, 48, 4, PALETTE.wood);
  px(ctx, 6, 6, 44, 44, PALETTE.glass);
  px(ctx, 8, 8, 40, 40, '#d6e6ec');
  px(ctx, 6, 6, 44, 3, '#ffffff');
  px(ctx, 6, 6, 3, 44, '#ffffff');
  // coin
  px(ctx, 18, 16, 20, 20, PALETTE.brass);
  px(ctx, 20, 18, 16, 16, PALETTE.brassLight);
  px(ctx, 24, 22, 8, 8, PALETTE.brass);
  px(ctx, 6, 46, 44, 2, PALETTE.brassDeep);
}

/** Wall-mounted production/price chart in a brass frame. */
function drawChartPanel(ctx: Ctx) {
  px(ctx, 0, 0, 72, 52, 'rgba(0,0,0,0)');
  px(ctx, 0, 0, 72, 52, PALETTE.brassDeep);
  px(ctx, 3, 3, 66, 46, '#fbf8f0');
  px(ctx, 8, 40, 56, 1, '#b9b09a');
  px(ctx, 8, 8, 1, 33, '#b9b09a');
  // rising bars
  const hs = [8, 14, 11, 20, 26, 31];
  hs.forEach((h, i) => px(ctx, 12 + i * 9, 40 - h, 6, h, i % 2 ? PALETTE.teal : PALETTE.green));
}

/** Wall-mounted stock ticker board. */
function drawTickerBoard(ctx: Ctx) {
  px(ctx, 0, 0, 88, 40, 'rgba(0,0,0,0)');
  px(ctx, 0, 0, 88, 40, '#3a3f4c');
  px(ctx, 3, 3, 82, 34, '#1d2330');
  for (let i = 0; i < 5; i++) {
    px(ctx, 8 + i * 16, 10, 9, 4, PALETTE.greenLight);
    px(ctx, 8 + i * 16, 20, 6, 4, PALETTE.brassLight);
    px(ctx, 8 + i * 16, 28, 11, 3, '#6d7890');
  }
  px(ctx, 0, 37, 88, 3, PALETTE.brassDeep);
}

/** Decorative bank-vault door, the centrepiece of the finance wing. */
function drawVault(ctx: Ctx) {
  px(ctx, 0, 0, 80, 80, 'rgba(0,0,0,0)');
  px(ctx, 4, 4, 72, 72, '#8e8674');
  px(ctx, 8, 8, 64, 64, '#b3a98f');
  px(ctx, 12, 12, 56, 56, '#c8bda0');
  // wheel
  px(ctx, 34, 20, 12, 40, PALETTE.brassDeep);
  px(ctx, 20, 34, 40, 12, PALETTE.brassDeep);
  px(ctx, 30, 30, 20, 20, PALETTE.brass);
  px(ctx, 34, 34, 12, 12, PALETTE.brassLight);
  px(ctx, 8, 8, 64, 3, '#ded4b8');
}

/** Pedestal uplight. */
function drawLamp(ctx: Ctx) {
  px(ctx, 0, 0, 26, 58, 'rgba(0,0,0,0)');
  px(ctx, 6, 50, 14, 6, PALETTE.brassDeep);
  px(ctx, 8, 48, 10, 4, PALETTE.brass);
  px(ctx, 10, 18, 6, 32, PALETTE.brass);
  px(ctx, 11, 18, 2, 32, PALETTE.brassLight);
  px(ctx, 3, 8, 20, 12, PALETTE.brassLight);
  px(ctx, 5, 5, 16, 5, '#f6e9c4');
  px(ctx, 4, 19, 18, 3, PALETTE.brassDeep);
  px(ctx, 6, 22, 14, 2, 'rgba(255, 238, 190, 0.7)');
}

function drawPlant(ctx: Ctx) {
  px(ctx, 0, 0, 36, 48, 'rgba(0,0,0,0)');
  px(ctx, 8, 30, 20, 16, '#c9bda2');
  px(ctx, 8, 30, 20, 3, '#ded3b9');
  px(ctx, 10, 33, 16, 11, '#b2a68b');
  px(ctx, 7, 28, 22, 3, PALETTE.brassDeep);
  px(ctx, 16, 12, 4, 20, PALETTE.green);
  px(ctx, 6, 14, 10, 4, PALETTE.green);
  px(ctx, 20, 14, 10, 4, PALETTE.green);
  px(ctx, 9, 7, 7, 6, PALETTE.greenLight);
  px(ctx, 20, 7, 7, 6, PALETTE.greenLight);
  px(ctx, 15, 3, 7, 7, PALETTE.greenLight);
  px(ctx, 3, 20, 9, 3, PALETTE.greenLight);
  px(ctx, 24, 20, 9, 3, PALETTE.greenLight);
}

function drawBench(ctx: Ctx) {
  px(ctx, 0, 0, 76, 36, 'rgba(0,0,0,0)');
  px(ctx, 4, 8, 68, 13, PALETTE.wood);
  px(ctx, 4, 8, 68, 3, '#b08a58');
  px(ctx, 4, 21, 68, 3, PALETTE.woodDark);
  px(ctx, 9, 24, 7, 10, PALETTE.brassDeep);
  px(ctx, 60, 24, 7, 10, PALETTE.brassDeep);
}

function drawStanchion(ctx: Ctx) {
  px(ctx, 0, 0, 104, 42, 'rgba(0,0,0,0)');
  for (const x of [4, 86]) {
    px(ctx, x + 2, 36, 12, 4, '#a89b80');
    px(ctx, x + 5, 10, 6, 27, PALETTE.brass);
    px(ctx, x + 6, 10, 2, 27, PALETTE.brassLight);
    px(ctx, x + 3, 5, 10, 6, PALETTE.brassLight);
  }
  for (let i = 0; i < 76; i++) {
    const t = i / 75;
    const y = 12 + Math.sin(t * Math.PI) * 11;
    px(ctx, 14 + i, Math.round(y), 1, 5, PALETTE.burgundy);
    px(ctx, 14 + i, Math.round(y), 1, 2, PALETTE.burgundyLight);
  }
}

/** Free-standing wayfinding sign at corridor junctions. */
function drawSignpost(ctx: Ctx) {
  px(ctx, 0, 0, 44, 56, 'rgba(0,0,0,0)');
  px(ctx, 19, 24, 6, 28, PALETTE.brassDeep);
  px(ctx, 14, 50, 16, 5, '#a89b80');
  px(ctx, 2, 4, 40, 22, '#fbf8f0');
  px(ctx, 2, 4, 40, 3, PALETTE.brass);
  px(ctx, 2, 23, 40, 3, PALETTE.brassDeep);
  px(ctx, 7, 11, 22, 3, '#8d8470');
  px(ctx, 7, 17, 15, 3, '#b0a894');
}

function drawEntryArch(ctx: Ctx) {
  const W = 240;
  const H = 76;
  px(ctx, 0, 0, W, H, 'rgba(0,0,0,0)');
  px(ctx, 0, H - 16, W, 16, PALETTE.wall);
  px(ctx, 10, 32, W - 20, 28, PALETTE.wallCap);
  px(ctx, 28, 20, W - 56, 16, PALETTE.wallCap);
  px(ctx, 52, 8, W - 104, 16, PALETTE.wallCap);
  px(ctx, 14, 36, W - 28, 20, PALETTE.wall);
  px(ctx, 32, 24, W - 64, 14, PALETTE.wall);
  px(ctx, 56, 12, W - 112, 12, PALETTE.wall);
  for (let i = 0; i < 9; i++) px(ctx, 64 + i * 13, 44 - i, 4, 16 + i, PALETTE.brass);
  px(ctx, 0, H - 18, W, 4, PALETTE.brass);
  px(ctx, 0, H - 14, W, 2, PALETTE.brassDeep);
}

/* ------------------------------------------------------------------ player */

function drawPlayerSheet(ctx: Ctx) {
  const FW = 16;
  const FH = 26;
  px(ctx, 0, 0, FW * 4, FH * 3, 'rgba(0,0,0,0)');
  const legPhase = [0, 1, 0, -1];

  const body = (ox: number, oy: number, facing: 'down' | 'up' | 'side', phase: number) => {
    const p = legPhase[phase];
    px(ctx, ox + 3, oy + 24, 10, 2, 'rgba(70,60,40,0.26)');
    px(ctx, ox + 5, oy + 18, 3, 6 + (p > 0 ? 0 : 1), PALETTE.coatDark);
    px(ctx, ox + 9, oy + 18, 3, 6 + (p < 0 ? 0 : 1), PALETTE.coatDark);
    px(ctx, ox + 4, oy + 23 + (p > 0 ? 0 : 1), 4, 2, '#241c14');
    px(ctx, ox + 9, oy + 23 + (p < 0 ? 0 : 1), 4, 2, '#241c14');
    px(ctx, ox + 3, oy + 10, 10, 9, PALETTE.coat);
    px(ctx, ox + 3, oy + 10, 10, 2, '#4a5c82');
    px(ctx, ox + 7, oy + 12, 2, 7, PALETTE.coatDark);
    const armY = oy + 11 + (p > 0 ? 1 : 0);
    px(ctx, ox + 1, armY, 2, 7, PALETTE.coat);
    px(ctx, ox + 13, oy + 11 + (p < 0 ? 1 : 0), 2, 7, PALETTE.coat);
    px(ctx, ox + 5, oy + 4, 6, 6, PALETTE.skin);
    if (facing === 'down') {
      px(ctx, ox + 6, oy + 7, 1, 1, '#3a2a1c');
      px(ctx, ox + 9, oy + 7, 1, 1, '#3a2a1c');
    } else if (facing === 'up') {
      px(ctx, ox + 5, oy + 4, 6, 5, '#6b4a30');
    } else {
      px(ctx, ox + 9, oy + 7, 1, 1, '#3a2a1c');
      px(ctx, ox + 5, oy + 5, 3, 4, '#6b4a30');
    }
    px(ctx, ox + 4, oy + 1, 8, 4, PALETTE.burgundy);
    px(ctx, ox + 3, oy + 4, 10, 2, PALETTE.burgundyLight);
    px(ctx, ox + 5, oy + 1, 3, 1, '#a85c68');
  };

  for (let f = 0; f < 4; f++) body(f * FW, 0, 'down', f);
  for (let f = 0; f < 4; f++) body(f * FW, FH, 'up', f);
  for (let f = 0; f < 4; f++) body(f * FW, FH * 2, 'side', f);
}

/* ------------------------------------------------------------------ public */

export const PLAYER_FRAME = { w: 16, h: 26 };
export const TILE = 40;

export function createMuseumTextures(scene: Phaser.Scene, doorAccents: string[]): void {
  canvasTexture(scene, 'floor', TILE, TILE, drawFloorTile);
  canvasTexture(scene, 'floorRotunda', TILE, TILE, drawRotundaTile);
  canvasTexture(scene, 'runner', TILE, TILE, drawRunnerTile);
  canvasTexture(scene, 'wall', TILE, TILE, drawWallTile);
  canvasTexture(scene, 'lamp', 26, 58, drawLamp);
  canvasTexture(scene, 'plant', 36, 48, drawPlant);
  canvasTexture(scene, 'stanchion', 104, 42, drawStanchion);
  canvasTexture(scene, 'bench', 76, 36, drawBench);
  canvasTexture(scene, 'arch', 240, 76, drawEntryArch);
  canvasTexture(scene, 'padlock', 26, 28, drawPadlock);
  canvasTexture(scene, 'coinCase', 56, 64, drawCoinCase);
  canvasTexture(scene, 'chartPanel', 72, 52, drawChartPanel);
  canvasTexture(scene, 'tickerBoard', 88, 40, drawTickerBoard);
  canvasTexture(scene, 'vault', 80, 80, drawVault);
  canvasTexture(scene, 'signpost', 44, 56, drawSignpost);

  doorAccents.forEach((accent, i) => {
    canvasTexture(scene, `door${i + 1}`, 104, 116, (ctx) => drawDoor(ctx, accent, false));
    canvasTexture(scene, `door${i + 1}-locked`, 104, 116, (ctx) => drawDoor(ctx, accent, true));
  });

  if (!scene.textures.exists('player')) {
    const tex = scene.textures.createCanvas('player', PLAYER_FRAME.w * 4, PLAYER_FRAME.h * 3);
    if (tex) {
      const ctx = tex.getContext();
      ctx.imageSmoothingEnabled = false;
      drawPlayerSheet(ctx);
      ['down', 'up', 'side'].forEach((row, r) => {
        for (let f = 0; f < 4; f++) {
          tex.add(
            `${row}-${f}`,
            0,
            f * PLAYER_FRAME.w,
            r * PLAYER_FRAME.h,
            PLAYER_FRAME.w,
            PLAYER_FRAME.h,
          );
        }
      });
      tex.refresh();
    }
  }
}
