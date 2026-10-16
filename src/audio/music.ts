/**
 * music.ts — background music for the museum.
 *
 * If `public/media/music/background.mp3` (or .m4a / .ogg / .wav) exists, that
 * file loops quietly. Otherwise an original 1920s-style stride-piano tune is
 * played, synthesised live with the Web Audio API (so the site needs no audio
 * file to have music).
 *
 * Music is OFF by default. Browsers only allow audio after a click or key
 * press, so a saved "music on" preference waits for the visitor's first input.
 * It quiets while narration plays and pauses while a film is open.
 */

const FILE_CANDIDATES = ['mp3', 'm4a', 'ogg', 'wav'].map((e) => `media/music/background.${e}`);
const FILE_VOLUME = 0.32;
const SYNTH_LEVEL = 0.55;

/* ------------------------------------------------------------- the tune */
// Swung stride piano at 104 bpm: bass on beats 1 and 3, chords on 2 and 4,
// a melody in swung eighths on top. 16 bars, about 37 seconds per loop.
const BPM = 104;
const BEAT = 60 / BPM;

type Chord = { bass: [number, number]; voicing: number[] };
const CH: Record<string, Chord> = {
  C: { bass: [36, 43], voicing: [60, 64, 67] },
  C7: { bass: [36, 43], voicing: [58, 64, 67] },
  F: { bass: [41, 36], voicing: [57, 60, 65] },
  Fm: { bass: [41, 36], voicing: [56, 60, 65] },
  A7: { bass: [45, 40], voicing: [57, 61, 67] },
  D7: { bass: [38, 45], voicing: [54, 57, 60] },
  G7: { bass: [43, 38], voicing: [53, 59, 62] },
};

// Each bar: chord for beats 1–2, chord for beats 3–4, then melody as
// [midi, length in swung eighths] (0 = rest). Every bar totals 8 eighths.
const BARS: Array<[string, string, Array<[number, number]>]> = [
  ['C', 'C', [[76, 2], [79, 1], [76, 1], [72, 2], [74, 1], [76, 1]]],
  ['C', 'C', [[79, 3], [76, 1], [79, 4]]],
  ['F', 'F', [[81, 2], [77, 1], [81, 1], [84, 2], [81, 1], [77, 1]]],
  ['F', 'F', [[79, 2], [77, 1], [76, 1], [77, 4]]],
  ['C', 'C', [[76, 2], [72, 1], [76, 1], [79, 2], [76, 1], [72, 1]]],
  ['A7', 'A7', [[73, 2], [76, 1], [79, 1], [81, 3], [0, 1]]],
  ['D7', 'D7', [[78, 2], [81, 1], [78, 1], [74, 2], [76, 1], [78, 1]]],
  ['G7', 'G7', [[79, 2], [77, 1], [74, 1], [71, 2], [74, 1], [77, 1]]],
  ['C', 'C', [[76, 2], [79, 1], [76, 1], [72, 2], [74, 1], [76, 1]]],
  ['C7', 'C7', [[79, 2], [82, 1], [79, 1], [76, 4]]],
  ['F', 'F', [[77, 2], [81, 1], [84, 1], [81, 2], [77, 2]]],
  ['Fm', 'Fm', [[80, 2], [77, 1], [72, 1], [80, 3], [0, 1]]],
  ['C', 'C', [[79, 2], [76, 1], [72, 1], [76, 2], [79, 2]]],
  ['A7', 'A7', [[81, 2], [79, 1], [76, 1], [73, 4]]],
  ['D7', 'G7', [[74, 1], [78, 1], [81, 1], [84, 1], [83, 1], [81, 1], [79, 1], [77, 1]]],
  ['C', 'C', [[76, 2], [74, 1], [72, 5]]],
];
const BAR_LEN = BEAT * 4;

/** Start time (seconds from bar start) of swung eighth number i (0–8). */
const eighthAt = (i: number) => Math.floor(i / 2) * BEAT + (i % 2 ? BEAT * (2 / 3) : 0);
const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12);

class BackgroundMusic {
  private wanted = false;
  private ducked = false;
  private paused = false;
  private volume = 0.5;
  private gestureHooked = false;

  // file playback
  private probe: Promise<string | null> | null = null;
  private el: HTMLAudioElement | null = null;

  // synth playback
  private ctx: AudioContext | null = null;
  private out: GainNode | null = null;
  private timer: number | null = null;
  private loopStart = 0;
  private nextBar = 0;

  /** Turns music on or off (the visitor's toggle). */
  setEnabled(on: boolean) {
    this.wanted = on;
    if (on) this.start();
    else this.stop();
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    this.applyLevel();
  }

  /** Quieter while narration plays. */
  duck(on: boolean) {
    this.ducked = on;
    this.applyLevel();
  }

  /** Silent while a film with its own soundtrack is open. */
  pause(on: boolean) {
    this.paused = on;
    this.applyLevel();
    if (this.el) {
      if (on) this.el.pause();
      else if (this.wanted) void this.el.play().catch(() => this.waitForGesture());
    }
  }

  private level() {
    if (!this.wanted || this.paused) return 0;
    return (0.4 + this.volume * 1.2) * (this.ducked ? 0.25 : 1);
  }

  private applyLevel() {
    const l = this.level();
    if (this.el) this.el.volume = Math.min(1, FILE_VOLUME * l);
    if (this.out && this.ctx) {
      this.out.gain.setTargetAtTime(SYNTH_LEVEL * 0.1 * l, this.ctx.currentTime, 0.25);
    }
  }

