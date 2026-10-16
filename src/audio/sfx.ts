/**
 * sfx.ts — original procedural sound design, generated with the Web Audio API.
 *
 * Every sound here is synthesised in code. None of it is historical audio, and
 * the museum labels it as "modern illustrative sound design" wherever it plays.
 * The context is only created after a user gesture, and sound defaults to OFF.
 */

export type SfxName =
  | 'click'
  | 'chime'
  | 'wrong'
  | 'door'
  | 'stamp'
  | 'typewriter'
  | 'conveyor'
  | 'register'
  | 'ticker'
  | 'page';

class Sfx {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private enabled = false;
  private volume = 0.5;
  private ducked = false;

  setEnabled(on: boolean) {
    this.enabled = on;
    if (on) this.ensure();
    if (this.master) this.master.gain.value = on ? this.volume * (this.ducked ? 0.15 : 1) : 0;
  }

  setVolume(v: number) {
    this.volume = Math.max(0, Math.min(1, v));
    if (this.master && this.enabled) {
      this.master.gain.value = this.volume * (this.ducked ? 0.15 : 1);
    }
  }

  /** Lowers effects while narration is playing. */
  duck(on: boolean) {
    this.ducked = on;
    if (this.master && this.enabled) {
      this.master.gain.value = this.volume * (on ? 0.15 : 1);
    }
  }

  private ensure(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AC: typeof AudioContext | undefined =
        window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      try {
        this.ctx = new AC();
        this.master = this.ctx.createGain();
        this.master.gain.value = this.enabled ? this.volume : 0;
        this.master.connect(this.ctx.destination);
      } catch {
        return null;
      }
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  private tone(
    freq: number,
    start: number,
    dur: number,
    type: OscillatorType,
    peak: number,
  ) {
    const ctx = this.ctx!;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
    g.gain.setValueAtTime(0.0001, ctx.currentTime + start);
    g.gain.exponentialRampToValueAtTime(peak, ctx.currentTime + start + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
    osc.connect(g);
    g.connect(this.master!);
    osc.start(ctx.currentTime + start);
    osc.stop(ctx.currentTime + start + dur + 0.02);
  }

  private noise(start: number, dur: number, peak: number, filterHz: number) {
    const ctx = this.ctx!;
    const frames = Math.max(1, Math.floor(ctx.sampleRate * dur));
    const buf = ctx.createBuffer(1, frames, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < frames; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / frames);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = filterHz;
    const g = ctx.createGain();
    g.gain.value = peak;
    src.connect(filter);
    filter.connect(g);
    g.connect(this.master!);
    src.start(ctx.currentTime + start);
  }

  play(name: SfxName) {
    if (!this.enabled) return;
    const ctx = this.ensure();
    if (!ctx || !this.master) return;
    try {
      switch (name) {
        case 'click':
          this.tone(660, 0, 0.06, 'square', 0.06);
          break;
        case 'chime': // 8-bit style correct-answer arpeggio
          this.tone(523.25, 0, 0.12, 'square', 0.08);
          this.tone(659.25, 0.08, 0.12, 'square', 0.08);
          this.tone(783.99, 0.16, 0.22, 'square', 0.09);
          break;
        case 'wrong':
          this.tone(233.08, 0, 0.16, 'triangle', 0.07);
          this.tone(174.61, 0.1, 0.22, 'triangle', 0.07);
          break;
        case 'door':
          this.noise(0, 0.28, 0.07, 320);
          this.tone(110, 0.02, 0.22, 'sine', 0.05);
          break;
        case 'stamp':
          this.noise(0, 0.1, 0.12, 900);
          this.tone(180, 0.01, 0.14, 'square', 0.07);
          this.tone(880, 0.14, 0.2, 'square', 0.05);
          break;
        case 'typewriter':
          this.noise(0, 0.05, 0.1, 2200);
          this.tone(1400, 0, 0.03, 'square', 0.04);
          break;
        case 'conveyor':
          this.noise(0, 0.5, 0.045, 180);
          break;
        case 'register':
          this.tone(1318.51, 0, 0.1, 'square', 0.07);
          this.tone(1760, 0.06, 0.26, 'square', 0.06);
          this.noise(0, 0.08, 0.06, 2600);
          break;
        case 'ticker':
          this.noise(0, 0.04, 0.09, 3000);
          break;
        case 'page':
          this.noise(0, 0.22, 0.05, 1400);
          break;
      }
    } catch {
      /* audio is decoration — never let it break the museum */
    }
  }
}

export const sfx = new Sfx();
