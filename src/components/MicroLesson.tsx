import { useEffect, useRef, useState } from 'react';

/**
 * MicroLesson — original animated micro-video for Exhibit 1's stations.
 *
 * These are moving diagrams drawn on a canvas, roughly 14 seconds long, with
 * play / pause / replay and a progress bar. They are explicitly modern teaching
 * animations, NOT archival footage, and they are labelled that way on screen.
 *
 * If a real MP4 is later dropped at the station's optional `videoSrc`, the
 * component plays that instead.
 */

interface Props {
  animationKey: 'inflation' | 'jobs' | 'recession';
  videoSrc?: string;
  reducedMotion: boolean;
  onFinished?: () => void;
}

const DURATION = 14; // seconds

export default function MicroLesson({ animationKey, videoSrc, reducedMotion, onFinished }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [playing, setPlaying] = useState(!reducedMotion);
  const [t, setT] = useState(0);
  const [useVideo, setUseVideo] = useState(false);
  const raf = useRef<number | null>(null);
  const last = useRef<number>(0);
  const finished = useRef(false);

  // Only swap in a real video if one is actually present.
  useEffect(() => {
    if (!videoSrc) return;
    let cancelled = false;
    fetch(videoSrc, { method: 'HEAD' })
      .then((r) => {
        const type = r.headers.get('content-type') ?? '';
        if (!cancelled && r.ok && !type.includes('text/html')) setUseVideo(true);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [videoSrc]);

  useEffect(() => {
    if (useVideo) return;
    const step = (now: number) => {
      if (last.current === 0) last.current = now;
      const dt = (now - last.current) / 1000;
      last.current = now;
      if (playing) {
        setT((prev) => {
          const next = Math.min(DURATION, prev + dt);
          if (next >= DURATION && !finished.current) {
            finished.current = true;
            onFinished?.();
          }
          return next;
        });
      }
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      last.current = 0;
    };
  }, [playing, useVideo, onFinished]);

  // Reduced motion: show the finished state immediately.
  useEffect(() => {
    if (reducedMotion && !useVideo) {
      setT(DURATION);
      setPlaying(false);
      if (!finished.current) {
        finished.current = true;
        onFinished?.();
      }
    }
  }, [reducedMotion, useVideo, onFinished]);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv || useVideo) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;
    draw(ctx, animationKey, t / DURATION, cv.width, cv.height);
  }, [t, animationKey, useVideo]);

  if (useVideo && videoSrc) {
    return (
      <div className="micro-lesson">
        <video className="micro-canvas" controls playsInline preload="none" onEnded={onFinished}>
          <source src={videoSrc} type="video/mp4" />
        </video>
      </div>
    );
  }

  const pct = Math.round((t / DURATION) * 100);

  return (
    <div className="micro-lesson">
      <canvas ref={canvasRef} className="micro-canvas" width={640} height={300} aria-hidden="true" />
      <div className="micro-controls">
        <button
          className="btn btn-small"
          onClick={() => {
            if (t >= DURATION) {
              setT(0);
              finished.current = false;
            }
            setPlaying((p) => !p);
          }}
        >
          {playing ? 'Pause' : t >= DURATION ? 'Replay' : 'Play'}
        </button>
        <button
          className="btn btn-small"
          onClick={() => {
            setT(0);
            finished.current = false;
            setPlaying(true);
          }}
        >
          Restart
        </button>
        <div className="micro-progress" aria-hidden="true">
          <div className="micro-progress-fill" style={{ width: `${pct}%` }} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ frames */

const INK = '#27303d';
const DIM = '#8a93a1';
const BRASS = '#b07d1f';
const RUST = '#a63f54';
const SKY = '#2a68a4';
const GREEN = '#44814d';

function bg(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.fillStyle = '#faf9f6';
  ctx.fillRect(0, 0, w, h);
  // faint ruled lines, like a lecture-room chart
  ctx.fillStyle = 'rgba(39,48,61,0.035)';
  for (let y = 0; y < h; y += 4) ctx.fillRect(0, y, w, 1);
}

function label(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  alpha: number,
  size = 17,
  color = INK,
) {
  if (alpha <= 0) return;
  ctx.save();
  ctx.globalAlpha = Math.min(1, alpha);
  ctx.fillStyle = color;
  ctx.font = `${size}px Georgia, serif`;
  ctx.fillText(text, x, y);
  ctx.restore();
}

/** Eases a value in over the window [from, to] of overall progress p. */
const seg = (p: number, from: number, to: number) =>
  Math.max(0, Math.min(1, (p - from) / (to - from)));

function draw(
  ctx: CanvasRenderingContext2D,
  key: 'inflation' | 'jobs' | 'recession',
  p: number,
  w: number,
  h: number,
) {
  bg(ctx, w, h);

  if (key === 'inflation') {
    label(ctx, 'Prices after the war, 1918–1921', 28, 40, seg(p, 0, 0.08), 19, BRASS);

    // axes
    ctx.strokeStyle = DIM;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(60, 70);
    ctx.lineTo(60, 240);
    ctx.lineTo(590, 240);
    ctx.stroke();
    label(ctx, 'price level', 14, 64, seg(p, 0.05, 0.12), 13, DIM);

    // rising half
    const rise = seg(p, 0.12, 0.5);
    ctx.strokeStyle = RUST;
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(60, 230);
    for (let i = 0; i <= rise * 100; i++) {
      const x = 60 + (i / 100) * 260;
      const y = 230 - Math.pow(i / 100, 1.3) * 140;
      ctx.lineTo(x, y);
    }
    ctx.stroke();
    label(ctx, 'wartime spending → rising prices', 76, 200, seg(p, 0.2, 0.32), 15, RUST);

    // falling half
    const fall = seg(p, 0.52, 0.86);
    if (fall > 0) {
      ctx.strokeStyle = SKY;
      ctx.beginPath();
      ctx.moveTo(320, 90);
      for (let i = 0; i <= fall * 100; i++) {
        const x = 320 + (i / 100) * 250;
        const y = 90 + Math.pow(i / 100, 0.9) * 130;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
      label(ctx, '1920–21: prices fall fast', 350, 80, seg(p, 0.6, 0.72), 15, SKY);
    }

    label(
      ctx,
      'Two shocks in a row: a cost-of-living squeeze, then a slump.',
      28,
      278,
      seg(p, 0.86, 0.96),
      15,
      INK,
    );
    return;
  }

  if (key === 'jobs') {
    label(ctx, 'Reconversion: war orders end, work changes', 28, 40, seg(p, 0, 0.08), 19, BRASS);

    // war orders bar shrinking
    const shrink = seg(p, 0.12, 0.45);
    const barH = 120 * (1 - shrink * 0.85);
    ctx.fillStyle = RUST;
    ctx.fillRect(90, 210 - barH, 70, barH);
    label(ctx, 'government', 80, 232, seg(p, 0.1, 0.18), 13, DIM);
    label(ctx, 'war orders', 84, 250, seg(p, 0.1, 0.18), 13, DIM);

    // arrow
    if (p > 0.4) {
      ctx.strokeStyle = BRASS;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(180, 160);
      ctx.lineTo(250, 160);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(250, 160);
      ctx.lineTo(240, 153);
      ctx.lineTo(240, 167);
      ctx.closePath();
      ctx.fillStyle = BRASS;
      ctx.fill();
    }

    // workers: some move to a new column, some stand apart
    const move = seg(p, 0.45, 0.8);
    for (let i = 0; i < 10; i++) {
      const stays = i < 6;
      const baseX = 285 + (i % 5) * 30;
      const baseY = 120 + Math.floor(i / 5) * 46;
      const tx = stays ? baseX + move * 120 : baseX + move * 10;
      ctx.fillStyle = stays ? GREEN : DIM;
      ctx.globalAlpha = p > 0.45 ? 1 : 0;
      ctx.fillRect(tx, baseY, 12, 26);
      ctx.fillRect(tx + 2, baseY - 10, 8, 8);
      ctx.globalAlpha = 1;
    }
    label(ctx, 'new civilian jobs', 404, 108, seg(p, 0.66, 0.78), 14, GREEN);
    label(ctx, 'out of work', 286, 108, seg(p, 0.66, 0.78), 14, DIM);
    label(
      ctx,
      'Effects differed by industry and by gender — not everyone moved across.',
      28,
      280,
      seg(p, 0.84, 0.95),
      15,
    );
    return;
  }

  // recession
  label(ctx, 'Tighter credit meets falling demand, 1920–21', 28, 40, seg(p, 0, 0.08), 19, BRASS);

  // Fed dial turning up
  const dial = seg(p, 0.1, 0.4);
  ctx.strokeStyle = DIM;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(130, 160, 52, Math.PI, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = RUST;
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(130, 160, 52, Math.PI, Math.PI + Math.PI * dial);
  ctx.stroke();
  ctx.strokeStyle = INK;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(130, 160);
  const a = Math.PI + Math.PI * dial;
  ctx.lineTo(130 + Math.cos(a) * 44, 160 + Math.sin(a) * 44);
  ctx.stroke();
  label(ctx, 'discount rate ↑', 78, 196, seg(p, 0.18, 0.3), 15, RUST);

  // job openings column collapsing
  const drop = seg(p, 0.42, 0.78);
  const colH = 130 * (1 - drop * 0.8);
  ctx.fillStyle = SKY;
  ctx.fillRect(300, 212 - colH, 60, colH);
  ctx.fillStyle = 'rgba(127,168,201,0.22)';
  ctx.fillRect(300, 82, 60, 130);
  label(ctx, 'job openings', 288, 236, seg(p, 0.42, 0.52), 14, DIM);

  // separation note
  if (p > 0.7) {
    ctx.strokeStyle = BRASS;
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.beginPath();
    ctx.moveTo(430, 70);
    ctx.lineTo(430, 250);
    ctx.stroke();
    ctx.setLineDash([]);
    label(ctx, '1920–21', 452, 110, seg(p, 0.72, 0.82), 16, SKY);
    label(ctx, 'recession', 452, 132, seg(p, 0.72, 0.82), 16, SKY);
    label(ctx, '≠ 1929 crash', 452, 170, seg(p, 0.82, 0.92), 16, RUST);
    label(ctx, '≠ Depression', 452, 192, seg(p, 0.86, 0.96), 16, RUST);
  }
  label(ctx, 'A separate, earlier downturn — then recovery.', 28, 280, seg(p, 0.9, 1), 15);
}