  private findFile(): Promise<string | null> {
    if (!this.probe) {
      this.probe = (async () => {
        for (const url of FILE_CANDIDATES) {
          try {
            const r = await fetch(url, { method: 'HEAD' });
            const type = r.headers.get('content-type') ?? '';
            if (r.ok && !type.includes('text/html')) return url;
          } catch {
            /* try the next one */
          }
        }
        return null;
      })();
    }
    return this.probe;
  }

  private async start() {
    const file = await this.findFile();
    if (!this.wanted) return;
    if (file) {
      if (!this.el) {
        this.el = new Audio(file);
        this.el.loop = true;
        this.el.preload = 'auto';
      }
      this.applyLevel();
      if (!this.paused) void this.el.play().catch(() => this.waitForGesture());
      return;
    }
    this.startSynth();
  }

  private stop() {
    this.el?.pause();
    if (this.timer !== null) {
      window.clearInterval(this.timer);
      this.timer = null;
    }
    if (this.out && this.ctx) this.out.gain.setTargetAtTime(0, this.ctx.currentTime, 0.15);
    if (this.ctx && this.ctx.state === 'running') {
      const ctx = this.ctx;
      window.setTimeout(() => {
        if (!this.wanted) void ctx.suspend();
      }, 600);
    }
  }

  /** Browsers block audio until the visitor interacts; retry on the first input. */
  private waitForGesture() {
    if (this.gestureHooked) return;
    this.gestureHooked = true;
    const go = () => {
      window.removeEventListener('pointerdown', go, true);
      window.removeEventListener('keydown', go, true);
      this.gestureHooked = false;
      if (!this.wanted) return;
      // Resume inside the click itself, which is when browsers allow it.
      if (this.ctx && this.ctx.state !== 'running') void this.ctx.resume();
      void this.start();
    };
    window.addEventListener('pointerdown', go, true);
    window.addEventListener('keydown', go, true);
  }

  /* ------------------------------------------------------------ synth */
  private startSynth() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AC: typeof AudioContext | undefined =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return;
      try {
        this.ctx = new AC();
      } catch {
        return;
      }
      const tone = this.ctx.createBiquadFilter(); // soften it, like an old record
      tone.type = 'lowpass';
      tone.frequency.value = 2600;
      this.out = this.ctx.createGain();
      this.out.gain.value = 0;
      this.out.connect(tone);
      tone.connect(this.ctx.destination);
    }
    const ctx = this.ctx;
    // Before the visitor's first click the browser keeps audio suspended and
    // resume() just waits, so listen for that click straight away.
    if (ctx.state !== 'running') this.waitForGesture();
    const resume = ctx.state === 'running' ? Promise.resolve() : ctx.resume();
    void resume.then(() => {
      if (ctx.state !== 'running') {
        this.waitForGesture();
        return;
      }
      if (!this.wanted) return;
      this.applyLevel();
      if (this.timer === null) {
        this.loopStart = ctx.currentTime + 0.15;
        this.nextBar = 0;
        this.timer = window.setInterval(() => this.schedule(), 120);
        this.schedule();
      }
    });
  }

  /** Queues every bar that starts within the next 1.2 seconds. */
  private schedule() {
    const ctx = this.ctx;
    if (!ctx || !this.out) return;
    // If the tab was hidden and timers stalled, skip ahead instead of bursting notes.
    const nowBar = Math.floor((ctx.currentTime - this.loopStart) / BAR_LEN);
    if (nowBar > this.nextBar + 1) this.nextBar = nowBar;
    while (this.loopStart + this.nextBar * BAR_LEN < ctx.currentTime + 1.2) {
      this.playBar(this.nextBar, this.loopStart + this.nextBar * BAR_LEN);
      this.nextBar++;
    }
  }

  private playBar(n: number, t0: number) {
    const [first, second, melody] = BARS[n % BARS.length];
    const pass = Math.floor(n / BARS.length) % 2; // every other loop, melody drops an octave
    for (let beat = 0; beat < 4; beat++) {
      const chord = CH[beat < 2 ? first : second];
      const t = t0 + beat * BEAT;
      if (beat % 2 === 0) {
        this.note(hz(chord.bass[beat === 0 ? 0 : 1]), t, BEAT * 0.9, 0.95, 'bass');
      } else {
        chord.voicing.forEach((m) => this.note(hz(m), t, BEAT * 0.55, 0.32, 'chord'));
      }
    }
    let i = 0;
    for (const [midi, len] of melody) {
      if (midi > 0) {
        const start = t0 + eighthAt(i);
        const end = t0 + eighthAt(i + len);
        this.note(hz(midi - (pass ? 12 : 0)), start, Math.max(0.12, end - start), 0.6, 'lead');
      }
      i += len;
    }
  }

  /** A soft, piano-like note: quick attack, natural decay. */
  private note(freq: number, t: number, dur: number, peak: number, voice: 'bass' | 'chord' | 'lead') {
    const ctx = this.ctx!;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.008);
    g.gain.exponentialRampToValueAtTime(peak * 0.35, t + Math.min(dur, 0.25));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.18);
    g.connect(this.out!);

    const body = ctx.createOscillator();
    body.type = 'triangle';
    body.frequency.value = freq;
    body.connect(g);

    const shine = ctx.createOscillator(); // a little brightness on the attack
    shine.type = 'sine';
    shine.frequency.value = freq * 2;
    const sg = ctx.createGain();
    sg.gain.value = voice === 'bass' ? 0.15 : 0.3;
    shine.connect(sg);
    sg.connect(g);

    body.start(t);
    shine.start(t);
    body.stop(t + dur + 0.25);
    shine.stop(t + dur + 0.25);
  }
}

export const music = new BackgroundMusic();
